import React, { useState, useEffect } from 'react'
import { Row, Col, Drawer, Form, notification, Table, Spin } from '../../../Theme/antdComponents'
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

function AddMedicalHistory(pid, data, successCallBack, setFormLoading) {
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

    data.date_of_treatment = data.date_of_treatment;
    data.pid = pid;
    data.tenant_id = tenantId;

    patientApi.createPatientMedicalHistory(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message
        })
        successCallBack();
        setFormLoading(false);
    }).catch((err) => {
        console.log(err)
        if (err) {
            notification.error({
                message: 'Error',
                description: `${err.response?.data.result}` || ""
            });
            setFormLoading(false);
        }
    })
}

function UpdateMedicalHistory(pid, data, successCallBack, setFormLoading) {
    patientApi.updatePatientMedicalHistory(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message
        })
        successCallBack();
        setFormLoading(false);
    }).catch((err) => {
        console.log(err)
        if (err) {
            notification.error({
                message: 'Error',
                description: `${err.response?.data.result}` || ""
            });
            setFormLoading(false);
        }
    })
}

const AddMedicalHistoryForm = ({ data, mode = modes.ADD_NEW, medicalHistoryForm, successCallBack, pid, visible }) => {
    const reqd = mode === modes.ADD_NEW
    const medical_history_uuid = medicalHistoryForm.getFieldValue("medical_history_uuid");

    const [formLoading, setFormLoading] = useState(false);

    const onFinish = (values) => {
        setFormLoading(true);

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
            AddMedicalHistory(pid, formData, successCallBack = successCallBack, setFormLoading)
        } else if (mode === modes.EDIT) {
            formData['medical_history_uuid'] = medical_history_uuid
            UpdateMedicalHistory(pid, formData, successCallBack = successCallBack, setFormLoading)
        } else {
            notification.warning({
                message: 'Unknown form mode',
                description: `Unknown form mode is selected`
            })
            setFormLoading(false);
        }
    }

    const onFinishFailed = (values) => {
        // notification.info({
        //     message: "Error",
        //     description: "All fields required"
        // })
        console.log("failed!", values)
    }

    useEffect(() => {
        if (mode === modes.ADD_NEW && visible) {
            medicalHistoryForm.setFieldsValue({
                ...data,
                date_of_treatment: moment(),
            })
        }
    }, [mode, visible])
    return (
        <>
            {formLoading && (
                <div style={{ 
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(1.5)",
                    zIndex: 20
                }}>
                    <Spin />
                </div>
            )}
            <Form
                form={medicalHistoryForm}
                layout="vertical"
                name="medicalHistoryForm"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={formLoading ? { filter: "blur(2px)" } : { }}
            >
                <Row gutter={[0, 0]} justify="space-around">
                    <Col style={{}} span={24}>
                        <Form.Item
                            required={reqd}
                            label="Date of treatement"
                            name="date_of_treatment"
                            rules={[{
                                required: reqd,
                                message: "required"
                            }]}
                        >
                            <DatePicker format="MMM DD YYYY" allowClear={false} />
                        </Form.Item>
                    </Col>
                    <Col style={{}} span={24}>
                        <Form.Item
                            required={reqd}
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
                            required={reqd}
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
                            required={reqd}
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
        </>
    )
}

export default function MedicalHistory({ pid, setComponentSupportContent, setPadding, setEmrView }) {
    let history = useHistory();
    const [medical, setMedical] = useState({
        history: {},
        isLoading: false,
        dataSource: []
    });
    
    const [medicalHistoryForm] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [formMode, setFormMode] = useState(modes.ADD_NEW);

    function FetchMedicalHistory() {
        const dataSource = [];
        patientApi.getPatientMedicalHistory(pid, 20).then((res) => {
            res.data.response['data'].map((medicalhistory, idx) => {
                dataSource.push({
                    key: idx,
                    ...medicalhistory
                })
            })
            setMedical({
                history: res.data.response,
                isLoading: false,
                dataSource: [...dataSource]
            });
        }).catch((err) => {
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response?.data.result}` || ""
                })
            }
            setMedical({
                ...medical,
                isLoading: false,
            });
        })
    };

    useEffect(() => {
        if (pid) {
            FetchMedicalHistory();
        }
    }, [pid]);

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const columns = [
        {
            title: "Timeline",
            dataIndex: "date_of_treatment",
            key: "date_of_treatment",
            width: 150,
            // render: date_of_treatment => <p>{new Date(date_of_treatment).getFullYear()}</p>
            render: data => moment(data).format("MMM DD YYYY")
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
            title: "Note",
            dataIndex: "note",
            key: "note"
        },
        {
            title: "Documents",
            dataIndex: "documents",
            key: "documents"
        },
        {
            title: "",
            key: "data",
            width: 60,
            render: data => Icons.edit({
                onClick: () => {
                    showDrawer();
                    setFormMode(modes.EDIT);
                    data['date_of_treatment'] = moment(data['date_of_treatment'])
                    medicalHistoryForm.setFieldsValue({ ...data })
                }
            })
        },

    ];

    const successCallBack = () => {
        // console.log(`/dashboard/patient/EMR/${pid}`)
        // window.location.reload(false)
        FetchMedicalHistory();
        onClose();
    };

    const backToPatientDetails = () => {
        // the below code to always redirect to 
        history.push(`/dashboard/patient/details/${pid}`)
        // history.goBack()
    };

    useEffect(() => {
        setComponentSupportContent(
            <div style={{
                height: "100%",
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
            }}>
                <Button onClick={() => { showDrawer(); setFormMode(modes.ADD_NEW); medicalHistoryForm.resetFields() }} type="secondary-outlined">+ Add</Button>
                <Button style={{ width: "55px", marginLeft: "1rem" }} onClick={backToPatientDetails} type="utility" icon={Icons.CloseOutlined({ Style: { color: "#000000" } })} />
            </div>
        )

        return () => {
            setComponentSupportContent(null)
            setPadding("0")
        }
    }, []);

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
                <AddMedicalHistoryForm 
                    pid={pid} 
                    visible={visible}
                    medicalHistoryForm={medicalHistoryForm} 
                    mode={formMode} 
                    successCallBack={successCallBack}
                />
            </Drawer>

            <Row gutter={[0, 0]}>
                <Col span={24}>
                    <Table dataSource={medical?.dataSource} columns={columns} scroll={{ y: 360 }} pagination={{ position: ["bottomCenter"] }} />
                </Col>
            </Row>
        </div >
    )
}
