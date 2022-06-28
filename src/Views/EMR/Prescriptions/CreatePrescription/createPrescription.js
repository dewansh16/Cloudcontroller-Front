import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'antd/lib/select';

import { 
    Form, Row, Col, Avatar, notification, Spin, Modal, Tooltip, Switch, List 
} from '../../../../Theme/antdComponents'
import { Input, InputNumber } from '../../../../Theme/Components/Input/input'
import { Button } from '../../../../Theme/Components/Button/button'
import { DatePicker, RangePicker } from '../../../../Theme/Components/DateTimePicker/dateTimePicker'

// import { Select, SelectOption as Option } from '../../../../Theme/Components/Select/select'
// import { MenuListItem, MedicineSearchListItem, MedicineSearchListHeader } from './Components/components'

import Icons from '../../../../Utils/iconMap'
import { createName, EmrView } from '../../EMR'
import { UserStore } from '../../../../Stores/userStore'
import { MedicineListItem } from './Components/components'

import productApi from '../../../../Apis/productApis'
import patientApi from '../../../../Apis/patientApis'
import moment from 'moment';

const { Option } = Select;

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

function AddMedicineToDB({ handleAddDrug, onCancel }) {
    const [addMedForm] = Form.useForm()
    useEffect(() => {
        addMedForm.resetFields()
        return () => {
            addMedForm.resetFields()
        }
    }, [])

    const onFinish = (value) => {
        value["active_ingredient_count"] = 1
        productApi.addProduct(value).then((res) => {
            if (res.status === 200) {
                notification.success({
                    message: "Success",
                    description: res.message
                })
                handleAddDrug(res?.data?.response?.data);
                addMedForm.resetFields();
                onCancel();
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

export default function CreatePrescription({ pid, setComponentSupportContent, setEmrView, patient, setPadding, medicinesList = [] }) {

    const [medicineStore, setMedicineStore] = useState(medicinesList)
    const [medicineIdx, setMedicineIdx] = useState(0)
    const [addNew, setAddNew] = useState(true)
    const [nameType, setNameType] = useState("product_name")
    const [calendarDate, setCalendarDate] = useState(new Date())

    const [searching, setSearching] = useState(false);
    const [source, setSource] = useState(new axios.CancelToken.source());
    const [medicineSearchList, setMedicineSearchList] = useState([]);
    const [loadingDrug, setLoadingDrug] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);

    const [form] = Form.useForm();

    useEffect(() => {
        console.log(medicineStore)
    }, [medicineStore, medicineIdx])

    // const timerLoading = useRef(null);
    // useEffect(() => {
    //     if (loadingPage) {
    //         timerLoading.current = setTimeout(() => {
    //             setLoadingPage(false)
    //         }, 1500);
    //     }
    //     return () => {
    //         clearTimeout(timerLoading.current);
    //     }
    // }, [loadingPage]);

      function SearchMedicine() {
        setLoadingPage(true);
        // const genericName = nameType === "generic_name" ? `${value}` : null
        // const productName = nameType === "product_name" ? `${value}` : null
       
        productApi.getMedicineList("", "", 100, 0, 0, source.token)
            .then((res) => {
                setMedicineSearchList(res.data?.response.products);
                setSearching(false);
                setLoadingPage(false);
            })
            .catch(function (thrown) {
                if (axios.isCancel(thrown)) {
                    setSearching(false)
                } else {
                    setSearching(false);
                }
                setLoadingPage(false);
            });
    }

    useEffect(() => {
        SearchMedicine();
    }, []);

    const savePrescriptions = () => {
        if (medicineStore.length < 1) {
            notification.error({
                message: "Cannot save",
                description: `No medicine added to prescription`
            });
            return
        }

        // setLoadingPage(true);

        const user = UserStore.getUser()

        const timeElapsed = Date.now();
        const today = new Date(timeElapsed).toISOString().slice(0, 10);
        let data = {
            "prescription_uuid": "",
            "pid": pid,
            // current date or input from the calendar
            "date_added": today,
            "date_modified": new Date(calendarDate).toISOString().slice(0, 10),
            "drug": [],
            "active": 1,
            // TODO: add end_data
            "end_date": today,
            "txDate": today,
            "tenant_uuid": user.tenant,
            "id": 1
        }

        let flag = true;

        medicineStore.map((medicine, id) => {
            if (medicine.valid) {
                data["drug"].push(medicine.data)
            } else {
                if (medicine.valid === null) {
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

        if (flag) AddPrescriptions(pid, data, () => {
            setEmrView(<EmrView pid={pid} setPadding={setPadding} setEmrView={setEmrView} defaultState="subgroup-3-element-1" />)
            // setLoadingPage(false);
        })
    }

    const [addMedicineToDatabaseModalVisibility, setAddMedicineToDatabaseModalVisibility] = useState(false)
    const showAddMedicineToDatabaseModal = () => {
        setAddMedicineToDatabaseModalVisibility(true)
    }

    const showAddMedicineToDatabaseModalOnCancel = () => {
        setAddMedicineToDatabaseModalVisibility(false)
    }

    const handleAddDrug = (dataDrug) => {
        const newDataDrug = [dataDrug, ...medicineSearchList];
        setMedicineSearchList([...newDataDrug]);
    }

    return (
        <div style={{ height: "100%", width: "100%", }}>
            <Modal
                width="60%"
                visible={addMedicineToDatabaseModalVisibility}
                onCancel={showAddMedicineToDatabaseModalOnCancel}
                centered
                footer={null}
            >
                <AddMedicineToDB handleAddDrug={handleAddDrug} onCancel={showAddMedicineToDatabaseModalOnCancel} />
            </Modal>

            {/* Header */}
            <Row style={{ borderLeft: "solid 1px rgba(0, 0, 0, 0.1)", borderBottom: "solid 1px rgba(0, 0, 0, 0.1)", padding: "1rem" }}>
                <Col
                    lg={1} md={1}
                    style={{ padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    onClick={() => { setEmrView(<EmrView pid={pid} setPadding={setPadding} setEmrView={setEmrView} defaulState={"subgroup-3-element-1"} />) }}
                >
                    {Icons.leftArrowFilled({})}
                </Col>
                <Col lg={4} md={8} style={{ padding: "12px" }}>
                    <Row>
                        <Col span={24}>
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
                <Col lg={6} md={12} style={{ padding: "12px", fontSize: "35px", color: "#000000", fontWeight: "400" }}>
                    Create Prescription
                </Col>
                <Col lg={8} md={18} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    padding: "0 1rem"
                }}>
                    <Select onChange={(e) => { setNameType(e) }} defaultValue={nameType} bordered={false} suffixIcon={Icons.downArrowFilled({ style: { color: "#1479FF" } })}>
                        <Option value="product_name"><span style={{ color: "#1479FF" }}>Product Name</span></Option>
                        <Option value="generic_name"><span style={{ color: "#1479FF" }}>Generic Name</span></Option>
                    </Select>
                    <div>
                        <p style={{
                            display: "inline-block",
                            margin: "0",
                            marginRight: "1rem",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: "18px",
                            color: "#000000",
                        }}>Date:</p>
                        <DatePicker 
                            format="MMM DD YYYY" 
                            defaultValue={moment(calendarDate, "MMM DD YYYY")}
                            onChange={(date, datestring) => { setCalendarDate(date) }} 
                        />
                    </div>
                </Col>
                <Col lg={4} md={6} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Button onClick={savePrescriptions} style={{ width: "70%" }} type="primary">Save</Button>
                </Col>
            </Row>
            {/* <Row style={{ padding: "12px 3rem", width: "100%" }}>
                <RenderForm idx={medicineIdx} />
            </Row> */}
            {loadingPage ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
                    <Spin />
                </div>
            ) : (
                <Row style={{ padding: "12px", height: "54%", width: "100%" }}>
                    {
                        medicineStore.length > 0 && <List style={{
                            margin: "0", padding: "0", width: "100%", maxHeight: "80vh", overflowY: "scroll"
                        }}>
                            <List.Item
                                style={{
                                    borderRadius: "6px",
                                    margin: "0.5rem 0",
                                    padding: "12px",
                                    border: "none",
                                    width: "100%",
                                    position: "sticky",
                                    top: "0.5rem",
                                    zIndex: 1,
                                    boxShadow:
                                        "0px 25px 10px rgb(255 255 255 / 90%), 0 -25px 10px rgb(255 255 255 / 90%)"

                                }}
                                className="prescription-medicine-list-header"
                            >
                                <Row style={{ width: "100%", marginBottom: "1rem" }} >
                                    <Col span={5}>
                                        Drug Name
                                    </Col>
                                    <Col span={5}>
                                        Dosage
                                    </Col>
                                    <Col span={5}>
                                        Frequency
                                    </Col>
                                    <Col span={5}>
                                        Details
                                    </Col>
                                    <Col span={4} style={{ textAlign: "right" }}>
                                        Actions
                                    </Col>
                                </Row>
                            </List.Item>
                            {medicineStore.map((medicine, id) => {
                                // return <h1 onClick={() => { setMedicineIdx(id); console.log(medicineIdx) }} key={id}>{medicine.data?.drugName}</h1>
                                return <MedicineListItem 
                                    key={id} 
                                    medicine={medicine.data} 
                                    nameType={nameType} idx={id}
                                    searchFieldValue={nameType}
                                    medicineStore={medicineStore} 
                                    setMedicineStore={setMedicineStore}
                                    medicineSearchList={medicineSearchList}
                                    showAddMedicineToDatabaseModal={showAddMedicineToDatabaseModal} 
                                    loadingDrug={loadingDrug}
                                />
                            })}
                        </List>
                    }
                    {
                        !addNew ? (
                            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Button onClick={() => setAddNew(true)} type="utility">{"+ Add New Medicine"}</Button>
                            </div>
                        ) 
                        : <MedicineListItem 
                            showAddMedicineToDatabaseModal={showAddMedicineToDatabaseModal} 
                            nameType={nameType} 
                            setAddNew={setAddNew} 
                            medicineStore={medicineStore} 
                            newMed={true} 
                            idx={medicineStore.length} 
                            setMedicineStore={setMedicineStore} 
                            medicineSearchList={medicineSearchList}
                            loadingDrug={loadingDrug}
                        />
                    }
                </Row>
            )}
        </div >
    )
}
