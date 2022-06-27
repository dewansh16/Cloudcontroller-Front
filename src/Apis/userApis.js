import axiosInstance from "./index";

const userApi = {
    login: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/sign/login`,
            isLogin: true
            // withCredentials: true,
        }),
    logout: () =>
        axiosInstance.request({
            method: "GET",
            url: `/sign/logout`,
            // withCredentials: true,
        }),
    // getUserList: "/users/userinventory?limit=100&offset=0&filter=0",
    getUserList: (searchType, firstName, lastName, limit, offset, tenant_uuid) =>
        axiosInstance.request({
            method: "GET",
            url: `/users/userinventory?limit=${limit || 10}&offset=${offset || 0
                }&tenantId=tenant8ea56b12-ff44-4b5c-839c-f609363ba385&filter=${firstName !== null && firstName !== undefined
                    ? `fname=${firstName}`
                    : ""
                }${lastName !== null && lastName !== undefined && lastName !== ""
                    ? `&lname=${lastName}`
                    : ""
                }`,
            // withCredentials: true,
        }),
    addUser: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/users/`,
            // withCredentials: true,
        }),
    editUser: (user_uuid, data) =>
        axiosInstance.request({
            method: "PUT",
            data: data,
            url: `/users/${user_uuid}`,
            // withCredentials: true,
        }),

    getMyself: (tenant_uuid) =>
        axiosInstance.request({
            method: "GET",
            url: `users/_self?tenantId={${tenant_uuid || ""}}&limit=100&offset=0&filter=0`,
            // withCredentials: true,
        }),

    getProfile: (user_uuid) => 
        axiosInstance.request({
            method: "GET",
            url: `/users/profile?user_uuid=${user_uuid || ""}`,
            // withCredentials: true,
        }),
};

export default userApi;
