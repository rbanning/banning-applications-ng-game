
export interface IHttpErrorResponse {
  status: number;
  statusText: string;
  errors: string[];
}

export const processHttpResponse = (resp: any): boolean | IHttpErrorResponse => {
  if (resp) {
    if (typeof(resp.success) === 'boolean') {
        return resp.success;
    } else if (resp.error || resp.errors || resp.status > 300) {
        return parseHttpError(resp) || false;
    }
  }
  //else
  console.warn("UNABLE TO PROCESS HTTP RESPONSE", resp);
  return false;
};

export const simpleHttErrorResponse = (message: string, status: number = 0, statusText: string = 'error') => {
  return { status, statusText, errors: [message]};
};

export const parseHttpError = (resp: any): IHttpErrorResponse | null => {
  if (resp) {
    const status = resp.status || 0;
    const statusText = resp.statusText;
    const errors = _parseError(resp.error || resp.errors);
    return { status, statusText, errors };
  }
  //else
  return null;
};

export const httpErrorToString = (resp: IHttpErrorResponse | any): string | null => {
  if (!Array.isArray(resp.errors)) {
    resp.errors = _parseError(resp);
  }

  if (Array.isArray(resp.errors) && resp.errors.length > 0) {
    return resp.errors.join('; ');
  } 
  else if (typeof(resp.status) === 'number' && resp.statusText) {
    return `Error - ${resp.status} - ${resp.statusText}`;
  }

  //else
  return null;
};


const _parseError = (err: any): string[] => {
  if (err) {
    if (err.errors) {
      const ret = [err.title];
      const others = _parseError(err.errors) || [];
      return [...ret, ...others].filter(Boolean);
    } 
    else if (typeof err === "string") {
      return [err];
    } 
    else if (Array.isArray(err)) {
      return err.map((e) => {
        return !!e ? e.toString() : null;
      }).filter(Boolean);
    } 
    else if (typeof err === 'object') {
      const ret: string[] = [];
      Object.keys(err).forEach(key => {
        const item = err[key];
        if (Array.isArray(item)) {
          item.forEach(m => { ret.push(m); });
        } else {
          ret.push(item);
        }
      });
      return ret.filter(Boolean);
    }
  }
  //else
  return [];
};

