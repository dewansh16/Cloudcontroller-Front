import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { notification, Empty } from "antd";
import ReportHeader from "./Components/header/header.Report.component";
import Footer from "./Components/footer/footer.Report.component";
import PatientDetail from "./Components/PatientDetail/patientDetail.Report.components";
import { Input, Spin, Select, Button } from "antd";
import "./PatientReport.component.css";
import EWSchart from "./Components/charts/EWSchart.charts.Report.component";
import PulseRatechart from "./Components/charts/PulseRate.Report.Components";
import RespRatechart from "./Components/charts/RespRate.chart.Report.components";
import SpO2chart from "./Components/charts/SpO2.Report.Components";
import Tempchart from "./Components/charts/Temp.Report.Components";
import reportApi from "../../../Apis/reportApis";
import PerDayReports from "./Components/PerDayReports/perDayReports.PatientReport.components";
import Navbar from "../../../Theme/Components/Navbar/navbar";
import "./Components/page controller/pageController.Report.Components.css";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFDownloadLink,
} from "@react-pdf/renderer";

import Colors from "../../../Theme/Colors/colors";

import Icons from "../../../Utils/iconMap";

import { Button as Buttons } from "../../../Theme/Components/Button/button";

import Scroll from "react-scroll";
import { UserStore } from '../../../Stores/userStore';


const Element = Scroll.Element;
const scroller = Scroll.scroller;
const { TextArea } = Input;
const { Option } = Select;

function FetchDetails(pid, setDeboarded) {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportDates, setReportDates] = useState([]);
    const location = useLocation();

    const user = UserStore.getUser();

    useEffect(() => {
        if (location.state?.deboarded === true) {
            setDeboarded(true);
            reportApi
                .getDeboardedReportData(pid)
                .then((res) => {
                    setResponse(res.data.response);
                    const trends = res.data.response?.report.demographic_map[0].trend_map;
                    let longestChart =
                        res.data.response?.report.demographic_map[0].trend_map[0].spo2;
                    trends.map((item) => {
                        if (item.temp?.length > longestChart.length) {
                            longestChart = item.temp;
                        }
                        if (item.rr?.length > longestChart.length) {
                            longestChart = item.rr;
                        }
                        if (item.hr?.length > longestChart.length) {
                            longestChart = item.hr;
                        }
                        if (item.ews?.length > longestChart.length) {
                            longestChart = item.ews;
                        }
                    });
                    let firstDay = longestChart.length > 0 ? longestChart[0] : null;
                    let datesReq = [];
                    if (longestChart.length > 0) datesReq.push(firstDay);
                    longestChart.map((item) => {
                        if (
                            new Date(item.date).getDate !== new Date(firstDay.date).getDate
                        ) {
                            datesReq.push(item);
                            firstDay = item;
                        }
                    });
                    console.log(longestChart, datesReq);
                    setReportDates(datesReq);
                    setLoading(false);
                })
                .catch((err) => {
                    if (err) {
                        const error = err.response?.data.result;
                        notification.error({
                            message: "Error",
                            description: "report not available",
                        });
                        setLoading(false);
                    }
                });
        } else {
            reportApi
                .getReportData(pid, user?.tenant)
                .then((res) => {
                    if (
                        res.data.response.report?.demographic_map[0]?.demographic_map
                            ?.status === "Deboarded"
                    ) {
                        setDeboarded(true);
                        reportApi
                            .getDeboardedReportData(pid)
                            .then((res) => {
                                setResponse(res.data.response);
                                const trends =
                                    res.data.response?.report.demographic_map[0].trend_map;
                                let longestChart =
                                    res.data.response?.report.demographic_map[0].trend_map[0]
                                        .spo2;
                                trends.map((item) => {
                                    if (item.temp?.length > longestChart.length) {
                                        longestChart = item.temp;
                                    }
                                    if (item.rr?.length > longestChart.length) {
                                        longestChart = item.rr;
                                    }
                                    if (item.hr?.length > longestChart.length) {
                                        longestChart = item.hr;
                                    }
                                    if (item.ews?.length > longestChart.length) {
                                        longestChart = item.ews;
                                    }
                                });
                                let firstDay = longestChart.length > 0 ? longestChart[0] : null;
                                let datesReq = [];
                                if (longestChart.length > 0) datesReq.push(firstDay);
                                longestChart.map((item) => {
                                    if (
                                        new Date(item.date).getDate !==
                                        new Date(firstDay.date).getDate
                                    ) {
                                        datesReq.push(item);
                                        firstDay = item;
                                    }
                                });
                                console.log(longestChart, datesReq);
                                setReportDates(datesReq);
                                setLoading(false);
                            })
                            .catch((err) => {
                                if (err) {
                                    const error = err.response?.data.result;
                                    notification.error({
                                        message: "Error",
                                        description: "report not available",
                                    });
                                    setLoading(false);
                                }
                            });
                    } else {
                        setResponse(res.data.response);
                        const trends =
                            res.data.response?.report.demographic_map[0].trend_map;
                        let longestChart =
                            res.data.response?.report.demographic_map[0].trend_map[0].spo2;
                        trends.map((item) => {
                            if (item.temp?.length > longestChart.length) {
                                longestChart = item.temp;
                            }
                            if (item.rr?.length > longestChart.length) {
                                longestChart = item.rr;
                            }
                            if (item.hr?.length > longestChart.length) {
                                longestChart = item.hr;
                            }
                            if (item.ews?.length > longestChart.length) {
                                longestChart = item.ews;
                            }
                        });
                        let firstDay = longestChart.length > 0 ? longestChart[0] : null;
                        let datesReq = [];
                        if (longestChart.length > 0) datesReq.push(firstDay);
                        longestChart.map((item) => {
                            if (
                                new Date(item.date).getDate !== new Date(firstDay.date).getDate
                            ) {
                                datesReq.push(item);
                                firstDay = item;
                            }
                        });
                        console.log(longestChart, datesReq);
                        setReportDates(datesReq);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    if (err) {
                        const error = err.response?.data.result;
                        notification.error({
                            message: "Error",
                            description: "report not available",
                        });
                        setLoading(false);
                    }
                });
        }
    }, [pid]);
    return [response, loading, reportDates];
}

const PaginationBox = ({ totalPages, currentPageVal, setCurrentPageVal }) => {
    const increamentPage = () => {
        if (currentPageVal < totalPages) {
            setCurrentPageVal(currentPageVal + 1);
        }
    };

    const decreamentPage = () => {
        if (currentPageVal > 1) {
            setCurrentPageVal(currentPageVal - 1);
        }
    };
    const setPageValOnSelect = (val) => {
        setCurrentPageVal(val);
        scroller.scrollTo(`myScrollToElement-${val}`, {
            duration: 3000,
            smooth: true,
            offset: -100,
        });
    };

    const controlButtonStyle = {
        height: "auto",
        width: "1em",
        padding: "1rem 1.5rem",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        fontWeight: "400",
        color: `${Colors.orange}`,
        borderRadius: "6px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    };

    return (
        <div className="pagination-box" style={{ width: "24em" }}>
            <Button
                style={controlButtonStyle}
                onClick={() => {
                    if (currentPageVal > 1) {
                        setCurrentPageVal(currentPageVal - 1);
                        scroller.scrollTo(`myScrollToElement-${currentPageVal - 1}`, {
                            duration: 2000,
                            smooth: true,
                            offset: -100,
                        });
                    }
                }}
            >
                {Icons.leftArrowFilled({})}
            </Button>
            <div className="pagination-main-box">
                <Select
                    value={currentPageVal}
                    bordered={false}
                    style={{
                        display: "flex",
                        height: "100%",
                        border: `1px solid ${Colors.orange}`,
                        borderRadius: "6px",
                        zIndex: "1",
                        padding: "0.6rem",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                        background: "white",
                    }}
                    listItemHeight={4}
                    onSelect={setPageValOnSelect}
                >
                    {Array(totalPages)
                        .fill()
                        .map((item, i) => (
                            <Option
                                key={i}
                                style={{ display: "flex", height: "100%" }}
                                value={i + 1}
                            >
                                {i + 1}
                            </Option>
                        ))}
                </Select>
                <div className="total-page-box">
                    <h1>out of {totalPages}</h1>
                </div>
            </div>
            <Button
                style={controlButtonStyle}
                onClick={() => {
                    if (currentPageVal < totalPages) {
                        setCurrentPageVal(currentPageVal + 1);
                        scroller.scrollTo(`myScrollToElement-${currentPageVal + 1}`, {
                            duration: 2000,
                            smooth: true,
                            offset: -100,
                        });
                    }
                }}
            >
                {Icons.rightArrowFilled({})}
            </Button>
        </div>
    );
};

const PatientReport = (props) => {
    const pid = useParams().pid;

    const [isDeboarded, setDeboarded] = useState(false);
    const [patient, isLoading, reportDates] = FetchDetails(pid, setDeboarded);
    const [currentPageVal, setCurrentPageVal] = useState(1);

    const goBack = () => {
        props.history.goBack();
    };

    const toPatientDetails = () => {
        props.history.push(`/dashboard/patient/details/${pid}`);
    };

    const getEnrolmentPeriod = (dateFuture, dateNow) => {
        let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        console.log("calculated days", days);

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        console.log("calculated hours", hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        console.log("minutes", minutes);

        let difference = "";
        if (days > 0) {
            difference += days === 1 ? `${days} day, ` : `${days} days, `;
        }

        difference +=
            hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

        difference +=
            minutes === 0 || hours === 1
                ? `${minutes} minutes`
                : `${minutes} minutes`;

        return difference;
    };

    return (
        <>
            <Navbar
                startChildren={
                    <>
                        <div style={{ width: "30%", textAlign: "center" }}>
                            <Buttons
                                style={{
                                    border: "none",
                                    boxShadow: "none",
                                    marginRight: "10%",
                                }}
                                className="utility"
                                onClick={goBack}
                            >
                                {Icons.headerBackArrow({})}
                            </Buttons>
                        </div>
                        <div style={{ width: "70%", textAlign: "center" }}>
                            <Buttons
                                style={{
                                    margin: "5px",
                                    padding: "0.2rem",
                                }}
                                disabled={isDeboarded}
                                className="utility"
                                onClick={toPatientDetails}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        padding: "none",
                                        border: "none",
                                        minHeight: "50px",
                                        minWidth: "170px",
                                        position: "relative",
                                    }}
                                    className="alert-info-box"
                                >
                                    {!isLoading && patient !== null && patient !== undefined && (
                                        <>
                                            <h1
                                                style={{
                                                    marginBottom: "0px",
                                                    fontSize: "18px",
                                                    fontWeight: "500",
                                                    textAlign: "left",
                                                }}
                                            >
                                                {`${patient.report.demographic_map[0]?.demographic_map
                                                        .title === undefined
                                                        ? ""
                                                        : patient.report.demographic_map[0]?.demographic_map
                                                            .title
                                                    }` +
                                                    " " +
                                                    patient.report.demographic_map[0]?.demographic_map
                                                        .fname +
                                                    " " +
                                                    patient.report.demographic_map[0]?.demographic_map
                                                        .lname}
                                            </h1>
                                            <p
                                                style={{
                                                    marginBottom: "0px",
                                                    fontSize: "16px",
                                                    fontWeight: "400",
                                                    color: "#A5A5A5",
                                                    textAlign: "start",
                                                }}
                                            >
                                                MR:{" "}
                                                {
                                                    patient.report.demographic_map[0]?.demographic_map
                                                        ?.med_record
                                                }
                                            </p>
                                        </>
                                    )}
                                    {isLoading && (patient === undefined || patient === null) && (
                                        <Spin
                                            style={{ position: "absolute", left: "40%", top: "30%" }}
                                        />
                                    )}
                                </div>
                            </Buttons>
                        </div>
                    </>
                }
                centerChildren={
                    <PaginationBox
                        currentPageVal={currentPageVal}
                        setCurrentPageVal={setCurrentPageVal}
                        totalPages={reportDates.length + 1}
                    />
                }
                endChildren={
                    <div className="button-box" style={{ margin: "0px 40px" }}>
                        <Buttons className="primary">Download PDF</Buttons>
                    </div>
                }
            />
            {!isLoading &&
                patient !== null &&
                patient !== undefined &&
                reportDates.length > 0 && (
                    <>
                        <Element name={`myScrollToElement-1`}>
                            <div className="report-body-0">
                                <ReportHeader />
                                <PatientDetail
                                    startDate={reportDates[reportDates.length - 1]?.date}
                                    endDate={reportDates[0]?.date}
                                    details={patient.report.demographic_map[0].demographic_map}
                                    enrollTime={getEnrolmentPeriod(
                                        new Date(reportDates[reportDates.length - 1]?.date),
                                        new Date(reportDates[0]?.date)
                                    )}
                                />
                                <div className="charts">
                                    {patient.report.demographic_map[0].trend_map[4]?.ews.length >
                                        0 && (
                                            <EWSchart
                                                chartData={patient.report.demographic_map[0].trend_map[4]}
                                            />
                                        )}
                                    {patient.report.demographic_map[0].trend_map[2]?.rr.length >
                                        0 && (
                                            <RespRatechart
                                                chartData={patient.report.demographic_map[0].trend_map[2]}
                                            />
                                        )}
                                    {patient.report.demographic_map[0].trend_map[3]?.hr.length >
                                        0 && (
                                            <PulseRatechart
                                                chartData={patient.report.demographic_map[0].trend_map[3]}
                                            />
                                        )}
                                    {patient.report.demographic_map[0].trend_map[0]?.spo2.length >
                                        0 && (
                                            <SpO2chart
                                                chartData={patient.report.demographic_map[0].trend_map[0]}
                                            />
                                        )}
                                    {patient.report.demographic_map[0].trend_map[1]?.temp.length >
                                        0 && (
                                            <Tempchart
                                                chartData={patient.report.demographic_map[0].trend_map[1]}
                                            />
                                        )}
                                </div>
                                <TextArea
                                    className="change"
                                    rows={10}
                                    style={{
                                        width: "80%",
                                        margin: "auto",
                                        display: "block",
                                        marginTop: "30px",
                                        backgroundColor: "#E8F5FB",
                                    }}
                                    placeholder="NOTES"
                                />
                                <Footer
                                    endDate={reportDates[reportDates.length - 1].date}
                                    totalPages={reportDates.length + 1}
                                />
                            </div>
                        </Element>

                        {reportDates.map((item, index) => {
                            const date = item.date;
                            return (
                                <div>
                                    <Element name={`myScrollToElement-${index + 2}`}>
                                        <PerDayReports
                                            key={index}
                                            date={date}
                                            pid={pid}
                                            dayNo={index + 1}
                                            totalPages={reportDates.length + 1}
                                        />
                                    </Element>
                                </div>
                            );
                        })}
                    </>
                )}{" "}
            {isLoading && (
                <Spin
                    size="large"
                    style={{ position: "relative", left: "50%", top: "30%" }}
                />
            )}
            {!isLoading &&
                (patient !== null || patient !== undefined) &&
                reportDates.length === 0 && (
                    <div style={{ height: "100vh" }}>
                        <div
                            style={{
                                margin: "0",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <div className="no-report-div">
                                <p>No Report to Show</p>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
};

export default PatientReport;
