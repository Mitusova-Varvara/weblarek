import "./scss/styles.scss";
import { CatalogueProduct } from "./components/models/CatalogueProduct";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { Api } from "./components/base/Api";
import { ApiCommunication } from "./components/base/ApiCommunication";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

// проверка работоспособности класса CatalogueProduct
const product = new CatalogueProduct();
product.setItems(apiProducts.items); //сохраняем массив товаров
const allProduct = product.getItems();
console.log("Массив товаров из католога:", allProduct); // массив товаров из католога
const firstProductId = apiProducts.items[0].id;
const selectedProduct = product.getItemId(firstProductId); //получение одного товара по его id

if (selectedProduct) {
  product.setItemId(selectedProduct);
  console.log("Выбранный товар :", product.getItem());
}

// проверка работоспособности класса Basket
const basket = new Basket();
const newProduct = apiProducts.items[0];
basket.addItem(newProduct); // добавляем в корзину товары
basket.addItem(apiProducts.items[1]); // добавляем в корзину товары
const allSelectedProduct = basket.getSelectedItems();
console.log("Товары в корзине:", allSelectedProduct);
console.log(
  "Проверка наличия товара в корзине:",
  basket.hasProduct(newProduct)
);
console.log("Количество товатов в корзине:", basket.getCount());
console.log("Стоимость товаров в корзине:", basket.getCostProduct());
basket.removeItem(newProduct); // удаляем товар из корзины
console.log(
  "Проверка наличия товара в корзине, после удаления:",
  basket.hasProduct(newProduct)
);
basket.clearBasket(); // очистка корзины
console.log("Количество товаров в корзине после очистки:", basket.getCount());

// проверка работоспособности класса Buyer
const buyer = new Buyer();
buyer.setInfoBuyer({
  payment: "online",
  address: "",
  email: "blablabla@email.com",
  phone: "00000000000",
}); // добавляем информацию о новом покупатале
console.log("Данные о новом покупателе:", buyer.getInfoBuyer());
console.log(
  "Валидация неполных данных и вывод сообщения об ошибке",
  buyer.validate()
);
buyer.clean(); // удаление данных о покупателе
console.log("Данные о покупателе после удаления:", buyer.getInfoBuyer());

//Запрос к серверу за массивом товаров в каталоге
const apiCom = new ApiCommunication(new Api(API_URL));
apiCom
  .getFetch()
  .then((response) => {
    product.setItems(response.items);
    console.log("Сохраненный массив с сервера:", product.getItems());
  }) //Сохраняем ответ с сервера
  .catch((error) => console.log(error));
