import { removeStylesheet } from "../stylesheets/remove";

const outlineStylesheet = new CSSStyleSheet();
outlineStylesheet.replaceSync(`* { outline: 1px solid tomato; }`);

export function __dev_toggle_outline(active: boolean) {
  if (active) {
    document.adoptedStyleSheets.push(outlineStylesheet);
  } else {
    removeStylesheet(outlineStylesheet);
  }
}
