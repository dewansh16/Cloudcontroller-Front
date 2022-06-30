import React, { useState } from 'react';

import { Button, Col, DatePicker, Input, Row, Select, Spin, Table } from 'antd';

import {
    CaretRightOutlined,
    CaretDownOutlined,
} from "@ant-design/icons";

import Navbar from '../../Theme/Components/Navbar/navbar';
import { PaginationBox } from '../Components/PaginationBox/pagination';

import Icons from '../../Utils/iconMap';

import ChartCPTCode from "./component/ChartCPTCode";
import BulbIcon from "./component/BulbIcon";
import TotalReading from './component/TotalReading';

import "./styles.css";
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

const CareDashboard = () => {
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [valuePageLength, setValuePageLength] = useState(25);
    const [patientType, setPatientType] = useState("remote");
    const [valSearch, setValSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [valueDate, setValueDate] = useState(new Date());

    const [careDashboard, setCareDashboard] = useState({
        loading: false,
        dataSource: [{ name: "ok" }]
    });

    const columns = [
        {
            title: "Patient",
            dataIndex: "patient",
            key: "patient",
            width: 50,
            render: () => {
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginLeft: "2px", marginRight: "2px" }}>
                            <BulbIcon />
                        </div>
                        <div style={{ marginLeft: "0.25rem", textAlign: "start" }}>
                            <div style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}>
                                Patient Test
                            </div>

                            <div>
                                {"DOB: Jun 29 2022 (15Y)"}
                            </div>
                            <div>
                                {"Phone: 0355320212"}
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            title: "Primary Practitioner",
            dataIndex: "primary",
            key: "primary",
            width: 100,
            render: () => {
                return (
                    <div>Primary Practitioner</div>
                )
            }
        },
        {
            title: "Secondary Practitioner",
            dataIndex: "secondary",
            key: "secondary",
            width: 100,
            render: () => {
                return (
                    <div>Secondary Practitioner</div>
                )
            },
        },
        // Table.EXPAND_COLUMN,
        {
            title: "Sensor",
            dataIndex: "Sensor",
            key: "Sensor",
            width: 10,
            render: () => {
                return (
                    <span>1 device</span>
                )
            }
        },

        {
            title: "Total reading",
            dataIndex: "total",
            key: "5",
            width: 50,
            align: "center",
            render: (dataIndex, record) => {
                return (
                    <TotalReading
                        pid={record?.pid}
                        associateList={record?.associateList}
                        patientList={careDashboard?.dataSource}
                        valueDate={valueDate}
                    />
                )
            }
        },
        {
            title: "99453",
            dataIndex: "99453",
            key: "6",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: (dataIndex, record) => {
                return (
                    <ChartCPTCode CPT_CODE="99543" />
                )
            }
        },
        {
            title: "99454",
            dataIndex: "99454",
            key: "7",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: (dataIndex, record) => {
                return (
                    <ChartCPTCode CPT_CODE="99454" record={record} />
                )
            }
        },
        {
            title: "99457",
            dataIndex: "99457",
            key: "8",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: () => {
                return (
                    <ChartCPTCode />
                )
            }
        },
        {
            title: "99458",
            dataIndex: "99458",
            key: "9",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: () => {
                return (
                    <ChartCPTCode />
                )
            }
        },
        {
            title: "99091",
            dataIndex: "99091",
            key: "10",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: () => {
                return (
                    <ChartCPTCode />
                )
            }
        },
    ];

    const customExpandIcon = ({ expanded, onExpand, record }) => {
        return (
            <CaretDownOutlined onClick={onExpand} />
        );
    }

    const handleMonthChange = (date) => {
        setValueDate(date);
    }

    console.log("careDashboard", careDashboard);

    return (
        <div>
            <Navbar
                startChildren={
                    <Button type="secondary" className="ant-btn-default global-btn secondary">
                        Refresh {Icons.sync({ Style: { fontSize: "1.257rem" } })}
                    </Button>
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
                            <h3 style={{ marginRight: "1rem", marginBottom: "0" }}>Search: </h3>
                            <Search
                                placeholder="input search text"
                                onSearch={setValSearch}
                                enterButton
                                allowClear
                                defaultValue={valSearch}
                            />
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
                            valuePageLength={valuePageLength}
                            setValuePageLength={setValuePageLength}
                        />
                    </>
                }
            />
            <div style={{ height: "55px", backgroundColor: "white" }}>
                <div
                    style={{
                        margin: "10px 2%",
                        display: "inline-flex",
                    }}
                >
                    <div style={{ display: "inline-flex", alignItems: "center" }}>
                        <h3 style={{ width: "7.5rem", margin: "0" }}>Patient Type: </h3>
                    </div>
                    <Select
                        defaultValue="remote"
                        style={{ width: "9rem", height: '32px' }}
                        onSelect={setPatientType}
                    >
                        <Option value="remote">Remote</Option>
                        <Option value="hospital">Hospital</Option>
                    </Select>
                </div>
            </div>

            {careDashboard?.loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
                    <Spin />
                </div>
            ) : (
                <Row
                    className="table-body care-dashboard-table"
                    justify="start"
                    style={{ padding: "0", backgroundColor: "white", marginTop: "-12px" }}
                >
                    <div style={{ margin: "30px 2%", width: "100%" }}>
                        <Table
                            style={{ backgroundColor: "white" }}
                            columns={columns}
                            size="middle"
                            pagination={false}
                            // scroll={{ y: "calc(100vh - 237px)" }}
                            dataSource={careDashboard?.dataSource}
                        // expandable={{
                        //     expandedRowRender: (record) => {
                        //         console.log(record);
                        //     },
                        //     expandIcon: (props) => customExpandIcon(props)
                        // }}
                        />
                    </div>
                </Row>
            )}
        </div>
    );
}

export default CareDashboard;
