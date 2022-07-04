import React, { useState, useEffect } from "react";
import { Form, Col, Row } from "antd";
import moment from "moment";
import { demographicsFormItems } from "../../addPatientFormConfig";
import { isJsonString } from "../../../../Utils/utils";

const PatientDemographics = (props) => {
    const [admissionDate, setAdmissionDate] = useState(
        props.patientData.admission_date ? props.patientData.admission_date : null
    );
    const [dischargeDate, setDischargeDate] = useState(
        props.patientData.discharge_date ? props.patientData.discharge_date : null
    );
    const [patientType, setPatientType] = useState(
        props.patientData.patient_type ? props.patientData.patient_type : "remote"
    );

    const tags = props?.patientData?.tags ? props?.patientData?.tags : [];
    const [arrayOptionTags, setArrOptionTags] = useState(tags);
    const [tagSelected, setTagSelected] = useState(tags);

    const [colorSelected, setColorSelected] = useState("#ff0000");

    const StoreDemographics = (fieldValues) => {
        //FIXME:remove hardfix deceased date
        // console.log(props.patientData);
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

    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorLastName, setErrorLastName] = useState(false);

    const onInputChange = (val, type) => {
        const newClass = {...props.patientClass};
        const list = newClass.list;
        if (val.indexOf(' ') >= 0) {
            if (type === "firstName") {
                setErrorFirstName(true);
                list[0].errorFirstName = true;
            } else {
                setErrorLastName(true);
                list[0].errorLastName = true;
            }
         
        } else {
            if (type === "firstName") {
                list[0].errorFirstName = false;
                setErrorFirstName(false);
            } else {
                setErrorLastName(false);
                list[0].errorLastName = false;

            }
        }
        props.setClass(newClass);
    }

    useEffect(() => {
        props.form.setFieldsValue({
            [`tags`]: tagSelected?.map(item => item?.value)
        })
        props.savePatientDetails({ ["tags"]: tagSelected });
    }, [tagSelected]); 
    
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
            <Row span={24} gutter={[8, 8]}>
                {demographicsFormItems(
                    props,
                    admissionDate,
                    setAdmissionDate,
                    dischargeDate,
                    setDischargeDate,
                    errorFirstName,
                    errorLastName,
                    onInputChange,
                    setPatientType,
                    patientType,
                    arrayOptionTags,
                    setArrOptionTags,
                    tagSelected,
                    setTagSelected,
                ).map((item) => {
                    // if (item.name === "patient_type") {
                    //     // console.log("admisiion wala kaam krra");
                    //     return (
                    //         <Col key={item.name} span={24}>
                    //             <Form.Item
                    //                 required={item.required}
                    //                 hasFeedback={item.hasFeedback}
                    //                 label={item.label}
                    //                 name={item.name}
                    //                 validateFirst={item.validateFirst}
                    //                 rules={item.rules}
                    //             >
                    //                 {item.Input}
                    //             </Form.Item>
                    //         </Col>
                    //     );
                    // }
                    return (
                        <Col key={item.name} span={12}>
                            <Form.Item
                                required={item.required}
                                hasFeedback={item.hasFeedback}
                                label={item.label}
                                name={item.name}
                                validateFirst={item.validateFirst}
                                rules={item.rules}
                                className={item.className}
                            >
                                {item.Input}
                            </Form.Item>
                            {((errorFirstName && item.name === "fname") || (errorLastName && item.name === "lname")) && (
                                <div style={{ 
                                    position: "absolute",
                                    bottom: "0",
                                    left: "0",
                                    fontSize: "14px",
                                    color: "#FF2B2B",
                                    // marginBottom: "-22px"
                                }}>{`${errorFirstName ? "First" : "Last"} Name is not space!`}</div>
                            )}
                        </Col>
                    );
                })}
            </Row>
        </Form>
    );
};

export default PatientDemographics;
