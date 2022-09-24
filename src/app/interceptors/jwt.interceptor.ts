import { Injectable, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { User } from "../models/user";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { UserInfoService } from "../services/user.info.service";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private user: User;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private authService: AuthService
  ) {}

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
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
    return next.handle(changedReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      if (this.storage.get("currentUser")) {
        this.user = JSON.parse(this.storage.get("currentUser")).user;
        return this.authService.refreshToken(this.user).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            this.user.token = token;
            this.storage.set(
              "currentUser",
              JSON.stringify({ user: this.user })
            );
            return next.handle(this.addToken(request, token));
          })
        );
      }
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  addToken(req, token) {
    let changedReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    });

    return changedReq;
  }
}
