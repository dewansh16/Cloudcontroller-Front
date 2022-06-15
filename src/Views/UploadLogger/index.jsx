import React, { useState, useEffect } from 'react';
import moment from 'moment';

import {
    Table, Row, Button, Spin, Input, notification
} from "antd";
import Navbar from "../../Theme/Components/Navbar/navbar";
import { PaginationBox, computeTotalPages } from "../Components/PaginationBox/pagination";

import { UserStore } from "../../Stores/userStore";
import patientApi from "../../Apis/patientApis";
import IconDownload from "../../Assets/Images/iconDownload.png";
import Icons from "../../Utils/iconMap";

const { Search } = Input;

const UploadLogger = () => {
    const [dataLog, setDataLog] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const { tenant = "" } = UserStore.getUser();
        setLoading(true);
        patientApi.getListUploadLogger(tenant)
            .then(res => {
                const { data = [], totalCount = 1 }  = res?.data?.response;
                setDataLog(data);
                setLoading(false);
                setTotalPages(computeTotalPages(totalCount, 10));
            })
            .catch(() => {
                setDataLog([]);
                setLoading(false);
            })
    }, []);

    const handleDownloadFile = (url) => {
        patientApi.downloadLogger(url)
            .then(res => {
                const urlFile = window.URL.createObjectURL(res.data);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = urlFile;
                a.download = urlFile;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(urlFile);
                notification.success({
                    description:
                        'Download successfully!',
                    placement: 'topRight'
                });
            })
            .catch(() => {
                notification.error({
                    description:
                        'Download failed!',
                    placement: 'topRight'
                });
            });
    };

    const columns = [
        {
            title: 'TIME',
            dataIndex: 'time',
            key: 'time',
            render: (dataIndex) => {
                return (
                    <div>{moment(dataIndex).format("MMMM DD hh:mm:ss a")}</div>
                )
            }
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Download',
            key: 'download',
            render: (dataIndex, record) => {
                return (
                    <img 
                        src={IconDownload} 
                        width={17} height={17} 
                        style={{ cursor: "pointer" }}
                        onClick={() => { handleDownloadFile(record?.url) }}
                    />
                )
            }
        },
    ];

    return (
        <div>
            <div>
                <Navbar
                    startChildren={
                        <>
                            <div className="user-header-heading" style={{ width: "250px", marginLeft: "0" }}>
                                <p>Upload Logger</p>
                            </div>
                        </>
                    }
                    // endChildren={
                    //     <>
                    //         <PaginationBox
                    //             totalPages={totalPages}
                    //             currentPageVal={currentPageVal}
                    //             setCurrentPageVal={setCurrentPageVal}
                    //         />
                    //     </>
                    // }
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
                    <div style={{ margin: "30px 2%", width: "100%" }}>
                        <Table
                            style={{ backgroundColor: "#ffffff" }}
                            columns={columns}
                            size="middle"
                            pagination={false}
                            dataSource={dataLog}
                        />
                    </div>
                )}
            </Row>
        </div>
    );
}

export default UploadLogger;
