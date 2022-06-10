import React, { useState, useEffect, useRef } from 'react';
import moment from "moment";
import html2canvas from "html2canvas";

import { jsPDF } from "jspdf";
import { Modal, Table, Button } from "antd";
import { CPT_CODE } from "../../../../Utils/utils";

import billingApi from "../../../../Apis/billingApis"
import "./summary.css";

const TOTAL_HOURS_FOR_EACH_SENSOR_BILLED = 16;
const TOTAL_HOURS_FOR_EACH_99458_BILLED = 20;
const TOTAL_HOURS_FOR_CODE_99457_BILLED = 20;
const TOTAL_HOURS_FOR_EACH_99091_BILLED = 30;


const ModalSummary = ({ pid, onClose, currentDate }) => {
    const [dataSource, setDataSource] = useState([]);

    const getDateFromISO = (dateiso) => {
        var date = new Date(dateiso);
        var date_string = `${date.getFullYear()}/${date.getMonth() + 1
            }/${date.getDate()}`;
        return date_string;
    };

    const getTimeFromISO = (dateiso) => {
        var date = new Date(dateiso);
        var time_string = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""
            }${date.getMinutes()}`;
        return time_string;
    };

    const getReportTotalDuration = (item) => {
        if (item.code == CPT_CODE.CPT_99453) { return ''; }

        if (item.code == CPT_CODE.CPT_99457) {
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if (tempTotal >= 20) {
                return '20 Mins'
            } else {
                if (tempTotal > 1) {
                    return `${tempTotal} Mins`
                } else {
                    return `${tempTotal} Min`
                }
            }
        }

        if (item.code == CPT_CODE.CPT_99458) {
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if (tempTotal > 1) {
                return `${tempTotal} Mins`
            } else {
                return `${tempTotal} Min`
            }
        }

        if (item.code == CPT_CODE.CPT_99091) {
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            if (tempTotal > 1) {
                return `${tempTotal} Mins`
            } else {
                return `${tempTotal} Min`
            }
        }
    };

    const getReportDes = (item) => {
        if (item.code == CPT_CODE.CPT_99453) {
            return '1 billed';
        }

        if (item.code == CPT_CODE.CPT_99457) {
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if (tempTotal >= 20) {
                return '1 billed';
            } else {
                return '';
            }
        }

        if (item.code == CPT_CODE.CPT_99458) {
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if (tempTotal >= TOTAL_HOURS_FOR_EACH_99458_BILLED) {
                return `${Math.floor(tempTotal / TOTAL_HOURS_FOR_EACH_99458_BILLED)} billed`;
            } else {
                return '';
            }
        }

        if (item.code == CPT_CODE.CPT_99091) {
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.time_spent)
            })
            if (tempTotal >= TOTAL_HOURS_FOR_EACH_99091_BILLED) {
                return `1 billed`;
            } else {
                return '';
            }
        }
    };

    useEffect(() => {
        if (!!pid) {
            const tempDataSource = [];
            const date = moment(currentDate).format("YYYY-MM-DD");

            billingApi
                .getBillingTasks(pid, date, '0')
                .then((res) => {
                    res.data.response.billingData.map(
                        (item) => {
                            tempDataSource.push({
                                date: `${getDateFromISO(item.bill_date)} ${getTimeFromISO(
                                    item.bill_date
                                )}`,
                                code: item.code,
                                desc: getReportDes(item),
                                duration: getReportTotalDuration(item),
                            });
                        }
                    );

                    setDataSource(tempDataSource);
                })
        }
    }, [pid]);

    const columns = [
        {
            title: "Service Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "CPT Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "CPT Description",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
        },
    ];

    const printRefSummary = useRef();
    const pdf = new jsPDF();

    const handleDownloadPdf = async () => {
        let imgArray = [];
        const element = printRefSummary.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL("image/png");
        imgArray.push({
            imgData: data,
            num: 0,
        });
        const newArray = imgArray.sort(function (a, b) {
            return a.num - b.num;
        });
        newArray.map((item, index) => {
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            if (index > 0) {
                pdf.addPage([pdfWidth, pdfHeight]);
            }
            pdf.addImage(
                item.imgData,
                "jpeg",
                0,
                0,
                pdfWidth,
                130,
                `page${index}`,
                "SLOW"
            );
        });
        pdf.save("summary.pdf");
        onClose();
    };

    return (
        <Modal
            width={900}
            visible={!!pid}
            onCancel={onClose}
            footer={null}
            className="modal-summary"
        >
            <div ref={printRefSummary} style={{ padding: "6% 8%" }}>
                <div
                    style={{
                        background: "#ffa000a1",
                        color: "#5e5e5e",
                        fontSize: "1rem",
                        borderTopLeftRadius: "30px",
                        borderTopRightRadius: "30px",
                        width: "250px",
                        textAlign: "center",
                        padding: "0.5rem"
                    }}
                >
                    Billing Procedure
                </div>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    bordered={true}
                    sticky={true}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "1rem"
                    }}
                >
                    <Button
                        onClick={() => {
                            handleDownloadPdf();
                        }}
                        className="primary"
                    >
                        Generate PDF
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ModalSummary;
