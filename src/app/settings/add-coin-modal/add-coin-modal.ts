import {
  Component,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  NgModule,
  OnInit
} from "@angular/core";
import { Http } from "@angular/http";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { CoinInfo } from "src/app/models/coin-info";

@Component({
  selector: "add-coin-modal-content",
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
              <span class="coin-container">
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
        (click)="modal.close('Save click')"
      >
        Save
      </button>
    </div>
  `
})
export class AddCoinModalContent {
  coins: CoinInfo[];
  selectedCoins: CoinInfo[];
  constructor(public modal: NgbActiveModal) {}
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
  modal: NgbModalRef;
  MODALS = {
    content: AddCoinModalContent
  };

  constructor(private modalService: NgbModal, private http: Http) {}

  ngOnInit(): void {
    this.getCoinList().then(result => {
      this.coins = result;
      console.log(result);
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
