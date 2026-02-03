import "./scss/styles.scss";
import { CatalogueProduct } from "./components/models/CatalogueProduct";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { Api } from "./components/base/Api";
import { ApiCommunication } from "./components/base/ApiCommunication";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
import { CardCatalog } from "./components/view/card/CardCatalog";
import { cloneTemplate, ensureElement } from "./utils/utils";
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
import { Presenter } from "./components/base/Presenter";

const events = new EventEmitter();
const buyer = new Buyer();
const basket = new Basket();
const product = new CatalogueProduct();
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const modal = new Modal(ensureElement<HTMLElement>(".modal"));
const success = new Success(cloneTemplate<HTMLElement>("#success"), events);
const cardBasket = new CardBasket(
  cloneTemplate<HTMLElement>("#card-basket"),
  events,
);
const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  events,
);
const contactForm = new ContactForm(
  cloneTemplate<HTMLElement>("#contacts"),
  events,
);
const form = new OrderForm(cloneTemplate<HTMLElement>("#order"), events);
const cart = new Cart(cloneTemplate<HTMLElement>("#basket"), events);
const preservatif = new Presenter(
  buyer,
  basket,
  product,
  gallery,
  header,
  modal,
  success,
  cardBasket,
  cardPreview,
  contactForm,
  form,
  events,
  cart,
);

//Запрос к серверу за массивом товаров в каталоге
const apiCom = new ApiCommunication(new Api(API_URL));
apiCom
  .getFetch()
  .then((response) => {
    product.setItems(response.items);
    console.log("Сохраненный массив с сервера:", product.getItems());
    events.emit("products:loaded");
  }) //Сохраняем ответ с сервера
  .catch((error) => console.log(error));

const cardPreviewTempalte = cloneTemplate<HTMLElement>("#card-preview");

contactForm.render();

basket.clearBasket();

// events.on("product:select", (item: IProduct) => {
//   product.setItemId(item);
//   modal.render();
//   modal.open(cardPreview.render(item));
// });

// events.on("cart:add_product", (item: IProduct) => {
//   if (!basket.hasProduct(item)) {
//     basket.addItem(item);
//     cardPreview.renderButtonText(basket.hasProduct(item));
//     header.count = basket.getCount();
//   } else {
//     basket.removeItem(item);
//     cardPreview.renderButtonText(basket.hasProduct(item));
//     header.count = basket.getCount();
//   }
// });

// events.on("basket:open", () => {
//   let basketProducts = (basket.getSelectedItems() || []).map((item, index) =>
//     new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), events).render({
//       component: item,
//       index: index,
//     }),
//   );
//   const basketel = new Cart(
//     cloneTemplate<HTMLElement>("#basket"),
//     events,
//   ).render({
//     items: basketProducts,
//     total: basket.getCostProduct(),
//   });
//   modal.render();
//   modal.open(basketel);
// });

// events.on("product:delete", (item: IProduct) => {
//   basket.removeItem(item);
//   header.count = basket.getCount();

//   let basketProducts = (basket.getSelectedItems() || []).map((item, index) =>
//     new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), events).render({
//       component: item,
//       index,
//     }),
//   );
//   const basketel = new Cart(
//     cloneTemplate<HTMLElement>("#basket"),
//     events,
//   ).render({
//     items: basketProducts,
//     total: basket.getCostProduct(),
//   });
//   modal.render();
//   modal.open(basketel);
// });

// events.on("payment:change", (data: { payment: TPayment }) => {
//   buyer.setPayment(data.payment);
//   form.onChange(buyer.validate());
//   form.togglePaymentButton(data.payment);
// });

// events.on("address:change", (data: { address: string }) => {
//   buyer.setAddress(data.address);
//   form.onChange(buyer.validate());
// });

// events.on("email:change", (data: { email: string }) => {
//   buyer.setEmail(data.email);
//   contactForm.onChange(buyer.validate());
// });

// events.on("phone:change", (data: { phone: string }) => {
//   buyer.setPhone(data.phone);
//   contactForm.onChange(buyer.validate());
// });

events.on("order:open", () => {
  modal.content = form.render();
});

events.on("order:submit", () => {
  modal.content = contactForm.render();
});

events.on("order:succes", () => {
  success.total = basket.getCostProduct();
  modal.content = success.render();
});

// events.on("succes:close", () => {
//   modal.close();
//   basket.clearBasket();
//   buyer.clean();
//   form.clear();
//   contactForm.clear();
//   header.count = basket.getCount();
// });
