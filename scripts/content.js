(() => {
  function removeStylesheet(target) {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (stylesheet) => stylesheet !== target
    );
  }

  const outlineStylesheet = new CSSStyleSheet();
  outlineStylesheet.replaceSync(`* { outline: 1px solid tomato; }`);

  function __dev_toggle_outline(active) {
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

  function __dev_toggle_overflow(active) {
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

  let activeModules = new Map([
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
      const newState = !foundModule.active;
      foundModule.callback(newState);
      foundModule.active = newState;
    } else {
      console.debug(
        `Could not find web dev tools module '${moduleIdentifier}'`
      );
    }
  });

  // Make the module callbacks available on the global object so that we can
  // call them from the console.
  for (const module of activeModules.values()) {
    window[module.name] = module.callback;
  }
})();
