import axiosInstance from './index';

const productApi = {
    getMedicineList: (genericName, productName, limit, filter, offset, signal) =>
        axiosInstance.request({
            method: "GET",
            url: `/product/?generic_name=${genericName || ""}&product_name=${productName || ""}&limit=${limit || 10}&offset=${offset || 0}&filter=${filter || 0}`,
            withCredentials: true,
            cancelToken: signal
        }),
    addProduct: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/product`,
            withCredentials: true,
        }),
}

export default productApi