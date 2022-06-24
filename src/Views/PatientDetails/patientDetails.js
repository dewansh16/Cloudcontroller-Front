import React, { useEffect, useState } from "react";
// import { useHistory } from 'react-router-dom';
import Icons from "../../Utils/iconMap";
import InfoBar from "./components/infoSection";
import ECGChart from "../Components/Charts/ecgChart";
import QuickInfo from "./components/quickInfo";
import { UserStore } from "../../Stores/userStore";
import { useHistory, useParams } from "react-router-dom";
import {
    Row,
    Col,
    notification,
    Empty,
    Spin,
    Button,
    Modal,
    Drawer,
    Divider,
    Affix,
    Popover,
} from "antd";
// import EmrModal from '../temp-emr/Emr';
import patientApi from "../../Apis/patientApis";
import locationApi from "../../Apis/locationApi";
import "./patientDetails.css";

import DeviceManagement from "../Components/DeviceManagement/DeviceManagement.Components";
import { Button as Buttons } from "../../Theme/Components/Button/button";

import FileView from "./components/FileView/fileView.Components.patienDetails";
// import Navbar from "../../Theme/Components/Navbar/navbar";
import "../PatientJourney/patientJourney.css";

import WardDetails from "../PatientJourney/wardDetails/wardDetails.patientJourney";
import Steps from "../PatientJourney/stepspatientJourney/steps.patientJourney";
import DetailBox from "./components/detailBox.patientDetails";

export default function PatientDetails(props) {
    const { pid } = useParams();
    let userData = UserStore.getUser();

    const [patient, setPatient] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [journeyDetails, setJourneyDetails] = useState(null);
    const [locationInventory, setLocationInventory] = useState(null);

    useEffect(() => {
        // setLoading(true);

        patientApi
            .getDetailPatientById(pid)
            .then((res) => {
                setPatient(res.data.response.patient);
                setLoading(false);
            })
            .catch((err) => {
                if (err) {
                    const error = err.response?.data.result;
                    notification.error({
                        message: "Error",
                        description: `${error}` || "",
                    });
                    setLoading(false);
                }
            });

        patientApi
            .getPatientLocation(pid)
            .then((res) => {
                setJourneyDetails(res.data.response.locations);
            })
            .catch((err) => {
                const error = err.response?.data.result;
                notification.error({
                    message: "Error",
                    description: `${error}` || "",
                });
                setLoading(false);
            });

        locationApi
            .getLocationData(userData.tenant)
            .then((res) => {
                setLocationInventory(res.data.response.locations);
                // setLoading(false);
            })
            .catch((err) => {
                const error = err.response?.data.result;
                notification.error({
                    message: "Error",
                    description: `${error}` || "",
                });
                setLoading(false);
            });
    }, [pid]);

    const [themeMode, setThemeMode] = useState("Light");
    const [quickInfo, setQuickInfo] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [doctorDrawerVisible, setDoctorDrawerVisible] = useState(false);
    const [refreshFileView, refreshFileViewAgain] = useState(false);
    const [openPatientJourney, setPatientJourney] = useState(false);
    const [activeInfoSection, setInfoSection] = useState("notes");
    const [activeTab, setActiveTab] = useState("vitals");
    const [detailsBox, setDetailBox] = useState(false);

    const [activeStep, setActiveStep] = useState(0);
    const [stepArray, setStepArray] = useState([]);

    const [durationArray, setDurationArray] = useState([]);
    const [summaryModal, openSummaryModal] = useState(false);

    useEffect(() => {
        const setWardName = (locationDetail) => {
            const reqLocation = locationInventory.filter((item) => {
                if (item.location_uuid === locationDetail.location_uuid) {
                    return true;
                } else return false;
            });

            if (reqLocation === undefined || reqLocation === null) {
                notification.error({
                    message: "Error",
                    description: "loation not found",
                });
            }

            if (reqLocation[0]?.ward_tag?.length === 0) {
                return (
                    "floor " + reqLocation[0]?.floor + " ward " + reqLocation[0]?.ward
                );
            } else return reqLocation[0]?.ward_tag;
        };

        const setWardLoaction = (locationDetail) => {
            const reqLocation = locationInventory.filter((item) => {
                if (item.location_uuid === locationDetail.location_uuid) {
                    return true;
                } else return false;
            });

            return {
                floor: reqLocation[0]?.floor || "N/A",
                ward: reqLocation[0]?.ward || "N/A",
            };
        };

        const getFormattedDate = (date) => {
            if (date === undefined || date === null) {
                return null;
            }
            const dateObj = new Date(date);
            let month = dateObj.getMonth() + 1;
            // console.log(month);
            if (month % 10 === month) {
                month = "0" + month;
            }
            const day = String(dateObj.getDate()).padStart(2, "0");
            const year = dateObj.getFullYear();
            return day + "/" + month + "/" + year;
        };

        function to12HourFormat(dates) {
            if (dates === undefined || dates === null) {
                return null;
            }
            var date = new Date(dates);
            var hours = date.getHours();
            var minutes = date.getMinutes();

            // Check whether AM or PM
            var newformat = hours >= 12 ? "p.m" : "a.m";

            // Find current hour in AM-PM Format
            hours = hours % 12;

            // To display "0" as "12"
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            return hours + ":" + minutes + " " + newformat;
        }

        if (
            patient !== null &&
            journeyDetails !== null &&
            locationInventory !== null
        ) {
            let newStepArray = [];

            journeyDetails.map((item) => {
                newStepArray.push({
                    name: setWardName(item),
                    entryDate: getFormattedDate(item.current_date),
                    entryTime: to12HourFormat(item.current_date),
                    bedNo: item.bed_no,
                    location: setWardLoaction(item),
                    deviceData: {
                        temp: item.vital_report_details
                            ? item.vital_report_details[0]?.temperature || null
                            : null,
                        spo2: item.vital_report_details
                            ? item.vital_report_details[0]?.spo2 || null
                            : null,
                        rr: item.vital_report_details
                            ? item.vital_report_details[0]?.respiration || null
                            : null,
                        hr: item.vital_report_details
                            ? item.vital_report_details[0]?.pulse || null
                            : null,
                        bph: 110 + Math.floor(Math.random() * 30),
                        bpl: 50 + Math.floor(Math.random() * 50),
                    },
                });
            });

            // newStepArray.push({
            //   name: setWardName(patient.demographic_map),
            //   entryDate: getFormattedDate(patient.demographic_map.form_vital?.date),
            //   entryTime: to12HourFormat(patient.demographic_map.form_vital?.date),
            //   deviceData: {
            //     temp: patient.demographic_map.form_vital?.temperature || null,
            //     spo2: patient.demographic_map.form_vital?.spo2 || null,
            //     rr: patient.demographic_map.form_vital?.respiration || null,
            //     hr: 80 + Math.floor(Math.random() * 20) || null,
            //     bph: patient.demographic_map.form_vital?.bpd || null,
            //     bpl: patient.demographic_map.form_vital?.bps || null,
            //   },
            // });
            setStepArray(newStepArray);
        }
    }, [patient, journeyDetails, locationInventory]);

    useEffect(() => {
        const getFormattedDate = (date) => {
            if (date === undefined || date === null) {
                return null;
            }
            const dateObj = new Date(date);
            let month = dateObj.getMonth() + 1;
            // console.log(month);
            if (month % 10 === month) {
                month = "0" + month;
            }
            const day = String(dateObj.getDate()).padStart(2, "0");
            const year = dateObj.getFullYear();
            return day + "/" + month + "/" + year;
        };

        function to12HourFormat(dates) {
            if (dates === undefined || dates === null) {
                return null;
            }
            var date = new Date(dates);
            var hours = date.getHours();
            var minutes = date.getMinutes();

            // Check whether AM or PM
            var newformat = hours >= 12 ? "p.m" : "a.m";

            // Find current hour in AM-PM Format
            hours = hours % 12;

            // To display "0" as "12"
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            return hours + ":" + minutes + " " + newformat;
        }
        if (patient !== null) {
            let newDurationArray = [];
            newDurationArray.push({
                name: "Patient Admitted",
                time:
                    getFormattedDate(patient.demographic_map.admission_date) +
                    " | " +
                    to12HourFormat(patient.demographic_map.admission_date),
            });
            if (
                patient.demographic_map.discharge_date !== null &&
                patient.demographic_map.discharge_date !== undefined
            ) {
                newDurationArray.push({
                    name: "Patient Discharged",
                    time:
                        getFormattedDate(patient.demographic_map.discharge_date) +
                        " | " +
                        to12HourFormat(patient.demographic_map.discharge_date),
                });
            } else {
                newDurationArray.push({
                    name: "Patient In Care",
                    time:
                        getFormattedDate(new Date()) + " | " + to12HourFormat(new Date()),
                });
            }
            setDurationArray(newDurationArray);
        }
    }, [patient]);

    const changeMode = () => {
        setThemeMode((prevValue) => {
            return prevValue === "Dark" ? "Light" : "Dark";
        });
    };

    const tabInventory = [
        {
            name: "liveMonitor",
            component: (
                <Row flex="auto">
                    <Col span={24}>
                        <ECGChart
                            pid={pid}
                            themeMode={themeMode}
                            ThemeButton={
                                <Button
                                    onClick={changeMode}
                                    style={{
                                        margin: "1em",
                                        border: "None",
                                        outline: "None",
                                        height: "2em",
                                        width: "2em",
                                        padding: "0.3em",
                                        background:
                                            themeMode === "Light"
                                                ? "#FFFFFF"
                                                : "rgba(255, 255, 255, 0.01)",
                                        boxShadow:
                                            themeMode === "Light"
                                                ? "1px solid rgba(240, 191, 43, 0.3)"
                                                : "inset 0px 4px 18px rgba(247, 212, 106,0.2)",
                                    }}
                                    icon={themeMode === "Light" ? Icons.moon({}) : Icons.sun({})}
                                ></Button>
                            }
                        />
                    </Col>
                </Row>
            ),
        },
        {
            name: "quickInfo",
            component: QuickInfo,
        },
        {
            name: "files",
            component: FileView,
        },
        {
            name: "vitals",
            component: WardDetails,
        },
    ]

    let history = useHistory();

    const pushToEmr = () => {
        history.push(`/dashboard/patient/EMR/${pid}`);
    };

    const closeDoctorDrawer = () => {
        setDoctorDrawerVisible(false);
    };

    const openQuickInfo = () => {
        setQuickInfo(true);
    };

    const closeQuickInfo = () => {
        setQuickInfo(false);
    };

    const goBack = () => {
        props.history.goBack();
    };

    const patientState = (item) => {
        if (
            item.toLowerCase() === "unknown" ||
            item === undefined ||
            item === null
        ) {
            return null;
        } else if (item === "critical") {
            return (
                <h1
                    style={{
                        color: "#FF1B1B",
                    }}
                >
                    {item}
                </h1>
            );
        } else {
            return (
                <h1
                    style={{
                        color: "#08C700",
                    }}
                >
                    {item}
                </h1>
            );
        }
    };

    const configName = (name) => {
        if (name.length > 1) {
            return name.slice(0, 14) + ".";
        } else return name;
    };

    const buttonStyle = {
        height: "100%",
        marginRight: "3%",
        background: "transparent",
        color: "black",
    };

    const activeButtonStyle = {
        height: "100%",
        marginRight: "3%",
        color: "#FF7529",
        background: "transparent",
    };

    return (
        <>
            {" "}
            {(patient === null && isLoading) && (
                <div style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Spin spinning={isLoading} delay={300}></Spin>
                </div>
            )}
            {patient !== null && (
                <>
                    {" "}
                    <Spin spinning={isLoading} delay={300}>
                        <Affix>
                            <Row
                                style={{
                                    display: "flex",
                                    background: "white",
                                    minHeight: "88px",
                                    alignItems: "center",
                                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Col
                                    span={7}
                                    style={{ justifyContent: "center" }}
                                    className="global-select-location"
                                >
                                    <div
                                        style={{ justifyContent: "space-around", width: "100%" }}
                                        className="patient-details-header-first-column"
                                    >
                                        <div>
                                            <Buttons
                                                style={{ border: "none", boxShadow: "none" }}
                                                className="back-buttons utility"
                                                onClick={() => {
                                                    history.push({ 
                                                        pathname: '/dashboard/patient/list',
                                                        state: { dataFilterHeader: props?.location?.state?.dataFilterHeader || null }
                                                    });
                                                }}
                                            >
                                                {Icons.headerBackArrow({})}
                                            </Buttons>
                                        </div>
                                        <Popover
                                            placement="bottomLeft"
                                            visible={detailsBox}
                                            content={
                                                <DetailBox
                                                    setDetailBox={setDetailBox}
                                                    detailsBox={detailsBox}
                                                    patient={patient}
                                                />
                                            }
                                            overlayInnerStyle={{
                                                // height: "40vh",
                                                width: "25vw",
                                                maxHeight: "400px",
                                                minHeight: "200px",
                                                overflow: "auto",
                                                boxShadow: "0px 4px 30px rgb(255 117 41 / 25%)",
                                                borderRadius: "7px",
                                            }}
                                        >
                                            <div className="patient-name-box">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <h1>
                                                        {" "}
                                                        {configName(
                                                            `${patient.demographic_map.title === undefined
                                                                ? ""
                                                                : patient.demographic_map.title
                                                            }` +
                                                            " " +
                                                            patient.demographic_map.fname +
                                                            " " +
                                                            patient.demographic_map.lname
                                                        )}
                                                    </h1>
                                                    <Buttons
                                                        style={{
                                                            padding: "0px",
                                                            height: "auto",
                                                            marginLeft: "5px",
                                                        }}
                                                        type="text"
                                                        onClick={() => {
                                                            setDetailBox(!detailsBox);
                                                        }}
                                                    >
                                                        {Icons.infoCircleIcon({})}
                                                    </Buttons>
                                                </div>
                                                <div>
                                                    <p>MR:{patient.demographic_map.med_record}</p>
                                                </div>
                                            </div>
                                        </Popover>

                                        <div className="patient-state-box">
                                            <h1>
                                                {
                                                    // patientState(patient.PatientState.state)
                                                }
                                            </h1>
                                        </div>
                                    </div>
                                </Col>

                                <Col span={17}>
                                    <Row style={{ justifyContent: "center" }}>
                                        <Col span={18}>
                                            <Buttons
                                                style={{ marginRight: "3%" }}
                                                type="secondary"
                                                onClick={openQuickInfo}
                                            >
                                                Device Management
                                            </Buttons>
                                            <Buttons
                                                style={{ marginRight: "3%" }}
                                                type="secondary"
                                                onClick={pushToEmr}
                                            >
                                                EMR
                                            </Buttons>
                                            <Buttons
                                                style={{ marginRight: "3%" }}
                                                type="secondary"
                                                onClick={() =>
                                                    history.push(
                                                        `/dashboard/patient/details/${pid}/report`
                                                    )
                                                }
                                            >
                                                Reports
                                            </Buttons>
                                            <Buttons
                                                style={{ marginRight: "3%" }}
                                                type="secondary"
                                                onClick={() =>
                                                    history.push(`/dashboard/patient/${pid}/alerts`)
                                                }
                                            >
                                                Alerts
                                            </Buttons>
                                            {/* <Buttons
                                                style={{ marginRight: "3%" }}
                                                type="secondary"
                                                onClick={() =>
                                                    history.push({
                                                        pathname: `/dashboard/patient/${pid}/graphvisualizer`,
                                                        state: {
                                                            name:
                                                                `${patient.demographic_map.title === undefined
                                                                    ? ""
                                                                    : patient.demographic_map.title
                                                                }` +
                                                                " " +
                                                                patient.demograppatient<dEVIhic_map.fname +
                                                                " " +
                                                                patient.demographic_map.lname,
                                                            mr: patient.demographic_map.med_record,
                                                        },
                                                    })
                                                }
                                            >
                                                Visualizer
                                            </Buttons> */}

                                            <Buttons
                                                style={{ marginRight: "3%" }}
                                                type="secondary"
                                                onClick={() =>
                                                    history.push({
                                                        pathname: `/dashboard/patient/${pid}/billingmodule`,
                                                        state: {
                                                            pid: pid,
                                                            name:
                                                                `${patient.demographic_map.title === undefined
                                                                ? ""
                                                                : patient.demographic_map.title}` 
                                                                + " " +
                                                                patient.demographic_map.fname 
                                                                + " " +
                                                                patient.demographic_map.lname,
                                                            mr: patient.demographic_map.med_record,
                                                            phone: patient.demographic_map.phone_contact,
                                                            dob: patient.demographic_map.DOB,
                                                        },
                                                    })
                                                }
                                            >
                                                Billing
                                            </Buttons>
                                        </Col>
                                        <Col
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            span={4}
                                        >
                                            <Buttons
                                                style={{
                                                    border: "1px solid #878787",
                                                    borderRadius: "10px",
                                                    color: "#878787",
                                                    height: "40px",
                                                }}
                                                type="secondary"
                                                onClick={() =>
                                                    history.push(
                                                        `/dashboard/patient/edit/${patient.demographic_map.pid}`
                                                    )
                                                }
                                            >
                                                {Icons.editPencil({})}
                                                <span style={{ marginLeft: "4px" }}>Edit</span>
                                            </Buttons>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Affix>

                        <Row style={{ height: "68px", alignItems: "center" }}>
                            <Col span={7}>
                                <Row style={{ justifyContent: "flex-start" }}>
                                    {/* <Col span={10} offset={2}>
                                        <Buttons
                                            style={
                                                openPatientJourney ? activeButtonStyle : buttonStyle
                                            }
                                            onClick={() => {
                                                setPatientJourney(true);
                                            }}
                                            type="text"
                                        >
                                            Patient Journey
                                        </Buttons>
                                    </Col> */}
                                    {
                                        // <Col span={7}>
                                        // <Buttons
                                        //   style={
                                        //     !openPatientJourney && activeInfoSection === "summary"
                                        //       ? activeButtonStyle
                                        //       : buttonStyle
                                        //   }
                                        //   onClick={() => {
                                        //     setPatientJourney(false);
                                        //     setInfoSection("summary");
                                        //   }}
                                        //   type="text"
                                        // >
                                        //   Summary
                                        // </Buttons>
                                        // </Col>
                                    }
                                    <Col span={10} offset={2}>
                                        <Buttons
                                            style={
                                                !openPatientJourney && activeInfoSection === "notes"
                                                    ? activeButtonStyle
                                                    : buttonStyle
                                            }
                                            onClick={() => {
                                                setPatientJourney(false);
                                                setInfoSection("notes");
                                            }}
                                            type="text"
                                        >
                                            Notes
                                        </Buttons>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={17}>
                                <Row style={{ justifyContent: "center" }}>
                                    <Col span={22}>
                                        <Row style={{ height: "100%" }}>
                                            <Col span={24}>
                                                <Row style={{ height: "100%" }}>
                                                    <Buttons
                                                        style={
                                                            activeTab === "vitals"
                                                                ? activeButtonStyle
                                                                : buttonStyle
                                                        }
                                                        onClick={() => {
                                                            setActiveTab("vitals");
                                                        }}
                                                        type="text"
                                                    >
                                                        Vitals
                                                    </Buttons>
                                                    {/* <Buttons
                                                        style={
                                                            activeTab === "summary"
                                                                ? activeButtonStyle
                                                                : buttonStyle
                                                        }
                                                        onClick={() => {
                                                            openSummaryModal(!summaryModal);
                                                        }}
                                                        type="text"
                                                    >
                                                        Summary
                                                    </Buttons> */}
                                                    {/* <Buttons
                                                        style={
                                                            activeTab === "quickInfo"
                                                                ? activeButtonStyle
                                                                : buttonStyle
                                                        }
                                                        onClick={() => {
                                                            setActiveTab("quickInfo");
                                                        }}
                                                        type="text"
                                                    >
                                                        Trends
                                                    </Buttons> */}
                                                    <Buttons
                                                        style={
                                                            activeTab === "liveMonitor"
                                                                ? activeButtonStyle
                                                                : buttonStyle
                                                        }
                                                        onClick={() => {
                                                            setActiveTab("liveMonitor");
                                                        }}
                                                        type="text"
                                                    >
                                                        Live Monitor
                                                    </Buttons>
                                                    {/* <Buttons
                                                        style={
                                                            activeTab === "files"
                                                                ? activeButtonStyle
                                                                : buttonStyle
                                                        }
                                                        onClick={() => {
                                                            setActiveTab("files");
                                                        }}
                                                        type="text"
                                                    >
                                                        Files
                                                    </Buttons> */}
                                                    <Buttons
                                                        style={buttonStyle}
                                                        type="text"
                                                        onClick={() =>
                                                            history.push({
                                                                pathname: `/dashboard/patient/${pid}/graphvisualizer`,
                                                                state: {
                                                                    name:
                                                                        `${patient.demographic_map.title === undefined
                                                                            ? ""
                                                                            : patient.demographic_map.title
                                                                        }` +
                                                                        " " +
                                                                        patient.demographic_map.fname +
                                                                        " " +
                                                                        patient.demographic_map.lname,
                                                                    mr: patient.demographic_map.med_record,
                                                                    dob: patient.demographic_map.DOB,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        Visualizer
                                                    </Buttons>
                                                </Row>
                                            </Col>
                                            {
                                                // <Col span={13}>
                                                //   openPatientJourney ? (
                                                //   <Row className="patient-location-details">
                                                //     <Col
                                                //       className="patient-location-details-parts"
                                                //       span={10}
                                                //     >
                                                //       <div className="patient-location-details-parts-wardName">
                                                //         {Icons.locationTag({})}
                                                //         <h1 style={{ marginLeft: "8px" }}>
                                                //           {stepArray[activeStep]?.name}
                                                //         </h1>
                                                //       </div>
                                                //     </Col>
                                                //     <Col
                                                //       className="patient-location-details-parts"
                                                //       span={8}
                                                //     >
                                                //       <div
                                                //         className="patient-location-details-parts-location"
                                                //         style={{ fontSize: "1rem" }}
                                                //       >
                                                //         <p>{"Floor > Ward > Bed"}</p>
                                                //       </div>
                                                //     </Col>
                                                //     <Col
                                                //       className="patient-location-details-parts"
                                                //       span={6}
                                                //     >
                                                //       <div className="patient-location-details-parts-location">
                                                // <p>
                                                //   {(stepArray[activeStep]?.location?.floor ||
                                                //     "N/A") + " > "}
                                                //   {(stepArray[activeStep]?.location?.ward ||
                                                //     "N/A") + " > "}
                                                //   {stepArray[activeStep]?.bedNo || "N/A"}
                                                // </p>
                                                //       </div>
                                                //     </Col>
                                                //   </Row>
                                                // ) : null
                                                // </Col>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row align="top">
                            {!openPatientJourney ? (
                                <Col span={7}>
                                    <Row style={{ justifyContent: "flex-end" }}>
                                        <Col span={22}>
                                            <InfoBar
                                                pid={pid}
                                                drawerVisible={drawerVisible}
                                                doctorDrawerVisible={doctorDrawerVisible}
                                                setDoctorDrawerVisible={setDoctorDrawerVisible}
                                                setDrawerVisible={setDrawerVisible}
                                                refreshFileView={refreshFileView}
                                                refreshFileViewAgain={refreshFileViewAgain}
                                                patient={patient}
                                                activeInfoSection={activeInfoSection}
                                                setInfoSection={setInfoSection}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            ) : (
                                <Col span={7} className="steps-table">
                                    <div className="steps-table-body">
                                        <Steps
                                            setStepArray={setStepArray}
                                            activeStep={activeStep}
                                            setActiveStep={setActiveStep}
                                            stepArray={stepArray}
                                            durationArray={durationArray}
                                            setDurationArray={setDurationArray}
                                        />
                                    </div>
                                </Col>
                            )}
                            <Col span={17}>
                                <Row
                                    style={{
                                        justifyContent: "center",
                                        position: "relative",
                                    }}
                                >
                                    <Drawer
                                        placement="left"
                                        closable={true}
                                        visible={doctorDrawerVisible}
                                        getContainer={false}
                                        onClose={closeDoctorDrawer}
                                        className="infobox-drawer"
                                        width={256}
                                        height={450}
                                        style={{ position: "absolute" }}
                                    >
                                        <div>
                                            <div>
                                                <h1 style={{ fontWeight: "600" }}>
                                                    Primary Consultants
                                                </h1>
                                                {patient.demographic_map?.practictioner_patient_map?.primary_consultant?.map(
                                                    (item) => {
                                                        return <p>{item.fname + " " + item.lname}</p>;
                                                    }
                                                )}
                                            </div>
                                            <Divider />
                                            <div>
                                                <h1 style={{ fontWeight: "600" }}>
                                                    Secondary Consultants
                                                </h1>
                                                {patient.demographic_map?.practictioner_patient_map?.secondary_consultant?.map(
                                                    (item) => {
                                                        return <p>{item.fname + " " + item.lname}</p>;
                                                    }
                                                )}
                                            </div>
                                            <Divider />
                                            <div>
                                                <h1 style={{ fontWeight: "600" }}>Nurses</h1>
                                            </div>
                                        </div>
                                    </Drawer>


                                    <Col style={{ marginBottom: "6%" }} span={22}>
                                        <Row
                                            span={24}
                                            style={{ margin: "0em 0 0 0", minHeight: "500px", height: "calc(100vh - 210px)" }}
                                        >
                                            <Col span={24}>
                                                {tabInventory.map((item, index) => {
                                                    if (activeTab === item.name) {
                                                        if (item.name === "liveMonitor") {
                                                            return item.component;
                                                        } else
                                                            return (
                                                                <item.component
                                                                    key={index}
                                                                    pid={pid}
                                                                    patient={patient}
                                                                    wardArray={stepArray}
                                                                    activeStep={activeStep}
                                                                    refreshFileView={refreshFileView}
                                                                    summaryModal={summaryModal}
                                                                    openSummaryModal={openSummaryModal}
                                                                    valDuration={props?.location?.state?.dataFilterHeader?.valDuration || "7d"}
                                                                />
                                                            );
                                                    }
                                                })}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>

                            <Modal
                                destroyOnClose={true}
                                centered
                                visible={quickInfo}
                                width="75vw"
                                footer={null}
                                onCancel={closeQuickInfo}
                                bodyStyle={{ backgroundColor: "white", padding: "2em 4em" }}
                            >
                                <DeviceManagement 
                                    pid={pid} 
                                    patient={patient}
                                    setPatient={setPatient}
                                    valDuration={props?.location?.state?.dataFilterHeader?.valDuration || "7d"} 
                                />
                            </Modal>
                        </Row>{" "}
                        {
                            //   (
                            //   <div>
                            //     <div>
                            //       <Row className="patient-journey-main-body">
                            //         <Col span={7} className="steps-table">
                            //           <div className="steps-table-body">
                            //             <Steps
                            //               setStepArray={setStepArray}
                            //               activeStep={activeStep}
                            //               setActiveStep={setActiveStep}
                            //               stepArray={stepArray}
                            //               durationArray={durationArray}
                            //               setDurationArray={setDurationArray}
                            //             />
                            //           </div>
                            //         </Col>
                            //         {
                            //           //   <Col span={17} className="steps-info">
                            //           // <WardDetails
                            //           //   patient={patient}
                            //           //   wardArray={stepArray}
                            //           //   activeStep={activeStep}
                            //           // />
                            //           //   </Col>
                            //         }
                            //       </Row>
                            //     </div>
                            //   </div>
                            // )
                        }
                    </Spin>
                </>
            )}
            {(patient === null && isLoading !== true) && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <Empty></Empty>
                </div>
            )}
        </>
    );
}
