
export function randomElementFromArray<T>(array: T[]): T | null {
  if (Array.isArray(array) && array.length > 0) {
    return array[Math.floor(Math.random() * array.length)];
  }
  //else
  return null;
}
export function randomizeArray<T>(array: T[]): T[] {
  if (Array.isArray(array) && array.length > 0) {
    const temp = [...array];  //lets not change the original
    
    //method 1 - use sort
    //return temp.sort(() => Math.random() - 0.5);

    //method 2 - build result
    const ret: T[] = [];
    while(temp.length > 0) {
      ret.push(
        temp.splice(Math.floor(Math.random() * temp.length), 1)[0]  //splice returns array so take the first (only) item
      );
    }
    return ret;
  }
  //else
  return array;
}

export function takeFromArray<T>(array: T[], count: number, immutable: boolean = true): T[] {
  if (Array.isArray(array) && array.length > 0) {
    return (immutable ? [...array] : array).splice(0, Math.min(count, array.length));
  }
  //else
  return array;
}

