import React, { useState, useEffect } from 'react'
import { Prompt } from 'react-router'
import axios from 'axios'
import { Form, Row, Col, Avatar, notification, Spin, Modal, DatePicker, Tooltip } from '../../../../Theme/antdComponents'

import { Input, InputNumber } from '../../../../Theme/Components/Input/input'
import { Select, SelectOption as Option } from '../../../../Theme/Components/Select/select'

import { MenuListItem, MedicineSearchListItem, MedicineSearchListHeader } from './Components/components'
import { Button } from '../../../../Theme/Components/Button/button'
import Icons from '../../../../Utils/iconMap'
import { createName, EmrView } from '../../EMR'
import productApi from '../../../../Apis/productApis'
import patientApi from '../../../../Apis/patientApis'
import './createPrescription.css'

import { UserStore } from '../../../../Stores/userStore'

const tempMedicineList = {
    0: {
        formData: {
            "type": "TABLET",
            "doses": "once a day",
            "route": "ORAL",
            "dosage": "1",
            "details": null,
            "drugName": "Hydrocodone Polistirex and Chlorpheniramine Polistirex",
            "strength": 100,
            "frequency": "week(s)",
            "tradeName": "ANDA",
            "occurrence": "before breakfast",
            "frequencyPeriod": "3"
        },
        valid: null,
    },
    1: {
        formData: {
            "type": "INJECTION",
            "doses": "once a day",
            "route": "INJECTION",
            "dosage": "1",
            "details": null,
            "drugName": "Lisinopril",
            "strength": 100,
            "frequency": "week(s)",
            "tradeName": "ANDA",
            "occurrence": "before breakfast",
            "frequencyPeriod": "3"
        },
        valid: null,
    }
}

function AddMedicineToDB({ fieldValues }) {
    const [addMedForm] = Form.useForm()
    useEffect(() => {
        let formData = {}
        formData[fieldValues["medicineFieldType"]] = fieldValues["medicineSearchFieldValue"]
        addMedForm.resetFields()
        addMedForm.setFieldsValue({ ...formData })

        return () => {
            addMedForm.resetFields()
        }
    }, [fieldValues])

    const onFinish = (value) => {
        value["active_ingredient_count"] = 1
        productApi.addProduct(value).then((res) => {
            if (res.status === 200) {
                notification.success({
                    message: "Success",
                    description: res.message
                })
            } else {
                notification.info({
                    message: "Something went wrong",
                    description: res.message
                })
            }
        }).catch(
            err => {
                if (err.response !== undefined) {
                    notification.error({
                        message: 'Error',
                        description: `${err.response.data.result}`
                    });
                }
            })
    }

    const onFinishFailed = (value) => {
        notification.info({
            message: "Error",
            description: "All fields required"
        })
    }
    return (
        <>
            {/* {fillAddMedForm()} */}
            <Form
                form={addMedForm}
                layout="vertical"
                name="addMedicineToDBForm"
                initialValues={{ remember: true }}
                className="addMedToDBForm"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[24, 24]} justify="space-between">
                    <Col style={{ textAlign: "center" }} span={12}>
                        <h1 style={{ color: "rgba(20, 121, 255, 1)", fontWeightL: "500", fontSize: "36px" }}>Add New Medicine</h1>
                    </Col>
                    <Col style={{}} span={6}>
                        <Form.Item>
                            <Button style={{ width: "120px" }} htmlType="submit" type="primary">Add</Button>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} justify="space-around">
                    <Col style={{}} span={8}>
                        <Form.Item
                            required={false}
                            label="Product Name"
                            name="product_name"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col style={{}} span={8}>
                        <Form.Item
                            required={false}
                            label="Trade Name"
                            name="marketing_status"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} justify="space-around">
                    <Col style={{}} span={8}>
                        <Form.Item
                            required={false}
                            label="Generic Name"
                            name="generic_name"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col style={{}} span={8}>
                        <Form.Item
                            required={false}
                            label="Type"
                            name="form"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="form"
                            >
                                <Option value="tablets">Tablets</Option>
                                <Option value="injection">Injection</Option>
                                <Option value="syrup">Syrup</Option>

                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} justify="space-around">
                    <Col style={{}} span={8}>
                        <Form.Item
                            required={false}
                            label="NDC Product Code"
                            name="ndc_product_code"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Input placeholder="product" />
                        </Form.Item>
                    </Col>
                    <Col style={{}} span={8}>
                        <Form.Item
                            required={false}
                            label="Via"
                            name="route"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="route"
                            >
                                <Option value="oral">Oral</Option>
                                <Option value="nasal">Nasal</Option>
                                <Option value="injection">Injection</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

function AddPrescriptions(pid, data, successCallBack) {
    patientApi.addPrescriptions(pid, data).then((res) => {
        notification.success({
            message: "Success",
            description: res.message
        })
        successCallBack()
    }).catch((err) => {
        if (err) {
            notification.error({
                message: 'Error',
                description: `${err.response?.data.result}` || ""
            })
        }
    })
}

export default function CreatePrescription({ pid, setEmrView, patient, setPadding, medicinesList = {}, duplicate = false }) {

    const [medicineStore, setMedicineStore] = useState(medicinesList)
    const [medicineNumber, setMedicineNumber] = useState(0)
    const [addMedicineStatus, setAddMedicineStatus] = useState(false)
    const [addNew, setAddNew] = useState(true)
    const [currentMedicine, setCurrentMedicine] = useState(null)
    const [duplicateMedication, setDuplicateMedication] = useState(duplicate)
    const [calendarDate, setCalendarDate] = useState(null)
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    const savePrescriptions = () => {
        if (Object.keys(medicineStore).length < 1) {
            notification.error({
                message: "Cannot save",
                description: `No medicine added to prescription`
            });
            return
        }

        const user = UserStore.getUser()

        const timeElapsed = Date.now();
        const today = new Date(timeElapsed).toISOString().slice(0, 10);

        let data = {
            "prescription_uuid": "",
            "pid": pid,
            // current date or input from the calendar
            "date_added": today,
            "date_modified": calendarDate || today,
            "drug": [],
            "active": 1,
            "end_date": today,
            "txDate": today,
            "tenant_uuid": user.tenant,
            "id": 1
        }

        let flag = true;

        Object.keys(medicineStore).map((id) => {
            if (medicineStore[id].valid) {
                data["drug"].push({
                    drugName: medicineStore[id].formData["drugName"],
                    tradeName: medicineStore[id].formData["tradeName"],
                    type: medicineStore[id].formData["type"],
                    strength: medicineStore[id].formData["strength"],
                    dosage: medicineStore[id].formData["dosage"],
                    route: medicineStore[id].formData["route"],
                    doses: medicineStore[id].formData["doses"],
                    occurrence: medicineStore[id].formData["occurrence"],
                    frequency: medicineStore[id].formData["frequency"],
                    frequencyPeriod: medicineStore[id].formData["frequencyPeriod"],
                    details: medicineStore[id].formData["details"],
                })
            } else {
                if (medicineStore[id].valid === null) {
                    notification.warning({
                        message: "Unupdated medicine",
                        description: "please update all the medicines to the list"
                    })
                    flag = false
                } else {
                    notification.error({
                        message: "invalid medicine data",
                        description: "please ensure validity"
                    })
                    flag = false
                }
            }

        })
        console.log(data["drug"])
        if (flag) AddPrescriptions(pid, data, () => setEmrView(<EmrView pid={pid} setPadding={setPadding} setEmrView={setEmrView} defaulState={"subgroup-3-element-1"} />))
    }


    const [form] = Form.useForm()
    const [searchMedicineForm] = Form.useForm()

    useEffect(() => {
        return () => {
            console.log(unsavedChanges, "when component removed")
        }
    }, [currentMedicine])

    // medicine search bar
    const RenderSearchMedicineForm = () => {
        const [nameType, setNameType] = useState("product_name")
        const [searchFieldValue, setSearchFieldValue] = useState(searchMedicineForm.getFieldValue('medicineSearch'))
        const [medicineSearchList, setMedicineSearchList] = useState(null)
        const [searching, setSearching] = useState(false)

        const [source, setSource] = useState(new axios.CancelToken.source())

        function SearchMedicine() {
            const genericName = nameType === "generic_name" ? searchFieldValue : null
            const productName = nameType === "product_name" ? searchFieldValue : null
            if (searching) {
                source.cancel()
                setSource(new axios.CancelToken.source())
            }
            setSearching(true)
            productApi.getMedicineList(genericName, productName, 100, 0, 0, source.token).then((res) => {
                setMedicineSearchList(res.data.response.products)
                setSearching(false)
            }).catch(function (thrown) {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message);
                    setSearching(false)
                } else {
                    console.log(thrown.message)
                    setSearching(false)
                }
            });
        }


        const onFinish = (values) => {
        }
        const onFinishFailed = () => {
        }
        const onValuesChange = (changedFields, allFields) => {
            setSearchFieldValue(changedFields.searchMedicine)
        }



        // Modal
        const [addMedicineToDatabaseModalVisibility, setAddMedicineToDatabaseModalVisibility] = useState(false)
        const showAddMedicineToDatabaseModal = () => {
            setAddMedicineToDatabaseModalVisibility(true)
        }

        const showAddMedicineToDatabaseModalOnCancel = () => {
            setAddMedicineToDatabaseModalVisibility(false)
        }


        useEffect(() => {
            searchMedicineForm.resetFields()
        }, [])


        return (
            <>
                <Modal
                    width="60%"
                    visible={addMedicineToDatabaseModalVisibility}
                    onCancel={showAddMedicineToDatabaseModalOnCancel}
                    centered
                    footer={null}
                >
                    <AddMedicineToDB fieldValues={{ medicineFieldType: nameType, medicineSearchFieldValue: searchFieldValue }} />
                </Modal>
                <Form
                    layout="vertical"
                    form={searchMedicineForm}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    requiredMark={false}
                    onValuesChange={onValuesChange}
                    initialValues={{ searchMedicine: searchFieldValue }}
                    className="myform"
                >
                    <Row>
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <span style={{ marginRight: "1rem" }}>Search Medicine</span>
                            <Select onFocus={(e) => e.preventDefault()} onChange={(e) => { setNameType(e) }} defaultValue="product_name" bordered={false} suffixIcon={Icons.downArrowFilled({ style: { color: "#1479FF" } })}>
                                <Option value="product_name"><span style={{ color: "#1479FF" }}>Product Name</span></Option>
                                <Option value="generic_name"><span style={{ color: "#1479FF" }}>Generic Name</span></Option>
                            </Select>
                        </div>
                        <Col span={24}>
                            <Form.Item
                                name="searchMedicine"
                                required={false}
                                rules={[{
                                    required: false,
                                    message: `required`
                                }]}

                            >
                                <Input id="searchMedicine" type="text" disabled={addMedicineStatus} onChange={SearchMedicine} onPressEnter={SearchMedicine} placeholder="Search Medicine" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {
                    searching ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Spin />
                        </div>
                    ) : (
                        medicineSearchList ? (
                            medicineSearchList.length < 1 ? (
                                <div style={{ height: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                                    <p>
                                        No such medicine found :(
                                    </p>
                                    <Button onClick={showAddMedicineToDatabaseModal}>Add New Medicine to Databse</Button>
                                </div>
                            ) : (
                                <>
                                    <MedicineSearchListHeader title1={nameType} title2="trade name" />
                                    <ul style={{ listStyleType: "none", overflowY: "scroll", maxHeight: "300px", padding: "0" }}>
                                        {medicineSearchList.map((medicine) => {
                                            return <MedicineSearchListItem
                                                selected={false}
                                                data={medicine}
                                                nameType={nameType}
                                                onClick={(e) => {
                                                    form.setFieldsValue({
                                                        drugName: medicine[nameType],
                                                        tradeName: medicine.marketing_status,
                                                        type: medicine.form,
                                                        route: medicine.route,
                                                        strength: medicine.strength || null,
                                                    })
                                                }}
                                                key={medicine.id}
                                            />
                                        })}
                                    </ul>
                                </>
                            )
                        ) : (
                            "search medicine here"
                        )


                    )
                }

            </>
        )
    }

    const RenderForm = ({ setUnsavedChanges }) => {
        const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
        useEffect(() => {
            form.resetFields()
            if (duplicateMedication) {
                setMedicineNumber(Object.keys(medicinesList).length)
                setCurrentMedicine(medicineStore[medicineNumber])
                setDuplicateMedication(false)
            }

            return () => {
                console.log(unsavedChanges, "when form removed")
                if (hasUnsavedChanges) {
                    setUnsavedChanges(true)
                }
            }
        }, [])

        const onFinish = (values) => {
            setUnsavedChanges(true)
            medicineStore[medicineNumber] = {
                formData: values,
                valid: true,
            }
            const details = values.details || `${values.dosage || ""} ${values.type || ""} ${values.route || ""} ${values.doses || ""} ${values.occurrence || ""} for ${values.frequencyPeriod || ""} ${values.frequency || ""}`
            medicineStore[medicineNumber].valid = true
            medicineStore[medicineNumber].formData['details'] = details
            setMedicineStore({ ...medicineStore })
            setAddMedicineStatus(true)
            setAddNew(false)
        }

        const onFinishFailed = () => {
            setUnsavedChanges(true)
            medicineStore[medicineNumber] = {
                formData: form.getFieldsValue(true),
                valid: false,
            }
        }

        const onValuesChange = (changedFields, allFields) => {
            setHasUnsavedChanges(true)
            if (changedFields.drugName) {
                searchMedicineForm.setFieldsValue({ searchMedicine: changedFields.drugName })
                document.getElementById("searchMedicine").value = changedFields.drugName
                if (addNew) {
                    document.getElementById("newMed").innerText = changedFields.drugName
                }
            }

            medicineStore[medicineNumber] = {
                formData: allFields,
                valid: null,
            }
        }

        return (
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                requiredMark={true}
                initialValues={currentMedicine}
                onValuesChange={onValuesChange}
                className="myform"
            >
                <Row gutter={[24, 0]}>
                    <Col span={24} lg={24}>
                        <Form.Item
                            name="drugName"
                            label="Drug Name"
                            labelCol={{ span: 24 }}
                            required={false}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Input type="text" placeholder="Drug Name" />
                        </Form.Item>
                    </Col>
                    <Col span={16} lg={16}>
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
                            <Input type="text" placeholder="Enter medicine name" />
                        </Form.Item>
                    </Col>
                    <Col span={8} lg={8}>
                        <Form.Item
                            name="strength"
                            label="Strength"
                            labelCol={{ span: 24 }}
                            required={false}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <InputNumber min={0} placeholder="In mg" />
                        </Form.Item>
                    </Col>

                    <Col span={3} lg={3} sm={8}>
                        <Form.Item
                            name="dosage"
                            label="Dosage"
                            labelCol={{ span: 24 }}
                            required={false}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Input type="text" placeholder="1" />
                        </Form.Item>
                    </Col>
                    <Col span={7} lg={7} sm={16}>
                        <Form.Item
                            name="type"
                            required={false}
                            label=" "
                            labelCol={{ span: 24 }}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Select showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="tablet">
                                <Option value="tablet">Tablet(s)</Option>
                                <Option value="injection">Injection(s)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={7} lg={7} sm={12}>
                        <Form.Item
                            name="route"
                            required={false}
                            label=" "
                            labelCol={{ span: 24 }}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Select showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="oral">
                                <Option value="oral">Oral</Option>
                                <Option value="injection">Injection</Option>
                                <Option value="drip">Drip</Option>
                                <Option value="nasal">Nasal</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={7} lg={7} sm={12}>
                        <Form.Item
                            name="doses"
                            required={false}
                            label=" "
                            labelCol={{ span: 24 }}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >

                            <Select showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="once a day">
                                <Option value="once a day">Once a day</Option>
                                <Option value="twice a day">Twice a day</Option>
                                <Option value="thrice a day">Thrice a day</Option>
                                <Option value="as required">as required</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={11} lg={11} sm={10}>
                        <Form.Item
                            name="occurrence"
                            label="Frequency"
                            labelCol={{ span: 24 }}
                            required={false}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Select showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="Before breakfast">
                                <Option value="before breakfast">Before breakfast</Option>
                                <Option value="after breakfast">After breakfast</Option>
                                <Option value="before meal">Before meal</Option>
                                <Option value="after meal">After meal</Option>
                                <Option value="before dinner">Before dinner</Option>
                                <Option value="after dinner">After dinner</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={3} lg={3} sm={10}>
                        <Form.Item
                            name="frequencyPeriod"
                            required={false}
                            label=" "
                            labelCol={{ span: 24 }}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                    </Col>
                    <Col span={10} lg={10}>
                        <Form.Item
                            name="frequency"
                            required={false}
                            label=" "
                            labelCol={{ span: 24 }}
                            rules={[{
                                required: true,
                                message: `required`
                            }]}
                        >
                            <Select showSearch
                                optionFilterProp="children"
                                filterOption={true}
                                placeholder="day(s)">
                                <Option value="day(s)">Day(s)</Option>
                                <Option value="week(s)">Week(s)</Option>
                                <Option value="month(s)">Month(s)</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={24} lg={24}>
                        <Form.Item
                            name="details"
                            required={false}
                            label="Details"
                            labelCol={{ span: 24 }}
                            rules={[{
                                required: false,
                                message: `required`
                            }]}
                        >
                            <Input type="text" placeholder="Details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" >{addNew ? "Add Medication" : "Update"}</Button>
            </Form>
        )
    }

    const RenderMenu = () => {
        return (
            <>

                <ul style={{ margin: "0", padding: "0", listStyleType: "none", overflowY: "scroll", maxHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {Object.keys(medicineStore).map((idx) => {
                        const id = parseInt(idx)
                        return (
                            <MenuListItem
                                key={id}
                                valid={medicineStore[id].valid}
                                selected={parseInt(id) === medicineNumber}
                                onClick={() => {
                                    setCurrentMedicine(medicineStore[id].formData)
                                    setMedicineNumber(parseInt(id))
                                    setAddMedicineStatus(false)
                                    setAddNew(false)
                                }}
                                text={medicineStore[id].formData.drugName}
                            // TODO: valid - invalid - unupdated
                            // style={medicineStore[id].valid !== null ? medicineStore[id].valid ? { color: "green" } : { color: "red" } : { color: "yellow" }}
                            />
                        )
                    })}
                    {addNew && <MenuListItem selected={true} valid="none" id="newMed" />}
                </ul>
            </>
        )
    }

    const [modalView, setModalView] = useState(false)
    const showModalView = () => {
        setModalView(true)
    }

    const showModalViewOnCancel = () => {
        setModalView(false)
    }

    return (
        <div style={{ height: "100%", width: "100%", }}>
            <Prompt when={unsavedChanges} message={() => {
                showModalView()
                return true
            }} />
            {/* Header */}
            <Modal
                width="60%"
                visible={modalView}
                onCancel={showModalViewOnCancel}
                centered
                footer={null}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <h1 style={{
                        fontWeight: 600,
                        fontSize: "22px",
                        color: "#000000",
                    }}
                    >
                        There are unsaved changes!! Are you sure you want to leave?
                    </h1>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Tooltip placement="top" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title={"Go back and save medication"}>
                            <Button
                                onClick={showModalViewOnCancel}
                                type="secondary-outlined"
                                style={{ margin: "0 1rem", minWidth: "145px" }}
                            >
                                {"No"}
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title={"Proceed without saving"}>
                            <Button
                                onClick={() => setEmrView(<EmrView pid={pid} setPadding={setPadding} setEmrView={setEmrView} defaulState={"subgroup-3-element-1"} />)}
                                type="primary"
                                style={{ margin: "0 1rem", minWidth: "145px" }}
                            >
                                {"Yes"}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Modal>

            <Row style={{ borderLeft: "solid 1px rgba(0, 0, 0, 0.1)", borderBottom: "solid 1px rgba(0, 0, 0, 0.1)" }}>
                <Col
                    lg={1} md={1}
                    style={{ padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    onClick={() => { unsavedChanges ? showModalView() : setEmrView(<EmrView pid={pid} setPadding={setPadding} setEmrView={setEmrView} defaulState={"subgroup-3-element-1"} />) }}
                >
                    {Icons.leftArrowFilled({})}
                </Col>
                <Col lg={7} md={7} style={{ padding: "12px" }}>
                    <Row>
                        <Col span={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Avatar style={{ border: "solid 1px #8C97F2", backgroundColor: "#fff", verticalAlign: 'middle' }} size="large" gap={4}>
                                <span style={{ color: "#8C97F2" }}>
                                    {patient["demographic_map"]["fname"][0]}
                                </span>
                            </Avatar>
                        </Col>
                        <Col span={18}>
                            <Row>
                                <Col span={24} style={{ fontSize: "20px", color: "#000000" }}>
                                    {createName(patient["demographic_map"]["title"], patient["demographic_map"]["fname"], patient["demographic_map"]["mname"], patient["demographic_map"]["lname"])}
                                </Col>
                                <Col span={24} style={{ fontSize: "16px", color: "#a8a8a8", letterSpacing: "0.1em" }}>
                                    {patient["demographic_map"]["med_record"]}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col lg={10} md={12} style={{ padding: "12px", fontSize: "35px", color: "#000000" }}>
                    Create Prescription
                </Col>
                <Col lg={6} md={4} style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}>
                    <p style={{
                        display: "inline-block",
                        margin: "0",
                        marginRight: "1rem",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "18px",
                        color: "#000000",
                    }}>TxnDate:</p>
                    <DatePicker onChange={(date, datestring) => { setCalendarDate(datestring) }} />
                </Col>

            </Row>
            <Row style={{ padding: "12px", height: "90%" }}>
                <Col style={{ paddingTop: "1rem", display: 'flex', flexDirection: "column", justifyContent: "space-between" }} md={6} lg={4}>
                    <RenderMenu />
                </Col>
                {!addMedicineStatus ? (
                    <>
                        <Col style={{ padding: "1rem", }} md={9} lg={12}>
                            <RenderForm setUnsavedChanges={setUnsavedChanges} />
                        </Col>
                        <Col style={{ padding: "1rem", }} md={9} lg={8}>
                            <RenderSearchMedicineForm />
                        </Col>
                    </>
                ) : (
                    <Col style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }} md={18} lg={20}>
                        <div style={{ width: "80%", height: "80%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <h1 style={{
                                fontSize: "18px",
                                color: "#000000",
                                margin: "0",
                                marginBottom: "5%"
                            }}
                            >
                                Want to add more medicines to the list?
                            </h1>
                            <div
                                style={{
                                    width: "60%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Tooltip placement="top" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title={"Add another medicine"}>
                                    <Button
                                        disabled={!addMedicineStatus}
                                        onClick={() => {
                                            setAddMedicineStatus(!addMedicineStatus)
                                            setAddNew(true)
                                            setCurrentMedicine(null)
                                            setMedicineNumber(Object.keys(medicineStore).length)
                                        }}
                                        type="secondary-outlined"
                                    >
                                        {"+ Add"}
                                    </Button>
                                </Tooltip>
                                <Tooltip placement="top" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title={"By clicking here, you make a prescription which has all the medicines you saved just now"}>
                                    <Button disabled={addNew} onClick={savePrescriptions} type="primary">
                                        {"Prescribe Medication"}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </Col>
                )}
            </Row>
        </div >
    )
}
