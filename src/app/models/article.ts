import { OnInit, Directive } from "@angular/core";

@Directive()
export class Article implements OnInit {
  title: string;
  description: string;
  url: string;
  originalImageUrl: string;

  constructor() {
    this.title = "";
    this.description = "";
    this.url = "";
    this.originalImageUrl = "";
  }

  ngOnInit() {}
}
