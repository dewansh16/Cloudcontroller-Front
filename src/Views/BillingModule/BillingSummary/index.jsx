import React, { useState, useEffect, useRef } from 'react';

import moment from "moment";

import { isArray } from 'lodash';
import { isJsonString, CPT_CODE, CPT } from "../../../Utils/utils";
import { useHistory } from "react-router-dom";
import { InfluxDB } from "@influxdata/influxdb-client";

import {
    Input as Inputs,
    Select, DatePicker, Table, Row, Button, Spin,
    // notification
} from "antd";

import Icons from "../../../Utils/iconMap";
import billingApi from "../../../Apis/billingApis";

import Navbar from "../../../Theme/Components/Navbar/navbar";
import { PaginationBox, computeTotalPages } from "../../Components/PaginationBox/pagination";
import ModalSummary from "./ModalSummary";
import CheckData from "./CheckData99454";

import "./report.css";

const { Search } = Inputs;
const { Option } = Select;

const BillingModule = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [valSearch, setValSearch] = useState("");
    const [patientType, setPatientType] = useState("");
    const [valueDate, setValueDate] = useState(new Date());

    const [pidModalSummary, setPidModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [billingSummary, setBillingSummary] = useState(null);
    const [billingsFilter, setBillingsFilter] = useState([]);
    const [pidEdit, setPidEdit] = useState(null);
    const [respondBillingData, setRespondBillingData] = useState([]);
    const [isEditRow, setIsEditRow] = useState(false);
    const itemPerPage = 10;


    const history = useHistory();
    let val99457 = 0;
    let val99458 = 0;
    let val99091 = 0;

    const TASK_NOTE_DEFAULT =  "Update from total summary";
    const updateBillingTaskToDb = async (updateData) => {
        return new Promise((resolve, reject) => {billingApi
                        .updateBillingTask(
                            updateData
                        )
                        .then((res) => {
                            resolve(true);
                        })
                        .catch((err) => {
                            resolve(false);
                        });
                    })
    }
    const addBillingTaskToDb = async (updateData) => {
        return new Promise((resolve, reject) =>{
            billingApi
                    .addBillingTask(
                        updateData
                    )
                    .then((res) => {
                        resolve(true);
                    })
                    .catch((err) => {
                        resolve(false);
                    });
        })
    }
    const updateBillingTask = async (pidEdit) => {
        let findDataByPid = billingSummary.billings.filter(item => item.pid == pidEdit);
        let date = new Date(`${valueDate}-20`);
        let date_string = date.toISOString();
        const user = JSON.parse(localStorage.getItem("user"));
        let isReloadData = false;
        if(findDataByPid.length > 0) {
            findDataByPid = findDataByPid[0];
            let task99457 = findDataByPid[CPT_CODE.CPT_99457];
            let task99458 = findDataByPid[CPT_CODE.CPT_99458];
            let task99091 = findDataByPid[CPT_CODE.CPT_99091];
            let currentTotalTime99458 = 0;
            let currentTotalTime99457 = 0;
            let currentTotalTime99091 = 0;
            if(task99457){
                task99457 = JSON.parse(task99457);
                task99457.map(item => {
                    currentTotalTime99457 += Number(item.task_time_spend);
                })
                let billingDataDetailForCode = respondBillingData.filter(item => item.pid == pidEdit && item.code == CPT_CODE.CPT_99457);
                if(billingDataDetailForCode.length > 0){
                    billingDataDetailForCode = billingDataDetailForCode[0];
                }
                if(val99457 > currentTotalTime99457 && billingDataDetailForCode.id){   
                    let updateData = {
                        code: CPT_CODE.CPT_99457,
                        bill_date: date_string,
                        pid: pidEdit,
                        billing_id: billingDataDetailForCode.id,
                        task_date: date_string,
                        staff_name: user.userName,
                        add_task_note: TASK_NOTE_DEFAULT,
                        task_time_spend: val99457 - currentTotalTime99457
                    }
                    let rs = await updateBillingTaskToDb(updateData);
                    if(rs) isReloadData = true;
                }
            } else {
                if(val99457 > 0){   
                    let updateData = {
                        code_type: CPT,
                        code: CPT_CODE.CPT_99457,
                        bill_date: date_string,
                        pid: pidEdit,
                        revenue_code: 123,
                        notecodes: "pending",
                        bill_process: 0,
                        fee: 40,
                        add_task_id: date.getTime(),
                        add_task_date: date_string,
                        add_task_staff_name: user.userName,
                        add_task_note: TASK_NOTE_DEFAULT,
                        task_time_spend: val99457 - 0
                    }
                    let rs = await addBillingTaskToDb(updateData);
                    if(rs) isReloadData = true;
                }
            }
            if(task99458){
                task99458 = JSON.parse(task99458);
                task99458.map(item => {
                    currentTotalTime99458 += Number(item.task_time_spend);
                })

                let billingDataDetailForCode99458 = respondBillingData.filter(item => item.pid == pidEdit && item.code == CPT_CODE.CPT_99458);
                if(billingDataDetailForCode99458.length > 0){
                    billingDataDetailForCode99458 = billingDataDetailForCode99458[0];
                }
                if(val99458 > currentTotalTime99458 && billingDataDetailForCode99458.id){   
                    let updateData = {
                        code: CPT_CODE.CPT_99458,
                        bill_date: date_string,
                        pid: pidEdit,
                        billing_id: billingDataDetailForCode99458.id,
                        task_date: date_string,
                        staff_name: user.userName,
                        add_task_note: TASK_NOTE_DEFAULT,
                        task_time_spend: val99458 - currentTotalTime99458
                    }
                    let rs = await updateBillingTaskToDb(updateData);
                    if(rs) isReloadData = true;
                }
            } else {
                if(val99458 > 0){   
                    let updateData = {
                        code_type: CPT,
                        code: CPT_CODE.CPT_99458,
                        bill_date: date_string,
                        pid: pidEdit,
                        revenue_code: 123,
                        notecodes: "pending",
                        bill_process: 0,
                        fee: 40,
                        add_task_id: date.getTime(),
                        add_task_date: date_string,
                        add_task_staff_name: user.userName,
                        add_task_note: TASK_NOTE_DEFAULT,
                        task_time_spend: val99458 - 0
                    }
                    let rs = await addBillingTaskToDb(updateData);
                    if(rs) isReloadData = true;
                }
            }
            if(task99091){
                task99091 = JSON.parse(task99091);
                task99091.map(item => {
                    currentTotalTime99091 += Number(item.task_time_spend);
                })
                let billingDataDetailForCode99091 = respondBillingData.filter(item => item.pid == pidEdit && item.code == CPT_CODE.CPT_99091);
                if(billingDataDetailForCode99091.length > 0){
                    billingDataDetailForCode99091 = billingDataDetailForCode99091[0];
                }
                if(val99091 > currentTotalTime99091 && billingDataDetailForCode99091.id){   
                    let updateData = {
                        code: CPT_CODE.CPT_99091,
                        bill_date: date_string,
                        pid: pidEdit,
                        billing_id: billingDataDetailForCode99091.id,
                        task_date: date_string,
                        staff_name: user.userName,
                        task_note: TASK_NOTE_DEFAULT,
                        task_time_spend: val99091 - currentTotalTime99091
                    }
                    let rs = await updateBillingTaskToDb(updateData);
                    if(rs) isReloadData = true;
                }
            } else {
                if(val99091 > 0){   
                    let updateData = {
                        code_type: CPT,
                        code: CPT_CODE.CPT_99091,
                        bill_date: date_string,
                        pid: pidEdit,
                        revenue_code: 123,
                        notecodes: "pending",
                        bill_process: 0,
                        fee: 40,
                        task_id: date.getTime(),
                        date: date_string,
                        staff_name: user.userName,
                        task_note: TASK_NOTE_DEFAULT,
                        task_time_spend: val99091 - 0
                    }
                    let rs = await addBillingTaskToDb(updateData);
                    if(rs) isReloadData = true;
                }
            }
        }
        val99457 = 0;
        val99458 = 0;
        val99091 = 0;
        if(isReloadData) getDataBillingSummary();
    }

    const getDataBillingSummary = () => {
        billingApi.getBillingSummary(moment(valueDate).format("YYYY-MM-DD"), itemPerPage * (currentPageVal - 1), valSearch, itemPerPage)
            .then((res) => {
                const newArrPid = [];
                const result = {
                    billings: [],
                    patchData: []
                };
                const billingData = res?.data?.response?.billingData || [];
                const totalItemCount = res?.data?.response?.count;
                let totalPagesCal = Math.floor(totalItemCount / itemPerPage);
                if(totalItemCount % itemPerPage != 0){
                    totalPagesCal = totalPagesCal + 1;
                }
                setRespondBillingData(billingData); 
                setTotalPages(totalPagesCal);
                if (billingData?.length > 0) {
                    for (let index = 0; index < billingData.length; index++) {
                        const billing = billingData[index];
                        if (!!billing?.pid && !!billing?.patient_datum) {
                            if (!newArrPid.includes(billing.pid)) {
                                newArrPid.push(billing.pid);
                                result.billings.push({ ...billing, [billing?.code]: billing?.params });
                            } else {
                                const billingFound = result.billings.find(item => item?.pid === billing?.pid);
                                billingFound[billing.code] = billing.params;
                            }
                        }
                    }
                    result.patchData = res?.data?.response?.patchData || [];
                }

                setLoading(false);
                setBillingSummary(result);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setBillingSummary(null);
            })
    };

    useEffect(() => {
        setLoading(true);
        getDataBillingSummary();
    }, [valueDate, currentPageVal, valSearch]);

    const arrayCPT = [
        {
            code: 99457,
            number: 1200
        },
        {
            code: 99458,
            number: 2400
        },
        {
            code: 99091,
            number: 1800
        },
    ]

    useEffect(() => {
        if (!!patientType) {
            let newArrBillings = [];
            const billings = billingSummary?.billings || [];
            if (patientType === "readings") {
                billings?.map(billing => {
                    if (Number(billing.total) < 16 || billing.total === undefined || billing.total === null) {
                        newArrBillings.push(billing);
                    };
                });
            }

            if (patientType === "minutes") {
                newArrBillings = billings;
                billings?.map((billing, index) => {
                    arrayCPT.map(cpt => {
                        if (isJsonString(billing?.[cpt.code])) {
                            let arrayData = JSON.parse(billing?.[cpt.code]);
                            if (!isArray(arrayData)) arrayData = [];

                            let tmpTime = 0;
                            arrayData.map(item => {
                                tmpTime += Number(item.task_time_spend);
                            })

                            if (tmpTime >= cpt.number) {
                                newArrBillings.splice(index, 1)
                            }
                        }
                    });
                });
            }

            setBillingsFilter(newArrBillings);
            setLoading(false);
        } else {
            setBillingSummary(billingSummary);
        }
    }, [billingSummary]);

    const changeValue = (cptCode, oldValue, e) => {
        let currentVl = e.target.value;
        let currentArrVl = currentVl.split(":");
        currentArrVl = Number(currentArrVl[0])*60 + Number(currentArrVl[1]);
        if(cptCode == CPT_CODE.CPT_99457){
            val99457 = currentArrVl;
        }
        if(cptCode == CPT_CODE.CPT_99458){
            val99458 = currentArrVl;
        }
        if(cptCode == CPT_CODE.CPT_99091){
            val99091 = currentArrVl;
        }
    }
    const renderTimeDisplay = (time) => {
        let hours = Math.floor(time / 3600)
        let minutes = Math.floor(time / 60) % 60
        let seconds = time % 60
        let timeDs = [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        return timeDs;
    };

    const onOpenModalSummary = (pid) => {
        setPidModal(pid);
    };

    const onCloseModalSummary = () => {
        setPidModal(null);
    };

    const handleMonthChange = (date, dateString) => {
        setValueDate(dateString);
        const currentDate = new Date();
        const currentYearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? "0" : ""}${currentDate.getMonth() + 1}`;
        setIsEditRow(currentYearMonth != dateString);
    }

    const getTotalTimeTaskSpend = (dataIndex) => {
        return dataIndex;
    };

    const columns = [
        {
            title: 'P.No',
            dataIndex: "patient_datum",
            key: "patient_name",
            width: 250,
            render: (dataIndex) => {
                return (
                    <div>{`${dataIndex.fname} ${dataIndex.lname}`}</div>
                )
            },
            sorter: (a, b) => {
                if(a.patient_datum.fname < b.patient_datum.fname) { return 1; }
                if(a.patient_datum.fname > b.patient_datum.fname) { return -1; }
            },
        },
        {
            title: 'MR.No',
            dataIndex: "patient_datum",
            key: "med_record",
            width: 200,
            render: (dataIndex) => {
                return (
                    <div>{dataIndex.med_record}</div>
                )
            },
            sorter: (a, b) => {
                if(a.patient_datum.med_record < b.patient_datum.med_record) { return 1; }
                if(a.patient_datum.med_record > b.patient_datum.med_record) { return -1; }
            },
        },
        {
            title: '99453',
            dataIndex: "task_99453",
            key: "task_99453",
            align: "center",
            render: (dataIndex) => {
                if (!!dataIndex && isJsonString(dataIndex)) {
                    return (
                        <div>Enable</div>
                    )
                }

                return (
                    <div>Disable</div>
                )
            }
        },
        {
            title: '99454',
            dataIndex: "sensorList",
            key: "99454",
            render: (dataIndex, record) => {
                const associated = billingSummary?.patchData?.filter(item => item?.pid === record?.pid);
                return (
                    <CheckData
                        pid={record?.pid}
                        sensorList={associated}
                        patientType={patientType}
                        billingSummary={billingSummary}
                        setLoadingParent={setLoading}
                        valueDate={valueDate}
                    />
                )
            },
            sorter: (a, b) => {
                if(a.total < b.total) { return 1; }
                if(a.total > b.total) { return -1; }
            },
        },
        {
            title: '99457',
            dataIndex: "task_99457",
            key: "99457",
            align: "center",
            render: (dataIndex, record) => {
                const tmpTime = getTotalTimeTaskSpend(dataIndex);

                if (pidEdit === record?.pid) {
                    return <Inputs
                        onChange={(e) => changeValue(CPT_CODE.CPT_99457, tmpTime, e)}
                        style={{ width: "63px" }}
                        defaultValue={renderTimeDisplay(tmpTime)}
                    />
                } else if (tmpTime > 0) {
                    return (
                        <div>{renderTimeDisplay(tmpTime)}</div>
                    )
                }
            },
            sorter: (a, b) => {
                const aTime = getTotalTimeTaskSpend(a?.["99457"]);
                const bTime = getTotalTimeTaskSpend(b?.["99457"]);

                if(aTime < bTime) { return 1; }
                if(aTime > bTime) { return -1; }
            },
        },
        {
            title: '99458',
            dataIndex: "task_99458",
            key: "task_99458",
            align: "center",
            render: (dataIndex, record) => {
                const tmpTime = getTotalTimeTaskSpend(dataIndex);

                // let tmpTime = 0;
                // if (isJsonString(dataIndex)) {
                //     let arrayData = JSON.parse(dataIndex);
                //     if (!isArray(arrayData)) arrayData = [];

                //     if (arrayData.length > 0) {
                //         arrayData.map(item => {
                //             tmpTime += Number(item.task_time_spend);
                //         })
                //     }
                // }

                if (pidEdit === record?.pid) {
                    return <Inputs
                        onChange={(e) => changeValue(CPT_CODE.CPT_99458, tmpTime, e)}
                        style={{ width: "63px" }}
                        defaultValue={renderTimeDisplay(tmpTime)}
                    />
                } else if (tmpTime > 0) {
                    return (
                        <div>{renderTimeDisplay(tmpTime)}</div>
                    )
                }
            },
            sorter: (a, b) => {
                const aTime = getTotalTimeTaskSpend(a?.["99458"]);
                const bTime = getTotalTimeTaskSpend(b?.["99458"]);

                if(aTime < bTime) { return 1; }
                if(aTime > bTime) { return -1; }
            },
        },
        {
            title: '99091',
            dataIndex: "task_99091",
            key: "task_99091",
            align: "center",
            render: (dataIndex, record) => {
                const tmpTime = getTotalTimeTaskSpend(dataIndex);
                // let tmpTime = 0;
                // if (isJsonString(dataIndex)) {
                //     let arrayData = JSON.parse(dataIndex);
                //     if (!isArray(arrayData)) arrayData = [];

                //     if (arrayData.length > 0) {
                //         arrayData.map(item => {
                //             tmpTime += Number(item.task_time_spend);
                //         })
                //     }
                // }

                if (pidEdit === record?.pid) {
                    return <Inputs
                        onChange={(e) => changeValue(CPT_CODE.CPT_99091, tmpTime, e)}
                        style={{ width: "63px" }}
                        defaultValue={renderTimeDisplay(tmpTime)}
                    />
                } else if (tmpTime > 0) {
                    return (
                        <div>{renderTimeDisplay(tmpTime)}</div>
                    )
                }
            },
            sorter: (a, b) => {
                const aTime = getTotalTimeTaskSpend(a?.["99091"]);
                const bTime = getTotalTimeTaskSpend(b?.["99091"]);

                if(aTime < bTime) { return 1; }
                if(aTime > bTime) { return -1; }
            },
        },
        {
            title: 'Edit',
            key: 'edit',
            align: "center",
            width: 120,
            render: (dataIndex, record) => {
                return (
                    isEditRow && (
                    <div>
                        {pidEdit === record?.pid ? (
                            <Button type="secondary" disabled={false} onClick={() => {
                                updateBillingTask(pidEdit);
                                setPidEdit(null);
                            }}>
                                Save
                            </Button>
                        ) : (
                            <Button type="secondary" disabled={false} onClick={() => {
                                let edit = record?.pid;
                                if (edit === pidEdit) { edit = null };
                                setPidEdit(edit);
                            }}>
                                Edit
                            </Button>
                        )}
                    </div>
                    )
                )
            }
        },
        {
            title: 'Details',
            key: 'detail',
            align: "center",
            width: 120,
            render: (dataIndex, record) => {
                const patient = record?.patient_datum || {};
                return (
                    <div>
                        <Button
                            type="secondary"
                            onClick={() => {
                                history.push({
                                    pathname: `/dashboard/patient/${record.pid}/billingmodule`,
                                    state: {
                                        pid: record.pid,
                                        name:
                                            `${patient.title === undefined
                                                ? ""
                                                : patient.title}`
                                            + " " +
                                            patient.fname
                                            + " " +
                                            patient.lname,
                                        mr: patient.med_record,
                                        phone: patient.phone_contact,
                                        dob: patient.DOB,
                                    },
                                })
                            }}
                        >
                            Detail
                        </Button>
                    </div>
                )
            }
        },
        {
            title: 'Create',
            key: 'create',
            align: "center",
            width: 120,
            render: (dataIndex, record) => {
                return (
                    <div>
                        <Button type="secondary" onClick={() => onOpenModalSummary(record?.pid)}  >
                            Create
                        </Button>
                    </div>
                )
            }
        },
        {
            title: 'Submit',
            key: 'submit',
            align: "center",
            width: 120,
            render: () => {
                return (
                    <div>
                        <Button type="secondary" disabled={true}>
                            Submit
                        </Button>
                    </div>
                )
            }
        },
    ];

    return (
        <div>
            <ModalSummary pid={pidModalSummary} onClose={onCloseModalSummary} currentDate={valueDate} billingSummary={billingSummary?.billings} />

            <div>
                <Navbar
                    startChildren={
                        <>
                            <div className="user-header-heading">
                                <p>Billing Summary</p>
                            </div>
                            <Search
                                enterButton
                                allowClear
                                placeholder="Search billing"
                                onSearch={(val) => setValSearch(val)}
                                defaultValue={valSearch}
                            />
                        </>

                    }
                    centerChildren={
                        <>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center"
                                }}
                            >
                                <h3 style={{ marginRight: "1rem", marginBottom: "0" }}>Patient: </h3>
                                <Select
                                    defaultValue=""
                                    style={{ width: "100%", minWidth: "11rem" }}
                                    onSelect={(val) => {
                                        if (val !== patientType) {
                                            setLoading(true);
                                            setPatientType(val);
                                            getDataBillingSummary();
                                        }
                                    }}
                                    onClear={() => {
                                        setLoading(true);
                                        setPatientType("");
                                        getDataBillingSummary();
                                    }}
                                    allowClear={true}
                                >
                                    <Option value="minutes">Unfulfilled minutes</Option>
                                    <Option value="readings">Unfulfilled readings</Option>
                                </Select>
                            </div>

                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    marginLeft: "2rem"
                                }}
                            >
                                <h3 style={{ marginRight: "1rem", marginBottom: "0" }}>Date: </h3>
                                <DatePicker
                                    onChange={handleMonthChange}
                                    allowClear={false}
                                    picker="month"
                                    defaultValue={moment(valueDate, "YYYY-MM-DD")}
                                    style={{ minWidth: "10rem" }}
                                />
                            </div>
                        </>
                    }
                    endChildren={
                        <>
                            <PaginationBox
                                totalPages={totalPages}
                                currentPageVal={currentPageVal}
                                setCurrentPageVal={setCurrentPageVal}
                            />
                        </>
                    }
                />
            </div>

            <Row
                className="billing-summary-table"
                justify="start"
                style={{ padding: "0", backgroundColor: "white", margin: "4px" }}
            >
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "calc(100vh - 99px)" }}>
                        <Spin />
                    </div>
                ) : (
                    <div style={{ margin: "0 2% 15px 2%", width: "100%" }}>
                        <Table
                            style={{ backgroundColor: "#ffffff" }}
                            columns={columns}
                            size="middle"
                            pagination={false}
                            dataSource={!!patientType ? billingsFilter || [] : billingSummary?.billings || []}
                            scroll={{ y: "calc(100vh - 190px)" }}
                        />
                    </div>
                )}
            </Row>
        </div>
    );
}

export default BillingModule;
