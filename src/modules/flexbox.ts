import { flexboxElements } from "../selectors/flexbox";
import { removeStylesheet } from "../stylesheets/remove";

const flexboxStylesheet = new CSSStyleSheet();
flexboxStylesheet.replaceSync(
  `.__dev_has_flexbox { outline: 2px dashed green; }`
);

export function __dev_toggle_flexbox(active: boolean) {
  const flexboxClassName = "__dev_has_flexbox";
  const targets = flexboxElements();

  if (active) {
    document.adoptedStyleSheets.push(flexboxStylesheet);
    targets.forEach((el) => el.classList.add(flexboxClassName));
  } else {
    targets.forEach((el) => el.classList.remove(flexboxClassName));
    removeStylesheet(flexboxStylesheet);
  }
}
