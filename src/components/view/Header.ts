import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.counterEl = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.buttonEl = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.buttonEl.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set count(value: number) {
    this.counterEl.textContent = String(value);
  }
}
