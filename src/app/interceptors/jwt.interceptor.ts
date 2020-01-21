import { Injectable, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { User } from "../models/user";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private user: User;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.storage.get("currentUser")) {
      this.user = JSON.parse(this.storage.get("currentUser")).user;
    }
    let changedReq;
    if (this.user && this.user.token) {
      changedReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${this.user.token}`)
      });
    } else {
      changedReq = req.clone();
    }
    return next.handle(changedReq);
  }
}
