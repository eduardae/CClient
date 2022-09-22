import { Component, OnInit, Input, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { Article } from "../../models/article";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { User } from "src/app/models/user";
import { UserInfoService } from "src/app/services/user.info.service";
import { LinkSection } from "src/app/models/link-section";

@Component({
  selector: "app-academy",
  templateUrl: "./academy.component.html",
  styleUrls: ["./academy.component.scss"]
})
export class AcademyComponent implements OnInit {
  articles: Article[];
  isUpdating: boolean;
  response: string;
  user: User;

  showTechnicalLinks: boolean = false;
  showFinancialLinks: boolean = false;
  showHowToGuides: boolean = false;
  showProjectsLinks: boolean = false;
  showBusinessSocialDev: boolean = false;
  showCourses: boolean = false;

  constructor(
    private http: HttpClient,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService
  ) {}

  ngOnInit() {
    if (this.storage.get("currentUser")) {
      this.user = JSON.parse(this.storage.get("currentUser")).user;
    }
  }

  addArticleToSavedLinks(title: string, url: string) {
    const article = new Article();
    article.title = title;
    article.url = url;
    this.userService.addArticleToLinks(article, this.user, LinkSection.ACADEMY);
  }

  triggerTechnicalTabCollapse() {
    this.showTechnicalLinks = !this.showTechnicalLinks;
  }

  triggerFinancialTabCollapse() {
    this.showFinancialLinks = !this.showFinancialLinks;
  }

  triggerHowToCollapse() {
    this.showHowToGuides = !this.showHowToGuides;
  }

  triggerProjectsCollapse() {
    this.showProjectsLinks = !this.showProjectsLinks;
  }

  triggerBusinesSocialDevCollapse() {
    this.showBusinessSocialDev = !this.showBusinessSocialDev;
  }

  triggerCoursesCollapse() {
    this.showCourses = !this.showCourses;
  }
}
