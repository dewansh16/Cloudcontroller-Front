import React, { useState, useEffect } from 'react';
import countryList from 'country-region-data';
import { Form, Col, Row } from 'antd';
import { AddressFormItems } from '../../addPatientFormConfig';


const LocationDetails = (props) => {

    const temp = countryList.filter(country => country.countryName === "India");
    const [selectedCountry, setSelectedCountry] = useState(temp);

    const StoreLocationDetails = (values) => {
        console.log(values)
        // props.savePatientDetails(values)
    }

    const handleChange = (values) => {
        let name = `${values[0].name[0]}`;
        let value = values[0].value;
        props.savePatientDetails({ [name]: value });
    }

    // props.patientClass.list.map(item=>)
    const raiseError = () => {
        // props.setError(true);
    }

    const setCountry = () => {
        const country = countryList.filter(country => country.countryName === props.form.getFieldValue('country_name'));
        setSelectedCountry(country);
    }

    useEffect(() => {

    }, [selectedCountry]);

    return (
        <Form
            {...props.layout}
            layout="vertical"
            name="basic"
            initialValues={{ ...props.patientData, remember: true, }}
            onFinish={StoreLocationDetails}
            onFieldsChange={handleChange}
            onFinishFailed={raiseError}
            form={props.form}
        >
            <Row span={24} gutter={[12, 8]}>
                {AddressFormItems(props, setCountry, selectedCountry).map(item =>
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
        </Form>);
}

export default LocationDetails;