import { makeAutoObservable } from 'mobx'

class UserStore {

    user;
    role;
    tenant;
    apiUrl;
    websocketUrl;

    constructor() {
        makeAutoObservable(this);
    }


    setUser = (user, role, tenant) => {
        this.user = user;
        this.role = role;
        this.tenant = tenant;
    }
    forgetUser = () => {
        this.user = undefined;
        this.role = undefined;
        this.tenant = undefined;
    }
    getUser = () => {
        return {
            "user": this.user,
            "role": this.role,
            "tenant": this.tenant,
        };
    }
    setDomains = (apiUrl, websocketUrl) => {
        this.apiUrl = apiUrl;
        this.websocketUrl = websocketUrl;
    }
    getDomains = () => {
        return {
            "apiUrl": this.apiUrl,
            "websocketUrl": this.websocketUrl,
        }
    }
}

UserStore = new UserStore();
export { UserStore };
