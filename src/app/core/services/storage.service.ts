import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as common from '@app/shared/common';
import { AsyncStorage } from './async-storage.model';

//setup the storage store
const storageStore = new AsyncStorage(window.localStorage || window.sessionStorage);

//private 
class StoredObject {
  key: string | null = null;
  data: any = null;
  expires: dayjs.Dayjs | null = null;

  constructor(obj: any = null) {
    if (obj) {
      this.key = obj.key;
      this.data = obj.data;
      this.expires = obj.expires ? dayjs(obj.expires) : null;
    }
  }

  isExpired() {
    return common.dateUtils.isPastDue(this.expires);
  }

  serialize(): string {
    return btoa(JSON.stringify(this));
  }

  public static Create(key: string, data: any, expiresInMinutes: number | null = null) {
    const ret = new StoredObject();
    ret.key = key;
    ret.data = data;
    if (expiresInMinutes) { ret.expires = dayjs().add(expiresInMinutes, "minute"); }
    return ret;
  }

  public static Deserialize(code: string) {
    const obj = JSON.parse(atob(code));
    return new StoredObject(obj);
  }
}

@Injectable()
export class StorageService {

  constructor() { }

  async set(key: string, value: any, expiresInMinutes: number | null = null) {
    const obj = StoredObject.Create(key, value, expiresInMinutes);
    await storageStore.setItem(key,obj.serialize());
  }

  async get(key: string) {
    const result = await storageStore.getItem(key);
    if (result) {
      const obj = StoredObject.Deserialize(result);
      if (obj.isExpired()) {
        //remove the expired data
        await this.remove(key);
        return null;
      } else {
        return obj.data;
      }
    }
    //else
    return null;
  }

  async remove(key: string) {
    return await storageStore.removeItem(key);
  }

  async keys() {
    return await storageStore.getAllKeys();
  }

  async clear() {
    return await storageStore.clear();
  }

}
