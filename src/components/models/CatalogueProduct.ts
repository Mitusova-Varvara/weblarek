import { IProduct } from "../../types";

export class CatalogueProduct {
  private items: IProduct[] = []; //хранит массив всех товаров;
  private selectedItem: IProduct | null = null; //хранит товар, выбранный для подробного отображения или не выбран;

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
    for (const item of this.items) {
      if (item.id === id) {
        return item;
      }
    }
    return undefined;
  }

  //сохранение товара для подробного отображения;
  setItemId(item: IProduct | null): void {
    this.selectedItem = item;
  }

  //получение товара для подробного отображения.
  getItem(): IProduct | null {
    return this.selectedItem;
  }
}
