import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { TBuyerErrors } from "../../../types";
import { TPayment } from "../../../types";

export class OrderForm extends Form {
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
      events.emit("payment:change", { payment: "cash" });
    });

    this.cardButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cardButtonEl.addEventListener("click", () => {
      events.emit("payment:change", { payment: "online" });
    });

    this.inputEl = ensureElement<HTMLInputElement>(
      "input[name='address']",
      this.container,
    );
    this.inputEl.addEventListener("input", () => {
      events.emit("address:change", { address: this.inputEl.value });
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  clear(): void {
    this.inputEl.value = "";
  }

  onChange(value: TBuyerErrors) {
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
