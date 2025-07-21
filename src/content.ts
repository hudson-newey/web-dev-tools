import { EditModule } from "./modules/editMode";
import { FlexboxModule } from "./modules/flexbox";
import { InfoModule } from "./modules/info";
import type { Module } from "./modules/module.class";
import { OutlineModule } from "./modules/outline";
import { OverflowModule } from "./modules/overflow";

const moduleRegistry = new Map<string, Module>([
  // Styles
  ["q", new OutlineModule()],
  ["w", new OverflowModule()],
  ["e", new FlexboxModule()],

  // Info Panels
  ["a", new InfoModule()],

  // Modes
  ["=", new EditModule()],
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
  const usedModule = moduleRegistry.get(moduleIdentifier);
  if (usedModule) {
    event.preventDefault();
    usedModule.toggle();
  } else {
    console.debug(`Could not find web dev tools module '${moduleIdentifier}'`);
  }
});
