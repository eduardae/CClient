import { Component, OnInit, Input } from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { Article } from "../../../models/article";

@Component({
  selector: "app-news",
  templateUrl: "./news-page.component.html",
  styleUrls: ["./news-page.component.scss"]
})
export class NewsPageComponent implements OnInit {
  articles: Article[];
  isUpdating: boolean;
  response: string;

  constructor(private http: Http) {}

  ngOnInit() {
    this.getNews();
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getNews();
  }

  getNews() {
    this.http.get("http://localhost:8083").subscribe(result => {
      const response = result.json();
      console.log(response);
      this.articles = _.sortBy(response, article => {
        return new Date(article.publishedAt);
      }).reverse();
      /*this.articles.forEach(element => {
        element.title = element.title.substring(0, 100);
      });*/
      this.isUpdating = false;
    });
  }

  updateArticleUrl(articleIn: Article) {
    const art = _.find(this.articles, article => {
      return article === articleIn;
    });
    art.originalImageUrl = "./assets/images/newspaper.png";
  }
}
