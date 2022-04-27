import axiosInstance from './index';
import storage from '../Controllers/storage';

// let user = JSON.parse(localStorage.getItem("user"))
const locationApi = {
    getLocationData: (tenant_id, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/location/locationinventory?limit=${limit || 10}&offset=${offset || 0}&filter=${filter || 0}&tenant_uuid=${tenant_id}&userName=${JSON.parse(localStorage.getItem("user")).userName}`,
            // data: user,
            // withCredentials: true,
        }),
    postLocationData: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: '/location/',
            withCredentials: true,
        }),
}

export default locationApi;