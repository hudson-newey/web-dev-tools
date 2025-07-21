import { flexboxElements } from "../selectors/flexbox";
import { removeStylesheet } from "../stylesheets/remove";
import { createVsyncAction, vsync } from "../updates/vsync";
import { Module } from "./module.class";

export class FlexboxModule extends Module {
  public readonly name = "__dev_toggle_flexbox";
  private readonly flexboxStylesheet = new CSSStyleSheet();

  private readonly mutationFrame = createVsyncAction("flexbox_update");
  private readonly mutationObserver = new MutationObserver(() =>
    vsync(this.mutationFrame, this.update)
  );

  public constructor() {
    super();

    this.flexboxStylesheet.replaceSync(
      `.__dev_has_flexbox { outline: 2px dashed green; }`
    );
  }

  public override toggle(): void {
    this.active = !this.active;

    if (this.active) {
      document.adoptedStyleSheets.push(this.flexboxStylesheet);

      this.mutationObserver.observe(document.getRootNode(), {
        attributes: false,
        childList: true,
        subtree: true,
      });

      this.update();
    } else {
      this.mutationObserver.disconnect();

      const targets = flexboxElements();
      targets.forEach((el) => el.classList.remove("__dev_has_flexbox"));

      removeStylesheet(this.flexboxStylesheet);
    }
  }

  private update() {
    const targets = flexboxElements();

    targets.forEach((el) => {
      if (!el.classList.contains("__dev_has_flexbox")) {
        el.classList.add("__dev_has_flexbox");
      }
    });
  }
}
