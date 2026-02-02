import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Modal extends Component<HTMLElement> {
  protected contentEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.contentEl = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.buttonEl = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.buttonEl.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentEl.replaceChildren(value);
  }

  open(value: HTMLElement) {
    this.container.classList.add("modal_active");
    this.contentEl.replaceChildren(value);
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
