import axiosInstance from './index';


const internalApi = {
    addImage: (data) =>
        axiosInstance.request({
            method: "POST",
            url: `/internal/upload`,
            data: data,
            withCredentials: true,
        }),
    getImage: (uid, pid) =>
        axiosInstance.request({
            method: "GET",
            url: `/internal/upload?limit=100&offset=0${uid ? `&template_uuid=${uid}` : ``}${pid ? `&pid=${pid}` : ``}`,
            withCredentials: true,
        }),
    addReport: (data, pid, tenant_id) =>
        axiosInstance.request(
            {
                method: "POST",
                url: `/internal/lab_report?pid=${pid}&tenant_id=${tenant_id}`,
                data: data,
                // withCredentials: true,
            }
        ),
    saveReport: (data) =>
        axiosInstance.request(
            {
                method: "POST",
                url: `/internal/lab_report`,
                data: data,
                // withCredentials: true,
            }
        ),
    getReports: () =>
        axiosInstance.request({
            method: "GET",
            url: `/internal/lab_report`,
            // withCredentials: true,
        }),
}

export default internalApi;