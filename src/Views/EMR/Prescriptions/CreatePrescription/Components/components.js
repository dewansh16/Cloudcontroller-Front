import React, { useState, useEffect } from 'react'
import Icons from '../../../../../Utils/iconMap'
import { Form, Row, Col, Switch, List, Tooltip, Message } from '../../../../../Theme/antdComponents'
import { Input, InputNumber } from '../../../../../Theme/Components/Input/input'
import { Select, SelectOption as Option } from '../../../../../Theme/Components/Select/select'
import { Button } from '../../../../../Theme/Components/Button/button'
import axios from 'axios'
import productApi from '../../../../../Apis/productApis'
import './components.css'
import { message } from 'antd'


function MedicineListItem({ medicine, medicineStore, setAddNew, setMedicineStore, nameType, newMed = false, idx, showAddMedicineToDatabaseModal, ...rest }) {
    const [form] = Form.useForm()
    const [addNewMedView, setAddNewMedView] = useState(newMed)
    const [editView, setEditView] = useState(newMed)


    function RenderForm_({ medicine }) {
        const [medicineSearchList, setMedicineSearchList] = useState([])
        useEffect(() => {
            form.setFieldsValue(medicine)
            return () => {
            }
        }, [medicine, nameType, medicineSearchList])

        const onFinish = (values) => {
            let formData = {
                data: {
                    drugName: values["drugName"],
                    tradeName: values["tradeName"],
                    type: values["type"],
                    strength: values["strength"] || 0,
                    route: values["route"],
                    dosage_morning: values["dosage_morning"] || 0,
                    dosage_afternoon: values["dosage_afternoon"] || 0,
                    dosage_evening: values["dosage_evening"] || 0,
                    occurrence: values["occurrence"],
                    frequency: values["frequency"],
                    frequencyPeriod: values["frequencyPeriod"],
                    details: values["details"] || "",
                },
                valid: true
            }
            console.log(formData)

            if (formData.data.dosage_morning + formData.data.dosage_afternoon + formData.data.dosage_evening < 1) {
                message.error("Add at least one medicine dosage detail")
                return
            }
            if (addNewMedView) {
                medicineStore.push(formData)
                setAddNewMedView(false)
                setAddNew(true)
            } else {
                medicineStore[idx] = formData
                setEditView(false)
            }

            setMedicineStore([...medicineStore])
            console.log(medicineStore)
            form.resetFields()
            // setEditView(false)
        }

        const onFinishFailed = () => {
            // Message.error("Incomplete")
        }

        const onValuesChange = (changedFields, allFields) => {
        }



        const [source, setSource] = useState(new axios.CancelToken.source())
        const [searching, setSearching] = useState(false)

        function SearchMedicine(value, nameType) {
            const genericName = nameType === "generic_name" ? `${value}` : null
            const productName = nameType === "product_name" ? `${value}` : null
            console.log(nameType, genericName, productName)
            // if (searching) {
            //     source.cancel()
            //     setSource(new axios.CancelToken.source())
            // }
            // setSearching(true)
            productApi.getMedicineList(genericName, productName, 100, 0, 0, source.token).then((res) => {
                setMedicineSearchList(res.data?.response.products)
                setSearching(false)
            }).catch(function (thrown) {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled');
                    setSearching(false)
                } else {
                    console.log(thrown.message)
                    setSearching(false)
                }
            });
        }

        return (
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                requiredMark={true}
                onValuesChange={onValuesChange}
                className="myform"
                style={{
                    width: "100%",
                }}
            >
                <Row style={{
                    width: "100%",
                    background:
                        "linear-gradient( \n90.07deg\n , rgb(247, 247, 247) 1.62%, rgba(247, 247, 247, 0) 99.93%)",
                    borderRadius: "6px",
                    padding: "12px"
                }}>
                    <Col span={20}>
                        <Row gutter={[24, 0]}
                            style={{ width: "100%" }}>
                            <Col span={5}>
                                <Form.Item
                                    name="drugName"
                                    label="Drug Name"
                                    required={false}
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={true}
                                        onInput={(e) => { SearchMedicine(e.target.value, nameType) }}
                                        suffixIcon={Icons.downArrowFilled({ style: { color: "#1479FF" } })}
                                        onSelect={(id, option) => {
                                            let medicine = medicineSearchList[option.key]
                                            form.setFieldsValue({
                                                drugName: medicine[nameType],
                                                tradeName: medicine.marketing_status,
                                                type: medicine.form,
                                                route: medicine.route,
                                                strength: medicine.strength || null,
                                            })
                                        }}
                                        showArrow={false}
                                        notFoundContent={
                                            <div>Search for medicine or <span style={{ cursor: "pointer" }} onClick={showAddMedicineToDatabaseModal} style={{ color: "red" }}>Add new medicine to database</span></div>
                                        }
                                        placeholder="Drug Name"
                                    >
                                        {medicineSearchList.map((medicine, id) => {
                                            return <Option key={id} value={medicine.generic_name}>
                                                {medicine.generic_name}
                                            </Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="occurrence"
                                    label="Occurrence"
                                    required={false}
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        showArrow={false}
                                        optionFilterProp="children"
                                        filterOption={true}
                                        placeholder="Before Meal">
                                        <Option value="before meal">Before Meal</Option>
                                        <Option value="after meal">After Meal</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Row gutter={[24, 0]}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="dosage_morning"
                                            label="Morning"
                                        >
                                            <InputNumber min={0} placeholder="NA" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="dosage_afternoon"
                                            label="Afternoon"
                                        >
                                            <InputNumber min={0} placeholder="NA" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="dosage_evening"
                                            label="Evening"
                                        >
                                            <InputNumber min={0} placeholder="NA" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={3}>
                                <Form.Item
                                    name="frequencyPeriod"
                                    required={false}
                                    label="Duration"
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Input type="text" placeholder="NA" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="frequency"
                                    label=" "
                                    required={false}
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        showArrow={false}
                                        optionFilterProp="children"
                                        filterOption={true}
                                        placeholder="Day(s)">
                                        <Option value="day(s)">Day(s)</Option>
                                        <Option value="week(s)">Week(s)</Option>
                                        <Option value="month(s)">Month(s)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="type"
                                    required={false}
                                    label="Type"
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Select
                                        showArrow={false}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={true}
                                        placeholder="Tablet">
                                        <Option value="tablet">Tablet(s)</Option>
                                        <Option value="injection">Injection(s)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="route"
                                    required={false}
                                    label="Route"
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Select
                                        showArrow={false}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={true}
                                        placeholder="Oral">
                                        <Option value="oral">Oral</Option>
                                        <Option value="injection">Injection</Option>
                                        <Option value="drip">Drip</Option>
                                        <Option value="nasal">Nasal</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="tradeName"
                                    label="Trade Name"
                                    labelCol={{ span: 24 }}
                                    required={false}
                                    rules={[{
                                        required: true,
                                        message: `required`
                                    }]}
                                >
                                    <Input type="text" placeholder="Trade name" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="strength"
                                    label="Strength"
                                    required={false}
                                    rules={[{
                                        required: false,
                                        message: `required`
                                    }]}
                                >
                                    <InputNumber min={0} placeholder="In mg" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="details"
                                    label="Details"
                                    required={false}
                                    rules={[{
                                        required: false,
                                        message: `required`
                                    }]}
                                >
                                    <Input type="text" placeholder="Details" />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Col>

                    <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Form.Item>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "space-between",
                                justifyContent: "center"
                            }}>
                                <Button
                                    type="secondary"
                                    style={{ marginBottom: "1rem" }}
                                    onClick={() => {
                                        if (newMed) {
                                            setAddNew(false)
                                            return
                                        }
                                        if (editView) {
                                            setEditView(false)
                                        }
                                    }}>Cancel</Button>
                                <Button type="primary" htmlType="submit">{newMed || !editView ? "Add Medicine" : "Update"}</Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        )
    }

    const medicineOnDelete = () => {
        medicineStore.splice(idx, 1)
        setMedicineStore([...medicineStore])
    }

    return (
        !editView ? (
            <List.Item
                style={{
                    background: "#fff",
                    borderRadius: "6px",
                    margin: "0.5rem 0",
                    padding: "12px",
                    border: "none",
                }}
                className="prescription-medicine-list-item"
                {...rest}
            >
                <Row style={{ width: "100%" }} >
                    <Col span={5}>
                        {medicine?.drugName.slice(0, 25)} {medicine?.drugName.length > 25 ? "..." : ""}
                    </Col>
                    <Col span={5}>
                        {medicine?.dosage_morning}-{medicine?.dosage_afternoon}-{medicine?.dosage_evening} {medicine?.occurrence}
                    </Col>
                    <Col span={5}>
                        for {medicine?.frequencyPeriod} {medicine?.frequency}
                    </Col>
                    <Col span={5}>
                        {medicine?.details}
                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                        <Tooltip placement="top" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title="Edit">
                            <i style={{ cursor: "pointer", margin: "0 1rem" }} onClick={() => setEditView(true)}>{Icons.edit({})}</i>
                        </Tooltip>
                        <Tooltip placement="top" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title="Delete">
                            <i style={{ cursor: "pointer", margin: "0 1rem" }} onClick={medicineOnDelete}>{Icons.deleteFilled({ Style: { color: "#EB1348" } })}</i>
                        </Tooltip>
                    </Col>
                </Row>

            </List.Item>
        ) : <RenderForm_ medicine={medicine} />

    )
}



export { MedicineListItem }