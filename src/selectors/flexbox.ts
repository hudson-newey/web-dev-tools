export function flexboxElements() {
  const allElements = [...document.getElementsByTagName("*")];
  return allElements.filter((element) => {
    const computedStyle = window.getComputedStyle(element);
    const displayStyle = computedStyle.getPropertyValue("display");

    // Because compound display styles are now baseline, it's possible for the
    // CSSOM "display" property to have a value like display: block flex;
    return displayStyle.includes("flex") || displayStyle === "inline-flex";
  });
}
