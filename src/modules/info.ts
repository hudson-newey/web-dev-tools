import { closeModal, injectModal, isModalOpen } from "../components/modal";
import { countCSSVariables } from "../selectors/css";
import { flexboxElements } from "../selectors/flexbox";
import { createVsyncAction, vsync } from "../updates/vsync";
import { Module } from "./module.class";

export class InfoModule extends Module {
  public readonly name = "__dev_toggle_info";
  private readonly mutationFrame = createVsyncAction("info_update");
  private readonly mutationObserver = new MutationObserver(() =>
    vsync(this.mutationFrame, this.update)
  );

  public override toggle(): void {
    if (isModalOpen()) {
      this.mutationObserver.disconnect();
      closeModal();
    } else {
      this.update();

      // Attach a mutation observer so that if the document info changes, we
      // automatically update.
      // Note that we use a mutation observer, so that we only update if
      // something changes.
      this.mutationObserver.observe(document.getRootNode(), {
        attributes: false,
        childList: true,
        subtree: true,
      });
    }
  }

  private update() {
    const domNodes = [...document.getElementsByTagName("*")];
    const flexboxNodes = flexboxElements();

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
