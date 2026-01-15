import { IApiGet, IApiPost } from "../../types";
import { Api } from "./Api";

export class ApiCommunication {
  api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getFetch(): Promise<IApiGet[]> {
    let result = await this.api.get<{ items: IApiGet[] }>("/product");
    return result.items;
  }

  async postOrder(data: IApiPost) {
    return await this.api.post<IApiPost[]>("/order", data);
  }
}
