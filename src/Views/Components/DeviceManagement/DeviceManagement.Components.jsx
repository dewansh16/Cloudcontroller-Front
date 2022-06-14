import React, { useState, useEffect } from "react";

import { Menu, Col, Row, notification, Upload, Button } from "antd";
import DeviceDetails from "./Components/DeviceData/deviceDetails/deviceDetails.DeviceData.Components.DeviceManagement.Components";
import { InboxOutlined } from '@ant-design/icons';

import patientApi from "../../../Apis/patientApis";
import { UserStore } from "../../../Stores/userStore";

import "./DeviceManagement.css";

const { Dragger } = Upload;

// function FetchPatchInfo(pid) {
//     const [response, setResponse] = useState(null)
//     const [loading, setLoading] = useState(true)
//     useEffect(() => {

//         patientApi.getPatientPatches(pid).then((res) => {
//             setResponse(res.data.response)
//             setLoading(false);
//         }).catch((err) => {
//             if (err) {
//                 const error = err.response.data?.result;
//                 notification.error({
//                     message: 'Error',
//                     description: `${error}` || ""
//                 })
//                 setLoading(false);
//             }
//         })
//     }, [pid])

//     return [response, loading]
// }

function DeviceManagement({ pid, associated_list, valDuration }) {
    const [deviceClass, setClass] = useState({
        isLoading: true,
        list: [],
    });

    const [isUpload, setIsUpload] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [menuState, setMenuState] = useState();
    const [uploadTypeList, setUploadTypeList] = useState({})

    const handleMenuState = ({ item, key }) => {
        setMenuState(key);
    };

    function theMenuItemSort(list) {
        let temp = null;
        list.map((item, idx) => {
            if (item["patches.patch_type"] === "gateway") {
                temp = list[0];
                list[0] = list[idx];
                list[idx] = temp;
            }
        });
        return list;
    }

    // useEffect(() => {
    //     getDataSensorFromInfluxDB();
    // }, [])

    useEffect(() => {
        const { tenant = '' } = UserStore.getUser();

        patientApi
            .getPatientPatches(pid, tenant)
            .then((res) => {
                setClass({
                    list: theMenuItemSort(res.data?.response.patch_patient_map),
                    isLoading: false,
                });
                if (res.data?.response.patch_patient_map.length > 0) {
                    setMenuState(
                        `${res.data?.response.patch_patient_map[0]["patches.patch_type"]}-0`
                    );
                }
            })
            .catch((err) => {
                if (err) {
                    notification.error({
                        message: "Error",
                        description: `${err.response?.data.result}` || "",
                    });
                    setClass({ list: [], isLoading: false });
                }
            });
    }, [pid]);

    function menuItemName(device) {
        switch (device) {
            case "temperature":
                return "Temperature";
            case "ecg":
                return "ECG";
            case "spo2":
                return "Spo2";
            case "gateway":
                return "Gateway";
            case "digital":
                return "Digital";
            case "ihealth":
                return "IHealth";
            case "alphamed":
                return "Alphamed";
            default:
                return null;
        }
    }

    const onDetachAssociate = (uuid, type) => () => {
        patientApi.detachSensorOfPatient({
            patch_uuid: uuid,
            type_device: type,
            associated_list: JSON.parse(associated_list),
            action: "unassociate",
            pid: pid
        })
            .then(() => {
                let newList = [...deviceClass.list];
                newList = newList.filter(device => device["patches.patch_uuid"] !== uuid);
                setClass({
                    ...deviceClass,
                    list: newList
                })
                if (newList?.length > 0) {
                    setMenuState(
                        `${newList[0]["patches.patch_type"]}-0`
                    );
                }
                notification.success({
                    message: 'Detach',
                    description: "Detach sensor succesfully!"
                })
            })
            .catch(() => {
                notification.error({
                    message: 'Detach',
                    description: "Detach sensor failed!"
                })
            })
    };

    const propsUpload = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
        },
    };

    return (
        <div>
            <Row span={24}>
                <Col span={24}>
                    <div className="heading">
                        <h1>Device Management</h1>
                    </div>
                </Col>
                {/* <Col span={4}>
                    <Button 
                        onClick={() => { setIsUpload(!isUpload) }} 
                        className="primary" 
                        style={{ fontSize: "1rem", padding: "0.35rem 2rem", height: "auto" }} 
                    >
                        {isUpload ? "Cancel" : "Upload"} 
                    </Button> 
                </Col> */}
            </Row>
            {isUpload ? (
                <div style={{ height: "80%", margin: "1% 5% 5% 5%"}}>
                <Dragger {...propsUpload} showUploadList={true} multiple={true}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
            </div>
            ) : (
                <>
                    {deviceClass.list.length > 0 && (
                        <Row>
                            <Col span={6}>
                                <div className="menu-box">
                                    <Menu
                                        onClick={handleMenuState}
                                        // defaultSelectedKeys={menuState}
                                        selectedKeys={[menuState]}
                                        mode="inline"
                                    >
                                        {deviceClass.list.map((listItem, index) => {
                                            return (
                                                <Menu.Item
                                                    key={`${listItem?.["patches.patch_type"]}-${index}`}
                                                    className="menu-item"
                                                >
                                                    {menuItemName(listItem?.["patches.patch_type"])}
                                                </Menu.Item>
                                            )
                                        })}
                                    </Menu>
                                </div>
                            </Col>
                            <Col span={18}>
                                <div className="data-container">
                                    {deviceClass.list.map(
                                        (Item, index) =>
                                            menuState === `${Item["patches.patch_type"]}-${index}` && (
                                                <DeviceDetails
                                                    serial={Item["patches.patch_serial"]}
                                                    key={`${Item["patches.patch_type"]}-${index}`}
                                                    uuid={Item["patches.patch_uuid"]}
                                                    duration={Item["duration"]}
                                                    pid={pid}
                                                    deviceType={Item["patches.patch_type"]}
                                                    onDetach={onDetachAssociate}
                                                    valDuration={valDuration}
                                                    macAddress={Item["patches.patch_mac"]}
                                                />
                                            )
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}
        
                    {deviceClass.list.length === 0 && (
                        <div
                            style={{
                                position: "relative",
                                height: "400px",
                                boxShadow: "rgb(0 0 0 / 5%) 0px 0px 20px",
                            }}
                        >
                            <h1
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "3em",
                                    opacity: "0.5",
                                }}
                            >
                                No Device Attached
                            </h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default DeviceManagement;
