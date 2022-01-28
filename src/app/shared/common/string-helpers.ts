//*** pluralize() */
//  USAGE (taken from https://github.com/blakeembrey/pluralize)
//  word: the word to make plural
//  count: optional, used to conditionally make the work plural
//      (e.g. count === 1, leave singular, else make plural)
//      (if count is an array, leave singular if count.filter(Boolean).length === 1)
//  inclusive: optional, if true, include the number in the output (e.g. 3 ducks)

export function pluralize(word: string, count: number | any[] | null = null, inclusive: boolean = false): string {
  //todo: either a) handle the English exceptions or b) use https://github.com/blakeembrey/pluralize
  const es_pattern = /^.*([sxz]|(sh)|(ch))$/;
  const vowelY_pattern = /^.*([aeiou]y)$/;
  const consonantO_pattern = /^.*(a-z&&[^aeiou]o)$/;

  const addS = ['monarch', 'stomach', 'tech'];
  const ignore = ['fish'];

  if (!word) { return ''; }

  const original = word.toLocaleLowerCase();
  const num = Array.isArray(count) ? count.filter(Boolean).length : count;

  if (inclusive === true && typeof(num) === 'number') {
    word = `${num} ${word}`;
  }
  if (num !== 1 && !ignore.includes(original)) {
    if (addS.includes(original) || original.match(vowelY_pattern)) {
      word += 's';
    } else if (original.match(es_pattern) || original.match(consonantO_pattern)) {
      word += 'es';
    } else if (lastCharacter(word) === 'y') {
      word = `${word.substr(0, word.length - 1)}ies`;
    } else {
      word += 's';      //needs to be more robust to handle exceptions
    }
  }

  return word;
}

export function firstCharacter(word: string): string {
  return !word ? '' : word.charAt(0); // word[0];
}

export function lastCharacter(word: string): string {
  return !word ? '' : word.charAt(word.length - 1); // word[word.length - 1];
}

export function singularize(word: string): string {
  //todo: either a) handle the English exceptions or b) use https://github.com/blakeembrey/pluralize

  if (word.endsWith('s')) {
    word = word.substr(0, word.length - 1);      //needs to be more robust to handle exceptions
  }

  return word;
}

export function capitalize(word: string, all: boolean = false): string {
  if (word) {
    if (all) {
      return word.split(' ').map(m => capitalize(m, false)).join(' ');
    } else {
      return word.charAt(0).toLocaleUpperCase() + word.substr(1);
    }
  }

  //else
  return word;
}

export function randomString(length: number, inclDigits: boolean = false): string {
  const letters = "abcdefghijklmnopqrstuvwxyz".split('');
  const digits = "01234566789".split('');
  const chars = inclDigits ? letters.concat(digits) : letters;
  const ret = [];
  for (let i = 0; i < length; i++) {
    ret.push(chars[Math.floor( Math.random() * chars.length )]);
  }

  return ret.join('');
}

export function generateEntityCode(text: string): string {
  if (text) {
    return text.trim().toLocaleLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9\-\_]/gi, '');
  }
  //else
  return '';
}


export function generateUUID(inclDashes: boolean = true): string {
  let uuid = "";
  let random: number;    

  for (let i = 0; i < 32; i++) {      
    // tslint:disable-next-line: no-bitwise
    random = Math.random() * 16 | 0;        

    if (inclDashes && (i === 8 || i === 12 || i === 16 || i === 20)) {        
        uuid += "-";      
    }

    // tslint:disable-next-line: no-bitwise
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);    
  }   

  return uuid;  
}

export function stringCompare(a: string, b: string, ignoreCase: boolean = false): number {
  if (a && b) {
    return ignoreCase ? a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()) : a.localeCompare(b);
  }

  //one is null so
  return !a && !b ? 0 : (!a ? -1 : 1);
}
