import React, { useState, useEffect } from "react";
import { Form, Col, Row } from "antd";
import { practitionersForm } from "../../addPatientFormConfig";
import userApi from "../../../../Apis/userApis";
import { UserStore } from '../../../../Stores/userStore';

const PractitionerDetails = (props) => {
    const [doctorList, setDoctorList] = useState([]);

    const setPractitionersDetail = (values) => {
        values = {
            primary_consultant: values.primary_consultant || [],
            secondary_consultant: values.secondary_consultant || [],
        };
        // props.savePractitionersDetails(values)
    };

    const handleChange = (values) => {
        let name = `${values[0].name[0]}`;
        let value = values[0].value;
        let modifiedData = [];

        value.map((id) => {
            doctorList.map((item) => {
                if (id === item.user_uuid) {
                    modifiedData.push({
                        uuid: item.user_uuid,
                        fname: item.fname,
                        lname: item.lname,
                    });
                }
            });
        });

        props.savePatientDetails({ [name]: modifiedData });
        // props.savePractitionersDetails({ [name]: modifiedData });
    };

    useEffect(() => {
        const userData = UserStore.getUser();
        userApi
            .getUserList( "", "", "", "", "", userData?.tenant)
            .then((res) => {
                const doctorsData = res.data?.response?.users.filter(
                    (item) => item?.role?.toLowerCase() === "doctor"
                );
                setDoctorList(doctorsData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // props.patientClass.list.map(item=>)
    const raiseError = () => {
        // props.setError(true);
    };

    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ ...props.patientData, remember: true }}
            onFinish={setPractitionersDetail}
            onFieldsChange={handleChange}
            onFinishFailed={raiseError}
            form={props.form}
        >
            {console.log(props.patientDetails)}
            <Row span={24} gutter={[12, 8]}>
                {practitionersForm(props, doctorList).map((item) => (
                    <Col span={12} key={item.name}>
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
                ))}
            </Row>
        </Form>
    );
};

export default PractitionerDetails;
