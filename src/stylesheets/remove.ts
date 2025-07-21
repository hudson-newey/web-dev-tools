export function removeStylesheet(target: CSSStyleSheet) {
  document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
    (stylesheet) => stylesheet !== target
  );
}
