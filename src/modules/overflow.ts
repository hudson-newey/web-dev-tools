import { removeStylesheet } from "../stylesheets/remove";

const overflowStylesheet = new CSSStyleSheet();
overflowStylesheet.replaceSync(
  `.__dev_has_overflow { outline: 2px dashed red; }`
);

export function __dev_toggle_overflow(active: boolean) {
  if (active) {
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      const isOverflowing =
        element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight;

      if (isOverflowing) {
        element.classList.add("__dev_has_overflow");
      }
    });

    document.adoptedStyleSheets.push(overflowStylesheet);
  } else {
    removeStylesheet(overflowStylesheet);
  }
}
