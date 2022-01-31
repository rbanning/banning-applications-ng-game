import { environment } from "src/environments/environment";

export type MockServiceTarget = { 
  [key: string]: any
};
export type Newable<T> = { new (...args: any[]): T };

export class MockService<T extends MockServiceTarget> {

  constructor(
    type: Newable<T>, 
    instance: any, 
    mockClass: Newable<any>,
    args: any[] = []) {

    if (instance && environment.mock) {
      const names = {
        own: Object.getOwnPropertyNames(instance),
        prototype: Object.getOwnPropertyNames(type.prototype)
      };

      const mock = new mockClass(...args);

      console.log("DEBUG MockService", {instance, names, args, mock});


      [...names.own, ...names.prototype].forEach(name => {
        if (typeof(instance[name]) === 'function' && name !== 'constructor') {
          if (typeof(mock[name]) === 'function') {
            instance[name] = mock[name].bind(mock);
          }
        }
      });
    }
  }

}