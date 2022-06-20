import React, { useState, useEffect } from "react";
import Icons from "../../../Utils/iconMap";
import {
    Input,
    Col,
    Row,
    notification,
    Form,
    Select,
    Descriptions,
    Image,
    message,
    Menu,
} from "antd";
import ecgImg from "../../../Assets/Images/ecg.png";
import tempImg from "../../../Assets/Images/temp1.png";
import gatewayImg from "../../../Assets/Images/gateway.png";
// import spo2Img from "../../../Assets/Images/spo2.jpg";
import bpImg from "../../../Assets/Images/BP-sensor.png";
import digitalScale from "../../../Assets/Images/DigitalScale.png";
import spo2Img from "../../../Assets/Images/spo2img.png";

import deviceApi from "../../../Apis/deviceApis";
import { Button } from "../../../Theme/Components/Button/button";
import { UserStore } from "../../../Stores/userStore";

const { Option } = Select;

const PatchForm = (props) => {
    const [deviceImg, setDeviceimg] = useState({
        patchImage: gatewayImg,
        patchHead: "Gateway Sensor",
        width: "100%",
        style: { marginLeft: "-2.5em", marginTop: "-2.5rem" },
    });

    const [isBpSensor, setIsBpSensor] = useState(false);
    const [gatewayList, setGatewayList] = useState([]);

    useEffect(() => {
        const user = UserStore.getUser();
        deviceApi
            .getPatchesData("gateway", -1, "", user.tenant)
            .then((res) => {
                setGatewayList(res.data?.response?.patches);
            })
            .catch((err) => {});
    }, []);

    const handleimg = (value) => {
        switch (value) {
            case "temperature":
                setIsBpSensor(false);
                return setDeviceimg({
                    patchImage: tempImg,
                    patchHead: "Temp Sensor",
                    width: "100%",
                    style: { marginLeft: "1em" },
                });
            case "ecg":
                setIsBpSensor(false);
                return setDeviceimg({
                    patchImage: ecgImg,
                    patchHead: "ECG Sensor",
                    width: "100%",
                    style: { marginLeft: "1em" },
                });
            case "spo2":
                setIsBpSensor(false);
                return setDeviceimg({
                    patchImage: spo2Img,
                    patchHead: "SpO2 Sensor",
                    width: "90%",
                    style: { marginLeft: "-1.4em" },
                });
            case "gateway":
                setIsBpSensor(false);
                return setDeviceimg({
                    patchImage: gatewayImg,
                    patchHead: "Gateway Sensor",
                    width: "100%",
                    style: { marginLeft: "-2.5em", marginTop: "-2.5rem" },
                });
            case "digital":
                setIsBpSensor(false);
                return setDeviceimg({
                    patchImage: digitalScale,
                    patchHead: "Digital Scale",
                    width: "55%",
                    style: { marginLeft: "1em" },
                });
            case "bps":
                setIsBpSensor(true);
                return setDeviceimg({
                    patchImage: bpImg,
                    patchHead: "Alphamed",
                    width: "47%",
                    style: { marginLeft: "1em" },
                });
            case "alphamed":
                setIsBpSensor(true);
                return setDeviceimg({
                    patchImage: bpImg,
                    patchHead: "Alphamed",
                    width: "47%",
                    style: { marginLeft: "1em" },
                });
            case "ihealth":
                setIsBpSensor(true);
                return setDeviceimg({
                    patchImage: bpImg,
                    patchHead: "iHealth",
                    width: "47%",
                    style: { marginLeft: "1em" },
                });
            default:
                return null;
        }
    };

    // const success = () => {
    //     message.success("New device added successfully");
    // };

    const addPatchDetails = (values) => {
        const newList = props.patientClass.list;
        const serialNumber = values.serialNumber.trim();
        const macAddress = values.macAddress.trim();
        newList[props.menuState].error = false;
        newList[[props.menuState]].delete = false;
        newList[[props.menuState]].added = true;
        newList[[props.menuState]].patchType = values.patchType !== "bps" ? values.patchType : values.bpType;
        newList[[props.menuState]].patchserial = serialNumber;
        newList[[props.menuState]].macAddress = macAddress;

        let tenantUser = JSON.parse(localStorage.getItem("user"));

        const dataBody = {
            data: [
                {
                    patch_type: values.patchType !== "bps" ? values.patchType : values.bpType,
                    patch_status: "Active",
                    patch_serial: serialNumber,
                    tenant_id: tenantUser.tenant,
                    patch_mac: macAddress,
                },
            ],
            tenantId: tenantUser.tenant,
            actionType: "device"
        }

        deviceApi
            .addDevice(dataBody)
            .then((res) => {
                message.success("New device added successfully");
                props.setClass({ list: [...newList] });
                props.onGetList();
            })
            .catch((err) => {
                if (err) {
                    const error = "" + err?.response?.data?.message;
                    notification.error({
                        message: "Error",
                        description: `${error}` || "",
                    });
                }
            });
    };

    const raiseError = () => {
        const newList = props.patientClass.list;
        // const num = props.patientClass.list.length;
        newList[props.menuState].error = true;
        props.setClass({ list: [...newList] });
    };

    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={addPatchDetails}
            onFinishFailed={raiseError}
        >
            <Row span={24} justify="space-around">
                <Col span={12} style={{ paddingRight: "2em" }}>
                    <Form.Item
                        required={props.required}
                        label="Device type"
                        name="patchType"
                        rules={[
                            {
                                required: props.required,
                                message: "Select one device type!",
                            },
                        ]}
                        className="addPatchFormItem"
                        initialValue="gateway"
                    >
                        <Select
                            showSearch
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={true}
                            onChange={handleimg}
                        >
                            <Option value="gateway">Gateway Sensor (EV-04)</Option>
                            <Option value="temperature">Temperature Sensor</Option>
                            <Option value="spo2">SpO2 (CheckMe)</Option>
                            <Option value="ecg">ECG Sensor</Option>
                            <Option value="digital">Digital Scale</Option>
                            <Option value="bps">BP Sensor</Option>
                        </Select>
                    </Form.Item>

                    {/* {deviceImg.patchHead !== "Gateway Sensor" && (
                        <Form.Item
                            required={props.required}
                            label="Gateway"
                            name="gateway"
                            rules={[
                                {
                                    required: props.required,
                                    message: "Gateway is required",
                                },
                            ]}
                            className="addPatchFormItem"
                        >
                            <Select
                                showSearch
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={true}
                            >
                                {gatewayList.map(item => {
                                    return (
                                        <Option key={item.patch_serial} value={item.patch_serial}>{item.patch_serial}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    )} */}

                    {isBpSensor && (
                        <Form.Item
                            required={!props.required}
                            label="BP type"
                            name="bpType"
                            rules={[
                                {
                                    required: props.required,
                                    message: "Select one bp type!",
                                },
                            ]}
                            className="addPatchFormItem"
                            initialValue="alphamed"
                        >
                            <Select
                                showSearch
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                // filterOption={true}
                                // defaultValue="temperature"
                                onChange={handleimg}
                            >
                                <Option value="alphamed">Alphamed</Option>
                                <Option value="ihealth">iHealth</Option>
                            </Select>
                        </Form.Item>
                    )}
                    
                    <Form.Item
                        required={props.required}
                        label="Serial Number"
                        name="serialNumber"
                        rules={[
                            {
                                required: props.required,
                                message: "Serial number is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <Input placeholder="Enter Serial Number" maxLength={30} />
                    </Form.Item>
                    <Form.Item
                        required={props.required}
                        label="MAC address"
                        name="macAddress"
                        rules={[
                            {
                                required: props.required,
                                message: "Mac address is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <Input placeholder="Enter Mac address" maxLength={30} />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item>
                                <Button className="primary" htmlType="submit">
                                    Add Device
                                </Button>
                            </Form.Item>
                        </Col>
                        {/* <Col span={12}>
                            <Button type="primary" onClick={deletePatch}>
                                Delete
                        </Button>
                        </Col> */}
                    </Row>
                </Col>
                <Col span={12}>
                    <h2 style={{ fontSize: "40px", fontWeight: "bold" }}>
                        {deviceImg.patchHead}
                    </h2>
                    <div>
                        <Image
                            width={deviceImg.width}
                            src={deviceImg.patchImage}
                            preview={false}
                            style={deviceImg.style}
                        />
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

const toProperName = (itemType) => {
    switch (itemType) {
        case "temperature":
            return "Temperature Sensor";
        case "ecg":
            return "ECG Sensor";
        case "spo2":
            return "SpO2 Sensor";
        case "gateway":
            return "Gateway Sensor";
        case "digital":
            return "Digital Scale";
        case "alphamed":
            return "Alphamed";
        case "ihealth":
            return "iHealth";
        default:
            return null;
    }
};

const PatchDisplay = (props) => {
    return (
        <Descriptions title="Device Info" layout="vertical" bordered>
            <Descriptions.Item
                label="Device Type"
                labelStyle={{ backgroundColor: "#FBFBFB" }}
                style={{ paddingRight: "12px", paddingLeft: "12px" }}
            >
                {toProperName(props.patientClass.list[props.menuState].patchType)}
            </Descriptions.Item>
            <Descriptions.Item 
                label="Device Serial Number" 
                style={{ paddingRight: "12px", paddingLeft: "12px" }}
            >
                {props.patientClass.list[props.menuState].patchserial}
            </Descriptions.Item>
            <Descriptions.Item 
                label="Device MAC Address" 
                style={{ paddingRight: "12px", paddingLeft: "12px" }}
            >
                {props.patientClass.list[props.menuState].macAddress}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default function PatchInventoryModal(props) {
    const layout = {
        labelCol: { sm: 24, md: 30 },
        wrapperCol: { sm: 24, md: 24 },
    };

    const required = true;

    const [menuState, setMenuState] = useState(0);

    const [patientClass, setClass] = useState({
        isloading: false,
        list: [
            {
                class: "Device 1",
                error: false,
                added: false,
                delete: false,
                Component1: PatchForm,
                Component2: PatchDisplay,
                patchType: "",
                patchserial: "",
            },
        ],
    });

    // const customMenuSelected = "customMenuSelected";
    // const customMenuErrorSelected = "customMenuErrorSelected";
    // const customMenu = "customMenu";
    // const customMenuError = "customMenuError";

    const addPatch = () => {
        if (patientClass.list.length < 5) {
            let newList = patientClass.list.concat({
                class: `Device ${patientClass.list.length + 1}`,
                error: false,
                added: false,
                delete: true,
                Component1: PatchForm,
                Component2: PatchDisplay,
                patchType: "",
                patchserial: "",
            });

            setClass({ list: newList });
        } else {
            const key = "warning";
            notification.warn({
                key,
                message: "Sorry",
                description: "Only 5 Devices can be added at once.",
                placement: "bottomRight",
            });
        }
    };

    const info = () => {
        message.info("At least one Device should be added");
    };

    const deletePatch = (event, index) => {
        event.stopPropagation();

        if (patientClass.list.length === 1) {
            info();
        } else {
            let newList = patientClass.list.filter((el, id) => id !== index);
            newList.forEach((item, index) => {
                item.class = `Device ${index + 1}`
            });

            setClass({ list: newList });

            if (Number(menuState) === Number(index)) {
                setMenuState(Number(index - 1));
            }
        }
    };

    const handleMenuState = ({ key }) => {
        setMenuState(Number(key));
    };

    return (
        <>
            <Row justify="center" align="middle" style={{ padding: "2em" }}>
                <Col span={24}>
                    <Row span={24}>
                        <Col className="addPatientDetailsMenu" xs={24} lg={8}>
                            <Menu
                                onClick={handleMenuState}
                                // defaultSelectedKeys={[patientClass.list[0].class]}
                                selectedKeys={menuState.toString()}
                                mode="inline"
                            >
                                {patientClass.list.map((listItem, index) => (
                                    <Menu.Item key={index} className="add-patient-menu-item">
                                        <Row justify="space-around" align="middle">
                                            <Col span={18}>
                                                <span>{listItem.class}</span>
                                            </Col>
                                            
                                            <Col span={6} style={{ display: "flex", alignItems: "center" }}>
                                                {listItem.error && (
                                                    Icons.exclamationCircleOutlined({ Style: { marginRight: "1rem" }})
                                                )}

                                                {listItem.added && Icons.checkCircleFilled({})}

                                                {listItem.delete && (
                                                    <div
                                                        onClick={(e) => {
                                                            deletePatch(e, index);
                                                        }}
                                                        style={{ display: "flex" }}
                                                    >
                                                        {Icons.CloseCircleOutlined({})}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </Menu.Item>
                                ))}
                            </Menu>
                            <div onClick={addPatch} style={{ padding: "1em", cursor: "pointer" }}>
                                Add Another Device{" "}
                                {Icons.addIcon({ style: { paddingLeft: "1em" } })}
                            </div>
                        </Col>

                        <Col
                            style={{ padding: "2em", maxWidth: "65em", paddingRight: "0" }}
                            sm={24}
                            lg={16}
                            className="patchFormScrollContainer"
                        >
                            {patientClass.list.map(
                                (Item, index) =>
                                    <React.Fragment key={index}>
                                        {
                                            menuState === index &&
                                            (!Item.added ? (
                                                <Item.Component1
                                                    layout={layout}
                                                    required={required}
                                                    menuState={menuState}
                                                    setMenuState={setMenuState}
                                                    patientClass={patientClass}
                                                    setClass={setClass}
                                                    key={index}
                                                    onGetList={props.onGetList}
                                                />
                                            ) : (
                                                <Item.Component2
                                                    patientClass={patientClass}
                                                    menuState={menuState}
                                                />
                                            ))
                                        }
                                </React.Fragment>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
