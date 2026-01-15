import { IApiGet, IApiPost } from "../../types";
import { Api } from "./Api";

export class ApiCommunication {
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
