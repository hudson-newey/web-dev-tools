(() => {
  const outlineStylesheet = new CSSStyleSheet();
  outlineStylesheet.replaceSync(`* { outline: 1px solid tomato; }`);

  function __dev_toggle_outline(active) {
    if (active) {
      document.adoptedStyleSheets.push(outlineStylesheet);
    } else {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (stylesheet) => stylesheet !== outlineStylesheet
      );
    }
  }

  let activeModules = new Map([
    [
      "q",
      {
        name: "__dev_toggle_outline",
        callback: __dev_toggle_outline,
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
      console.log("Activating web dev tools modules");
      modifierActive = true;
      return;
    } else if (!modifierActive) {
      return;
    }

    modifierActive = false;

    const moduleIdentifier = event.key;
    const foundModule = activeModules.get(moduleIdentifier);
    console.debug("finding module", moduleIdentifier, foundModule);
    if (foundModule) {
      const newState = !foundModule.active;
      foundModule.callback(newState);
      console.log(foundModule);
      foundModule.active = newState;
    } else {
        console.debug(`Could not find web dev tools module '${moduleIdentifier}'`);
    }
  });

  // Make the module callbacks available on the global object so that we can
  // call them from the console.
  for (const module of activeModules.values()) {
    window[module.name] = module.callback;
  }
})();
