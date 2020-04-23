import { Component, Input, ViewEncapsulation } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { UserInfoService } from "src/app/services/user.info.service";
import { User } from "src/app/models/user";

@Component({
  selector: "reset-password-content",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Password reset</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-8">
          <input
            class="form-control"
            type="text"
            [(ngModel)]="username"
            placeholder="Your username"
          />
        </div>
        <div class="col-4">
          <button class="btn btn-primary" (click)="sendPasswordReset()">
            Send request
          </button>
        </div>
      </div>
    </div>
    <div class="modal-footer ">
      <button
        type="button"
        class="btn btn-outline-dark mr-3"
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>
  `,
})
export class ResetPasswordModalContent {
  username: string;

  constructor(public activeModal: NgbActiveModal) {}

  sendPasswordReset: Function;
}

@Component({
  selector: "reset-password-modal",
  templateUrl: "./reset-password-modal.html",
  styleUrls: ["./reset-password-modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ResetPasswordModal {
  modal: NgbModalRef;
  userService: UserInfoService;
  username: string;
  constructor(
    private modalService: NgbModal,
    private userInfoService: UserInfoService
  ) {}

  sendPasswordReset(username: string) {
    let user = new User();
    user.username = this.username;
    this.userInfoService.sendPasswordResetMail(user);
  }

  open() {
    this.modal = this.modalService.open(ResetPasswordModalContent, {
      windowClass: "reset-password-modal",
    });
    this.modal.componentInstance.sendPasswordReset = this.sendPasswordReset;
    this.modal.componentInstance.userInfoService = this.userInfoService;
  }
}
