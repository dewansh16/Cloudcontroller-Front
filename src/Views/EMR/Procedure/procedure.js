import React, { useState, useEffect } from 'react'
import { Row, Col, Drawer, Form, notification, Table } from '../../../Theme/antdComponents'
import { Button } from '../../../Theme/Components/Button/button'
import { Input, GlobalTextArea as TextArea } from '../../../Theme/Components/Input/input'
import { Select, SelectOption as Option } from '../../../Theme/Components/Select/select'
import { DatePicker } from '../../../Theme/Components/DateTimePicker/dateTimePicker'
import Icons from '../../../Utils/iconMap'
import { modes } from './mode'
import patientApi from '../../../Apis/patientApis'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { UserStore } from "../../../Stores/userStore";

function FetchProcedure(pid, limit) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        patientApi.getPatientProcedure(pid, limit).then((res) => {
            res.data.response['procedure_list'].map((procedure, idx) => {
                dataSource.push({
                    key: idx,
                    ...procedure
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

function AddProcedure(pid, data, successCallBack) {
    // "pid": "patientc10c064c-fd5a-4ddc-85ca-1744d6104229",
    // "tenant_id": "tenant8ea56b12-ff44-4b5c-839c-f609363ba385",
    // "code_type": "code_type02",
    // "description": "description",
    // "diagnosis_date": "2022-06-17T07:54:05.014Z",
    // "result": "result",
    // "consulting_person": "consulting_person",
    // "reaction": "Reaction123",
    // "status": "completed02",
    // "label": "normal"
    let userData = UserStore.getUser();
    let tenantId = userData.tenant;
    data.pid = pid;
    data.tenant_id = tenantId;
    patientApi.createPatientProcedure(pid, data).then((res) => {
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

function UpdateProcedure(pid, data, successCallBack) {
    patientApi.updatePatientProcedure(pid, data).then((res) => {
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

const AddProcedureForm = ({ data, mode = modes.ADD_NEW, procedureForm, successCallBack, pid }) => {
    const reqd = mode === modes.ADD_NEW
    const procedure_uuid = procedureForm.getFieldValue("procedure_uuid")
    const onFinish = (values) => {
        let formData = {}
        formData = { ...values }
        if (mode === modes.ADD_NEW) {
            console.log(pid, formData)
            AddProcedure(pid, formData, successCallBack = successCallBack)
        } else if (mode === modes.EDIT) {
            formData['procedure_uuid'] = procedure_uuid
            console.log(pid, formData)
            UpdateProcedure(pid, formData, successCallBack = successCallBack)
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
        procedureForm.setFieldsValue({
            ...data
        })
    }, [])
    return (
        <Form
            form={procedureForm}
            layout="vertical"
            name="procedureForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[0, 0]} justify="space-around">
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Date of diagnosis"
                        name="diagnosis_date"
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
                        label="Procedure Code Type"
                        name="code_type"
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
                        label="Procedure Description"
                        name="description"
                        rules={[{
                            required: reqd,
                            message: "required"
                        }]}
                    >
                        <TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>
                </Col>
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Result/Conclusion"
                        name="result"
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
                        label="Consulting Person"
                        name="consulting_person"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col style={{}} span={12}>
                    <Form.Item
                        required={false}
                        label="Procedure Status"
                        name="status"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <Select
                            // onChange={(e) => { setNameType(e) }}
                            defaultValue={"complete"}
                            bordered={false}
                            suffixIcon={Icons.downArrowFilled({ style: { color: "#121215" } })}>
                            <Option value="complete"><span style={{}}>Complete</span></Option>
                            <Option value="incomplete"><span style={{}}>Incomplete</span></Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col style={{}} span={12}>
                    <Form.Item
                        required={false}
                        label="Procedure Label"
                        name="label"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <Select
                            // onChange={(e) => { setNameType(e) }}
                            defaultValue={"normal"}
                            bordered={false}
                            suffixIcon={Icons.downArrowFilled({ style: { color: "#121215" } })}>
                            <Option value="normal"><span style={{}}>Normal</span></Option>
                            <Option value="critical"><span style={{}}>Critical</span></Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default function Procedure({ pid, setComponentSupportContent, setPadding, setEmrView }) {
    let history = useHistory();
    const [medicalHistory, isLoading, dataSource] = FetchProcedure(pid, 20)
    const [procedureForm] = Form.useForm()
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
            title: "Date",
            dataIndex: "diagnosis_date",
            key: "diagnosis_date",
        },
        {
            title: "Procedure Code",
            dataIndex: "code_type",
            key: "treatment"
        },
        {
            title: "Procedure",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status"
        },
        {
            title: "Labels",
            dataIndex: "label",
            key: "label"
        },
        {
            title: "",
            key: "data",
            render: data => Icons.edit({
                onClick: () => {
                    showDrawer();
                    setFormMode(modes.EDIT);
                    data['diagnosis_date'] = moment(data['diagnosis_date'])
                    procedureForm.setFieldsValue({ ...data })
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
                <Button onClick={() => { showDrawer(); setFormMode(modes.ADD_NEW); procedureForm.resetFields() }} type="secondary-outlined">+ Add</Button>
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
                    <Col span={12}><Button onClick={procedureForm.submit} type="secondary">{formMode}</Button></Col>
                </Row>
            }
                placement="right"
                onClose={onClose}
                visible={visible}
                width={720}
            >
                <AddProcedureForm pid={pid} procedureForm={procedureForm} mode={formMode} successCallBack={successCallBack} />
            </Drawer>

            <Row gutter={[0, 0]}>
                <Col span={24}>
                    <Table dataSource={dataSource} columns={columns} scroll={{ y: 360 }} pagination={{ position: ["bottomCenter"] }} />
                </Col>
            </Row>
        </div >
    )
}
