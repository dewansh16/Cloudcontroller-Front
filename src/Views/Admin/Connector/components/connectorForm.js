import React from 'react';
import { Col, Input, Row, Form, Select, TimePicker } from 'antd';
const { Option } = Select;
export default function ConnectorForm(props) {

    const connectorTypeList = [
        "AllScript",
        "Cerner",
        "Epic",
        "InstaHms"
    ]

    const resourceType = [
        "Patient Demographic",
        "Insurance",
        "Users",
        "All"
    ]

    let availableResourceTypes = resourceType;

    //FIXME: filter not working
    const handleResourceTypeSelected = (selectedItems) => {
        availableResourceTypes = resourceType.filter(o => !selectedItems.includes(o));
    }


    const submitConnectorForm = (values) => {
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
            form={props.form}
            initialValues={{ remember: true }}
            onFinish={submitConnectorForm}
            onFinishFailed={raiseError}
        >
            <Row span={24} justify="space-around">
                <Col sm={12} style={{ paddingRight: "2em" }}>
                    <Form.Item
                        required={!props.required}
                        label="Connector type"
                        name="connectorType"
                        rules={[{ required: !props.required, message: "Please enter connector type" }]}
                        className="addPatientDetailsModal"
                    >
                        <Select defaultValue={connectorTypeList[0]}>
                            {connectorTypeList.map((type, i) => {
                                console.log(type)
                                return <Option key={i} value={type} >{type}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="Username"
                        name="username"
                        rules={[{ required: props.required, message: "Please enter username" }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="Resource type"
                        name="resourceType"
                        rules={[{ required: props.required, message: 'Please enter resource type' }]}
                        className="addPatientDetailsModal"
                    >
                        <Select mode="multiple" defaultValue={resourceType[0]} onSelect={handleResourceTypeSelected}>
                            {availableResourceTypes.map((type, i) => {
                                console.log(type)
                                return <Option key={i} value={type} >{type}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        required={!props.required}
                        label="Website Link"
                        name="websiteLink"
                        rules={[{ required: props.required, message: "Please enter web link" }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="Password"
                        name="password"
                        rules={[{ required: props.required, message: "Please enter password" }]}
                        className="addPatientDetailsModal"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required={!props.required}
                        label="Time for Auto Import "
                        name="autoImport"
                        rules={[{ required: props.required, message: "Time interval to auto import" }]}
                        className="addPatientDetailsModal"
                    >
                        <TimePicker />
                    </Form.Item>
                </Col>
            </Row>
        </Form >);
}