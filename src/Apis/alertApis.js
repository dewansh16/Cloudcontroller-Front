import axiosInstance from './index';

const alertApi = {
    getPatientAlerts: (pid, offset, limit = 25, date) =>
        axiosInstance.request({
            method: "GET",
            url: `/alerts?limit=${limit}&offset=${offset}&pid=${pid}${!!date ? `&date=${date}` : ""}`,
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

