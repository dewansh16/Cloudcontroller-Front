import axiosInstance from "./index";

const patientApi = {
    downloadLogger: (fileId) => 
        axiosInstance.request({
            method: "GET",
            url: `/logger/download?id=${fileId}`,
            responseType: 'blob',
        }),
    getListUploadLogger: (tenantId) => 
        axiosInstance.request({
            method: "GET",
            url: `/logger?tenantId=${tenantId}`,
        }),
    detachSensorOfPatient: (data) => 
        axiosInstance.request({
            method: "DELETE",
            url: "/patients",
            data: data
        }),
    deletePatient: (data) => 
        axiosInstance.request({
            method: "DELETE",
            url: "/patients",
            data: data
        }),
    addPatient: (data, pid) =>
        axiosInstance.request({
            method: "POST",
            url: pid === undefined || pid === null ? `/patients` : `/patients/${pid}`,
            data: data,
            // withCredentials: true,
        }),
    addPatientPractitioners: (data, pid) =>
        axiosInstance.request({
            method: "POST",
            url: `/patients/${pid}/practictioner`,
            data: data,
            // withCredentials: true,
        }),
    getPatientList: (dataFilter) => {
        return axiosInstance.request({
            method: "post",
            url: '/patientinventory',
            data: dataFilter,
        });
        // if (filter.fname === null && filter.lname === null) {
        //     if (patientType === "deboarded") {
        //         reqUrl = `/patientinventory?limit=${limit || 10}&offset=${
        //         offset || 0
        //         }&filter=status%3DDeboarded&duration=3`;
        //     } 
        //     else if (patientType === "incare") {
        //         reqUrl = `/patientinventory?limit=${limit || 10}&offset=${
        //         offset || 0
        //         }&filter=discharge_date%3Dnull&duration=3`;
        //     } 
        //     else if (patientType === "discharged") {
        //         reqUrl = `/patientinventory?limit=${limit || 10}&offset=${
        //         offset || 0
        //         }&filter=discharge_date%3D1&duration=3`;
        //     } 
        //     else {
        //         reqUrl = `/patientinventory?limit=${limit || 10}&offset=${
        //         offset || 0
        //         }&filter=location_uuid%3D${
        //         filter?.locationUuid ? filter.locationUuid : ""
        //         }%26fname%3D${filter?.fname ? filter.fname : ""}%26lname%3D${
        //         filter?.lname ? filter.lname : ""
        //         }%26med_red%3D${filter?.medRecord ? filter.medRecord : ""}&duration=${
        //         filter?.duration ? filter.duration : 3
        //         }`;
        //     }
        // } else {
        //     reqUrl = `/patientinventory?limit=${limit || 10}&offset=${
        //         offset || 0
        //     }&filter=location_uuid%3D${
        //         filter?.locationUuid ? filter.locationUuid : ""
        //     }%26fname%3D${filter?.fname ? filter.fname : ""}%26lname%3D${
        //         filter?.lname ? filter.lname : ""
        //     }%26med_red%3D${filter?.medRecord ? filter.medRecord : ""}&duration=${
        //         filter?.duration ? filter.duration : 3
        //     }`;
        // }
        // return axiosInstance.request({
        //     method: "post",
        //     url: reqUrl,
        //     data: {
        //         "tenant_id": "tenant8ea56b12-ff44-4b5c-839c-f609363ba385"
        //     },
        //     // withCredentials: true,
        // });
    },

    getDetailPatientById: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}?limit=${limit || 100}&offset=${offset || 0}&filter=${filter || 0}`,
            // withCredentials: true,
        }),


    getPatientData: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}`,
            //   withCredentials: true,
        }),
    getPatientListForIcu: (limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patientinventory?limit=${limit || 10}&offset=${offset || 0
                }&filter=discharge_date=null&duration=3`,
            // withCredentials: true,
        }),
    getAnomalies: (pid) =>
        axiosInstance.request({
            method: "GET",
            url: `/alerts/?limit=0&offset=10&pid=${pid}`,
            // withCredentials: true,
        }),
    getSensorData: (pid, startTime, endTime) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/sensordata?limit=1&offset=0&start=${startTime}&stop=${endTime}&motion=-1`,
            // withCredentials: true,
        }), //
    getAlerts: () =>
        axiosInstance.request({
            method: "GET",
            url: `/alerts`,
            // withCredentials: true,
        }),
    getTrends: (pid, startDate, limit, offset, endDate) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/trend?limit=${limit || 10}&offset=${offset || 0
                }&filter=start_date%3D${startDate}&endDate=endDate%3D${endDate}`,
            // withCredentials: true,
        }),
    associatePatchToPatient: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            url: `/patients/${pid}/patch_map`,
            data: data,
            // withCredentials: true,
        }),
    EditAssociatedPatchToPatient: (pid, data) =>
        axiosInstance.request({
            method: "PUT",
            url: `/patients/${pid}/patch_map`,
            data: data,
            // withCredentials: true,
        }),
    EditOneAssociatedPatchToPatient: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            url: `/patients/${pid}/patch_map`,
            data: data,
            // withCredentials: true,
        }),
    getPatientPrescriptions: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/prescription?limit=${limit || 10}&offset=${offset || 0
                }&filter=${filter || 0}`,
            // withCredentials: true,
        }),
    getPatientPatches: (pid, tenantId) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/patch_map?limit=100&offset=10&filter=0&tenantId=${tenantId}`,
            // withCredentials: true,
        }),
    getDeviceManegement: (pid) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/patch_map`,
            // withCredentials: true,
        }),
    getPatientNotes: (pid, note) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/notes?limit=50&offset=10&filter=0${note !== null && note !== undefined ? `&note=${note}` : ""
                }`,
            // withCredentials: true,
        }),
    addNotesToPatient: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            url: `/patients/${pid}/notes`,
            data: data,
            // withCredentials: true,
        }),
    addPrescriptions: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/prescription`,
            // withCredentials: true,
        }),
    getPatientVitals: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/vital?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}`,
            // withCredentials: true,
        }),
    addPatientVitals: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/vital`,
            // withCredentials: true,
        }),
    addVitalThreshold: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/vitalthreshold`,
            // withCredentials: true,
        }),
    getEcgValue: (pid, startTime, endTime) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/sensordata?limit=100&offset=0&start=${startTime}&stop=${endTime}&motion=-1`,
            // withCredentials: true,
        }),
    getVitalThreshold: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/vitalthreshold?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}`,
            // withCredentials: true,
        }),
    getPatientOtp: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/otp?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}`,
            // withCredentials: true,
        }),
    updatePatch: (pid, data) =>
        axiosInstance.request({
            method: "PUT",
            url: `/patients/${pid}/patch_map`,
            data: data,
            // withCredentials: true,
        }),
    getOpenAlerts: (pid, from, to) =>
        axiosInstance.request({
            method: "GET",
            url: `/alerts?limit=1000&offset=0&pid=${pid}&status=open&from=${from}&to=${to}`,
        }),
    getPatientMedicalHistory: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/medical_history?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}`,
            // withCredentials: true,
        }),
    createPatientMedicalHistory: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/medical_history`,
            // withCredentials: true,
        }),
    updatePatientMedicalHistory: (pid, data) =>
        axiosInstance.request({
            method: "PUT",
            url: `/patients/${pid}/medical_history`,
            data: data,
            // withCredentials: true,
        }),
    getPatientAllergy: (pid, limit, offset, filter) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/allergy?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}`,
            // withCredentials: true,
        }),
    createPatientAllergy: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/allergy`,
            // withCredentials: true,
        }),
    updatePatientAllergy: (pid, data) =>
        axiosInstance.request({
            method: "PUT",
            url: `/patients/${pid}/allergy`,
            data: data,
            // withCredentials: true,
        }),
    setPatientLocation: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/location`,
            // withCredentials: true,
        }),

    getPatientLocation: (pid) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/location?limit=10&offset=0&filter=0`,
            // withCredentials: true,
        }),

    getPatientProcedure: (pid, limit, offset, filter, date) =>
        axiosInstance.request({
            method: "GET",
            url: `/patients/${pid}/procedure?limit=${limit || 100}&offset=${offset || 0
                }&filter=${filter || 0}${date ? `date=${date}` : ""}`,
            // withCredentials: true,
        }),
    createPatientProcedure: (pid, data) =>
        axiosInstance.request({
            method: "POST",
            data: data,
            url: `/patients/${pid}/procedure`,
            // withCredentials: true,
        }),
    updatePatientProcedure: (pid, data) =>
        axiosInstance.request({
            method: "PUT",
            url: `/patients/${pid}/procedure`,
            data: data,
            // withCredentials: true,
        }),
};

export default patientApi;
