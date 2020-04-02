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
import { CoinInfoService } from "src/app/services/coin.info.service";
import { Observable } from "rxjs";

@Component({
  selector: "add-coin-modal-content",
  providers: [UserInfoService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">
        Manage bookmarked coins
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
          <div class="row">
            <div class="col-6 col-sm-3" *ngFor="let coin of coins">
              <span
                class="coin-container"
                [ngClass]="{ selected: coin.selected }"
                (click)="toggleCoinSelection(coin)"
              >
                <coin name="{{ coin.name }}" iconId="{{ coin.id }}"></coin>
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
    if (this.user.bookmarked_coins && this.user.bookmarked_coins.length !== 0) {
      for (let coinId of this.user.bookmarked_coins) {
        for (let coin of this.coins) {
          if (coinId === coin.id) {
            this.selectedCoins.push(coin);
            coin.selected = true;
          }
        }
      }
    }
  }

  toggleCoinSelection(coin) {
    coin.selected = !coin.selected;
    let selectedCoin = _.findWhere(this.selectedCoins, {
      id: coin.id
    });
    if (!selectedCoin) {
      let coinToAdd = _.findWhere(this.coins, {
        id: coin.id
      });
      this.selectedCoins.push(coinToAdd);
    } else {
      this.selectedCoins = _.without(
        this.selectedCoins,
        _.findWhere(this.selectedCoins, {
          id: coin.id
        })
      );
    }
  }

  saveBookmarks() {
    let newBookmarks = [];
    for (let coin of this.selectedCoins) {
      newBookmarks.push(coin.id);
    }
    this.user.bookmarked_coins = newBookmarks;
    this.http
      .post(`${environment.baseUrl}:8084/user/update/coins`, this.user)
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
    private coinInfoService: CoinInfoService,
    private http: Http
  ) {}

  ngOnInit(): void {
    this.getCoinList().subscribe(result => {
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

  getCoinList(): Observable<any> {
    return this.coinInfoService.getCustomCoinsList();
  }
}
