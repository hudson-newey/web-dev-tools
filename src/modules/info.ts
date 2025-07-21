import { closeModal, injectModal, isModalOpen } from "../components/modal";
import { countCSSVariables } from "../selectors/css";
import { flexboxElements } from "../selectors/flexbox";
import { Module } from "./module.class";

export class InfoModule extends Module {
  public readonly name = "__dev_toggle_info";

  public override toggle(): void {
    if (isModalOpen()) {
      closeModal();
    } else {
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
}
