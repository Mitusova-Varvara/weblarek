import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { TBuyerErrors } from "../../../types";

export interface ContactFormInterface extends Form {
  clear(): void;
  checkValidation(message: TBuyerErrors): boolean;
}

export class ContactForm extends Form implements ContactFormInterface {
  protected emailInputEl: HTMLInputElement;
  protected phoneInputEl: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.emailInputEl = ensureElement<HTMLInputElement>(
      "input[name='email']",
      this.container,
    );
    this.emailInputEl.addEventListener("input", () => {
      events.emit("email:changed", { email: this.emailInputEl.value });
    });

    this.phoneInputEl = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      this.container,
    );
    this.phoneInputEl.addEventListener("input", () => {
      events.emit("phone:changed", { phone: this.phoneInputEl.value });
    });

    this.buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("order:succes");
    });
  }

  clear(): void {
    this.emailInputEl.value = "";
    this.phoneInputEl.value = "";
  }

  checkValidation(message: TBuyerErrors): boolean {
    this.error = message.email || message.phone || "";
    return !message.email && !message.phone;
  }
}
