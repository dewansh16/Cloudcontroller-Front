import React, { useState, useEffect } from 'react'
import { Row, Col, Drawer, Form, notification, Table } from '../../../Theme/antdComponents'
import { Button } from '../../../Theme/Components/Button/button'
import { Input, GlobalTextArea as TextArea } from '../../../Theme/Components/Input/input'
import { Select, SelectOption as Option } from '../../../Theme/Components/Select/select'
import { DatePicker } from '../../../Theme/Components/DateTimePicker/dateTimePicker'
import Icons from '../../../Utils/iconMap'
import { modes } from './mode'
import patientApi from '../../../Apis/patientApis'
import { EmrView } from '../EMR'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { UserStore } from "../../../Stores/userStore";


function FetchMedicalHistory(pid, limit) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        patientApi.getPatientMedicalHistory(pid, limit).then((res) => {
            res.data.response['data'].map((medicalhistory, idx) => {
                dataSource.push({
                    key: idx,
                    ...medicalhistory
                })
            })
            setDataSource([...dataSource])
            setResponse(res.data.response)
            setLoading(false);
        }).catch((err) => {
            console.log(err)
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response?.data.result}` || ""
                })
                setLoading(false);
            }
        })
    }, [pid])
    return [response, loading, dataSource]
}

function AddMedicalHistory(pid, data, successCallBack) {
    // "date_of_treatment": "2022-06-21T09:01:15.000Z",
    // "doctor_name": "Doctor Name",
    // "documents": "Your Note",
    // "hospital_name": "Hospital Name",
    // "note": "Your Note",
    // "treatment": "Treatment",
    // "pid": "patiente9c617e0-4242-4828-ba08-66e8d4aa9009",
    // "tenant_id": "tenant8ea56b12-ff44-4b5c-839c-f609363ba385
    let userData = UserStore.getUser();
    let tenantId = userData.tenant;
    console.log(data)
    data.date_of_treatment = data.date_of_treatment.toISOString();
    data.pid = pid;
    data.tenant_id = tenantId;
    patientApi.createPatientMedicalHistory(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message
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

function UpdateMedicalHistory(pid, data, successCallBack) {
    patientApi.updatePatientMedicalHistory(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message
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

const AddMedicalHistoryForm = ({ data, mode = modes.ADD_NEW, medicalHistoryForm, successCallBack, pid }) => {
    const reqd = mode === modes.ADD_NEW
    const medical_history_uuid = medicalHistoryForm.getFieldValue("medical_history_uuid")
    const onFinish = (values) => {
        let formData = {
            // "medical_history_uuid": "medicalhistory-XXXX",
            // "date_of_treatment": "2021-09-06T00:00:00.000Z",
            // "treatment": "1",
            // "hospital_name": "MB Hospital",
            // "doctor_name": "Dr. Ansh",
            // "note": "This is a note"
        }
        formData = { ...values }
        if (mode === modes.ADD_NEW) {
            console.log(pid, formData)
            AddMedicalHistory(pid, formData, successCallBack = successCallBack)
        } else if (mode === modes.EDIT) {
            formData['medical_history_uuid'] = medical_history_uuid
            console.log(pid, formData)
            UpdateMedicalHistory(pid, formData, successCallBack = successCallBack)
        } else {
            notification.warning({
                message: 'Unknown form mode',
                description: `Unknown form mode is selected`
            })
        }
        console.log("the form mode is", mode)
    }

    const onFinishFailed = (values) => {
        // notification.info({
        //     message: "Error",
        //     description: "All fields required"
        // })
        console.log("failed!", values)
    }

    useEffect(() => {
        medicalHistoryForm.setFieldsValue({
            ...data
        })
    }, [])
    return (
        <Form
            form={medicalHistoryForm}
            layout="vertical"
            name="medicalHistoryForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[0, 0]} justify="space-around">
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Date of treatement"
                        name="date_of_treatment"
                        rules={[{
                            required: reqd,
                            message: "required"
                        }]}
                    >
                        <DatePicker />
                    </Form.Item>
                </Col>
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Treatment"
                        name="treatment"
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
                        label="Hospital Name"
                        name="hospital_name"
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
                        label="Doctor Name"
                        name="doctor_name"
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
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Other Documents"
                        name="documents"
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
    const [medicalHistory, isLoading, dataSource] = FetchMedicalHistory(pid, 20)
    const [medicalHistoryForm] = Form.useForm()
    const [visible, setVisible] = useState(false);
    const [formMode, setFormMode] = useState(modes.ADD_NEW)
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };


    const columns = [
        {
            title: "Timeline",
            dataIndex: "date",
            key: "date",
            render: date => <p>{new Date(date).getFullYear()}</p>
        },
        {
            title: "Treatment",
            dataIndex: "treatment",
            key: "treatment"
        },
        {
            title: "Hospital",
            dataIndex: "hospital_name",
            key: "hospital_name"
        },
        {
            title: "Doctor",
            dataIndex: "doctor_name",
            key: "doctor_name"
        },
        {
            title: "Documents",
            dataIndex: "documents",
            key: "documents"
        },
        {
            title: "",
            key: "data",
            render: data => Icons.edit({
                onClick: () => {
                    showDrawer();
                    setFormMode(modes.EDIT);
                    data['date_of_treatment'] = moment(data['date_of_treatment'])
                    medicalHistoryForm.setFieldsValue({ ...data })
                }
            })
        },

    ]
    const successCallBack = () => {
        console.log(`/dashboard/patient/EMR/${pid}`)
        window.location.reload(false)
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
                <Button onClick={() => { showDrawer(); setFormMode(modes.ADD_NEW); medicalHistoryForm.resetFields() }} type="secondary-outlined">+ Add</Button>
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
                    <Col span={12}><Button onClick={medicalHistoryForm.submit} type="secondary">{formMode}</Button></Col>
                </Row>
            }
                placement="right"
                onClose={onClose}
                visible={visible}
                width={720}
            >
                <AddMedicalHistoryForm pid={pid} medicalHistoryForm={medicalHistoryForm} mode={formMode} successCallBack={successCallBack} />
            </Drawer>

            <Row gutter={[0, 0]}>
                <Col span={24}>
                    <Table dataSource={dataSource} columns={columns} scroll={{ y: 360 }} pagination={{ position: ["bottomCenter"] }} />
                </Col>
            </Row>
        </div >
    )
}
