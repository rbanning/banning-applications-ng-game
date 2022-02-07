import { WorkingService } from ".";

export abstract class WorkingHttpService extends WorkingService {
  protected BASE_URL?: string;
  
  protected buildUrl(path: string | string[], query?: any) {
    path = Array.isArray(path) ? path : [path];
    let url = this.BASE_URL + path.join('/');

    if (query) {
      url = url + '?'
        + Object.keys(query)
          .map(key => `${encodeURI(key)}=${encodeURI(query[key])}`)
          .join('&');
    }

    return url;
  }

  
}