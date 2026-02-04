import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ModalInterface extends Component<HTMLElement> {
  set content(value: HTMLElement);
  open(value: HTMLElement): void;
  close(): void;
}

export class Modal extends Component<HTMLElement> implements ModalInterface {
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

  open(value: HTMLElement): void {
    this.container.classList.add("modal_active");
    this.contentEl.replaceChildren(value);
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }
}
