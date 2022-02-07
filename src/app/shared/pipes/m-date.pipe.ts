import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

export type DisplayType = 'long' | 'short' | 'none';
export interface IDateDisplayConfig {
  short?: boolean;
  dow?: DisplayType;
  month?: DisplayType;
  time?: DisplayType;
  format?: string;
}
export const defaultDisplayConfig: IDateDisplayConfig = {
  short: false,   
  dow: 'none',
  month: 'short',
  time: 'none',
  format: undefined
};

@Pipe({
  name: 'mDate'
})
export class MDatePipe implements PipeTransform {

  transform(value: any, 
            config: IDateDisplayConfig = defaultDisplayConfig
            ): any {
    
    if (!value) { return null; }
    
    const m = dayjs(value);
    if (m.isValid()) {
      config = { 
        ...defaultDisplayConfig,
        ...config
      };
      config.format = config.format || this._setFormat(config);
      return m.format(config.format);
    } 
    //else
    console.warn("Invalid m-date", { value });
    return 'n/a';   
  }


  private _setFormat(config: IDateDisplayConfig) {
    let ret = '';
    if (config.short) {
      ret = "MM/DD/YYYY";
    } else {
      if (config.dow && config.dow !== 'none') {
        switch (config.dow) {
          case 'long':
            ret += 'dddd';
            break;
          case 'short':
            ret += 'ddd';
            break;
          default:
            ret += config.dow;
        }
        ret += ', ';
      }
      if (config.month && config.month !== 'none') {
        switch (config.month) {
          case 'long':
            ret += 'MMMM';
            break;
          case 'short':
            ret += 'MMM.';
            break;
          default:
            ret += config.month;
        } 
      } else {
        ret += 'M';
      }
      ret += " D, YYYY"; 
    }

    if (config.time && config.time !== 'none') {
      switch (config.time) {
        case 'long':
          ret += ', h:mm:ss a';
          break;
        case 'short':
          ret += ', h:mma';
          break;
        default:
          ret += `, ${config.time}`;
      }
    }

    return ret;
  }

}
