import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { CoinsSummary } from '../models/coins-summary';
import { CoinInfo } from '../models/coin-info';
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
  }

  refreshInfo() {
  }


}
