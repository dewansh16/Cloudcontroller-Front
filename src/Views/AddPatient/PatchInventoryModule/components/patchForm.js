import React, { useState, useEffect, useRef } from "react";
import {
    Col,
    Row,
    notification,
    Form,
    Select,
    DatePicker,
    Popconfirm,
    Input
} from "antd";
import { Button } from "../../../../Theme/Components/Button/button";
import Summary from "../../summary/summary";
import { getImageSrc } from "../getPatchesUtility";
import { UserStore } from "../../../../Stores/userStore";
import patientApi from "../../../../Apis/patientApis";
import deviceApi from "../../../../Apis/deviceApis";
import moment from "moment";

import "../patchInventory.css";
const { Option } = Select;
const { RangePicker } = DatePicker;

const PatchForm = (props) => {
    const { associatedList = [], listDeviceAssociated = [] } = props;

    const [patchList, setPatchList] = useState([]);
    const [deviceSelected, setDeviceSelected] = useState(null);
    const [valueBpType, setValueBpType] = useState(associatedList?.includes('ihealth') ? "ihealth" : "alphamed");
    const [isNewDevice, setIsNewDevice] = useState(false);
    const [valSearch, setValSearch] = useState("");
    const [isGateway, setIsGateway] = useState(false);

    const refValSearch = useRef();

    const [summary, setSummary] = React.useState({
        isVisible: false,
        status: "success",
        title: `${props.type} is Added`,
    });

    // useEffect(() => {
    //     const { tenant = '' } = UserStore.getUser();

    //     patientApi
    //         .getPatientPatches(props?.pid, tenant)
    //         .then((res) => {
    //             setListDevice(res.data?.response?.patch_patient_map || []);
    //         })
    //         .catch((err) => {});
    // }, [props?.pid]);

    useEffect(() => {
        if (props.type !== 'bps') {
            fetchPatchesData(props.type);
        }

        resetValueForm();
    }, [props.type]);

    const resetValueForm = () => {
        let type = props.type;
        if (props.type === 'bps') {
            type = valueBpType;
        }

        props.form.setFieldsValue({ [`${type}_device_serial`]: null });
        props.form.setFieldsValue({ [`${type}_duration`]: null });
        refValSearch.current = "";
        setDeviceSelected(null);
        setValSearch("");
        setIsNewDevice(false);
    }

    const disAllocatePatch = (patchData) => {
        let userData = UserStore.getUser();
        let tenantId = userData.tenant;
        if (
            patchData !== null &&
            patchData[`${props.type}_device_serial`] !== undefined &&
            patchData[`${props.type}_device_serial`] !== null
        ) {
            patchData.duration = null;
            patchData[`${props.type}_duration`] = null;
            patchData.tenant_id = tenantId;
            patchData.pid = "0";

            let payload = [];
            payload.push(patchData);

            patientApi
                .associatePatchToPatient(props.pid, payload)
                .then((res) => {
                    console.log(res.data.response);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const removePatch = () => {
        let userData = UserStore.getUser();
        let tenantId = userData.tenant;

        let type = props.type;
        if (props.type === 'bps') {
            type = valueBpType;
        }

        props.form.setFieldsValue({
            [`${type}_duration`]: null,
            [`${type}_device_serial`]: null,
        });
        props.resetDataSelect('patch');
        const patchData = props.patchData[type];
        if (
            patchData !== null &&
            patchData[`${type}_device_serial`] !== undefined &&
            patchData[`${type}_device_serial`] !== null
        ) {
            patchData.duration = null;
            patchData[`${type}_duration`] = null;
            patchData.tenant_id = tenantId;
            patchData.pid = "0";
            patchData.config = {};
            let payload = [];
            payload.push(patchData);
            patientApi
                .EditOneAssociatedPatchToPatient(props.pid, payload)
                .then((res) => {
                    let updateNull = props.patchData;
                    updateNull[type] = null;
                    props.savePatchDetails(payload);
                    props.form.setFieldsValue({
                        [`${type}_duration`]: null,
                        [`${type}_device_serial`]: null,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        };


        if (isNewDevice) {
            refValSearch.current = "";
            const newArr = [...patchList];
            newArr.splice(0, 1);
            setPatchList(newArr);
            setDeviceSelected(null);
            setValSearch("");
            setIsNewDevice(false);
        }
    };

    useEffect(() => {
        if (props.type === 'bps') {
            fetchPatchesData(valueBpType);
        }
    }, [valueBpType]);

    const handleChange = (values) => {
        // console.log('value', values);
        if (values[0].name[0] === 'bp-type') {
            return setValueBpType(values[0].value);
        }

        let type = props.type;
        if (props.type === 'bps') {
            type = valueBpType;
        }

        switch (values[0].name[0]) {
            //FIXME: use delimiter as ampersand
            case `${type}_device_serial`: {
                if (props.patchData[type]?.[`${type}_device_serial`] !== values[0].value) {
                    disAllocatePatch(props.patchData[type]);
                }

                props.form.setFieldsValue({ [`${type}_duration`]: null });
                let selectedPatch = patchList.filter(
                    (patch) => patch.device_serial === values[0].value
                );

                let payload = props.patchData;
                payload[type] = {
                    patch_uuid: selectedPatch[0].patch_uuid,
                    [`${type}_device_serial`]: selectedPatch[0].device_serial,
                    type_device: type
                };

                if (type !== 'gateway') {
                    const deviceFound = listDeviceAssociated?.find(device => device?.["patches.patch_type"] === "gateway");
                    payload[type].gateway = deviceFound?.["patches.device_serial"];
                }

                props.savePatchDetails(payload);
                break;
            }

            case `${type}_duration`: {
                if (values[0].value != null) {
                    let startDate = values[0].value[0]?.format("MMM DD YYYY");
                    let endDate = values[0].value[1]?.format("MMM DD YYYY");
                    let payload = props.patchData;

                    payload[type] = {
                        ...payload[type],
                        [`${type}_duration`]: values[0].value,
                        duration: `${startDate},${endDate}`,
                    };

                    props.savePatchDetails(payload);
                } else {
                    let payload = props.patchData;
                    payload[type] = {
                        ...payload[type],
                        [`${type}_duration`]: null,
                        duration: null,
                    };

                    props.savePatchDetails(payload);
                }
                break;
            }

            case `${type}_mac_address`: {
                let payload = props.patchData;

                if (values[0].value != null) {
                    payload[type] = {
                        ...payload[type],
                        mac_address: values[0].value,
                        isNewDevice: true
                    };

                    props.savePatchDetails(payload);
                } else {
                    payload[type] = {
                        ...payload[type],
                        mac_address: null,
                        isNewDevice: true
                    };

                    props.savePatchDetails(payload);
                }
                break;
            }
            default:
                break;
        }
    };

    function confirm(e) {
        removePatch();
    }

    const fetchPatchesData = (deviceType, patchSerial) => {
        const user = UserStore.getUser();
        deviceApi
            .getPatchesData(deviceType, -1, patchSerial, user.tenant)
            .then((res) => {
                setPatchList(res.data?.response?.patches);
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

    const raiseError = () => { };

    const renderTitleSensor = (type) => ({
        "temperature": "Temperature Sensor",
        "gateway": "Gateway (EV-04)",
        "spo2": "SpO2 (CheckMe)",
        "ecg": "ECG Sensor",
        "bps": "BP Sensor",
        "digital": "Digital Scale",
        "alphamed": "Alphamed",
        "ihealth": "iHealth",
    }[type]);

    const handleAddNewSeriaNumber = () => {
        if (!refValSearch.current) return;

        let type = props.type;
        if (props.type === 'bps') {
            type = valueBpType;
        }

        const data = {
            device_serial: refValSearch.current,
            patch_type: type
        }
        const newList = [data, ...patchList];

        setPatchList([...newList]);

        let payload = props.patchData;
        payload[type] = {
            [`${type}_device_serial`]: data.device_serial,
            type_device: type,
            isNewDevice: true
        };

        props.savePatchDetails(payload);
        props.form.setFieldsValue({
            [`${type}_device_serial`]: data.device_serial,
        });
        setIsNewDevice(true);
        setDeviceSelected(data.device_serial);
    };

    useEffect(() => {
        if (!!valSearch) {
            refValSearch.current = valSearch;
        }
    }, [valSearch]);

    useEffect(() => {
        let type = props.type;
        if (props.type === 'bps') { type = valueBpType; }

        const deviceFound = listDeviceAssociated?.find(device => device?.["patches.patch_type"] === type);
        if (!!deviceFound) {
            const arrDuration = deviceFound.duration.split(',');
            const firstDay = moment(arrDuration[0], 'MMM DD YYYY');
            const lastDate = moment(arrDuration[1], 'MMM DD YYYY');

            props.form.setFieldsValue({
                [`${type}_device_serial`]: deviceFound?.["patches.device_serial"],
                [`${type}_duration`]: [firstDay, lastDate]
            });
        }

        if (type !== "gateway") {
            const gatewayFound = listDeviceAssociated?.find(device => device?.["patches.patch_type"] === "gateway");
            props.form.setFieldsValue({
                [`gateway_serial`]: gatewayFound?.["patches.device_serial"],
            });
            if (!!gatewayFound) {
                setIsGateway(true);
            }
        }
    }, [listDeviceAssociated, valueBpType]);

    return summary.isVisible ? (
        <Summary status={summary.status} title={summary.title}>
            <p>P.S: Don't forget to save changes after adding all the patches.</p>
            <Button
                type="secondary"
                onClick={() => {
                    setSummary({ isVisible: false });
                }}
            >
                Re-configure patch?
            </Button>
        </Summary>
    ) : (
        <Row span={10} gutter={[10, 10]}>
            <Col span={12}>
                <Form
                    {...props.layout}
                    form={props.form}
                    layout="vertical"
                    name="basic"
                    initialValues={{ ...props.patchData, remember: true }}
                    onFinishFailed={raiseError}
                    onFieldsChange={handleChange}
                >
                    <Row>
                        {(props.type !== "gateway" && isGateway) && (
                            <Col span={18}>
                                <Form.Item
                                    required={!props.required}
                                    label="Gateway Serial"
                                    name="gateway_serial"
                                    rules={[
                                        {
                                            required: !props.required,
                                        },
                                    ]}
                                >
                                    <Input disabled={true} className="custom-input-disabled" />
                                </Form.Item>
                            </Col>
                        )}

                        {props.type === "bps" && (
                            <Col span={18}>
                                <Form.Item
                                    required={props.required}
                                    label="BP type"
                                    name="bp-type"
                                    rules={[
                                        {
                                            required: props.required,
                                            message: "serial number is required",
                                        },
                                    ]}
                                    className="addPatientDetailsModal"
                                    initialValue={valueBpType}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Search to Select"
                                        optionFilterProp="children"
                                        disabled={props.disabled || isNewDevice}
                                        className={isNewDevice ? "select-sensor-associate" : ""}
                                        onChange={() => {
                                            refValSearch.current = "";
                                            setDeviceSelected(null);
                                            setValSearch("");
                                            setIsNewDevice(false);
                                        }}
                                    >
                                        <Option value="alphamed">
                                            Alphamed
                                        </Option>
                                        <Option value="ihealth">
                                            iHealth
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={18} style={{ position: "relative" }}>
                            <Form.Item
                                required={props.required}
                                label="Serial Number"
                                name={`${props.type === 'bps' ? valueBpType : props.type}_device_serial`}
                                rules={[
                                    {
                                        required: props.required,
                                        message: "serial number is required",
                                    },
                                ]}
                                className="addPatientDetailsModal"
                            >
                                <Select
                                    disabled={props.disabled || isNewDevice}
                                    showSearch
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={true}
                                    className={isNewDevice ? "select-sensor-associate" : ""}
                                    onChange={(val) => setDeviceSelected(val)}
                                    onSearch={(val) => setValSearch(val)}
                                >
                                    {patchList?.map((item) => {
                                        return (
                                            <Option key={item.device_serial} value={item.device_serial}>
                                                {item.device_serial}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            {(deviceSelected === null && !props.disabled) && (
                                <div
                                    style={{
                                        position: "absolute", top: "50%", right: "8px", transform: "translateY(-50%)", color: "#ff7529", cursor: "pointer",
                                        fontSize: "12px", padding: "1px 4px", borderRadius: "4px", border: "1px solid #ff7529", background: "#fff", marginTop: "3px"
                                    }}
                                    onClick={() => {
                                        handleAddNewSeriaNumber();
                                    }}
                                >
                                    Add
                                </div>
                            )}
                        </Col>
                        {isNewDevice && (
                            <Col span={18}>
                                <Form.Item
                                    required={props.required}
                                    label="MAC address"
                                    name={`${props.type === 'bps' ? valueBpType : props.type}_mac_address`}
                                    rules={[
                                        {
                                            required: props.required,
                                            message: "mac address is required",
                                        },
                                    ]}
                                    className="addPatientDetailsModal"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        )}

                        {!props.disabled && (
                            <Col
                                span={6}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Popconfirm
                                    title="Are you sure to remove this patch?"
                                    onConfirm={confirm}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="utility"
                                        style={{
                                            height: "32px",
                                            padding: "4px",
                                            width: "36px",
                                        }}
                                        disabled={props.patchData[props.type] !== null ? false : true}
                                    >
                                        X
                                    </Button>
                                </Popconfirm>
                            </Col>
                        )}
                    </Row>

                    <Form.Item
                        required={props.required}
                        label="Duration"
                        name={`${props.type === 'bps' ? valueBpType : props.type}_duration`}
                        rules={[
                            {
                                required: props.required,
                                message: "Duration is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <RangePicker
                            className="range-picker-device"
                            disabled={props.disabled}
                            disabledDate={(current) => {
                                return current < moment().subtract({ days: 1 });
                            }}
                            format="MMM DD YYYY"
                        />
                    </Form.Item>
                    {/* <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item> */}
                </Form>
            </Col>
            <Col
                span={12}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: "2.4em",
                        fontWeight: "bold",
                        opacity: "1",
                        textTransform: "capitalize",
                    }}
                >

                    {props.type === 'bps' ? valueBpType + " Sensor" : renderTitleSensor(props.type)}
                </h2>
                {getImageSrc(props.type !== 'bps' ? props.type : valueBpType, 200)}
            </Col>
        </Row>
    );
};

export default PatchForm;
