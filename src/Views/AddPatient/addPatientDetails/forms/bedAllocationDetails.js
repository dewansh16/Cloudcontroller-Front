import React, { useState, useEffect } from "react";
import { Form, Col, Row, Spin } from "antd";
import { BedAllocationForm } from "../../addPatientFormConfig";
import { UserStore } from "../../../../Stores/userStore";
import locationApi from "../../../../Apis/locationApi";

const BedAllocationDetails = (props) => {
    const [locationDetail, setLocationDetail] = useState({});
    const [locationArray, setLocationArray] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [floorsArray, setFloorsArray] = useState([]);
    const [wardsArray, setWardsArray] = useState([]);
    const [bedsArray, setBedsArray] = useState([]);
    const [floor, setFloor] = useState(null);
    const [ward, setWard] = useState(null);
    const [bed, setBed] = useState(null);

    const StoreBedAllocationDetails = (values) => {
        const locationObj = locationArray.filter((item) => {
            // console.log(parseInt(item.floor), values.floor, item.ward, values.ward)
            if (
                parseInt(item.floor) === values.floor &&
                parseInt(item.ward) === values.ward
            ) {
                return true;
            }
            return false;
        });
        values = {
            location_uuid: locationObj[0]?.location_uuid,
        };
        props.savePatientDetails(values);
    };

    const handleChange = (values) => {
        let name = `${values[0].name[0]}`;
        let value = values[0].value;
        switch (name) {
            case "floor": {
                props.form.setFieldsValue({ ward: null, bed: null });
                setWard(null);
                setBed(null);
                setFloor(value);
                setWardsArray(
                    Object.keys(
                        locationDetail.buildings["building_1"]?.floors[`floor_${value}`]
                            ?.wards
                    )
                );
                break;
            }
            case "ward": {
                props.form.setFieldsValue({ bed: null });
                setWard(value);
                setBed(null);
                setBedsArray(
                    arrayGen(
                        parseInt(
                            locationDetail.buildings["building_1"].floors[
                                floorsArray[floor - 1]
                            ]?.wards[`ward_${value}`]?.bed_count
                        ),
                        "bed_"
                    )
                );
                console.log(
                    parseInt(
                        locationDetail.buildings["building_1"].floors[
                            floorsArray[floor - 1]
                        ]?.wards[`ward_${value}`]?.bed_count
                    )
                );
                // console.log(locationArray, value, floor)
                const locationObj = locationArray.filter((item) => {
                    // console.log(parseInt(item.floor), values.floor, item.ward, values.ward)
                    if (parseInt(item.floor) === floor && parseInt(item.ward) === value) {
                        return true;
                    }
                    return false;
                });
                // console.log(locationObj)
                props.savePatientDetails({
                    location_uuid: locationObj[0]?.location_uuid,
                });
                break;
            }
            case "bed": {
                props.savePatientDetails({ [name]: value });
                break;
            }
            default:
                return null;
        }
    };

    useEffect(() => {
        let userData = UserStore.getUser();

        // console.log(userData);

        locationApi
            .getLocationData(userData.tenant)
            .then((res) => {
                setLocationDetail(res.data.response?.facilities[0]?.facility_map);
                setLoading(false);
                setLocationArray(res.data.response?.locations);
                setFloorsArray(
                    Object.keys(
                        res.data.response?.facilities[0]?.facility_map.buildings[
                            "building_1"
                        ]?.floors
                    )
                );
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    // props.patientClass.list.map(item=>)
    const raiseError = () => {
        // props.setError(true);
    };

    const arrayGen = (count, template) => {
        let array = [];
        Array.apply(null, new Array(count)).map((item, index) => {
            let val = template + `${index + 1}`;
            array.push(val);
        });
        // console.table(array)
        return array;
    };

    return (
        <>
            {" "}
            {isLoading && (
                <Spin style={{ position: "relative", left: "50%", top: "30%" }} />
            )}
            {!isLoading && (
                <Form
                    {...props.layout}
                    layout="vertical"
                    name="basic"
                    initialValues={{ ...props.patientData, remember: true }}
                    onFinish={StoreBedAllocationDetails}
                    onFieldsChange={handleChange}
                    onFinishFailed={raiseError}
                    form={props.form}
                >
                    <Row span={24} gutter={[12, 8]}>
                        {BedAllocationForm(
                            props,
                            floorsArray,
                            locationDetail,
                            floor,
                            wardsArray,
                            ward,
                            bedsArray
                        ).map((item) => (
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

export default BedAllocationDetails;
