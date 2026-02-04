import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../../base/Events";

type ICardBasket = {
  component: Pick<IProduct, "id">;
  index?: number;
};

export class CardBasket extends Card<ICardBasket> {
  protected indexEl: HTMLElement;
  protected deletButtonEl: HTMLButtonElement;

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
      let id = this.container.dataset.id;
      console.log(id);
      this.events.emit("product:delete", { item: id });
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String((value || 0) + 1);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
