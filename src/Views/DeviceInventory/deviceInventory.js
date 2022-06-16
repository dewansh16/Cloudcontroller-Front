import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Row,
    Col,
    Modal,
    Tag,
    Popover,
    Dropdown,
    Menu,
    message,
    Popconfirm,
    Checkbox
} from "antd";
import { withRouter } from "react-router-dom";
import "./device.css";
import PatchInventoryModal from "./addDevice/addDevice";
import AddBundleModal from "./addBundle/addBundle";
import AddGatewayModal from "./addGateway";

import device1 from "../../Assets/Images/ecg.png";
import device2 from "../../Assets/Images/temp1.png";
import device3 from "../../Assets/Images/watch.jpg";
// import device4 from "../../Assets/Images/spo2.jpg";
import device5 from "../../Assets/Images/BUNDLE_png.png";
import spo2Img from "../../Assets/Images/spo2img.png";
import imgIHealth from "../../Assets/Images/ihealth.png";
import digitalScale from "../../Assets/Images/DigitalScale.png";
import gatewayImg from "../../Assets/Images/gateway.png";
import bpImg from "../../Assets/Images/BP-sensor.png";

import deviceApi from "../../Apis/deviceApis";
// import PaginationBox from '../Components/paginationBox';
import { PaginationBox } from "../Components/PaginationBox/pagination";

import Navbar from "../../Theme/Components/Navbar/navbar";

import { Input, GlobalSearch } from "../../Theme/Components/Input/input";

import { Button as Buttons } from "../../Theme/Components/Button/button";

import Icons from "../../Utils/iconMap";
import { UserStore } from "../../Stores/userStore";

import iconDelete from "../../Assets/Images/iconDelete.png";
import notification from 'antd/lib/notification'

import {
    SearchOutlined,
    CaretRightOutlined,
    CaretDownOutlined,
    CheckOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

function PatchInventory() {
    // const { url } = useRouteMatch();

    const [value, setValue] = useState(null);

    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [valSearch, setValSearch] = useState("");

    const [extraDiv, setExtraDiv] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [updateList, setUpdateList] = useState(false);
    const [activekey, setActiveKey] = useState(null);
    const [visible, setVisible] = useState(false);
    const [bundle, setBundle] = useState(false);
    const [gateway, setVisibleGateway] = useState(false);

    const [modifiedList, setModifiedList] = useState([]);
    const [filteredlist, setFilteredList] = useState([]);

    const [arrayChecked, setArrayChecked] = useState([]);

    const modifyData = (fetchedData) => {
        const modifiedData = fetchedData.map((device, index) => {
            if (device.AssociatedPatch.length > 1) {
                return {
                    ...device,
                    key: index,
                };
            } else if (device.AssociatedPatch.length === 1) {
                return {
                    ...device,
                    key: index,
                };
            } else if (
                device.AssociatedPatch.length === 0 &&
                device.patch_type === "gateway"
            ) {
                return {
                    ...device,
                    key: index,
                };
            } else if (device.patch_group_id === null) {
                return {
                    ...device,
                    key: index,
                };
            } else return null;
        })
        .filter((device) => device !== null);

        setFilteredList(modifiedData);
        return modifiedData;
    };

    function fetchPatchList() {
        const { tenant } = UserStore.getUser();

        const dataBody = {
            limit: 10,
            offset: currentPageVal,
            tenantId: tenant,
            search: valSearch
        }

        deviceApi
            .getPatchList(dataBody)
            .then((res) => {
                const data = res.data?.response?.patches;
                // setPatchlist(data);
                modifyData(data);
                setTotalPages(Math.ceil(res.data?.response?.patchTotalCount / 10));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        return fetchPatchList();
    }, [updateList, currentPageVal, valSearch]);

    const success = () => {
        const key = "warning";
        message.success({
            content: "status updated successfully",
            key,
            duration: 1,
        });
    };

    const updateActive = (data) => {
        setIsUploading(true);
        console.log(data, value);
        const sendData = [
            {
                patch_type: data.patch_type,
                patch_uuid: data.patch_uuid,
                patch_status: value,
                patch_serial: data.patch_serial,
                tenant_id: data.tenant_id,
            },
        ];

        deviceApi
            .editPatch(sendData, data.patch_uuid)
            .then((res) => {
                console.log(res.data?.response);

                if (data.AssociatedPatch.length > 1) {
                    data.AssociatedPatch.map((item, index) => {
                        const sendData = [
                            {
                                patch_type: item.patch_type,
                                patch_uuid: item.patch_uuid,
                                patch_status: value,
                                patch_serial: item.patch_serial,
                                tenant_id: item.tenant_id,
                            },
                        ];
                        console.log(sendData);
                        deviceApi
                            .editPatch(sendData, item.patch_uuid)
                            .then((res) => {
                                console.log(res.data?.response);
                                if (index === data.AssociatedPatch.length - 1) {
                                    setIsUploading(false);
                                    openPopover("closePopOver");
                                }
                                success();
                            })
                            .catch((err) => {
                                console.log(err);
                                setIsUploading(false);
                            });
                    });
                } else {
                    setIsUploading(false);
                    openPopover("closePopOver");
                    success();
                }
            })
            .catch((err) => {
                console.log(err);
                setIsUploading(false);
            });
    };

    // const searchDevice = (value) => {
    //     fetchPatchList(value);
    // };

    const showModal = () => {
        setVisible(true);
    };
    const showBundleModal = () => {
        setBundle(true);
    };
    const handleBundle = () => {
        setBundle(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const showModalGateway = () => {
        setVisibleGateway(true);
    }

    const onCloseGateway = () => {
        setVisibleGateway(false);
    }

    function onChange(pagination, filters, sorter, extra) {
        console.log("params", pagination, filters, sorter, extra);
    }

    const editBtnStyle = {
        height: "36px",
        border: "2px solid #D5F0FF ",
        borderRadius: "6px ",
        fontSize: "14px",
        fontWeight: "500",
        width: "fit-content ",
        padding: "0px 16px ",
        color: "#1479FF",
        marginTop: "8px"
        // position: "absolute",
        // top: "0",
        // right: "-6px",
    };

    const onEditBtnStyle = {
        height: "40px",
        border: "2px solid #D5F0FF ",
        borderRadius: "6px ",
        fontSize: "16px",
        fontWeight: "500",
        width: "fit-content ",
        padding: "0px 16px ",
        color: "#1479FF",
    };

    const handleImg = (props) => {
        if (props.AssociatedPatch?.length > 1) {
            return device5;
        }
        switch (props.patch_type) {
            case "temperature":
                return device2;
            case "ecg":
                return device1;
            case "spo2":
                return spo2Img;
            case "gateway":
                return gatewayImg;
            case "digital":
                return digitalScale;
            case "alphamed":
                return bpImg;
            case "ihealth":
                return bpImg;
            default:
                return null;
        }
    };

    const content = (
        <div>
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "10px",
                }}
            >
                <Button
                    type="text"
                    loading={isUploading}
                    onClick={(e) => {
                        e.stopPropagation();
                        updateActive(activekey);
                    }}
                    style={{
                        ...onEditBtnStyle,
                        background: "#fff",
                        color: "#06A400",
                        padding: "0px 12px",
                        marginRight: "10px",
                    }}
                >
                    {" "}
                    <CheckOutlined style={{ marginLeft: "0px" }} />
                </Button>
                <Button
                    type="text"
                    onClick={(e) => {
                        openPopover("closePopOver");
                        e.stopPropagation();
                    }}
                    style={{
                        ...onEditBtnStyle,
                        color: "white",
                        backgroundColor: "#1479FF",
                    }}
                >
                    {" "}
                    x
                </Button>
            </div>
            <div style={{ display: "flex" }}>
                <Button
                    onClick={(e) => {
                        setValue(e.target.innerText);
                        e.stopPropagation();
                    }}
                    type="text"
                    className={
                        value === "Inactive" || value === "0"
                            ? "inactive-active-radio-btn"
                            : "inactive-radio-btn"
                    }
                    value="inactive"
                >
                    Inactive
                </Button>
                <Button
                    onClick={(e) => {
                        setValue(e.target.innerText);
                        e.stopPropagation();
                    }}
                    type="text"
                    className={
                        value === "Under Sterilization"
                            ? "notCleaned-active-radio-btn"
                            : "notCleaned-radio-btn"
                    }
                    value="not Cleaned"
                >
                    Under Sterilization
                </Button>
                <Button
                    onClick={(e) => {
                        setValue(e.target.innerText);
                        e.stopPropagation();
                    }}
                    type="text"
                    className={
                        value === "1" || value === "Active"
                            ? "active-active-radio-btn"
                            : "active-radio-btn"
                    }
                    value="active"
                >
                    Active
                </Button>
            </div>
        </div>
    );

    const onFilterStatus = (value, record) => {
        console.log('value, record', value, record);
    }

    const showMessageCanNotDelete = (type) => {
        notification.warn({
            message: "Delete",
            description: `${type} is in use, can not delete!`,
        })
    }

    const onDeleteDeviceItem = (patch_uuid, type) => {
        const { tenant } = UserStore.getUser();
        const dataBody = {
            list: [
                { patch_uuid }
            ],
            tenantId: tenant
        }

        deviceApi.deleteDevice(dataBody)
            .then(res => {
                notification.success({
                    message: "Delete",
                    description: `Delete ${type} successfully!`,
                })

                if (arrayChecked?.includes(patch_uuid)) {
                    let newArr = [...arrayChecked];
                    newArr = newArr.filter(item => item !== patch_uuid)
                    setArrayChecked(newArr)
                }

                fetchPatchList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onDeleteDeviceSelected = () => {
        const { tenant } = UserStore.getUser();

        const listPatch = [];
        for(let i = 0; i < arrayChecked?.length; i++) {
            listPatch.push({ patch_uuid: arrayChecked[i] })
        }

        const dataBody = {
            list: listPatch,
            tenantId: tenant
        }

        deviceApi.deleteDevice(dataBody)
            .then(res => {
                notification.success({
                    message: "Delete",
                    description: `Delete list item selected successfully!`,
                })
                
                // setFilteredList(newData);
                setArrayChecked([]);
                fetchPatchList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const renderLabelPatchType = (type) => ({
        "temperature": "Temperature Sensor",
        "gateway": "Gateway Sensor (EV-04)",
        "spo2": "SpO2 (CheckMe)",
        "ecg": "ECG Sensor",
        "bps": "BP Sensor",
        "digital": "Digital Scale",
        "alphamed": "Alphamed",
        "ihealth": "iHealth",
    }[type]);

    const columns = [
        {
            title: () => {
                if (arrayChecked?.length > 0) {
                    return (
                        <Popconfirm
                            placement="bottom"
                            title="Are you sure to delete list item selected?"
                            onConfirm={() => onDeleteDeviceSelected()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <div style={{ display: "flex", alignItems: "center", cursor: "pointer", margin: "0 15px" }}>
                                <div style={{ marginRight: "15px", marginTop: "-3px" }}>
                                    <img src={iconDelete} width="20px"></img>
                                </div>
                                <span>Checked</span>
                            </div>
                        </Popconfirm>
                    )
                }
            },
            dataIndex: "patch_type",
            key: "sensorsImage",
            // ellipsis: true,
            width: 60,
            render: (dataIndex, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {record.AssociatedPatch?.length < 2 && (
                        <Checkbox 
                            onChange={() => {
                                let newArr = [...arrayChecked]
                                if (newArr?.includes(record.patch_uuid)) {
                                    newArr = newArr.filter(item => item !== record.patch_uuid);
                                } else {
                                    newArr.push(record.patch_uuid)
                                }
                                setArrayChecked(newArr);
                            }}
                            disabled={record.patch_patient_map !== null}
                            className="checkbox-delete-device"
                            checked={arrayChecked?.includes(record.patch_uuid)}
                            style={{ marginLeft: "6px" }}
                        />
                    )}
                    <div>
                        <img 
                            alt="someimage" 
                            src={handleImg(record)} 
                            width="80px" 
                            style={{ 
                                transform: (record?.patch_type === "gateway" || record?.patch_type === "temperature") ? "scale(1.25)" :
                                (record?.patch_type === "alphamed" || record?.patch_type === "ihealth") ? "scale(0.7)" : "scale(1)"
                            }}
                        ></img>
                    </div>
                </div>
            )
        },

        {
            title: "Device Serial",
            dataIndex: "patch_serial",
            key: "patch_serial",
            ellipsis: true,
            width: 80,
            render: (dataIndex) => {
                return (
                    <span style={{ fontSize: "16px", fontWeight: "500" }}>{dataIndex}</span>
                )
            }
        },

        {
            title: "Mac Address",
            dataIndex: "patch_mac",
            key: "patch_mac",
            ellipsis: true,
            width: 80,
            render: (dataIndex) => {
                return (
                    <span style={{ fontSize: "16px", fontWeight: "500" }}>{dataIndex}</span>
                )
            }
        },
        {
            title: "Patient",
            dataIndex: "patch_patient_map",
            key: "patch_patient_map",
            ellipsis: true,
            width: 80,
            render: (dataIndex) => {
                const patient_data = dataIndex?.patient_data?.[0] || {};
                const patientName = `${patient_data?.fname || ""} ${patient_data?.lname || ""}`;
                return (
                    <span>
                        <span style={{ fontSize: "16px", fontWeight: "500" }}>{!!patient_data?.fname ? patientName : "No Patient"}</span>
                        <span style={{
                            width: "100%",
                            textAlign: "center",
                            display: "grid"
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                                MR:
                            </span>
                            <span style={{ fontWeight: "500", marginLeft: "2px" }}>
                                Med record
                            </span>
                        </span> 
                    </span>
                )
            }
        },

        {
            title: "Gateway Status",
            dataIndex: "patch_mac",
            key: "lastSeen",
            ellipsis: true,
            width: 85,
            render: (dataIndex) => {
                return (
                    <div>
                        <div style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "16px",
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                                Battery: 
                            </span>
                            <span style={{ color: "#06A400", fontWeight: "500", marginLeft: "2px" }}>
                                Active
                            </span>
                        </div>

                        <div style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "16px",
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                            Last received: 
                            </span>
                            <span style={{ fontSize: "15px", fontWeight: "500", marginLeft: "2px" }}>
                                {moment(new Date()).format("MMM DD YYYY")}  
                            </span>
                        </div>

                        <div style={{
                            width: "100%",
                            textAlign: "center",
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                            Version: 
                            </span>
                            <span style={{ fontSize: "15px", fontWeight: "500", marginLeft: "2px" }}>
                                1.1.1.1
                            </span>
                        </div>

                    </div>
                )
            }
        },

        {
            title: "Device Status",
            dataIndex: "patch_status",
            key: "patchStatus",
            ellipsis: true,
            align: "center",
            width: 75,
            render: (dataIndex, record) => {
                // console.log('dataIndex, record', dataIndex, record);
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                minHeight: "40px"
                            }}
                        >
                            {(dataIndex === "Active") && (
                                <Tag
                                    icon={<CheckOutlined />}
                                    style={{
                                        // marginRight: "10px",
                                        width: "fit-content",
                                        color: "#06A400",
                                        background: "transparent",
                                        fontSize: "15px",
                                        // border: "2px solid #06A00020",
                                        border: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "500",
                                        height: "40px",
                                        padding: "0px 0px",
                                    }}
                                    color="#06A000"
                                >
                                    Active
                                </Tag>
                            )}
                            {(dataIndex === "Inactive") && (
                                <Tag
                                    icon={<CloseCircleOutlined />}
                                    style={{
                                        // marginRight: "10px", 
                                        width: "fit-content",
                                        color: "#DD4A34",
                                        background: "transparent",
                                        fontSize: "16px",
                                        // border: "2px solid #FFBEB4",
                                        border: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        // fontWeight: "500",
                                        // height: "40px",
                                        padding: "0px 0px",
                                        margin: "0px"
                                    }}
                                    color="#FFBEB4"
                                >
                                    Inactive
                                </Tag>
                            )}
                            {dataIndex === "Under Sterilization" && (
                                <Tag
                                    style={{
                                        // marginRight: "10px",
                                        width: "fit-content",
                                        color: "#1479FF",
                                        background: "transparent",
                                        fontSize: "16px",
                                        // border: "2px solid #1479FF",
                                        border: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "500",
                                        // height: "40px",
                                        // padding: "0px 16px",
                                        // marginLeft: "-24px",
                                        padding: "0px 0px",
                                        margin: "0px"
                                    }}
                                    color="#FFBEB4"
                                >
                                    Under Sterilization
                                </Tag>
                            )}
                            {record === activekey ? (
                                <Popover
                                    overlayClassName={"device-status-popup"}
                                    trigger="click"
                                    visible={editActiveRow === record ? true : false}
                                    placement="bottom"
                                    content={content}
                                    overlayStyle={{ paddingTop: "30px" }}
                                    overlayInnerStyle={{ background: "white" }}
                                >
                                    {editActiveRow !== record ? (
                                        <Button
                                            type="text"
                                            onClick={(e) => {
                                                openPopover(record);
                                                e.stopPropagation();
                                            }}
                                            style={editBtnStyle}
                                        >
                                            {" "}
                                            Edit
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </Popover>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                )
            },
            // filters: [
            //     {
            //         text: "Active",
            //         value: "Active",
            //     },
            //     {
            //         text: "Under Sterilization",
            //         value: "Under Sterilization",
            //     },
            //     {
            //         text: "Inactive",
            //         value: "Inactive",
            //     },
            // ],

            // onFilter: (value, record) => record.patch_status === value,

            // oncell: (record, rowindex) => {
            //     console.log(record, rowindex);
            // },
        },

        {
            title: "Sensors",
            dataIndex: "patch_type",
            key: "sensors",
            ellipsis: true,
            width: 75,
            render: (dataIndex, record) => (
                <span
                    style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        textTransform: "capitalize",
                    }}
                >
                    {record.AssociatedPatch?.length > 1 ? "Bundle" : renderLabelPatchType(dataIndex)}
                </span>
            ),
            // filters: [
            //     {
            //         text: "Bundle",
            //         value: "bundle",
            //     },
            //     {
            //         text: "Gateway",
            //         value: "gateway",
            //     },
            //     {
            //         text: "ecg",
            //         value: "ecg",
            //     },
            //     {
            //         text: "spo2",
            //         value: "spo2",
            //     },
            //     {
            //         text: "Temperature",
            //         value: "temperature",
            //     },
            // ],
            // onFilter: (value, record) => record.patch_type === value
        },
        {
            title: "Device In Use",
            dataIndex: "patch_patient_map",
            key: "patchMap",
            ellipsis: true,
            align: "center",
            width: 75,
            render: (dataIndex, record) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {dataIndex === null ? (
                        <Tag
                            icon={<CloseCircleOutlined />}
                            style={{
                                // marginRight: "16px",
                                width: "fit-content",
                                color: "#DD4A34",
                                background: "#ffffff",
                                fontSize: "16px",
                                // border: "2px solid #FFBEB4",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                // fontWeight: "500",
                                height: "40px",
                                //     padding: "0px 16px",
                                padding: "0px 0px",
                                border: "none",
                                margin: "0px"
                            }}
                            color="#FD505C"
                        >
                            Unregistered
                        </Tag>
                    ) : (
                        <Tag
                            icon={<CheckOutlined />}
                            style={{
                                // marginRight: "5px",
                                // marginLeft: "5px",
                                width: "fit-content",
                                color: "#06A400",
                                background: "#ffffff    ",
                                fontSize: "16px",
                                // border: "2px solid #06A00020",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                // fontWeight: "500",
                                height: "40px",
                                // padding: "0px 16px",
                                padding: "0px 0px",
                                border: "none",
                                margin: "0px"
                            }}
                            color="#06A400"
                        >
                            Registered
                        </Tag>
                    )}
                </div>
            ),
            // filters: [
            //     {
            //         text: "Registered",
            //         value: 1,
            //     },
            //     {
            //         text: "Unregistered",
            //         value: null,
            //     },
            // ],
            // onFilter: (value, record) => {
            //     if (value === null) {
            //         return record.patch_patient_map === null;
            //     }
            //     if (value === 1) {
            //         return record.patch_patient_map !== null;
            //     }
            // },
        },

        {
            title: "",
            dataIndex: "",
            key: "deleteIcon",
            ellipsis: true,
            width: 25,
            render: (dataIndex, record) => {
                if (record.AssociatedPatch?.length < 2) {
                    if (record.patch_patient_map !== null) {
                        return (
                            <div 
                                style={{ marginTop: "-4px", opacity: "0.5" }} 
                                onClick={() => showMessageCanNotDelete(
                                    record.AssociatedPatch?.length > 1 ? "Bundle" : "Device"
                                )}
                            >
                                <img src={iconDelete} width="22px"></img>
                            </div>
                        )
                    } else {
                        return <Popconfirm
                            placement="left"
                            title="Are you sure to delete this device?"
                            onConfirm={() => onDeleteDeviceItem(
                                record?.patch_uuid, 
                                record.AssociatedPatch?.length > 1 ? "bundle" : "device"
                            )}
                            okText="Yes"
                            cancelText="No"
                        >
                            <div style={{ marginTop: "-4px", cursor: "pointer" }}>
                                <img src={iconDelete} width="22px"></img>
                            </div>
                        </Popconfirm>
                    }
                }
            } 
        },

        // {
        //     title: "",
        //     dataIndex: "",
        //     key: "expandIcon",
        //     ellipsis: true,
        //     width: 10,
        // },
        // Table.EXPAND_COLUMN,
    ];

    const customExpandIcon = (props) => {
        if (props.record.AssociatedPatch.length > 1) {
            if (props.expanded) {
                //Data-icon when expanding
                return (
                    <div
                        onClick={(e) => {
                            props.onExpand(props?.record, e);
                        }}
                    >
                        <CaretDownOutlined
                            style={{
                                color: "#7750FD",
                                marginRight: "0px",
                                fontSize: "25px",
                                cursor: "pointer",
                            }}
                        />
                    </div>
                );
            } else {
                //Data-icon when not expanded
                return (
                    <div
                        onClick={(e) => {
                            props.onExpand(props.record, e);
                        }}
                    >
                        <CaretRightOutlined
                            style={{
                                color: "#7750FD",
                                marginRight: "0px",
                                fontSize: "25px",
                                cursor: "pointer",
                            }}
                        />
                    </div>
                );
            }
        } else {
            //No data-icon
            return null;
        }
    };

    const setInBundleDeviceStatus = (status) => {
        switch (status) {
            case 1:
                return (
                    <p className="active-patch">
                        {" "}
                        <CheckOutlined /> Active
                    </p>
                );
            case "1":
                return (
                    <p className="active-patch">
                        {" "}
                        <CheckOutlined /> Active
                    </p>
                );
            case 0:
                return (
                    <p className="inactive-patch">
                        {" "}
                        <CloseCircleOutlined /> Inactive
                    </p>
                );
            case "0":
                return (
                    <p className="inactive-patch">
                        {" "}
                        <CloseCircleOutlined /> Inactive
                    </p>
                );
            case "Under Sterilization":
                return <p className="notclean-patch"> Under Sterilization</p>;
            case "Inactive":
                return (
                    <p className="inactive-patch">
                        {" "}
                        <CloseCircleOutlined /> Inactive
                    </p>
                );
            case "Active":
                return (
                    <p className="active-patch">
                        {" "}
                        <CheckOutlined /> Active
                    </p>
                );
            default:
                return (
                    <p className="inactive-patch">
                        {" "}
                        <CloseCircleOutlined /> Inactive
                    </p>
                );
        }
    };

    const bundleModel = (record) => {
        return (
            <div key={record.patch_serial} style={{ width: "100%" }}>
                <Row style={{ height: "auto" }}>
                    {record.AssociatedPatch.map((item, index) => {
                        return (
                            <Col
                                key={index}
                                span={6}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Row className="bundle-item">
                                    <Col span={10}>
                                        {
                                            <div
                                                style={{ display: "flex", justifyContent: "center" }}
                                            >
                                                <img
                                                    alt="someimage"
                                                    src={handleImg(record.AssociatedPatch[index])}
                                                    width="80px"
                                                />
                                            </div>
                                        }
                                    </Col>
                                    <Col span={14}>
                                        <div>
                                            <div>
                                                <h1
                                                    style={{
                                                        textAlign: "left",
                                                        fontSize: "16px",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {" "}
                                                    <span>SN:</span>{" "}
                                                    {record.AssociatedPatch[index].patch_serial}
                                                </h1>
                                            </div>
                                            <div>
                                                {setInBundleDeviceStatus(
                                                    record.AssociatedPatch[index].patch_status
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        );
    };

    const menu = (
        <Menu>
            <Menu.Item
                style={{
                    textAlign: "center",
                    padding: "6px 0px 6px 0px",
                    fontSize: "16px",
                }}
                onClick={showModal}
                key="0"
            >
                Device
            </Menu.Item>
            {/* <Menu.Item
                style={{
                    textAlign: "center",
                    padding: "6px 0px 6px 0px",
                    fontSize: "16px",
                }}
                onClick={showModalGateway}
                key="2"
            >
                Gateway
            </Menu.Item> */}
            {/* <Menu.Divider />
            <Menu.Item
                style={{
                    textAlign: "center",
                    padding: "6px 0px 6px 0px",
                    fontSize: "16px",
                }}
                onClick={showBundleModal}
                key="1"
            >
                Bundle
            </Menu.Item> */}
        </Menu>
    );

    const [editActiveRow, setEditActiveRow] = useState(null);

    const openPopover = (record) => {
        if (record === "closePopOver") {
            setUpdateList(!updateList);
            setEditActiveRow(null);
            setExtraDiv(false);
        }
        if (editActiveRow === null) {
            setEditActiveRow(record);
            setExtraDiv(true);
        } else {
            setUpdateList(!updateList);
            setEditActiveRow(null);
            setExtraDiv(false);
        }
    };

    const onClickRow = (record) => {
        if (record.AssociatedPatch?.length > 1) return null;

        return {
            onMouseEnter: () => {
                if (editActiveRow === null) {
                    setActiveKey(record);
                    setValue(record.patch_status);
                }
            },
            onMouseLeave: () => {
                if (editActiveRow === null) setActiveKey(null);
            },
        };
    };

    const setRowClassName = (record) => {
        return record === editActiveRow ? "clickRowStyl" : "";
    };

    return (
        <>
            <Navbar
                startChildren={
                    <div className="user-header-heading">
                        <p>Device Inventory</p>
                    </div>
                }
                centerChildren={
                    <>
                        <div style={{ width: "100%" }}>
                            <GlobalSearch
                                enterButton
                                onSearch={(val) => setValSearch(val)}
                                style={{
                                    width: "100%",
                                }}
                                placeholder="Search"
                            />
                        </div>
                    </>
                }
                endChildren={
                    <>
                        <Dropdown
                            overlay={menu}
                            trigger={["click"]}
                            placement="bottom"
                        >
                            <Buttons style={{ marginRight: "24px" }} className="utility">
                                {" "}
                                <span style={{ marginRight: "10px" }}>
                                    {Icons.PlusOutlined({})}
                                </span>{" "}
                                Add Device
                            </Buttons>
                        </Dropdown>
                        <div>
                            <PaginationBox
                                totalPages={totalPages}
                                currentPageVal={currentPageVal}
                                setCurrentPageVal={setCurrentPageVal}
                            />
                        </div>
                    </>
                }
            />

            <Row
                className="table-body devie-inventory-table"
                justify="start"
                style={{ padding: "0", backgroundColor: "white", margin: "4px" }}
            >
                <div style={{ margin: "30px 2%", width: "100%" }}>
                    {extraDiv === true ? <div className="blur-div"></div> : null}
                    <Table
                        style={{ backgroundColor: "white" }}
                        columns={columns}
                        size="middle"
                        onChange={onChange}
                        pagination={{ position: ["bottomRight"] }}
                        scroll={extraDiv === true ? { y: "hidden" } : { y: "calc(100vh - 237px)" }}
                        rowClassName={setRowClassName}
                        // expandable={{
                        //     expandedRowRender: (record) => bundleModel(record),
                        //     expandIcon: (props) => customExpandIcon(props)
                        // }}
                        dataSource={filteredlist}
                        onRow={onClickRow}
                    />
                </div>
            </Row>

            <Modal
                visible={visible}
                title=""
                onCancel={handleCancel}
                maskClosable={false}
                footer={null}
                closable={true}
                width="60%"
                destroyOnClose={true}
            >
                <PatchInventoryModal onGetList={fetchPatchList} />
            </Modal>

            <Modal
                visible={bundle}
                title=""
                onCancel={handleBundle}
                maskClosable={false}
                footer={null}
                closable={true}
                width="60%"
                destroyOnClose={true}
            >
                <AddBundleModal onGetList={fetchPatchList} />
            </Modal>

            <Modal
                visible={gateway}
                title=""
                onCancel={onCloseGateway}
                maskClosable={false}
                footer={null}
                closable={true}
                width="60%"
                destroyOnClose={true}
            >
                <AddGatewayModal onGetList={fetchPatchList} />
            </Modal>
        </>
    );
}

export default withRouter(PatchInventory);
