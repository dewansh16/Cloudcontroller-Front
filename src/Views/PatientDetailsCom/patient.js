import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Col, Row, Tabs, notification } from "antd";
import { Button } from "../../Theme/Components/Button/button";

import alertApi from "../../Apis/alertApis";
import patientApi from "../../Apis/patientApis";
import Icons from "../../Utils/iconMap";

import BasicInfo from "./components/basicInfo";
import ButtonRow from "./components/buttonRow";
import NotesSection from "./components/notesSection";
import EwsTable from "./components/ewsTable";

import "./patient.css";

const { TabPane } = Tabs;

function GetPatientOTP(pid, setOtp, setOtpLoading, callback = () => {}) {
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
    console.log('props', props);

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
        props.history.push(
            `/dashboard/patient/details/${data.demographic_map.pid}`
        );
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
                    <Col span={8}>
                        <Row>
                            <Col span={24} className="patientscoreHead">
                                <p>Heart Rate</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="patientscoredata">
                                <p>
                                {/* {parseInt(data.ews_map.hr) === -1
                                    ? "NA"
                                    : data.ews_map.hr} */}
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
                                {/* {parseInt(data.ews_map.temp) === -1
                                    ? "NA"
                                    : data.ews_map.temp} */}
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
                                {/* {parseInt(data.ews_map.spo2) === -1
                                    ? "NA"
                                    : data.ews_map.spo2} */}
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
                                {/* {parseInt(data.ews_map.rr) === -1
                                    ? "NA"
                                    : data.ews_map.rr} */}
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
                                {/* {parseInt(data.ews_map.pain) === -1
                                    ? "NA"
                                    : data.ews_map.pain} */}
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
                                {/* {parseInt(data.ews_map.motion) === -1
                                    ? "NA"
                                    : data.ews_map.motion} */}
                                    0
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    </Row>
                </TabPane>

                <TabPane tab="EWS Table" key="2">
                    <EwsTable pid={data.pid} />
                </TabPane>
            </Tabs>
        </div>
    </div>
  );
}

export default withRouter(PatientParticular);
