import { __dev_toggle_flexbox } from "./modules/flexbox";
import { __dev_toggle_info } from "./modules/info";
import type { Module } from "./modules/module.interface";
import { __dev_toggle_outline } from "./modules/outline";
import { __dev_toggle_overflow } from "./modules/overflow";

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
