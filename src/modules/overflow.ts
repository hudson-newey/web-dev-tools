import { removeStylesheet } from "../stylesheets/remove";
import { Module } from "./module.class";

export class OverflowModule extends Module {
  public readonly name = "__dev_toggle_overflow";
  private overflowStylesheet = new CSSStyleSheet();

  public constructor() {
    super();

    this.overflowStylesheet.replaceSync(
      `.__dev_has_overflow { outline: 2px dashed red; }`
    );
  }

  public override toggle(): void {
    this.active = !this.active;

    if (this.active) {
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        const isOverflowing =
          element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight;

        if (isOverflowing) {
          element.classList.add("__dev_has_overflow");
        }
      });

      document.adoptedStyleSheets.push(this.overflowStylesheet);
    } else {
      removeStylesheet(this.overflowStylesheet);
    }
  }
}
