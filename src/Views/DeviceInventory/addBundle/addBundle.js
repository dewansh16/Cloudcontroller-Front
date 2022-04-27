import React, { useState, useEffect } from "react";
import Icons from "../../../Utils/iconMap";
import {
    Spin,
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
import deviceApi from "../../../Apis/deviceApis";
import { Button } from "../../../Theme/Components/Button/button";

import { UserStore } from '../../../Stores/userStore';

const { Option } = Select;

// function FetchDevices(deviceType, inUse) {
//     const [response, setResponse] = useState([]);
//     const [loading, setLoading] = useState(true)
//     useEffect(() => {

//         deviceApi.getPatchesData(deviceType, inUse).then((res) => {
//             setResponse(res.data?.response.patches)
//             console.log(res.data?.response, `/patch/patchinventory?devicetype=${deviceType}&inuse=${inUse}`)
//             setLoading(false);
//         }).catch((err) => {
//             if (err) {
//                 const error = err.response.data?.result
//                 notification.error({
//                     message: 'Error',
//                     description: `${error}` || ""
//                 })
//                 setLoading(false);
//             }
//         })
//     }, [deviceType, inUse])

//     return [response, loading]
// }

const PatchForm = (props) => {
    const success = () => {
        message.success("New Bundle added successfully");
    };

    const user = UserStore.getUser();

    const addPatchDetails = (values) => {
        const newList = props.patientClass.list;
        newList[props.menuState].error = false;
        newList[[props.menuState]].added = true;

        newList[[props.menuState]].patchserial1 = values.GatewayserialNumber;
        newList[[props.menuState]].patchserial2 = values.ECGserialNumber;
        newList[[props.menuState]].patchserial3 = values.TempserialNumber;
        newList[[props.menuState]].patchserial4 = values.SpserialNumber;

        props.setClass({ list: [...newList] });

        const dataBody = {
            data: [
                {
                    temperature: values.TempserialNumber,
                    ecg: values.ECGserialNumber,
                    spo2: values.SpserialNumber,
                    gateway: values.GatewayserialNumber,
                },
            ],
            tenantId: user.tenant,
            actionType: "bundle"
        }

        deviceApi
            .addPatchBundle(dataBody)
            .then((res) => {
                success();
                props.onGetList();
            })
            .catch((err) => {
                const error = err.response?.data?.result;
                if (err) {
                    notification.error({
                        message: "Error",
                        description: `${error}` || "",
                    });
                    console.log(err);
                }
            });
    };

    const [gatewayRes, setGatewayRes] = useState([]);
    const [ecgRes, setEcgRes] = useState([]);
    const [spo2Res, setSpo2Res] = useState([]);
    const [temperatureRes, setTemperatureRes] = useState([]);

    const [gatewayFetched, setGatewayFetched] = useState(false);
    const [ecgFetched, setEcgFetched] = useState(false);
    const [spo2Fetched, setSpo2Fetched] = useState(false);
    const [temperatureFetched, setTemperatureFetched] = useState(false);

    useEffect(() => {
        fetchPatchesData("gateway");
        fetchPatchesData("ecg");
        fetchPatchesData("temperature");
        fetchPatchesData("spo2");
    }, []);

    const fetchPatchesData = (deviceType, patchSerial) => {
        deviceApi
            .getPatchesData(deviceType, -1, patchSerial, user.tenant)
            .then((res) => {
                switch (deviceType) {
                    case "gateway": {
                        setGatewayRes(res.data?.response.patches);
                        break;
                    }
                    case "ecg": {
                        setEcgRes(res.data?.response.patches);
                        break;
                    }
                    case "spo2": {
                        setSpo2Res(res.data?.response.patches);
                        break;
                    }
                    case "temperature": {
                        setTemperatureRes(res.data?.response.patches);
                        break;
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    const error = err.response?.data?.result;
                    notification.error({
                        message: "Error",
                        description: `${error}` || "",
                    });
                }
            });
    };

    // const [gatewayRes, setGatewayRes] = FetchDevices('gateway', -1);
    // const [ecgRes, setEcgRes] = FetchDevices('ecg', -1);
    // const [spo2Res, setSpo2Res] = FetchDevices('spo2', -1);
    // const [temperatureRes, setTemperatureRes] = FetchDevices('temperature', -1);

    const raiseError = () => {
        const newList = props.patientClass.list;
        newList[props.menuState].error = true;
        props.setClass({ list: [...newList] });
    };

    return (
        <>
            {
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
                                label="Gateway Serial Number"
                                name="GatewayserialNumber"
                                rules={[
                                    {
                                        required: props.required,
                                        message: "serial number is required",
                                    },
                                ]}
                                className="addPatientDetailsModal"
                            >
                                <Select
                                    showSearch
                                    // dropdownRender={() => { !gatewayFetched && <Spin style={{ position: 'relative', left: '30%', top: '30%' }} /> }}
                                    // onFocus={() => {
                                    //     if (!gatewayFetched) {
                                    //         fetchPatchesData("gateway");
                                    //         setGatewayFetched(true);
                                    //     }
                                    // }}
                                    onSearch={(value) => {
                                        fetchPatchesData("gateway", value);
                                    }}
                                    placeholder="Search to Select"
                                >
                                    {gatewayRes.map((item, index) => {
                                        return (
                                            <Option key={item.id} value={item.patch_serial}>
                                                {item.patch_serial}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                required={!props.required}
                                label="ECG Serial Number"
                                name="ECGserialNumber"
                                // rules={[{
                                //     required: props.required,
                                //     message: 'serial number is required'
                                // }]}
                                className="addPatientDetailsModal"
                            >
                                <Select
                                    showSearch
                                    placeholder="Search to Select"
                                    // onFocus={() => {
                                    //     if (!ecgFetched) {
                                    //         fetchPatchesData("ecg");
                                    //         setEcgFetched(true);
                                    //     }
                                    // }}
                                    onSearch={(value) => {
                                        fetchPatchesData("ecg", value);
                                    }}
                                    optionFilterProp="children"
                                    filterOption={true}
                                >
                                    {ecgRes.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.patch_serial}>
                                                {item.patch_serial}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                required={!props.required}
                                label="Temperature Serial Number"
                                name="TempserialNumber"
                                // rules={[{
                                //     required: props.required,
                                //     message: 'serial number is required'
                                // }]}
                                className="addPatientDetailsModal"
                            >
                                <Select
                                    showSearch
                                    placeholder="Search to Select"
                                    // onFocus={() => {
                                    //     if (!temperatureFetched) {
                                    //         fetchPatchesData("temperature");
                                    //         setTemperatureFetched(true);
                                    //     }
                                    // }}
                                    onSearch={(value) => {
                                        fetchPatchesData("temperature", value);
                                    }}
                                    optionFilterProp="children"
                                    filterOption={true}
                                >
                                    {temperatureRes.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.patch_serial}>
                                                {item.patch_serial}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                required={!props.required}
                                label="SpO2 Serial Number"
                                name="SpserialNumber"
                                className="addPatientDetailsModal"
                            >
                                <Select
                                    showSearch
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    // onFocus={() => {
                                    //     if (!spo2Fetched) {
                                    //         fetchPatchesData("spo2");
                                    //         setSpo2Fetched(true);
                                    //     }
                                    // }}
                                    onSearch={(value) => {
                                        fetchPatchesData("spo2", value);
                                    }}
                                    filterOption={true}
                                >
                                    {spo2Res.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.patch_serial}>
                                                {item.patch_serial}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <h2 style={{ fontSize: "40px", fontWeight: "bold" }}>
                                Add Bundle
                            </h2>
                            <Row span={24}>
                                <Col span={12}>
                                    <Image maxwidth={400} src={ecgImg} preview={false} />
                                </Col>
                                <Col span={12}>
                                    <Image maxwidth={400} src={spo2Img} preview={false} />
                                </Col>
                                <Col span={12}>
                                    <Image maxwidth={400} src={tempImg} preview={false} />
                                </Col>
                                <Col span={12}>
                                    <Image
                                        maxwidth={400}
                                        width={"5em"}
                                        src={watchImg}
                                        preview={false}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Add Bundle
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            }
            {
                // istLoading && <Spin size="large" style={{ position: 'relative', left: '50%', top: '30%' }} />
            }
        </>
    );
};

//
const PatchDisplay = (props) => {
    return (
        <Descriptions title="Bundle Info" layout="vertical" bordered>
            <Descriptions.Item
                label="Gateway Serial Number"
                labelStyle={{ backgroundColor: "#FBFBFB" }}
            >
                {props.patientClass.list[props.menuState].patchserial1}
            </Descriptions.Item>
            <Descriptions.Item label="ECG Serial Number">
                {props.patientClass.list[props.menuState].patchserial2}
            </Descriptions.Item>
            <Descriptions.Item label="Temperature Serial Number">
                {props.patientClass.list[props.menuState].patchserial3}
            </Descriptions.Item>
            <Descriptions.Item label="SpO2 Serial Number">
                {props.patientClass.list[props.menuState].patchserial4}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default function AddBundleModal(props) {
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
                class: "Bundle 1",
                error: false,
                added: false,
                delete: false,
                Component1: PatchForm,
                Component2: PatchDisplay,
                patchserial1: "",
                patchserial2: "",
                patchserial3: "",
                patchserial4: "",
            },
        ],
    });

    const addPatch = () => {
        if (patientClass.list.length < 5) {
            let newList = patientClass.list.concat({
                class: `Bundle ${patientClass.list.length + 1}`,
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
            const key = "only 5 patch warning";
            notification.warn({
                key,
                message: "Sorry",
                description: "Only 5 Bundles can be added at once.",
                placement: "bottomRight",
            });
        }
    };

    const info = () => {
        message.info("At least one Bundle should be added");
    };

    const deleteBundle = (index) => {
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
            <Row justify="center" align="middle" style={{ padding: "1.5em" }}>
                <Col span={24}>
                    <Row span={24}>
                        <Col className="addPatientDetailsMenu" xs={24} lg={8}>
                            <div className="menu-container">
                                <Menu
                                    onClick={handleMenuState}
                                    defaultSelectedKeys={[patientClass.list[0].class]}
                                    mode="inline"
                                >
                                    {patientClass.list.map((listItem, index) => (
                                        <Menu.Item key={index} className="add-patient-menu-item">
                                            <Row justify="space-around" align="bottom">
                                                <Col span={14}>
                                                    <span>{listItem.class}</span>
                                                </Col>
                                                <Col span={10}>
                                                    <Row>
                                                        <Col span={8}>
                                                            {listItem.error
                                                                ? Icons.exclamationCircleOutlined({})
                                                                : ""}
                                                        </Col>
                                                        <Col span={8}>
                                                            {listItem.added
                                                                ? Icons.checkCircleFilled({})
                                                                : ""}
                                                        </Col>
                                                        <Col span={8}>
                                                            {listItem.delete ? (
                                                                <div
                                                                    onClick={() => {
                                                                        deleteBundle(index);
                                                                    }}
                                                                >
                                                                    {Icons.CloseCircleOutlined({})}
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Menu.Item>
                                    ))}
                                </Menu>
                                <div onClick={addPatch} style={{ padding: "1em" }}>
                                    Add Another Bundle{" "}
                                    {Icons.addIcon({ style: { paddingLeft: "1em" } })}
                                </div>
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
