import axiosInstance from "./index";

const reportApi = {
    getReportData: (pid, tenantId) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/report?limit=1&offset=0&filter=0&tenantId=${tenantId}`,
            // withCredentials: true,
        }),
    getDeboardedReportData: (pid) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/deboardReport?limit=1&offset=0&filter=0`,
            // withCredentials: true,
        }),
    getEachReportData: (pid, startDate, endDate) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/trend?limit=1&offset=10&filter=start_date%3D${startDate}&endDate=endDate%3D${endDate}`,
            // &duration=${hoursTag || 3}
            // withCredentials: true,
        }),
    getEachReportDataWithDuration: (pid, startDate, endDate, hoursTag) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/trend?limit=1&offset=10&duration=${hoursTag || 3}`,
            // &duration=${hoursTag || 3}
            // withCredentials: true,
        }),
};

export default reportApi;
