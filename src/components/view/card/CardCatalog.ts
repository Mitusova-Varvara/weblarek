import { Card } from "./Card";
import { ICardActions, IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";

export type TCardCatalog = Pick<IProduct, "image" | "category">;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.imageEl = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
  set image(value: string) {
    let result: string = value.replace(".svg", ".png");
    this.setImage(this.imageEl, `${CDN_URL}${result}`, this.title);
  }
  set category(value: string) {
    this.categoryEl.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
    this.categoryEl.textContent = value;
  }
}
