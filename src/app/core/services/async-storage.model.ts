//CREDIT: this model was inspired from https://github.com/createnextapp/async-local-storage


//#region >> INTERFACES / TYPES <<

export interface ICallback {
  err?: any;
  value?: any;
}

export type CallbackAction = (arg: ICallback) => void | undefined;
export type StoreGetAction = string | null;

//#endregion

//#region >> HELPER METHODS <<

const createPromise = <T>(getValue: () => T, callback?: CallbackAction): Promise<T> => {
  return new Promise((resolve, reject) => {
    try {
      const value = getValue();
      if (callback) {
        callback({value});
      }
      resolve(value);
    } catch (err) {
      if (callback) {
        callback({err});
      }
      reject(err);
    }
  });
};

//#endregion

export class AsyncStorage {
  store: Storage;

  constructor(_store?: Storage) {
    this.store = _store || window.localStorage;
  }

  getItem(key: string, callback?: CallbackAction): Promise<StoreGetAction> {
    return createPromise(() => {
      return window.localStorage.getItem(key);
    }, callback);
  }

  setItem(key: string, value: string, callback?: CallbackAction): Promise<StoreGetAction> {
    return createPromise(() => {
      window.localStorage.setItem(key, value);
      return key;
    }, callback);
  }

  removeItem(key: string, callback?: CallbackAction): Promise<StoreGetAction> {
    return createPromise(() => {
      window.localStorage.removeItem(key);
      return key;
    }, callback);
  }

  getAllKeys(callback?: CallbackAction): Promise<string[]> {
    return createPromise(() => {
      const numberOfKeys = window.localStorage.length;
      const keys: string[] = [];
      for (let i = 0; i < numberOfKeys; i += 1) {
        const key = window.localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    }, callback);
  }

  clear(callback?: CallbackAction): Promise<string[]> {
    return this.getAllKeys()
      .then((keys: string[]) => {
        return createPromise(() => {
          window.localStorage.clear();
          return keys;
        }, callback);      
      });
  }

}