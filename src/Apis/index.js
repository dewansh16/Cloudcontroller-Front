import axios from 'axios';

import { UserStore } from '../Stores/userStore';
import storage from '../Controllers/storage';
import Config from '../Lib/config';

console.log("process.env", process.env);

const domain = process.env.NODE_ENV === "development" ? Config.DEV_API_URL : Config.PRODUCTION_API_URL;
// const domain = 'http://20.230.234.202:7124'
// const domain = 'http://localhost:7124'

const axiosInstance = axios.create({
    baseURL: `${domain}/api`,
});

axiosInstance.interceptors.request.use((config) => {
    const { isLogin } = config;

    if (!isLogin || isLogin === undefined) {
        const user = JSON.parse(localStorage.getItem("user"));
        const accessToken = user?.accessToken || '';

        if (accessToken) {
            config.headers.accessToken = accessToken;
        }
    }
    return config;
});

let loginPageError = ["SESSION_WITHOUT_TOKEN", "SESSION_EXPIRY", "INVALID_USER", "USER_ACTIVITY_TIMEOUT", "INVALID_ROLE"];

axiosInstance.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (loginPageError.includes(error.response.data.result)) {
        UserStore.forgetUser();
        storage.removeItem('user');
        storage.setItem('logout_reason', error.response.data.result)
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    } else {
        return Promise.reject(error.response.data);
    }
})

export default axiosInstance;
