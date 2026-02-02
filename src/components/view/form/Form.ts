import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { TBuyerErrors } from "../../../types";

export abstract class Form extends Component<HTMLElement> {
  protected errorsEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.errorsEl = ensureElement<HTMLElement>(".form__errors", this.container);
    this.buttonEl = ensureElement<HTMLButtonElement>(
      '.button[type = "submit"]',
      this.container,
    );
  }

  set error(message: string) {
    this.errorsEl.textContent = message;
  }

  clearErrors(): void {
    this.errorsEl.textContent = "";
  }

  toggleErrorClass(value: boolean): void {
    this.errorsEl.classList.toggle("form__errors-active", value);
  }

  setSubmitEnabled(enabled: boolean): void {
    this.buttonEl.disabled = !enabled;
  }

  resetForm(): void {
    this.clearErrors();
    this.buttonEl.setAttribute("disabled", "true");
  }

  abstract checkValidation(message: TBuyerErrors): boolean;
}
