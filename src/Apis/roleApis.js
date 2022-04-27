import axiosInstance from "./index";

const roleApi = {
    createNewRole: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/role/`,
            // withCredentials: true,
        }),
    updateRole: (data) =>
        axiosInstance.request({
            method: "PUT",
            data: data,
            url: `/role/`,
            // withCredentials: true,
        }),
    getRoleList: (tenant_uuid) =>
        axiosInstance.request({
            method: "GET",
            url: `/role/${tenant_uuid}`,
            // withCredentials: true,
        }),
    deleteRole: (role_uuid) =>
        axiosInstance.request({
            method: "DELETE",
            url: `/role/?role_uuid=${role_uuid}`,
            // withCredentials: true,
        }),
};

export default roleApi;
