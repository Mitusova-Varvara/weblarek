import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { TBuyerErrors } from "../../../types";

export class ContactForm extends Form {
  protected EmailInputEl: HTMLInputElement;
  protected PhoneInputEl: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.EmailInputEl = ensureElement<HTMLInputElement>(
      "input[name='email']",
      this.container,
    );
    this.EmailInputEl.addEventListener("input", () => {
      events.emit("email:change", { email: this.EmailInputEl.value });
    });

    this.PhoneInputEl = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      this.container,
    );
    this.PhoneInputEl.addEventListener("input", () => {
      events.emit("phone:change", { phone: this.PhoneInputEl.value });
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:succes");
    });
  }

  onChange(value: TBuyerErrors) {
    const validation = value;
    const isValid = this.checkValidation(validation);

    this.setSubmitEnabled(isValid);
  }

  clear(): void {
    this.EmailInputEl.value = "";
    this.PhoneInputEl.value = "";
  }

  checkValidation(message: TBuyerErrors): boolean {
    this.clearErrors();
    this.error = message.email || message.phone || "";
    return !message.email && !message.phone;
  }
}
