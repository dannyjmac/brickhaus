import { makeAutoObservable, runInAction, toJS } from "mobx";
import { Store } from "../store";

export default class SalesStore {
  private _store: Store;

  sales: any = null;

  constructor(store: Store) {
    makeAutoObservable(this, {}, { deep: false, autoBind: true });

    this._store = store;
  }

  async helloWorld() {
    this._store.api.sales.helloWorld();
    try {
    } catch (err) {
      console.log({ err });
    }
  }
}
