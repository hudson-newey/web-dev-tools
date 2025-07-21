const modalStylesheet = new CSSStyleSheet();
modalStylesheet.replaceSync(`
.__dev_modal {
  position: fixed;
  top: 0;
  left: 0;
  margin: 0.5rem;

  min-width: min(400px, 80%);
  min-height: min(200px, 80%);
  border-radius: 8px;

  background-color: black;
  box-shadow: 0px 0px 4px 1px white;

  overflow: auto;
  resize: both;

  contain: content;
  z-index: 999999999;

  /*
    Styles so that when I'm dragging the modal, it doesn't select text on the
    page.
  */
  user-select: none;

  /*
    CSS Overrides because the host page might apply different styles
    Note that we use absolute (e.g. px) values because the host website might
    have changed the font size at the "root"/html level.
  */
  * {
    color: white !important;
    font-family: sans-serif !important;
    font-size: 16px !important;
    font-weight: 400 !important;
    line-height: 1.75 !important;
  }
 
  ul {
    list-style: none;
    padding: 0;
  }
}

.__dev_modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #333;

  padding: 0.25rem;
  padding-inline: 1rem;

  margin-bottom: 0.5rem;

  #__dev_close-btn {
    background-color: transparent;
    
    padding: 0.25rem;
    
    border: none;
    border-radius: 6px;
  }
}

.__dev_modal_content {
  padding: 0.5rem;
  padding-inline: 1rem;
}
`);

document.adoptedStyleSheets.push(modalStylesheet);

const modal = document.createElement("div");
modal.className = "__dev_modal";

const modalHeader = document.createElement("div");
modalHeader.className = "__dev_modal_header";
modalHeader.innerHTML = `
<span>web-dev-tools</span>
<button id="__dev_close-btn">Close</button>
`;

// make the modal draggable through the header
modalHeader.addEventListener("pointerdown", (e) => {
  const target = e.target as HTMLElement;
  if (target.id === "__dev_close-btn") {
    closeModal();
    return;
  }

  const modalRect = modal.getBoundingClientRect();
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;

    modal.style.left = `${modalRect.left + dx}px`;
    modal.style.top = `${modalRect.top + dy}px`;
  };
  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

const modalContent = document.createElement("div");
modalContent.className = "__dev_modal_content";

modal.appendChild(modalHeader);
modal.appendChild(modalContent);

let modalOpen = false;

export function injectModal(content: string) {
  const currentHtml = modalContent.innerHTML;
  if (currentHtml !== content) {
    modalContent.innerHTML = content;
  }

  if (!modalOpen) {
    document.body.appendChild(modal);
  }

  modalOpen = true;
}

export function closeModal() {
  modalOpen = false;
  document.body.removeChild(modal);
}

export function isModalOpen(): boolean {
  return modalOpen;
}
