import React from 'react';
import { Col, Input, Row, Form, Button } from 'antd';


const DoctorDetails = (props) => {

    const submitDoctorDetails = (values) => {
        console.table(values);
        const newList = props.patientClass.list;
        newList[2].error = false;
        newList[2].added = true;
        props.setClass({ list: [...newList] });
        props.setFormData({ ...props.formData, ...values });
        props.setError(false);
        props.setMenuState(4);
    }

    // props.patientClass.list.map(item=>)
    const raiseError = () => {
        const newList = props.patientClass.list;
        newList[2].error = true;
        props.setClass({ list: [...newList] });
        props.setError(true);
    }

    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={submitDoctorDetails}
            onFinishFailed={raiseError}
        >
            <Row span={24} justify="space-around">
                <Col sm={12} style={{ paddingRight: "2em" }}>
                    <Form.Item
                        required={!props.required}
                        label="Consulting Doctor"
                        name="doctor"
                        rules={[{ required: !props.required, message: "Please enter Doctor's name." }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="Height"
                        name="height"
                        rules={[{ required: props.required, message: "Please enter patient's height" }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>

                </Col>
                <Col span={12}>
                    <Form.Item
                        required={!props.required}
                        label="Medical Record Number"
                        name="medicalRecordNumber"
                        rules={[{ required: props.required, message: 'Medical Record number is mandatory.' }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="Weight"
                        name="weight"
                        rules={[{ required: props.required, message: "Please enter patient's weight" }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Next
                </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>);
}

export default DoctorDetails;