import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Button as CusBtn } from "../../Theme/Components/Button/button";
import {
    Menu,
    Dropdown,
    Button,
    Collapse,
    Input,
    DatePicker,
    TimePicker,
    Spin,
    Table,
    Checkbox,
    Row,
    Col,
    notification
} from "antd";
import {
    CloseOutlined,
    CheckCircleOutlined,
    DownOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
// import Pdf from "react-to-pdf";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import moment from "moment";
import { InfluxDB } from "@influxdata/influxdb-client";

import { UserStore } from "../../Stores/userStore";

import "./billingModule.css";

import billingApi from "../../Apis/billingApis";
import tenantApi from "../../Apis/tenantApis";
import { CPT_CODE, CPT } from "../../Utils/utils";
import { isArray } from 'lodash';

import HeaderBilling from "./component/Header";
import TaskTable from "./component/TaskTable";

const { Panel } = Collapse;
const { TextArea } = Input;

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const TOTAL_HOURS_FOR_EACH_SENSOR_BILLED = 16;
const TOTAL_HOURS_FOR_EACH_99458_BILLED = 20;
const TOTAL_HOURS_FOR_CODE_99457_BILLED = 20;
const TOTAL_HOURS_FOR_EACH_99091_BILLED = 30;

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

let clockCounter = null;
let timeCount = 0;
let currentIdTimerClockActive = null;


function BillingModule() {
    const pid = useParams().pid;
    // console.log("pid is here....", pid);
    const [tenantuuid, setTenantuuid] = useState();
    // const [billProcessedLoading, setBillProcessedLoading] = useState(true);
    const [billProcessedLoading, setBillProcessedLoading] = useState(false);

    const [initialBillDate, setInitialBillDate] = useState('')
    const [currentItem99091Active, setCurrentItem99091Active] = useState(null);
    const [taskDeleteArray, setTaskDeleteArray] = useState([])
    const [billingInformation, setBillingInformation] = useState([])

    // const ref = useRef()
    const [pdfState, setPdfState] = useState("");
    const printRef = useRef();
    const printRefSummary = useRef();
    const [pdf, setPdf] = useState(new jsPDF());
    const [isTableScroll, setTableScroll] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [billDateString, setBillDateString] = useState("");
    const [patientData, setPatientData] = useState({});
    const [tenantData, setTenantData] = useState({});

    // const [rightSideLoading, setRightSideLoading] = useState(true);
    const [rightSideLoading, setRightSideLoading] = useState(false);

    const [currentActiveMonth, setCurrentActiveMonth] = useState("");
    const [currentDateApi, setCurrentDateApi] = useState("");

    const [presentMonth, setPresentMonth] = useState("")

    const location = useLocation();
    const history = useHistory();

    const [enrolledState, setEnrolledState] = useState(false);
    const [initialSetupState, setInitialSetupState] = useState(false);
    const [associatedSensorsState, setAssociatedSensorsState] = useState(false);
    const [firstTwentyState, setFirstTwentyState] = useState(false);
    const [secondTwentyState, setSecondTwentyState] = useState(false);
    const [lastBillingState, setLastBillingState] = useState(false);
    const [billProcessedState, setBillProcessedState] = useState(false);
    const [summaryState, setSummaryState] = useState(false);

    const [initialStepDoneState, setInitialStepDoneState] = useState(false);
    const [enrollPatchState, setEnrollPatchState] = useState(false);

    const [lastStateDone, setLastStateDone] = useState(false);
    const [lastStateData, setLastStateData] = useState({});
    const [lastStateLoading, setLastStateLoading] = useState(false);

    const [addTaskState, setAddTaskState] = useState(false);

    const [tasksLoadingState, setTasksLoadingState] = useState(false);

    const [initialSetupLoading, setInitialSetupLoading] = useState(false);
    const [initialSetupData, setInitialSetupData] = useState({});

    const [firstTwentyData, setFirstTwentyData] = useState({});
    const [secondTwentyData, setSecondTwentyData] = useState({});

    const [patchLoading, setPatchLoading] = useState(false);
    const [patchEnrolled, setPatchEnrolled] = useState(false);
    const [patchData, setPatchData] = useState({});
    const [patchArray, setPatchArray] = useState([]);
    const [patchInformation, setPatchInformation] = useState({});

    const [firstTotalTime, setFirstTotalTime] = useState(0);
    const [firstTotalTimeDisplay, setFirstTotalTimeDisplay] = useState(0);
    const [secondTotalTime, setSecondTotalTime] = useState(0);
    const [totalTime99091, setTotalTime99091] = useState(0);

    const [stageOneState, setStageOneState] = useState(true);
    const [stageTwoState, setStageTwoState] = useState(false);

    const [taskDateVal, setTaskDateVal] = useState(new Date());
    const [taskTimeVal, setTaskTimeVal] = useState();
    const [taskNameVal, setTaskNameVal] = useState();
    const [taskNoteVal, setTaskNoteVal] = useState();
    const [temperatureVal, setTemperatureVal] = useState();
    const [spo2Val, setSpo2Val] = useState();
    const [heartRateVal, setHeartRateVal] = useState();
    const [bloodPressureVal, setBloodPressureVal] = useState();
    const [respirationRateVal, setRespirationRateVal] = useState();
    const [task99091, setTask99091] = useState([]);

    const [taskCodeActive, setTaskCodeActive] = useState(CPT_CODE.CPT_99453);
    const [taskCodeInternalActive, setTaskCodeInternalActive] = useState("");

    const [firstTwentyTasks, setFirstTwentyTasks] = useState([]);
    const [secondTwentyTasks, setSecondTwentyTasks] = useState([]);
    const [thirdTwentyTasks, setThirdTwentyTasks] = useState([]);

    const [runUseEffect, setRunUseEffect] = useState(0);
    const [timerTask, setTimerTask] = useState(false);

    const [activeCode99454, setActiveCode99454] = useState(false);
    const [keyNoteActive, setKeyNoteActive] = useState(0); 

    const [requiredAddTask, setRequiredAddTask] = useState([]);

    function handleMonthChange(date, dateString) {
        console.log(dateString);

        setCurrentDateApi(dateString);
        // setCurrentActiveMonth(monthNames[Number(dateString.substring(5, 7)) - 1]);
        // // setRightSideLoading(true);

        // setEnrolledState(false);
        // setInitialSetupState(false);
        // setAssociatedSensorsState(false);
        // setFirstTwentyState(false);
        // setSecondTwentyState(false);
        // setLastBillingState(false);
        // setBillProcessedState(false);

        // setInitialStepDoneState(false);
        // setEnrollPatchState(false);
        // setLastStateDone(false);
        // setLastStateData({});
        // setLastStateLoading(false);
        // setAddTaskState(false);
        // // setTasksLoadingState(true);
        // setInitialSetupLoading(false);
        // setInitialSetupData({});
        // setFirstTwentyData({});
        // setSecondTwentyData({});
        // setPatchLoading(false);
        // setPatchEnrolled(false);
        // setPatchData({});
        // setPatchArray([]);
        // setPatchInformation({});
        // setFirstTotalTime(0);
        // setSecondTotalTime(0);
        // setFirstTotalTimeDisplay(0);
        // setStageOneState(true);
        // setStageTwoState(false);
        // setTaskDateVal();
        // setTaskTimeVal();
        // setTaskNameVal();
        // setTaskNoteVal();
        // setTaskCodeActive("99457");
        // setTaskCodeInternalActive("");
        // setFirstTwentyTasks([]);
        // setSecondTwentyTasks([]);

        // var temp = runUseEffect;
        // temp = temp + 1;
        // setRunUseEffect(temp);
    }

    function findDateIndex(month) {
        return month === currentActiveMonth;
    }

    function handleAddTaskDateChange(date, dateString) {
        if (dateString) {
            var temp_date = new Date(dateString);
            setTaskDateVal(temp_date.toISOString());
        } else {
            setTaskDateVal();
        }
    }

    function handleAddTaskTimeChange(time, timeString) {
        setTaskTimeVal(
            Number(timeString.substring(0, 2) * 60) +
            Number(timeString.substring(3, 5))
        );
    }

    function handleAddTaskNameChange(e) {
        setTaskNameVal(e.target.value);
        if (requiredAddTask?.includes("staff_name")) {
            const newArr = requiredAddTask.filter(item => item !== "staff_name");
            setRequiredAddTask([...newArr]);
        }
    }

    function handleAddTaskNoteChange(e) {
        setTaskNoteVal(e.target.value);
        if (requiredAddTask?.includes("task_note")) {
            const newArr = requiredAddTask.filter(item => item !== "task_note")
            setRequiredAddTask([...newArr]);
        }
    }

    function addTaskComponent(cptCode) {
        const dateFormat = 'YYYY-MM-DD';

        return (
            <div className="bm-add-task-container">
                <div style={{ width: "100%", textAlign: "right" }}>
                    <CusBtn
                        onClick={() => {
                            setAddTaskState(false);
                            setRequiredAddTask([]);
                        }}
                        className="secondary"
                    >
                        <CloseOutlined />
                    </CusBtn>
                </div>
                <div style={{ fontSize: "1.5rem", textAlign: "center" }}>
                    Add Task
                    {cptCode != CPT_CODE.CPT_99091 && (
                        <p id="add-task-timer"></p>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "17.7%" }}>Date</div>
                    <DatePicker 
                        allowClear={false}
                        onChange={handleAddTaskDateChange} 
                        defaultValue={moment(taskDateVal, dateFormat)} 
                        format={dateFormat} 
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "21.7%" }}>
                        {cptCode != CPT_CODE.CPT_99091 && (
                            <span className="text-required">*</span>
                        )}
                        Staff Name
                    </div>
                    <Input status={requiredAddTask?.includes("staff_name") && "error"} placeholder="Name" onChange={handleAddTaskNameChange} />
                </div>
                <div>
                    {cptCode != CPT_CODE.CPT_99091 && (
                        <span className="text-required">*</span>
                    )}
                    Note
                    <TextArea
                        onChange={handleAddTaskNoteChange}
                        placeholder="Controlled autosize"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        status={requiredAddTask?.includes("task_note") && "error"}
                    />
                </div>
                <CusBtn
                    className="primary"
                    onClick={() => {
                        let itemTmp = {}
                        itemTmp.task_time_spend = timeCount;
                        timeCount = 0;
                        
                        callUpdateBillingTasks(taskCodeActive, itemTmp);
                    }}
                >
                    Task completed
                </CusBtn>
            </div>
        );
    }

    function initialSetupPost() {
        var date = new Date();
        var date_string = date.toISOString();
        billingApi
            .addBillingTask(
                {
                    code_type: CPT,
                    code: CPT_CODE.CPT_99453,
                    bill_date: date_string,
                    pid: location.state.pid,
                    time_spent: Math.floor(timeCount / 60),
                    revenue_code: 123,
                    notecodes: "pending",
                    bill_process: 0,
                    fee: 20
                }
            )
            .then((res) => {
                console.log("BILLING RESPONSE : ", res);
                var temp = runUseEffect;
                temp = temp + 1;
                setRunUseEffect(temp);
                setInitialSetupState(true);
                setInitialSetupLoading(false);
            })
            .catch((err) => {
                console.log(err);
                // setInitialSetupState(true);
            });

    }
    const renderTimeDisplay = (timeCount) => {
        let hours = Math.floor(timeCount / 3600)
        let minutes = Math.floor(timeCount / 60) % 60
        let seconds = timeCount % 60
        let timeDs = [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        return timeDs;
    }

    const startCountTimer = (elementId) => {
        clockCounter = setInterval(function () {
            timeCount = timeCount + 1;
            let timeDs = renderTimeDisplay(timeCount);
            const element = document.getElementById(elementId);
            if (element) { element.innerText = timeDs; }
        }, 1000);
    }

    const renderTimerClock = (item, cptCode, isDisableStartStop) => {
        const elementId = `task-${cptCode}-timer`;
        if (!timerTask || item.task_id != currentIdTimerClockActive) {
            return (
                <CusBtn
                    onClick={() => {
                        if (cptCode == CPT_CODE.CPT_99457 || cptCode == CPT_CODE.CPT_99458 || cptCode == CPT_CODE.CPT_99091) {
                            if (document.getElementById(`item-${cptCode}-time-spent-${item.task_id}`)) {
                                document.getElementById(`item-${cptCode}-time-spent-${item.task_id}`).style.display = "none";
                            }
                            currentIdTimerClockActive = item.task_id;
                        }
                        startCountTimer(elementId);
                        setTimerTask(true);

                    }}
                    className="primary"
                    style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
                    disabled={isDisableStartStop}
                >
                    Start
                </CusBtn>
            )
        } else {
            return (
                <div className="task-timer-wrapper" style={{ display: "flex", alignItems: "center" }}>
                    <CusBtn
                        onClick={() => {
                            item.task_time_spend += timeCount;
                            timeCount = 0;
                            stopCountTimer();
                            setTimerTask(false);
                            callUpdateBillingTasks(cptCode, item)
                            if (cptCode == CPT_CODE.CPT_99457 || cptCode == CPT_CODE.CPT_99458 || cptCode == CPT_CODE.CPT_99091 ) {
                                if (document.getElementById(`item-${cptCode}-time-spent-${item.task_id}`)) {
                                    document.getElementById(`item-${cptCode}-time-spent-${item.task_id}`).style.display = "initial";
                                }
                            }
                        }}
                        className="primary"
                        style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
                        disabled={isDisableStartStop}
                    >
                        Stop
                    </CusBtn>
                    <span id={elementId} style={{ height: "100%", width: "100%" }}></span>
                </div>

            )
        }
    }

    const stopCountTimer = () => {
        clearInterval(clockCounter);
    }

    function enrollForPatch() { 
        console.log("PATCH INFO : ", patchArray);
        console.log("PATCH INFO : ", patchInformation);

        var date = new Date();
        var date_string = date.toISOString();

        // billingApi
        //     .addBillingTask(
        //         {
        //             code_type: "CPTR",
        //             code: "919457",
        //             status: "99454",
        //             bill_date: initialBillDate,
        //             pid: location.state.pid,
        //             code_tasks: [
        //                 {
        //                     Billing_Information: [
        //                         {
        //                             code: "99454",
        //                             code_internal: "",
        //                             useruuid: "",
        //                             date_time: date_string,
        //                             taskTotalTimeSpent: "0",
        //                             timeConsidered: "0",
        //                             task: "patches_are_enrolled",
        //                             status: true,
        //                         },
        //                     ],
        //                     Patch_Patient_Information: patchInformation,
        //                     Patches: { patch_list: patchArray },
        //                 },
        //             ],
        //         }
        //     )
        //     .then((res) => {
        //         firstEnrollPatches();
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

        firstEnrollPatches();
    }

    function enrollLastState() {
        var date = new Date();
        var date_string = date.toISOString();

        // billingApi
        //     .addBillingTask(
        //         {
        //             code_type: "CPTR",
        //             code: "919457",
        //             status: "99091",
        //             bill_date: initialBillDate,
        //             pid: location.state.pid,
        //             code_tasks: [
        //                 {
        //                     Billing_Information: [
        //                         {
        //                             code: "99091",
        //                             code_internal: "",
        //                             useruuid: "",
        //                             date_time: date_string,
        //                             taskTotalTimeSpent: "0",
        //                             timeConsidered: "0",
        //                             task: "enrolled_for_99091",
        //                             status: true,
        //                         },
        //                     ],
        //                     Patch_Patient_Information: patchInformation,
        //                     Patches: patchArray,
        //                 },
        //             ],
        //         }
        //     )
        //     .then((res) => {
        //         firstEnrollLastState();
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        firstEnrollLastState();
    }

    function firstEnrollLastState() {
        var billDate = new Date();
        var billDateStr = getDateFromISO(billDate.toISOString());
        setBillDateString(billDateStr);

        console.log("DATE 1 : ", currentDateApi)

        if (!location.state) {
            history.push(`/dashboard/patient/details/${pid}`);
        } else {
            billingApi
                .getBillingTasks(location.state.pid, currentDateApi, '0')
                .then((res) => {
                    console.log("BILLING RESPONSE : ", res.data.response.billingData);
                    // setFirstTwentyTasks(res.data.response.billingData[0].code_tasks)
                    setTasksLoadingState(false);

                    setBillingInformation(res.data.response.billingData)

                    setTenantuuid(res.data.response.billingData[0].tenant_id);

                    setPatientData(res.data.response.billingData[0].patient_datum);

                    var tempDataSource = [];

                    var tempFirstTwentyTasks = [];
                    var tempSecondTwentyTasks = [];
                    var tempSecondTwentyStageTwoTasks = [];

                    var initialStepDone = false;
                    var enrollPatch = false;
                    var lastState = false;

                    var initialData = {};
                    var tempPatchdata = {};
                    var lastData = {};
                    var tempFirstTwentyData = {};
                    var tempSecondTwentyData = {};

                    var firstTotalTime = 0;
                    var secondTotalTime = 0;
                    res.data.response.billingData.map(
                        (item) => {
                            tempDataSource.push({
                                date: getDateFromISO(item.date_time),
                                code: item.code,
                                desc: item.task,
                                duration: getMinutesFromSeconds(item.timeConsidered),
                            });

                            if (item.code == CPT_CODE.CPT_99453) {
                                const d = new Date(item.bill_date);
                                initialStepDone = true;
                                initialData = {
                                    date: getDateFromISO(item.bill_date),
                                    time: getTimeFromISO(item.bill_date),
                                    month: monthNames[d.getMonth()],
                                    year: d.getFullYear()
                                };
                            }
                            if (item.code == "99454") {
                                enrollPatch = true;
                                tempPatchdata = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                            if (item.code === "99457") {
                                const params = JSON.parse(item.params);
                                setFirstTwentyData(params);
                            }
                            if (item.code == "99458") {

                            }
                            if (item.code === "99091") {
                                lastState = true;
                                lastData = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                        }
                    );

                    setDataSource(tempDataSource);

                    setFirstTwentyData(tempFirstTwentyData);
                    setSecondTwentyData(tempSecondTwentyData);

                    setLastStateDone(lastState);
                    setLastStateData(lastData);
                    setLastStateLoading(false);

                    setInitialStepDoneState(initialStepDone);
                    setEnrollPatchState(enrollPatch);
                    if (initialStepDone) {
                        setInitialBillDate(res.data.response.billingData[0].bill_date)
                        setEnrolledState(true);
                        setInitialSetupData(initialData);
                    }
                    setInitialSetupLoading(false);

                    if (enrollPatch) {
                        setPatchEnrolled(true);
                        setPatchData(tempPatchdata);
                    }
                    setPatchLoading(false);
                    if (res.data.response.patchData) {
                        // setPatchArray(
                        //     res.data.response.patchData
                        // );
                    }
                    var tempInfo = res.data.response.billingData[0].patch_patient_map;
                    if (tempInfo) {
                        delete tempInfo.patches;
                    }
                    setPatchInformation(tempInfo);

                    setFirstTwentyTasks(tempFirstTwentyTasks);
                    setSecondTwentyTasks(tempSecondTwentyTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(firstTotalTime);

                    if (firstTotalTime === 1200) {
                        setTaskCodeActive("99458");
                    } else {
                        setTaskCodeActive("99457");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function firstEnrollPatches() {
        var billDate = new Date();
        var billDateStr = getDateFromISO(billDate.toISOString());
        setBillDateString(billDateStr);

        console.log("DATE 2 : ", currentDateApi)

        if (!location.state) {
            history.push(`/dashboard/patient/details/${pid}`);
        } else {
            billingApi
                .getBillingTasks(location.state.pid, currentDateApi, '0')
                .then((res) => {
                    console.log("BILLING RESPONSE : ", res.data.response.billingData[0]);
                    // setFirstTwentyTasks(res.data.response.billingData[0].code_tasks)
                    setTasksLoadingState(false);

                    setBillingInformation(res.data.response.billingData[0].code_tasks[0].Billing_Information)

                    setTenantuuid(res.data.response.billingData[0].tenant_id);

                    setPatientData(res.data.response.billingData[0].patient_datum);

                    var tempDataSource = [];

                    var tempFirstTwentyTasks = [];
                    var tempSecondTwentyTasks = [];

                    var tempSecondTwentyStageTwoTasks = [];
                    var lastState = false;
                    var lastData = {};

                    var initialStepDone = false;
                    var enrollPatch = false;

                    var initialData = {};
                    var tempPatchdata = {};
                    var tempFirstTwentyData = {};
                    var tempSecondTwentyData = {};

                    var firstTotalTime = 0;
                    res.data.response.billingData[0].code_tasks[0].Billing_Information.map(
                        (item) => {
                            tempDataSource.push({
                                date: getDateFromISO(item.date_time),
                                code: item.code,
                                desc: item.task,
                                duration: getMinutesFromSeconds(item.timeConsidered),
                            });

                            if (item.code === "99453") {
                                const d = new Date(item.date_time);
                                initialStepDone = true;
                                initialData = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                    month: monthNames[d.getMonth()],
                                    year: d.getFullYear()
                                };
                            }
                            if (item.code === "99454") {
                                enrollPatch = true;
                                tempPatchdata = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                            if (item.code === "99457") {
                                tempFirstTwentyTasks.push(item);
                                firstTotalTime = firstTotalTime + Number(item.timeConsidered);
                                if (!tempFirstTwentyData.hasOwnProperty("date")) {
                                    tempFirstTwentyData = {
                                        date: getDateFromISO(item.date_time),
                                        time: getTimeFromISO(item.date_time),
                                    };
                                }
                            }
                            if (item.code === "99458") {

                            }
                            if (item.code === "99091") {
                                lastState = true;
                                lastData = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                        }
                    );

                    setDataSource(tempDataSource);

                    setFirstTwentyData(tempFirstTwentyData);
                    setSecondTwentyData(tempSecondTwentyData);

                    setLastStateDone(lastState);
                    setLastStateData(lastData);

                    setInitialStepDoneState(initialStepDone);
                    setEnrollPatchState(enrollPatch);
                    if (initialStepDone) {
                        setInitialBillDate(res.data.response.billingData[0].bill_date)
                        setEnrolledState(true);
                        setInitialSetupData(initialData);
                    }
                    setInitialSetupLoading(false);

                    if (enrollPatch) {
                        setPatchEnrolled(true);
                        setAssociatedSensorsState(true);
                        setPatchData(tempPatchdata);
                    }
                    setPatchLoading(false);
                    if (res.data.response.patchData) {
                        setPatchArray(
                            res.data.response.patchData
                        );
                    }
                    var tempInfo = res.data.response.billingData[0].patch_patient_map;
                    if (tempInfo) {
                        delete tempInfo.patches;
                    }
                    setPatchInformation(tempInfo);

                    setFirstTwentyTasks(tempFirstTwentyTasks);
                    setSecondTwentyTasks(tempSecondTwentyTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(firstTotalTime);

                    if (firstTotalTime >= 1200) {
                        setTaskCodeActive("99458");
                    } else {
                        setTaskCodeActive("99457");
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function callBillingTasks() {
        var billDate = new Date();
        var billDateStr = getDateFromISO(billDate.toISOString());
        setBillDateString(billDateStr);

        if (!location.state) {
            history.push(`/dashboard/patient/details/${pid}`);
        } else {
            billingApi
                .getBillingTasks(location.state.pid, currentDateApi, '0')
                .then((res) => {
                    console.log("BILLING RESPONSE : ", res.data.response.billingData[0]);
                    // setFirstTwentyTasks(res.data.response.billingData[0].code_tasks)
                    setTasksLoadingState(false);

                    setBillingInformation(res.data.response.billingData[0].code_tasks[0].Billing_Information)

                    setTenantuuid(res.data.response.billingData[0].tenant_id);

                    setPatientData(res.data.response.billingData[0].patient_datum);

                    var tempDataSource = [];

                    var tempFirstTwentyTasks = [];
                    var tempSecondTwentyTasks = [];

                    var tempSecondTwentyStageTwoTasks = [];
                    var lastState = false;
                    var lastData = {};

                    var initialStepDone = false;
                    var enrollPatch = false;

                    var initialData = {};
                    var tempPatchdata = {};
                    var tempFirstTwentyData = {};
                    var tempSecondTwentyData = {};

                    var firstTotalTime = 0;
                    var secondTotalTime = 0;
                    res.data.response.billingData[0].code_tasks[0].Billing_Information.map(
                        (item) => {
                            tempDataSource.push({
                                date: getDateFromISO(item.date_time),
                                code: item.code,
                                desc: item.task,
                                duration: getMinutesFromSeconds(item.timeConsidered),
                            });

                            if (item.code === "99453") {
                                const d = new Date(item.date_time);
                                initialStepDone = true;
                                initialData = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                    month: monthNames[d.getMonth()],
                                    year: d.getFullYear()
                                };
                            }
                            if (item.code === "99454") {
                                enrollPatch = true;
                                tempPatchdata = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                            if (item.code === "99457") {
                                tempFirstTwentyTasks.push(item);
                                firstTotalTime = firstTotalTime + Number(item.timeConsidered);
                                if (!tempFirstTwentyData.hasOwnProperty("date")) {
                                    tempFirstTwentyData = {
                                        date: getDateFromISO(item.date_time),
                                        time: getTimeFromISO(item.date_time),
                                    };
                                }
                            }
                            if (item.code == CPT_CODE.CPT_99458) {

                            }
                            if (item.code === "99091") {
                                lastState = true;
                                lastData = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                        }
                    );

                    setDataSource(tempDataSource);

                    setFirstTwentyData(tempFirstTwentyData);
                    setSecondTwentyData(tempSecondTwentyData);

                    setLastStateDone(lastState);
                    setLastStateData(lastData);

                    setInitialStepDoneState(initialStepDone);
                    setEnrollPatchState(enrollPatch);
                    if (initialStepDone) {
                        setInitialBillDate(res.data.response.billingData[0].bill_date)
                        setEnrolledState(true);
                        setInitialSetupData(initialData);
                    }
                    setInitialSetupLoading(false);

                    if (enrollPatch) {
                        setPatchEnrolled(true);
                        setPatchData(tempPatchdata);
                    }
                    setPatchLoading(false);
                    if (res.data.response.patchData) {
                        setPatchArray(
                            res.data.response.patchData
                        );
                    }
                    var tempInfo = res.data.response.billingData[0].patch_patient_map;
                    if (tempInfo) {
                        delete tempInfo.patches;
                    }
                    setPatchInformation(tempInfo);

                    setFirstTwentyTasks(tempFirstTwentyTasks);
                    setSecondTwentyTasks(tempSecondTwentyTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(firstTotalTime);

                    if (firstTotalTime === 1200) {
                        setTaskCodeActive(CPT_CODE.CPT_99458);
                    } else {
                        setTaskCodeActive(CPT_CODE.CPT_99457);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    const getFirstDateMonitored = (item) => {
        let result = '';
        if (item.duration) {
            let arrDur = item.duration.split(',');
            if (arrDur.length > 0) {
                result = arrDur[0];
            }
        }
        return result;
    }

    const getLastDateMonitored = (item) => {
        let result = '';
        if (item.duration) {
            let arrDur = item.duration.split(',');
            if (arrDur.length > 1) {
                result = arrDur[1];
            }
        }
        return result;
    }
    const getHoursProcessSensor = () => {
        let totalHours = getTotalDayMonitored();
        return totalHours === TOTAL_HOURS_FOR_EACH_SENSOR_BILLED ? totalHours : totalHours % TOTAL_HOURS_FOR_EACH_SENSOR_BILLED;
    }
    const getUnitBilledSensor = () => {
        let result = 0;
        let totalHours = getTotalDayMonitored();
        if (totalHours > TOTAL_HOURS_FOR_EACH_SENSOR_BILLED) {
            result = Math.floor(totalHours / TOTAL_HOURS_FOR_EACH_SENSOR_BILLED);
        }
        return result;
    }

    const getTotalDayMonitored = () => {
        let result = 0;
        patchArray.map(item => {
            const totalDay = item?.totalDay || 0;
            result = result + totalDay;
        })
        return result;
    }

    const getDateEnable99457 = (dataTask) => {
        if (isArray(dataTask) && dataTask.length > 0) {
            return moment(dataTask[dataTask.length - 1]).format('YYYY-MM-DD');
        }
        return '';
    }
    const getLastUpdatedAt99091 = () => {
        if (task99091.length > 0) {
            let lastItem = task99091[task99091.length - 1];
            return moment(lastItem['date']).format('YYYY-MM-DD H:mm a');
        }
        return '';
    }

    const getFirst99091 = () => {
        if (task99091.length > 0) {
            let firstItem = task99091[0];
            return moment(firstItem['date']).format('YYYY-MM-DD H:mm a');
        }
        return '';
    }
    const getTotalNumberDay = (item) => {
        let result = 0;
        let currentDate = moment();
        if (item.duration) {
            let arrDuration = item.duration.split(',');
            let firstDayMonitored = moment(arrDuration[0], 'YYYY-MM-DD');
            let lastDateMonitored = moment(arrDuration[1], 'YYYY-MM-DD');
            let firstDayOfMonth = moment().startOf('month');
            let beginDayCal = null;
            let endDayCal = null;
            if (firstDayOfMonth > firstDayMonitored) {
                beginDayCal = firstDayOfMonth
            } else {
                beginDayCal = firstDayMonitored;
            }
            if (currentDate > lastDateMonitored) {
                endDayCal = lastDateMonitored;
            } else {
                endDayCal = currentDate;
            }
            result = endDayCal.diff(beginDayCal, 'days');
        }
        return result > 0 ? result : 0;
    }

    function callUpdateOnCodeChange(
        taskTimeVal,
        taskTimeConsidered,
        newTaskTime
    ) {
        // billingApi
        //     .addBillingTask(
        //         {
        //             code_type: "CPTR",
        //             code: "919457",
        //             status: "99457",
        //             bill_date: initialBillDate,
        //             pid: location.state.pid,
        //             code_tasks: [
        //                 {
        //                     Billing_Information: [
        //                         {
        //                             code: "99457",
        //                             code_internal: "",
        //                             useruuid: taskNameVal,
        //                             date_time: taskDateVal,
        //                             taskTotalTimeSpent: taskTimeVal.toString(),
        //                             timeConsidered: taskTimeConsidered.toString(),
        //                             task: taskNoteVal,
        //                             status: true,
        //                         },
        //                     ],
        //                     Patch_Patient_Information: [patchInformation],
        //                     Patches: patchArray,
        //                 },
        //             ],
        //         }
        //     )
        //     .then((res) => {
        //         console.log("BILLING RESPONSE CODE CHANGE 1 : ", res);
        //         billingApi
        //             .addBillingTask(
        //                 {
        //                     code_type: "CPTR",
        //                     code: "919457",
        //                     status: "99458",
        //                     bill_date: initialBillDate,
        //                     pid: location.state.pid,
        //                     code_tasks: [
        //                         {
        //                             Billing_Information: [
        //                                 {
        //                                     code: "99458",
        //                                     code_internal: "99458_stage1",
        //                                     useruuid: taskNameVal,
        //                                     date_time: taskDateVal,
        //                                     taskTotalTimeSpent: newTaskTime.toString(),
        //                                     timeConsidered: newTaskTime.toString(),
        //                                     task: taskNoteVal,
        //                                     status: true,
        //                                 },
        //                             ],
        //                             Patch_Patient_Information: [patchInformation],
        //                             Patches: patchArray,
        //                         },
        //                     ],
        //                 }
        //             )
        //             .then((res) => {
        //                 console.log("BILLING RESPONSE CODE CHANGE 2 : ", res);
        //                 callBillingTasks();
        //                 setFirstTwentyState(false);
        //                 setSecondTwentyState(true);
        //             })
        //             .catch((err) => {
        //                 console.log(err);
        //             });
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        callBillingTasks();
        setFirstTwentyState(false);
        setSecondTwentyState(true);
    }

    function callUpdateOnCodeStageChange(
        taskTimeVal,
        taskTimeConsidered,
        newTaskTime
    ) {
        // billingApi
        //     .addBillingTask(
        //         {
        //             code_type: "CPTR",
        //             code: "919457",
        //             status: "99458",
        //             bill_date: initialBillDate,
        //             pid: location.state.pid,
        //             code_tasks: [
        //                 {
        //                     Billing_Information: [
        //                         {
        //                             code: "99458",
        //                             code_internal: "99458_stage1",
        //                             useruuid: taskNameVal,
        //                             date_time: taskDateVal,
        //                             taskTotalTimeSpent: taskTimeVal.toString(),
        //                             timeConsidered: taskTimeConsidered.toString(),
        //                             task: taskNoteVal,
        //                             status: true,
        //                         },
        //                     ],
        //                     Patch_Patient_Information: patchInformation,
        //                     Patches: patchArray,
        //                 },
        //             ],
        //         }
        //     )
        //     .then((res) => {
        //         console.log("BILLING RESPONSE STAGE CHANGE 1 : ", res);
        //         billingApi
        //             .addBillingTask(
        //                 {
        //                     code_type: "CPTR",
        //                     code: "919457",
        //                     status: "99458",
        //                     bill_date: initialBillDate,
        //                     pid: location.state.pid,
        //                     code_tasks: [
        //                         {
        //                             Billing_Information: [
        //                                 {
        //                                     code: "99458",
        //                                     code_internal: "99458_stage2",
        //                                     useruuid: taskNameVal,
        //                                     date_time: taskDateVal,
        //                                     taskTotalTimeSpent: newTaskTime.toString(),
        //                                     timeConsidered: newTaskTime.toString(),
        //                                     task: taskNoteVal,
        //                                     status: true,
        //                                 },
        //                             ],
        //                             Patch_Patient_Information: [patchInformation],
        //                             Patches: patchArray,
        //                         },
        //                     ],
        //                 }
        //             )
        //             .then((res) => {
        //                 console.log("BILLING RESPONSE STAGE CHANGE 2 : ", res);
        //                 callBillingTasks();
        //                 stageOneState(false);
        //                 stageTwoState(true);
        //             })
        //             .catch((err) => {
        //                 console.log(err);
        //             });
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

        callBillingTasks();
        stageOneState(false);
        stageTwoState(true);
    }

    const getListFirstTwentyTasks = () => {
        var dateMonthString = "";

        billingApi
            .getBillingTasks(location.state.pid, currentActiveMonth === "" ? dateMonthString : currentDateApi, '0')
            .then((res) => {
                var tempFirstTwentyTasks = [];
                var tempSecondTwentyTasks = [];
                let tmpTotalTime = 0;
                let tempDataSource = [];
                setBillingInformation(res.data.response.billingData)
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
                        setDataSource(tempDataSource);
                        if (item.code == CPT_CODE.CPT_99457) {
                            tempFirstTwentyTasks = JSON.parse(item.params);
                            tmpTotalTime = 0;
                            if (!isArray(tempFirstTwentyTasks)) tempFirstTwentyTasks = [];
                            if (tempFirstTwentyTasks.length > 0) {
                                tempFirstTwentyTasks.map(item => {
                                    if (item.task_time_spend) {
                                        tmpTotalTime += item.task_time_spend;
                                    }
                                })
                            }
                            setFirstTwentyTasks(tempFirstTwentyTasks);
                            setFirstTotalTime(tmpTotalTime);
                            setFirstTotalTimeDisplay(tmpTotalTime);
                        }

                        if (item.code == CPT_CODE.CPT_99458) {
                            tempSecondTwentyTasks = JSON.parse(item.params);
                            tmpTotalTime = 0;
                            if (!isArray(tempSecondTwentyTasks)) tempSecondTwentyTasks = [];
                            setSecondTwentyTasks(tempSecondTwentyTasks);
                            if (tempSecondTwentyTasks.length > 0) {
                                tempSecondTwentyTasks.map(item => {
                                    if (item.task_time_spend) {
                                        tmpTotalTime += item.task_time_spend;
                                    }
                                })
                            }
                            setSecondTotalTime(tmpTotalTime);
                        }
                        
                        if (item.code == CPT_CODE.CPT_99091) {
                            let temp99091Task = JSON.parse(item.params);
                            let tmpTime = 0;
                            if(!isArray(temp99091Task)) temp99091Task = [];
                            setTask99091(temp99091Task);
                            if(temp99091Task.length > 0) {
                                setCurrentItem99091Active(temp99091Task[temp99091Task.length - 1].task_id);
                                temp99091Task.map(item => {
                                    tmpTime +=  Number(item.task_time_spend);
                                })
                                setKeyNoteActive(temp99091Task[temp99091Task.length - 1].task_id)
                            }
                            setTotalTime99091(tmpTime);
                        }
                    }
                );




            })
    }
    const getNoteForItem99091 = () => {
        if (task99091.length > 0) {
            let findItem = task99091.filter(item => item.task_id == currentItem99091Active);
            if (isArray(findItem) && findItem.length > 0) {
                findItem = findItem[0];
                return (
                    <div style={{ display: "flex" }} >
                        <div style={{ width: "5%" }}>
                            1
                        </div>
                        <div style={{ width: "25%" }}>
                            {moment(findItem['date']).format('YYYY-MM-DD H:mm a')}
                        </div>
                        <div style={{ width: "50%" }}>
                            <p style={{ margin: "0" }}>{findItem['staff_name']}</p>
                            <p>{findItem['note']}</p>
                        </div>
                        <div style={{ width: "15%" }}>
                            {findItem['task_time_spend']} {Number(findItem['task_time_spend']) > 1 ? 'mins' : 'min'}
                        </div>
                        <div style={{ width: "5%" }}></div>
                    </div>
                )
            }
        }
        return '';

    }

    const validateFormAddTask = (taskNameVal, taskNoteVal) => {
        if (!taskNameVal?.trim() || !taskNoteVal?.trim()) {
            if (!taskNameVal) {
                requiredAddTask.push("staff_name");
            } 

            if (!taskNoteVal) {
                requiredAddTask.push("task_note");
            }

            notification.warn({
                message: "Fill mandatory values",
                description: "Mandatory values are marked with *",
                placement: "topRight",
            });

            setRequiredAddTask([...requiredAddTask]);
            return false;
        } else {
            return true;
        }
    };

    function callUpdateBillingTasks(cptCode, item = {}) {
        var date = new Date();
        var date_string = date.toISOString();
        let isCodeExist = false;
        let billingId = null;
        let currentTotalTime99457 = 0;
        let addNewLine99458 = null;

        let valiSuccess = false;

        billingInformation.map(item => {
            if (item.code == cptCode) {
                isCodeExist = true;
                billingId = item.id
            }
            if (item.code == CPT_CODE.CPT_99457){
                let taskData = JSON.parse(item.params);
                taskData.map(item => {
                    currentTotalTime99457 += item.task_time_spend;
                })
            }
        })

        if(cptCode == CPT_CODE.CPT_99457){
            if((currentTotalTime99457 + item.task_time_spend) >= TOTAL_HOURS_FOR_CODE_99457_BILLED * 60){
                let timeReduce = currentTotalTime99457 + item.task_time_spend - TOTAL_HOURS_FOR_CODE_99457_BILLED * 60;
                item.task_time_spend = item.task_time_spend - timeReduce;
                addNewLine99458 = {
                    code_type: CPT,
                            code: CPT_CODE.CPT_99458,
                            bill_date: date_string,
                            pid: location.state.pid,
                            revenue_code: 123,
                            notecodes: "pending",
                            bill_process: 0,
                            fee: 40,
                            add_task_id: date.getTime(),
                            add_task_date: taskDateVal,
                            add_task_staff_name: taskNameVal,
                            add_task_note: taskNoteVal,
                            task_time_spend: timeReduce
                }
            }
        }
       
        if (cptCode == CPT_CODE.CPT_99457 || cptCode == CPT_CODE.CPT_99458) {
            if (isCodeExist) {
                // update
                let updateData = {};
                if (item.task_id) {
                    updateData = {
                        code: cptCode,
                        bill_date: date_string,
                        pid: location.state.pid,
                        billing_id: billingId,
                        task_date: item.task_date,
                        task_id: item.task_id,
                        staff_name: item.staff_name,
                        add_task_note: item.task_note,
                        task_time_spend: item.task_time_spend
                    }
                } else {
                    valiSuccess = validateFormAddTask(taskNameVal, taskNoteVal);

                    updateData = {
                        code: cptCode,
                        bill_date: date_string,
                        pid: location.state.pid,
                        billing_id: billingId,
                        task_date: taskDateVal,
                        staff_name: taskNameVal,
                        add_task_note: taskNoteVal,
                        task_time_spend: item.task_time_spend
                    }
                }

                if (valiSuccess) {
                    setTasksLoadingState(true);
                    billingApi
                        .updateBillingTask(
                            updateData
                        )
                        .then((res) => {
                            stopCountTimer();
                            setAddTaskState(false);
                            setTasksLoadingState(false);
                            getListFirstTwentyTasks();
                            if(cptCode == CPT_CODE.CPT_99457 && addNewLine99458 != null){
                                billingApi
                                    .addBillingTask(
                                        addNewLine99458
                                    )
                                    .then((res) => {
                                        setTasksLoadingState(false);
                                        getListFirstTwentyTasks();
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch((err) => {
                            notification.error({
                                message: "Add Task ",
                                description: "Add task falied!",
                                placement: "topRight",
                            });
                            stopCountTimer();
                            setAddTaskState(false);
                            setTasksLoadingState(false);
                        });
                }

            } else {
                valiSuccess = validateFormAddTask(taskNameVal, taskNoteVal);
                if (valiSuccess) {
                    setTasksLoadingState(true);

                    billingApi
                        .addBillingTask(
                            {
                                code_type: CPT,
                                code: cptCode,
                                bill_date: date_string,
                                pid: location.state.pid,
                                revenue_code: 123,
                                notecodes: "pending",
                                bill_process: 0,
                                fee: 40,
                                add_task_id: date.getTime(),
                                add_task_date: taskDateVal,
                                add_task_staff_name: taskNameVal,
                                add_task_note: taskNoteVal,
                                task_time_spend: item.task_time_spend
                            }
                        )
                        .then((res) => {
                            stopCountTimer();
                            setAddTaskState(false);
                            setTasksLoadingState(false);
                            getListFirstTwentyTasks();
                            if(cptCode == CPT_CODE.CPT_99457 && addNewLine99458 != null){
                                billingApi
                                    .addBillingTask(
                                        addNewLine99458
                                    )
                                    .then((res) => {
                                        setTasksLoadingState(false);
                                        getListFirstTwentyTasks();
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch((err) => {
                            notification.error({
                                message: "Add Task ",
                                description: "Add task falied!",
                                placement: "topRight",
                            });
                            stopCountTimer();
                            setAddTaskState(false);
                            setTasksLoadingState(false);
                        });
                }

            }
        }
        if (cptCode == CPT_CODE.CPT_99091) {
            if (isCodeExist) {
                let updateData = {};
                if (item.task_id) {
                    updateData = {
                        code: cptCode,
                        bill_date: date_string,
                        pid: location.state.pid,
                        billing_id: billingId,
                        task_date: item.task_date,
                        task_id: item.task_id,
                        staff_name: item.staff_name,
                        task_note: item.task_note,
                        task_time_spend: item.task_time_spend
                    }
                } else {
                    valiSuccess = validateFormAddTask(taskNameVal, taskNoteVal);

                    updateData = {
                        code: cptCode,
                        bill_date: date_string,
                        pid: location.state.pid,
                        billing_id: billingId,
                        task_date: taskDateVal,
                        staff_name: taskNameVal,
                        task_note: taskNoteVal,
                        task_time_spend: item.task_time_spend
                    }
                }
                billingApi
                    .updateBillingTask(
                        updateData
                    )
                    .then((res) => {
                        stopCountTimer();
                        setAddTaskState(false);
                        setTasksLoadingState(false);
                        getListFirstTwentyTasks();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                billingApi
                    .addBillingTask(
                        {
                            code_type: CPT,
                            code: cptCode,
                            bill_date: date_string,
                            pid: location.state.pid,
                            revenue_code: 123,
                            notecodes: "pending",
                            bill_process: 0,
                            fee: 40,
                            task_id: date.getTime(),
                            date: taskDateVal,
                            staff_name: taskNameVal,
                            task_note: taskNoteVal,
                            task_time_spend: item.task_time_spend
                        }
                    )
                    .then((res) => {
                        stopCountTimer();
                        setAddTaskState(false);
                        setTasksLoadingState(false);
                        getListFirstTwentyTasks();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }

    function handleDeleteTasks() {

        console.log("TASK DELETE ARRAY : ", taskDeleteArray)

        var temp = billingInformation

        taskDeleteArray.map(item => {
            billingInformation.map((ele, index) => {
                if (item === ele) {
                    temp.splice(index, 1)
                }
            })
        })

        if (taskDeleteArray[0].code === '99457') {
            console.log('IT IS 99457')

            var total_time_99457 = 0
            var total_time_99458_stage_1 = 0

            var time_left_99457 = 0
            var time_left_99458_stage_1 = 0

            temp.map(ele => {
                if (ele.code === '99457') {
                    total_time_99457 = total_time_99457 + Number(ele.timeConsidered)
                }
            })

            time_left_99457 = 1200 - total_time_99457
            var flag = false

            temp.map(ele => {
                if (ele.code === '99458' && ele.code_internal === '99458_stage1') {
                    flag = true

                    if (time_left_99457 > 0) {
                        if (Number(ele.timeConsidered) <= time_left_99457) {
                            ele.code = '99457'
                            ele.code_internal = ''

                            time_left_99457 = time_left_99457 - Number(ele.timeConsidered)
                        }
                        else {
                            temp.push({
                                "code": "99457",
                                "code_internal": "",
                                "useruuid": ele.useruuid,
                                "date_time": ele.date_time,
                                "taskTotalTimeSpent": ele.taskTotalTimeSpent,
                                "timeConsidered": `${time_left_99457}`,
                                "task": ele.task,
                                "status": ele.status
                            })

                            ele.timeConsidered = `${Number(ele.timeConsidered) - time_left_99457}`

                            time_left_99457 = 0
                        }
                    }
                }
            })

            if (flag) {

                temp.map(ele => {
                    if (ele.code === '99458' && ele.code_internal === '99458_stage1') {
                        total_time_99458_stage_1 = total_time_99458_stage_1 + Number(ele.timeConsidered)
                    }
                })

                time_left_99458_stage_1 = 1200 - total_time_99458_stage_1

                temp.map(ele => {
                    if (ele.code === '99458' && ele.code_internal === '99458_stage2') {

                        if (time_left_99458_stage_1 > 0) {
                            if (Number(ele.timeConsidered) <= time_left_99458_stage_1) {
                                ele.code = '99458'
                                ele.code_internal = '99458_stage1'

                                time_left_99458_stage_1 = time_left_99458_stage_1 - Number(ele.timeConsidered)
                            }
                            else {
                                temp.push({
                                    "code": "99458",
                                    "code_internal": "99458_stage1",
                                    "useruuid": ele.useruuid,
                                    "date_time": ele.date_time,
                                    "taskTotalTimeSpent": ele.taskTotalTimeSpent,
                                    "timeConsidered": `${time_left_99458_stage_1}`,
                                    "task": ele.task,
                                    "status": ele.status
                                })

                                ele.timeConsidered = `${Number(ele.timeConsidered) - time_left_99458_stage_1}`

                                time_left_99458_stage_1 = 0
                            }
                        }
                    }
                })
            }

        }
        else if (taskDeleteArray[0].code === '99458' && taskDeleteArray[0].code_internal === '99458_stage1') {
            console.log('IT IS STAGE 1')

            var total_time_99458_stage_1 = 0
            var time_left_99458_stage_1 = 0

            temp.map(ele => {
                if (ele.code === '99458' && ele.code_internal === '99458_stage1') {
                    total_time_99458_stage_1 = total_time_99458_stage_1 + Number(ele.timeConsidered)
                }
            })

            time_left_99458_stage_1 = 1200 - total_time_99458_stage_1

            temp.map(ele => {
                if (ele.code === '99458' && ele.code_internal === '99458_stage2') {

                    if (time_left_99458_stage_1 > 0) {
                        if (Number(ele.timeConsidered) <= time_left_99458_stage_1) {
                            ele.code = '99458'
                            ele.code_internal = '99458_stage1'

                            time_left_99458_stage_1 = time_left_99458_stage_1 - Number(ele.timeConsidered)
                        }
                        else {
                            temp.push({
                                "code": "99458",
                                "code_internal": "99458_stage1",
                                "useruuid": ele.useruuid,
                                "date_time": ele.date_time,
                                "taskTotalTimeSpent": ele.taskTotalTimeSpent,
                                "timeConsidered": `${time_left_99458_stage_1}`,
                                "task": ele.task,
                                "status": ele.status
                            })

                            ele.timeConsidered = `${Number(ele.timeConsidered) - time_left_99458_stage_1}`

                            time_left_99458_stage_1 = 0
                        }
                    }
                }
            })

        }

        billingApi.deleteBillingTask({
            "pid": pid,
            "code_tasks": [
                {
                    "Billing_Information": temp,
                    "Patch_Patient_Information": [patchInformation],
                    "Patches": patchArray
                }
            ]
        })
            .then(res => {
                console.log(res)

                var temp = runUseEffect
                temp = temp + 1
                setRunUseEffect(temp)
            })
            .catch(err => {
                console.log(err)
            })

    }

    function getDateFromISO(dateiso) {
        var date = new Date(dateiso);
        var date_string = `${date.getFullYear()}/${date.getMonth() + 1
            }/${date.getDate()}`;
        return date_string;
    }

    function getTimeFromISO(dateiso) {
        var date = new Date(dateiso);
        var time_string = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""
            }${date.getMinutes()}`;
        return time_string;
    }

    function getMinutesFromSeconds(time) {
        return `${Math.floor(time / 60)}min ${time - Math.floor(time / 60) * 60
            }sec`;
    }

    function getTenantData() {
        let userData = UserStore.getUser();
        let tenantId = userData.tenant;
        tenantApi
            .getLocation(tenantId)
            .then((res) => {
                console.log("TENANT DATA : ", res.data.response.facilities[0][0]);
                setTenantData(res.data.response.facilities[0][0]);
                setBillProcessedLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const shortTypeQueryOfSensor = (patchType) => {
        switch (patchType) {
            case "temperature":
                return "temp"
            case "digital":
                return "weight"
            case "spo2":
                return "spo2"
            case "ecg":
                return "ecg_hr"
            case "alphamed":
                return "alphamed_bpd"
            case "ihealth":
                return "ihealth_bpd"

            default:
                break;
        }
    };

    const getReportDes = (item) => {
        if(item.code == CPT_CODE.CPT_99453){
            return '1 billed';
        }

        if(item.code == CPT_CODE.CPT_99457){
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if(tempTotal >= 20){
                return '1 billed';
            } else {
                return '';
            }
        }

        if(item.code == CPT_CODE.CPT_99458){
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if(tempTotal >= TOTAL_HOURS_FOR_EACH_99458_BILLED){
                return `${Math.floor(tempTotal / TOTAL_HOURS_FOR_EACH_99458_BILLED)} billed`;
            } else {
                return '';
            }
        }

        if(item.code == CPT_CODE.CPT_99091){
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            if(tempTotal >= TOTAL_HOURS_FOR_EACH_99091_BILLED){
                return `1 billed`;
            } else {
                return '';
            }
        }
    }

    const getReportTotalDuration = (item) => {
        if(item.code == CPT_CODE.CPT_99453){
            return '';
        }

        if(item.code == CPT_CODE.CPT_99457){
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if(tempTotal >= 20){
                return '20 Mins'
            } else {
                if(tempTotal > 1) {
                    return `${tempTotal} Mins`
                } else {
                    return `${tempTotal} Min`
                }
            }
        }

        if(item.code == CPT_CODE.CPT_99458){
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            tempTotal = Math.floor(tempTotal / 60);
            if(tempTotal > 1) {
                return `${tempTotal} Mins`
            } else {
                return `${tempTotal} Min`
            }
        }

        if(item.code == CPT_CODE.CPT_99091){
            let taskData = JSON.parse(item.params);
            let tempTotal = 0;
            taskData.map(item => {
                tempTotal += Number(item.task_time_spend)
            })
            if(tempTotal > 1) {
                return `${tempTotal} Mins`
            } else {
                return `${tempTotal} Min`
            }
        }

    }

    useEffect(() => {
        var billDate = new Date();
        var billDateStr = getDateFromISO(billDate.toISOString());
        setBillDateString(billDateStr);
        setPresentMonth(`${billDate.getFullYear()}-${billDate.getMonth() + 1 < 10 ? "0" : ""}${billDate.getMonth() + 1}`)
        console.log(`PRESENT MONTH : ${billDate.getFullYear()}-${billDate.getMonth() + 1 >= 10 ? "" : "0"}${billDate.getMonth() + 1}`)

        if (!location.state) {
            history.push(`/dashboard/patient/details/${pid}`);
        } else {
            setRightSideLoading(false);

            var year = billDate.getFullYear();
            var monthNumber = billDate.getMonth() + 1;
            var dateMonthString = "";

            if (currentActiveMonth === "") {
                dateMonthString = `${year}-${monthNumber < 10 ? "0" : ""}${monthNumber}`;
                setCurrentDateApi(dateMonthString);
            }

            billingApi
                .getBillingTasks(location.state.pid, currentActiveMonth === "" ? dateMonthString : currentDateApi, '0')
                .then((res) => {
                    console.log("BILLING RESPONSE : ", res.data.response.billingData[0]);
                    // setFirstTwentyTasks(res.data.response.billingData[0].code_tasks)
                    setTasksLoadingState(false);

                    setBillingInformation(res.data.response.billingData)

                    setTenantuuid(res.data.response.billingData[0] ? res.data.response.billingData[0].tenant_id : '');

                    setPatientData(res.data.response.billingData[0] ? res.data.response.billingData[0].patient_datum : '');

                    var tempDataSource = [];

                    var tempFirstTwentyTasks = [];
                    var tempSecondTwentyTasks = [];
                    var tempSecondTwentyStageTwoTasks = [];

                    var initialStepDone = false;
                    var enrollPatch = false;
                    var lastState = false;

                    var initialData = {};
                    var tempPatchdata = {};
                    var lastData = {};
                    var tempFirstTwentyData = {};
                    var tempSecondTwentyData = {};

                    var firstTotalTime = 0;
                    var secondTotalTime = 0;
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
                            const dataCode99454 = filterDeviceAssociatedByDate;
                            if(isArray(dataCode99454.list) && dataCode99454.list.length > 0){
                                let lastItem99454 = dataCode99454.list[dataCode99454.list.length - 1];
                                tempDataSource.push({
                                    date: moment(lastItem99454.datesInflux?.[lastItem99454?.datesInflux?.length - 1]).format('YYYY-MM-DD'),
                                    code: CPT_CODE.CPT_99454,
                                    desc: dataCode99454.billedUnit,
                                    duration: `${dataCode99454.totalDayMonitored} day(s)`,
                                });
                            }
                            if (item.code == CPT_CODE.CPT_99453) {
                                const d = new Date(item.bill_date);
                                initialStepDone = true;
                                initialData = {
                                    date: getDateFromISO(item.bill_date),
                                    time: getTimeFromISO(item.bill_date),
                                    month: monthNames[d.getMonth()],
                                    year: d.getFullYear()
                                };
                            }
                            if (item.code == CPT_CODE.CPT_99454) {
                                enrollPatch = true;
                                tempPatchdata = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                            if (item.code == CPT_CODE.CPT_99457) {
                                tempFirstTwentyTasks = JSON.parse(item.params);
                                if (!isArray(tempFirstTwentyTasks)) tempFirstTwentyTasks = [];
                                setFirstTwentyTasks(tempFirstTwentyTasks);
                                if (tempFirstTwentyTasks.length > 0) {
                                    tempFirstTwentyTasks.map(item => {
                                        if (item.task_time_spend) {
                                            firstTotalTime += item.task_time_spend;
                                        }
                                    })
                                    firstTotalTime = firstTotalTime;
                                }
                            }
                            if (item.code == CPT_CODE.CPT_99458) {
                                tempSecondTwentyTasks = JSON.parse(item.params);
                                if (!isArray(tempSecondTwentyTasks)) tempSecondTwentyTasks = [];
                                if (tempSecondTwentyTasks.length > 0) {
                                    tempSecondTwentyTasks.map(item => {
                                        if (item.task_time_spend) {
                                            secondTotalTime += item.task_time_spend;
                                        }
                                    })
                                }
                            }
                            if (item.code == CPT_CODE.CPT_99091) {
                                let temp99091Task = JSON.parse(item.params);
                                let tmpTime = 0;
                                if (!isArray(temp99091Task)) temp99091Task = [];
                                setTask99091(temp99091Task);
                                if (temp99091Task.length > 0) {
                                    setCurrentItem99091Active(temp99091Task[temp99091Task.length - 1].task_id);
                                    temp99091Task.map(item => {
                                        tmpTime += Number(item.task_time_spend);
                                    })
                                    setKeyNoteActive(temp99091Task[temp99091Task.length - 1].task_id);
                                }
                                setTotalTime99091(tmpTime);
                            }
                        }
                    );

                    setDataSource(tempDataSource);

                    setLastStateDone(lastState);
                    setLastStateData(lastData);

                    setInitialStepDoneState(initialStepDone);
                    setEnrollPatchState(enrollPatch);
                    if (initialStepDone) {
                        setInitialBillDate(res.data.response.billingData[0].bill_date)
                        setEnrolledState(true);
                        setInitialSetupState(true);
                        setInitialSetupData(initialData);
                    }
                    setInitialSetupLoading(false);

                    if (enrollPatch) {
                        setPatchEnrolled(true);
                        setPatchData(tempPatchdata);
                    }


                    if (res.data.response.patchData) {
                        res.data.response.patchData?.forEach((patch) => {
                            const startDate = getFirstDateMonitored(patch) || "";
                            // const endDate = getLastDateMonitored(patch) || "";
                            const typeQuery = shortTypeQueryOfSensor(patch["patches.patch_type"]);
                          
                            if (!!startDate && !!typeQuery) {
                                checkTotalNumberDateHaveDataFromInflux(startDate, typeQuery, patch);
                            }
                        })

                        setPatchArray(
                            res.data.response.patchData
                        );
                    }
                    var tempInfo = res.data.response.billingData[0].patch_patient_map;
                    if (tempInfo) {
                        delete tempInfo.patches;
                    }
                    setPatchInformation(tempInfo);

                    setFirstTwentyTasks(tempFirstTwentyTasks);
                    setSecondTwentyTasks(tempSecondTwentyTasks);

                    setFirstTotalTime(firstTotalTime);
                    setSecondTotalTime(secondTotalTime);
                    setFirstTotalTimeDisplay(firstTotalTime);
                    if (firstTotalTime >= 1200) {
                        setTaskCodeActive(CPT_CODE.CPT_99458);
                    } else {
                        setTaskCodeActive(CPT_CODE.CPT_99457);
                    }

                    setTaskDeleteArray([])

                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [runUseEffect]);

    function placeDatePicker(width) {
        let defaultDate = moment();
        if (currentDateApi) {
            if (currentDateApi.split('-').length < 2) {
                defaultDate = moment(`${currentDateApi}-02`, "YYYY-MM-DD");
            } else {
                defaultDate = moment(currentDateApi, "YYYY-MM-DD");
            }
        }
        if (width) {
            return (
                <DatePicker
                    onChange={handleMonthChange}
                    defaultValue={defaultDate}
                    picker="month"
                    style={{ marginRight: "5%", width: width, height: "60%" }}
                />
            );
        } else {
            return (
                <DatePicker
                    onChange={handleMonthChange}
                    defaultValue={defaultDate}
                    picker="month"
                    style={{ marginRight: "5%", width: "15%", height: "60%" }}
                />
            );
        }
    }

    useEffect(() => {
        if (isTableScroll === false && pdfState === "receipt") {
            const handleDownloadPdf = async () => {
                console.log("CONVERT PDF");
                let imgArray = [];
                const element = printRef.current;
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
                pdf.save("receipt.pdf");
            };
            handleDownloadPdf();
            setTableScroll(true);
            setPdfState("")
        }
    }, [pdfState]);

    useEffect(() => {
        if (isTableScroll === false && pdfState === "summary") {
            const handleDownloadPdf = async () => {
                console.log("CONVERT PDF");
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
            };
            handleDownloadPdf();
            setTableScroll(true);
            setPdfState("")
        }
    }, [pdfState]);

    const disabledBtnAddTask = (array) => {
        const even = (element) => element['task_time_spend'] === undefined || element['task_time_spend'] === null || element['task_time_spend'] === 0;
        return array.some(even);
    };

    const getDataSourceByItem99091 = (item) => {
        return [
            {
                _key: "temp",
                name: "Temperature",
                value: item['temperature'] || ''
            },
            {
                _key: "spo2",
                name: "SPO2",
                value: item['spo2'] || ''
            },
            {
                _key: "hear_rate",
                name: "Hear Rate",
                value: item['heart_rate'] || ''
            },
            {
                _key: "blood_pressure",
                name: "Blood Pressure",
                value: item['blood_pressure'] || ''
            },
            {
                _key: "res_rate",
                name: "Respiration Rate",
                value: item['respiration_rate'] || ''
            },
        ]
    }

    const checkTotalNumberDateHaveDataFromInflux = (startDate = "", sensorType = "", patch) => {
        const start = new Date(startDate);
        const end = new Date();

        if (start.getTime() > end.getTime()) return;

        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${location.state.pid}_${sensorType}")
                |> yield(name: "mean")
            `

        const arrDateQuery = [];
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                let time = new Date(o._time);
                time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
                
                if (!arrDateQuery.includes(time)) {
                    arrDateQuery.push(time);
                }
            },
            error(error) {
                console.log('ERROR', patch)
            },
            complete() {
                patch.totalDay = arrDateQuery?.length;
                patch.datesInflux = arrDateQuery;
            },
        })
    };

    const numberOfNightsBetweenDates = (start, end) => {
        let dayCount = 0;
        while (end >= start) {
            dayCount++;
            start.setDate(start.getDate() + 1);
        };

        return dayCount
    }

    const filterDeviceAssociatedByDate = useMemo(() => {
        if (!associatedSensorsState) return false;

        const newArr = [];
        let totalDayMonitored = 0;

        let minDate = null;
        let maxDate = null;
        const timeFilter = new Date(currentDateApi);

        for (let index = 0; index < patchArray.length; index++) {
            const patch = patchArray[index];

            if (patch?.datesInflux?.length > 0) {
                const firstDateMonitored = new Date(patch.datesInflux[0]);
                const lastDateMonitored = new Date(patch.datesInflux[patch.datesInflux?.length - 1])
                if (
                    Number(firstDateMonitored.getFullYear()) === Number(timeFilter.getFullYear()) 
                    && Number(firstDateMonitored.getMonth()) === Number(timeFilter.getMonth())
                ) {
                    if (minDate === null || minDate > firstDateMonitored) {
                        minDate = firstDateMonitored;
                    } 
                    
                    if (maxDate === null || maxDate < lastDateMonitored) {
                        maxDate = lastDateMonitored;
                    }

                    newArr.push(patch);
                }
            }
        } 

        if (minDate !== null && maxDate !== null) {
            totalDayMonitored = numberOfNightsBetweenDates(new Date(minDate), new Date(maxDate));
        }

        let result = 0;
        if (totalDayMonitored > TOTAL_HOURS_FOR_EACH_SENSOR_BILLED) {
            result = Math.floor(totalDayMonitored / TOTAL_HOURS_FOR_EACH_SENSOR_BILLED);
        }

        if (result > 0 
                && Number(new Date().getFullYear()) === Number(timeFilter.getFullYear()) 
                && Number(new Date().getMonth()) === Number(timeFilter.getMonth())
                && !activeCode99454
        ) {
            setActiveCode99454(true);
        }

        setPatchLoading(false);

        return { list: newArr, totalDayMonitored, billedUnit: result };
    }, [patchArray, currentDateApi, associatedSensorsState]);

    return rightSideLoading ? (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Spin />
        </div>
    ) : (
        <div className="bm-container">
            <div className="bm-enroll-container">
                <div className="bm-sidebar">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ fontSize: "1.7rem" }}>Billing</div>
                        <CusBtn
                            onClick={() => {
                                history.push(
                                    `/dashboard/patient/details/${location.state.pid}`
                                );
                            }}
                            className="secondary"
                        >
                            <CloseOutlined />
                        </CusBtn>
                    </div>
                    <div className="bm-cptcodes-container">
                        <div className="bm-cptcode-container">
                            {enrolledState ? (
                                <div
                                    onClick={() => {
                                        setAssociatedSensorsState(false);
                                        setInitialSetupState(true);
                                        setFirstTwentyState(false);
                                        setSecondTwentyState(false);
                                        setAddTaskState(false);
                                        setLastBillingState(false);
                                        setBillProcessedState(false);
                                        setSummaryState(false);
                                        
                                        setTaskDeleteArray([]);

                                    }}
                                    className={
                                        initialSetupState ? "bm-selected-active" : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={
                                        initialStepDoneState
                                            ? { background: "#81ff00" }
                                            : { background: "#ffcd00" }
                                    }
                                ></div>
                                <div className="bm-header-number-active">{CPT_CODE.CPT_99453}</div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        initialStepDoneState
                                            ? { background: "#81ff00" }
                                            : { background: "#ffcd00" }
                                    }
                                ></div>
                                <div className="bm-header-below">Initial Setup</div>
                            </div>
                        </div>
                        <div className="bm-cptcode-container">
                            {enrolledState ? (
                                <div
                                    onClick={() => {
                                        setAssociatedSensorsState(true);
                                        setInitialSetupState(false);
                                        setFirstTwentyState(false);
                                        setSecondTwentyState(false);
                                        setAddTaskState(false);
                                        setLastBillingState(false);
                                        setBillProcessedState(false);
                                        setSummaryState(false);
                                        setTaskDeleteArray([]);
                                        setTaskCodeActive(CPT_CODE.CPT_99454)
                                        if (!associatedSensorsState) {
                                            setPatchLoading(true);
                                        }
                                    }}
                                    className={
                                        associatedSensorsState
                                            ? "bm-selected-active"
                                            : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={
                                        initialStepDoneState
                                            ? activeCode99454
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={initialStepDoneState ? { color: "black" } : null}
                                >
                                    {CPT_CODE.CPT_99454}
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        initialStepDoneState
                                            ? activeCode99454
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div className="bm-header-below">Associate Sensors</div>
                            </div>
                        </div>
                        <div className="bm-cptcode-container">
                            {enrolledState ? (
                                <div
                                    onClick={() => {
                                        setAssociatedSensorsState(false);
                                        setInitialSetupState(false);
                                        setFirstTwentyState(true);
                                        setSecondTwentyState(false);
                                        setAddTaskState(false);
                                        setLastBillingState(false);
                                        setBillProcessedState(false);
                                        setSummaryState(false);
                                        setTaskDeleteArray([]);
                                        setTaskCodeActive(CPT_CODE.CPT_99457)
                                    }}
                                    className={
                                        firstTwentyState ? "bm-selected-active" : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={
                                        initialStepDoneState
                                            ? firstTotalTime >= 1200
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={initialStepDoneState ? { color: "black" } : null}
                                >
                                    {CPT_CODE.CPT_99457}
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        initialStepDoneState
                                            ? firstTotalTime >= 1200
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div className="bm-header-below">{`${Math.floor(firstTotalTimeDisplay / 60)} mins monitored`}</div>
                            </div>
                        </div>
                        <div className="bm-cptcode-container">
                            {enrolledState && firstTotalTime >= 1200 ? (
                                <div
                                    onClick={() => {
                                        setAssociatedSensorsState(false);
                                        setInitialSetupState(false);
                                        setFirstTwentyState(false);
                                        setSecondTwentyState(true);
                                        setAddTaskState(false);
                                        setLastBillingState(false);
                                        setBillProcessedState(false);
                                        setSummaryState(false);
                                        setTaskDeleteArray([]);
                                        setTaskCodeActive(CPT_CODE.CPT_99458)
                                    }}
                                    className={
                                        secondTwentyState ? "bm-selected-active" : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={
                                        initialStepDoneState ?
                                            Math.floor(secondTotalTime / TOTAL_HOURS_FOR_EACH_99458_BILLED) > 0
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={firstTotalTime >= 1200 ? { color: "black" } : null}
                                >
                                    {CPT_CODE.CPT_99458}
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        initialStepDoneState ?
                                            Math.floor(secondTotalTime / TOTAL_HOURS_FOR_EACH_99458_BILLED) > 0
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div className="bm-header-below">{`${Math.floor(secondTotalTime / 60) >= (TOTAL_HOURS_FOR_EACH_99458_BILLED * 2) ? `${TOTAL_HOURS_FOR_EACH_99458_BILLED * 2}` : `${Math.floor(secondTotalTime / 60)}` } mins monitored`}</div>
                            </div>
                            {/* <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line
                                    style={{ background: "#ffcd00" }}
                                ></div>
                            </div> */}
                        </div>
                        <div className="bm-cptcode-container">
                            {enrolledState ? (
                                <div
                                    style={{ height: "120%" }}
                                    onClick={() => {
                                        setAssociatedSensorsState(false);
                                        setInitialSetupState(false);
                                        setFirstTwentyState(false);
                                        setSecondTwentyState(false);
                                        setAddTaskState(false);
                                        setLastBillingState(true);
                                        setBillProcessedState(false);
                                        setSummaryState(false);
                                        setTaskDeleteArray([]);
                                        setTaskCodeActive(CPT_CODE.CPT_99091)
                                    }}
                                    className={
                                        lastBillingState ? "bm-selected-active" : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={
                                        initialStepDoneState
                                            ? lastStateDone
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={initialStepDoneState ? { color: "black" } : null}
                                >
                                    99091
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div className="bm-header-below" style={{ marginLeft: "12%" }}>
                                {Math.floor(totalTime99091 / 60) >= TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                    <>
                                              {`${TOTAL_HOURS_FOR_EACH_99091_BILLED}/${TOTAL_HOURS_FOR_EACH_99091_BILLED} mins monitored`}
                                      </>
                                        )}
                                         {Math.floor(totalTime99091 / 60) < TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                              <>
                                              {`${Math.floor(totalTime99091/60) }/${TOTAL_HOURS_FOR_EACH_99091_BILLED} mins monitored`}
                                              </>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="bm-cptcode-container" style={{ marginTop: "15%" }}>
                            {enrolledState ? (
                                <div
                                    style={{ height: "120%" }}
                                    onClick={() => {
                                        setAssociatedSensorsState(false);
                                        setInitialSetupState(false);
                                        setFirstTwentyState(false);
                                        setSecondTwentyState(false);
                                        setAddTaskState(false);
                                        setLastBillingState(false);
                                        setBillProcessedState(true);
                                        getTenantData();
                                        // setBillProcessedLoading(true);
                                        setSummaryState(false);
                                        setTaskDeleteArray([]);
                                    }}
                                    className={
                                        billProcessedState ? "bm-selected-active" : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={enrolledState ? { background: "#ffcd00" } : null}
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={enrolledState ? { color: "black" } : null}
                                >
                                    Bill Processed
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div className="bm-header-below" style={{ marginLeft: "12%" }}>
                                    No
                                </div>
                            </div>
                        </div>
                        <div className="bm-cptcode-container" style={{ marginTop: "15%" }}>
                            {enrolledState ? (
                                <div
                                    style={{ height: "120%" }}
                                    onClick={() => {
                                        setAssociatedSensorsState(false);
                                        setInitialSetupState(false);
                                        setFirstTwentyState(false);
                                        setSecondTwentyState(false);
                                        setAddTaskState(false);
                                        setLastBillingState(false);
                                        setBillProcessedState(false);
                                        setSummaryState(true);
                                        setTaskDeleteArray([]);
                                    }}
                                    className={
                                        summaryState ? "bm-selected-active" : "bm-selected"
                                    }
                                ></div>
                            ) : null}
                            <div className="bm-cptcode-header">
                                <div
                                    className="bm-header-dot"
                                    style={{ background: "#ffcd0000" }}
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={enrolledState ? { color: "black" } : null}
                                >
                                    Summary
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div className="bm-header-below" style={{ marginLeft: "12%" }}>
                                    All Billing Logs
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!enrolledState ? (
                    currentDateApi === presentMonth ? (
                        <div className="bm-right-container">
                            {/* <div
                                style={
                                    addTaskState
                                        ? {
                                            filter: "blur(4px)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "11%",
                                        }
                                        : {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "11%",
                                        }
                                }
                            >
                                <CusBtn
                                    onClick={() => {
                                        history.push(
                                            `/dashboard/patient/details/${location.state.pid}`
                                        );
                                    }}
                                    className="secondary"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        padding: "1rem 5%",
                                    }}
                                >
                                    <div
                                        className="gv-patient-name"
                                        style={{ fontSize: "1.4rem" }}
                                    >
                                        {location.state
                                            ? location.state.name
                                            : history.push(`/dashboard/patient/details/${pid}`)}
                                    </div>
                                    <div
                                        className="gv-patient-mr"
                                        style={{ fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.5)" }}
                                    >
                                        {"MR: "}
                                        {location.state
                                            ? location.state.mr
                                            : history.push(`/dashboard/patient/details/${pid}`)}
                                    </div>
                                </CusBtn>
                                {placeDatePicker()}
                            </div> */}

                            <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />
                            
                            <div className="bm-notenroll-container">
                                <div style={{ fontSize: "4rem" }}>Billing</div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ fontSize: "2rem" }}>
                                        Enroll to generate CPT code
                                    </div>
                                    <div style={{ fontSize: "1rem", color: "#7E7979" }}>
                                        As you enroll, remote patient monitoring will start.
                                    </div>
                                </div>

                                <CusBtn
                                    onClick={() => {
                                        setEnrolledState(true);
                                        setInitialSetupLoading(true);
                                        initialSetupPost();
                                    }}
                                    className="primary"
                                    style={{ marginTop: "3%", padding: "1% 5%" }}
                                    disabled={patchArray.length == 0 ? true : false}
                                >
                                    Start
                                </CusBtn>

                            </div>
                        </div>
                    ) : (
                        <div className="bm-right-container">
                            {/* <div
                                style={
                                    addTaskState
                                        ? {
                                            filter: "blur(4px)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "11%",
                                        }
                                        : {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "11%",
                                        }
                                }
                            >
                                <CusBtn
                                    onClick={() => {
                                        history.push(
                                            `/dashboard/patient/details/${location.state.pid}`
                                        );
                                    }}
                                    className="secondary"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        padding: "1rem 5%",
                                    }}
                                >
                                    <div
                                        className="gv-patient-name"
                                        style={{ fontSize: "1.4rem" }}
                                    >
                                        {location.state
                                            ? location.state.name
                                            : history.push(`/dashboard/patient/details/${pid}`)}
                                    </div>
                                    <div
                                        className="gv-patient-mr"
                                        style={{ fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.5)" }}
                                    >
                                        {"MR: "}
                                        {location.state
                                            ? location.state.mr
                                            : history.push(`/dashboard/patient/details/${pid}`)}
                                    </div>
                                </CusBtn>
                                {placeDatePicker()}
                            </div> */}

                            <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />

                            <div className="bm-notenroll-container">
                                <div style={{ fontSize: "4rem" }}>No Billing Info</div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ fontSize: "2rem" }}>
                                        {`No billing data for the month of ${currentActiveMonth} ${currentDateApi.substring(
                                            0,
                                            4
                                        )}`}
                                    </div>
                                    <div style={{ fontSize: "1rem", color: "#7E7979" }}>
                                        Please select another month or start a new billing.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ) : null}

                {initialSetupLoading ? (
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spin />
                    </div>
                ) : null}

                {initialSetupState ? (
                    <div className="bm-right-container">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                height: "11%",
                            }}
                        >
                            <CusBtn
                                onClick={() => {
                                    history.push(
                                        `/dashboard/patient/details/${location.state.pid}`
                                    );
                                }}
                                className="secondary"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    padding: "1rem 5%",
                                }}
                            >
                                <div className="gv-patient-name" style={{ fontSize: "1.4rem" }}>
                                    {location.state
                                        ? location.state.name
                                        : history.push(`/dashboard/patient/details/${pid}`)}
                                </div>
                                <div
                                    className="gv-patient-mr"
                                    style={{ fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.5)" }}
                                >
                                    {"MR: "}
                                    {location.state
                                        ? location.state.mr
                                        : history.push(`/dashboard/patient/details/${pid}`)}
                                </div>
                            </CusBtn>
                            <div className="bm-date-month-container">
                                <div className="bm-month-container">
                                    {initialSetupData.month} {initialSetupData.year}
                                </div>
                                <div>{`First enabled on ${initialSetupData.date}`}</div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "89%",
                            }}
                        >
                            <CheckCircleOutlined
                                style={{
                                    color: "#11c111",
                                    fontSize: "3rem",
                                    marginBottom: "3%",
                                }}
                            />
                            <div style={{ fontSize: "2rem", color: "#11c111" }}>
                                Congratulations!
                            </div>
                            <div style={{ fontSize: "1rem", color: "#878787" }}>
                                You have successfully started CPT module for the patient.
                            </div>
                            <div
                                style={{
                                    fontSize: "1rem",
                                    color: "#878787",
                                    marginBottom: "3%",
                                }}
                            >
                                Get ready for the smooth patient monitoring.
                            </div>
                            <div style={{ fontSize: "2rem", marginBottom: "3%" }}>
                                CPT code: 99453 enabled
                            </div>
                            <div
                                style={{ fontSize: "1rem", marginBottom: "2%" }}
                            >{`Recorded timestamp: ${initialSetupData.date} ${initialSetupData.time}`}</div>
                            <div
                                style={{
                                    fontSize: "1rem",
                                    color: "#878787",
                                    width: "100%",
                                    textAlign: "center",
                                }}
                            >
                                <CheckCircleOutlined
                                    style={{ color: "#878787", marginRight: "1%" }}
                                />
                                Last month bill has been processed
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* -------------- Code 99454 -------------- */}          
                {patchLoading ? (
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spin />
                    </div>
                ) : associatedSensorsState ? (
                    <div className="bm-right-container">
                        <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />

                        <div className="bm-sensor-mid">
                            <div
                                style={{
                                    minWidth: "21rem",
                                    maxWidth: "23rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div className="bm-sensor-monitored-bar">
                                    <div className="bm-sensor-monitored-bar-two"
                                        style={{
                                            width: `${(filterDeviceAssociatedByDate?.totalDayMonitored / 16) * 100}%`,
                                        }}>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "1.2rem" }}>Days Monitored: {filterDeviceAssociatedByDate?.totalDayMonitored}/{TOTAL_HOURS_FOR_EACH_SENSOR_BILLED}</div>
                                    {filterDeviceAssociatedByDate?.billedUnit > 0 && (
                                        <div style={{ color: "#00000085" }}>
                                            {`${filterDeviceAssociatedByDate?.billedUnit} billed unit.`}
                                        </div>
                                    )}

                                    <div style={{ color: "#00000085" }}>
                                        {`You need to provide at least ${TOTAL_HOURS_FOR_EACH_SENSOR_BILLED} days of monitoring.`}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bm-sensor-bottom-container">
                            <div className="bm-sensor-bottom-header">Associated Devices</div>
                            <div className="bm-sensor-bottom-table-header">
                                <div className="bm-item-header" style={{ width: "20%" }}>Name of patch</div>
                                <div className="bm-item-header" style={{ width: "20%" }}>SR No</div>
                                <div className="bm-item-header" style={{ width: "17%" }}>Type of Patch</div>
                                <div className="bm-item-header" style={{ width: "15%" }}>First Date Monitored</div>
                                <div className="bm-item-header" style={{ width: "15%" }}>Last Date Monitored</div>
                                <div className="bm-item-header" style={{ width: "13%" }}>Total Number Of Day</div>
                            </div>
                            <div style={{ overflowY: "scroll", height: "70%", marginRight: '-6px' }}>
                                {filterDeviceAssociatedByDate?.list?.length === 0 ? (
                                    <div
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "2rem",
                                            color: "#00000082",
                                        }}
                                    >
                                        No Associated Devices
                                    </div>
                                ) : (
                                    <>
                                        {filterDeviceAssociatedByDate?.list?.map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    height: "55px",
                                                    fontSize: "1rem",
                                                    background: "#ffb300c2",
                                                    margin: "0.5% 0%"
                                                }}
                                            >
                                                <div className="bm-item-body" style={{ width: "20%" }}>
                                                    {item["patches.patch_mac"]}
                                                </div>
                                                <div className="bm-item-body" style={{ width: "20%" }}>
                                                    {item["patches.patch_serial"]}
                                                </div>
                                                <div className="bm-item-body" style={{ width: "17%" }}>
                                                    {item["patches.patch_type"]}
                                                </div>
                                                <div className="bm-item-body" style={{ width: "15%" }}>
                                                    {moment(item?.datesInflux?.[0]).format('YYYY-MM-DD')}
                                                </div>
                                                <div className="bm-item-body" style={{ width: "15%" }}>
                                                    {moment(item?.datesInflux?.[item?.datesInflux?.length - 1]).format('YYYY-MM-DD')}
                                                </div>
                                                <div className="bm-item-body" style={{ width: "13%" }}>
                                                    {item?.totalDay || 0}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* -------------- Code 99457 -------------- */}
                {firstTwentyState ? (
                    tasksLoadingState ? (
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Spin />
                        </div>
                    ) : (
                        <div className="bm-right-container">
                            {addTaskState ? addTaskComponent() : null}

                            <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />

                            <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-sensor-mid"
                            >
                                {firstTotalTime >= 1200 ? (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99457 enabled at  ${getDateEnable99457(firstTwentyTasks)}`}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {``}
                                    </div>
                                )}
                                <div
                                    style={{
                                        minWidth: "21rem",
                                        maxWidth: "23rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div className="bm-sensor-monitored-bar">
                                        <div
                                            className="bm-sensor-monitored-bar-two"
                                            style={{
                                                width: `${(Math.floor(firstTotalTimeDisplay / 60) / 20) * 100 > 100 ? 100 : (Math.floor(firstTotalTimeDisplay / 60) / 20) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "1.2rem" }}>
                                            {`Mins Monitored: ${Math.floor(firstTotalTimeDisplay / 60)}/20`}
                                        </div>
                                        <div style={{ color: "#00000085" }}>
                                            <b>{`${20 - (Math.floor(firstTotalTimeDisplay / 60))} mins`}</b> left to
                                            enable the next CPT code.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <TaskTable 
                                timeCount={timeCount}
                                CPT_CODE={CPT_CODE.CPT_99457}
                                addTask={addTaskState} 
                                dataTable={firstTwentyTasks}
                                setAddTaskState={setAddTaskState}
                                startCountTimer={startCountTimer}
                                renderTimerClock={renderTimerClock}
                                disabledBtnAdd={firstTotalTime >= TOTAL_HOURS_FOR_EACH_99458_BILLED * 60 ? true : false}
                            />

                            {/* <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-twenty-bottom-container"
                            >
                                <div className="bm-twenty-header">
                                    Tasks
                                </div>
                                {firstTwentyTasks.length === 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "85%",
                                            width: "100%",
                                        }}
                                    >
                                        <div style={{ margin: "2%" }}>
                                            No tasks updated or scheduled yet
                                        </div>
                                        <CusBtn
                                            onClick={() => {
                                                timeCount = 0;
                                                setAddTaskState(true);
                                                startCountTimer('add-task-timer');
                                            }}
                                            className="primary"
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : (
                                    <div className="bm-sensor-bottom-container">
                                        <div className="bm-sensor-bottom-header title-table">Task</div>
                                        <div className="bm-sensor-bottom-table-header">
                                            <div className="bm-item-header" style={{ width: "20%" }}>Date</div>
                                            <div className="bm-item-header" style={{ width: "30%" }}>Staff Name</div>
                                            <div className="bm-item-header" style={{ width: "30%" }}>Note</div>
                                            <div className="bm-item-header" style={{ width: "20%" }}>Time Spent</div>
                                        </div>
                                        <div style={{ overflowY: "scroll", height: "70%", marginRight: "-6px" }}>
                                            {firstTwentyTasks.map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        height: "auto",
                                                        fontSize: "1rem",
                                                        background: "#ffb300c2",
                                                        margin: "0.5% 0%",
                                                        paddingTop: "0.5rem",
                                                        paddingBottom: "0.5rem"
                                                    }}
                                                >
                                                    <div className="bm-item-body" style={{ width: "20%" }}>
                                                        {moment(item["task_date"]).format("YYYY-MM-DD")}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "30%" }}>
                                                        {item["staff_name"]}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "30%" }}>
                                                        {item["task_note"]}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "20%" }}>
                                                        <span style={{ paddingRight: "10px" }} id={`item-99457-time-spent-${item.task_id}`}>
                                                            {`${renderTimeDisplay(item['task_time_spend'])}`}
                                                        </span>
                                                        {renderTimerClock(item, CPT_CODE.CPT_99457)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {firstTwentyTasks.length !== 0 ? (
                                    <div
                                        style={addTaskState ? { filter: "blur(4px)" } : null}
                                        className="bm-bottom-add-btn"
                                    >
                                        <CusBtn
                                            onClick={() => {
                                                timeCount = 0;
                                                setAddTaskState(true);
                                                startCountTimer('add-task-timer');
                                            }}
                                            style={{ padding: "1% 5%" }}
                                            disabled={disabledBtnAddTask(firstTwentyTasks) || firstTotalTime >= 1200 ? true : false}
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : null}
                            </div> */}
                        </div>
                    )
                ) : null}

                {/* -------------- Code 99458 -------------- */}
                {secondTwentyState ? (
                    tasksLoadingState ? (
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Spin />
                        </div>
                    ) : (
                        <div className="bm-right-container">
                            {addTaskState ? addTaskComponent() : null}

                            <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />

                            <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-sensor-mid"
                            >
                                { secondTotalTime >= TOTAL_HOURS_FOR_EACH_99458_BILLED*2 ? (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99458 enabled at ${moment(secondTwentyTasks[secondTwentyTasks.length - 1].task_date).format("YYYY-MM-DD")}`}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99458 has not been enabled yet`}
                                    </div>
                                )}
                                <div
                                    style={{
                                        minWidth: "21rem",
                                        maxWidth: "23rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div className="bm-sensor-monitored-bar">
                                    {Math.floor(secondTotalTime / 60) < (TOTAL_HOURS_FOR_EACH_99458_BILLED *2) &&(
                                        <div
                                        className="bm-sensor-monitored-bar-two"
                                        style={{
                                            width: `${(Math.floor(secondTotalTime / 60) / (TOTAL_HOURS_FOR_EACH_99458_BILLED*2)) * 100
                                                }%`,
                                        }}
                                    ></div>
                                    )}
                                    {Math.floor(secondTotalTime / 60) >= (TOTAL_HOURS_FOR_EACH_99458_BILLED *2) &&(
                                        <div
                                        className="bm-sensor-monitored-bar-two"
                                        style={{
                                            width: `${((TOTAL_HOURS_FOR_EACH_99458_BILLED*2) / (TOTAL_HOURS_FOR_EACH_99458_BILLED*2)) * 100
                                                }%`,
                                        }}
                                    ></div>
                                    )}
                                        
                                        <div style={{ marginTop: "10px" }}>
                                            {Math.floor(secondTotalTime / 60) < (TOTAL_HOURS_FOR_EACH_99458_BILLED *2) &&(
                                                <div style={{ fontSize: "1.2rem" }}>
                                                {`Mins Monitored: ${Math.floor(secondTotalTime / 60)}/${TOTAL_HOURS_FOR_EACH_99458_BILLED * 2}`}
                                            </div>
                                            )}
                                            {Math.floor(secondTotalTime / 60) >= (TOTAL_HOURS_FOR_EACH_99458_BILLED *2) &&(
                                                <div style={{ fontSize: "1.2rem" }}>
                                                {`Mins Monitored: ${TOTAL_HOURS_FOR_EACH_99458_BILLED * 2}/${TOTAL_HOURS_FOR_EACH_99458_BILLED * 2}`}
                                            </div>
                                            )}
                                            {Math.floor(secondTotalTime / 60 / TOTAL_HOURS_FOR_EACH_99458_BILLED) > 0 && (
                                                <p>{Math.floor(secondTotalTime / 60 / TOTAL_HOURS_FOR_EACH_99458_BILLED)} Unit Billed</p>
                                            )}
                                            {Math.floor(secondTotalTime / 60) < (TOTAL_HOURS_FOR_EACH_99458_BILLED *2) &&(
                                                 <div style={{ color: "#00000085" }}>
                                                 <b>{`${TOTAL_HOURS_FOR_EACH_99458_BILLED*2 - (Math.floor(secondTotalTime / 60))} mins`}</b> left to
                                                 enable the next CPT code.
                                             </div>
                                            )}
                                           {Math.floor(secondTotalTime / 60) >= (TOTAL_HOURS_FOR_EACH_99458_BILLED *2) &&(
                                                 <div style={{ color: "#00000085" }}>
                                                 0 left to enable the next CPT code.
                                             </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <TaskTable 
                                timeCount={timeCount}
                                CPT_CODE={CPT_CODE.CPT_99458}
                                addTask={addTaskState} 
                                dataTable={secondTwentyTasks}
                                setAddTaskState={setAddTaskState}
                                startCountTimer={startCountTimer}
                                renderTimerClock={renderTimerClock}
                                disabledBtnAdd={Math.floor(secondTotalTime / 60) >= (TOTAL_HOURS_FOR_EACH_99458_BILLED * 2) ? true : false}
                            />

                            {/* <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-twenty-bottom-container"
                            >
                                <div className="bm-twenty-header">
                                    Tasks
                                </div>
                                {secondTwentyTasks.length === 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "85%",
                                            width: "100%",
                                        }}
                                    >
                                        <div style={{ margin: "2%" }}>
                                            No tasks updated or scheduled yet
                                        </div>
                                        <CusBtn
                                            onClick={() => {
                                                timeCount = 0;
                                                setAddTaskState(true);
                                                startCountTimer('add-task-timer')
                                            }}
                                            className="primary"
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : (
                                    <div className="bm-sensor-bottom-container">
                                        <div className="bm-sensor-bottom-header title-table">Task</div>
                                        <div className="bm-sensor-bottom-table-header">
                                            <div className="bm-item-header" style={{ width: "20%" }}>Date</div>
                                            <div className="bm-item-header" style={{ width: "30%" }}>Staff Name</div>
                                            <div className="bm-item-header" style={{ width: "30%" }}>Note</div>
                                            <div className="bm-item-header" style={{ width: "20%" }}>Time Spent</div>

                                        </div>
                                        <div style={{ overflowY: "scroll", height: "70%", marginRight: "-6px" }}>
                                            {secondTwentyTasks.map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        height: "auto",
                                                        fontSize: "1rem",
                                                        background: "#ffb300c2",
                                                        margin: "0.5% 0%",
                                                        paddingTop: "0.5rem",
                                                        paddingBottom: "0.5rem"
                                                    }}
                                                >
                                                    <div className="bm-item-body" style={{ width: "20%" }}>
                                                        {moment(item["task_date"]).format("YYYY-MM-DD")}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "30%" }}>
                                                        {item["staff_name"]}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "30%" }}>
                                                        {item["task_note"]}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "20%" }}>
                                                        <span style={{ paddingRight: "10px" }} id={`item-99458-time-spent-${item.task_id}`}>
                                                            {`${renderTimeDisplay(item['task_time_spend'])}`}
                                                        </span>
                                                        {renderTimerClock(item, CPT_CODE.CPT_99458)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {secondTwentyTasks.length !== 0 ? (
                                    <div
                                        style={addTaskState ? { filter: "blur(4px)" } : null}
                                        className="bm-bottom-add-btn"
                                    >
                                        <CusBtn
                                            onClick={() => {
                                                setAddTaskState(true);
                                            }}
                                            style={{ padding: "1% 5%" }}
                                            disabled={disabledBtnAddTask(secondTwentyTasks)}
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : null}
                            </div> */}
                        </div>
                    )
                ) : null}

                {/* -------------- Code 99091 -------------- */}
                {lastStateLoading ? (
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spin />
                    </div>
                ) : lastBillingState ? (
                    <div className="bm-right-container">
                            {addTaskState ? addTaskComponent() : null}
                            <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />
                            
                            <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-sensor-mid"
                            >
                                {totalTime99091 >= TOTAL_HOURS_FOR_EACH_99091_BILLED * 60 ? (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99091 enabled at ${getDateEnable99457(task99091)}`}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99091 has not been enabled yet`}
                                    </div>
                                )}
                                <div
                                    style={{
                                        minWidth: "21rem",
                                        maxWidth: "23rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div className="bm-sensor-monitored-bar">
                                        {Math.floor(totalTime99091 / 60) >= TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                            <div
                                                 className="bm-sensor-monitored-bar-two"
                                                 style={{
                                                     width: `${1 * 100}%`,
                                                 }}
                                             ></div>
                                        )}
                                        {Math.floor(totalTime99091 / 60) < TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                            <div
                                            className="bm-sensor-monitored-bar-two"
                                            style={{
                                                width: `${Math.floor(totalTime99091 / 60) / TOTAL_HOURS_FOR_EACH_99091_BILLED * 100}%`,
                                            }}
                                        ></div>
                                        )}
                                        <div style={{ marginTop: "10px" }}>
                                        {Math.floor(totalTime99091 / 60) >= TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                              <div style={{ fontSize: "1.2rem" }}>
                                              {`Mins Monitored: ${TOTAL_HOURS_FOR_EACH_99091_BILLED}/${TOTAL_HOURS_FOR_EACH_99091_BILLED}`}
                                          </div>
                                        )}
                                         {Math.floor(totalTime99091 / 60) < TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                              <div style={{ fontSize: "1.2rem" }}>
                                              {`Mins Monitored: ${Math.floor(totalTime99091/60) }/${TOTAL_HOURS_FOR_EACH_99091_BILLED}`}
                                          </div>
                                        )}
                                          {Math.floor(totalTime99091 / 60) < TOTAL_HOURS_FOR_EACH_99091_BILLED && (
                                               <div style={{ color: "#00000085" }}>
                                               <b>{`${TOTAL_HOURS_FOR_EACH_99091_BILLED - (Math.floor(totalTime99091 / 60) % TOTAL_HOURS_FOR_EACH_99091_BILLED)} mins`}</b> left to
                                               enable the next CPT code.
                                           </div>
                                          )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <TaskTable 
                                timeCount={timeCount}
                                CPT_CODE={CPT_CODE.CPT_99091}
                                addTask={addTaskState} 
                                dataTable={task99091}
                                setAddTaskState={setAddTaskState}
                                startCountTimer={startCountTimer}
                                renderTimerClock={renderTimerClock}
                                disabledBtnAdd={totalTime99091 >= TOTAL_HOURS_FOR_EACH_99091_BILLED * 60 ? true: false}
                            />

                            {/* <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-twenty-bottom-container"
                            >
                                <div className="bm-twenty-header">
                                    Tasks
                                </div>
                                {thirdTwentyTasks.length === 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "85%",
                                            width: "100%",
                                        }}
                                    >
                                        <div style={{ margin: "2%" }}>
                                            No tasks updated or scheduled yet
                                        </div>
                                        <CusBtn
                                            onClick={() => {
                                                timeCount = 0;
                                                setAddTaskState(true);
                                                startCountTimer('add-task-timer')
                                            }}
                                            className="primary"
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : (
                                    <div className="bm-sensor-bottom-container">
                                        <div className="bm-sensor-bottom-header title-table">Task</div>
                                        <div className="bm-sensor-bottom-table-header">
                                            <div className="bm-item-header" style={{ width: "20%" }}>Date</div>
                                            <div className="bm-item-header" style={{ width: "30%" }}>Staff Name</div>
                                            <div className="bm-item-header" style={{ width: "30%" }}>Note</div>
                                            <div className="bm-item-header" style={{ width: "20%" }}>Time Spent</div>

                                        </div>
                                        <div style={{ overflowY: "scroll", height: "70%", marginRight: "-6px" }}>
                                            {thirdTwentyTasks.map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        height: "auto",
                                                        fontSize: "1rem",
                                                        background: "#ffb300c2",
                                                        margin: "0.5% 0%",
                                                        paddingTop: "0.5rem",
                                                        paddingBottom: "0.5rem"
                                                    }}
                                                >
                                                    <div className="bm-item-body" style={{ width: "20%" }}>
                                                        {moment(item["task_date"]).format("YYYY-MM-DD")}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "30%" }}>
                                                        {item["staff_name"]}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "30%" }}>
                                                        {item["task_note"]}
                                                    </div>
                                                    <div className="bm-item-body" style={{ width: "20%" }}>
                                                        <span style={{ paddingRight: "10px" }} id={`item-99458-time-spent-${item.task_id}`}>
                                                            {`${renderTimeDisplay(item['task_time_spend'])}`}
                                                        </span>
                                                        {renderTimerClock(item, CPT_CODE.CPT_99458)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {thirdTwentyTasks.length !== 0 ? (
                                    <div
                                        style={addTaskState ? { filter: "blur(4px)" } : null}
                                        className="bm-bottom-add-btn"
                                    >
                                        <CusBtn
                                            onClick={() => {
                                                setAddTaskState(true);
                                            }}
                                            style={{ padding: "1% 5%" }}
                                            disabled={disabledBtnAddTask(thirdTwentyTasks)}
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : null}
                            </div> */}
                        </div>

                    // <div className="bm-right-container">
                    //     <div
                    //         style={{
                    //             display: "flex",
                    //             justifyContent: "space-between",
                    //             alignItems: "center",
                    //             width: "100%",
                    //             height: "11%",
                    //         }}
                    //     >
                    //         <CusBtn
                    //             onClick={() => {
                    //                 history.push(
                    //                     `/dashboard/patient/details/${location.state.pid}`
                    //                 );
                    //             }}
                    //             className="secondary"
                    //             style={{
                    //                 display: "flex",
                    //                 flexDirection: "column",
                    //                 justifyContent: "center",
                    //                 padding: "1rem 5%",
                    //             }}
                    //         >
                    //             <div className="gv-patient-name" style={{ fontSize: "1.4rem" }}>
                    //                 {location.state
                    //                     ? location.state.name
                    //                     : history.push(`/dashboard/patient/details/${pid}`)}
                    //             </div>
                    //             <div
                    //                 className="gv-patient-mr"
                    //                 style={{ fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.5)" }}
                    //             >
                    //                 {"MR: "}
                    //                 {location.state
                    //                     ? location.state.mr
                    //                     : history.push(`/dashboard/patient/details/${pid}`)}
                    //             </div>
                    //         </CusBtn>
                    //         {/* <div className='bm-last-month-date' > */}
                    //         {placeDatePicker()}
                    //         {/* </div> */}
                    //     </div>
                    //     <div
                    //         style={{
                    //             width: "90%",
                    //             height: "14%",
                    //             margin: "5%"
                    //         }}
                    //     >
                    //         <div>
                    //             {totalTime99091 < 30 && (
                    //                 <div style={{ fontSize: "1.2rem" }}>
                    //                     CPT code: 99091 has not been enabled yet
                    //                 </div>
                    //             )}

                    //             {totalTime99091 > 30 && (
                    //                 <div style={{ fontSize: "1.2rem" }}>
                    //                     CPT code: 99091 has been enabled
                    //                 </div>
                    //             )}

                    //             <p>{totalTime99091} {totalTime99091 > 1 ? 'Minutes' : 'Minute'} of Monitoring Each 30 Days without Interactive Communication</p>
                    //         </div>
                    //         {addTaskState ? addTaskComponent(CPT_CODE.CPT_99091) : null}

                    //         <Row>
                    //             {task99091?.length > 0 && (
                    //                 <Col span={14} style={{ paddingRight: "5%" }}>
                    //                     <Collapse
                    //                         accordion
                    //                         className="collapse-table-99091"
                    //                         onChange={(val) => {
                    //                             setKeyNoteActive(val);
                    //                             setCurrentItem99091Active(val);
                    //                         }}
                    //                         defaultActiveKey={task99091[task99091?.length - 1]?.task_id}
                    //                         activeKey={keyNoteActive}
                    //                     >
                    //                         {task99091?.map((item, index) => (
                    //                             <Panel 
                    //                                 key={item.task_id}
                    //                                 header={(
                    //                                     <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    //                                         <div style={{ width: "50%" }}>Vitals</div>
                    //                                         <div style={{ width: "50%" }}>{moment(item['date']).format('YYYY-MM-DD H:mm a')}</div>
                    //                                     </div>
                    //                                 )}
                    //                             >
                    //                                 {getDataSourceByItem99091(item).map(data => {
                    //                                     return (
                    //                                         <div key={data?._key} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    //                                             <div style={{ width: "50%" }}>{data?.name}</div>
                    //                                             <div style={{ width: "50%" }}>{data?.value}</div>
                    //                                         </div>
                    //                                     )
                    //                                 })}
                    //                             </Panel>
                    //                         ))}
                    //                     </Collapse>
                    //                 </Col>
                    //             )}

                    //                     {/* <Table
                    //                         size="small"
                    //                         className="vital-table"
                    //                         style={{ marginBottom: "1.25rem" }}
                    //                         columns={[
                    //                             {
                    //                                 width: "40%",
                    //                                 title: (
                    //                                     <div
                    //                                         style={{
                    //                                             fontFamily: "Lexend",
                    //                                             fontWeight: "500",
                    //                                             fontSize: "14px",
                    //                                             color: "#727272",
                    //                                         }}
                    //                                     >
                    //                                         Vitals
                    //                                     </div>
                    //                                 ),
                    //                                 dataIndex: "name",
                    //                                 key: "name",
                    //                             },
                    //                             {
                    //                                 width: "30%",
                    //                                 title: (
                    //                                     <div
                    //                                         style={{
                    //                                             textAlign: "center",
                    //                                             fontFamily: "Lexend",
                    //                                             fontWeight: "500",
                    //                                             fontSize: "14px",
                    //                                             color: "#727272",
                    //                                         }}
                    //                                     >
                    //                                         {moment(item['date']).format('YYYY-MM-DD H:mm a')}
                    //                                     </div>
                    //                                 ),
                    //                                 dataIndex: "value",
                    //                                 key: "value",
                    //                             },
                    //                         ]}
                    //                         dataSource={getDataSourceByItem99091(item)}
                    //                         pagination={false}
                    //                         bordered
                    //                     /> */}

                    //             <Col span={10}>
                    //                 <div>

                    //                     <div style={{
                    //                         background: "#ddd",
                    //                         borderRadius: "1rem",
                    //                         padding: "3% 7%"
                    //                     }}>
                    //                         <div style={{ textAlign: "center" }}>
                    //                             Last updated at {getLastUpdatedAt99091()}
                    //                         </div>
                    //                         <div>
                    //                             <div
                    //                                 style={{
                    //                                     display: "flex",
                    //                                     alignItems: "center"
                    //                                 }}
                    //                             >
                    //                                 <div style={{ width: "45%" }}>Status: Active</div>
                    //                                 <div style={{ width: "55%" }}>Enrollment: {getFirst99091()}</div>
                    //                             </div>

                    //                             <div
                    //                                 style={{
                    //                                     display: "flex",
                    //                                     alignItems: "center"
                    //                                 }}
                    //                             >
                    //                                 <div style={{ width: "45%" }}>Months of CMM: 2</div>
                    //                                 <div style={{ width: "55%" }}>Next followup: NA</div>
                    //                             </div>
                    //                         </div>
                    //                     </div>

                    //                     <div style={{
                    //                         background: "#ddd",
                    //                         borderRadius: "1rem",
                    //                         padding: "3% 4%",
                    //                         marginTop: "1rem"
                    //                     }}>
                    //                         <div
                    //                             style={{
                    //                                 borderBottom: "1px solid #00000029",
                    //                                 paddingBottom: "6px"
                    //                             }}
                    //                         >
                    //                             Notes
                    //                         </div>
                    //                         {currentItem99091Active && 
                    //                             getNoteForItem99091()
                    //                         }
                    //                         <div style={{
                    //                             display: "flex",
                    //                             padding: "1rem 0.5rem"
                    //                         }}>

                    //                             <CusBtn
                    //                                 onClick={() => {
                    //                                     setAddTaskState(true);
                    //                                 }}
                    //                                 style={{ padding: "10px 45px" }}
                    //                                 disabled={totalTime99091 < 30 ? false : true}
                    //                             >
                    //                                 Add
                    //                             </CusBtn>

                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </Col>
                    //         </Row>
                    //     </div>


                    //     {/* {lastStateDone ? (
                    //         <div
                    //             style={{
                    //                 display: "flex",
                    //                 flexDirection: "column",
                    //                 justifyContent: "center",
                    //                 alignItems: "center",
                    //                 height: "89%",
                    //             }}
                    //         >
                    //             <CheckCircleOutlined
                    //                 style={{
                    //                     color: "#11c111",
                    //                     fontSize: "3rem",
                    //                     marginBottom: "3%",
                    //                 }}
                    //             />
                    //             <div style={{ fontSize: "2rem", color: "#11c111" }}>
                    //                 Congratulations!
                    //             </div>
                    //             <div style={{ fontSize: "2rem", marginBottom: "3%" }}>
                    //                 CPT code: 99091 enabled
                    //             </div>
                    //             <div
                    //                 style={{ fontSize: "1rem", marginBottom: "2%" }}
                    //             >{`Recorded timestamp: ${lastStateData.date} ${lastStateData.time}`}</div>
                    //         </div>
                    //     ) : (
                    //         // <div className="bm-notenroll-container" style={{ height: "89%" }}>
                    //         //     <div style={{ fontSize: "3rem" }}>
                    //         //         Enroll to generate CPT Code: 99091
                    //         //     </div>
                    //         //     <div
                    //         //         style={{
                    //         //             display: "flex",
                    //         //             flexDirection: "column",
                    //         //             justifyContent: "center",
                    //         //             alignItems: "center",
                    //         //         }}
                    //         //     >
                    //         //         <div style={{ fontSize: "1rem", color: "#7E7979" }}>
                    //         //             CPT code 99091 has not been enabled for this month
                    //         //         </div>
                    //         //     </div>
                    //         //     <CusBtn
                    //         //         onClick={() => {
                    //         //             // setLastStateLoading(true);
                    //         //             enrollLastState();
                    //         //         }}
                    //         //         className="primary"
                    //         //         style={{ marginTop: "3%", padding: "1% 5%" }}
                    //         //     >
                    //         //         Enroll
                    //         //     </CusBtn>
                    //         // </div>
                    //     )} */}
                    // </div>
                ) : null}

                {billProcessedState ? (
                    billProcessedLoading ? (
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Spin />
                        </div>
                    ) : (
                        <div className="bm-right-container">
                            <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "89%",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: "10%",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        paddingRight: "5%",
                                    }}
                                >
                                    <CusBtn
                                        onClick={() => {
                                            setTableScroll(false);
                                            setPdfState("receipt")
                                        }}
                                        className="primary"
                                    >
                                        Generate PDF
                                    </CusBtn>
                                </div>
                                <div
                                    ref={printRef}
                                    style={{ height: "90%", width: "100%", padding: "2% 5%" }}
                                >
                                    <div style={{ width: "30%", fontSize: "1rem", marginBottom: '3%' }}>
                                        From : <br />
                                        {`${tenantData ? tenantData.name : ""}`}
                                        <br />
                                        {`${tenantData
                                            ? `${tenantData.street} ${tenantData.city} ${tenantData.state} ${tenantData.country_code} ${tenantData.postal_code}`
                                            : ""
                                            }`}
                                    </div>
                                    <div
                                        style={{
                                            width: "50%",
                                            textAlign: "center",
                                            fontSize: "2rem",
                                            margin: "0% 25%",
                                            background: "#ffa000a1",
                                            borderTopLeftRadius: "30px",
                                            borderTopRightRadius: "30px",
                                            color: "#5e5e5e",
                                        }}
                                    >
                                        Billing Receipt
                                    </div>
                                    <div
                                        style={{
                                            height: "46%",
                                            width: "100%",
                                            border: "2px solid #ffa000a1",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                height: "50px",
                                                width: "100%",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderBottom: "0",
                                                    borderLeft: "0",
                                                    borderTop: "0",
                                                }}
                                            >
                                                {`MR: ${location.state.mr}`}
                                            </div>
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderBottom: "0",
                                                    borderTop: "0",
                                                }}
                                            >
                                                {`Date: ${billDateString}`}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                height: "50px",
                                                width: "100%",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderBottom: "0",
                                                    borderLeft: "0",
                                                }}
                                            >
                                                {`Patient Name: ${location.state.name}`}
                                            </div>
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderBottom: "0",
                                                }}
                                            >
                                                {`DOB: ${location.state.dob}`}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                height: "50px",
                                                width: "100%",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderBottom: "0",
                                                    borderLeft: "0",
                                                }}
                                            >
                                                {`Patient Email: ${patientData ? (patientData.email || '') : ""
                                                    }`}
                                            </div>
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderBottom: "0",
                                                }}
                                            >
                                                {`Provider Name: ${tenantData ? tenantData.name : ""}`}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                height: "50px",
                                                width: "100%",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                    borderLeft: "0",
                                                }}
                                            >
                                                {`Phone: ${location.state.phone}`}
                                            </div>
                                            <div
                                                style={{
                                                    width: "50%",
                                                    border: "1px solid #00000038",
                                                    height: "100%",
                                                    padding: "0% 2%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRight: "0",
                                                }}
                                            >
                                                {`Provider Email: ${tenantData ? tenantData.email : ""
                                                    }`}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                height: "50px",
                                                width: "100%",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                                padding: "0% 2%",
                                            }}
                                        >
                                            {`Address: ${patientData ? (patientData.street || '') : ""}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ) : null}
                {
                    summaryState
                        ?
                        (
                            <div className="bm-right-container">
                                <HeaderBilling addTask={addTaskState} currentDate={currentDateApi} onChangeDate={handleMonthChange} />

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        height: "89%",
                                        width: "100%",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "10%",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            paddingRight: "5%",
                                        }}
                                    >
                                        <CusBtn
                                            onClick={() => {
                                                setTableScroll(false);
                                                setPdfState("summary")
                                            }}
                                            className="primary"
                                        >
                                            Generate PDF
                                        </CusBtn>
                                    </div>
                                    <div
                                        ref={printRefSummary}
                                        style={{ height: "90%", width: "100%", padding: "0% 5%" }}
                                    >
                                        <div
                                            className="bm-sensor-bottom-header"
                                            style={{
                                                fontSize: "1.2rem",
                                                marginTop: "2%",
                                                height: "50px",
                                                color: "#5e5e5e",
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
                                            style={
                                                isTableScroll
                                                    ? { height: "530px", overflowY: "scroll" }
                                                    : null
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        null
                }
            </div>
        </div>
    );
}

export default BillingModule;