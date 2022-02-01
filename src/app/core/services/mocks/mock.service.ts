
export type MockServiceTarget = { 
  [key: string]: any
};
export type Newable<T> = { new (...args: any[]): T };

export class MockService<T extends MockServiceTarget> {

  constructor(
    serviceName: string,
    type: Newable<T>, 
    instance: any, 
    mockClass: Newable<any>,
    args: any[] = []) {

    if (instance) {
      const names = {
        own: Object.getOwnPropertyNames(instance),
        prototype: Object.getOwnPropertyNames(type.prototype)
      };

      const mock = new mockClass(...args);

      console.log(`MOCK: ${serviceName} is using MockService`, {instance, names, args, mock});


      [...names.own, ...names.prototype].forEach(name => {
        if (name !== 'constructor') {
          if (typeof(mock[name]) === typeof(instance[name])) {
            if (typeof(mock[name]) === 'function') {
              instance[name] = mock[name].bind(mock);
            } else {
              instance[name] = mock[name];
            }
          }
        }
      });
    }
  }

}