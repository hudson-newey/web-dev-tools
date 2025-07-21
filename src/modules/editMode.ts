import { Module } from "./module.class";

export class EditModule extends Module {
  public readonly name = "__dev_toggle_edit";

  public toggle(): void {
    // We use the DOM as the source of truth because it can be modified by
    // the user and other extensions.
    const currentValue = document.designMode;

    // Note that we use "on" as the default case if it is set to an invalid
    // value.
    // This handles cases such as (incorrectly) setting designMode to "false" to
    // turn off design mode.
    if (currentValue === "on") {
      console.debug("Leaving design mode");
      document.designMode = "off";
    } else {
      console.debug("Entering design mode");
      document.designMode = "on";
    }
  }
}
