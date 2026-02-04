import "./scss/styles.scss";
import { CatalogueProduct } from "./components/models/CatalogueProduct";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { Api } from "./components/base/Api";
import { ApiCommunication } from "./components/base/ApiCommunication";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Modal } from "./components/view/Modal";
import { CardPreview } from "./components/view/card/CardPreview";
import { Gallery } from "./components/view/Gallery";
import { CardBasket } from "./components/view/card/CardBasket";
import { Cart } from "./components/view/Cart";
import { OrderForm } from "./components/view/form/OrderForm";
import { ContactForm } from "./components/view/form/ContactForm";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/view/Header";
import { Success } from "./components/view/Success";
import { Presenter } from "./components/base/Presenter";

const events = new EventEmitter();
const buyer = new Buyer(events);
const basket = new Basket(events);
const product = new CatalogueProduct(events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const modal = new Modal(ensureElement<HTMLElement>(".modal"));
const success = new Success(cloneTemplate<HTMLElement>("#success"), events);
const cardBasket = new CardBasket(cloneTemplate<HTMLElement>("#card-basket"));
const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  {
    onClick: () => {
      events.emit("cart:add_product");
    },
  },
);
const contactForm = new ContactForm(
  cloneTemplate<HTMLElement>("#contacts"),
  events,
);
const form = new OrderForm(cloneTemplate<HTMLElement>("#order"), events);
const cart = new Cart(cloneTemplate<HTMLElement>("#basket"), events);

const apiCom = new ApiCommunication(new Api(API_URL));

new Presenter(
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
  apiCom,
);

apiCom
  .getFetch()
  .then((response) => {
    product.setItems(response.items);
    console.log("Сохраненный массив с сервера:", product.getItems());
    events.emit("products:loaded");
  })
  .catch((error) => console.log(error));
