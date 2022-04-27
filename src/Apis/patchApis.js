import axiosInstance from "./index";

const patchApi = {
  getPatchInventory: (deviceType, inuse, limit, offset, patchSerial) =>
    axiosInstance.request({
      method: "GET",
      url: `/patch/patchinventory?devicetype=${deviceType || ""}&limit=${
        limit || 10
      }&offset=${offset || 0}&inuse=${inuse}&patch_serial=${
        patchSerial || "0"
      }`,
      withCredentials: true,
    }),
};
// /patchinventory?limit=10&offset=0&inuse=-1

export default patchApi;
