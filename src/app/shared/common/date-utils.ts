import * as dayjs from 'dayjs';

export const dateUtils = {
  now(): dayjs.Dayjs {
    return dayjs();
  },

  utc(): dayjs.Dayjs {
    //** not using utc plugin as I can't seem to get the typings to work :-( **//
    const ret = dateUtils.now();
    return ret.add(ret.utcOffset(), 'minute');
  },

  isDayJs(obj: dayjs.Dayjs | null | undefined): boolean {
    return !!obj && obj.isValid();
  },

  compare(d1: dayjs.Dayjs, d2: dayjs.Dayjs, handleNulls: 'first' | 'last' = 'first'): number {
    if (d1 && d2) {
      return d1.isBefore(d2) ? -1 : (d1.isAfter(d2) ? 1 : 0);
    } else {
      return (d1 === d2 ? 0 : (d1 ? 1 : -1)) * (handleNulls === 'last' ? -1 : 1);
    }
  },

  isFutureDate(obj: dayjs.Dayjs | null, now?: dayjs.Dayjs | null): boolean {
    now = dateUtils.isDayJs(now) ? now : dayjs();
    return !!obj && dateUtils.isDayJs(obj) && obj.isAfter(now);
  },

  isPastDue(obj: dayjs.Dayjs | null, now?: dayjs.Dayjs | null) {
    now = dateUtils.isDayJs(now) ? now : dayjs();
    return dateUtils.isDayJs(obj) && obj?.isBefore(now);
  },

  _isWithin(obj: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs): boolean {
    return dateUtils.isDayJs(obj) && obj.isAfter(start) && obj.isBefore(end);
  },

  isWithin: {
    thisWeek: (obj: dayjs.Dayjs): boolean => {
      return dateUtils._isWithin(obj, dayjs().startOf('week'), dayjs().endOf('week'));
    },
    nextWeek: (obj: dayjs.Dayjs): boolean => {
      return dateUtils._isWithin(obj, dayjs().add(1, 'week').startOf('week'), dayjs().add(1, 'week').endOf('week'));
    },
    thisMonth: (obj: dayjs.Dayjs): boolean => {
      return dateUtils._isWithin(obj, dayjs().startOf('month'), dayjs().endOf('month'));
    },
    nextMonth: (obj: dayjs.Dayjs): boolean => {
      return dateUtils._isWithin(obj, dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month'));
    },
    lastWeek: (obj: dayjs.Dayjs): boolean => {
      return dateUtils._isWithin(obj, dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week'));
    },
    lastMonth: (obj: dayjs.Dayjs): boolean => {
      return dateUtils._isWithin(obj, dayjs().subtract(1, 'week').startOf('month'), dayjs().subtract(1, 'week').endOf('month'));
    },
  },

  difference: (obj1: dayjs.Dayjs, obj2: dayjs.Dayjs, units: 'day' | 'hour' | 'minute' | 'second'): number | null => {
    if (dateUtils.isDayJs(obj1) && dateUtils.isDayJs(obj2)) {
      const ms = obj1.diff(obj2);
      switch (units) {
        case 'day':
          return Math.floor(ms / (1000 * 60 * 60 * 24));
        case 'hour':
          return Math.floor(ms / (1000 * 60 * 60));
        case 'minute':
          return Math.floor(ms / (1000 * 60));
        case 'second':
          return Math.floor(ms / (1000));
        default:
          return ms;
      }
    }

    //else
    return null;
  }
};

