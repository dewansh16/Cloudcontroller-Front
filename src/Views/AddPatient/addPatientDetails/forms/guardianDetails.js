import React, { useState, useEffect } from 'react';
import { Col, Input, Row, Form, Button, Select } from 'antd';
import { phone } from '../../../../Utils/validators';
import countryList from 'country-region-data';
import { GuardianInfoFormItems } from '../../addPatientFormConfig';
const { Option } = Select;


const GuardianDetails = (props) => {
    const temp = countryList.filter(country => country.countryName === "India");
    const [selectedCountry, setSelectedCountry] = useState(temp);

    const StoreGuardianDetails = (values) => {
        // props.savePatientDetails(values)
    }

    const handleChange = (values) => {
        let name = `${values[0].name[0]}`;
        let value = values[0].value;

        // if (name === "admission_date" || name === "discharge_date" || name === "deceased_date" || name === "DOB") {
        //     value = value?.format('YYYY-MM-DD');
        // }
        // const dob = fieldValues.DOB;
        // const deceased_date = fieldValues?.deceased_date;
        // const admission_date = fieldValues?.admission_date;
        // // const values = {
        // //     ...fieldValues,
        // //     formattedDob: dob.format('YYYY-MM-DD')
        // // }
        // fieldValues.DOB = dob.format('YYYY-MM-DD');
        // fieldValues.deceased_date = deceased_date?.format('YYYY-MM-DD')
        // fieldValues.admission_date = admission_date?.format('YYYY-MM-DD')
        props.savePatientDetails({ [name]: value });

    }

    const raiseError = () => {
        // props.setError(true);
    }
    const setCountry = () => {
        console.log(props.form.getFieldValue('guardiancountry'));
        const country = countryList.filter(country => country.countryName === props.form.getFieldValue('guardiancountry'));
        setSelectedCountry(country);
    }

    useEffect(() => {

    }, [selectedCountry]);
    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ ...props.patientData, remember: true }}
            onFieldsChange={handleChange}
            onFinish={StoreGuardianDetails}
            onFinishFailed={raiseError}
            form={props.form}
        >
            <Row span={24} gutter={[12, 8]} >
                {GuardianInfoFormItems(props, setCountry, selectedCountry).map(item =>
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
                )}
                {/* <Col span={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Col> */}
            </Row>
        </Form>
    );
}

export default GuardianDetails;