import React, { useState, useEffect, useRef } from 'react';

import moment from "moment";

import { isArray } from 'lodash';
import { isJsonString } from "../../../Utils/utils";
import { useHistory } from "react-router-dom";
import { InfluxDB } from "@influxdata/influxdb-client";

import {
    Input as Inputs,
    Select, DatePicker, Table, Row, Button, Spin
} from "antd";

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

    const history = useHistory();

    const getDataBillingSummary = () => {
        billingApi.getBillingSummary(moment(valueDate).format("YYYY-MM-DD"), currentPageVal, valSearch)
            .then((res) => {
                const newArrPid = [];
                const result = {
                    billings: [],
                    patchData: []
                };
                const billingData = res?.data?.response?.billingData || [];

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
                            if(!isArray(arrayData)) arrayData = [];
        
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
        }
    }, [patientType]);

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
    }

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
            }
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
            }
        },
        {
            title: '99453',
            dataIndex: "99453",
            key: "99453",
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
                    />
                )
            }
        },
        {
            title: '99457',
            dataIndex: "99457",
            key: "99457",
            align: "center",
            render: (dataIndex) => {
                if (isJsonString(dataIndex)) {
                    let arrayData = JSON.parse(dataIndex);
                    let tmpTime = 0;

                    if(!isArray(arrayData)) arrayData = [];

                    if(arrayData.length > 0) {
                        arrayData.map(item => {
                            tmpTime += Number(item.task_time_spend);
                        })
                    }

                    return (
                        <div>{renderTimeDisplay(tmpTime)}</div>
                    )
                }
            }
        },
        {
            title: '99458',
            dataIndex: "99458",
            key: "99458",
            align: "center",
            render: (dataIndex) => {
                if (isJsonString(dataIndex)) {
                    let arrayData = JSON.parse(dataIndex);
                    let tmpTime = 0;

                    if(!isArray(arrayData)) arrayData = [];
                    
                    if(arrayData.length > 0) {
                        arrayData.map(item => {
                            tmpTime += Number(item.task_time_spend);
                        })
                    }

                    return (
                        <div>{renderTimeDisplay(tmpTime)}</div>
                    )
                }
            }
        },
        {
            title: '99091',
            dataIndex: "99091",
            key: "99091",
            align: "center",
            render: (dataIndex) => {
                if (isJsonString(dataIndex)) {
                    let arrayData = JSON.parse(dataIndex);
                    let tmpTime = 0;

                    if(!isArray(arrayData)) arrayData = [];
                    
                    if(arrayData.length > 0) {
                        arrayData.map(item => {
                            tmpTime += Number(item.task_time_spend);
                        })
                    }

                    return (
                        <div>{renderTimeDisplay(tmpTime)}</div>
                    )
                }
            }
        },
        {
            title: 'Edit',
            key: 'edit',
            align: "center",
            width: 130,
            render: () => {
                return (
                    <div>
                        <Button type="secondary" disabled={true}>
                            Edit
                        </Button>
                    </div>
                )
            }
        },
        {
            title: 'Details',
            key: 'detail',
            align: "center",
            width: 130,
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
            width: 130,
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
            width: 130,
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
            <ModalSummary pid={pidModalSummary} onClose={onCloseModalSummary} currentDate={valueDate} />

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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "calc(100vh - 99px)"}}>
                        <Spin />
                    </div>
                ) : (
                    <div style={{ margin: "30px 2%", width: "100%" }}>
                        <Table
                            style={{ backgroundColor: "blue" }}
                            columns={columns}
                            size="middle"
                            pagination={false}
                            dataSource={!!patientType ? billingsFilter || [] : billingSummary?.billings || []}
                        />
                    </div>
                )}
            </Row>
        </div>
    );
}

export default BillingModule;
