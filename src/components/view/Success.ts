import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Success extends Component<HTMLElement> {
  protected totalCostEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.totalCostEl = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
  }

  set total(value: number) {
    this.totalCostEl.textContent = `Списано ${value} синапсов`;
  }
}
