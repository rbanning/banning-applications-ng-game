export interface IUser {
    id?: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    avatar: string | null;
    trelloId: string | null;
    isAdmin(): boolean | null;
    isManager(): boolean | null;
}

export class User implements IUser {
    id: string | null = null;
    name: string | null = null;
    email: string | null = null;
    phone: string | null = null;
    role: string | null = null;    
    avatar: string | null = null;
    trelloId: string | null = null;

    constructor(obj: any = null) {
        if (obj) {
            this.id = obj.id;
            this.name = obj.name;
            this.email = obj.email;
            this.phone = obj.phone;
            this.role = obj.role;
            this.avatar = obj.avatar;
            this.trelloId = obj.trelloId;
        }
    }

    isAdmin(): boolean {
        return this.role === 'admin' || this.role === 'root';
    }

    isManager(): boolean {
        return this.isAdmin() || this.role === 'manager';
    }

}
