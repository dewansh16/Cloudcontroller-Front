import React, { useState, } from 'react';
import moment from "moment";

import {
    Input as Inputs,
    Select, DatePicker, Table, Row
} from "antd";

import Navbar from "../../../Theme/Components/Navbar/navbar";
import { PaginationBox, computeTotalPages } from "../../Components/PaginationBox/pagination";

import "./report.css";

const { Search } = Inputs;
const { Option } = Select;

const BillingModule = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [valSearch, setValSearch] = useState("");
    const [patientType, setPatientType] = useState("");
    const [valueDate, setValueDate] = useState(new Date());

    const dataSource = [
        {
            key: '1',
        },
    ];

    const columns = [
        {
            title: 'P.No',
            dataIndex: "patch_type",
            key: "sensorsImage",
            width: 250,
        },

        {
            title: 'MR No',
            dataIndex: "patch_serial",
            key: "lastSeen",
            width: 200,
        },

        {
            title: '99453',
            dataIndex: "patch_status",
            key: "patchStatus",
            align: "center",
        },

        {
            title: '99454',
            dataIndex: "patch_type",
            key: "sensors",
        },
        {
            title: '99457',
            dataIndex: "patch_patient_map",
            key: "patchMap",
            align: "center",
        },

        {
            title: '99458',
            dataIndex: "",
            key: "deleteIcon",
        },
        {
            title: '99091',
            dataIndex: "",
            key: "deleteIcon",
        },
        {
            title: 'Edit',
            key: 'edit',
            align: "center",
            width: 130,
        },
        {
            title: 'Details',
            key: 'detail',
            align: "center",
            width: 130,
        },
        {
            title: 'Create',
            key: 'create',
            align: "center",
            width: 130,
        },
        {
            title: 'Submit',
            key: 'submit',
            align: "center",
            width: 130,
        },
    ];

    return (
        <div>
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
                        dataSource={dataSource}
                    />
                </div>
            </Row>
        </div>
    );
}

export default BillingModule;
