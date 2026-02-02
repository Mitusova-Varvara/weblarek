import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export abstract class Card<T> extends Component<T> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;

  constructor(
    container: HTMLElement,
    protected evt: IEvents,
  ) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceEl = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    this.priceEl.textContent = value ? `${value} синапсов` : "Бесценно";
  }
}
