import {
  Component,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  NgModule,
  OnInit,
  Inject
} from "@angular/core";
import { Http } from "@angular/http";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { CoinInfo } from "src/app/models/coin-info";
import { _ } from "underscore";
import { User } from "src/app/models/user";
import { ToastService } from "../../../services/toast-service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { UserInfoService } from "src/app/services/user.info.service";
import { environment } from "src/environments/environment";
import { Portfolio } from "src/app/models/portfolio";
import { HttpClient } from "@angular/common/http";
import { CoinInfoService } from "src/app/services/coin.info.service";
import { Price } from "src/app/models/price";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter
} from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";

@Component({
  selector: "select-coin-modal-content",
  providers: [UserInfoService, CoinInfoService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">
        Select coins
      </h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group">
          <!--<div class="row">
            <div class="col-6 col-sm-3" *ngFor="let coin of coins">
              <span
                class="coin-container"
                [ngClass]="{ selected: coin.selected }"
                (click)="toggleCoinSelection(coin)"
              >
                <coin name="{{ coin.name }}" iconId="{{ coin.queryId }}"></coin>
              </span>
            </div>
          </div>-->

          <div class="container-fluid mt-3">
            <div class="row">
              <div class="col-12 col-sm-4">
                <label class="font-weight-bold" for="selected-coin"
                  >Coin id</label
                >
              </div>
              <div class="col-12 col-sm-8">
                <input
                  name="selected-coin"
                  id="typeahead-prevent-manual-entry"
                  type="text"
                  class="form-control"
                  [(ngModel)]="currentlySelectedCoin"
                  [ngbTypeahead]="search"
                  [inputFormatter]="formatter"
                  [resultFormatter]="formatter"
                  [editable]="false"
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12 col-sm-4">
                <label for="coin-units" class="font-weight-bold"
                  >Quantity</label
                >
              </div>
              <div class="col-12 col-sm-8">
                <input
                  class="form-control"
                  type="number"
                  name="coin-units"
                  placeholder="Coin units"
                  [(ngModel)]="coinQuantity"
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <button class="btn btn-default btn-primary">
                  <span>Add To Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-dark"
        (click)="createPortfolio()"
      >
        Confirm
      </button>
    </div>
  `
})
export class SelectCoinModalContent implements OnInit {
  coins: CoinInfo[];
  selectedCoins: CoinInfo[];
  currentlySelectedCoin: CoinInfo;
  coinQuantity: number;
  user: User;
  portfolio: Portfolio;

  formatter = (coin: CoinInfo) => coin.queryId;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.coins
              .filter(v => v.queryId.indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  constructor(
    public modal: NgbActiveModal,
    private http: HttpClient,
    public toastService: ToastService,
    private userService: UserInfoService,
    private coinInfoService: CoinInfoService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  ngOnInit() {
    this.selectedCoins = [];
    this.portfolio = new Portfolio();
    for (let coinId of this.user.bookmarked_coins) {
      for (let coin of this.coins) {
        if (coinId === coin.queryId) {
          this.selectedCoins.push(coin);
          coin.selected = true;
        }
      }
    }
  }

  toggleCoinSelection(coin) {
    coin.selected = !coin.selected;
    let selectedCoin = _.findWhere(this.selectedCoins, {
      queryId: coin.queryId
    });
    if (!selectedCoin) {
      let coinToAdd = _.findWhere(this.coins, {
        queryId: coin.queryId
      });
      this.selectedCoins.push(coinToAdd);
    } else {
      this.selectedCoins = _.without(
        this.selectedCoins,
        _.findWhere(this.selectedCoins, {
          queryId: coin.queryId
        })
      );
    }
  }

  createPortfolio() {
    this.coinInfoService.getMultipleCoinsInfo(this.selectedCoins).subscribe(
      responseList => {
        for (let response of responseList) {
          const coinData = response.data;
          const marketData = coinData.market_data.current_price;
          const coinPrice = new Price();
          coinPrice.eur = marketData.eur;
          coinPrice.usd = marketData.usd;
          coinPrice.gbp = marketData.gbp;
          coinPrice.cny = marketData.cny;
          this.portfolio.startingCoinValues[coinData.id] = coinPrice;
        }
        this.portfolio.userId = this.user._id;
        this.portfolio.startDate = new Date();

        this.http
          .post(`${environment.baseUrl}:8085/create_portfolio`, this.portfolio)
          .subscribe(
            result => {
              this.toastService.show("Portfolio created", {
                classname: "bg-success text-light",
                delay: 2000
              });
            },
            err => {
              this.toastService.show(err._body, {
                classname: "bg-danger text-light",
                delay: 3500
              });
            }
          );
      },
      err => {
        console.log(err._body);
      }
    );
  }
}

@Component({
  selector: "select-coin-modal",
  templateUrl: "select-coin-template.html",
  styleUrls: ["./select-coin-modal.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SelectCoinModal implements OnInit {
  closeResult: string;
  coins: CoinInfo[];
  @Input() user: User;
  modal: NgbModalRef;
  MODALS = {
    content: SelectCoinModalContent
  };

  constructor(
    private modalService: NgbModal,
    public toastService: ToastService,
    private http: Http
  ) {}

  ngOnInit(): void {
    this.getCoinList().then(result => {
      this.coins = result;
    });
  }

  open() {
    this.modal = this.modalService.open(this.MODALS.content, {
      windowClass: "add-coin-modal"
    });
    this.modal.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.modal.componentInstance.coins = this.coins;
    this.modal.componentInstance.user = this.user;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  async getCoinList(): Promise<CoinInfo[]> {
    let result = await this.http
      .get(`${environment.baseUrl}:8081/coinslist`)
      .toPromise();
    const response = result.json();
    return response.coins;
  }
}
