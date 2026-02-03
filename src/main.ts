import "./scss/styles.scss";
import { CatalogueProduct } from "./components/models/CatalogueProduct";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { Api } from "./components/base/Api";
import { ApiCommunication } from "./components/base/ApiCommunication";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
import { CardCatalog } from "./components/view/card/CardCatalog";
import { cloneTemplate } from "./utils/utils";
import { Modal } from "./components/view/Modal";
import { CardPreview } from "./components/view/card/CardPreview";
import { Gallery } from "./components/view/Gallery";
import { CardBasket } from "./components/view/card/CardBasket";
import { Cart } from "./components/view/Cart";
import { OrderForm } from "./components/view/form/OrderForm";
import { ContactForm } from "./components/view/form/ContactForm";
import { EventEmitter } from "./components/base/Events";
import { IProduct, TPayment } from "./types";
import { Header } from "./components/view/Header";
import { Success } from "./components/view/Success";

let events = new EventEmitter();

class Presenter {
  constructor() {}
}

// проверка работоспособности класса CatalogueProduct
const product = new CatalogueProduct();
product.setItems(apiProducts.items); //сохраняем массив товаров
const allProduct = product.getItems();
console.log("Массив товаров из католога:", allProduct); // массив товаров из католога

const basket = new Basket();

// проверка работоспособности класса Buyer
const buyer = new Buyer();

//Запрос к серверу за массивом товаров в каталоге
const apiCom = new ApiCommunication(new Api(API_URL));
apiCom
  .getFetch()
  .then((response) => {
    product.setItems(response.items);
    console.log("Сохраненный массив с сервера:", product.getItems());
    const gallery = document.querySelector(".gallery") as HTMLElement;
    const cards = product
      .getItems()
      .map((prod) =>
        new CardCatalog(cloneTemplate("#card-catalog"), events).render(prod),
      );
    const classGallery = new Gallery(gallery).render({ catalog: cards });
  }) //Сохраняем ответ с сервера
  .catch((error) => console.log(error));

const gallery = document.querySelector(".gallery")!;
let container = document.querySelector(".modal") as HTMLElement;
const modal = new Modal(container);

let cardPreviewTempalte = cloneTemplate<HTMLElement>("#card-preview");

let contactForm = new ContactForm(
  cloneTemplate<HTMLElement>("#contacts"),
  events,
  buyer,
).render();

//modal.render();
//modal.open(contactForm);

let success = new Success(cloneTemplate<HTMLElement>("#success"), events);
//modal.render();
//modal.open(success);

const headerContainer = document.querySelector(".header") as HTMLElement;

const header = new Header(headerContainer, events);

console.log(basket.getSelectedItems());

const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  events,
  basket,
);

events.on("product:select", (item: IProduct) => {
  product.setItemId(item);

  console.log(basket.getSelectedItems());
  modal.render();
  modal.open(cardPreview.render(item));
});

events.on("cart:add_product", (item: IProduct) => {
  if (!basket.hasProduct(item)) {
    basket.addItem(item);
    cardPreview.renderButtonText(basket.hasProduct(item));
    header.count = basket.getCount();
  } else {
    basket.removeItem(item);
    cardPreview.renderButtonText(basket.hasProduct(item));
    header.count = basket.getCount();
  }
});

events.on("basket:open", () => {
  let basketProducts = (basket.getSelectedItems() || []).map((item, index) =>
    new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), events).render({
      component: item,
      index,
    }),
  );
  const basketel = new Cart(
    cloneTemplate<HTMLElement>("#basket"),
    events,
  ).render({
    items: basketProducts,
    total: basket.getCostProduct(),
  });
  modal.render();
  modal.open(basketel);
});

events.on("product:delet", (item: IProduct) => {
  basket.removeItem(item);

  let basketProducts = (basket.getSelectedItems() || []).map((item, index) =>
    new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), events).render({
      component: item,
      index,
    }),
  );
  const basketel = new Cart(
    cloneTemplate<HTMLElement>("#basket"),
    events,
  ).render({
    items: basketProducts,
    total: basket.getCostProduct(),
  });
  modal.render();
  modal.open(basketel);
});

const form = new OrderForm(cloneTemplate<HTMLElement>("#order"), events, buyer);

events.on("order:open", () => {
  modal.content = form.render();
});

events.on("order:submit", () => {
  modal.content = contactForm;
  modal.render();
});

events.on("order:succes", () => {
  success.total = basket.getCostProduct();
  modal.content = success.render();
});

events.on("succes:close", () => {
  modal.close();
  basket.clearBasket();
  header.count = basket.getCount();
});
