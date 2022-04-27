import axiosInstance from './index';

const medicationApi = {
    getMedications: (period, from, to) =>
        axiosInstance.request({
            method: "GET",
            url: `/medication/?period=${period}&from=${from}&to=${to}`,
            // url: `/medication/?period=${period}&refresh=1`,
            // withCredentials: true,
        }),
    getMedicationsRefreshed: (period, from, to) =>
        axiosInstance.request({
            method: "GET",
            url: `/medication/?period=${period}&refresh=1&from=${from}&to=${to}`,
            // url: `/medication/?period=${period}&refresh=1`,
            // withCredentials: true,
        }),
    markMedicines: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: '/medication/prescription/',
            // withCredentials: true,
        }),
}

export default medicationApi