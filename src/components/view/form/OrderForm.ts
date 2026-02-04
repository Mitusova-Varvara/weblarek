import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { TBuyerErrors } from "../../../types";
import { TPayment } from "../../../types";

export interface OrderFormInterface extends Form {
  clear(): void;
  togglePaymentButton(payment: TPayment): void;
  checkValidation(message: TBuyerErrors): boolean;
}

export class OrderForm extends Form implements OrderFormInterface {
  protected cashButtonEl: HTMLButtonElement;
  protected cardButtonEl: HTMLButtonElement;
  protected inputEl: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.cashButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.cashButtonEl.addEventListener("click", () => {
      events.emit("payment:changed", { payment: "cash" });
    });

    this.cardButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cardButtonEl.addEventListener("click", () => {
      events.emit("payment:changed", { payment: "online" });
    });

    this.inputEl = ensureElement<HTMLInputElement>(
      "input[name='address']",
      this.container,
    );
    this.inputEl.addEventListener("input", () => {
      events.emit("address:changed", { address: this.inputEl.value });
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  clear(): void {
    this.cardButtonEl.classList.remove("button_alt-active");
    this.cashButtonEl.classList.remove("button_alt-active");
    this.inputEl.value = "";
  }

  togglePaymentButton(payment: TPayment): void {
    const altActiveClassName = "button_alt-active";
    this.cashButtonEl.classList.toggle(altActiveClassName, payment === "cash");
    this.cardButtonEl.classList.toggle(
      altActiveClassName,
      payment === "online",
    );
  }

  checkValidation(message: TBuyerErrors): boolean {
    this.error = "";
    this.error = message.payment || message.address || "";
    return !message.payment && !message.address;
  }
}
