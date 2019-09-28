import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import {_} from 'underscore';
import { Article } from '../models/article';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {

  articles: Article[];
  isUpdating: boolean;
  response: string;

  constructor(private http:Http) {
  }

  ngOnInit() {
    this.getNews();
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getNews();
  }

  getNews() {
    this.http
    .get('http://localhost:8083').subscribe((result) => {
      const response = result.json();
      console.log(response);
      this.articles =_.sortBy(response.articles, (article) => {
        return new Date(article.publishedAt);
      }).reverse();
      this.isUpdating = false;
    });
  }

}
