import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { CoinsSummary } from "../../models/coins-summary";
import { CoinInfo } from "../../models/coin-info";
import { from } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { WebStorageService, SESSION_STORAGE } from "angular-webstorage-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserInfoService } from "src/app/services/user.info.service";
import { ToastService } from "../../services/toast-service";
import { HttpClient } from "@angular/common/http";
import { Link } from "src/app/models/Link";
import { LinkSection } from "src/app/models/link-section";
import { _ } from "underscore";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  user: User;
  newsArticles: Link[];
  academyLinks: Link[];

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    public toastService: ToastService
  ) {
    this.toastService = toastService;
    this.academyLinks = [];
    this.newsArticles = [];
  }

  ngOnInit() {
    if (this.storage.get("currentUser")) {
      this.user = JSON.parse(this.storage.get("currentUser")).user;
      const savedLinks = this.user.saved_links;
      savedLinks.forEach(link => {
        if (link.section === LinkSection.NEWS) {
          this.newsArticles.push(link);
        }
        if (link.section === LinkSection.ACADEMY) {
          this.academyLinks.push(link);
        }
      });
    }
  }

  removeLink(link: Link) {
    if (link.section === LinkSection.NEWS) {
      this.newsArticles = _.filter(this.user.saved_links, savedLink => {
        return link.url !== savedLink.url;
      });
    }
    if (link.section === LinkSection.ACADEMY) {
      this.academyLinks = _.filter(this.user.saved_links, savedLink => {
        return link.url !== savedLink.url;
      });
    }
    this.user.saved_links = _.filter(this.user.saved_links, savedLink => {
      return link.url !== savedLink.url;
    });
    this.userService.updateLinks(this.user);
  }

  update() {
    this.userService.updateSettings(this.user);
  }
}
