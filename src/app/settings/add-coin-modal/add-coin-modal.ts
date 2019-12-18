import { Component, Input, ViewEncapsulation } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "add-coin-modal",
  templateUrl: "add-coin-template.html",
  styleUrls: ["./add-coin-modal.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddCoinModal {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "add-coin-modal",
        container: "#add-coin-modal-container"
      })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
