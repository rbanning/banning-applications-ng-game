import { IGamePhotoUrls, PhotoSize } from "../models/unsplash";


export const unsplashUrl = (
    urls: IGamePhotoUrls, 
    size: PhotoSize,
    square?: boolean,
    width?: number,
    height?: number,
    basis?: number) => {

      let [url, params] = (urls[size] || '').split('?');
      if (params) {
        let query = params.split("&")
                .reduce((prev: any, param: string) => {
                  const [key, value] = param.split('=');
                  prev[key] = value;
                  return prev;
                }, {});
        if (typeof(width) === 'number') { 
          query.w = `${width}`;
        }
        if (typeof(height) === 'number') { 
          query.h = `${height}`;
        }

        if (square === true) {
          query = {
            ...query,
            fit: "fillmax",
            fill: 'blur',
            h: query.w
          };          
        }

        url += '?' + Object.keys(query).map(key => `${encodeURI(key)}=${encodeURI(query[key])}`).join('&');
      }
      return url;
    }