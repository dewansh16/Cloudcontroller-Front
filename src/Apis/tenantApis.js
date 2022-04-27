import axiosInstance from './index';

const tenantApi = {
    createNewTenant: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/tenant/`,
            withCredentials: true,
        }),
    getTenantList: () =>
        axiosInstance.request({
            method: "GET",
            url: `/tenant/tenantinventory`,
            // withCredentials: true,
        }),
    getLocation: (tenant_uuid) =>
        axiosInstance.request({
            method: "GET",
            url: `/facility/facilityinventory?tenant_uuid=${tenant_uuid}`,
            // withCredentials: true,
        }),
    createNewFacilityMap: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: '/facility/',
            withCredentials: true,
        }),
    updateTenantData: (data, tenant_id) =>
        axiosInstance.request({
            method: "PUT",
            data: data,
            url: `/facility/{facility_uuid}?tenant_id=${tenant_id}`,
            withCredentials: true,
        }),
    updateTenantName: (data, tenant_uuid) =>
        axiosInstance.request({
            method: "PUT",
            data: data,
            url: `/tenant/${tenant_uuid}`,
            withCredentials: true,
        }),
}

export default tenantApi