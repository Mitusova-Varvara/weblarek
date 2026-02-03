import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { IBuyer, TBuyerErrors } from "../../../types";

export class ContactForm extends Form {
  protected EmailInputEl: HTMLInputElement;
  protected PhoneInputEl: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected data: Partial<IBuyer> = {},
  ) {
    super(container);
    this.EmailInputEl = ensureElement<HTMLInputElement>(
      "input[name='email']",
      this.container,
    );
    this.EmailInputEl.addEventListener("input", () => {
      this.data.email = this.EmailInputEl.value;
      this.onChange();
    });

    this.PhoneInputEl = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      this.container,
    );
    this.PhoneInputEl.addEventListener("input", () => {
      this.data.phone = this.PhoneInputEl.value;
      this.onChange();
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:succes");
    });
  }

  onChange() {
    this.events.emit("buyer:change", this.data);
  }

  setValidationErrors(value: TBuyerErrors) {
    const validation = value;
    const isValid = this.checkValidation(validation);

    this.setSubmitEnabled(isValid);
  }

  clear(): void {
    this.data = {};
    this.EmailInputEl.value = "";
    this.PhoneInputEl.value = "";
  }

  checkValidation(message: TBuyerErrors): boolean {
    this.clearErrors();
    this.error = message.email || message.phone || "";
    return !message.email && !message.phone;
  }
}
