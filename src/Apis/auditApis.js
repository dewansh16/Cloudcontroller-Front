import axiosInstance from './index';

const auditApi = {
    getAudit: (from, to) =>
        axiosInstance.request({
            method: "GET",
            url: `/audit/?from=${from}&to=${to}`,
            // withCredentials: true,
        }),
}

export default auditApi