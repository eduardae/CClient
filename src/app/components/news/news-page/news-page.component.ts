import { Component, OnInit, Input } from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { Article } from "../../../models/article";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-news",
  templateUrl: "./news-page.component.html",
  styleUrls: ["./news-page.component.scss"],
})
export class NewsPageComponent implements OnInit {
  articles: Article[];
  isUpdating: boolean;
  response: string;
  listMode: boolean = true;
  filters: string[] = [
    "Analysis",
    "Blockchain",
    "Exchanges",
    "General",
    "Government",
    "ICO",
    "Mining",
  ];

  constructor(private http: Http) {}

  ngOnInit() {
    this.getNews();
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getNews();
  }

  filterNews(filter) {
    this.http
      .get(`${environment.baseUrl}:8083/byfilter?filter=${filter}`)
      .subscribe((result) => {
        const response = result.json();
        console.log(response);
        this.articles = _.sortBy(response, (article) => {
          return new Date(article.publishedAt);
        }).reverse();
        /*this.articles.forEach(element => {
        element.title = element.title.substring(0, 100);
      });*/
        this.isUpdating = false;
      });
  }

  getNews() {
    this.http.get(`${environment.baseUrl}:8083`).subscribe((result) => {
      const response = result.json();
      console.log(response);
      this.articles = _.sortBy(response, (article) => {
        return new Date(article.publishedAt);
      }).reverse();
      /*this.articles.forEach(element => {
        element.title = element.title.substring(0, 100);
      });*/
      this.isUpdating = false;
    });
  }

  updateArticleUrl(articleIn: Article) {
    const art = _.find(this.articles, (article) => {
      return article === articleIn;
    });
    art.originalImageUrl = "./assets/images/newspaper.png";
  }

  toggleListMode(listMode: boolean) {
    this.listMode = listMode;
  }
}
