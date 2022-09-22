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
import { Portfolio } from "src/app/models/portfolio/portfolio";
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
import { Purchase } from "src/app/models/purchase";
import { CurrencyInfo } from "src/app/models/currency-info";
import { Subscription } from "rxjs/internal/Subscription";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { stringify } from "querystring";
import { MarketData } from "src/app/models/historical-market-data";

@Component({
  selector: "select-coin-modal-content",
  providers: [UserInfoService, CoinInfoService, AppSettingsService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">
        Portfolio Info
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
          <div class="container-fluid mt-2 mb-3">
            <div class="row mt-2">
              <div class="col-12 col-sm-4">
                <label for="coin-units" class="font-weight-bold"
                  >Portfolio Name</label
                >
              </div>
              <div class="col-12 col-sm-8">
                <input
                  class="form-control"
                  type="text"
                  name="portfolio-name"
                  placeholder="Name"
                  [(ngModel)]="portfolio.label"
                />
              </div>
            </div>
            <hr />
            <div
              class="row text-center"
              *ngIf="portfolio.startingCoinValues.keys()"
            >
              <div
                class="col-6 col-sm-3 col-md-2"
                *ngFor="let coin of portfolio.startingCoinValues | keyvalue"
              >
                <span>
                  <coin
                    iconId="{{ coin.key }}"
                    [quantity]="coin.value.quantity"
                  ></coin>
                </span>
              </div>
            </div>
          </div>

          <div class="container-fluid mt-4">
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
                  placeholder="Example: bitcoin"
                  [(ngModel)]="currentlySelectedCoin"
                  (ngModelChange)="coinSelected($event)"
                  [ngbTypeahead]="search"
                  [inputFormatter]="formatter"
                  [resultFormatter]="formatter"
                  [editable]="false"
                />
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-12 col-sm-4">
                <label for="coin-units" class="font-weight-bold">Money</label>
              </div>
              <div class="col-12 col-sm-8">
                <input
                  class="form-control"
                  type="number"
                  name="coin-purchase-val"
                  placeholder="{{ currency.label }}"
                  [(ngModel)]="purchaseVal"
                  (change)="updateQuantity(purchaseVal)"
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
                  (change)="updateMonetaryVal(coinQuantity)"
                />
              </div>
            </div>

            <div class="row mt-5">
              <div class="col-12 text-center">
                <button class="btn btn-default btn-primary" (click)="addCoin()">
                  <span class="font-weight-bold">Add To Portfolio</span>
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
        Create Portfolio
      </button>
    </div>
  `
})
export class SelectCoinModalContent implements OnInit {
  currencyChangeSubscription: Subscription;
  coins: CoinInfo[];
  selectedCoins: CoinInfo[];
  currentlySelectedCoin: CoinInfo;
  currentlySelectedMarketData: MarketData;
  coinQuantity: number;
  purchaseVal: number;
  user: User;
  portfolio: Portfolio;
  currency: CurrencyInfo;
  portfolioCreationCallback: (Portfolio) => void;

  formatter = (coin: CoinInfo) => coin.id;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.coins && this.coins.length !== 0
          ? this.coins
              .filter(v => v.id.indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
          : []
      )
    );

  constructor(
    public modal: NgbActiveModal,
    private http: HttpClient,
    public toastService: ToastService,
    private userService: UserInfoService,
    private coinInfoService: CoinInfoService,
    private appSettingsService: AppSettingsService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {
    this.currency = this.appSettingsService.getCurrency();
  }

  ngOnInit() {
    this.selectedCoins = [];
    this.portfolio = new Portfolio();
    this.currencyChangeSubscription = this.appSettingsService.currencyChange$.subscribe(
      currency => {
        this.currency = currency;
      }
    );
    this.currency = this.appSettingsService.getCurrency();
  }

  coinSelected(coin: CoinInfo) {
    if (coin) {
      this.coinInfoService.getCoinInfo(coin.id).subscribe(
        result => {
          const marketData = result.data.market_data;
          coin.price = marketData.current_price[this.currency.value];
          this.coinQuantity = null;
          this.purchaseVal = null;
        },
        err => {}
      );
    }
  }

  addCoin() {
    const coinId = this.currentlySelectedCoin.id;

    // I set the value as property because the map entries are ignored when sent to backend

    if (this.portfolio.startingCoinValues.has(coinId)) {
      this.portfolio.startingCoinValues.get(
        coinId
      ).quantity += this.coinQuantity;
      this.portfolio.startingCoinValues[coinId].quantity += this.coinQuantity;
    } else {
      const purchase = new Purchase();
      purchase.quantity = this.coinQuantity;
      purchase.currency = this.currency.value;
      purchase.price = new Price();
      purchase.price[this.currency.value] = this.currentlySelectedCoin.price;
      this.portfolio.startingCoinValues[coinId] = purchase;
      this.portfolio.startingCoinValues.set(coinId, purchase);
    }
    this.selectedCoins.push(this.currentlySelectedCoin);
  }

  updateQuantity(monetaryVal: number) {
    if (this.currentlySelectedCoin && this.currentlySelectedCoin.id) {
      this.coinQuantity = this.monetaryValToQuantity(
        monetaryVal,
        this.currentlySelectedCoin
      );
    }
  }

  updateMonetaryVal(quantity: number) {
    if (this.currentlySelectedCoin && this.currentlySelectedCoin.id) {
      this.purchaseVal = this.quantityToMonetaryVal(
        quantity,
        this.currentlySelectedCoin
      );
    }
  }

  quantityToMonetaryVal(quantity: number, coinInfo: CoinInfo) {
    return coinInfo.price * quantity;
  }

  monetaryValToQuantity(val: number, coinInfo: CoinInfo) {
    return val / coinInfo.price;
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
          for (const key in marketData) {
            if (
              marketData.hasOwnProperty(key) &&
              this.portfolio.startingCoinValues[
                coinData.id
              ].price.hasOwnProperty(key)
            ) {
              this.portfolio.startingCoinValues[coinData.id].price[key] =
                marketData[key];
            }
          }
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
              if (this.portfolioCreationCallback) {
                this.portfolioCreationCallback(result);
              }
              this.modal.close("success");
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
  @Input() portfolioCreationCallback: (Portfolio) => void;

  constructor(
    private modalService: NgbModal,
    public toastService: ToastService,
    private coinInfoService: CoinInfoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.coinInfoService.getCustomCoinsList().subscribe(result => {
      this.coins = result.data;
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
    this.modal.componentInstance.portfolioCreationCallback = this.portfolioCreationCallback;
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
}
