import React, { useState, useEffect } from 'react';

import caredashboardApi from "../../Apis/caredashboardApis"

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
import {CPT_CODE} from '../../Utils/utils';
import billingApis from '../../Apis/billingApis';

const { Search } = Input;
const { Option } = Select;

const CareDashboard = () => {
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [valuePageLength, setValuePageLength] = useState(10);
    const [patientType, setPatientType] = useState("remote");
    const [valSearch, setValSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [valueDate, setValueDate] = useState(new Date());

    const [careDashboard, setCareDashboard] = useState({
        loading: false,
        dataSource: [{}]
    });
    const onSaveNoteToDb = (updateData) => {
        billingApis.updateBillingTask(
            updateData
        ).then((res) => {
            getListCareDashboard()
        }).catch(e =>{
            console.log(e)
        })
    }

    const getListCareDashboard = () => {
        setCareDashboard({
            loading: true,
            ...careDashboard.dataSource,
        })

        caredashboardApi.getListDashboard(
            moment(valueDate).format("YYYY-MM-DD"),
            valuePageLength, valuePageLength * (currentPageVal - 1),
            valSearch
        ).then(res => {
            const billingData = res?.data?.response?.billingData || [];
            const totalItemCount = res?.data?.response?.count;
            let totalPagesCal = Math.floor(totalItemCount / valuePageLength);
            if(totalItemCount % valuePageLength != 0){
                totalPagesCal = totalPagesCal + 1;
            }
            setTotalPages(totalPagesCal);
            setCareDashboard({
                loading: false,
                dataSource: billingData
            })
        })
        .catch(err => {
            setCareDashboard({
                loading: false,
                dataSource: []
            })
        })
    };

    useEffect(() => {
        getListCareDashboard();
    }, []);

    useEffect(() => {
        getListCareDashboard();
    }, [valueDate, currentPageVal, valSearch, valuePageLength]);

    const columns = [
        {
            title: "Patient",
            dataIndex: "patient_datum",
            key: "patient_datum",
            width: 50,
            render: (dataIndex, record) => {
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginLeft: "2px", marginRight: "2px" }}>
                            <BulbIcon pid={record?.pid} billDate={valueDate} onSaveNoteToDb={onSaveNoteToDb} />
                        </div>
                        <div style={{ marginLeft: "0.25rem", textAlign: "start" }}>
                            <div style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}>
                                {`${dataIndex?.fname} ${dataIndex?.lname}`}
                            </div>

                            <div>
                                {`DOB: ${moment(dataIndex?.DOB).format('MMM DD YYYY')}  (${Number(moment().format('YYYY')) - Number(moment(dataIndex?.DOB).format('YYYY'))}Y)`}
                            </div>
                            <div>
                                {`Phone: ${dataIndex?.phone_contact}`}
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            title: "Practitioner",
            dataIndex: "primary",
            key: "primary",
            width: 80,
            render: (dataIndex, record) => {
                let primaryDoctor = '';
                let secondDoctor = '';
                try {
                    const firstDoctorDb = record?.patient_datum?.primary_consultant;
                    firstDoctorDb?.map(item => {
                        primaryDoctor += `${item?.fname} ${item?.lname}, `
                    })
                    primaryDoctor = primaryDoctor.slice(0, -2);
                } catch(e){
                    console.log(e)
                }
                try {
                    const secondDoctorDb = record?.patient_datum?.secondary_consultant;
                    secondDoctorDb?.map(item => {
                        secondDoctor += `${item?.fname} ${item?.lname},`
                    })
                    secondDoctor = secondDoctor.slice(0, -1);
                } catch(e){
                    console.log(e)
                }
                return (
                    <>
                    <div style={{textAlign: 'left'}}>Primary: {primaryDoctor}</div>
                <div style={{textAlign: 'left'}}>Secondary: {secondDoctor}</div>
                    </>
                )
            }
        },
        // Table.EXPAND_COLUMN,
        {
            title: "Sensor",
            dataIndex: "Sensor",
            key: "Sensor",
            width: 300,
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
            width: 30,
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
            dataIndex: "task_99453",
            key: "6",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: (dataIndex, record) => {
                return (
                    <span>{`${dataIndex == 1 ? 'Active' : 'Disable'}`}</span>
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
                    <ChartCPTCode code={CPT_CODE.CPT_99454} record={record} pid={record.pid} />
                )
            }
        },
        {
            title: "99457",
            dataIndex: "task_99457",
            key: "8",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: (dataIndex, record) => {
                return (
                    <ChartCPTCode code={CPT_CODE.CPT_99457} record={record} pid={record.pid} />
                )
            }
        },
        {
            title: "99458",
            dataIndex: "task_99458",
            key: "9",
            width: 25,
            className: "column-cpt-code",
            align: "center",
            render: (dataIndex, record) => {
                return (
                    <ChartCPTCode code={CPT_CODE.CPT_99458} record={record} pid={record.pid} />
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
            render: (dataIndex, record) => {
                return (
                    <ChartCPTCode code={CPT_CODE.CPT_99091} record={record} pid={record.pid} />
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
