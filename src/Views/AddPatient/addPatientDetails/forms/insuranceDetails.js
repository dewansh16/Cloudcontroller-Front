import React from 'react';
import { Col, Input, Row, Form, Button } from 'antd';



const InsuranceDetails = (props) => {
    const submitInsuranceDetails = (values) => {
        const newList = props.patientClass.list;
        newList[4].error = false;
        newList[4].added = true;
        props.setClass({ list: [...newList] });
        props.setFormData({ ...props.formData, ...values });
        props.setError(false);

    }

    // props.patientClass.list.map(item=>)
    const raiseError = () => {
        const newList = props.patientClass.list;
        newList[4].error = true;
        props.setClass({ list: [...newList] });
        props.setError(true);
    }
    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={submitInsuranceDetails}
            onFinishFailed={raiseError}
        >
            <Row span={24} justify="space-around">
                <Col sm={12} style={{ paddingRight: "2em" }}>
                    <Form.Item
                        required={!props.required}
                        label="Claim limit"
                        name="insurancelimit"
                        rules={[{ required: props.required, message: 'Please input your username!' }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>

                </Col>
                <Col span={12}>
                    <Form.Item
                        required={!props.required}
                        label="Issuer"
                        name="insuranceissuer"
                        rules={[{ required: props.required, message: 'Please input your password!' }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Save
                </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>);
}

export default InsuranceDetails;