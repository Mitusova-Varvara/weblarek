import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Cart extends Component<IBasket> {
  protected listBasketEl: HTMLElement;
  protected basketButtonEl: HTMLButtonElement;
  protected totalPriceEl: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.listBasketEl = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalPriceEl = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.basketButtonEl = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.basketButtonEl.addEventListener("click", () => {
      this.events.emit("order:opened");
    });
  }

  set items(list: HTMLElement[]) {
    this.basketButtonEl.disabled = list.length === 0;
    this.listBasketEl.replaceChildren(...list);
  }

  set total(value: number) {
    this.totalPriceEl.textContent = `${value} синапсов`;
  }
}
