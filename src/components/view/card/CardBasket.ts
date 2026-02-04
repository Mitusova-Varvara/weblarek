import { ICardActions, IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

type ICardBasket = {
  component: Pick<IProduct, "id">;
  index?: number;
};

export class CardBasket extends Card<ICardBasket> {
  protected indexEl: HTMLElement;
  protected deletButtonEl: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexEl = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deletButtonEl = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexEl.textContent = String((value || 0) + 1);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
