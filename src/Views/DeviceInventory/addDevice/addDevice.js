import React, { useState } from "react";
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
import watchImg from "../../../Assets/Images/watch.jpg";
import spo2Img from "../../../Assets/Images/spo2.jpg";
import bpImg from "../../../Assets/Images/BP-sensor.png";
import deviceApi from "../../../Apis/deviceApis";
import { Button } from "../../../Theme/Components/Button/button";

const { Option } = Select;

const PatchForm = (props) => {
    const [deviceImg, setDeviceimg] = useState({
        patchImage: tempImg,
        patchHead: "Temp Sensor",
        width: "100%",
        style: { marginLeft: "1em" },
    });

    const handleimg = (value) => {
        switch (value) {
            case "temperature":
                return setDeviceimg({
                    patchImage: tempImg,
                    patchHead: "Temp Sensor",
                    width: "100%",
                    style: { marginLeft: "1em" },
                });
            case "ecg":
                return setDeviceimg({
                    patchImage: ecgImg,
                    patchHead: "ECG Sensor",
                    width: "100%",
                    style: { marginLeft: "1em" },
                });
            case "spo2":
                return setDeviceimg({
                    patchImage: spo2Img,
                    patchHead: "SpO2 Sensor",
                    width: "90%",
                    style: { marginLeft: "-2.4em" },
                });
            case "gateway":
                return setDeviceimg({
                    patchImage: watchImg,
                    patchHead: "Watch Sensor",
                    width: "47%",
                    style: { marginLeft: "1em" },
                });
            case "bp":
                return setDeviceimg({
                    patchImage: bpImg,
                    patchHead: "BP Sensor",
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
        newList[props.menuState].error = false;
        newList[[props.menuState]].delete = false;
        newList[[props.menuState]].added = true;
        newList[[props.menuState]].patchType = values.patchType;
        newList[[props.menuState]].patchserial = values.serialNumber;

        props.setClass({ list: [...newList] });

        let tenantUser = JSON.parse(localStorage.getItem("user"));

        const dataBody = {
            data: [
                {
                    patch_type: values.patchType,
                    patch_status: "Active",
                    patch_serial: values.serialNumber,
                    tenant_id: tenantUser.tenant,
                    patch_mac: values.macAddress,
                },
            ],
            tenantId: tenantUser.tenant,
            actionType: "device"
        }

        deviceApi
            .addDevice(dataBody)
            .then((res) => {
                message.success("New device added successfully");
                props.onGetList();
            })
            .catch((err) => {
                if (err) {
                    const error = "" + err;
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
                        required={!props.required}
                        label="Device type"
                        name="patchType"
                        rules={[
                            {
                                required: props.required,
                                message: "Select one device type!",
                            },
                        ]}
                        className="addPatchFormItem"
                        initialValue="temperature"
                    >
                        <Select
                            showSearch
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={true}
                            // defaultValue="temperature"
                            onChange={handleimg}
                        >
                            <Option value="temperature">Temperature Sensor</Option>
                            <Option value="gateway">Gateway Sensor (EV-04)</Option>
                            <Option value="spo2">SpO2 Sensor (Aeon)</Option>
                            <Option value="ecg">ECG Sensor</Option>
                            <Option value="bp">BP Sensor</Option>
                        </Select>
                    </Form.Item>

                    {/* {deviceImg.patchHead === "BP Sensor" && (
                        <Form.Item
                            required={!props.required}
                            label="BP type"
                            name="bpType"
                            rules={[
                                {
                                    required: props.required,
                                    message: "Select one device type!",
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
                                // onChange={handleimg}
                            >
                                <Option value="alphamed">Alphamed</Option>
                                <Option value="ihealth">iHealth</Option>
                            </Select>
                        </Form.Item>
                    )} */}
                    
                    <Form.Item
                        required={!props.required}
                        label="Serial Number"
                        name="serialNumber"
                        rules={[
                            {
                                required: props.required,
                                message: "serial number is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <Input placeholder="Enter Serial Number" />
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="MAC address"
                        name="macAddress"
                        rules={[
                            {
                                required: props.required,
                                message: "serial number is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <Input placeholder="Enter Mac address" />
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
            >
                {toProperName(props.patientClass.list[props.menuState].patchType)}
            </Descriptions.Item>
            <Descriptions.Item label="Device Serial Number">
                {props.patientClass.list[props.menuState].patchserial}
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

    const deletePatch = (index) => {
        if (patientClass.list.length === 1) {
            info();
        } else {
            let newList = patientClass.list.filter((el, id) => id !== index);
            setClass({ list: newList });
            // setMenuState(index-1);
        }
    };

    const handleMenuState = ({ item, key, keyPath }) => {
        setMenuState(parseInt(key));
        console.log(item, key, keyPath);
    };

    return (
        <>
            <Row justify="center" align="middle" style={{ padding: "2em" }}>
                <Col span={24}>
                    <Row span={24}>
                        <Col className="addPatientDetailsMenu" xs={24} lg={8}>
                            <Menu
                                onClick={handleMenuState}
                                defaultSelectedKeys={[patientClass.list[0].class]}
                                mode="inline"
                            >
                                {patientClass.list.map((listItem, index) => (
                                    <Menu.Item key={index} className="add-patient-menu-item">
                                        <Row justify="space-around" align="bottom">
                                            <Col span={18}>
                                                <span>{listItem.class}</span>
                                            </Col>
                                            <Col span={6}>
                                                {listItem.error
                                                    ? Icons.exclamationCircleOutlined({})
                                                    : ""}
                                                {listItem.added ? Icons.checkCircleFilled({}) : ""}
                                                {listItem.delete ? (
                                                    <div
                                                        onClick={() => {
                                                            deletePatch(index);
                                                        }}
                                                    >
                                                        {Icons.CloseCircleOutlined({})}
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </Col>
                                        </Row>
                                    </Menu.Item>
                                ))}
                            </Menu>
                            <div onClick={addPatch} style={{ padding: "1em" }}>
                                Add Another Device{" "}
                                {Icons.addIcon({ style: { paddingLeft: "1em" } })}
                            </div>
                        </Col>
                        <Col
                            style={{ padding: "2em", maxWidth: "65em" }}
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
