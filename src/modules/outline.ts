import { removeStylesheet } from "../stylesheets/remove";
import { Module } from "./module.class";

export class OutlineModule extends Module {
  public readonly name = "__dev_toggle_outline";
  private readonly outlineStylesheet = new CSSStyleSheet();

  public constructor() {
    super();
    this.outlineStylesheet.replaceSync(`* { outline: 1px solid tomato; }`);
  }

  public override toggle(): void {
    this.active = !this.active;

    if (this.active) {
      document.adoptedStyleSheets.push(this.outlineStylesheet);
    } else {
      removeStylesheet(this.outlineStylesheet);
    }
  }
}
