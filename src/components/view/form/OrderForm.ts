import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { IBuyer, TBuyerErrors } from "../../../types";
import { TPayment } from "../../../types";

export class OrderForm extends Form {
  protected cashButtonEl: HTMLButtonElement;
  protected cardButtonEl: HTMLButtonElement;
  protected inputEl: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected data: Partial<IBuyer> = {},
  ) {
    super(container);
    this.cashButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.cashButtonEl.addEventListener("click", () => {
      this.data.payment = "cash";
      this.onChange();
    });

    this.cardButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cardButtonEl.addEventListener("click", () => {
      this.data.payment = "online";
      this.onChange();
    });

    this.inputEl = ensureElement<HTMLInputElement>(
      "input[name='address']",
      this.container,
    );
    this.inputEl.addEventListener("input", () => {
      this.data.address = this.inputEl.value;
      this.onChange();
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  clear(): void {
    this.data = {};
    this.cardButtonEl.classList.remove("button_alt-active");
    this.cashButtonEl.classList.remove("button_alt-active");
    this.inputEl.value = "";
    this.onChange();
  }

  onChange() {
    this.events.emit("buyer:change", this.data);
  }

  setValidationErrors(value: TBuyerErrors) {
    const validation = value;
    const isValid = this.checkValidation(validation);

    this.setSubmitEnabled(isValid);
  }

  togglePaymentButton(payment: TPayment): void {
    const altActiveClassName = "button_alt-active";

    if (payment == "cash") {
      this.cashButtonEl.classList.add(altActiveClassName);
      this.cardButtonEl.classList.remove(altActiveClassName);
    } else if (payment == "online") {
      this.cashButtonEl.classList.remove(altActiveClassName);
      this.cardButtonEl.classList.add(altActiveClassName);
    }
  }

  checkValidation(message: TBuyerErrors): boolean {
    this.clearErrors();
    this.error = message.payment || message.address || "";
    return !message.payment && !message.address;
  }
}
