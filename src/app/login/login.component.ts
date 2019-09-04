import { Component, OnInit, Input } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { CoinsSummary } from '../models/coins-summary';
import { CoinMarketInfo } from '../models/coin-market-info';
import { from } from 'rxjs';
import {Router} from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private http: Http, private router: Router) {
    this.user = new User();
  }

  ngOnInit() {
  }

  login() {
    this.http
    .get('http://localhost:8082/auth').subscribe((result) => {
      console.log(result.json());
    });
  }

}
