import { IBuyer, IProduct, TPayment } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Basket } from "../models/Basket";
import { Buyer } from "../models/Buyer";
import { CatalogueProduct } from "../models/CatalogueProduct";
import { CardBasket } from "../view/card/CardBasket";
import { CardCatalog } from "../view/card/CardCatalog";
import { CardPreview } from "../view/card/CardPreview";
import { Cart } from "../view/Cart";
import { ContactForm } from "../view/form/ContactForm";
import { OrderForm } from "../view/form/OrderForm";
import { Gallery } from "../view/Gallery";
import { Header } from "../view/Header";
import { Modal } from "../view/Modal";
import { Success } from "../view/Success";
import { ApiCommunication } from "./ApiCommunication";
import { IEvents } from "./Events";

export class Presenter {
  protected buyer: Buyer;
  protected basket: Basket;
  protected catalog: CatalogueProduct;
  protected gallery: Gallery;
  protected header: Header;
  protected modal: Modal;
  protected success: Success;
  protected cardBasket: CardBasket;
  protected cardPreview: CardPreview;
  protected contactForm: ContactForm;
  protected orderForm: OrderForm;
  protected events: IEvents;
  protected cart: Cart;
  protected api: ApiCommunication;

  constructor(
    buyer: Buyer,
    basket: Basket,
    catalog: CatalogueProduct,
    gallery: Gallery,
    header: Header,
    modal: Modal,
    success: Success,
    cardBasket: CardBasket,
    cardPreview: CardPreview,
    contactForm: ContactForm,
    orderForm: OrderForm,
    events: IEvents,
    cart: Cart,
    api: ApiCommunication,
  ) {
    this.buyer = buyer;
    this.basket = basket;
    this.catalog = catalog;
    this.gallery = gallery;
    this.header = header;
    this.modal = modal;
    this.success = success;
    this.cardBasket = cardBasket;
    this.cardPreview = cardPreview;
    this.contactForm = contactForm;
    this.orderForm = orderForm;
    this.events = events;
    this.cart = cart;
    this.api = api;

    events.on("cart:add_product", (product: IProduct) => {
      this.cartAddProduct(product);
    });

    events.on("products:loaded", () => {
      this.renderGallery();
    });

    events.on("basket:open", () => {
      this.renderBasket();
    });

    events.on("succes:close", () => {
      this.succesClose();
    });

    events.on("product:delete", (product: IProduct) => {
      this.basket.removeItem(product);
    });

    events.on("basket:changed", () => {
      this.header.count = this.basket.getCount();
    });

    events.on("product:select", (product: IProduct) => {
      this.openPreview(product);
    });

    events.on("order:open", () => {
      this.renderOrderForm();
    });

    events.on("payment:change", (data: { payment: TPayment }) => {
      this.buyer.setPayment(data.payment);
    });

    events.on("address:change", (data: { address: string }) => {
      this.buyer.setAddress(data.address);
    });

    events.on("email:change", (data: { email: string }) => {
      this.buyer.setEmail(data.email);
    });
    events.on("phone:change", (data: { phone: string }) => {
      this.buyer.setPhone(data.phone);
    });

    events.on("buyer:change", (data: { value: string }) => {
      this.changeInfoBuyer(data);
    });

    events.on("order:submit", () => {
      this.renderContactForm();
    });

    events.on("order:succes", () => {
      this.succesOpen();
    });
  }

  cartAddProduct(item: IProduct): void {
    if (!this.basket.hasProduct(item)) {
      this.basket.addItem(item);
      this.cardPreview.renderButtonText(this.basket.hasProduct(item));
      this.header.count = this.basket.getCount();
    } else {
      this.basket.removeItem(item);
      this.cardPreview.renderButtonText(this.basket.hasProduct(item));
      this.header.count = this.basket.getCount();
    }
  }

  renderGallery() {
    const cards = this.catalog.getItems().map((prod) =>
      new CardCatalog(cloneTemplate("#card-catalog"), {
        onClick: () => {
          this.events.emit("product:select", prod);
        },
      }).render(prod),
    );
    this.gallery.render({ catalog: cards });
  }

  renderBasket() {
    let basketProducts = (this.basket.getSelectedItems() || []).map(
      (item, index) =>
        new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), {
          onClick: () => {
            this.events.emit("product:delete", item);
          },
        }).render({
          ...item,
          index: index,
        }),
    );
    const basketel = this.cart.render({
      items: basketProducts,
      total: this.basket.getCostProduct(),
    });
    this.modal.open(basketel);
    this.modal.render();
  }

  succesOpen() {
    this.success.total = this.basket.getCostProduct();
    this.modal.content = this.success.render();
  }

  succesClose() {
    this.api.postOrder({
      total: this.basket.getCostProduct(),
      items: this.basket.getSelectedItems()!,
      ...this.buyer.getInfoBuyer(),
    });
    this.modal.close();
    this.basket.clearBasket();
    this.buyer.clean();
    this.orderForm.clear();
    this.contactForm.clear();
    this.header.count = this.basket.getCount();
  }

  productDeleteFromCart(item: IProduct): void {
    this.basket.removeItem(item);
    this.header.count = this.basket.getCount();
    this.renderBasket();
  }

  openPreview(item: IProduct): void {
    this.catalog.setItemId(item);
    this.cardPreview.renderButtonText(this.basket.hasProduct(item));
    this.modal.render();
    this.modal.open(this.cardPreview.render(item));
  }

  changeInfoBuyer(data: { value: string }) {
    if (data.value === "payment" || data.value === "address") {
      let isValid = this.orderForm.checkValidation(this.buyer.validate());
      this.orderForm.setSubmitEnabled(isValid);
      this.orderForm.togglePaymentButton(this.buyer.getInfoBuyer().payment);
    } else if (data.value === "email" || data.value === "phone") {
      this.contactForm.setValidationErrors(this.buyer.validate());
    }
  }

  renderOrderForm() {
    this.modal.content = this.orderForm.render();
  }

  renderContactForm() {
    this.modal.content = this.contactForm.render();
  }
}
