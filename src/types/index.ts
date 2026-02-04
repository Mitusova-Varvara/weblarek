export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "online" | "cash" | null;
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export interface IApiGet {
  total: number;
  items: IProduct[];
}

export interface IApiPost extends IBuyer {
  total: number;
  items: IProduct[];
}

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
