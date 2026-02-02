import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";
import { Basket } from "../../models/Basket";

type TCardPreview = Pick<IProduct, "image" | "category" | "description">;

export class CardPreview extends Card<TCardPreview> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected descriptionEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;
  private curentItem: IProduct | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected basket: Basket,
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
    this.descriptionEl = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonEl = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.buttonEl.addEventListener("click", () => {
      if (this.curentItem) {
        if (!basket.hasProduct(this.curentItem)) {
          this.basket.addItem(this.curentItem);
        } else {
          basket.removeItem(this.curentItem);
        }

        this.events.emit("basket:count_changed", {
          count: this.basket.getCount(),
        });

        this.buttonEl.textContent = this.basket.hasProduct(this.curentItem)
          ? "Удалить из корзины"
          : "В корзину";
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
  set description(value: string) {
    this.descriptionEl.textContent = value;
  }

  renderButtonText(value: boolean): void {
    value
      ? (this.buttonEl.textContent = "Удалить из корзины")
      : (this.buttonEl.textContent = "В корзину");
  }

  render(product: IProduct): HTMLElement {
    this.curentItem = product;
    if (product.price === null) {
      this.buttonEl.setAttribute("disabled", "true");
      this.buttonEl.textContent = "Недоступно";
    } else {
      this.buttonEl.removeAttribute("disabled");
      this.renderButtonText(this.basket.hasProduct(product));
    }
    return super.render(product);
  }
}
