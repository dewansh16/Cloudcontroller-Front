import React, { useState } from 'react';
import {
    Input as Inputs,
    Select, DatePicker, Table, Row, Button, Spin,
    // notification
} from "antd";
import Navbar from '../../../Theme/Components/Navbar/navbar';
import { PaginationBox } from '../../Components/PaginationBox/pagination';
import moment from 'moment';

const { Search } = Inputs;
const { Option } = Select;

const BillingByPratitioner = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [valSearch, setValSearch] = useState("");
    const [patientType, setPatientType] = useState("");
    const [valueDate, setValueDate] = useState(new Date());

    const [billing, setBilling] = useState({
        loading: false,
        dataSource: []
    })

    const handleMonthChange = (date) => {
        setValueDate(date);
    }

    const columns = [
        {
            title: 'Patient',
            dataIndex: "patient_datum",
            key: "patient_name",
            render: (dataIndex) => {
                return (
                    <div>{`${dataIndex.fname} ${dataIndex.lname}`}</div>
                )
            },
        },
        {
            title: "99453",
            dataIndex: "99453",
            key: "99453",
            
        },
        {
            title: "99454",
            dataIndex: "99454",
            key: "99454",
            
        },
        {
            title: "99457",
            dataIndex: "99457",
            key: "99457",
        },
        {
            title: "99458",
            dataIndex: "99458",
            key: "99458",
        },
        {
            title: "99091",
            dataIndex: "99091",
            key: "99091",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
        },
    ];

    return (
        <div>
            <div>
                <Navbar
                    startChildren={
                        <>
                            <div className="user-header-heading">
                                <p>Billing By Pratitioner</p>
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
                {billing?.loading ? (
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
                            dataSource={billing?.dataSource || []}
                            scroll={{ y: "calc(100vh - 190px)" }}
                        />
                    </div>
                )}
            </Row>
        </div>
    );
}

export default BillingByPratitioner;
