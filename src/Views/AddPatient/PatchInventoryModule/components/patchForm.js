import React, { useState, useEffect } from "react";
import {
    Col,
    Row,
    notification,
    Form,
    Select,
    DatePicker,
    Popconfirm,
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
    console.log('props', props);
    const [patchList, setPatchList] = useState([]);
    const [patchFetched, setPatchFetched] = useState(false);
    const { isSelectDisabled, setSelectDisabled } = useState(false);

    const [summary, setSummary] = React.useState({
        isVisible: false,
        status: "success",
        title: `${props.type} is Added`,
    });

    useEffect(() => {
        fetchPatchesData(props.type);
    }, [props.type]);

    const disAllocatePatch = (patchData) => {
        let userData = UserStore.getUser();
        let tenantId = userData.tenant;
        if (
            patchData !== null &&
            patchData[`${props.type}_patch_serial`] !== undefined &&
            patchData[`${props.type}_patch_serial`] !== null
        ) {
            patchData.duration = null;
            patchData[`${props.type}_duration`] = null;
            patchData.tenant_id = tenantId;
            patchData.pid = "0";
            let payload = [];
            payload.push(patchData);
            console.log("send in api to dusalocate", payload, props.pid);
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
        console.log('removePatch -----------------------');
        let userData = UserStore.getUser();
        let tenantId = userData.tenant;
        props.form.setFieldsValue({
            [`${props.type}_duration`]: null,
            [`${props.type}_patch_serial`]: null,
        });
        props.resetDataSelect('patch');
        const patchData = props.patchData[props.type];
        if (
            patchData !== null &&
            patchData[`${props.type}_patch_serial`] !== undefined &&
            patchData[`${props.type}_patch_serial`] !== null
        ) {
            patchData.duration = null;
            patchData[`${props.type}_duration`] = null;
            patchData.tenant_id = tenantId;
            patchData.pid = "0";
            patchData.config = {};
            let payload = [];
            payload.push(patchData);
            patientApi
                .EditOneAssociatedPatchToPatient(props.pid, payload)
                .then((res) => {
                    let updateNull = props.patchData;
                    updateNull[props.type] = null;
                    props.savePatchDetails(payload);
                    props.form.setFieldsValue({
                        [`${props.type}_duration`]: null,
                        [`${props.type}_patch_serial`]: null,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleChange = (values) => {
        console.log('handleChange', values);
        switch (values[0].name[0]) {
            //FIXME: use delimiter as ampersand
            case `${props.type}_patch_serial`: {
                console.log(
                    " pid from patchForm xxxxxxxx",
                    props.pid,
                    props.patchData[props.type]
                );
                if (
                    props.patchData[props.type]?.[`${props.type}_patch_serial`] !==
                    values[0].value
                ) {
                    disAllocatePatch(props.patchData[props.type]);
                }
                props.form.setFieldsValue({ [`${props.type}_duration`]: null });
                let selectedPatch = patchList.filter(
                    (patch) => patch.patch_serial === values[0].value
                );
                let payload = props.patchData;
                payload[props.type] = {
                    patch_uuid: selectedPatch[0].patch_uuid,
                    [`${props.type}_patch_serial`]: selectedPatch[0].patch_serial,
                };
                props.savePatchDetails(payload);
                break;
            }
            case `${props.type}_duration`: {
                // console.log(values[0].value)
                if (values[0].value != null) {
                    let startDate = values[0].value[0]?.format("YYYY-MM-DD");
                    let endDate = values[0].value[1]?.format("YYYY-MM-DD");
                    let payload = props.patchData;
                    payload[props.type] = {
                        ...payload[props.type],
                        [`${props.type}_duration`]: values[0].value,
                        duration: `${startDate},${endDate}`,
                    };
                    console.log(payload);
                    props.savePatchDetails(payload);
                } else {
                    let payload = props.patchData;
                    payload[props.type] = {
                        ...payload[props.type],
                        [`${props.type}_duration`]: null,
                        duration: null,
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
        console.log(e);
        removePatch();
    }

    const fetchPatchesData = (deviceType, patchSerial) => {
        const user = UserStore.getUser();
        deviceApi
            .getPatchesData(deviceType, -1, patchSerial, user.tenant)
            .then((res) => {
                console.log(res.data?.response?.patches);
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
                        <Col span={18}>
                            <Form.Item
                                required={props.required}
                                label="Serial Number"
                                name={`${props.type}_patch_serial`}
                                rules={[
                                    {
                                        required: props.required,
                                        message: "serial number is required",
                                    },
                                ]}
                                className="addPatientDetailsModal"
                            >
                                <Select
                                    disabled={isSelectDisabled}
                                    showSearch
                                    placeholder="Search to Select 1"
                                    optionFilterProp="children"
                                    // onFocus={() => {
                                    //     if (!patchFetched) {
                                    //         fetchPatchesData(props.type);
                                    //         setPatchFetched(true);
                                    //     }
                                    // }}
                                    onSearch={(value) => {
                                        fetchPatchesData(props.type, value);
                                    }}
                                    filterOption={true}
                                >
                                    {patchList?.map((item) => {
                                        return (
                                            <Option key={item.id} value={item.patch_serial}>
                                                {item.patch_serial}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
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
                    </Row>

                    <Form.Item
                        required={!props.required}
                        label="Duration"
                        name={`${props.type}_duration`}
                        rules={[
                            {
                                required: !props.required,
                                message: "serial number is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <RangePicker
                            disabled={isSelectDisabled}
                            disabledDate={(current) => {
                                return current < moment().subtract({ days: 1 });
                            }}
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
                    {props.type === "gateway" ? props.type : props.type + "Sensor"}
                </h2>
                {getImageSrc(props.type, 200)}
            </Col>
        </Row>
    );
};

export default PatchForm;
