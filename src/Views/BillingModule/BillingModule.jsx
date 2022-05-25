import React, { useState, useEffect, useRef } from "react";
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

import { UserStore } from "../../Stores/userStore";

import "./billingModule.css";

import billingApi from "../../Apis/billingApis";
import tenantApi from "../../Apis/tenantApis";
import { CPT_CODE, CPT } from "../../Utils/utils";
import {isArray} from 'lodash';

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

function BillingModule() {
    const pid = useParams().pid;
    // console.log("pid is here....", pid);
    const [tenantuuid, setTenantuuid] = useState();
    // const [billProcessedLoading, setBillProcessedLoading] = useState(true);
    const [billProcessedLoading, setBillProcessedLoading] = useState(false);

    const [initialBillDate, setInitialBillDate] = useState('')

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

    const format = "mm:ss";

    const location = useLocation();
    const history = useHistory();

    const [enrolledState, setEnrolledState] = useState(false);
    const [initialSetupState, setInitialSetupState] = useState(false);
    const [associatedSensorsState, setAssociatedSensorsState] = useState(false);
    const [firstTwentyState, setFirstTwentyState] = useState(false);
    const [secondTwentyState, setSecondTwentyState] = useState(false);
    const [lastBillingState, setLastBillingState] = useState(false);
    const [billProcessedState, setBillProcessedState] = useState(false);
    const [summaryState, setSummaryState] = useState(false)

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
    const [secondTotalTimeStageOne, setSecondTotalTimeStageOne] = useState(0);
    const [secondTotalTimeStageOneDisplay, setSecondTotalTimeStageOneDisplay] = useState(0);
    const [secondTotalTimeStageTwo, setSecondTotalTimeStageTwo] = useState(0);
    const [secondTotalTimeStageTwoDisplay, setSecondTotalTimeStageTwoDisplay] = useState(0);

    const [stageOneState, setStageOneState] = useState(true);
    const [stageTwoState, setStageTwoState] = useState(false);

    const [taskDateVal, setTaskDateVal] = useState();
    const [taskTimeVal, setTaskTimeVal] = useState();
    const [taskNameVal, setTaskNameVal] = useState();
    const [taskNoteVal, setTaskNoteVal] = useState();

    const [taskCodeActive, setTaskCodeActive] = useState(CPT_CODE.CPT_99453);
    const [taskCodeInternalActive, setTaskCodeInternalActive] = useState("");

    const [firstTwentyTasks, setFirstTwentyTasks] = useState([]);
    const [secondTwentyTasks, setSecondTwentyTasks] = useState([]);
    const [secondTwentyStageTwoTasks, setSecondTwentyStageTwoTasks] = useState([]);

    const [runUseEffect, setRunUseEffect] = useState(0);
    const [timerTask, setTimerTask] = useState(false);

    function handleMonthChange(date, dateString) {
        console.log(dateString);

        setCurrentDateApi(dateString);
        setCurrentActiveMonth(monthNames[Number(dateString.substring(5, 7)) - 1]);
        // setRightSideLoading(true);

        setEnrolledState(false);
        setInitialSetupState(false);
        setAssociatedSensorsState(false);
        setFirstTwentyState(false);
        setSecondTwentyState(false);
        setLastBillingState(false);
        setBillProcessedState(false);

        setInitialStepDoneState(false);
        setEnrollPatchState(false);
        setLastStateDone(false);
        setLastStateData({});
        setLastStateLoading(false);
        setAddTaskState(false);
        // setTasksLoadingState(true);
        setInitialSetupLoading(false);
        setInitialSetupData({});
        setFirstTwentyData({});
        setSecondTwentyData({});
        setPatchLoading(false);
        setPatchEnrolled(false);
        setPatchData({});
        setPatchArray([]);
        setPatchInformation({});
        setFirstTotalTime(0);
        setFirstTotalTimeDisplay(0);
        setSecondTotalTimeStageOne(0);
        setSecondTotalTimeStageOneDisplay(0);
        setSecondTotalTimeStageTwo(0);
        setSecondTotalTimeStageTwoDisplay(0);
        setStageOneState(true);
        setStageTwoState(false);
        setTaskDateVal();
        setTaskTimeVal();
        setTaskNameVal();
        setTaskNoteVal();
        setTaskCodeActive("99457");
        setTaskCodeInternalActive("");
        setFirstTwentyTasks([]);
        setSecondTwentyTasks([]);
        setSecondTwentyStageTwoTasks([]);

        var temp = runUseEffect;
        temp = temp + 1;
        setRunUseEffect(temp);
    }

    function findDateIndex(month) {
        return month === currentActiveMonth;
    }

    function handleAddTaskDateChange(date, dateString) {
        var temp_date = new Date(dateString);
        setTaskDateVal(temp_date.toISOString());
    }

    function handleAddTaskTimeChange(time, timeString) {
        setTaskTimeVal(
            Number(timeString.substring(0, 2) * 60) +
            Number(timeString.substring(3, 5))
        );
    }

    function handleAddTaskNameChange(e) {
        setTaskNameVal(e.target.value);
    }

    function handleAddTaskNoteChange(e) {
        setTaskNoteVal(e.target.value);
    }

    function addTaskComponent(cptCode) {
        return (
            <div className="bm-add-task-container">
                <div style={{ width: "100%", textAlign: "right" }}>
                    <CusBtn
                        onClick={() => {
                            setAddTaskState(false);
                        }}
                        className="secondary"
                    >
                        <CloseOutlined />
                    </CusBtn>
                </div>
                <div style={{ fontSize: "1.5rem", textAlign: "center" }}>Add Task</div>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "17.7%" }}>Date</div>
                    <DatePicker onChange={handleAddTaskDateChange} />
                </div>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "21.7%" }}>Staff Name</div>
                    <Input placeholder="Name" onChange={handleAddTaskNameChange} />
                </div>
                <div>
                    Note
                    <TextArea
                        onChange={handleAddTaskNoteChange}
                        placeholder="Controlled autosize"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                    />
                </div>
                <CusBtn
                    className="primary"
                    onClick={() => {
                        // setTasksLoadingState(true);
                        setAddTaskState(false);
                        callUpdateBillingTasks(taskCodeActive);
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
    const startCountTimer = (elementId) => {
        clockCounter = setInterval(function () {
            timeCount = timeCount + 1;
            let hours = Math.floor(timeCount / 3600)
            let minutes = Math.floor(timeCount / 60) % 60
            let seconds = timeCount % 60
            let timeDs = [hours, minutes, seconds]
                .map(v => v < 10 ? "0" + v : v)
                .filter((v, i) => v !== "00" || i > 0)
                .join(":")
            document.getElementById(elementId).innerText = timeDs;
        }, 1000);
    }

    const renderTimerClock = (item) => {
        const elementId = 'task-99457-timer'
        if (!timerTask) {
            return (
                <CusBtn
                    onClick={() => {
                        startCountTimer(elementId);
                        setTimerTask(true);
                    }}
                    className="primary"
                >
                    Start
                </CusBtn>
            )
        } else {
            return (
                <div className="task-timer-wrapper" style={{ display: "flex", alignItems: "center" }}>
                    <CusBtn
                        onClick={() => {
                            item.task_time_spent = Math.floor(timeCount / 60);
                            timeCount = 0;
                            stopCountTimer();
                            setTimerTask(false);
                            callUpdateBillingTasks(CPT_CODE.CPT_99457, item)
                        }}
                        className="primary"
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
                    var secondTotalTimeStageOne = 0;
                    var secondTotalTimeStageTwo = 0;
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
                                if (item.code_internal == "99458_stage1") {
                                    tempSecondTwentyTasks.push(item);
                                    secondTotalTimeStageOne =
                                        secondTotalTimeStageOne + Number(item.timeConsidered);
                                    if (!tempSecondTwentyData.hasOwnProperty("date")) {
                                        tempSecondTwentyData = {
                                            date: getDateFromISO(item.date_time),
                                            time: getTimeFromISO(item.date_time),
                                        };
                                    }
                                }
                                if (item.code_internal == "99458_stage2") {
                                    tempSecondTwentyStageTwoTasks.push(item);
                                    secondTotalTimeStageTwo =
                                        secondTotalTimeStageTwo + Number(item.timeConsidered);
                                }
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
                    setSecondTwentyStageTwoTasks(tempSecondTwentyStageTwoTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(Math.floor(firstTotalTime / 60));

                    setSecondTotalTimeStageOne(secondTotalTimeStageOne);
                    setSecondTotalTimeStageOneDisplay(
                        Math.floor(secondTotalTimeStageOne / 60)
                    );

                    setSecondTotalTimeStageTwo(secondTotalTimeStageTwo);
                    setSecondTotalTimeStageTwoDisplay(
                        Math.floor(secondTotalTimeStageTwo / 60)
                    );

                    if (firstTotalTime === 1200) {
                        setTaskCodeActive("99458");
                    } else {
                        setTaskCodeActive("99457");
                    }

                    if (secondTotalTimeStageOne === 1200) {
                        setTaskCodeInternalActive("99458_stage2");
                    } else {
                        setTaskCodeInternalActive("99458_stage1");
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
                    var secondTotalTimeStageOne = 0;
                    var secondTotalTimeStageTwo = 0;
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
                                if (item.code_internal === "99458_stage1") {
                                    tempSecondTwentyTasks.push(item);
                                    secondTotalTimeStageOne =
                                        secondTotalTimeStageOne + Number(item.timeConsidered);
                                    if (!tempSecondTwentyData.hasOwnProperty("date")) {
                                        tempSecondTwentyData = {
                                            date: getDateFromISO(item.date_time),
                                            time: getTimeFromISO(item.date_time),
                                        };
                                    }
                                }
                                if (item.code_internal === "99458_stage2") {
                                    tempSecondTwentyStageTwoTasks.push(item);
                                    secondTotalTimeStageTwo =
                                        secondTotalTimeStageTwo + Number(item.timeConsidered);
                                }
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
                    setSecondTwentyStageTwoTasks(tempSecondTwentyStageTwoTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(Math.floor(firstTotalTime / 60));

                    setSecondTotalTimeStageOne(secondTotalTimeStageOne);
                    setSecondTotalTimeStageOneDisplay(
                        Math.floor(secondTotalTimeStageOne / 60)
                    );

                    setSecondTotalTimeStageTwo(secondTotalTimeStageTwo);
                    setSecondTotalTimeStageTwoDisplay(
                        Math.floor(secondTotalTimeStageTwo / 60)
                    );

                    if (firstTotalTime === 1200) {
                        setTaskCodeActive("99458");
                    } else {
                        setTaskCodeActive("99457");
                    }

                    if (secondTotalTimeStageOne === 1200) {
                        setTaskCodeInternalActive("99458_stage2");
                    } else {
                        setTaskCodeInternalActive("99458_stage1");
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

        console.log("DATE 3 : ", currentDateApi)

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
                    var secondTotalTimeStageOne = 0;
                    var secondTotalTimeStageTwo = 0;
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
                                if (item.code_internal === "99458_stage1") {
                                    tempSecondTwentyTasks.push(item);
                                    secondTotalTimeStageOne =
                                        secondTotalTimeStageOne + Number(item.timeConsidered);
                                    if (!tempSecondTwentyData.hasOwnProperty("date")) {
                                        tempSecondTwentyData = {
                                            date: getDateFromISO(item.date_time),
                                            time: getTimeFromISO(item.date_time),
                                        };
                                    }
                                }
                                if (item.code_internal === "99458_stage2") {
                                    tempSecondTwentyStageTwoTasks.push(item);
                                    secondTotalTimeStageTwo =
                                        secondTotalTimeStageTwo + Number(item.timeConsidered);
                                }
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
                    setSecondTwentyStageTwoTasks(tempSecondTwentyStageTwoTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(Math.floor(firstTotalTime / 60));

                    setSecondTotalTimeStageOne(secondTotalTimeStageOne);
                    setSecondTotalTimeStageOneDisplay(
                        Math.floor(secondTotalTimeStageOne / 60)
                    );

                    setSecondTotalTimeStageTwo(secondTotalTimeStageTwo);
                    setSecondTotalTimeStageTwoDisplay(
                        Math.floor(secondTotalTimeStageTwo / 60)
                    );

                    if (firstTotalTime === 1200) {
                        setTaskCodeActive("99458");
                    } else {
                        setTaskCodeActive("99457");
                    }

                    if (secondTotalTimeStageOne === 1200) {
                        setTaskCodeInternalActive("99458_stage2");
                    } else {
                        setTaskCodeInternalActive("99458_stage1");
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
        return totalHours % TOTAL_HOURS_FOR_EACH_SENSOR_BILLED;
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
            result = result + getTotalNumberDay(item);
        })
        return result;
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

                res.data.response.billingData.map(
                    (item) => {
                        if (item.code == CPT_CODE.CPT_99457) {
                            tempFirstTwentyTasks = JSON.parse(item.params);
                            if(!isArray(tempFirstTwentyTasks)) tempFirstTwentyTasks = [];
                        }
                    }
                );
                setFirstTwentyTasks(tempFirstTwentyTasks);
            })
    }

    function callUpdateBillingTasks(cptCode, item = {}) {
        var date = new Date();
        var date_string = date.toISOString();

        if (cptCode == CPT_CODE.CPT_99457) {
            let isCodeExist = false;
            let billingId = null;

            billingInformation.map(item => {
                if (item.code == CPT_CODE.CPT_99457) {
                    isCodeExist = true;
                    billingId = item.id
                }
            })

            if (isCodeExist) {
                // update
                let updateData = {};
                if (item.task_id) {
                    updateData = {
                        code: CPT_CODE.CPT_99457,
                        bill_date: date_string,
                        pid: location.state.pid,
                        billing_id: billingId,
                        task_date: item.task_date,
                        task_id: item.task_id,
                        staff_name: item.staff_name,
                        task_note: item.task_note,
                        task_time_spent: item.task_time_spent
                    }
                } else {
                    updateData = {
                        code: CPT_CODE.CPT_99457,
                        bill_date: date_string,
                        pid: location.state.pid,
                        billing_id: billingId,
                        task_date: taskDateVal,
                        staff_name: taskNameVal,
                        task_note: taskNoteVal
                    }
                }
                
                billingApi
                    .updateBillingTask(
                        updateData
                    )
                    .then((res) => {
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
                            code: CPT_CODE.CPT_99457,
                            bill_date: date_string,
                            pid: location.state.pid,
                            revenue_code: 123,
                            notecodes: "pending",
                            bill_process: 0,
                            fee: 40,
                            add_task_id: date.getTime(),
                            add_task_date: taskDateVal,
                            add_task_staff_name: taskNameVal,
                            add_task_note: taskNoteVal
                        }
                    )
                    .then((res) => {
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

        console.log("FINAL JSON : ", temp)

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

            console.log("DATE 4 : ", dateMonthString)
            console.log("CURRENT DATE API : ", currentDateApi)

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
                    var secondTotalTimeStageOne = 0;
                    var secondTotalTimeStageTwo = 0;
                    res.data.response.billingData.map(
                        (item) => {
                            tempDataSource.push({
                                date: `${getDateFromISO(item.bill_date)} ${getTimeFromISO(
                                    item.bill_date
                                )}`,
                                code: item.code,
                                desc: '',
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
                            if (item.code == CPT_CODE.CPT_99454) {
                                enrollPatch = true;
                                tempPatchdata = {
                                    date: getDateFromISO(item.date_time),
                                    time: getTimeFromISO(item.date_time),
                                };
                            }
                            if (item.code == CPT_CODE.CPT_99457) {
                                tempFirstTwentyTasks = JSON.parse(item.params);
                                if(!isArray(tempFirstTwentyTasks)) tempFirstTwentyTasks = [];
                                setFirstTwentyTasks(tempFirstTwentyTasks);
                                if(tempFirstTwentyTasks.length > 0){
                                    tempFirstTwentyTasks.map(item => {
                                        if(item.task_time_spend) {
                                            firstTotalTime += item.task_time_spend;
                                        }
                                    })
                                    firstTotalTime = firstTotalTime*60;
                                }
                            }
                            if (item.code == CPT_CODE.CPT_99458) {
                                if (item.code_internal === "99458_stage1") {
                                    tempSecondTwentyTasks.push(item);
                                    secondTotalTimeStageOne =
                                        secondTotalTimeStageOne + Number(item.timeConsidered);
                                    if (!tempSecondTwentyData.hasOwnProperty("date")) {
                                        tempSecondTwentyData = {
                                            date: getDateFromISO(item.date_time),
                                            time: getTimeFromISO(item.date_time),
                                        };
                                    }
                                }
                                if (item.code_internal === "99458_stage2") {
                                    tempSecondTwentyStageTwoTasks.push(item);
                                    secondTotalTimeStageTwo =
                                        secondTotalTimeStageTwo + Number(item.timeConsidered);
                                }
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
                        setInitialSetupState(true);
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
                    setSecondTwentyStageTwoTasks(tempSecondTwentyStageTwoTasks);

                    setFirstTotalTime(firstTotalTime);
                    setFirstTotalTimeDisplay(Math.floor(firstTotalTime / 60));

                    setSecondTotalTimeStageOne(secondTotalTimeStageOne);
                    setSecondTotalTimeStageOneDisplay(
                        Math.floor(secondTotalTimeStageOne / 60)
                    );

                    setSecondTotalTimeStageTwo(secondTotalTimeStageTwo);
                    setSecondTotalTimeStageTwoDisplay(
                        Math.floor(secondTotalTimeStageTwo / 60)
                    );

                    if (firstTotalTime >= 1200) {
                        setTaskCodeActive(CPT_CODE.CPT_99458);
                    } else {
                        setTaskCodeActive(CPT_CODE.CPT_99457);
                    }

                    if (secondTotalTimeStageOne === 1200) {
                        setTaskCodeInternalActive("99458_stage2");
                    } else {
                        setTaskCodeInternalActive("99458_stage1");
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
                                <div className="bm-header-number-active">99453</div>
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
                                            ? getUnitBilledSensor()
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={initialStepDoneState ? { color: "black" } : null}
                                >
                                    99454
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        initialStepDoneState
                                            ? getUnitBilledSensor()
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
                                            ? firstTotalTime === 1200
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={initialStepDoneState ? { color: "black" } : null}
                                >
                                    99457
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        initialStepDoneState
                                            ? firstTotalTime === 1200
                                                ? { background: "#81ff00" }
                                                : { background: "#ffcd00" }
                                            : null
                                    }
                                ></div>
                                <div className="bm-header-below">{`${firstTotalTimeDisplay} mins monitored`}</div>
                            </div>
                        </div>
                        <div className="bm-cptcode-container">
                            {enrolledState && firstTotalTime === 1200 ? (
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
                                        firstTotalTime === 1200
                                            ? secondTotalTimeStageOne < 1200
                                                ? { background: "#ffcd00" }
                                                : { background: "#81ff00" }
                                            : null
                                    }
                                ></div>
                                <div
                                    className="bm-header-number"
                                    style={firstTotalTime === 1200 ? { color: "black" } : null}
                                >
                                    99458
                                </div>
                            </div>
                            <div className="bm-cptcode-b-header">
                                <div
                                    className="bm-header-line"
                                    style={
                                        firstTotalTime === 1200
                                            ? secondTotalTimeStageOne < 1200
                                                ? { background: "#ffcd00" }
                                                : { background: "#81ff00" }
                                            : null
                                    }
                                ></div>
                                {stageOneState ? (
                                    <div className="bm-header-below">{`Stage 1: ${secondTotalTimeStageOneDisplay} mins monitored`}</div>
                                ) : null}
                                {stageTwoState ? (
                                    <div className="bm-header-below">{`Stage 2: ${secondTotalTimeStageTwoDisplay} mins monitored`}</div>
                                ) : null}
                            </div>
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
                                    0 mins monitored
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
                            <div
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
                                        padding: "1% 5%",
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
                            </div>
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
                            <div
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
                                        padding: "1% 5%",
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
                            </div>
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
                                    padding: "1% 5%",
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
                                    padding: "1% 5%",
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
                            {placeDatePicker("15%")}
                            {/* <div className="bm-month-sensor-container">
                                {placeDatePicker("60%")}
                                <CusBtn
                                    onClick={() => {
                                        // setPatchLoading(true);
                                        setAssociatedSensorsState(false);
                                        enrollForPatch();
                                    }}
                                    className="primary"
                                    disabled={
                                        patchEnrolled || patchArray.length === 0 ? true : false
                                    }
                                >
                                    Enroll
                                </CusBtn>
                            </div> */}
                        </div>
                        <div className="bm-sensor-mid">
                            <div
                                style={{
                                    width: "28%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div className="bm-sensor-monitored-bar">
                                    <div className="bm-sensor-monitored-bar-two"></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "1.2rem" }}>Days Monitored: {getHoursProcessSensor()}/{TOTAL_HOURS_FOR_EACH_SENSOR_BILLED}</div>
                                    {getUnitBilledSensor() > 0 && (
                                        <div style={{ color: "#00000085" }}>
                                            {`${getUnitBilledSensor()} billed unit.`}
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
                            <div style={{ overflowY: "scroll", height: "70%" }}>
                                {patchArray.length === 0 ? (
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
                                    <Collapse expandIconPosition="right">
                                        {patchArray.map((item, index) => (
                                            <Panel
                                                header={
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            height: "40px",
                                                            fontSize: "1rem"
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
                                                            {getFirstDateMonitored(item)}
                                                        </div>
                                                        <div className="bm-item-body" style={{ width: "15%" }}>
                                                            {getLastDateMonitored(item)}
                                                        </div>
                                                        <div className="bm-item-body" style={{ width: "13%" }}>
                                                            {getTotalNumberDay(item)}
                                                        </div>
                                                    </div>
                                                }
                                                key={index}
                                                style={{ background: "#ffb300c2", margin: "0.5% 0%" }}
                                            >

                                            </Panel>
                                        ))}
                                    </Collapse>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

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
                            <div
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
                                        padding: "1% 5%",
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
                            </div>
                            <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-sensor-mid"
                            >
                                {firstTotalTime >= 1200 ? (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99457 enabled at  ${firstTwentyData.date}`}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99457 has not been enabled yet`}
                                    </div>
                                )}
                                <div
                                    style={{
                                        width: "28%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div className="bm-sensor-monitored-bar">
                                        <div
                                            className="bm-sensor-monitored-bar-two"
                                            style={{
                                                width: `${(firstTotalTimeDisplay / 20) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "1.2rem" }}>
                                            {`Mins Monitored: ${firstTotalTimeDisplay}/20`}
                                        </div>
                                        <div style={{ color: "#00000085" }}>
                                            <b>{`${20 - firstTotalTimeDisplay} mins`}</b> left to
                                            enable the next CPT code.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-twenty-bottom-container"
                            >
                                <div className="bm-twenty-header">
                                    Tasks 
                                    {/* <CusBtn onClick={() => { setRightSideLoading(true); handleDeleteTasks() }} className="primary" style={{ position: 'absolute', right: '5%', width: '12%', padding: '1%' }} disabled={taskDeleteArray.length === 0 ? true : false} >Delete</CusBtn>  */}
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
                                                setAddTaskState(true);
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
                                            <Collapse expandIconPosition="right">
                                                {firstTwentyTasks.map((item, index) => (
                                                    <Panel
                                                        header={
                                                            <div
                                                                style={{
                                                                    width: "100%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    height: "40px",
                                                                    fontSize: "1rem"
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
                                                                    {item['task_time_spend'] ? `${item['task_time_spend']} min` : renderTimerClock(item)}
                                                                </div>
                                                            </div>
                                                        }
                                                        key={index}
                                                        style={{ background: "#ffb300c2", margin: "0.5% 0%" }}
                                                    >

                                                    </Panel>
                                                ))}
                                            </Collapse>

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
                                                setAddTaskState(true);
                                            }}
                                            style={{ padding: "1% 5%" }}
                                            disabled={firstTotalTime >= 1200 ? true : false}
                                        >
                                            Add
                                        </CusBtn>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )
                ) : null}
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
                            <div
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
                                        padding: "1% 5%",
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
                            </div>
                            <div
                                style={addTaskState ? { filter: "blur(4px)" } : null}
                                className="bm-sensor-mid"
                            >
                                {secondTwentyData.date ? (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99458 enabled at ${secondTwentyData.date}`}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {`CPT code: 99458 has not been enabled yet`}
                                    </div>
                                )}
                                {stageOneState ? (
                                    <div
                                        style={{
                                            width: "28%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div className="bm-sensor-monitored-bar">
                                            <div
                                                className="bm-sensor-monitored-bar-two"
                                                style={{
                                                    width: `${(secondTotalTimeStageOneDisplay / 20) * 100
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "1.2rem" }}>
                                                {`Mins Monitored: ${secondTotalTimeStageOneDisplay}/20`}
                                            </div>
                                            <div style={{ color: "#00000085" }}>
                                                <b>{`${20 - secondTotalTimeStageOneDisplay} mins`}</b>{" "}
                                                left to enable Stage 2.
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {stageTwoState ? (
                                    <div
                                        style={{
                                            width: "28%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div className="bm-sensor-monitored-bar">
                                            <div
                                                className="bm-sensor-monitored-bar-two"
                                                style={{
                                                    width: `${(secondTotalTimeStageTwoDisplay / 20) * 100
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "1.2rem" }}>
                                                {`Mins Monitored: ${secondTotalTimeStageTwoDisplay}/20`}
                                            </div>
                                            <div style={{ color: "#00000085" }}>
                                                <b>{`${20 - secondTotalTimeStageTwoDisplay} mins`}</b>{" "}
                                                left.
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div
                                style={
                                    addTaskState
                                        ? {
                                            filter: "blur(4px)",
                                            display: "flex",
                                            height: "7%",
                                            margin: "0% 5%",
                                        }
                                        : { display: "flex", height: "7%", margin: "0% 5%" }
                                }
                            >
                                <div
                                    onClick={() => {
                                        setStageOneState(true);
                                        setStageTwoState(false);
                                        setTaskDeleteArray([]);
                                    }}
                                    className={
                                        stageOneState
                                            ? "bm-sensor-bottom-header"
                                            : "bm-sensor-bottom-header bm-stage-btn-inactive"
                                    }
                                    style={{ height: "100%" }}
                                >
                                    Stage 1
                                </div>
                                <div
                                    onClick={() => {
                                        if (secondTotalTimeStageOne === 1200) {
                                            setStageTwoState(true);
                                            setStageOneState(false);
                                            setTaskDeleteArray([]);
                                        }
                                    }}
                                    className={
                                        stageTwoState
                                            ? "bm-sensor-bottom-header"
                                            : "bm-sensor-bottom-header bm-stage-btn-inactive"
                                    }
                                    style={
                                        secondTotalTimeStageOne === 1200
                                            ? { height: "100%" }
                                            : {
                                                height: "100%",
                                                background: "#85858545",
                                                color: "#00000070",
                                            }
                                    }
                                >
                                    Stage 2
                                </div>
                            </div>
                            {stageOneState ? (
                                <div
                                    style={
                                        addTaskState
                                            ? { filter: "blur(4px)", height: "52%" }
                                            : { height: "52%" }
                                    }
                                    className="bm-twenty-bottom-container"
                                >
                                    <div className="bm-twenty-header">
                                        Tasks 
                                        {/* <CusBtn onClick={() => { setRightSideLoading(true); handleDeleteTasks() }} className="primary" style={{ position: 'absolute', right: '5%', width: '12%', padding: '1%' }} disabled={taskDeleteArray.length === 0 ? true : false} >Delete</CusBtn>  */}
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
                                                    setAddTaskState(true);
                                                }}
                                                className="primary"
                                            >
                                                Add
                                            </CusBtn>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                height: "73%",
                                                width: "100%",
                                                overflowY: "scroll",
                                            }}
                                        >
                                            {secondTwentyTasks.map((item, index) => (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        width: "100%",
                                                        alignItems: "center",
                                                        height: "25%",
                                                        padding: "0% 5%",
                                                        borderBottom: "1px solid #00000026",
                                                        background: "#ff920012",
                                                    }}
                                                >
                                                    <div style={{ width: "8%" }}>{index + 1}</div>
                                                    <div style={{ width: "15%" }}>
                                                        <div>{getDateFromISO(item.date_time)}</div>
                                                        <div>{getTimeFromISO(item.date_time)}</div>
                                                    </div>
                                                    <div style={{ width: "67%", paddingRight: "3%" }}>
                                                        {item.task}
                                                    </div>
                                                    <div style={{ width: "10%" }}>
                                                        {`${getMinutesFromSeconds(item.timeConsidered)}`}
                                                    </div>
                                                    <div>
                                                        <Checkbox onChange={() => {
                                                            var temp = []
                                                            var flag = true
                                                            temp = taskDeleteArray

                                                            taskDeleteArray.map((ele, index) => {
                                                                if (ele === item) {
                                                                    temp.splice(index, 1)
                                                                    flag = false
                                                                }
                                                            })

                                                            if (flag) {
                                                                temp.push(item)
                                                            }

                                                            setTaskDeleteArray([...temp])
                                                        }}></Checkbox>
                                                    </div>
                                                </div>
                                            ))}
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
                                                disabled={
                                                    secondTotalTimeStageOne === 1200 ? true : false
                                                }
                                            >
                                                Add
                                            </CusBtn>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                            {stageTwoState ? (
                                <div
                                    style={
                                        addTaskState
                                            ? { filter: "blur(4px)", height: "52%" }
                                            : { height: "52%" }
                                    }
                                    className="bm-twenty-bottom-container"
                                >
                                    <div className="bm-twenty-header">
                                        Tasks 
                                        {/* <CusBtn onClick={() => { setRightSideLoading(true); handleDeleteTasks() }} className="primary" style={{ position: 'absolute', right: '5%', width: '12%', padding: '1%' }} disabled={taskDeleteArray.length === 0 ? true : false} >Delete</CusBtn>  */}
                                    </div>
                                    {secondTwentyStageTwoTasks.length === 0 ? (
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
                                                No tasks updated or scheduled yet 2
                                            </div>
                                            <CusBtn
                                                onClick={() => {
                                                    setAddTaskState(true);
                                                }}
                                                className="primary"
                                            >
                                                Add
                                            </CusBtn>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                height: "73%",
                                                width: "100%",
                                                overflowY: "scroll",
                                            }}
                                        >
                                            {secondTwentyStageTwoTasks.map((item, index) => (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        width: "100%",
                                                        alignItems: "center",
                                                        height: "25%",
                                                        padding: "0% 5%",
                                                        borderBottom: "1px solid #00000026",
                                                        background: "#ff920012",
                                                    }}
                                                >
                                                    <div style={{ width: "8%" }}>{index + 1}</div>
                                                    <div style={{ width: "15%" }}>
                                                        <div>{getDateFromISO(item.date_time)}</div>
                                                        <div>{getTimeFromISO(item.date_time)}</div>
                                                    </div>
                                                    <div style={{ width: "67%", paddingRight: "3%" }}>
                                                        {item.task}
                                                    </div>
                                                    <div style={{ width: "10%" }}>
                                                        {`${getMinutesFromSeconds(item.timeConsidered)}`}
                                                    </div>
                                                    <div>
                                                        <Checkbox onChange={() => {
                                                            var temp = []
                                                            var flag = true
                                                            temp = taskDeleteArray

                                                            taskDeleteArray.map((ele, index) => {
                                                                if (ele === item) {
                                                                    temp.splice(index, 1)
                                                                    flag = false
                                                                }
                                                            })

                                                            if (flag) {
                                                                temp.push(item)
                                                            }

                                                            setTaskDeleteArray([...temp])
                                                        }}></Checkbox>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {secondTwentyStageTwoTasks.length !== 0 ? (
                                        <div
                                            style={addTaskState ? { filter: "blur(4px)" } : null}
                                            className="bm-bottom-add-btn"
                                        >
                                            <CusBtn
                                                onClick={() => {
                                                    setAddTaskState(true);
                                                }}
                                                style={{ padding: "1% 5%" }}
                                                disabled={
                                                    secondTotalTimeStageTwo === 1200 ? true : false
                                                }
                                            >
                                                Add
                                            </CusBtn>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    )
                ) : null}
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
                                    padding: "1% 5%",
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
                            {/* <div className='bm-last-month-date' > */}
                            {placeDatePicker()}
                            {/* </div> */}
                        </div>

                        {lastStateDone ? (
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
                                <div style={{ fontSize: "2rem", marginBottom: "3%" }}>
                                    CPT code: 99091 enabled
                                </div>
                                <div
                                    style={{ fontSize: "1rem", marginBottom: "2%" }}
                                >{`Recorded timestamp: ${lastStateData.date} ${lastStateData.time}`}</div>
                            </div>
                        ) : (
                            <div className="bm-notenroll-container" style={{ height: "89%" }}>
                                <div style={{ fontSize: "3rem" }}>
                                    Enroll to generate CPT Code: 99091
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ fontSize: "1rem", color: "#7E7979" }}>
                                        CPT code 99091 has not been enabled for this month
                                    </div>
                                </div>
                                <CusBtn
                                    onClick={() => {
                                        // setLastStateLoading(true);
                                        enrollLastState();
                                    }}
                                    className="primary"
                                    style={{ marginTop: "3%", padding: "1% 5%" }}
                                >
                                    Enroll
                                </CusBtn>
                            </div>
                        )}
                    </div>
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
                            <div
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
                                        padding: "1% 5%",
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
                            </div>
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
                                                {`Patient Email: ${patientData ? patientData.email : ""
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
                                            {`Address: ${patientData ? patientData.street : ""}`}
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
                                <div
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
                                            padding: "1% 5%",
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
                                </div>
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