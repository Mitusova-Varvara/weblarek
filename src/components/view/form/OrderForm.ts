import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { TBuyerErrors } from "../../../types";
import { Buyer } from "../../models/Buyer";

export class OrderForm extends Form {
  protected cashButtonEl: HTMLButtonElement;
  protected cardButtonEl: HTMLButtonElement;
  protected inputEl: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected buyer: Buyer,
  ) {
    super(container);
    this.cashButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.cashButtonEl.addEventListener("click", () => {
      this.buyer.setPayment("cash");
      this.onChange();
    });
    this.cardButtonEl = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );

    this.cardButtonEl.addEventListener("click", () => {
      this.buyer.setPayment("online");
      this.onChange();
    });

    this.inputEl = ensureElement<HTMLInputElement>(
      "input[name='address']",
      this.container,
    );
    this.inputEl.addEventListener("input", () => {
      this.buyer.setAddress(this.inputEl.value);
      this.onChange();
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  clear(): void {
    this.inputEl.value = "";
  }

  onChange() {
    const validation = this.buyer.validate();
    const isValid = this.checkValidation(validation);

    this.setSubmitEnabled(isValid);
    this.togglePaymentButton();
  }

  togglePaymentButton(): void {
    const altActiveClassName = "button_alt-active";
    const payment = this.buyer.getInfoBuyer().payment;

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
