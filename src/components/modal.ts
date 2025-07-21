const modal = document.createElement("div");
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

const modalHeader = document.createElement("div");
modalHeader.innerHTML = ``;

const modalContent = document.createElement("div");

modal.appendChild(modalHeader);
modal.appendChild(modalContent);

let modalOpen = false;

export function injectModal(content: string) {
  const currentHtml = modalContent.innerHTML;
  if (currentHtml === content) {
    return;
  }

  modalContent.innerHTML = content;
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
