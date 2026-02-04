import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IApiGet } from "../../types";

export interface SuccessInterface extends Component<IApiGet> {
  set total(value: number);
}

export class Success extends Component<IApiGet> implements SuccessInterface {
  protected totalCostEl: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.totalCostEl = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.closeButton.addEventListener("click", () => {
      events.emit("succes:close");
    });
  }

  set total(value: number) {
    this.totalCostEl.textContent = `Списано ${value} синапсов`;
  }
}
