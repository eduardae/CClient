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
    const headers = new Headers({ 'Content-Type': 'application/json' });
    let user = this.user;
    this.http.post('http://localhost:3002/login', user, null).subscribe((result) => {
        const response = result.json();
        if (response.success) {
          this.router.navigateByUrl('/home');
        }
      });
  }


}
