import React, { useState, useEffect } from "react";
import { Form, Col, Row, Spin } from "antd";
import { practitionersForm } from "../../addPatientFormConfig";
import userApi from "../../../../Apis/userApis";
import { UserStore } from '../../../../Stores/userStore';

const PractitionerDetails = (props) => {
    const [loading, setLoading] = useState(false);

    const [doctorList, setDoctorList] = useState([]);
    const [primaryConsultantList, setPrimary] = useState([]);
    const [secondaryConsultantList, setSecondary] = useState([]);

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
            primaryConsultantList.map((item) => {
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

    const loopFormatArrSelectOption = (arrayLoopUuid, setArray, type) => {
        const arrUuid = arrayLoopUuid?.map(item => item?.uuid);
        const newArr = doctorList.map(item => {
            const data = {...item};
            return data;
        })

        newArr.map(element => {
            if (arrUuid?.includes(element.user_uuid)) {
                element.isSelected = true;
            } else {
                element.isSelected = false;
            }   
        })
        
        setArray(newArr);
    }

    useEffect(() => {
        const primary_consultant = props?.patientData?.primary_consultant || [];
        loopFormatArrSelectOption(primary_consultant, setSecondary, "primary_consultant");
    }, [props.patientData.primary_consultant, doctorList]);

    useEffect(() => {
        const secondary_consultant = props?.patientData?.secondary_consultant || [];
        loopFormatArrSelectOption(secondary_consultant, setPrimary);
    }, [props.patientData.secondary_consultant, doctorList]);

    useEffect(() => {
        setLoading(true);
        
        const userData = UserStore.getUser();
        userApi
            .getUserList(userData?.tenant)
            .then((res) => {
                const doctorsData = res.data?.response?.users.filter(
                    (item) => item?.role?.toLowerCase() === "doctor" || item?.role?.toLowerCase() === "nurse"
                );
                setDoctorList(doctorsData)
                // setPrimary(doctorsData);
                // setSecondary(doctorsData);
                setLoading(false);
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
        <>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Spin />
                </div>
            ) : (
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
                    <Row span={24} gutter={[12, 8]}>
                        {practitionersForm(props, primaryConsultantList, secondaryConsultantList).map((item) => (
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
            )}
        </>
    );
};

export default PractitionerDetails;
