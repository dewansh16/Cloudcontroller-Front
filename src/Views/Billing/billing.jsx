import React from 'react'
import { useEffect } from 'react';
import Navbar from "../../Theme/Components/Navbar/navbar";
import Icons from "../../Utils/iconMap";
import BillGenerationComponent from "./components/addBill.component";
import { Button } from "../../Theme/Components/Button/button";
import { Table, Tag, DatePicker, Space, Select, Row, Col, Modal, Spin, Menu, Dropdown } from "../../Theme/antdComponents";
import billingApi from '../../Apis/billingApis';
import patientApi from "../../Apis/patientApis";
import moment from 'moment';
import PatientDetails from '../PatientDetails/patientDetails';
function Billing(props) {

    const [isModalVisible, setModalVisibility] = React.useState(false);
    const [filterDate, setFilterDate] = React.useState(moment(new Date()).format('YYYY-MM'));
    const [billingData, setBillingData] = React.useState([]);
    const [patientDetails, setPatientDetails] = React.useState([]);
    const [billingPatientDetails, setBillingPatientDetails] = React.useState([]);
    const [status, setStatus] = React.useState(0);
    const handleCancel = () => {
        setModalVisibility(false);

    }
    const { Option } = Select;
    function onDateChange(date, dateString) {
        setFilterDate(dateString);
    }
    const callCCM = (record) => {
        console.log("Working")
        props.history.push({
            pathname: `/dashboard/patient/${record.key}/billingmodule`,
            state: {
                pid: record.key,
                name: record.patientName,
                mr: record.medRecord,
                phone: record.phone,
                dob: record.dob,
            },
        })

    }
    const callPatient = (pid) => {
        props.history.push(`/dashboard/patient/details/${pid}`)
    }
    useEffect(() => {
        billingApi.getBillingTasks(0, filterDate, status)
            .then((res) => {
                setBillingData(res.data.response.billingData);
                return res.data.response.billingData
            })
            .then((responseData) => {
                const completeDetailsArray = [];
                responseData.map((responseDataHere) => {
                    // response.billingData[0].code_tasks[0].Billing_Information[0].code
                    const codeInfoPath = responseDataHere.code_tasks[0].Billing_Information;
                    const codeInfoLength = (codeInfoPath.length)
                    const PatinetDOB = new Date(responseDataHere.patient_datum.DOB);
                    const PatientAdmissionDate = new Date(responseDataHere.patient_datum.admission_date);
                    const PatientAge = Math.floor((Math.abs(PatientAdmissionDate - PatinetDOB)) / (1000 * 60 * 60 * 24 * 365))
                    let totalTimeConsidered = 0;
                    codeInfoPath.map((singleCodeInfo) => {
                        totalTimeConsidered = totalTimeConsidered + Number(singleCodeInfo.timeConsidered);
                    })
                    totalTimeConsidered = Math.floor(totalTimeConsidered / 60);

                    const dict = {
                        key: responseDataHere.pid,
                        medRecord: responseDataHere.patient_datum.med_record,
                        patientName: responseDataHere.patient_datum.fname + " " + responseDataHere.patient_datum.lname,
                        patientAge: PatientAge,
                        patientEnrollmentMonth: responseDataHere.patient_datum.admission_date.substring(0, 7),
                        patientBillStatus: codeInfoPath[codeInfoLength - 1].code,
                        phone: responseDataHere.patient_datum.phone,
                        dob: responseDataHere.patient_datum.dob,
                        timeConsidered: totalTimeConsidered
                        //    timeConsidered: (codeInfoPath[codeInfoLength-1].date_time).substring(11,19),
                    }
                    completeDetailsArray.push(dict);
                })
                setBillingPatientDetails(completeDetailsArray);
            })
            .catch((err) => { console.log("error"); console.log(err) })
    }

        , [filterDate, status])
    function onCodeChange(value) {
        console.log(`selected ${value}`);
    }
    function onCodeSearch(val) {
        console.log('search:', val);
    }
    function onStatusChange(value) {
        console.log(`status selected ${value}`);
        setStatus(value);
    }
    function onStatusSearch(val) {
        console.log('status:', val);
    }
    // useEffect(() => {
    //     console.log("Use Effect")
    //     console.log(patientDetails)
    //     patientDetails.map((patientDetailsHere, index) => {
    //         console.log(index);
    //         const dict = {
    //             medRecord: "21",
    //             patientName: patientDetailsHere.fname,
    //             patientAge: "32",
    //             patientEnrollmentMonth: "Oct",
    //             patientBillStatus: "Pending",
    //             timeConsidered: "25:10:32",
    //         }

    //     })
    // }, [billingPatientDetails])
    const [mockList, setMockList] = React.useState([
        {
            key: "1",
            serviceName: "Consultation",
            quantity: 1,
            price: 3244,
            amount: 10000,
            paymentStatus: "paid",
            paymentMethod: "cash"
        },
        {
            key: "2",
            serviceName: "Consultation",
            quantity: 2,
            price: 3200,
            amount: 10000,
            paymentStatus: "unpaid",
            paymentMethod: "credit"
        },
        {
            key: "3",
            serviceName: "Consultation",
            quantity: 1,
            price: 3244,
            amount: 10000,
            paymentStatus: "partiallyPaid",
            paymentMethod: "Insurance"
        }
    ])
    const showModal = () => {
        setModalVisibility(true);
    }
    const submitForm = (values) => {
        console.info(values);
        let clonedArray = mockList;
        console.log("cloned array before push", clonedArray)
        clonedArray.push(values);
        console.log("cloned array", clonedArray)
        setMockList(clonedArray);
    }

    // React.useEffect(() => {
    //     console.log("useeffect", mockList)
    // }, [mockList])

    const TagColor = {
        paid: "#06A000",
        unpaid: "#DD4A34",
        partiallyPaid: "#1479FF",
    }
    const StatusTagColor = {
        "99453": "#06A000",
        "99454": "#DD4A34",
        "99457": "#8abcff",
        "99458": "#1479FF",
        "99091": "#f71111",
    }
    const timeColor = (val) => {
        console.log(val)
        if(val<15 || (val>20 && val<35) || (val>40 && val<55)) return "green"
        else if((val>=15 && val<=19) || (val>=35 && val<=39) || (val>=55 && val<=59)) return "red"
        else if(val===20 || val===40 || val===60) return "blue"
        else return "orange"
     }
    const billingColumns = [
        {
            title: "MR",
            dataIndex: "medRecord",
            render: (dataIndex, record) => (

                <button onClick={() => callPatient(record.key)} style={{ padding: "5px 10px" ,  cursor : "pointer" , width : "110px"}}>  
                    {dataIndex}
                </button>
            ),
        },
        {
            title: "Name",
            dataIndex: "patientName",
        },
        {
            title: "Age",
            dataIndex: "patientAge",
        },
        {
            title: "Enrolled Month",
            dataIndex: "patientEnrollmentMonth",
        },
        {
            title: "Bill Status",
            dataIndex: "patientBillStatus",
            sorter: (a, b) => a.patientBillStatus - b.patientBillStatus,
            render: (dataIndex, record) => (
                <div style={{ display: 'flex', justifyContent: "center" }}>
                    <Tag
                        style={{
                            width: "fit-content",
                            color: StatusTagColor[dataIndex],
                            backgroundColor: "whilte",
                            fontSize: "16px",
                            border: `2px solid ${StatusTagColor[dataIndex]}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            padding: "0.25rem 0.5rem"
                        }}
                    // onClick={}
                    >
                        {dataIndex}
                        {/* {record} */}
                    </Tag>
                </div>)
        },
        {
            title: "Time (Minutes)",
            dataIndex: "timeConsidered",
            sorter: (a, b) => a.timeConsidered - b.timeConsidered,
            render: (dataIndex, record) => (
                <div style={{ display: 'flex', justifyContent: "center" }}>
                    <span
                        style={{
                            width: "fit-content",
                            color: timeColor(dataIndex),
                            backgroundColor: "whilte",
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            padding: "0.25rem 0.5rem"
                        }}
                    >
                        {dataIndex}
                    </span>
                </div>)
        },
        {
            title: "CCM",
            dataIndex: "key",
            render: (dataIndex, record) => (

                <button onClick={() => callCCM(record)} style={{padding : "5px 10px" , cursor : "pointer"}}>
                    CCM
                </button>
            ),
        }
    ]
    const columns = [
        {
            title: "Item/Service",
            dataIndex: "serviceName",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
        {
            title: "Price per unit",
            dataIndex: "price",
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            render: (dataIndex, record) => (
                <div style={{ display: 'flex', justifyContent: "center" }}>
                    <Tag
                        style={{
                            width: "fit-content",
                            color: TagColor[dataIndex],
                            backgroundColor: "whilte",
                            fontSize: "16px",
                            border: `2px solid ${TagColor[dataIndex]}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            padding: "0.25rem 0.5rem"
                        }}
                    >
                        {dataIndex}
                    </Tag>
                </div>)
        },
        {
            title: "Payment Type",
            dataIndex: "paymentType",
        },
    ]

    // const mockList = 

    return (
        <>
            {
                console.log("Billing Patient Details")
            }
            {

                console.log(props)
            }

            <section>
                <Navbar
                    startChildren={
                        <h1 style={{ fontSize: "2rem" }}>
                            Billing
                        </h1>
                    }
                    centerChildren={
                        <>
                            {/* <Space direction="horizontal">
                        <h3>CPT code</h3>
                            <Select
                                showSearch
                                placeholder="CPT"
                                optionFilterProp="children"
                                onChange={onCodeChange}
                                onSearch={onCodeSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="jack">99453</Option>
                                <Option value="lucy">99454</Option>
                                <Option value="tom">99457</Option>
                                <Option value="tom">99458</Option>
                            </Select>
                            </Space> */}
                            <Space direction="horizontal">
                                <h3>Current Status</h3>
                                <Select
                                    showSearch
                                    placeholder="Status"
                                    optionFilterProp="children"
                                    onChange={onStatusChange}
                                    onSearch={onStatusSearch}
                                    // style={{padding : "0 20px"}}
                                    // size='large'
                                    // value={status}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value="99453">99453</Option>
                                    <Option value="99454">99454</Option>
                                    <Option value="99457">99457</Option>
                                    <Option value="99458">99458</Option>
                                </Select>
                            </Space>
                        </>
                    }
                    endChildren={
                        <>
                            {/* <Button type="secondary" onClick={showModal}>
                            + Add
                        </Button> */}

                            <Space direction="vertical">
                                <DatePicker onChange={onDateChange} picker="month" size="large" defaultValue={moment(filterDate)} />
                            </Space>
                        </>
                    }
                />
                <BillGenerationComponent
                    isModalVisible={isModalVisible}
                    handleCancel={handleCancel}
                    submitForm={submitForm} />
            </section>
            <section style={{ padding: "1rem 2rem" }}>
                <Table
                    columns={billingColumns}
                    dataSource={billingPatientDetails}
                    size="middle"

                />

            </section>
        </>
    )
}

export default Billing;