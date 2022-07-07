import axiosInstance from "./index";

const caredashboardApi = {
    getListDashboard: (date, limit, offset, search = null) => 
        axiosInstance.request({
            method: "GET",
            url: `/billing/total-summary?bill_date=${date}&limit=${limit}&offset=${offset}${!!search ? `&filter=${search}` : ""}`,
        }),
};

export default caredashboardApi;