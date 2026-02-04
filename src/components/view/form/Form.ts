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

  setSubmitEnabled(enabled: boolean): void {
    this.buttonEl.disabled = !enabled;
  }

  resetForm(): void {
    this.error = "";
    this.buttonEl.setAttribute("disabled", "true");
  }

  abstract checkValidation(message: TBuyerErrors): boolean;
}
