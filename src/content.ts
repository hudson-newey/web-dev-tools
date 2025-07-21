import type { Module } from "./module.interface";

function countCSSVariables() {
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

function flexboxes() {
  const allElements = [...document.getElementsByTagName("*")];
  return allElements.filter((element) => {
    const computedStyle = window.getComputedStyle(element);
    const displayStyle = computedStyle.getPropertyValue("display");

    // Because compound display styles are now baseline, it's possible for the
    // CSSOM "display" property to have a value like display: block flex;
    return displayStyle.includes("flex") || displayStyle === "inline-flex";
  });
}

const modal = document.createElement("div");

const modalHeader = document.createElement("div");
modalHeader.innerHTML = `
    <button id="__dev_modal_close-btn">Close</button>
  `;
modalHeader
  .querySelector("#__dev_modal_close-btn")!
  .addEventListener("click", () => {
    closeModal();
  });

const modalContent = document.createElement("div");

modal.appendChild(modalHeader);
modal.appendChild(modalContent);

let modalOpen = false;

function removeStylesheet(target: CSSStyleSheet) {
  document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
    (stylesheet) => stylesheet !== target
  );
}

function injectModal(content: string) {
  modalContent.innerHTML = content;

  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.margin = "0.5rem";

  modal.style.width = "min(400px, 80%)";
  modal.style.height = "min(200px, 80%)";

  modal.style.color = "white";
  modal.style.backgroundColor = "black";
  modal.style.borderRadius = "8px";
  modal.style.padding = "8px";

  modal.style.zIndex = "999999999";

  if (!modalOpen) {
    document.body.appendChild(modal);
  }

  modalOpen = true;
}

function closeModal() {
  modalOpen = false;
  document.body.removeChild(modal);
}

const outlineStylesheet = new CSSStyleSheet();
outlineStylesheet.replaceSync(`* { outline: 1px solid tomato; }`);

function __dev_toggle_outline(active: boolean) {
  if (active) {
    document.adoptedStyleSheets.push(outlineStylesheet);
  } else {
    removeStylesheet(outlineStylesheet);
  }
}

const overflowStylesheet = new CSSStyleSheet();
overflowStylesheet.replaceSync(
  `.__dev_has_overflow { outline: 2px dashed red; }`
);

function __dev_toggle_overflow(active: boolean) {
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

const flexboxStylesheet = new CSSStyleSheet();
flexboxStylesheet.replaceSync(
  `.__dev_has_flexbox { outline: 2px dashed green; }`
);

function __dev_toggle_flexbox(active: boolean) {
  const flexboxClassName = "__dev_has_flexbox";
  const targets = flexboxes();

  if (active) {
    document.adoptedStyleSheets.push(flexboxStylesheet);
    targets.forEach((el) => el.classList.add(flexboxClassName));
  } else {
    targets.forEach((el) => el.classList.remove(flexboxClassName));
    removeStylesheet(flexboxStylesheet);
  }
}

function __dev_toggle_info() {
  if (modalOpen) {
    closeModal();
  } else {
    const domNodes = [...document.getElementsByTagName("*")];
    const flexboxNodes = flexboxes();

    const modalContent = `
        <h4>DOM Summary</h4>
        <ul>
          <li>Nodes: ${domNodes.length.toLocaleString()}</li>
          <li>Flexbox's: ${flexboxNodes.length.toLocaleString()}</li>
          <li>CSS Vars: ${countCSSVariables().toLocaleString()}</li>
        </ul>
      `;

    injectModal(modalContent);
  }
}

let activeModules = new Map<string, Module>([
  [
    "q",
    {
      name: "__dev_toggle_outline",
      callback: __dev_toggle_outline,
      active: false,
    },
  ],
  [
    "w",
    {
      name: "__dev_toggle_overflow",
      callback: __dev_toggle_overflow,
      active: false,
    },
  ],
  [
    "e",
    {
      name: "__dev_toggle_flexbox",
      callback: __dev_toggle_flexbox,
      active: false,
    },
  ],

  // info key row
  [
    "a",
    {
      name: "__dev_toggle_info",
      callback: __dev_toggle_info,
      active: false,
    },
  ],
]);

// If you press backslash, you will be entered into a mode where the next
// keypress may be a module to activate.
let modifierActive = false;
document.addEventListener("keyup", (event) => {
  const activationKey = "\\";

  if (event.key === activationKey) {
    modifierActive = true;
    return;
  } else if (!modifierActive) {
    return;
  }

  modifierActive = false;

  const moduleIdentifier = event.key;
  const foundModule = activeModules.get(moduleIdentifier);
  if (foundModule) {
    event.preventDefault();

    const newState = !foundModule.active;
    foundModule.callback(newState);
    foundModule.active = newState;
  } else {
    console.debug(`Could not find web dev tools module '${moduleIdentifier}'`);
  }
});
