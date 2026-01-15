import { TPayment } from "../../types";
import { ValidationErrors } from "../../types";

export class Buyer {
  private payment: TPayment = null;
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  //сохранение данных в модели.
  setInfoBuyer(data: {
    payment?: TPayment;
    address?: string;
    email?: string;
    phone?: string;
  }) {
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

  //получение всех данных покупателя;
  getInfoBuyer() {
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
  validate(): ValidationErrors {
    let validationErrors: ValidationErrors = {};

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
