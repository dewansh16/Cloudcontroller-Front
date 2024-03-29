import React, { useState } from "react";
import { Form, Col, Row } from "antd";
import moment from "moment";
import { demographicsFormItems } from "../../addPatientFormConfig";

const PatientDemographics = (props) => {
    // const [initialState,setInitialState]
    const [admissionDate, setAdmissionDate] = useState(
        props.patientData.admission_date ? props.patientData.admission_date : null
    );
    const [dischargeDate, setDischargeDate] = useState(
        props.patientData.discharge_date ? props.patientData.discharge_date : null
    );
    const StoreDemographics = (fieldValues) => {
        //FIXME:remove hardfix deceased date
        console.log(props.patientData);
    };

    const handleChange = (values) => {
        let name = `${values[0].name[0]}`;
        let value = values[0].value;
        if (
            name === "admission_date" ||
            name === "discharge_date" ||
            name === "deceased_date" ||
            name === "DOB"
        ) {
            value =
                value === null || value === undefined
                    ? null
                    : value.format("YYYY-MM-DD");
        }
        props.savePatientDetails({ [name]: value });
    };

    const raiseError = (values) => {
        console.log("i am getting called", values);
        let list = props.patientClass.list;
        list[0].error = true;
        props.setClass({ list: list });
    };

    // console.log(admissionDate, dischargeDate);
    React.useEffect(() => { }, [props.patientData]);

    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ ...props.patientData, remember: true }}
            onFinish={StoreDemographics}
            onFieldsChange={handleChange}
            onFinishFailed={raiseError}
            form={props.form}
        >
            {
                // console.log("demographics", props.patientData)
            }
            <Row span={24} gutter={[8, 8]}>
                {demographicsFormItems(
                    props,
                    admissionDate,
                    setAdmissionDate,
                    dischargeDate,
                    setDischargeDate
                ).map((item) => {
                    if (item.name === "admission_date") {
                        // console.log("admisiion wala kaam krra");
                        return (
                            <Col key={item.name} span={12}>
                                <Form.Item
                                    required={item.required}
                                    hasFeedback={item.hasFeedback}
                                    label={item.label}
                                    name={item.name}
                                    validateFirst={item.validateFirst}
                                    rules={item.rules}
                                >
                                    {item.Input}
                                </Form.Item>
                            </Col>
                        );
                    }
                    return (
                        <Col key={item.name} span={12}>
                            <Form.Item
                                required={item.required}
                                hasFeedback={item.hasFeedback}
                                label={item.label}
                                name={item.name}
                                validateFirst={item.validateFirst}
                                rules={item.rules}
                            >
                                {item.Input}
                            </Form.Item>
                        </Col>
                    );
                })}
            </Row>
        </Form>
    );
};

export default PatientDemographics;
