import { IBuyer, TPayment } from "../../types";
import { TBuyerErrors } from "../../types";

export class Buyer {
  private payment: TPayment = null;
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  //сохранение данных в модели.
  setInfoBuyer(data: Partial<IBuyer>) {
    if (data.payment) {
      this.payment = data.payment;
    }
    if (data.address) {
      this.address = data.address;
    }
    if (data.email) {
      this.email = data.email;
    }
    if (data.phone) {
      this.phone = data.phone;
    }
  }

  setPayment(value: TPayment): void {
    this.payment = value;
  }

  setAddress(value: string): void {
    this.address = value;
  }

  setEmail(value: string): void {
    this.email = value;
  }

  setPhone(value: string): void {
    this.phone = value;
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
