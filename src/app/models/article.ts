import { OnInit } from '@angular/core';

export class Article implements OnInit {
  title: string;
  description: string;
  url: string;
  urlToImage: string;

  constructor() {
    this.title = '';
    this.description = '';
    this.url = '';
    this.urlToImage = '';
   }

  ngOnInit() {

  }

}
