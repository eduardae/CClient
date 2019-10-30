import { Component, OnInit, Input } from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { Article } from "../models/article";

@Component({
  selector: "app-academy",
  templateUrl: "./academy.component.html",
  styleUrls: ["./academy.component.scss"]
})
export class AcademyComponent implements OnInit {
  articles: Article[];
  isUpdating: boolean;
  response: string;

  constructor(private http: Http) {}

  ngOnInit() {}
}
