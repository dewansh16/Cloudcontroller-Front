import axiosInstance from "./index";

const caredashboardApi = {
    getListDashboard: (date, limit, offset) => 
        axiosInstance.request({
            method: "GET",
            url: `/billing/total-summary?bill_date=${date}&limit=${limit}&offset=${offset}`,
        }),
};

export default caredashboardApi;