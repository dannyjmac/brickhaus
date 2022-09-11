import { makeAutoObservable } from "mobx";
import { SalesAPI } from "../api";
import { SalesStore } from "./stores";

export class Store {
  salesStore = new SalesStore(this);

  api: {
    sales: SalesAPI;
  };

  constructor(salesApi: SalesAPI) {
    makeAutoObservable(this, {}, { deep: false, autoBind: true });
    this.api = { sales: salesApi };
  }
}

export const createStore = () => {
  const anApi = new SalesAPI();
  return new Store(anApi);
};
