import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { CoinsSummary } from '../models/coins-summary';
import { CoinMarketInfo } from '../models/coin-market-info';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @Input() cryptoInfos: CoinsSummary;
  isUpdating: boolean;
  currency: string;

  constructor(private http:Http) {
    this.cryptoInfos = new CoinsSummary();
  }

  ngOnInit() {
    this.getCryptoMarketInfo();
    this.currency = 'EUR';
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getCryptoMarketInfo();
    this.getUsers();
  }

  getCryptoMarketInfo() {
    this.http
    .get('http://localhost:8081').subscribe((result) => {
      //this.cryptoInfos = result.json() as CoinsSummary;
      console.log(result.json());
      this.isUpdating = false;
    });
  }

  getUsers() {
    this.http
    .get('http://localhost:3001/users/').subscribe((result) => {
      let users = result.json();
      console.log(users);
    });
  }

}
