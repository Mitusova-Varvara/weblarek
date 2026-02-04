import { Card } from "./Card";
import { ICardActions, IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";

type TCardPreview = Pick<IProduct, "image" | "category" | "description">;

export class CardPreview extends Card<TCardPreview> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected descriptionEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

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
    this.descriptionEl = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonEl = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.onClick) {
      this.buttonEl.addEventListener("click", actions.onClick);
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
  set description(value: string) {
    this.descriptionEl.textContent = value;
  }

  renderButtonText(value: boolean): void {
    value
      ? (this.buttonEl.textContent = "Удалить из корзины")
      : (this.buttonEl.textContent = "В корзину");
  }

  render(product: IProduct): HTMLElement {
    if (product.price === null) {
      this.buttonEl.setAttribute("disabled", "true");
      this.buttonEl.textContent = "Недоступно";
    } else {
      this.buttonEl.removeAttribute("disabled");
    }
    return super.render(product);
  }
}
