import React, { useState, useEffect, useRef } from 'react';

import moment from "moment";
import html2canvas from "html2canvas";

import { jsPDF } from "jspdf";
import { isArray } from 'lodash';
import { isJsonString } from "../../../Utils/utils";
import { useHistory, useLocation } from "react-router-dom";

import {
    Input as Inputs,
    Select, DatePicker, Table, Row, Button
} from "antd";

import billingApi from "../../../Apis/billingApis";

import Navbar from "../../../Theme/Components/Navbar/navbar";
import { PaginationBox, computeTotalPages } from "../../Components/PaginationBox/pagination";
import ModalSummary from "./ModalSummary";

import "./report.css";

const { Search } = Inputs;
const { Option } = Select;

const FetchBillingSummary = (valueDate) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        billingApi.getBillingSummary(moment(valueDate).format("YYYY-MM-DD"))
            .then((res) => {
                const newArrPid = [];
                const arrayResult = [];
                const billingData = res?.data?.response?.billingData || [];

                if (billingData?.length > 0) {
                    for (let index = 0; index < billingData.length; index++) {
                        const billing = billingData[index];
                        if (!!billing?.pid && !!billing?.patient_datum) {
                            if (!newArrPid.includes(billing.pid)) {
                                newArrPid.push(billing.pid);
                                arrayResult.push({ ...billing, [billing?.code]: billing?.params });
                            } else {
                                const billingFound = arrayResult.find(item => item?.pid === billing.pid);
                                billingFound[billing.code] = billing.params;
                            }
                        }
                    }
                }

                setLoading(false);
                setResponse(arrayResult);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setResponse([]);
            })
    }, [valueDate]);

    return [response, loading];
};

const BillingModule = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [valSearch, setValSearch] = useState("");
    const [patientType, setPatientType] = useState("");
    const [valueDate, setValueDate] = useState(new Date());
    const [pidModalSummary, setPidModal] = useState(null);

    const history = useHistory();

    const [billingSummary, isLoading] = FetchBillingSummary(valueDate);

    const renderTimeDisplay = (time) => {
        let hours = Math.floor(time / 3600)
        let minutes = Math.floor(time / 60) % 60
        let seconds = time % 60
        let timeDs = [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        return timeDs;
    }

    const onOpenModalSummary = (pid) => {
        setPidModal(pid);
    };

    const onCloseModalSummary = () => {
        setPidModal(null);
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
            }
        },
        {
            title: 'MR No',
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
            dataIndex: "99454",
            key: "99454",
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
                                    // defaultValue="minutes"
                                    style={{ width: "100%", minWidth: "11rem" }}
                                    onSelect={(val) => setPatientType(val)}
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
                                    // onChange={onChangeDate}
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
                <div style={{ margin: "30px 2%", width: "100%" }}>
                    <Table
                        style={{ backgroundColor: "blue" }}
                        columns={columns}
                        size="middle"
                        pagination={false}
                        dataSource={billingSummary}
                    />
                </div>
            </Row>
        </div>
    );
}

export default BillingModule;
