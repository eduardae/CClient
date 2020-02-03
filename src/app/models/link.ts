import { LinkSection } from "./link-section";

export class Link {
  title: string;
  url: string;
  section: LinkSection;

  constructor() {
    this.title = "";
    this.url = "";
  }
}
