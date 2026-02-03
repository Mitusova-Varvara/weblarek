https://github.com/Mitusova-Varvara/weblarek

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

В ходе анализа проекта было установлено: в приложении используются две сущности, которые описывают данные, — **товар** и **покупатель**.

`interface IProduct {id: string, description: string, image: string, title: string, category: string, price: number | null}` - объект с данными о товаре.
`interface IBuyer {payment: TPayment, email: string, phone: string, address: string, total: number, items: string[]}` - объект с данными о покупателе.

### Модели данных

### Класс CatalogueProduct

Содержит логику обработки и хранения каталога товаров.

Поля класса:
`private items: IProduct[] = []` - хранит массив всех товаров.
`private selectedItem: IProduct | null` - хранит товар, выбранный для подробного отображения.

Методы класса:
`getItems(): IProduct[] { return this.items}` - получение массива товаров из модели.
`setItems(items: IProduct[]): void {this.items = items}` - сохранение массива товаров полученного в параметрах метода.
`getItemId(id: string): IProduct | undefined {for (const item of this.items) {if (item.id === id) {return item}}return undefined}` - получение одного товара по его id.
`setItemId(item: IProduct | null): void { this.selectedItem = item }` - сохранение товара для подробного отображения.
`getItem(): IProduct | null {return this.selectedItem }` - получение товара для подробного отображения.

### Класс Basket

Поля класса:
`private selectedItems: IProduct[] = []` - хранит массив товаров, выбранных покупателем для покупки.

Методы класса:
`getSelectedItems(): IProduct[] | null {return this.selectedItems}` - получение массива товаров, которые находятся в корзине.
`addItem(item: IProduct): void {if (!this.selectedItems.includes(item)) {this.selectedItems.push(item);}}` - добавление товара, который был получен в параметре, в массив корзины.
`removeItem(item: IProduct): void {if (this.selectedItems.includes(item)) {this.selectedItems.filter((p) => p.id != item.id);}}` - удаление товара, полученного в параметре из массива корзины;
`clearBasket(): void {this.selectedItems = [];}` - очистка корзины.
`getCostProduct(): number {return this.selectedItems.reduce((acc, product) => acc + (product.price ?? 0),0);}` - получение стоимости всех товаров в корзине.
`getCount(): number {return this.selectedItems.length}` - получение количества товаров в корзине;
`hasProduct(item: IProduct): boolean {return this.selectedItems.some((p) => p.id === item.id);}` - проверка наличия товара в корзине по его id, полученного в параметр метода.

### Класс Buyer

Поля класса:
`private payment: TPayment = null;` - хранит способ опраты, использован тип TPayment.
`private address: string = "";` - хранит указанный адрес доставки.
`private email: string = "";` - хранит емэйл покупателя.
`private phone: string = "";` - хранит номер телефона покупателя.

Методы класса:
`setInfoBuyer(data: Partial<IBuyer>) {Object.assign(this as object, data)}` - сохранение данных в модели.
`getInfoBuyer() {return {payment: this.payment, address: this.address, email: this.email, phone: this.phone,};}` - получение всех данных покупателя;
`clean(): void {this.payment = null; this.address = ""; this.email = ""; this.phone = "";}` - очистка данных покупателя;
`validate(): ValidationErrors {let validationErrors: ValidationErrors = {};if (!this.payment) {validationErrors.payment = "Не выбран вид оплаты";} else if (!this.address) {validationErrors.address = "Укажите aдресс";} else if (!this.email) {validationErrors.email = "Укажите емэйл";} else if (!this.phone) {validationErrors.phone = "Укажите номер телефона";}return validationErrors;}` - валидация данных. Поле является валидным, если оно не пустое. Метод дает возможность определить не только валидность каждого отдельного поля, но и предоставлять информацию об ошибке, связанной с проверкой конкретного значения.

### Слой коммуникации

### Касс ApiCommunication

В классе реализованна логика отправки и получения данных на сервер на основе композиции с классом Api.

Поля класса:
`api: Api` - композиция с классом Api.

Методы класса:

`async getFetch(): Promise<IApiGet[]> {let result = await this.api.get<{ items: IApiGet[] }>("/product");return result.items;}` - выполняет запрос на сервер с помощью метода get класса Api и получает с сервера объект с массивом товаров.
`async postOrder(data: IApiPost) {return await this.api.post<IApiPost[]>("/order", data);}` - отправляет данные на сервер с помощью метода post класса Api.

### Слой Представления

#### Класс Header

Поля класса:
`protected counterEl: HTMLElement` - хранит элемент html разметки с числом продуктов в корзине.
`protected buttonEl: HTMLButtonElement` - хранит элемент html разметки с кнопкой, открывающей корзину

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий

Инициируется событие: `basket:open` - при нажатии на иконку корзины открывается корзина;

Методы класса:
`set count(value: number) {this.counterEl.textContent = String(value)}` - отображение счетчика с количеством продуктов в корзине.

#### Класс Gallery

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером

Методы класса:
`set catalog(items: HTMLElement[]) {this.container.replaceChildren(...items)}` - отображение каталога товаров;

#### Класс Cart

Поля класса:
`protected listBasketEl: HTMLElement` - хранит элемент html разметки со списком товаров.
`protected basketButtonEl: HTMLButtonElement` - хранит элемент html разметки с кнопкой, отрывающей форму заказа.
`protected totalPriceEl: HTMLElement` - хранит элемент html разметки, отображающий общую стоимость товаров в корзине.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий

Инициируется событие: `order:open` - при нажатии на кнопку «Оформить» открывается модальное окно с формой оформления товара.

Методы класса:
`set items(list: HTMLElement[]) {this.basketButtonEl.disabled = list.length === 0; this.listBasketEl.replaceChildren(...list)}` - отображается список товаров, которые выбрал покупатель и если в корзине нет товаров, кнопка оформления должна быть деактивирована.

`set total(value: number) {this.totalPriceEl.textContent = `${value} синапсов`}` - отображается общая стоимость товаров в корзине;

#### Класс Modal

Поля класса:
`protected contentEl: HTMLElement` - элемент html разметки с контейнером, где рендерится информация из дочерних классов: OrderForm и ContactForm.
`protected buttonEl: HTMLButtonElement` - элемент html разметки с кнопкой, закрывающей модальное окно.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером

Методы класса:
`set content(value: HTMLElement) {this.contentEl.replaceChildren(value)}` - отображается информация из дочерних классов: OrderForm и ContactForm.
`open(value: HTMLElement) {this.container.classList.add("modal_active");this.contentEl.replaceChildren(value);}` - открытие модального окна с информацией от дочерних классов.
`close() {this.container.classList.remove("modal_active")}` - закрытие модального окна.

#### Класс Success

Поля класса:
`protected totalCostEl: HTMLElement` - хранит элемент html разметки, отображающий общую стоимость товаров в заказе.
`protected closeButton: HTMLButtonElement` - хранит элемент html разметки с кнопкой, закрывающей окно успешного оформления заказа.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий

Инициируется событие: `succes:close` - при нажатии на кнопку оплаты выполняется передача данных о заказе на сервер, появляется сообщение об успешной оплате, товары удаляются из корзины, данные покупателя очищаются.

Методы класса:
`set total(value: number) {this.totalCostEl.textContent = `Списано ${value} синапсов`}` - отображается общая стоимость товаров в заказе.

#### Класс Form

Поля класса:
`protected errorsEl: HTMLElement` - хранит элемент html разметки, отображающий ошибки при валидации.
`protected buttonEl: HTMLButtonElement` - хранит элемент html разметки с кнопкой «Далее», может быть активной, если: на форме нет ошибок, выбран способ оплаты и поле адреса доставки непустое;

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером

Методы класса:
`set error(message: string) {this.errorsEl.textContent = message}` - если одно из полей не заполнено, появляется сообщение об ошибке;
`clearErrors(): void {this.errorsEl.textContent = ""}` - очищение элемента разметки с сообщениями об ошибках.
`toggleErrorClass(value: boolean): void {this.errorsEl.classList.toggle("form__errors-active", value)}` - отображение сообщений об ошибках.
`setSubmitEnabled(enabled: boolean): void {this.buttonEl.disabled = !enabled}`- изменение активности кнопки «Далее».
`resetForm(): void {this.clearErrors();this.buttonEl.setAttribute("disabled", "true")}` - приведение формы в изначальное состояние.
`abstract checkValidation(message: TBuyerErrors): boolean;` - валидация данных формы.

#### Класс OrderForm

Поля класса:
`protected cashButtonEl: HTMLButtonElement` - элемент html разметки с выбором оплаты "При получении".
`protected cardButtonEl: HTMLButtonElement` - элемент html разметки с выбором оплаты "Онлайн".
`protected inputEl: HTMLInputElement` - элемент html разметки с полем ввода "Адресс".

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий
`protected data: Partial<IBuyer> = {}` - объект с данными типа IBuyer.

Инициируется события:
`order:submit` - открывается модальное окно с рендером класса ContactForm
`buyer:change` - сохраняются изменения в данных, вводимых пользователем, в объект с данными типа IBuyer.

Методы класса:
`clear(): void ` - очистка формы
`onChange() {this.events.emit("buyer:change", this.data)}` - метод, который помогает реагировать на любые изменения в данных, вводимых пользователем.
`setValidationErrors(value: TBuyerErrors)` - отображение ошибок при валидации формы и блокировка кнопки «Далее».
`togglePaymentButton(payment: TPayment): void `- при выборе оплаты используется модификатор 'button_alt-active' для выделения кнопки с выбранным видом оплаты.
`checkValidation(message: TBuyerErrors): boolean` - валидация формы.

#### Класс ContactForm

Поля класса:
`protected EmailInputEl: HTMLInputElement` - элемент html разметки с полем ввода "почта".
`protected PhoneInputEl: HTMLInputElement` - элемент html разметки с полем ввода "телефон".

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий
`protected data: Partial<IBuyer> = {}` - объект с данными типа IBuyer.

Инициируется события:
`order:succes` - открывается модальное окно с модальным окном успешного выполнения заказа.
`buyer:change` - сохраняются изменения в данных, вводимых пользователем, в объект с данными типа IBuyer.

Методы класса:
`clear(): void ` - очистка формы
`onChange() {this.events.emit("buyer:change", this.data)}` - метод, который помогает реагировать на любые изменения в данных, вводимых пользователем.
`setValidationErrors(value: TBuyerErrors)` - отображение ошибок при валидации формы и блокировка кнопки «Далее».
`checkValidation(message: TBuyerErrors): boolean` - валидация формы.

#### Класс Card

Поля класса:
`protected titleEl: HTMLElement` - элемент html разметки с названием товара.
`protected priceEl: HTMLElement` - элемент html разметки с ценой товара.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected evt: IEvents` - брокер событий

Методы класса:
`set title(value: string) {this.titleEl.textContent = value}` - отображение названия товара в карточке.
`set price(value: number | null) {this.priceEl.textContent = value ? `${value} синапсов` : "Бесценно"}` - отображение цены товара в карточке, если она есть, если нет - "Бесценно".

#### Класс CardBasket

Поля класса:
`protected indexEl: HTMLElement;` - элемент html разметки с индексом товара в корзине.
`protected deletButtonEl: HTMLButtonElement;` - элемент html разметки с кнопкой, удаляющей товар из корзины.
`private curentItem: IProduct | null = null;` - отображает карточку товара, которую выбрал пользователь.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий

Инициируется события:
`product:delete` - товар удаляется из корзины.

Методы класса:
`set index(value: number) {this.indexEl.textContent = String((value || 0) + 1);}` - отображение индекса товара в корзине.
`render(product: ICardBasket): HTMLElement` - рендер корзины.

#### Класс CardCatalog

Поля класса:
`protected imageEl: HTMLImageElement` - элемент html разметки с изображением товара в каталоге.
`protected categoryEl: HTMLElement` - элемент html разметки с категорией товара в каталоге.
`private curentItem: IProduct | null = null;` - отображает карточку товара, которую выбрал пользователь.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий

Инициируется события:
`product:select` - отображается подробная информация о товаре.

Методы класса:
`set image(value: string) ` - рендер картинки
`set category(value: string) ` - рендер категории
`render(product: IProduct): HTMLElement` - рендер карточки товара в каталоге.

#### Класс CardPreview

`protected imageEl: HTMLImageElement` - элемент html разметки с изображением товара в каталоге.
`protected categoryEl: HTMLElement` - элемент html разметки с категорией товара в каталоге.
`private curentItem: IProduct | null = null;` - отображает карточку товара, которую выбрал пользователь.
`protected descriptionEl: HTMLElement` - элемент html разметки с описанием товара в каталоге.
`protected buttonEl: HTMLButtonElement`- элемент html разметки с описанием кнопкой, добавляющей товар в корзину.

Конструктор класса принимает параметры:
`container: HTMLElement` - элемент html разметки с контейнером
`protected events: IEvents` - брокер событий

Инициируется события:
`cart:add_product` - отображает добавление товара в корзину.

Методы класса:
`set image(value: string) ` - рендер картинки.
`set category(value: string) ` - рендер категории.
`set description(value: string)` - рендер описания.
`renderButtonText(value: boolean): void ` - рендер текста в кнопке, в зависимости от ее состояния.
`render(product: IProduct): HTMLElement` - рендер карточки товара в каталоге.

### Презентер

#### Класс Presenter

Поля класса:
Экземпляры всех классов слоя Представления, слоя Модели данных, брокер событий и слой коммуникации.

Инициируется события:
`cart:add_product` - отображает добавление товара в корзину.
`products:loaded` - отображается галерея с товарами.
`basket:open` - открывается корзина с товарами.
`product:select` - отображается подробная информация о товаре.
`product:delete` - товар удаляется из корзины.
`order:open` - открывается модальное окно с рендером класса OrderForm.
`order:succes` - открывается модальное окно с модальным окном успешного выполнения заказа.
`order:submit` - открывается модальное окно с рендером класса ContactForm
`succes:close` - закрывается модальное окно с успешным выполнением заказа.
`buyer:change` - сохраняются изменения в данных, вводимых пользователем, в объект с данными типа IBuyer.

Методы класса:
`cartAddProduct(item: IProduct): void` - добавление товара в корзину.
`renderGallery()` - рендер галереи с товарами.
`renderBasket()` - рендер корзины с товарами.
`succesOpen()` - открывается модальное окно с модальным окном успешного выполнения заказа.
`succesClose()` - закрывается модальное окно с успешным выполнением заказа.
`productDeleteFromCart(item: IProduct): void` - товар удаляется из корзины.
`openPreview(item: IProduct): void` - отображается подробная информация о товаре.
`changeInfoBuyer(data: Partial<IBuyer>)` - сохраняются изменения в данных, вводимых пользователем, в объект с данными типа IBuyer.
`renderOrderForm()` - открывается модальное окно с рендером класса OrderForm.
`renderContactForm()` - открывается модальное окно с рендером класса ContactForm.
