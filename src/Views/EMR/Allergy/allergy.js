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

function FetchAllergy(pid, limit) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        patientApi.getPatientAllergy(pid, limit).then((res) => {
            console.log(res.data.response)
            res.data.response['allergy_list'].map((allergy, idx) => {
                dataSource.push({
                    key: idx,
                    ...allergy,
                    data: { ...allergy }
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
    patientApi.updatePatientAllergy(pid, data).then((res) => {
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

const AddAllergyForm = ({ data, mode = modes.ADD_NEW, allergyForm, successCallBack, pid }) => {

    const reqd = mode === modes.ADD_NEW
    const allergy_uuid = allergyForm.getFieldValue("allergy_uuid")
    const onFinish = (values) => {
        let formData = {
            // "allergy_uuid": "medicalhistory-XXXX",
            // "date_of_treatement": "2021-09-06T00:00:00.000Z",
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
            formData['allergy_uuid'] = allergy_uuid
            console.log(pid, formData)
            UpdateAllergy(pid, formData, successCallBack = successCallBack)
        } else {
            notification.warning({
                message: 'Unknown form mode',
                description: `Unknown form mode is selected`
            })
        }
        console.log("the form mode is", mode)
    }

    const onFinishFailed = (value) => {
        // notification.info({
        //     message: "Error",
        //     description: "All fields required"
        // })
        console.log("failed!! the form mode is", mode)
    }

    useEffect(() => {
        allergyForm.setFieldsValue({
            ...data
        })
    }, [])
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
                        <DatePicker />
                    </Form.Item>
                </Col>
                <Col style={{}} span={reqd ? 8 : 12}>
                    <Form.Item
                        required={false}
                        label="To"
                        name="date_to"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <DatePicker />
                    </Form.Item>
                </Col>
                {mode === modes.ADD_NEW && <Col style={{}} span={reqd ? 8 : 12}>
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
                            defaultValue={"active"}
                            bordered={false}
                            suffixIcon={Icons.downArrowFilled({ style: { color: "#121215" } })}>
                            <Option value="active"><span style={{ color: "#08D000" }}>Active</span></Option>
                            <Option value="inactive"><span style={{ color: "#EB1348" }}>Inactive</span></Option>
                        </Select>
                    </Form.Item>
                </Col>}
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
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
                        required={false}
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
                        required={false}
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
    const [allergy, isLoading, dataSource] = FetchAllergy(pid, 20)
    const [allergyForm] = Form.useForm()
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
            key: "status",
            render: data => {
                console.log(data)
                return < Select
                    // onChange={(e) => { setNameType(e) }}
                    defaultValue={data.status}
                    bordered={false}
                    suffixIcon={Icons.downArrowFilled({ style: { color: "#121215" } })}
                    onSelect={(string, option) => {
                        console.log(data.allergy_uuid, string, option)
                        UpdateAllergy(pid, {
                            allergy_uuid: data.allergy_uuid,
                            status: string,
                        }, () => { })
                    }}
                >
                    <Option value="active"><span style={{ color: "#08D000" }}>Active</span></Option>
                    <Option value="inactive"><span style={{ color: "#EB1348" }}>Inactive</span></Option>
                </ Select>
            }
        },
        {
            title: "Report",
            key: "report",
            render: report => <p>"reports here"</p>
        },
        {
            title: "",
            key: "data",
            render: data => Icons.edit({
                onClick: () => {
                    showDrawer();
                    setFormMode(modes.EDIT);
                    // console.log(data);
                    data['date_from'] = moment(data['date_from'])
                    data['date_to'] = moment(data['date_to'])
                    allergyForm.setFieldsValue({ ...data });
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
                <AddAllergyForm pid={pid} allergyForm={allergyForm} mode={formMode} successCallBack={successCallBack} />
            </Drawer>

            <Row gutter={[0, 0]}>
                <Col span={24}>
                    <Table dataSource={dataSource} columns={columns} scroll={{ y: 360 }} pagination={{ position: ["bottomCenter"] }} />
                </Col>
            </Row>
        </div >
    )
}
