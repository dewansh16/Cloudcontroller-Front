import React, { useState, useEffect } from 'react'
import { Row, Col, Drawer, Form, notification, Table } from '../../../Theme/antdComponents'
import { Button } from '../../../Theme/Components/Button/button'
import { Input, GlobalTextArea as TextArea } from '../../../Theme/Components/Input/input'
// import { Select, SelectOption as Option } from '../../../Theme/Components/Select/select'
import { DatePicker } from '../../../Theme/Components/DateTimePicker/dateTimePicker'
import Icons from '../../../Utils/iconMap'
import { modes } from './mode'
import patientApi from '../../../Apis/patientApis'
import { EmrView } from '../EMR'
import { useHistory, useLocation } from 'react-router-dom'
import moment from 'moment'
import { UserStore } from "../../../Stores/userStore";
import Select from 'antd/lib/select'
const { Option } = Select;

let status = 'active';
let allergyEdit = null;
// function FetchAllergy(pid, limit) {
//     const [response, setResponse] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [dataSource, setDataSource] = useState([])
    

//     useEffect(() => {
//         patientApi.getPatientAllergy(pid, limit).then((res) => {
//             console.log(res.data.response)
//             res.data.response['data'].map((allergy, idx) => {
//                 dataSource.push({
//                     key: idx,
//                     ...allergy
//                 })
//             })
//             setDataSource([...dataSource])
//             setResponse(res.data.response)
//             setLoading(false);
//         }).catch((err) => {
//             console.log(err)
//             if (err) {
//                 notification.error({
//                     message: 'Error',
//                     description: `${err.response?.data.result}` || ""
//                 })
//                 setLoading(false);
//             }
//         })
//     }, [pid])
//     return [response, loading, dataSource]
// }

function AddMedicalHistory(pid, data, successCallBack) {
    // "pid": "patiente9c617e0-4242-4828-ba08-66e8d4aa9009",
    // "tenant_id": "tenant8ea56b12-ff44-4b5c-839c-f609363ba385",
    // "allergy_name": "Allergy Name",
    // "allergy_type": "Allergy Type",
    // "date_from": "2022-06-15T07:49:06.582Z",
    // "date_to": "2022-06-14T07:49:05.299Z",
    // "note": "Your Note",
    // "reaction": "Reaction",
    // "status": "active"
    let userData = UserStore.getUser();
    let tenantId = userData.tenant;
    data.pid = pid;
    data.tenant_id = tenantId;
    data.date_from = data.date_from?.toISOString();
    data.date_to = data.date_to?.toISOString();
    data.status = status;
    patientApi.createPatientAllergy(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message || "allergy added"
        })
        successCallBack()
    }).catch((err) => {
        console.log(err)
        if (err) {
            notification.error({
                message: 'Error',
                description: `${err.response?.data.result}` || ""
            })
        }
    })
}

function UpdateAllergy(pid, data, successCallBack) {
    console.log(data);
    data.allergy_uuid = allergyEdit;
    data.date_from = data.date_from.toISOString();
    data.date_to = data.date_to.toISOString();
    patientApi.updatePatientAllergy(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message
        })
        allergyEdit = null;
        successCallBack()
    }).catch((err) => {
        console.log(err)
        allergyEdit = null;
        if (err) {
            notification.error({
                message: 'Error',
                description: `${err.response?.data.result}` || ""
            })
        }
    })
}

const AddAllergyForm = ({ data, mode = modes.ADD_NEW, allergyForm, successCallBack, pid, visible }) => {
    const reqd = mode === modes.ADD_NEW;
    const allergy_uuid = allergyForm.getFieldValue("allergy_uuid");

    const onFinish = (values) => {
        let formData = { ...values };
        if (mode === modes.ADD_NEW) {
            AddMedicalHistory(pid, formData, successCallBack = successCallBack)
        } else if (mode === modes.EDIT) {
            formData['allergy_uuid'] = allergy_uuid
            UpdateAllergy(pid, formData, successCallBack = successCallBack)
        } else {
            notification.warning({
                message: 'Unknown form mode',
                description: `Unknown form mode is selected`
            })
        }
    }

    const onFinishFailed = (value) => {
        // notification.info({
        //     message: "Error",
        //     description: "All fields required"
        // })
        console.log("failed!! the form mode is", mode)
    }

    useEffect(() => {
        if (mode === modes.ADD_NEW && visible) {
            allergyForm.setFieldsValue({
                ...data,
                date_from: moment(),
                date_to: moment(),
                status: "active"
            })
        }
    }, [visible, mode]);

    return (
        <Form
            form={allergyForm}
            layout="vertical"
            name="allergyForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[0, 0]} justify="space-around">
                <Col style={{}} span={8}>
                    <Form.Item
                        required={false}
                        label="From"
                        name="date_from"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <DatePicker format="MMM DD YYYY" allowClear={false} />
                    </Form.Item>
                </Col>
                <Col style={{}} span={8}>
                    <Form.Item
                        required={false}
                        label="To"
                        name="date_to"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <DatePicker format="MMM DD YYYY" allowClear={false} />
                    </Form.Item>
                </Col>
                 <Col style={{}} span={8}>
                    <Form.Item
                        required={false}
                        label="Status"
                        name="status"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <Select
                            // onChange={(e) => { setNameType(e) }}
                            // defaultValue={"active"}
                            bordered={false}
                            onChange={(value) => {
                                status = value;
                              }} 
                            suffixIcon={Icons.downArrowFilled({ style: { color: "#121215" } })}>
                            <Option value="active"><span style={{ color: "#08D000" }}>Active</span></Option>
                            <Option value="inactive"><span style={{ color: "#EB1348" }}>Inactive</span></Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col style={{}} span={24}>
                    <Form.Item
                        required={reqd}
                        label="Allergy Type"
                        name="allergy_type"
                        rules={[{
                            required: reqd,
                            message: "required"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{}} span={24}>
                    <Form.Item
                        required={reqd}
                        label="Allergy Name"
                        name="allergy_name"
                        rules={[{
                            required: reqd,
                            message: "required"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{}} span={24}>
                    <Form.Item
                        required={reqd}
                        label="Reaction"
                        name="reaction"
                        rules={[{
                            required: reqd,
                            message: "required"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Your Note"
                        name="note"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default function MedicalHistory({ pid, setComponentSupportContent, setPadding, setEmrView }) {
    let history = useHistory();
    let location = useLocation();

    const [allergyForm] = Form.useForm()
    const [visible, setVisible] = useState(false);
    const [formMode, setFormMode] = useState(modes.ADD_NEW);
    const [allergy, setAllergy] = useState({
        isLoading: false,
        dataSource: []
    })

    function FetchAllergy() {
        patientApi.getPatientAllergy(pid, 20).then((res) => {
            const dataSource = [];
            res.data.response['data'].map((allergy, idx) => {
                dataSource.push({
                    key: idx,
                    ...allergy
                })
            })
            setAllergy({
                isLoading: false,
                dataSource: dataSource
            })
        }).catch((err) => {
            console.log(err)
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response?.data.result}` || ""
                })
                setAllergy({
                    isLoading: false,
                    dataSource: []
                })
            }
        })
    };

    useEffect(() => {
        if (pid) {
            FetchAllergy();
        };
    }, [pid]);

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const columns = [
        {
            title: "Allergy Type",
            dataIndex: "allergy_type",
            key: "allergy_type"
        },
        {
            title: "Allergy Name",
            dataIndex: "allergy_name",
            key: "allergy_name"
        },
        {
            title: "Reaction",
            dataIndex: "reaction",
            key: "reaction"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (dataIndex) => (
                <span style={{ textTransform: "capitalize" }}>{dataIndex}</span>
            )
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
        },
        {
            title: "",
            key: "data",
            render: data => Icons.edit({
                onClick: () => {
                    showDrawer();
                    setFormMode(modes.EDIT);
                    allergyEdit = data.allergy_uuid;
                    data['date_from'] = moment(data['date_from'])
                    data['date_to'] = moment(data['date_to'])
                    allergyForm.setFieldsValue({ ...data });
                }
            })
        },

    ]
    const successCallBack = () => {
        FetchAllergy();
        onClose();
    }
    const backToPatientDetails = () => {
        // the below code to always redirect to     
        history.push(`/dashboard/patient/details/${pid}`)
        // history.goBack()
    }

    useEffect(() => {
        setComponentSupportContent(
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
            }}>
                <Button onClick={() => { showDrawer(); setFormMode(modes.ADD_NEW); allergyForm.resetFields() }} type="secondary-outlined">+ Add</Button>
                <Button style={{ width: "55px", marginLeft: "10%" }} onClick={backToPatientDetails} type="utility" icon={Icons.CloseOutlined({ Style: { color: "#000000" } })} />
            </div>
        )

        return () => {
            setComponentSupportContent(null)
            setPadding("0")
        }
    }, [])

    return (
        <div>
            <Drawer title={
                <Row>
                    <Col span={12}><Button type="secondary">Preview</Button></Col>
                    <Col span={12}><Button onClick={allergyForm.submit} type="secondary">{formMode}</Button></Col>
                </Row>
            }
                placement="right"
                onClose={onClose}
                visible={visible}
                width={720}
            >
                <AddAllergyForm visible={visible} pid={pid} allergyForm={allergyForm} mode={formMode} successCallBack={successCallBack} />
            </Drawer>

            <Row gutter={[0, 0]}>
                <Col span={24}>
                    <Table dataSource={allergy?.dataSource} columns={columns} scroll={{ y: 360 }} pagination={{ position: ["bottomCenter"] }} />
                </Col>
            </Row>
        </div >
    )
}
