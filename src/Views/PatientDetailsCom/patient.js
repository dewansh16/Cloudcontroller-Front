import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { InfluxDB } from "@influxdata/influxdb-client";
import { isJsonString } from "../../Utils/utils";

import { Col, Row, Tabs, notification } from "antd";
import { Button } from "../../Theme/Components/Button/button";

import alertApi from "../../Apis/alertApis";
import patientApi from "../../Apis/patientApis";
import Icons from "../../Utils/iconMap";
import Colors from "../../Theme/Colors/colors";

import BasicInfo from "./components/basicInfo";
import ButtonRow from "./components/buttonRow";
import NotesSection from "./components/notesSection";
import EwsTable from "./components/ewsTable";

import "./patient.css";

const { TabPane } = Tabs;

function GetPatientOTP(pid, setOtp, setOtpLoading, callback = () => { }) {
    setOtpLoading(true);

    patientApi.getPatientOtp(pid)
        .then((res) => {
            setOtpLoading(false);
            setOtp(res.data.response.otp[0]);
            callback();
        })
        .catch((err) => {
            setOtpLoading(false);
            if (err) {
                notification.error({
                    message: "Error",
                    description: `${err.response?.data.result}` || "",
                });
            }
        });
}

function PatientParticular(props) {
    const arrDataChart = [
        {
            _key: 'temp',
            name: "Temperature",
            icon: Icons.thermometerIcon({ Style: { color: Colors.purple } }),
            val: 0,
            color: Colors.purple,
            trendData: []
        },
        {
            _key: 'spo2',
            name: "SPO2",
            icon: Icons.o2({ Style: { color: Colors.green } }),
            val: 0,
            color: Colors.green,
            trendData: []
        },
        {
            _key: 'ecg_hr',
            name: "Heart Rate",
            icon: Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
            val: 0,
            color: Colors.darkPink,
            trendData: []
        },
        {
            _key: 'ecg_rr',
            name: "Respiration Rate",
            icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
            val: 0,
            color: Colors.orange,
            trendData: []
        },
        {
            _key: "blood_pressuer",
            name: "Blood Pressure",
            icon: Icons.bpIcon({
                Style: { color: Colors.darkPurple, fontSize: "24px" },
            }),
            val: 0,
            val_bpd: 0,
            color: Colors.darkPurple,
            trendData: []
        },
        {
            _key: 'weight',
            name: "Weight",
            icon: Icons.bpIcon({
                Style: { color: Colors.yellow, fontSize: "24px" },
            }),
            val: 0,
            color: Colors.yellow,
            trendData: []
        },
    ]

    const [chartBlockData, setChartBlockData] = React.useState([]);

    const processDataForSensor = (key, newArrChart, chart) => {
        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const query = `from(bucket: "emr_dev")
                |> range(start: -${props.dataFilterOnHeader.valDuration})
                |> filter(fn: (r) => r["_measurement"] == "${props.patient.patientDetails?.demographic_map.pid}_${key}")
                |> yield(name: "mean")`;

        const arrayRes = [];
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQueryInFlux = tableMeta?.toObject(row) || {};
                if (key === "alphamed_bpd" || key === "ihealth_bpd") {
                    chart.val_bpd = dataQueryInFlux?._value;
                } else {
                    arrayRes.push({ value: dataQueryInFlux?._value || 0 });
                    // if (arrayRes?.length > 200) {
                    //     arrayRes.splice(0, 1);
                    // }
                }
            },
            error(error) {
                console.error(error)
                console.log('nFinished ERROR')
            },
            complete() {
                // console.log('nFinished SUCCESS');
                if ((key !== "alphamed_bpd" && key !== "ihealth_bpd")) {
                    chart.trendData = arrayRes || [];
                    chart.val = arrayRes[arrayRes.length - 1]?.value || 0;

                    setChartBlockData([...newArrChart]);
                }
            },
        })
    }

    const getDataSensorFromInfluxDB = () => {
        let associatedList = [];

        const isString = isJsonString(props.patient.patientDetails.demographic_map.associated_list);
        if (isString) {
            associatedList = JSON.parse(props.patient.patientDetails.demographic_map.associated_list);
        }

        const newArrChart = [...arrDataChart];
        for (let index = 0; index < newArrChart.length; index++) {
            const chart = newArrChart[index];

            const key = chart?._key;
            if (key !== "blood_pressuer") {
                processDataForSensor(key, newArrChart, chart)
            } else {
                let arrKeyChild = [];
                if (associatedList?.includes("alphamed")) {
                    arrKeyChild = ["alphamed_bpd", "alphamed_bps"];
                } else {
                    arrKeyChild = ["ihealth_bpd", "ihealth_bps"];
                }

                for (let j = 0; j < arrKeyChild.length; j++) {
                    processDataForSensor(arrKeyChild[j], newArrChart, chart);
                }
            }
        }
    };

    useEffect(() => {
        // setChartBlockData(chartBlockData);
        getDataSensorFromInfluxDB();

        // const timeInterval = setInterval(() => {
        //     getDataSensorFromInfluxDB();
        // }, 10000);

        // return () => {
        //     clearInterval(timeInterval);
        // }
    }, [props.patient.patientDetails?.demographic_map.pid]);

    const data = props.patient.patientDetails;
    const [alertButtonData, setAlertButtonData] = useState({
        isLoadingAlerts: false,
        alertCount: 0,
    });

    const [otp, setOtp] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpVisibility, setOtpVisibility] = useState(false);

    const showNotes = () => {
        props.setShowNotes(true);
    };

    const pushToPatientDetails = () => {
        // props.history.push(
        //     `/dashboard/patient/details/${data.demographic_map.pid}`
        // );

        props.history.push({
            pathname: `/dashboard/patient/details/${data.demographic_map.pid}`,
            state: {
                dataFilterHeader: props.dataFilterOnHeader,
            },
        });
    };

    const openReport = () => {
        props.history.push(
            `/dashboard/patient/details/${data.demographic_map.pid}/report`
        );
    };

    const openAlerts = () => {
        props.history.push(`/dashboard/patient/${data.demographic_map.pid}/alerts`);
    };

    const openPatientJourney = () => {
        props.history.push(
            `/dashboard/patient/${data.demographic_map.pid}/patientJourney`
        );
    };

    const handleComponentClose = () => {
        props.setShowTrend(true);
        props.setActive("");
    };

    const viewOtp = () => {
        setOtpVisibility(true);
        setTimeout(() => setOtpVisibility(false), 30000);
    };
    const getOtp = () => {
        GetPatientOTP(data.pid, setOtp, setOtpLoading, viewOtp);
    };

    useEffect(() => {
        // setOtpVisibility(false);
        // setAlertButtonData({ isLoadingAlerts: true });

        // alertApi
        //     .getPatientAlerts(data.demographic_map.pid)
        //     .then((res) => {
        //         let count = 0;
        //         res.data.response.alerts[0]?.alerts?.map((alert) => {
        //             if (alert.status === "open") count++;
        //         });
        //         // console.log(res.data.response.alerts[0], count);
        //         setAlertButtonData({
        //             isLoadingAlerts: false,
        //             alertCount: count,
        //         });
        //     })
        //     .catch((err) => {
        //         setAlertButtonData({ isLoadingAlerts: false });
        //     });

        // return () => clearTimeout();
    }, [data.demographic_map.pid]);

    const renderValueByKey = ({ _key = "", val = 0, val_bpd = 0}) => {
        switch (_key) {
            case "temp":
                const celsius = 5 / 9 * (val - 32);
                return `${val}°F / ${celsius.toFixed(1)}°C`
            case "spo2": 
                return `${val}`;
            case "ecg_hr": 
            case "ecg_rr":
                return `${val} bpm`;
            case "blood_pressuer": 
                return `${val} - ${val_bpd} mmHg`;
            case "weight": 
                const lbs = val * 2.2046;
                return `${val} kg / ${lbs.toFixed(1)} lbs`
            default:
                break;
        }
    };

    return (
        <div className="patientParticularMain">
            {/* BASIC INFO */}
            <Row>
                <Col span={24}>
                    <BasicInfo
                        data={data}
                        handleComponentClose={handleComponentClose}
                        onDeletePatient={props.onDeletePatient}
                    />
                </Col>

                <Col span={24} style={{ marginTop: "1rem" }}>
                    <ButtonRow
                        deviceType={
                            data?.patch_patient_maps?.[0]?.patches?.[0]
                                ?.patch_type
                        }
                        viewOtp={viewOtp}
                        getOtp={getOtp}
                        otp={otp}
                        otpVisibility={otpVisibility}
                        alertData={alertButtonData}
                        showNotes={showNotes}
                        openReport={openReport}
                        openAlerts={openAlerts}
                        pushToPatientDetails={pushToPatientDetails}
                    />
                </Col>
            </Row>

            {/*  NOTES SECTION */}
            {data.note && <NotesSection data={data} />}

            {/* TAB SECTION */}
            <div
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Sensors" key="1">
                        <Row
                            style={{ background: "white", width: "100%", paddingTop: "2rem" }}
                        >
                            {chartBlockData.map((itemSensor, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Row>
                                            <Col span={24} className="patientscoreHead">
                                                <p>{itemSensor?.name}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} className="patientscoredata">
                                                <p>
                                                    {renderValueByKey(itemSensor)}
                                                    {/* {itemSensor?.val}
                                                    {itemSensor?._key === "blood_pressuer" && (
                                                        ` - ${itemSensor?.val_bpd}`
                                                    )} */}
                                                </p>
                                            </Col>
                                        </Row>
                                    </Col>
                                )
                            })}
                            {/* <Col span={8}>
                                <Row>
                                    <Col span={24} className="patientscoreHead">
                                        <p>Heart Rate</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="patientscoredata">
                                        <p>
                                            0
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={24} className="patientscoreHead">
                                        <p>Temp</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="patientscoredata">
                                        <p>
                                            0
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={24} className="patientscoreHead">
                                        <p>SPO2</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="patientscoredata">
                                        <p>
                                            0
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={24} className="patientscoreHead">
                                        <p>Respiration Rate</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="patientscoredata">
                                        <p>
                                            0
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={24} className="patientscoreHead">
                                        <p>Pain Index</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="patientscoredata">
                                        <p>
                                            0
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={24} className="patientscoreHead">
                                        <p>Motion</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="patientscoredata">
                                        <p>
                                            0
                                        </p>
                                    </Col>
                                </Row>
                            </Col> */}
                        </Row>
                    </TabPane>

                    {/* <TabPane tab="EWS Table" key="2">
                    <EwsTable pid={data.pid} />
                </TabPane> */}
                </Tabs>
            </div>
        </div>
    );
}

export default withRouter(PatientParticular);
