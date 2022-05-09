import React, { useState, useEffect } from "react";
import { Menu, Col, Row, notification } from "antd";
import DeviceDetails from "./Components/DeviceData/deviceDetails/deviceDetails.DeviceData.Components.DeviceManagement.Components";

import patientApi from "../../../Apis/patientApis";

import "./DeviceManagement.css";

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

function DeviceManagement({ pid }) {
    const [deviceClass, setClass] = useState({
        isLoading: true,
        list: [],
    });
    const [menuState, setMenuState] = useState();
    const handleMenuState = ({ item, key }) => {
        setMenuState(key);
    };

    function theMenuItemSort(list) {
        let temp = null;
        list.map((item, idx) => {
            if (item.patches[0]["patch_type"] === "gateway") {
                temp = list[0];
                list[0] = list[idx];
                list[idx] = temp;
            }
        });
        return list;
    }

    useEffect(() => {
        patientApi
            .getPatientPatches(pid)
            .then((res) => {
                setClass({
                    list: theMenuItemSort(res.data?.response.patch_patient_map),
                    isLoading: false,
                });
                if (res.data?.response.patch_patient_map.length > 0) {
                    setMenuState(
                        res.data?.response.patch_patient_map[0].patches[0]["patch_type"]
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

    return (
        <div>
            <Row span={24}>
                <Col span={24}>
                    <div className="heading">
                        <h1>Device Management</h1>
                    </div>
                </Col>
            </Row>
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
                                {deviceClass.list.map((listItem) => (
                                    <Menu.Item
                                        key={listItem.patches[0]["patch_type"]}
                                        className="menu-item"
                                    >
                                        {menuItemName(listItem.patches[0]["patch_type"])}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        </div>
                    </Col>
                    <Col span={18}>
                        <div className="data-container">
                            {deviceClass.list.map(
                                (Item) =>
                                    menuState === Item.patches[0]["patch_type"] && (
                                        <DeviceDetails
                                            serial={Item.patches[0]["patch_serial"]}
                                            key={Item.patches[0]["patch_type"]}
                                            uuid={Item["patch_uuid"]}
                                            duration={Item["duration"]}
                                            pid={pid}
                                            deviceType={menuState}
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
        </div>
    );
}

export default DeviceManagement;
