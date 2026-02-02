import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

type ICardBasket = {
  component: IProduct;
  index?: number;
};

export class CardBasket extends Card<ICardBasket> {
  protected indexEl: HTMLElement;
  protected deletButtonEl: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.indexEl = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deletButtonEl = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
  }

  set index(value: number) {
    this.indexEl.textContent = String((value || 0) + 1);
  }
}
