import { IUser, User } from './user.model';
import * as dayjs from 'dayjs';
import * as common from '@app/shared/common';

export interface IAuth {
    user: IUser | null;
    token: string | null;
    expires: dayjs.Dayjs;
    isAuthenticated(): boolean;
    minutesLeft(): number | null;
}

export class Auth implements IAuth {
    user: IUser | null = null;
    token: string | null = null;
    expires: dayjs.Dayjs;

    constructor(obj: any = null) {
        this.expires = dayjs().add(-1, "day"); //default to expired

        if (obj) {
            this.user = obj.user ? new User(obj.user) : null;
            this.token = obj.token;
            this.expires = dayjs(obj.expires);
        }
    }

    isAuthenticated(): boolean {
        if (!!this.user?.email && !!this.token) {
            return common.dateUtils.isFutureDate(this.expires);
        }
        //else
        return false;
    }

    minutesLeft(): number | null {
        return common.dateUtils.difference(this.expires, dayjs(), 'minute');
    }
}
