import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { CoinsSummary } from "../../models/coins-summary";
import { CoinInfo } from "../../models/coin-info";
import { from, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { WebStorageService, SESSION_STORAGE } from "angular-webstorage-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserInfoService } from "src/app/services/user.info.service";
import { ToastService } from "../../services/toast-service";
import { HttpClient } from "@angular/common/http";
import { Link } from "src/app/models/Link";
import { LinkSection } from "src/app/models/link-section";
import { _ } from "underscore";
import { Portfolio } from "src/app/models/portfolio/portfolio";
import { PortfolioService } from "src/app/services/portfolio.service";
import { CurrencyInfo } from "src/app/models/currency-info";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { Route } from "@angular/compiler/src/core";
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
  currency: CurrencyInfo;
  currencyChangeSubscription: Subscription;

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    public toastService: ToastService,
    private portfolioService: PortfolioService,
    private appSettingsService: AppSettingsService,
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
    this.portfolios.push(newPortfolio);
    this.portfolios = [].concat(this.portfolios);
    this.cdr.detectChanges();
  };

  getPortfolios() {
    this.userService.getPortfolios(this.user).subscribe(
      result => {
        this.portfolios = result;
        for (let i = 0; i < this.portfolios.length; i++) {
          this.portfolioService
            .getSummary(this.portfolios[i], this.currency.value)
            .then(result => {
              this.portfolios[i].summary = result;
            });
        }
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
}
