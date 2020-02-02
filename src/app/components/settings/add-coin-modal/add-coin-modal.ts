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

@Component({
  selector: "add-coin-modal-content",
  providers: [UserInfoService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Add Coins</h4>
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
          <div class="row">
            <div class="col-6 col-sm-3" *ngFor="let coin of coins">
              <span
                class="coin-container"
                [ngClass]="{ selected: coin.selected }"
                (click)="toggleCoinSelection(coin)"
              >
                <coin name="{{ coin.name }}" iconId="{{ coin.queryId }}"></coin>
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-dark"
        (click)="saveBookmarks()"
      >
        Save
      </button>
    </div>
  `
})
export class AddCoinModalContent implements OnInit {
  coins: CoinInfo[];
  selectedCoins: CoinInfo[];
  user: User;

  constructor(
    public modal: NgbActiveModal,
    private http: Http,
    public toastService: ToastService,
    private userService: UserInfoService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  ngOnInit() {
    this.selectedCoins = [];
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

  saveBookmarks() {
    let newBookmarks = [];
    for (let coin of this.selectedCoins) {
      newBookmarks.push(coin.queryId);
    }
    this.user.bookmarked_coins = newBookmarks;
    this.http
      .post("http://localhost:8084/user/update/coins", this.user)
      .subscribe(
        result => {
          this.toastService.show("User bookmarks successfully updated", {
            classname: "bg-success text-light",
            delay: 2000
          });
          this.sessionStorage.set(
            "currentUser",
            JSON.stringify({ user: this.user })
          );
        },
        err => {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 3500
          });
        }
      );
  }
}

@Component({
  selector: "add-coin-modal",
  templateUrl: "add-coin-template.html",
  styleUrls: ["./add-coin-modal.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddCoinModal implements OnInit {
  closeResult: string;
  coins: CoinInfo[];
  @Input() user: User;
  modal: NgbModalRef;
  MODALS = {
    content: AddCoinModalContent
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
      .get("http://localhost:8081/coinslist")
      .toPromise();
    const response = result.json();
    return response.coins;
  }
}
