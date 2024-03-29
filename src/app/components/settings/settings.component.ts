import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import { CoinsSummary } from "../../models/coins-summary";
import { CoinInfo } from "../../models/coin-info";
import { from, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { StorageService, SESSION_STORAGE } from "ngx-webstorage-service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { UserInfoService } from "src/app/services/user.info.service";
import { ToastService } from "../../services/toast-service";
import { HttpClient } from "@angular/common/http";
import { Link } from "src/app/models/link";
import { LinkSection } from "src/app/models/link-section";
import { _ } from "underscore";
import { Portfolio } from "src/app/models/portfolio/portfolio";
import { PortfolioService } from "src/app/services/portfolio.service";
import { CurrencyInfo } from "src/app/models/currency-info";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { Route } from "@angular/compiler/src/core";
import { DeleteConfirmationModal } from "../common/delete-confirmation-modal/delete-confirmation-modal";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  providers: []
})
export class SettingsComponent implements OnInit {
  user: User;
  newsArticles: Link[];
  academyLinks: Link[];
  portfolios: Portfolio[];
  visiblePortfolios: Portfolio[];
  visiblePortfoliosStartIndex = 0;
  visiblePortfoliosEndIndex = 4;
  currency: CurrencyInfo;
  currencyChangeSubscription: Subscription;
  modal: NgbModalRef;

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private userService: UserInfoService,
    public toastService: ToastService,
    private portfolioService: PortfolioService,
    private appSettingsService: AppSettingsService,
    private modalService: NgbModal,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient
  ) {
    this.toastService = toastService;
    this.academyLinks = [];
    this.newsArticles = [];
    this.portfolios = [];
    this.currencyChangeSubscription = appSettingsService.currencyChange$.subscribe(
      currency => {
        this.currency = currency;
      }
    );
  }

  ngOnInit() {
    if (this.storage.get("currentUser")) {
      this.user = JSON.parse(this.storage.get("currentUser")).user;
      const savedLinks = this.user.saved_links;
      this.currency = this.appSettingsService.getCurrency();
      this.getPortfolios();
      savedLinks.forEach(link => {
        if (link.section === LinkSection.NEWS) {
          this.newsArticles.push(link);
        }
        if (link.section === LinkSection.ACADEMY) {
          this.academyLinks.push(link);
        }
      });
    }
  }

  removeLink(link: Link) {
    this.user.saved_links = _.filter(this.user.saved_links, savedLink => {
      return link.url !== savedLink.url;
    });
    if (link.section === LinkSection.NEWS) {
      this.newsArticles = _.filter(this.newsArticles, savedLink => {
        return link.url !== savedLink.url;
      });
    }
    if (link.section === LinkSection.ACADEMY) {
      this.academyLinks = _.filter(this.academyLinks, savedLink => {
        return link.url !== savedLink.url;
      });
    }
    this.userService.updateLinks(this.user);
  }

  update() {
    this.userService.updateSettings(this.user);
  }

  goToPortfolioPage(portfolio: Portfolio) {
    this.portfolioService.selectPortfolio(portfolio);
    this.router.navigate(["portfolio", portfolio._id]);
  }

  portfolioCreateCb = (newPortfolio: Portfolio) => {
    if (!this.portfolios) {
      this.portfolios = [];
    }
    this.portfolios.splice(0, 0, newPortfolio);
    this.visiblePortfolios = this.portfolios.slice(
      this.visiblePortfoliosStartIndex,
      this.visiblePortfoliosEndIndex
    );

    this.updatePortfolioSummaries();
    this.cdr.detectChanges();
  };

  getPortfolios() {
    this.userService.getPortfolios(this.user).subscribe(
      result => {
        //sort portfolios by most recent
        this.portfolios = result.sort((a, b) => {
          return a.startDate.toString() > b.startDate.toString() ? -1 : 1;
        });
        this.visiblePortfolios = this.portfolios.slice(
          this.visiblePortfoliosStartIndex,
          this.visiblePortfoliosEndIndex
        );
        this.updatePortfolioSummaries();
      },
      err => {
        if (err.status !== 404) {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 3500
          });
        }
      }
    );
  }

  deletePortfolio(portfolioId: string) {
    this.portfolioService.deletePortfolioById(portfolioId).subscribe(
      result => {
        this.toastService.show("Portfolio deleted correctly.", {
          classname: "bg-success text-light",
          delay: 3500
        });
        this.portfolios = this.portfolios.filter(p => p._id !== portfolioId);
        this.visiblePortfolios = this.portfolios.slice(
          this.visiblePortfoliosStartIndex,
          this.visiblePortfoliosEndIndex
        );
        this.cdr.detectChanges();
      },
      err => {
        this.toastService.show("Error while deleting portfolio: " + err.body, {
          classname: "bg-danger text-light",
          delay: 3500
        });
      }
    );
  }

  shiftVisiblePortfoliosRigtht = function() {
    if (this.portfolios.length > 4) {
      if (this.visiblePortfoliosStartIndex + 4 < this.portfolios.length) {
        this.visiblePortfoliosStartIndex = this.visiblePortfoliosStartIndex += 4;
        if (this.visiblePortfoliosEndIndex + 4 > this.portfolios.length - 1) {
          this.visiblePortfoliosEndIndex = this.portfolios.length;
        } else {
          this.visiblePortfoliosEndIndex += 4;
        }
      }
    } else {
      this.visiblePortfoliosStartIndex = 0;
      this.visiblePortfoliosEndIndex = 4;
    }

    this.visiblePortfolios = this.portfolios.slice(
      this.visiblePortfoliosStartIndex,
      this.visiblePortfoliosEndIndex
    );
  };

  shiftVisiblePortfoliosLeft = function() {


    if (this.visiblePortfoliosStartIndex - 4 !== 0) {
      if (this.visiblePortfoliosEndIndex === this.portfolios.length) {
        this.visiblePortfoliosEndIndex -= this.visiblePortfoliosEndIndex - this.visiblePortfoliosStartIndex;

      } else {
        if (this.visiblePortfoliosEndIndex - 4 >= 4) {
          this.visiblePortfoliosEndIndex -= 4;
        } else {
          this.visiblePortfoliosEndIndex = 4;
        }
      }
    } else {
      this.visiblePortfoliosEndIndex = 4;
    }

    if (this.visiblePortfoliosStartIndex - 4 >= 0) {
      this.visiblePortfoliosStartIndex -= 4;
    } else {
      this.visiblePortfoliosStartIndex = 0;
    }

    this.visiblePortfolios = this.portfolios.slice(
      this.visiblePortfoliosStartIndex,
      this.visiblePortfoliosEndIndex
    );
  };

  updatePortfolioSummaries() {
    for (let i = 0; i < this.portfolios.length; i++) {
      this.portfolioService
        .getSummary(this.portfolios[i], this.currency.value)
        .then(result => {
          this.portfolios[i].summary = result;
        });
    }
  }
}
