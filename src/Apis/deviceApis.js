import axiosInstance from "./index";

const deviceApi = {
    getPatchesData: (deviceType, inuse, patchSerial, tenantId) =>
        axiosInstance.request({
            method: "GET",
            url: `/patch/patchinventory?devicetype=${deviceType}&limit=10&offset=0&inuse=${inuse}&patch_serial=${
                patchSerial || ""
            }&tenantId=${tenantId}`,
            // withCredentials: true,
        }),
    addPatchBundle: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patch`,
            // withCredentials: true,
        }),
    addPatch: (data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patch/patchinventory`,
            // withCredentials: true,
        }),

    addDevice: (data) => 
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patch`,
        }),

    getPatchList: (data) =>
        axiosInstance.request({
            method: "POST",
            url: '/patch/patchinventory',
            data: data
        }),

    // getPatchList_V1: (limit, offset, patchSerial, tennant_id) =>
    //     axiosInstance.request({
    //         method: "POST",
    //         url: `/patch/patchinventory?limit=${limit || 10}&offset=${
    //             offset || 0
    //         }&inuse=0&patch_serial=${patchSerial || "0"}`,
    //         // withCredentials: true,
    //         data: { tennant_id }
    //     }),
    editPatch: (data, patch_uuid) =>
        axiosInstance.request({
            method: "PUT",
            data: data,
            url: `/patch/${patch_uuid}`,
            // withCredentials: true,
        }),
    deboardPatch: (pid) =>
        axiosInstance.request({
            method: "DELETE",
            url: `/patients/${pid}/deboard`,
            // withCredentials: true,
        }),

    deleteDevice: (data) =>
        axiosInstance.request({
            method: "DELETE",
            url: '/patch/delete',
            data: data
        }),
};

export default deviceApi;
