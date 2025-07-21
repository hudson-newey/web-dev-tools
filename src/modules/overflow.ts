import { removeStylesheet } from "../stylesheets/remove";
import { createVsyncAction, vsync } from "../updates/vsync";
import { Module } from "./module.class";

export class OverflowModule extends Module {
  public readonly name = "__dev_toggle_overflow";
  private readonly overflowStylesheet = new CSSStyleSheet();

  private readonly mutationFrame = createVsyncAction("overflow_update");
  private readonly mutationObserver = new MutationObserver(() =>
    vsync(this.mutationFrame, this.update)
  );

  public constructor() {
    super();

    this.overflowStylesheet.replaceSync(
      `.__dev_has_overflow { outline: 2px dashed red; }`
    );
  }

  public override toggle(): void {
    this.active = !this.active;

    if (this.active) {
      document.adoptedStyleSheets.push(this.overflowStylesheet);

      this.mutationObserver.observe(document.getRootNode(), {
        attributes: false,
        childList: true,
        subtree: true,
      });

      this.update();
    } else {
      removeStylesheet(this.overflowStylesheet);
    }
  }

  private update() {
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      const isOverflowing =
        element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight;

      const overflowClass = "__dev_has_overflow";
      if (isOverflowing && !element.classList.contains(overflowClass)) {
        element.classList.add(overflowClass);
      } else if (!isOverflowing && element.classList.contains(overflowClass)) {
        element.classList.remove(overflowClass);
      }
    });
  }
}
