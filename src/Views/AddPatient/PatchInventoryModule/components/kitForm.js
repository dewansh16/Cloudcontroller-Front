import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Form,
    Select,
    DatePicker,
    Modal,
    List,
    Popconfirm,
    notification,
} from "antd";
import { Button } from "../../../../Theme/Components/Button/button";
import Colors from "../../../../Theme/Colors/colors";
import { getImageSrc } from "../getPatchesUtility";
import { UserStore } from "../../../../Stores/userStore";
import patientApi from "../../../../Apis/patientApis";
import deviceApi from "../../../../Apis/deviceApis";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const PatchListItem = ({ index, serial, type }) => {
    return (
        <div
            style={{
                color: "black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid black",
                borderRadius: "8px",
                width: "fit-content",
                padding: "1em",
            }}
        >
            {getImageSrc(type, 100)}
            <span>{serial}</span>
            <span>{type}</span>
        </div>
    );
};

const KitForm = (props) => {
    console.log('props', props);
    const [patchList, setPatchList] = useState([]);
    const [patchFetched, setPatchFetched] = useState(false);
    // set associated patches when bundle category is selected
    const [associatedPatches, setAssociatedPatches] = React.useState([]);

    // set modal visibility to show associated patches modal
    const [modalVisibility, setModalVisibility] = React.useState(false);

    const showModal = () => {
        setModalVisibility(true);
    };
    const handleCancel = () => {
        setModalVisibility(false);
    };

    const disAllocatePatch = (patchData) => {
        let userData = UserStore.getUser();
        let tenantId = userData.tenant;
        let payload = [];
        if (
            patchData.ecg !== null ||
            patchData.spo2 !== null ||
            patchData.temperature !== null ||
            patchData.gateway !== null
        ) {
            if (patchData.ecg !== null) {
                patchData.ecg.tenant_id = tenantId;
                patchData.ecg.pid = "0";
                payload.push(patchData.ecg);
            }
            if (patchData.spo2 !== null) {
                patchData.spo2.tenant_id = tenantId;
                patchData.spo2.pid = "0";
                payload.push(patchData.spo2);
            }
            if (patchData.temperature !== null) {
                patchData.temperature.tenant_id = tenantId;
                patchData.temperature.pid = "0";
                payload.push(patchData.temperature);
            }
            if (patchData.gateway !== null) {
                patchData.gateway.tenant_id = tenantId;
                patchData.gateway.pid = "0";
                payload.push(patchData.gateway);
            }
            console.log("kapa kapa bundleData kapa kapa", patchData, payload);
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

    const removeBundle = () => {
        disAllocatePatch(props.bundleData);
        let payload = {
            ecg: null,
            spo2: null,
            temperature: null,
            gateway: null,
        };
        props.saveBundleDetails(payload);
        props.form.setFieldsValue({
            gateway_duration: null,
            gateway_patch_serial: null,
        });
    };

    const handleChange = (values) => {
        console.log(values);
        switch (values[0].name[0]) {
            //FIXME: use delimiter as ampersand
            case `gateway_patch_serial`: {
                console.log("from kitForm xxxxxxxx", props.pid);
                props.form.setFieldsValue({ gateway_duration: null });
                let selectedPatch = patchList.filter(
                    (patch) => patch.patch_serial === values[0].value
                );
                setAssociatedPatches(selectedPatch[0].AssociatedPatch);
                let payload = {
                    ecg: null,
                    spo2: null,
                    temperature: null,
                    gateway: null,
                };
                payload[selectedPatch[0].patch_type] = {
                    patch_uuid: selectedPatch[0].patch_uuid,
                };
                selectedPatch[0].AssociatedPatch.map((associatedPatch) => {
                    console.log(associatedPatch.patch_type);
                    payload[associatedPatch.patch_type] = {
                        patch_uuid: associatedPatch.patch_uuid,
                    };
                });
                console.log(`gateway_patch_serial`, payload);
                props.saveBundleDetails(payload);
                break;
            }
            case `gateway_duration`: {
                // console.log(values[0].value)
                if (values[0].value != null) {
                    let startDate = values[0].value[0]?.format("YYYY-MM-DD");
                    let endDate = values[0].value[1]?.format("YYYY-MM-DD");
                    console.log("before duration update", props.bundleData);
                    let payload = props.bundleData;
                    payload.gateway = {
                        ...payload.gateway,
                        duration: `${startDate},${endDate}`,
                    };
                    associatedPatches.map((associatedPatch) => {
                        payload[associatedPatch.patch_type] = {
                            ...payload[associatedPatch.patch_type],
                            duration: `${startDate},${endDate}`,
                        };
                    });
                    console.log(`gateway_duration`, payload);
                    props.saveBundleDetails(payload);
                } else {
                    let payload = props.bundleData;
                    payload.gateway = {
                        ...payload.gateway,
                        duration: null,
                    };
                    associatedPatches.map((associatedPatch) => {
                        payload[associatedPatch.patch_type] = {
                            ...payload[associatedPatch.patch_type],
                            duration: null,
                        };
                    });
                    console.log(`gateway_duration`, payload);
                    props.saveBundleDetails(payload);
                }
                break;
            }
            default:
                break;
        }
    };

    function confirm(e) {
        removeBundle();
        props.resetDataSelect('bundle');
    }

    useEffect(() => {
        fetchPatchesData(props.type);
    }, []);

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

    return (
        <Row span={10} gutter={[10, 10]}>
            <Col span={12}>
                <Form
                    {...props.layout}
                    form={props.form}
                    layout="vertical"
                    name="basic"
                    initialValues={{ ...props.bundleData, remember: true }}
                    onFinishFailed={raiseError}
                    onFieldsChange={handleChange}
                >
                    <Row>
                        <Col span={18}>
                            <Form.Item
                                required={props.required}
                                label="Serial Number"
                                name={`gateway_patch_serial`}
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
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={true}
                                    onChange={() => {
                                        disAllocatePatch(props.bundleData);
                                    }}
                                    // onFocus={() => {
                                    //     if (!patchFetched) {
                                    //         fetchPatchesData(props.type);
                                    //         setPatchFetched(true);
                                    //     }
                                    // }}
                                    onSearch={(value) => {
                                        fetchPatchesData(props.type, value);
                                    }}
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
                                title="Are you sure to remove this Bundle?"
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
                                    disabled={
                                        props.bundleData.ecg !== null ||
                                            props.bundleData.spo2 !== null ||
                                            props.bundleData.temperature !== null ||
                                            props.bundleData.gateway !== null
                                            ? false
                                            : true
                                    }
                                >
                                    X
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                    {associatedPatches.length !== 0 && (
                        <div
                            style={{
                                color: Colors.primaryColor,
                                marginBottom: "2em",
                                cursor: "pointer",
                            }}
                            onClick={showModal}
                        >
                            show patches associated?
                        </div>
                    )}
                    <Form.Item
                        required={!props.required}
                        label="Duration"
                        name={`gateway_duration`}
                        rules={[
                            {
                                required: !props.required,
                                message: "serial number is required",
                            },
                        ]}
                        className="addPatientDetailsModal"
                    >
                        <RangePicker
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
                        fontSize: "2.2em",
                        fontWeight: "bold",
                        opacity: "1",
                        textTransform: "capitalize",
                        position: "relative",
                        top: "-12px",
                    }}
                >
                    {props.type}
                </h2>
                <Row gutter={[8, 8]} style={{ marginTop: "-2em" }}>
                    {getImageSrc(props.type, 45)}
                </Row>
            </Col>
            <Modal
                footer={null}
                title="Associated Patches"
                visible={modalVisibility}
                onCancel={handleCancel}
            >
                <List
                    gutter={[8, 8]}
                    dataSource={associatedPatches}
                    renderItem={(patch, i) => (
                        <PatchListItem
                            key={i}
                            index={i + 1}
                            serial={patch.patch_serial}
                            type={patch.patch_type}
                        />
                    )}
                />
            </Modal>
        </Row>
    );

    // {associatedPatches.length !== 0 && <div style={{ color: Colors.primaryColor, marginBottom: "2em", cursor: "pointer" }} onClick={showModal}>show patches associated?</div>}

    //     <Modal footer={null} title="Associated Patches" visible={modalVisibility} onCancel={handleCancel}>
    //     <List
    //         dataSource={associatedPatches}
    //         renderItem={(patch, i) =>
    //             <PatchListItem key={i} index={i + 1} serial={patch.patch_serial} type={patch.patch_type} />
    //         }
    //     />
    // </Modal>

    // <div>
    //             <Button
    //                 disabled={props.bundleData.ecg !== null || props.bundleData.spo2 !== null || props.bundleData.temperature !== null || props.bundleData.gateway !== null ? false : true}
    //                 onClick={() => {
    //                     removeBundle();
    //                 }}
    //             >
    //                 Remove Bundle
    //             </Button>
    //         </div>
};

export default KitForm;
