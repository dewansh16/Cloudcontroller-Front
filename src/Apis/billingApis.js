import axiosInstance from "./index";


const billingApi = {
    getBillingTasks: (pid, date, status) =>
        axiosInstance.request({
            method: "GET",
            url: `${date ? `/billing/?pid=${pid}&bill_date=${date}&billing_uuid=0&status=${status}&limit=10&offset=0&filter=0` : `/billing/?pid=${pid}&billing_uuid=0&status=${status}&limit=10&offset=0&filter=0`}`,
            // withCredentials: true,
        }),
    addBillingTask: (data) =>
        axiosInstance.request({
            method: "POST",
            url: `/billing/`,
            data: data,
            // withCredentials: true,
        }),
        updateBillingTask: (data) =>
        axiosInstance.request({
            method: "POST",
            url: `/billing/task`,
            data: data,
            // withCredentials: true,
        }),
    deleteBillingTask: (data) =>
        axiosInstance.request({
            method: "PUT",
            data: data,
            url: `/billing/`,
            withCredentials: true,
        }),
    addTask: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/tasks/`,
            withCredentials: true,
        }),
    getTask: () =>
        axiosInstance.request({
            method: "GET",
            url: `/tasks/`,
            withCredentials: true,
        }),
    getBillingSummary: (bill_date, ofset, search) => 
        axiosInstance.request({
            method: "GET",
            url: `/billing/total-summary?bill_date=${bill_date}&limit=15&offset=${ofset}${!!search ? `&filter=${search}` : ""} `,
        }),
};

export default billingApi;