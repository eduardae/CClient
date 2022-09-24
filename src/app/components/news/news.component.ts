import { Component, OnInit, Input, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { Article } from "../../models/article";
import { User } from "src/app/models/user";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { UserInfoService } from "src/app/services/user.info.service";
import { LinkSection } from "src/app/models/link-section";
import { environment } from "src/environments/environment";

@Component({
  selector: "news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit {
  @Input() articles: Article[];
  @Input() listMode: boolean = true;
  isUpdating: boolean;
  response: string;
  user: User;

  constructor(
    private http: HttpClient,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private userService: UserInfoService
  ) {}

  ngOnInit() {
    if (this.storage.get("currentUser")) {
      this.user = JSON.parse(this.storage.get("currentUser")).user;
    }
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getNews();
  }

  getNews() {
    this.http.get(`${environment.baseUrl}:8083`).subscribe((result: any) => {
      const response = result.json();
      console.log(response);
      this.articles = _.sortBy(response, article => {
        return new Date(article.publishedAt);
      }).reverse();
      this.isUpdating = false;
    });
  }

  updateArticleUrl(articleIn: Article) {
    const art = _.find(this.articles, article => {
      return article === articleIn;
    });
    art.originalImageUrl = "./assets/images/newspaper.png";
  }

  addArticleToSavedLinks(article: Article) {
    this.userService.addArticleToLinks(article, this.user, LinkSection.NEWS);
  }
}
