import { IBuyer, TPayment } from "../../types";
import { TBuyerErrors } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private payment: TPayment = null;
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  constructor(private events: EventEmitter) {}

  //сохранение данных в модели.
  setInfoBuyer(data: Partial<IBuyer>) {
    Object.assign(this as object, data);
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("buyer:change", { value: "payment" });
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:change", { value: "address" });
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:change", { value: "email" });
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:change", { value: "phone" });
  }

  //получение всех данных покупателя;
  getInfoBuyer(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }
  //очистка данных покупателя;
  clean(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  //валидация данных.
  validate(): TBuyerErrors {
    const validationErrors: TBuyerErrors = {};

    if (!this.payment) {
      validationErrors.payment = "Не выбран вид оплаты";
    }
    if (!this.address) {
      validationErrors.address = "Укажите aдресс";
    }
    if (!this.email) {
      validationErrors.email = "Укажите емэйл";
    }
    if (!this.phone) {
      validationErrors.phone = "Укажите номер телефона";
    }

    return validationErrors;
  }
}
