import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation
} from "@angular/core";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "delete-confirmation-modal",
  templateUrl: "./delete-confirmation-modal.html",
  styleUrls: ["./delete-confirmation-modal.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DeleteConfirmationModal {
  @Output() deleteCallback: EventEmitter<string> = new EventEmitter<string>();
  @Input("to-delete-id") toDeleteId: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modalService
      .open(content, { windowClass: "delete-confirmation-modal" })
      .result.then(result => {
        this.deleteCallback.emit(this.toDeleteId);
      });
  }
}
