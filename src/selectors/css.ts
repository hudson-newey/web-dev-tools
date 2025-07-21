export function countCSSVariables() {
  let variableCount = 0;
  // Access all stylesheets loaded in the document
  const stylesheets = Array.from(document.styleSheets);

  stylesheets.forEach((sheet) => {
    try {
      // Access the CSS rules within each stylesheet
      const rules = Array.from(sheet.cssRules || sheet.rules);

      rules.forEach((rule: any) => {
        // We are interested in style rules (like :root, body, .class)
        if (rule.style) {
          // Iterate over all style declarations in the rule
          Array.from(rule.style).forEach((propName: any) => {
            // CSS custom properties start with '--'
            if (propName.startsWith("--")) {
              variableCount++;
            }
          });
        }
      });
    } catch (e) {
      // Catch potential security errors if a stylesheet is from a different origin
      // and CORS is not enabled.
      console.warn("Could not access rules from stylesheet: ", sheet.href, e);
    }
  });

  return variableCount;
}
