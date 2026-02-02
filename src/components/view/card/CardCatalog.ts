import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

export type TCardCatalog = Pick<IProduct, "image" | "category">;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  private curentItem: IProduct | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);
    this.imageEl = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.container.addEventListener("click", () => {
      if (this.curentItem) {
        this.events.emit("product:select", this.curentItem);
      }
    });
  }
  set image(value: string) {
    let result: string = value.replace(".svg", ".png");
    this.setImage(this.imageEl, `${CDN_URL}${result}`, this.title);
  }
  set category(value: string) {
    this.categoryEl.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
    this.categoryEl.textContent = value;
  }

  render(product: IProduct): HTMLElement {
    super.render(product);
    this.curentItem = product;
    return this.container;
  }
}
