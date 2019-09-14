import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { CoinsSummary } from '../models/coins-summary';
import { CoinMarketInfo } from '../models/coin-market-info';
import { from } from 'rxjs';
import {Router} from '@angular/router';
import { User } from '../models/user';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import {ElementRef, Renderer2} from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private http: Http, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.user = new User();
  }

  ngOnInit() {
  }

  login() {
    this.http
    .post('http://localhost:8082/auth', {username: this.user.username, password: this.user.password})
    .subscribe(result => {
      localStorage.setItem('currentUser', JSON.stringify({ user: this.user }));
      window.location.reload();
    }, err => {

    });
  }

}
