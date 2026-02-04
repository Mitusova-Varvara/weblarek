import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CatalogueProduct {
  private items: IProduct[] = []; //хранит массив всех товаров;
  private selectedItem: IProduct | null = null; //хранит товар, выбранный для подробного отображения или не выбран;

  constructor(private events: EventEmitter) {}

  //получение массива товаров из модели;
  getItems(): IProduct[] {
    return this.items;
  }

  //сохранение массива товаров полученного в параметрах метода;
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  //получение одного товара по его id;
  getItemId(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  //сохранение товара для подробного отображения;
  setItemId(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit("selected:changed", item);
  }

  //получение товара для подробного отображения.
  getItem(): IProduct | null {
    return this.selectedItem;
  }
}
