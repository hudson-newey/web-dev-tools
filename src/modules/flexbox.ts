import { flexboxElements } from "../selectors/flexbox";
import { removeStylesheet } from "../stylesheets/remove";
import { Module } from "./module.class";

export class FlexboxModule extends Module {
  public readonly name = "__dev_toggle_flexbox";
  private flexboxStylesheet = new CSSStyleSheet();

  public constructor() {
    super();

    this.flexboxStylesheet.replaceSync(
      `.__dev_has_flexbox { outline: 2px dashed green; }`
    );
  }

  public override toggle(): void {
    const flexboxClassName = "__dev_has_flexbox";
    const targets = flexboxElements();

    this.active = !this.active;

    if (this.active) {
      document.adoptedStyleSheets.push(this.flexboxStylesheet);
      targets.forEach((el) => el.classList.add(flexboxClassName));
    } else {
      targets.forEach((el) => el.classList.remove(flexboxClassName));
      removeStylesheet(this.flexboxStylesheet);
    }
  }
}
