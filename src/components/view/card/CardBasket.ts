import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../../base/Events";

type ICardBasket = {
  component: IProduct;
  index?: number;
};

export class CardBasket extends Card<ICardBasket> {
  protected indexEl: HTMLElement;
  protected deletButtonEl: HTMLButtonElement;
  private curentItem: IProduct | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);
    this.indexEl = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deletButtonEl = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    this.deletButtonEl.addEventListener("click", () => {
      if (this.curentItem) {
        this.events.emit("product:delete", this.curentItem);
      }
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String((value || 0) + 1);
  }

  render(product: ICardBasket): HTMLElement {
    super.render(product);
    this.title = product.component.title;
    this.price = product.component.price;
    this.curentItem = product.component;
    return this.container;
  }
}
