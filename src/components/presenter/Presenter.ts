import { IProduct, TPayment } from "../types";
import { cloneTemplate } from "../utils/utils";
import { BasketInterface } from "./models/Basket";
import { BuyerInterface } from "./models/Buyer";
import { CatalogueProductInterface } from "./models/CatalogueProduct";
import { CardBasket } from "./view/card/CardBasket";
import { CardCatalog } from "./view/card/CardCatalog";
import { CardPreview, CardPreviewInterface } from "./view/card/CardPreview";
import { CartInterface } from "./view/Cart";
import { ContactFormInterface } from "./view/form/ContactForm";
import { OrderFormInterface } from "./view/form/OrderForm";
import { GalleryInterface } from "./view/Gallery";
import { HeaderInterface } from "./view/Header";
import { ModalInterface } from "./view/Modal";
import { SuccessInterface } from "./view/Success";
import { ApiCommunicationInterface } from "./base/ApiCommunication";
import { IEvents } from "./base/Events";

export class Presenter {
  protected buyer: BuyerInterface;
  protected basket: BasketInterface;
  protected catalog: CatalogueProductInterface;
  protected gallery: GalleryInterface;
  protected header: HeaderInterface;
  protected modal: ModalInterface;
  protected success: SuccessInterface;
  protected cardPreview: CardPreviewInterface;
  protected contactForm: ContactFormInterface;
  protected orderForm: OrderFormInterface;
  protected events: IEvents;
  protected cart: CartInterface;
  protected api: ApiCommunicationInterface;

  constructor(
    buyer: BuyerInterface,
    basket: BasketInterface,
    catalog: CatalogueProductInterface,
    gallery: GalleryInterface,
    header: HeaderInterface,
    modal: ModalInterface,
    success: SuccessInterface,
    cardPreview: CardPreviewInterface,
    contactForm: ContactFormInterface,
    orderForm: OrderFormInterface,
    events: IEvents,
    cart: CartInterface,
    api: ApiCommunicationInterface,
  ) {
    this.buyer = buyer;
    this.basket = basket;
    this.catalog = catalog;
    this.gallery = gallery;
    this.header = header;
    this.modal = modal;
    this.success = success;
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
      this.modal.render();
      this.modal.open(this.cart.render());
    });

    events.on("succes:close", () => {
      this.succesClose();
    });

    events.on("product:deleted", (product: IProduct) => {
      this.basket.removeItem(product);
      this.renderBasket();
    });

    events.on("basket:changed", () => {
      this.header.count = this.basket.getCount();
      this.cardPreview.renderButtonText(
        this.basket.hasProduct(this.catalog.getItem()!),
      );
      this.renderBasket();
    });

    events.on("product:selected", (product: IProduct) => {
      this.catalog.setItemId(product);
    });
    //

    events.on("selected:changed", (product: IProduct) => {
      this.renderCardPreview(product);

      this.modal.render();
      this.modal.open(this.cardPreview.render(product));
    });

    events.on("order:opened", () => {
      this.renderOrderForm();
    });

    events.on("payment:changed", (data: { payment: TPayment }) => {
      this.buyer.setPayment(data.payment);
    });

    events.on("address:changed", (data: { address: string }) => {
      this.buyer.setAddress(data.address);
    });

    events.on("email:changed", (data: { email: string }) => {
      this.buyer.setEmail(data.email);
    });
    events.on("phone:changed", (data: { phone: string }) => {
      this.buyer.setPhone(data.phone);
    });

    events.on("buyer:changed", (data: { value: string }) => {
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
    } else {
      this.basket.removeItem(item);
    }
  }

  getProduct() {
    this.api
      .getFetch()
      .then((response) => {
        this.catalog.setItems(response.items);
        console.log("Сохраненный массив с сервера:", this.catalog.getItems());
      })
      .catch((error) => console.log(error));
  }

  renderGallery() {
    const cards = this.catalog.getItems().map((prod) =>
      new CardCatalog(cloneTemplate("#card-catalog"), {
        onClick: () => {
          this.events.emit("product:selected", prod);
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
            this.events.emit("product:deleted", item);
          },
        }).render({
          ...item,
          index: index,
        }),
    );
    this.cart.items = basketProducts;
    this.cart.total = this.basket.getCostProduct();
  }

  async succesOpen() {
    try {
      await this.api.postOrder({
        total: this.basket.getCostProduct(),
        items: this.basket.getSelectedItems()?.map((product) => product.id)!,
        ...this.buyer.getInfoBuyer(),
      });
      this.success.total = this.basket.getCostProduct();
      this.modal.content = this.success.render();
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      console.log(this.basket.getSelectedItems());
    }
  }

  succesClose() {
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

  renderCardPreview(item: IProduct): void {
    this.cardPreview = new CardPreview(
      cloneTemplate<HTMLElement>("#card-preview"),
      {
        onClick: () => {
          this.events.emit("cart:add_product", item);
        },
      },
    );
    this.cardPreview.renderButtonText(
      this.basket.hasProduct(this.catalog.getItem()!),
    );
  }

  changeInfoBuyer(data: { value: string }) {
    if (data.value === "payment" || data.value === "address") {
      let isValid = this.orderForm.checkValidation(this.buyer.validate());
      this.orderForm.setSubmitEnabled(isValid);
      this.orderForm.togglePaymentButton(this.buyer.getInfoBuyer().payment);
    } else if (data.value === "email" || data.value === "phone") {
      let isValid = this.contactForm.checkValidation(this.buyer.validate());
      this.contactForm.setSubmitEnabled(isValid);
    }
  }

  renderOrderForm() {
    this.modal.content = this.orderForm.render();
  }

  renderContactForm() {
    this.modal.content = this.contactForm.render();
  }
}
