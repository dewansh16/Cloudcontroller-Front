import React, { useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import {
    Tabs,
    notification,
    Form,
    Spin,
    Tooltip,
    Divider,
    Popconfirm,
    message,
} from "antd";
import { UserStore } from "../../Stores/userStore";
import { Button } from "../../Theme/Components/Button/button";
// importing apis
import patientApi from "../../Apis/patientApis";
import deviceApi from "../../Apis/deviceApis";
// add patient modal
import AddPatientModal from "./addPatientDetails/addPatientModal";
// add patient forms
import PatientDemographics from "./addPatientDetails/forms/demographics";
import GuardianDetails from "./addPatientDetails/forms/guardianDetails";
import BedAllocationDetails from "./addPatientDetails/forms/bedAllocationDetails";
import LocationDetails from "./addPatientDetails/forms/location";
// schema for validation (add patient modal)
import {
    demographicSchema,
    locationSchema,
    guardianSchema,
    bedAllocationSchema,
    practitionersSchema,
} from "./addPatientFormConfig";

// add patches modal
import PatchInventoryModal from "./PatchInventoryModule/patchInventory";
import PatchForm from "./PatchInventoryModule/components/patchForm";

//summary screen
import Summary from "./summary/summary";
// import PatientStore from '../../Stores/PatientStore';
import PractitionerDetails from "./addPatientDetails/forms/practitionerDetails";

import { isJsonString } from "../../Utils/utils";

import "./addPatient.css";

const { TabPane } = Tabs;

function AddPatient() {
    let { pid } = useParams();
    let history = useHistory();
    const [patientId, setPatientId] = React.useState(null);
    const [addPatientForm] = Form.useForm();
    const [addPatchForm] = Form.useForm();
    const [addPatchBundleForm] = Form.useForm();
    const [patientData, setPatientData] = React.useState({
        // admission_date: moment(),
    });
    const [patientLocationUUID, setPatientLocationUUID] = React.useState(null);
    const [isButtonLoading, setButtonLoading] = React.useState(false);
    const [isPatientDataLoading, setPatientDataLoading] = React.useState(false);
    const [activePanel, setActivePanel] = React.useState("1");
    const [deboardButtonLoading, setDeboardButtonLoading] = React.useState(false);
    const [isDeboarded, setDeboarded] = React.useState(false);
    const [practitioners, setPractitioners] = React.useState({
        primary_consultant: [],
        secondary_consultant: [],
    });

    const [patchData, setPatchData] = React.useState({
        ecg: null,
        spo2: null,
        temperature: null,
        gateway: null,
        alphamed: null,
        ihealth: null,
        digital: null
    });

    const [bundleData, setBundleData] = React.useState({
        ecg: null,
        spo2: null,
        temperature: null,
        gateway: null,
    });

    const [isPatchTabDisabled, setIsPatchTabDisabled] = React.useState(true);

    const [summary, setSummary] = React.useState({
        isVisible: false,
        status: null,
        name: null,
        title: null,
        response: null,
    });

    const [patientClass, setClass] = React.useState({
        isloading: false,
        list: [
            {
                class: "Demographics",
                error: false,
                added: false,
                errorFirstName: false,
                errorLastName: false,
                Component: PatientDemographics,
            },
            {
                class: "Address",
                error: false,
                added: false,
                Component: LocationDetails,
            },
            {
                class: "Guardian",
                error: false,
                added: false,
                Component: GuardianDetails,
            },
            {
                class: "Practitioners",
                error: false,
                added: false,
                Component: PractitionerDetails,
            },
            {
                class: "Location",
                error: false,
                added: false,
                Component: BedAllocationDetails,
            },
        ],
    });
    
    const [patchClass, setPatchClass] = React.useState({
        isloading: false,
        list: [
            {
                class: "gateway",
                error: false,
                added: false,
                Component: PatchForm,
            },
            {
                class: "ecg",
                error: false,
                added: false,
                Component: PatchForm,
            },
            {
                class: "spo2",
                error: false,
                added: false,
                Component: PatchForm,
            },
            {
                class: "temperature",
                error: false,
                added: false,
                Component: PatchForm,
            },
            {
                class: "digital",
                error: false,
                added: false,
                Component: PatchForm,
            },
            {
                class: "bps",
                error: false,
                added: false,
                Component: PatchForm,
            },
        ],
    });

    const { tenant } = UserStore.getUser();

    const savePatientDetails = (values) => {
        setPatientData({ ...patientData, ...values });
    };

    const savePractitionersDetails = (values) => {
        setPractitioners({
            ...practitioners,
            ...values,
        });
    };

    const savePatchDetails = (values) => {
        setPatchData({ ...patchData, ...values });
    };
    const saveBundleDetails = (values) => {
        setBundleData({ ...bundleData, ...values });
    };

    // factory method to validate data in global store
    function validate(data, schema) {
        const { error } = schema.validate(data);
        return error;
    }

    React.useEffect(() => {
        if (pid === undefined) {
            // setPatientData({
            //   admission_date: moment(),
            // });
        } else {
            setPatientDataLoading(true);
            patientApi
                .getPatientData(pid)
                .then((res) => {
                    let { demographic_map = {} } = res.data.response.patient;

                    demographic_map.DOB =
                        demographic_map.DOB !== null ? moment(demographic_map.DOB) : null;

                    demographic_map.admission_date =
                        demographic_map.admission_date !== null &&
                            demographic_map.admission_date !== undefined
                            ? moment(demographic_map.admission_date)
                            : null;
                    // console.log(demographic_map.discharge_date);
                    demographic_map.discharge_date =
                        demographic_map.discharge_date !== null &&
                            demographic_map.discharge_date !== undefined
                            ? moment(demographic_map.discharge_date)
                            : null;
                    // console.log(demographic_map.discharge_date);
                    demographic_map.deceased_date =
                        demographic_map.deceased_date !== null &&
                            demographic_map.deceased_date !== undefined
                            ? moment(demographic_map.deceased_date)
                            : null;

                    demographic_map.tags = isJsonString(demographic_map?.tags) ? JSON.parse(demographic_map?.tags) : [];

                    // demographic_map.patient_type = "remote";
                    setPatientData(demographic_map);

                    if (demographic_map.status === "Deboarded") {
                        setDeboarded(true);
                    }

                    let primary_consultant = [];
                    let secondary_consultant = [];
                    if (demographic_map !== null) {
                        // console.log(demographic_map);
                        demographic_map?.primary_consultant?.map(
                            (item) => {
                                primary_consultant.push(item.uuid);
                            }
                        );
                        demographic_map?.secondary_consultant?.map(
                            (item) => {
                                secondary_consultant.push(item.uuid);
                            }
                        );
                        // console.log(primary_consultant, secondary_consultant);
                    }

                    addPatientForm.setFieldsValue({
                        ...demographic_map,
                        ...demographic_map?.location,
                        bed: demographic_map?.patient_location_table?.bed_no || null,
                        primary_consultant: primary_consultant,
                        secondary_consultant: secondary_consultant,
                    });

                    setIsPatchTabDisabled(false);
                    setPatientId(pid);
                    setPatientDataLoading(false);
                    setPatientLocationUUID(demographic_map.location_uuid);
                    setSummary({
                        isVisible: false,
                        status: "success",
                        name: `${demographic_map.title} ${demographic_map.fname}`,
                        title: `${demographic_map.title} ${demographic_map.fname}`,
                        response: demographic_map,
                    });

                    let arePatchesBundled = demographic_map?.patch_patient_maps?.[0]?.bundle;

                    if (arePatchesBundled) {
                        let payload = bundleData;

                        demographic_map.patch_patient_maps?.map((patch) => {
                            let duration = null;
                            if (patch.patches[0] !== undefined) {
                                let individualPatch = patch.patches[0];
                                if (patch.duration !== null) {
                                    let temp = patch.duration.split(",");
                                    let startDate = moment(temp[0]);
                                    let endDate = moment(temp[1]);
                                    duration = [startDate, endDate];
                                }

                                switch (individualPatch.patch_type) {
                                    case "ecg": {
                                        payload.ecg = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            ecg_duration: duration,
                                            ecg_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    case "temperature": {
                                        payload.temperature = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            temperature_duration: duration,
                                            temperature_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    case "spo2": {
                                        payload.spo2 = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            spo2_duration: duration,
                                            spo2_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    case "gateway": {
                                        payload.gateway = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            gateway_duration: duration,
                                            gateway_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    default:
                                        break;
                                }
                                saveBundleDetails(payload);
                            }
                        });
                        addPatchBundleForm.setFieldsValue({
                            ...payload.ecg,
                            ...payload.temperature,
                            ...payload.spo2,
                            ...payload.gateway,
                        });
                    } else {
                        let payload = patchData;
                        demographic_map.patch_patient_maps?.map((patch) => {
                            let duration = null;
                            if (patch.patches[0] !== undefined) {
                                let individualPatch = patch.patches[0];
                                if (patch.duration !== null) {
                                    let temp = patch.duration.split(",");
                                    let startDate = moment(temp[0]);
                                    let endDate = moment(temp[1]);
                                    duration = [startDate, endDate];
                                }

                                switch (individualPatch.patch_type) {
                                    case "ecg": {
                                        payload.ecg = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            ecg_duration: duration,
                                            ecg_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    case "temperature": {
                                        payload.temperature = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            temperature_duration: duration,
                                            temperature_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    case "spo2": {
                                        payload.spo2 = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            spo2_duration: duration,
                                            spo2_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    case "gateway": {
                                        payload.gateway = {
                                            patch_uuid: individualPatch.patch_uuid,
                                            duration: patch.duration,
                                            gateway_duration: duration,
                                            gateway_device_serial: individualPatch.device_serial,
                                        };
                                        break;
                                    }
                                    default:
                                        break;
                                }
                                savePatchDetails(payload);
                            }
                        });
                        addPatchForm.setFieldsValue({
                            ...payload.ecg,
                            ...payload.temperature,
                            ...payload.spo2,
                            ...payload.gateway,
                        });
                    }
                })
                .catch((err) => {
                    setPatientDataLoading(false);
                    console.error(err);
                });
        }
    }, [pid]);

    const deboardPatches = () => {
        setDeboardButtonLoading(true);

        const data = {
            list: [ { pid } ],
            tenantId: tenant
        }
        patientApi
            .deletePatient(data)
            .then(res => {
                setDeboardButtonLoading(false);
                setDeboarded(true);
                // goBack();

                let newTitle = "Deboard patient successfully!";
                setSummary({
                    ...summary,
                    isVisible: true,
                    status: "success",
                    title: newTitle,
                })
            })
            .catch(() => {
                notification.error({
                    message: "Delete",
                    description: "Delete patient failed!",
                })
            })
        // deviceApi
        //     .deboardPatch(patientId)
        //     .then((res) => {
        //         setDeboardButtonLoading(false);
        //         setDeboarded(true);
        //         addPatchBundleForm.setFieldsValue({
        //             gateway_duration: null,
        //             gateway_device_serial: null,
        //         });
        //         addPatchForm.setFieldsValue({
        //             [`ecg_duration`]: null,
        //             [`ecg_device_serial`]: null,
        //             [`spo2_duration`]: null,
        //             [`spo2_device_serial`]: null,
        //             [`temperature_duration`]: null,
        //             [`temperature_device_serial`]: null,
        //             [`gateway_duration`]: null,
        //             [`gateway_device_serial`]: null,
        //         });
        //         setPatchData({
        //             ecg: null,
        //             spo2: null,
        //             temperature: null,
        //             gateway: null,
        //             alphamed: null,
        //             ihealth: null,
        //             digital: null
        //         });
        //         setBundleData({
        //             ecg: null,
        //             spo2: null,
        //             temperature: null,
        //             gateway: null,
        //         });
        //         let newTitle = "Sensor successfully Deboarded from ";
        //         setSummary({
        //             ...summary,
        //             isVisible: true,
        //             status: "success",
        //             title: newTitle + summary.name,
        //         });
        //     })
        //     .catch((err) => {
        //         setDeboardButtonLoading(false);
        //         setSummary({
        //             isVisible: true,
        //             status: "error",
        //             title: `couldn't deboard Sensor`,
        //         });
        //     });
    };

    // React.useEffect(() => { setPatientData(patientBiographicData) }, [patientBiographicData])

    React.useEffect(() => { }, [patientData]);

    // add patient to the backend
    const addPatient = () => {
        const { errorFirstName = false, errorLastName = false } = patientClass.list[0];
        if (errorFirstName || errorLastName) return null;

        // setButtonLoading(true);

        try {
            addPatientForm.submit();

            let list = patientClass.list;
            let demographicError = validate(
                {
                    admission_date: moment.isMoment(patientData.admission_date)
                        ? patientData.admission_date.format("YYYY-MM-DD")
                        : patientData.admission_date,
                    discharge_date: moment.isMoment(patientData.discharge_date)
                        ? patientData.discharge_date.format("YYYY-MM-DD")
                        : patientData.discharge_date,
                    med_record: patientData.med_record,
                    title: patientData.title,
                    fname: patientData.fname,
                    lname: patientData.lname,
                    mname: patientData.mname,
                    sex: patientData.sex,
                    DOB: moment.isMoment(patientData.DOB)
                        ? patientData.DOB.format("YYYY-MM-DD")
                        : patientData.DOB,
                    phone_contact: patientData.phone_contact,
                    phone_cell: patientData.phone_cell,
                    email: patientData.email,
                    idtype: patientData.idtype,
                    idnumber: patientData.idnumber,
                    mothersname: patientData.mothersname,
                    deceased_date:
                        patientData.deceased_date !== null
                            ? moment.isMoment(patientData.deceased_date)
                                ? patientData.deceased_date.format("YYYY-MM-DD")
                                : patientData.deceased_date
                            : "",
                },
                demographicSchema
            );
            let locationError = validate(
                {
                    country_name: patientData.country_name,
                    street: patientData.street,
                    city: patientData.city,
                    state: patientData.state,
                    postal_code: patientData.postal_code,
                },
                locationSchema
            );
            let bedAllocationError = validate(
                {
                    location_uuid: patientData.location_uuid,
                    bed: patientData.bed,
                },
                bedAllocationSchema
            );
            let practitionerDetailsError = validate(
                {
                    primary_consultant: patientData.primary_consultant,
                    secondary_consultant: patientData.secondary_consultant,
                    // medical_state: patientData.medical_state,
                },
                practitionersSchema
            );
            let guardianError = validate(
                {
                    guardiansname: patientData.guardiansname,
                    guardiansex: patientData.guardiansex,
                    guardianrelationship: patientData.guardianrelationship,
                    guardianphone: patientData.guardianphone,
                    guardianworkphone: patientData.guardianworkphone,
                    guardianemail: patientData.guardianemail,
                    guardianaddress: patientData.guardianaddress,
                    guardiancity: patientData.guardiancity,
                    guardiancountry: patientData.guardiancountry,
                    guardianstate: patientData.guardianstate,
                    guardianpostalcode: patientData.guardianpostalcode,
                },
                guardianSchema
            );
            
            if (demographicError !== undefined) {
                list[0].error = true;
                setClass({ list: list });
                throw new Error(demographicError);
            } else if (locationError !== undefined) {
                list[1].error = true;
                setClass({ list: list });
                throw new Error(locationError);
            } else if (guardianError !== undefined) {
                list[2].error = true;
                setClass({ list: list });
                throw new Error(guardianError);
            } else if (bedAllocationError !== undefined) {
                list[3].error = true;
                setClass({ list: list });
                throw new Error(bedAllocationError);
            } else if (practitionerDetailsError !== undefined) {
                list[4].error = true;
                setClass({ list: list });
                throw new Error(practitionerDetailsError);
            }
            // retrieve tenant id from userstore
            let userData = UserStore.getUser();
            let tenantId = userData.tenant;
            patientData.tenant_id = tenantId;
            // payload is again created because data has ews_map and other stuff
            // which gives schema failure
            // , status: "active"
         
            const payload = {
                tenantId, 
                demographic_map: { ...patientData, status: "active" } 
            };
            //TODO:
            // 1 .directly add patient skipping setPatchData
            // 2. add patch and patient data together
            // 3. skip guide if necessary
            // 4. show details on the summary
            
            patientApi
                .addPatient(payload, patientId)
                .then((res) => {
                    const demographic_map = res?.data?.response?.demographic_map || res?.data?.response?.patient_data?.demographic_map || {};
                    
                    setButtonLoading(false);
                    setSummary({
                        isVisible: true,
                        status: "success",
                        name: `${demographic_map?.title} ${demographic_map?.fname}`,
                        title: `${demographic_map?.title} ${demographic_map?.fname}`,
                        response: demographic_map,
                    });

                    setPatientId(
                        demographic_map?.pid || patientId
                    );

                    setPatientData(demographic_map);

                    // let practitionersData = {
                    //     ...practitioners,
                    //     tenant_id: tenantId,
                    //     pid:
                    //         demographic_map?.pid ||
                    //         patientId,
                    // };

                    // patientApi
                    //     .addPatientPractitioners(
                    //         practitionersData,
                    //         demographic_map?.pid || patientId
                    //     )
                    //     .then((res) => {
                    //         console.log(res.data.response);
                    //     })
                    //     .catch((err) => {
                    //         console.log(err);
                    //     });

                    // if (patientData.location_uuid !== patientLocationUUID) {
                    //     const locationData = {
                    //         // location_uuid: patientData.location_uuid,
                    //         pid: patient_data?.demographic_map?.pid || patientId,
                    //         // bed_no: patientData.bed,
                    //     };
                    //     patientApi
                    //         .setPatientLocation(
                    //             patient_data?.demographic_map?.pid ||
                    //             patientId,
                    //             locationData
                    //         )
                    //         .then((res) => {
                    //             console.log("location of patientChanged", res);
                    //         })
                    //         .catch((err) => {
                    //             console.log(err);
                    //         });
                    // }
                })
                .catch((err) => {
                    const error = err?.response?.data?.error;
                    setButtonLoading(false);
                    const isExist = error?.isExist || false;
                    setButtonLoading(false);
                    setSummary({
                        isVisible: true,
                        status: "error",
                        title: isExist ? `Medical record ${payload.demographic_map.med_record} already exists` : "Couldnt add details of patient",
                    });
                    const key = "addPatientApiErrorNotif";
                    const btn = (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                notification.close("addPatientApiErrorNotif");
                                notification.error({
                                    message:
                                        pid !== undefined
                                            ? "Couldn't add Patient!"
                                            : "Couldn't edit Patient!",
                                    description: (
                                        <div>
                                            <p style={{ marginBottom: "0px" }}>
                                                Internal System error. Please try later
                                            </p>
                                            <Divider />
                                            <p>{err.response?.data?.error?.error}</p>
                                        </div>
                                    ),
                                    key,
                                    duration: 30,
                                    placement: "topRight",
                                });
                            }}
                        >
                            Show Details
                        </Button>
                    );

                    if (!isExist) {
                        notification.error({
                            message:
                                pid !== undefined
                                    ? "Couldn't add Patient!"
                                    : "Couldn't edit Patient!",
                            description: (
                                <div>
                                    <p style={{ marginBottom: "0px" }}>
                                        Internal System error. Please try later
                                    </p>
                                </div>
                            ),
                            btn,
                            key,
                            placement: "topRight",
                        });
                    }
                });
        } catch (e) {
            setButtonLoading(false);
            notification.warn({
                message: "Invalid form",
                placement: "topRight",
            });
        }
    };

    const addPatch = () => {
        setButtonLoading(true);

        let tenantId = tenant;
        let payload = [];
        let dataNewDevice = null;
        
        if (
            bundleData.ecg !== null ||
            bundleData.spo2 !== null ||
            bundleData.temperature !== null ||
            bundleData.gateway !== null
        ) {
            Object.keys(bundleData).forEach(patch => {
                if (bundleData?.[patch] !== null) {
                    bundleData[patch].config = {};
                    payload.push(bundleData[patch]);
                }
            })

            // if (bundleData.ecg !== null) {
            //     // bundleData.ecg.tenant_id = tenantId;
            //     // bundleData.ecg.pid = patientId;
            //     bundleData.ecg.config = {};
            //     payload.push(bundleData.ecg);
            // }
            // if (bundleData.spo2 !== null) {
            //     // bundleData.spo2.tenant_id = tenantId;
            //     // bundleData.spo2.pid = patientId;
            //     bundleData.spo2.config = {};
            //     payload.push(bundleData.spo2);
            // }
            // if (bundleData.temperature !== null) {
            //     // bundleData.temperature.tenant_id = tenantId;
            //     // bundleData.temperature.pid = patientId;
            //     bundleData.temperature.config = {};
            //     payload.push(bundleData.temperature);
            // }
            // if (bundleData.gateway !== null) {
            //     // bundleData.gateway.tenant_id = tenantId;
            //     // bundleData.gateway.pid = patientId;
            //     bundleData.gateway.config = {};
            //     payload.push(bundleData.gateway);
            // }
        } else {
            Object.keys(patchData).forEach(patch => {
                const data = patchData?.[patch];
                if (data !== null) {
                    if (data.isNewDevice) {
                        dataNewDevice = data;
                    }
                    data.config = {};
                    payload.push(data);
                }
            })
        }

        let associated_list = [];
        const isString = isJsonString(patientData?.associated_list);
        if (isString) {
            associated_list = JSON.parse(patientData?.associated_list);
        }

        const dataBody = {
            tenantId,
            pid: patientId,
            associated_list: associated_list,
            list: payload
        }

        if (!!dataNewDevice) {
            const dataNew = {
                data: [
                    {
                        patch_type: dataNewDevice.type_device,
                        patch_status: "Active",
                        device_serial: dataNewDevice[`${dataNewDevice.type_device}_device_serial`],
                        tenant_id: tenantId,
                        patch_mac: dataNewDevice.mac_address,
                        tags: dataNewDevice?.tags,
                        sim: dataNewDevice?.sim,
                        phone: dataNewDevice?.phone
                    },
                ],
                tenantId: tenantId,
                actionType: "device"
            }

            deviceApi
                .addDevice(dataNew)
                .then((res) => {
                    const patch_uuid = res?.data?.response?.data?.patch_uuid || "";
                    dataBody.list[0].patch_uuid = patch_uuid;
                    handleAssociateDevice(dataBody);
                })
                .catch((err) => {
                    setButtonLoading(false);
                    // setSummary({
                    //     isVisible: true,
                    //     status: "error",
                    //     title: `Couldn't associate Sensor`,
                    // });
                    if (err) {
                        const error = "" + err?.response?.data?.message;
                        notification.error({
                            message: "Error",
                            description: `${error}` || "",
                        });
                    }
                });
        } else {
            handleAssociateDevice(dataBody);
        }
    };

    const handleAssociateDevice = (dataBody) => {
        patientApi
            .associatePatchToPatient(patientId, dataBody)
            .then((res) => {
                setButtonLoading(false);
                setPatientData({ ...patientData, associated_list: res?.data?.response?.patch_data?.associated_list });
                let newTitle = "Sensor successfully associated to ";
                setSummary({
                    ...summary,
                    isVisible: true,
                    status: "success",
                    title: newTitle + summary.name,
                    // response: res.data.response?.patient_data?.demographic_map
                });
                resetDataSelected('patch');
            })
            .catch((err) => {
                setButtonLoading(false);
                setSummary({
                    isVisible: true,
                    status: "error",
                    title: `Couldn't associate Sensor`,
                });
            });
    };

    React.useEffect(() => { }, [isPatchTabDisabled]);

    const goBack = () => {
        history.push("/dashboard/patient/list");
    };

    const confirmText = "Are you sure to deboard this Patient?";

    function deboardConfirm() {
        deboardPatches();
    }

    const resetDataSelected = (typeReset) => {
        if (typeReset === 'patch') {
            setPatchData({
                ...patchData,
                ecg: null,
                spo2: null,
                temperature: null,
                gateway: null,
                alphamed: null,
                ihealth: null,
                digital: null
            })
        } else {
            setBundleData({
                ...bundleData,
                ecg: null,
                spo2: null,
                temperature: null,
                gateway: null,
            })
        }
    };

    const disabledBtnSaveSensor = useMemo(() => {
        let disabled = true;
        Object.keys(patchData).forEach(patch => {
            if (!!patchData?.[patch]?.[`${patch}_device_serial`] && !!patchData?.[patch]?.duration) {
                if (patchData?.[patch]?.isNewDevice) {
                    if (!!patchData?.[patch]?.mac_address) {
                        disabled = false;
                    } 
                } else {
                    disabled = false;
                }
            }
        })
        return disabled;
    }, [patchData]);

    return summary.isVisible ? (
        <div className="flex-container">
            <div className="section-container">
                <Summary status={summary.status} title={summary.title}>
                    {summary.status !== "error" ? (
                        <>
                            <Button
                                onClick={() => {
                                    if (history.location.pathname === "/dashboard/patient/add") {
                                        history.go(0);
                                    } else {
                                        history.push(`/dashboard/patient/add`);
                                    }
                                }}
                            >
                                Add new patient
                            </Button>
                            {!isDeboarded && (
                                <Button
                                    onClick={() => {
                                        setIsPatchTabDisabled(false);
                                        setSummary({
                                            ...summary,
                                            isVisible: false,
                                        });
                                        setActivePanel("2");
                                    }}
                                >
                                    Associate Sensor
                                </Button>
                            )}
                            {!isDeboarded ? (
                                <Button
                                    onClick={() => {
                                        history.push(
                                            `/dashboard/patient/details/${summary.response?.pid || pid}`
                                        );
                                    }}
                                >
                                    Go to Details{" "}
                                </Button>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => {
                                    setSummary({
                                        ...summary,
                                        isVisible: false,
                                    });
                                }}
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={() => {
                                    history.push(`/dashboard/patient/list`);
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        </>
                    )}
                </Summary>
            </div>
        </div>
    ) : (
        <>
            <div className="flex-container">
                {/* TODO: remove addPatientMainContainer from css */}

                <div className="section-container">
                    {isPatientDataLoading ? (
                        <Spin
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                            size="large"
                        />
                    ) : (
                        <Tabs
                            defaultActiveKey={activePanel}
                            tabBarExtraContent={
                                !isPatchTabDisabled ? (
                                    <Popconfirm
                                        placement="top"
                                        title={confirmText}
                                        onConfirm={deboardConfirm}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            style={{
                                                padding: "0.5rem",
                                                boxShadow: "none",
                                                marginRight: "3%",
                                            }}
                                            className="secondary-outlined"
                                            loading={deboardButtonLoading}
                                        // onClick={deboardPatches}
                                        >
                                            Deboard patient
                                        </Button>
                                    </Popconfirm>
                                ) : null
                            }
                            size="large"
                        >
                            <TabPane 
                                tab={patientId ? "Edit Patient" : "Add Patient"} 
                                key="1"
                            >
                                <AddPatientModal
                                    patientData={patientData}
                                    patientClass={patientClass}
                                    setClass={setClass}
                                    savePatientDetails={savePatientDetails}
                                    savePractitionersDetails={savePractitionersDetails}
                                    form={addPatientForm}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: "0.4rem",
                                    }}
                                >
                                    <Button
                                        className="utility"
                                        style={{ marginRight: "3%" }}
                                        onClick={goBack}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        loading={isButtonLoading}
                                        type="primary"
                                        style={{ marginRight: "2em" }}
                                        onClick={addPatient}
                                    >
                                        {patientId ? "Save Patient" : "Add Patient"}
                                    </Button>
                                </div>
                            </TabPane>

                            <TabPane
                                tab={
                                    <Tooltip title="Add patient to access sensors">
                                        Associate Sensor
                                    </Tooltip>
                                }
                                disabled={isPatchTabDisabled}
                                key="2"
                            >
                                <PatchInventoryModal
                                    patchData={patchData}
                                    bundleData={bundleData}
                                    saveBundleDetails={saveBundleDetails}
                                    savePatchDetails={savePatchDetails}
                                    patchClass={patchClass}
                                    setClass={setPatchClass}
                                    bundleForm={addPatchBundleForm}
                                    form={addPatchForm}
                                    pid={patientId}
                                    resetDataSelect={resetDataSelected}
                                    patientData={patientData}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: "0.4rem",
                                    }}
                                >
                                    {
                                        //       <Button
                                        //   className="utility"
                                        //   style={{ marginRight: "3%" }}
                                        //   onClick={deboardPatches}
                                        // >
                                        //   Deboard Patches
                                        //       </Button>
                                    }
                                    <Button
                                        className="utility"
                                        style={{ marginRight: "3%" }}
                                        onClick={goBack}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        loading={isButtonLoading}
                                        type="primary"
                                        style={{ marginRight: "2em" }}
                                        onClick={addPatch}
                                        disabled={disabledBtnSaveSensor}
                                    >
                                        Save Sensor
                                    </Button>
                                </div>
                            </TabPane>
                        </Tabs>
                    )}
                </div>
            </div>
        </>
    );
}
export default AddPatient;
