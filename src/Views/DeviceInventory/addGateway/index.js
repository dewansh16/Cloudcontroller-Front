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

import watchImg from "../../../Assets/Images/watch.jpg";
import { Button } from "../../../Theme/Components/Button/button";

const { Option } = Select;

const PatchForm = (props) => {
    const [deviceImg, setDeviceimg] = useState({
        patchImage: watchImg,
        patchHead: "Gateway",
        width: "47%",
        style: { marginLeft: "2em" },
    });

    const [isBpSensor, setIsBpSensor] = useState(false);

    const handleimg = (value) => {
        switch (value) {
            case "gateway":
                setIsBpSensor(false);
                return setDeviceimg({
                    patchImage: watchImg,
                    patchHead: "Gateway",
                    width: "47%",
                    style: { marginLeft: "2em" },
                });
            default:
                return null;
        }
    };

    // const success = () => {
    //     message.success("New device added successfully");
    // };

    const addPatchDetails = (values) => {
        
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
                        label="Gateway type"
                        name="gatewayType"
                        rules={[
                            {
                                required: props.required,
                                message: "Select one gateway type!",
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
                            // defaultValue="temperature"
                            onChange={handleimg}
                        >
                            <Option value="gateway">Gateway (EV-04)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        required={!props.required}
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
                        <Input placeholder="Enter Serial Number" />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item>
                                <Button className="primary" htmlType="submit">
                                    Add Gateway
                                </Button>
                            </Form.Item>
                        </Col>
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
        case "gateway":
            return "Gateway";
        default:
            return null;
    }
};

const PatchDisplay = (props) => {
    return (
        <Descriptions title="Gateway Info" layout="vertical" bordered>
            <Descriptions.Item
                label="Gateway Type"
                labelStyle={{ backgroundColor: "#FBFBFB" }}
            >
                {toProperName(props.patientClass.list[props.menuState].patchType)}
            </Descriptions.Item>
            <Descriptions.Item label="Gateway Serial Number">
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
                class: "Gateway 1",
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

    const addPatch = () => {
        if (patientClass.list.length < 5) {
            let newList = patientClass.list.concat({
                class: `Gateway ${patientClass.list.length + 1}`,
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
                description: "Only 5 Gateways can be added at once.",
                placement: "bottomRight",
            });
        }
    };

    const info = () => {
        message.info("At least one Gateway should be added");
    };

    const deletePatch = (event, index) => {
        event.stopPropagation();

        if (patientClass.list.length === 1) {
            info();
        } else {
            let newList = patientClass.list.filter((el, id) => id !== index);
            newList.forEach((item, index) => {
                item.class = `Gateway ${index + 1}`
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
                                                        onClick={(e) => {
                                                            deletePatch(e, index);
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
                            <div onClick={addPatch} style={{ padding: "1em", cursor: "pointer" }}>
                                Add Another Gateway{" "}
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
