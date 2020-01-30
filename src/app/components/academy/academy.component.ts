import { Component, OnInit, Input } from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { Article } from "../../models/article";

@Component({
  selector: "app-academy",
  templateUrl: "./academy.component.html",
  styleUrls: ["./academy.component.scss"]
})
export class AcademyComponent implements OnInit {
  articles: Article[];
  isUpdating: boolean;
  response: string;

  showTechnicalLinks: boolean = true;
  showFinancialLinks: boolean = true;
  showHowToGuides: boolean = false;
  showProjectsLinks: boolean = true;
  showBusinessSocialDev: boolean = true;
  showCourses: boolean = false;

  constructor(private http: Http) {}

  ngOnInit() {}

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
