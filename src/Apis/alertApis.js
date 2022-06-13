import axiosInstance from './index';

const alertApi = {
    getPatientAlerts: (pid, offset, limit = 25) =>
        axiosInstance.request({
            method: "GET",
            url: `/alerts?limit=${limit}&offset=${offset}&pid=${pid}`,
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

