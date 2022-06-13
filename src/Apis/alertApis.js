import axiosInstance from './index';

const alertApi = {
    getPatientAlerts: (pid, page) =>
        axiosInstance.request({
            method: "GET",
            url: `/alerts?limit=50&offset=${page}&pid=${pid}`,
            // withCredentials: true,
        }),
    editAcknowledged: (id, data) =>
        axiosInstance.request({
            method: "POST",
            url: `/alerts/${id}/status`,
            data: data,
            // withCredentials: true,
        }),
    addTags: (id, data) =>
        axiosInstance.request({
            method: "POST",
            url: `/alerts/${id}/tag`,
            data: data,
            // withCredentials: true,
        }),

}

export default alertApi

