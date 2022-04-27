import React, { useState, useEffect } from "react";
import moment from "moment";
import { Button as CustomBtn } from "../../Theme/Components/Button/button";
import {
    Dropdown,
    Button,
    Menu,
    Switch,
    Badge,
    DatePicker,
    Collapse,
    notification,
    Spin,
    Table,
} from "antd";
import {
    LeftOutlined,
    SearchOutlined,
    CloseOutlined,
    DownOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import GreenTick from "../../Assets/Icons/greenTick";
import PillIcon from "../../Assets/Icons/pillIcon";
import Marker from "../../Assets/Icons/marker";
import Icons from "../../Utils/iconMap";
import SorterIcon from "../../Assets/Icons/sorter";

import MedicineCollapse from "./Components/MedicineCollapse/MedicineCollapse";
import MedicinePanelContent from "./Components/MedicinePanel/MedicinePanelContent";

import medicationApi from "../../Apis/medicationApis";
import patientApi from "../../Apis/patientApis";

import "./medicineReminder.css";

function MedicineReminderPage() {

    const [activeItem, setActiveItem] = useState(0);

    const [scrollerHeight, setScrollerHeight] = useState(55);

    const [changeui, setChangeui] = useState(true);

    const [isTabletState, setIsTabletState] = useState(true);

    const [isInjectionState, setIsInjectionState] = useState(false);

    const [isSprayState, setIsSprayState] = useState(false);

    const [medication, setMedication] = useState({})

    const [medicationArray, setMedicationArray] = useState([])

    const [loadingMedication, setLoadingMedication] = useState(true)

    const [currentPeriod, setcurrentPeriod] = useState("morning")

    const [currentTimeline, setCurrentTimeline] = useState("Next 30 Min")

    const [totalTablets, setTotalTablets] = useState(0)

    const [totalInjections, setTotalInjections] = useState(0)

    const [totalSprays, setTotalSprays] = useState(0)

    const [selectedMeds, setSelectedMeds] = useState([])

    const [totalToBeMedicated, setTotalToBeMedicated] = useState(0)

    const [searchInputData, setsearchInputData] = useState("")

    const menu = (
        <Menu>
            <Menu.Item onClick={() => { setCurrentTimeline("Next 1 Hr"); setScrollerHeight(132) }} key="1">
                Next 1 Hr
            </Menu.Item>
            <Menu.Item onClick={() => { setCurrentTimeline("Next 2 Hrs"); setScrollerHeight(283) }} key="2">
                Next 2 Hrs
            </Menu.Item>
            <Menu.Item onClick={() => { setCurrentTimeline("Next 3 Hrs"); setScrollerHeight(434) }} key="3">
                Next 3 Hrs
            </Menu.Item>
        </Menu>
    );


    function getTimedMedication(timing, from, to) {
        medicationApi.getMedications(timing, from, to)
            .then(res => {
                console.log("RESPONSE-----", res.data?.response.schedule)
                if (Object.keys(res.data?.response.schedule).length === 0) {
                    setErrorState(true)
                    notification.error({
                        message: 'Could not fetch Medicines',
                    });
                }
                else {
                    setMedication(res.data?.response.schedule);
                    setMedicationArray(Object.values(res.data?.response.schedule));
                    populateFutureMedication(Object.values(res.data?.response.schedule), res.data?.response.schedule);
                    // getParticularPatients(Object.values(res.data?.response.schedule), res.data?.response.schedule)
                    setLoadingMedication(false);
                }
            })
            .catch(err => {
                console.log(err)
                notification.error({
                    message: 'Could not fetch medicines',
                });
            })
    }

    function getTimedMedicationRefreshed(timing, from, to) {
        medicationApi.getMedicationsRefreshed(timing, from, to)
            .then(res => {
                console.log("RESPONSE-----", res.data?.response.schedule)
                if (Object.keys(res.data?.response.schedule).length === 0) {
                    setErrorState(true)
                    notification.error({
                        message: 'Could not fetch Medicines',
                    });
                }
                else {
                    setMedication(res.data?.response.schedule);
                    setMedicationArray(Object.values(res.data?.response.schedule));
                    populateFutureMedication(Object.values(res.data?.response.schedule), res.data?.response.schedule);
                    // getParticularPatients(Object.values(res.data?.response.schedule), res.data?.response.schedule)
                    setLoadingMedication(false);
                }
            })
            .catch(err => {
                console.log(err)
                notification.error({
                    message: 'Could not fetch medicines',
                });
            })
    }

    const time_menu = (
        <Menu>
            <Menu.Item onClick={() => { setLoadingMedication(true); setcurrentPeriod("morning"); getTimedMedication("morning", currentSelectedDate, currentSelectedDate) }} key="1">Morning</Menu.Item>
            <Menu.Item onClick={() => { setLoadingMedication(true); setcurrentPeriod("noon"); getTimedMedication("noon", currentSelectedDate, currentSelectedDate) }} key="2">Noon</Menu.Item>
            <Menu.Item onClick={() => { setLoadingMedication(true); setcurrentPeriod("evening"); getTimedMedication("evening", currentSelectedDate, currentSelectedDate) }} key="3">Evening</Menu.Item>
        </Menu>
    );

    function getToBeMedicated(medicationData) {
        var temp = Object.keys(medicationData).length
        for (let i = 0; i < Object.keys(medicationData).length; i++) {
            var totalCount = 0;
            var treatedCount = 0;
            medicationData[Object.keys(medicationData)[i]].drugs.map(med => {
                if (med.hasOwnProperty(`today_administered_${currentPeriod}`)) {
                    treatedCount = treatedCount + 1;
                }
                totalCount = totalCount + 1;
            })
            if (((treatedCount / totalCount) * 100).toFixed(0) == 100) {
                temp = temp - 1
            }
        }
        return temp;
    }

    function createItemButton() {
        var tempTreatedPerc = {}
        for (let i = 0; i < Object.keys(medication).length; i++) {
            var totalCount = 0;
            var treatedCount = 0;
            medication[Object.keys(medication)[i]].drugs.map(med => {
                if (med.hasOwnProperty(`today_administered_${currentPeriod}`)) {
                    treatedCount = treatedCount + 1;
                }
                totalCount = totalCount + 1;
            })
            tempTreatedPerc = {
                ...tempTreatedPerc,
                [Object.keys(medication)[i]]: ((treatedCount / totalCount) * 100).toFixed(0)
            }
        }

        let buttons = [];
        let bednum = 0;
        for (let i = 0; i < Object.keys(medication).length; i++) {
            bednum = bednum + 1
            buttons.push(
                <div style={{ textAlign: "center", position: "relative" }}>
                    <Button
                        type="text"
                        onClick={() => {
                            setActiveItem(i);
                        }}
                        style={chooseItemButtonStyle(i)}
                    >
                        {`B${bednum.toString()}A`}
                        {activeItem !== i ? (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    height: "100%",
                                    width: `${tempTreatedPerc[Object.keys(medication)[i]]}%`,
                                    backgroundColor: "#C8FFC6",
                                    zIndex: "-1",
                                    borderRadius: "6px",
                                }}
                            ></div>
                        ) : null}
                    </Button>
                </div>
            );
        }
        return buttons;
    }

    function chooseItemButtonStyle(i) {
        if (i === activeItem) {
            return itemButtonActiveStyle;
        } else return itemButtonStyle;
    }

    const itemButtonActiveStyle = {
        fontFamily: "Lexend",
        width: "110px",
        margin: "10px",
        height: "64px",
        color: "white",
        fontWeight: "500",
        opacity: "100",
        fontSize: "16px",
        border: "none",
        background: "#393939",
        opacity: "0.8",
        boxShadow: "0px 18px 26px 3px rgba(0, 0, 0, 0.06)",
        position: "relative",
    };

    const itemButtonStyle = {
        fontFamily: "Lexend",
        width: "100px",
        margin: "10px",
        height: "64px",
        color: "#525151",
        fontWeight: "500",
        opacity: "100",
        fontSize: "16px",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        background: "white",
        opacity: "0.8",
        boxShadow: "0px 18px 26px 3px rgba(0, 0, 0, 0.06)",
        position: "relative",
    };

    const timelineData = [
        {
            time: "8:30 a.m.",
            number: 4,
        },
        {
            time: "9:00 a.m.",
            number: 8,
        },
        {
            time: "9:30 a.m.",
            number: 0,
        },
        {
            time: "10:00 a.m.",
            number: 1,
        },
        {
            time: "10:30 a.m.",
            number: 12,
        },
        {
            time: "11:00 a.m.",
            number: 1,
        },
        {
            time: "11:30 a.m.",
            number: 9,
        },
        {
            time: "12:00 p.m.",
            number: 5,
        },
        {
            time: "12:30 p.m.",
            number: 2,
        },
        {
            time: "1:00 p.m.",
            number: 11,
        },
        {
            time: "1:30 a.m.",
            number: 10,
        },
    ];

    const { Panel } = Collapse;

    const [futureMedicationItems, setFutureMedicationItems] = useState([{ "TABLET": [] }, { "INJECTION, POWDER, LYOPHILIZED, FOR SOLUTION": [] }, { "CAPSULE": [] }])

    const [totalPatientData, setTotalPatientData] = useState({})

    //TODO: USE THIS AFTER ALPHA
    // function getParticularPatients(items, pids) {
    //     items.map((meds, pid) => {
    //         patientApi.getPatientData(Object.keys(pids)[pid])
    //             .then(res => {
    //                 var tempApiData = res.data.response.patients[0].demographic_map
    //                 totalPatientData[Object.keys(pids)[pid]] = {
    //                     bednumber: tempApiData.id,
    //                     name: `${tempApiData.title} ${tempApiData.fname} ${tempApiData.mname} ${tempApiData.lname}`,
    //                 }
    //                 setTotalPatientData({
    //                     ...totalPatientData
    //                 })
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 notification.error({
    //                     message: 'Error',
    //                     description: `${err}`
    //                 });
    //             })
    //     })
    //     console.log(totalPatientData)
    // }

    function populateFutureMedication(items, pids) {
        setTotalTablets(0)
        setTotalInjections(0)
        setTotalSprays(0)
        var tablets = 0
        var injections = 0
        var capsules = 0
        var tempFutureMedicationItems = [{ "TABLET": [] }, { "INJECTION, POWDER, LYOPHILIZED, FOR SOLUTION": [] }, { "CAPSULE": [] }]
        items.map((meds, pid) => {
            meds.drugs.map(med => {
                if (!med.hasOwnProperty(`today_administered_${currentPeriod}`)) {
                    var i = 0
                    for (i = 0; i < tempFutureMedicationItems.length; i++) {
                        if (Object.keys(tempFutureMedicationItems[i])[0] === med.type) {

                            var flag = true
                            tempFutureMedicationItems[i][med.type].map((drug, index) => {
                                if (Object.keys(drug)[0] === med.drugName) {
                                    tempFutureMedicationItems[i][med.type][index][med.drugName].push(Object.keys(pids)[pid])
                                    //TODO: WHEN ALL PATIENTS HAVE DOSAGES IN DB USE THE LINE BELOW
                                    // tempFutureMedicationItems[i][med.type][index][med.drugName].push({ [Object.keys(pids)[pid]]: med.dosage })
                                    flag = false
                                    if (med.type === "TABLET") {
                                        tablets = tablets + 1
                                    }
                                    else if (med.type === "INJECTION, POWDER, LYOPHILIZED, FOR SOLUTION") {
                                        injections = injections + 1
                                    }
                                    else if (med.type === "CAPSULE") {
                                        capsules = capsules + 1
                                    }
                                }
                            })

                            if (flag) {
                                tempFutureMedicationItems[i][med.type].push({ [med.drugName]: [Object.keys(pids)[pid]] })
                                if (med.type === "TABLET") {
                                    tablets = tablets + 1
                                }
                                else if (med.type === "INJECTION, POWDER, LYOPHILIZED, FOR SOLUTION") {
                                    injections = injections + 1
                                }
                                else if (med.type === "CAPSULE") {
                                    capsules = capsules + 1
                                }
                            }

                        }
                    }
                }
            })
        })
        setFutureMedicationItems(tempFutureMedicationItems)
        console.log(tempFutureMedicationItems)
        console.log("T-----", tablets, "C------", capsules, "I-----", injections)
        setTotalTablets(tablets)
        setTotalInjections(injections)
        setTotalSprays(capsules)
    }

    function checkSelectedMed(prsc_id) {
        for (var i = 0; i < selectedMeds.length; i++) {
            if (selectedMeds[i] === prsc_id) {
                return true
            }
        }
        return false
    }

    function markAllMeds() {
        var temp3 = []
        medicationArray[activeItem].drugs.map((med) => {
            if (!med.hasOwnProperty(`today_administered_${currentPeriod}`)) {
                temp3 = [...temp3, med.prsc_id]
            }
        })
        setSelectedMeds([...temp3])
    }

    function markSelectedMeds() {
        setLoadingMedication(true)
        medicationApi.markMedicines({
            "prsc_id": selectedMeds,
        })
            .then(res => {
                console.log(res)
                notification.success({
                    message: 'Marked!',
                    description: 'Selected Meds Have Been Marked'
                });
                getTimedMedicationRefreshed(currentPeriod)
            })
            .catch(err => {
                console.log(err)
                notification.error({
                    message: 'Error',
                    description: `${err}`
                });
            })
        // getTimedMedication(currentPeriod)
    }

    function disabledDate(current) {
        var temp = new Date()
        return current < moment(`${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`, 'YYYY-MM-DD');
    }
    const dateFormat = 'YYYY/MM/DD';
    var date = new Date()


    useEffect(() => {
        var tempPeriod
        var tempDate = new Date()
        var tempMonth = tempDate.getMonth() + 1
        if (tempMonth < 10) {
            setCurrentSelectedDate(`${tempDate.getFullYear()}-0${tempMonth}-${tempDate.getDate()}`)
        }
        else {
            setCurrentSelectedDate(`${tempDate.getFullYear()}-${tempMonth}-${tempDate.getDate()}`)
        }
        if (tempMonth < 10) {
            setInitialDateState(`${tempDate.getFullYear()}-0${tempMonth}-${tempDate.getDate()}`)
        }
        else {
            setInitialDateState(`${tempDate.getFullYear()}-${tempMonth}-${tempDate.getDate()}`)
        }
        var from = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`
        var to = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`
        if (tempDate.getHours() >= 0 && tempDate.getHours() < 12) {
            tempPeriod = "morning"
            setcurrentPeriod("morning")
        }
        else if (tempDate.getHours() >= 12 && tempDate.getHours() < 18) {
            tempPeriod = "noon"
            setcurrentPeriod("noon")
        }
        else if (tempDate.getHours() >= 18 && tempDate.getHours() < 24) {
            tempPeriod = "evening"
            setcurrentPeriod("evening")
        }

        medicationApi.getMedications(tempPeriod, from, to)
            .then(res => {
                console.log(res.data)
                if (Object.keys(res.data?.response.schedule).length === 0) {
                    setErrorState(true)
                    notification.error({
                        message: 'Could not fetch Medicines',
                    });
                }
                else {
                    setMedication(res.data?.response.schedule);
                    // setTotalToBeMedicated(Object.keys(res.data?.response.schedule).length)
                    setMedicationArray(Object.values(res.data?.response.schedule));
                    populateFutureMedication(Object.values(res.data?.response.schedule), res.data?.response.schedule);
                    // getParticularPatients(Object.values(res.data?.response.schedule), res.data?.response.schedule)
                    setLoadingMedication(false);
                }
                console.log(res.data?.response.schedule);
                console.log(Object.values(res.data?.response.schedule));
            })
            .catch(err => {
                console.log(err)
                notification.error({
                    message: 'Error',
                    description: `${err}`
                });
            })
    }, [])

    const [errorState, setErrorState] = useState(false)
    const [initialDateState, setInitialDateState] = useState('')
    const [currentSelectedDate, setCurrentSelectedDate] = useState('')

    function onChangeDatePicker(date, dateString) {
        var tempDateString = dateString.replace(/\//g, "-")
        setCurrentSelectedDate(tempDateString)
        setLoadingMedication(true)
        getTimedMedication(currentPeriod, tempDateString, tempDateString)
    }

    return (
        errorState
            ?
            (
                <div style={{ width: "100%", height: "100%" }} >
                    <div className="medicine-reminder-bar">
                        <div className="medicine-header">
                            {/* <LeftOutlined /> */}
                            <p>Medicine Reminder</p>
                        </div>
                        <div className="missed-only" style={{ opacity: "0" }} >
                            <Switch style={{ cursor: "auto" }} />
                            <h1>Missed Only</h1>
                            <Badge
                                status="error"
                                style={{ marginLeft: "0px", marginBottom: "10px" }}
                            />
                            <p>{2}</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "88%", width: "100%", backgroundColor: "white" }} >
                        <Table dataSource={[]} columns={[]} size="large" bordered={false} />
                    </div>
                </div>
            )
            :
            loadingMedication
                ?
                (
                    <div style={{ height: "100%", width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Spin />
                    </div>
                )
                :
                (
                    <div className="medicine-page-container">
                        <div className="medicine-reminder-bar">
                            <div className="medicine-header">
                                {/* <LeftOutlined /> */}
                                <p>Medicine Reminder</p>
                            </div>
                            <div className="missed-only" style={{ opacity: "0" }} >
                                <Switch style={{ cursor: "auto" }} />
                                <h1>Missed Only</h1>
                                <Badge
                                    status="error"
                                    style={{ marginLeft: "0px", marginBottom: "10px" }}
                                />
                                <p>{2}</p>
                            </div>
                        </div>
                        <div className="medicine-category-bar">
                            {changeui ? (
                                <div className="number-container">
                                    <div className="medicine-number">{getToBeMedicated(medication)}</div>
                                    <div className="medicine-number-info">
                                        Patients Yet to be Medicated
                                    </div>
                                </div>
                            ) : (
                                <div className="number-container">
                                    <div className="medicine-number">{totalTablets + totalInjections + totalSprays}</div>
                                    <div className="medicine-number-info">
                                        Medicines Need to be given
                                    </div>
                                </div>
                            )}

                            <div className="date-time-container">
                                <DatePicker
                                    onChange={onChangeDatePicker}
                                    defaultValue={moment(currentSelectedDate, dateFormat)}
                                    format={dateFormat}
                                    disabledDate={disabledDate}
                                    style={{
                                        border: "none",
                                        marginRight: "10px",
                                    }}
                                />
                                <Dropdown overlay={time_menu} trigger={['click']}>
                                    <Button
                                        style={{
                                            padding: "25px 20px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            fontFamily: "Lexend",
                                            color: "rgb(20, 55, 101, 0.5)",
                                            border: "none",
                                        }}
                                    >
                                        {" "}
                                        {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)} <DownOutlined style={{ marginLeft: "26px" }} />
                                    </Button>
                                </Dropdown>
                            </div>
                            <div style={{ width: "18%" }} className="medicine-toggle-container">
                                <div className="medicine-toggle-container-btn">
                                    <div
                                        style={{ borderBottom: "3px solid #2C2C2C" }}
                                        className="medicine-active"
                                        onClick={() => setChangeui(true)}
                                    >
                                        Medication Task
                                    </div>
                                    {/* <div
                                    className={
                                        changeui
                                            ? "medicine-active medicine-left-anim-part-one"
                                            : "medicine-non-active medicine-right-anim-part-one"
                                    }
                                    onClick={() => setChangeui(true)}
                                >
                                    Medication Task
                                </div>
                                <div className={
                                    changeui ? "medicine-non-active medicine-left-anim-part-two" : "medicine-active medicine-right-anim-part-two"
                                }
                                    onClick={() => setChangeui(false)}
                                >
                                    Future Medication
                                </div> */}
                                </div>
                            </div>
                        </div>
                        {changeui ? (
                            <div className="medicine-bottom-container">
                                <div className="medicine-left-container">
                                    <div className="medicine-left-top-container">
                                        <div className="medicine-search-bar">
                                            <Button
                                                style={{
                                                    padding: "25px 60px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#000000",
                                                }}
                                            >
                                                {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
                                            </Button>
                                            <div className="medicine-search-input">
                                                <SearchOutlined style={{ fontSize: "20px" }} />
                                                <input
                                                    onChange={(e) => { setsearchInputData(e.target.value) }}
                                                    style={{ width: "92%" }}
                                                    placeholder="Search"
                                                    defaultValue=""
                                                ></input>
                                                <CloseOutlined style={{ fontSize: "20px" }} />
                                            </div>
                                            <Button
                                                style={{
                                                    padding: "25px 60px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#000000",
                                                }}
                                            >
                                                Search
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="medicine-left-bottom-container">
                                        <div className="medicine-info-container">
                                            <div className="medicine-container-header">
                                                <div className="patient-bed-details">
                                                    <div className="patient-bed-icon">
                                                        {Icons.patientInBedIcon({ Style: { width: "30px" } })}
                                                        {/* <BoxPlotOutlined style={{ fontSize: '30px' }} /> */}
                                                        <p style={{ marginBottom: "0px" }}>
                                                            {
                                                                //TODO: ADD BED NUMBER WHEN ADDED IN API
                                                                // Object.values(totalPatientData)[activeItem].bednumber
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="patient-bed-detail">
                                                        <div className="patient-name">
                                                            {
                                                                medicationArray[activeItem].pName
                                                            }
                                                        </div>
                                                        <div className="patient-id">MR2021F8969</div>
                                                    </div>
                                                </div>
                                                {
                                                    (date.getHours() >= 0 && date.getHours() < 12 && currentPeriod === "morning" && initialDateState === currentSelectedDate) || (date.getHours() >= 12 && date.getHours() < 18 && currentPeriod === "noon" && initialDateState === currentSelectedDate) || (date.getHours() >= 18 && date.getHours() < 24 && currentPeriod === "evening" && initialDateState === currentSelectedDate)
                                                        ?
                                                        (
                                                            <div className="medicine-container-header-btn">
                                                                <CustomBtn onClick={() => { markAllMeds() }} className="secondary">Select All</CustomBtn>
                                                                <CustomBtn onClick={() => { markSelectedMeds() }} style={{ padding: "5% 15%" }} >Save</CustomBtn>
                                                            </div>
                                                        )
                                                        :
                                                        console.log(initialDateState, currentSelectedDate)
                                                }

                                            </div>
                                            <div className="medicine-container">
                                                {
                                                    searchInputData === ""
                                                        ?
                                                        medicationArray[activeItem].drugs.map((med) => (
                                                            <div
                                                                onClick={() => {
                                                                    if (checkSelectedMed(med.prsc_id)) {
                                                                        var temp2 = selectedMeds
                                                                        const index = temp2.indexOf(med.prsc_id)
                                                                        temp2.splice(index, 1)
                                                                        setSelectedMeds([...temp2])
                                                                    }
                                                                    else {
                                                                        var temp = selectedMeds
                                                                        temp = [...temp, med.prsc_id]
                                                                        setSelectedMeds(temp)
                                                                    }
                                                                }}
                                                                className="medicine-card"
                                                                style={
                                                                    med.hasOwnProperty(`today_administered_${currentPeriod}`) || checkSelectedMed(med.prsc_id) ? { backgroundColor: "#C8FFC6" } : null
                                                                }
                                                            >
                                                                <div className="medicine-name">{med.drugName}</div>
                                                                <div className="medicine-details">
                                                                    <div className="medicine-dosage">
                                                                        <PillIcon />
                                                                        {med.dosage} dosage
                                                                    </div>
                                                                    <div className="medicine-time">{currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}</div>
                                                                    {med.hasOwnProperty(`today_administered_${currentPeriod}`) ? <GreenTick /> : null}
                                                                </div>
                                                            </div>
                                                        ))
                                                        :
                                                        medicationArray[activeItem].drugs.map((med) => (
                                                            med.drugName.includes(searchInputData)
                                                                ?
                                                                <div
                                                                    onClick={() => {
                                                                        if (checkSelectedMed(med.prsc_id)) {
                                                                            var temp2 = selectedMeds
                                                                            const index = temp2.indexOf(med.prsc_id)
                                                                            temp2.splice(index, 1)
                                                                            setSelectedMeds([...temp2])
                                                                        }
                                                                        else {
                                                                            var temp = selectedMeds
                                                                            temp = [...temp, med.prsc_id]
                                                                            setSelectedMeds(temp)
                                                                        }
                                                                    }}
                                                                    className="medicine-card"
                                                                    style={
                                                                        med.hasOwnProperty(`today_administered_${currentPeriod}`) || checkSelectedMed(med.prsc_id) ? { backgroundColor: "#C8FFC6" } : null
                                                                    }
                                                                >
                                                                    <div className="medicine-name">{med.drugName}</div>
                                                                    <div className="medicine-details">
                                                                        <div className="medicine-dosage">
                                                                            <PillIcon />
                                                                            {med.dosage} dosage
                                                                        </div>
                                                                        <div className="medicine-time">{currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}</div>
                                                                        {med.hasOwnProperty(`today_administered_${currentPeriod}`) ? <GreenTick /> : null}
                                                                    </div>
                                                                </div>
                                                                :
                                                                null
                                                        ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="medicine-right-container">
                                    <div className="patient-filter">
                                        <Button
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: "16px",
                                                fontWeight: "500",
                                                fontFamily: "Lexend",
                                                border: "none",
                                                background: "none",
                                                color: "rgb(20, 55, 101, 0.5)",
                                            }}
                                        >
                                            {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
                                        </Button>
                                        <SorterIcon />
                                        <p
                                            style={{
                                                marginBottom: "0px",
                                                color: "#777777",
                                                fontFamily: "Lexend",
                                                fontWeight: "500",
                                                fontSize: "16px",
                                            }}
                                        >
                                            Total: {Object.keys(medication).length} Patients
                                        </p>
                                    </div>
                                    <div className="scroller-ele-container">
                                        {createItemButton().map((item) => {
                                            return item;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="medicine-future-bottom-container">
                                <div style={{ width: "49%" }}>
                                    <div className="medicine-type-toggle-container">
                                        <div className="medicine-type-toggle-container-btn">
                                            <div
                                                style={{
                                                    position: "relative",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                className={
                                                    isTabletState
                                                        ? "medicine-type-active"
                                                        : "medicine-type-non-active"
                                                }
                                                onClick={() => {
                                                    setIsTabletState(true);
                                                    setIsSprayState(false);
                                                    setIsInjectionState(false);
                                                }}
                                            >
                                                {Icons.pillIconTwo({ Style: { width: "50px" } })}
                                                <div style={{ marginRight: "8%" }}>Tablets</div>
                                                <div>
                                                    {totalTablets}
                                                </div>
                                                {isTabletState ? (
                                                    <div className="type-active-anim-btn"></div>
                                                ) : null}
                                            </div>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                className={
                                                    isInjectionState
                                                        ? "medicine-type-active"
                                                        : "medicine-type-non-active"
                                                }
                                                onClick={() => {
                                                    setIsTabletState(false);
                                                    setIsSprayState(false);
                                                    setIsInjectionState(true);
                                                }}
                                            >
                                                {Icons.injectionIcon({ Style: { width: "50px" } })}
                                                <div style={{ marginRight: "8%" }}>Injections</div>
                                                <div>
                                                    {totalInjections}
                                                </div>
                                                {isInjectionState ? (
                                                    <div className="type-active-anim-btn"></div>
                                                ) : null}
                                            </div>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                className={
                                                    isSprayState
                                                        ? "medicine-type-active"
                                                        : "medicine-type-non-active"
                                                }
                                                onClick={() => {
                                                    setIsTabletState(false);
                                                    setIsSprayState(true);
                                                    setIsInjectionState(false);
                                                }}
                                            >
                                                {Icons.sprayIcon({ Style: { width: "50px" } })}
                                                <div style={{ marginRight: "8%" }}>Spray</div>
                                                <div>
                                                    {totalSprays}
                                                </div>
                                                {isSprayState ? (
                                                    <div className="type-active-anim-btn"></div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {isTabletState ? (
                                        <div className="medicine-future-bottom-left-container">
                                            <Collapse
                                                defaultActiveKey={["1"]}
                                                expandIconPosition="right"
                                                style={{ border: "none" }}
                                            >
                                                {
                                                    futureMedicationItems[0]["TABLET"].map((meds, index) => (
                                                        <Panel
                                                            header={
                                                                <MedicineCollapse
                                                                    specs={{
                                                                        number: meds[Object.keys(meds)[0]].length,
                                                                        drug: Object.keys(meds)[0],
                                                                        type: "TABLET",
                                                                    }}
                                                                />
                                                            }
                                                            key={index + 1}
                                                            style={{ border: "none" }}
                                                        >
                                                            {
                                                                meds[Object.keys(meds)[0]].map(med => (
                                                                    <MedicinePanelContent
                                                                        pdata={totalPatientData[med]}
                                                                        dosage={1}
                                                                        pName={medication[med].pName}
                                                                    />
                                                                    //TODO: USE THE PROPS BELOW WHEN ALL PATIENTS HAVE DOSAGE IN DB
                                                                    // <MedicinePanelContent
                                                                    //     pdata={totalPatientData[Object.keys(med)[0]]}
                                                                    //     dosage={med[Object.keys(med)[0]]}
                                                                    //     pName={medication[Object.keys(med)[0]].pName}
                                                                    // />
                                                                ))
                                                            }
                                                        </Panel>
                                                    ))
                                                }
                                            </Collapse>
                                        </div>
                                    ) : null}
                                    {isInjectionState ? (
                                        <div className="medicine-future-bottom-left-container">
                                            <Collapse
                                                defaultActiveKey={["1"]}
                                                expandIconPosition="right"
                                                style={{ border: "none" }}
                                            >
                                                {
                                                    futureMedicationItems[1]["INJECTION, POWDER, LYOPHILIZED, FOR SOLUTION"].map((meds, index) => (
                                                        <Panel
                                                            header={
                                                                <MedicineCollapse
                                                                    specs={{
                                                                        number: meds[Object.keys(meds)[0]].length,
                                                                        drug: Object.keys(meds)[0],
                                                                        type: "INJECTION",
                                                                    }}
                                                                />
                                                            }
                                                            key={index + 1}
                                                            style={{ border: "none" }}
                                                        >
                                                            {
                                                                meds[Object.keys(meds)[0]].map(med => (
                                                                    <MedicinePanelContent
                                                                        pdata={totalPatientData[med]}
                                                                        dosage={1}
                                                                        pName={medication[med].pName}
                                                                    />
                                                                    //TODO: USE THE PROPS BELOW WHEN ALL PATIENTS HAVE DOSAGE IN DB
                                                                    // <MedicinePanelContent
                                                                    //     pdata={totalPatientData[Object.keys(med)[0]]}
                                                                    //     dosage={med[Object.keys(med)[0]]}
                                                                    //     pName={medication[Object.keys(med)[0]].pName}
                                                                    // />
                                                                ))
                                                            }
                                                        </Panel>
                                                    ))
                                                }
                                            </Collapse>
                                        </div>
                                    ) : null}
                                    {isSprayState ? (
                                        <div className="medicine-future-bottom-left-container">
                                            <Collapse
                                                defaultActiveKey={["1"]}
                                                expandIconPosition="right"
                                                style={{ border: "none" }}
                                            >
                                                {
                                                    futureMedicationItems[2]["CAPSULE"].map((meds, index) => (
                                                        <Panel
                                                            header={
                                                                <MedicineCollapse
                                                                    specs={{
                                                                        number: meds[Object.keys(meds)[0]].length,
                                                                        drug: Object.keys(meds)[0],
                                                                        type: "CAPSULE",
                                                                    }}
                                                                />
                                                            }
                                                            key={index + 1}
                                                            style={{ border: "none" }}
                                                        >
                                                            {
                                                                meds[Object.keys(meds)[0]].map(med => (
                                                                    <MedicinePanelContent
                                                                        pdata={totalPatientData[med]}
                                                                        dosage={1}
                                                                        pName={medication[med].pName}
                                                                    />
                                                                    //TODO: USE THE PROPS BELOW WHEN ALL PATIENTS HAVE DOSAGE IN DB
                                                                    // <MedicinePanelContent
                                                                    //     pdata={totalPatientData[Object.keys(med)[0]]}
                                                                    //     dosage={med[Object.keys(med)[0]]}
                                                                    //     pName={medication[Object.keys(med)[0]].pName}
                                                                    // />
                                                                ))
                                                            }
                                                        </Panel>
                                                    ))
                                                }
                                            </Collapse>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="medicine-future-bottom-right-container">
                                    <div className="patient-filter-two">
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    fontFamily: "Lexend",
                                                    border: "none",
                                                    background: "none",
                                                    color: "rgb(20, 55, 101, 0.5)",
                                                }}
                                            >
                                                {currentTimeline} <DownOutlined style={{ marginLeft: "26px" }} />
                                            </Button>
                                        </Dropdown>
                                        <SorterIcon />
                                        <p
                                            style={{
                                                marginBottom: "0px",
                                                color: "#777777",
                                                fontFamily: "Lexend",
                                                fontWeight: "500",
                                                fontSize: "16px",
                                            }}
                                        >
                                            Total: {totalTablets + totalInjections + totalSprays} Patients
                                        </p>
                                    </div>
                                    <div className="patient-time-container">
                                        <div className="timelie-scroller">
                                            <div style={{ height: "20px" }}>
                                                <Marker />
                                            </div>
                                            <div
                                                style={{
                                                    backgroundColor: "black",
                                                    marginLeft: "16px",
                                                    height: `${scrollerHeight}px`,
                                                    width: "1px",
                                                    transition: "all",
                                                    transitionDuration: "0.5s",
                                                }}
                                            ></div>
                                            <div style={{ height: "20px" }}>
                                                <Marker />
                                            </div>
                                        </div>
                                        <div className="timeline-items">
                                            {timelineData.map((item) => {
                                                var temp;
                                                temp = 2.5 * item.number;
                                                var width = `${temp}vw`;
                                                return (
                                                    <div className="timeline-item">
                                                        <div className="timeline-item-time">{item.time}</div>
                                                        <div className="timeline-item-patients">
                                                            {item.number} Patients
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    content: "",
                                                                    height: "100%",
                                                                    width: width,
                                                                    backgroundColor: "#C8FFC6",
                                                                    top: "0px",
                                                                    left: "0px",
                                                                    zIndex: "-1",
                                                                    borderRadius: "6px",
                                                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
    );
}

export default MedicineReminderPage;
