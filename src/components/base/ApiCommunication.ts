import { IApiGet, IApiPost } from "../../types";
import { Api } from "./Api";

export interface ApiCommunicationInterface {
  getFetch(): Promise<IApiGet>;
  postOrder(data: IApiPost): void;
}

export class ApiCommunication implements ApiCommunicationInterface {
  api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getFetch(): Promise<IApiGet> {
    return this.api.get<IApiGet>("/product");
  }

  async postOrder(data: IApiPost) {
    return await this.api.post<IApiPost[]>("/order", data);
  }
}
