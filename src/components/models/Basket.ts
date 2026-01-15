import { IProduct } from "../../types";

export class Basket {
  //хранит массив товаров, выбранных покупателем для покупки.
  private selectedItems: IProduct[] = [];

  //получение массива товаров, которые находятся в корзине;
  getSelectedItems(): IProduct[] | null {
    return this.selectedItems;
  }

  //проверка наличия товара в корзине по его id, полученного в параметр метода.
  hasProduct(item: IProduct): boolean {
    return this.selectedItems.some((p) => p.id === item.id);
  }

  //добавление товара, который был получен в параметре, в массив корзины;
  addItem(item: IProduct): void {
    if (!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    }
  }

  //удаление товара, полученного в параметре из массива корзины;
  removeItem(item: IProduct): void {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter((p) => p.id != item.id);
    }
  }

  //очистка корзины;
  clearBasket(): void {
    this.selectedItems = [];
  }

  //получение стоимости всех товаров в корзине;
  getCostProduct(): number {
    return this.selectedItems.reduce(
      (acc, product) => acc + (product.price ?? 0),
      0
    );
  }

  //получение количества товаров в корзине;
  getCount(): number {
    return this.selectedItems.length;
  }
}
