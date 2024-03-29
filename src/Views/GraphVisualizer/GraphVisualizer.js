import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import './graphVisualizer.css'
import { DatePicker, notification, Spin, Input, Collapse } from 'antd'
import { LeftOutlined, InfoCircleOutlined, FileSearchOutlined, ExceptionOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import GraphAlertIcon from '../../Assets/Icons/graphAlertIcon';
import { useParams } from 'react-router-dom'
import patientApi from '../../Apis/patientApis';
import medicationApi from '../../Apis/medicationApis';
import moment from 'moment';
import Icons from "../../Utils/iconMap";
import VisualStandingIcon from '../../Assets/Icons/visualStanding';
import VisualSittingIcon from '../../Assets/Icons/visualSitting';
import VisualSleepingIcon from '../../Assets/Icons/visualSleeping';
import VisualWalkingIcon from '../../Assets/Icons/visualWalking';

import EditIcon from '../../Assets/Icons/editIcon';
import { Button } from '../../Theme/Components/Button/button'


import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Sector,
    ReferenceLine,
    ReferenceDot
} from "recharts";
import { nullableTypeAnnotation } from '@babel/types';

const { TextArea } = Input;
const { Panel } = Collapse;

function GraphVisualizer() {

    const location = useLocation();

    const [observationData, setObservationData] = useState([
        {
            'header': 'Reason For Visit',
            'content': 'The patient is 50 years old seen in ouy patient consultation for abdominal cramps,abdominal pain and bloating',
        },
        {
            'header': 'HPI',
            'content': 'Patient came two weeks ago with abdominal pain,Associate symptoms include bleeding per rectum. For the condition Barium enum was done on 20/02/2021,Which did not reveal any significant findings.',
        }
    ])

    const [observationAddState, setObservationAddState] = useState(false)

    const [observationAddHeaderVal, setObservationAddHeaderVal] = useState('')
    const [observationAddContentVal, setObservationAddContentVal] = useState('')
    const [observationEditHeaderVal, setObservationEditHeaderVal] = useState('')
    const [observationEditContentVal, setObservationEditContentVal] = useState('')

    const [observationEditIndex, setObservationEditIndex] = useState(-1)
    const [isEditState, setIsEditState] = useState(false)

    const observationAddScrollRef = useRef()

    const [observationState, setObservationState] = useState(false)
    const [patientInfoState, setPatientInfoState] = useState(false)

    const history = useHistory();

    const spo2AlertRef = useRef()
    const bpAlertRef = useRef()
    const rrAlertRef = useRef()
    const tempAlertRef = useRef()
    const ewsAlertRef = useRef()
    var alertFlag = true
    var bpAlertFlag = true
    var rrAlertFlag = true
    var tempAlertFlag = true
    var ewsAlertFlag = true

    var Spo2MaxVal = 0
    var Spo2MinVal = 0
    var BpMaxVal = 0
    var BpMinVal = 0
    var RrMaxVal = 0
    var RrMinVal = 0
    var TempMaxVal = 0
    var TempMinVal = 0
    var EwsMaxVal = 0
    var EwsMinVal = 0

    const [spo2maxval, setSpo2maxval] = useState(0)
    const [spo2minval, setSpo2minval] = useState(0)
    const [bpmaxval, setBpmaxval] = useState(0)
    const [bpminval, setBpminval] = useState(0)
    const [rrmaxval, setRrmaxval] = useState(0)
    const [rrminval, setRrminval] = useState(0)
    const [tempmaxval, setTempmaxval] = useState(0)
    const [tempminval, setTempminval] = useState(0)
    const [ewsmaxval, setEwsmaxval] = useState(0)
    const [ewsminval, setEwsminval] = useState(0)

    const [alertName, setAlertName] = useState('')

    const { pid } = useParams();
    // console.log("PID : ", pid);
    const dateFormat = 'YYYY/MM/DD';
    const [antd_selected_date_val, setAntd_selected_date_val] = useState()

    const [activeTrendsArray, setActiveTrendsArray] = useState([])
    const [graphLoading, setGraphLoading] = useState(false)

    const [spo2_data, setSpo2_data] = useState([])
    const [bp_data, setBp_data] = useState([])
    const [rr_data, setRr_data] = useState([])
    const [temp_data, setTemp_data] = useState([])
    const [ews_data, setEws_data] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    const [alertState, setAlertState] = useState(true)
    const [medState, setMedState] = useState(false)
    const [pieState, setPieState] = useState(false)
    const [labState, setLabState] = useState(false)
    const [procedureState, setProcedureState] = useState(false)
    const [intakeState, setIntakeState] = useState(false)
    const [outputState, setOutputState] = useState(false)

    const [currentMedData, setCurrentMedData] = useState([{ "No Meds Selected": 0 }])
    const [currentAlert, setCurrentAlert] = useState("")

    const [hoverActiveTooltipIndex, setHoverActiveTooltipIndex] = useState(0)

    function to12HourFormat(dates) {
        var date = new Date(dates);
        // console.log(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();

        // Check whether AM or PM
        var newformat = hours >= 12 ? "p.m" : "a.m";

        // Find current hour in AM-PM Format
        hours = hours % 12;

        // To display "0" as "12"
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        var mins
        if (minutes <= 7) {
            mins = '00'
        }
        else if (minutes > 52) {
            hours = hours + 1
            mins = '00'
        }
        else if (minutes <= 22 && minutes > 7) {
            mins = '15'
        }
        else if (minutes <= 37 && minutes > 22) {
            mins = '30'
        }
        else if (minutes <= 52 && minutes > 37) {
            mins = '45'
        }

        return hours + ":" + mins + " " + newformat;
    }
    function getDateVal(dates) {
        var date = new Date(dates);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var month = date.getMonth() + 1;
        var year = date.getFullYear()
        var date_num = date.getDate()

        return year + " " + month + " " + date_num + " " + hours
    }


    const [medMorningLoading, setMedMorningLoading] = useState(true)
    const [medNoonLoading, setMedNoonLoading] = useState(true)
    const [medEveningLoading, setMedEveningLoading] = useState(true)

    const [medMorningData, setMedMorningData] = useState([])
    const [medNoonData, setMedNoonData] = useState([])
    const [medEveningData, setMedEveningData] = useState([])

    const [completeMedData, setCompleteMedData] = useState([])

    const [alertsLoading, setAlertsLoading] = useState(true)
    const [alertsApiData, setAlertsApiData] = useState()

    const [trendsLoading, setTrendsLoading] = useState(true)
    const [trendsApiData, setTrendsApiData] = useState()


    useEffect(() => {

        if (!medMorningLoading && !medNoonLoading && !medEveningLoading) {
            var local_data = []
            local_data.push(...medMorningData)
            local_data.push(...medNoonData)
            local_data.push(...medEveningData)
            setCompleteMedData(local_data)
        }

        if (!medMorningLoading && !medNoonLoading && !medEveningLoading && !alertsLoading && !trendsLoading) {
            var temp_spo2 = []
            var temp_bp = []
            var temp_rr = []
            var temp_temp = []
            var temp_ews = []

            Spo2MaxVal = trendsApiData.data.response.trend_map.trend_map[0].spo2[0].value
            Spo2MinVal = trendsApiData.data.response.trend_map.trend_map[0].spo2[0].value

            BpMaxVal = trendsApiData.data.response.trend_map.trend_map[3].hr[0].value
            BpMinVal = trendsApiData.data.response.trend_map.trend_map[3].hr[0].value

            RrMaxVal = trendsApiData.data.response.trend_map.trend_map[2].rr[0].value
            RrMinVal = trendsApiData.data.response.trend_map.trend_map[2].rr[0].value

            TempMaxVal = trendsApiData.data.response.trend_map.trend_map[1].temp[0].value
            TempMinVal = trendsApiData.data.response.trend_map.trend_map[1].temp[0].value

            EwsMaxVal = trendsApiData.data.response.trend_map.trend_map[4].ews[0].value
            EwsMinVal = trendsApiData.data.response.trend_map.trend_map[4].ews[0].value

            //SPO2

            trendsApiData.data.response.trend_map.trend_map[0].spo2.reverse().map(item => {
                if (parseInt(item.value) < Spo2MinVal) {
                    Spo2MinVal = parseInt(item.value)
                    console.log("Item Value: ", Spo2MinVal)
                }
                if (parseInt(item.value) > Spo2MaxVal) {
                    Spo2MaxVal = parseInt(item.value)
                }
                const indate = to12HourFormat(item.date);
                // const date_val = getDateVal(item.date)
                var meds_added = []
                completeMedData.map(item => {
                    var temp_med_adm_date
                    if (item.hasOwnProperty('today_administered_morning')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_morning,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_noon')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_afternoon,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_evening')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_evening,
                                },
                            )
                        }
                    }
                })

                if (meds_added.length === 0) {
                    temp_spo2.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            // "med": true,
                        }
                    )
                }
                else {
                    temp_spo2.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            "med": true,
                            "medData": meds_added,
                        }
                    )
                }

            })

            //BP

            trendsApiData.data.response.trend_map.trend_map[3].hr.reverse().map(item => {
                if (parseInt(item.value) < BpMinVal) {
                    BpMinVal = parseInt(item.value)
                }
                if (parseInt(item.value) > BpMaxVal) {
                    BpMaxVal = parseInt(item.value)
                }
                const indate = to12HourFormat(item.date);
                // const date_val = getDateVal(item.date)
                var meds_added = []
                completeMedData.map(item => {
                    var temp_med_adm_date
                    if (item.hasOwnProperty('today_administered_morning')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_morning,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_noon')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_afternoon,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_evening')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_evening,
                                },
                            )
                        }
                    }
                })

                if (meds_added.length === 0) {
                    temp_bp.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            // "med": true,
                        }
                    )
                }
                else {
                    temp_bp.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            "med": true,
                            "medData": meds_added,
                        }
                    )
                }
            })

            //RR

            trendsApiData.data.response.trend_map.trend_map[2].rr.reverse().map(item => {
                if (parseInt(item.value) < RrMinVal) {
                    RrMinVal = parseInt(item.value)
                }
                if (parseInt(item.value) > RrMaxVal) {
                    RrMaxVal = parseInt(item.value)
                }
                const indate = to12HourFormat(item.date);
                // const date_val = getDateVal(item.date)
                var meds_added = []
                completeMedData.map(item => {
                    var temp_med_adm_date
                    if (item.hasOwnProperty('today_administered_morning')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_morning,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_noon')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_afternoon,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_evening')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_evening,
                                },
                            )
                        }
                    }
                })

                if (meds_added.length === 0) {
                    temp_rr.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            // "med": true,
                        }
                    )
                }
                else {
                    temp_rr.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            "med": true,
                            "medData": meds_added,
                        }
                    )
                }
            })

            //TEMP

            trendsApiData.data.response.trend_map.trend_map[1].temp.reverse().map(item => {
                if (parseInt(item.value) < TempMinVal) {

                    TempMinVal = parseInt(item.value)
                }
                if (parseInt(item.value) > TempMaxVal) {
                    TempMaxVal = parseInt(item.value)
                }
                const indate = to12HourFormat(item.date);
                // const date_val = getDateVal(item.date)
                var meds_added = []
                completeMedData.map(item => {
                    var temp_med_adm_date
                    if (item.hasOwnProperty('today_administered_morning')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_morning,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_noon')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_afternoon,
                                },
                            )
                        }
                    }
                    else if (item.hasOwnProperty('today_administered_evening')) {
                        temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                        if (temp_med_adm_date === indate) {
                            meds_added.push(
                                {
                                    [item.drugName]: item.dosage_evening,
                                },
                            )
                        }
                    }
                })

                if (meds_added.length === 0) {
                    temp_temp.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            // "med": true,
                        }
                    )
                }
                else {
                    temp_temp.push(
                        {
                            "date": indate,
                            "value": parseInt(item.value),
                            "med": true,
                            "medData": meds_added,
                        }
                    )
                }
            })

            //EWS

            // res.data.response.trend_map.trend_map[4].ews.reverse().map(item => {
            //     if (parseInt(item.value) < EwsMinVal) {
            //         EwsMinVal = parseInt(item.value)
            //     }
            //     if (parseInt(item.value) > EwsMaxVal) {
            //         EwsMaxVal = parseInt(item.value)
            //     }
            //     const indate = to12HourFormat(item.date);
            //     // const date_val = getDateVal(item.date)
            //     var meds_added = []
            //     temp_med_data.map(item => {
            //         var temp_med_adm_date
            //         if (item.hasOwnProperty('today_administered_morning')) {
            //             temp_med_adm_date = to12HourFormat(item.today_administered_morning)

            //             if (temp_med_adm_date === indate) {
            //                 meds_added.push(
            //                     {
            //                         [item.drugName]: item.dosage_morning,
            //                     },
            //                 )
            //             }
            //         }
            //         else if (item.hasOwnProperty('today_administered_noon')) {
            //             temp_med_adm_date = to12HourFormat(item.today_administered_noon)

            //             if (temp_med_adm_date === indate) {
            //                 meds_added.push(
            //                     {
            //                         [item.drugName]: item.dosage_afternoon,
            //                     },
            //                 )
            //             }
            //         }
            //         else if (item.hasOwnProperty('today_administered_evening')) {
            //             temp_med_adm_date = to12HourFormat(item.today_administered_evening)

            //             if (temp_med_adm_date === indate) {
            //                 meds_added.push(
            //                     {
            //                         [item.drugName]: item.dosage_evening,
            //                     },
            //                 )
            //             }
            //         }
            //     })

            //     if (meds_added.length === 0) {
            //         temp_ews.push(
            //             {
            //                 "date": indate,
            //                 "value": parseInt(item.value),
            //                 // "med": true,
            //             }
            //         )
            //     }
            //     else {
            //         temp_ews.push(
            //             {
            //                 "date": indate,
            //                 "value": parseInt(item.value),
            //                 "med": true,
            //                 "medData": meds_added,
            //             }
            //         )
            //     }
            // })

            setSpo2maxval(parseInt(Spo2MaxVal) + 5)
            setSpo2minval(parseInt(Spo2MinVal) - 5)
            setBpmaxval(parseInt(BpMaxVal) + 5)
            setBpminval(parseInt(BpMinVal) - 5)
            setRrmaxval(parseInt(RrMaxVal) + 5)
            setRrminval(parseInt(RrMinVal) - 5)
            setTempmaxval(parseInt(TempMaxVal) + 5)
            setTempminval(parseInt(TempMinVal) - 5)
            // setEwsmaxval(parseInt(EwsMaxVal) + 5)
            // setEwsminval(parseInt(EwsMinVal) - 5)

            console.log("MAX MIN :", Spo2MaxVal)
            console.log("MAX MIN :", Spo2MinVal)

            alertsApiData.map(alert => {
                for (var i = 0; i < temp_spo2.length; i++) {
                    var alert_time = to12HourFormat(alert.firstRcvTm)
                    var trend_time = temp_spo2[i].date

                    if (alert_time === trend_time) {
                        if (alert.value.includes("HR")) {
                            if (temp_bp[i].hasOwnProperty('alertData')) {
                                temp_bp[i].alertData.push(
                                    {
                                        name: 'HR',
                                        time: alert_time,
                                        info: alert.type
                                    }
                                )
                            }
                            else {
                                temp_bp[i] = {
                                    ...temp_bp[i],
                                    "alert": true,
                                    "alertData": [{
                                        name: 'HR',
                                        time: alert_time,
                                        info: alert.type
                                    }]
                                }
                            }
                        }
                        if (alert.value.includes("SPO2")) {
                            if (temp_spo2[i].hasOwnProperty('alertData')) {
                                temp_spo2[i].alertData.push(
                                    {
                                        name: 'SpO2',
                                        time: alert_time,
                                        info: alert.type
                                    }
                                )
                            }
                            else {
                                temp_spo2[i] = {
                                    ...temp_spo2[i],
                                    "alert": true,
                                    "alertData": [{
                                        name: 'SpO2',
                                        time: alert_time,
                                        info: alert.type
                                    }]
                                }
                            }
                        }
                        if (alert.value.includes("RR")) {
                            if (temp_rr[i].hasOwnProperty('alertData')) {
                                temp_rr[i].alertData.push(
                                    {
                                        name: 'RR',
                                        time: alert_time,
                                        info: alert.type
                                    }
                                )
                            }
                            else {
                                temp_rr[i] = {
                                    ...temp_rr[i],
                                    "alert": true,
                                    "alertData": [{
                                        name: 'RR',
                                        time: alert_time,
                                        info: alert.type
                                    }]
                                }
                            }
                        }
                        if (alert.value.includes("TEMP")) {
                            if (temp_temp[i].hasOwnProperty('alertData')) {
                                temp_temp[i].alertData.push(
                                    {
                                        name: 'TEMP',
                                        time: alert_time,
                                        info: alert.type
                                    }
                                )
                            }
                            else {
                                temp_temp[i] = {
                                    ...temp_temp[i],
                                    "alert": true,
                                    "alertData": [{
                                        name: 'TEMP',
                                        time: alert_time,
                                        info: alert.type
                                    }]
                                }
                            }
                        }
                        // if (alert.value.includes("EWS")) {
                        //     if (temp_ews[i].hasOwnProperty('alertData')) {
                        //         temp_ews[i].alertData.push(
                        //             {
                        //                 name: 'EWS',
                        //                 time: alert_time,
                        //                 info: alert.type
                        //             }
                        //         )
                        //     }
                        //     else {
                        //         temp_ews[i] = {
                        //             ...temp_ews[i],
                        //             "alert": true,
                        //             "alertData": [{
                        //                 name: 'EWS',
                        //                 time: alert_time,
                        //                 info: alert.type
                        //             }]
                        //         }
                        //     }
                        // }
                    }
                }
            })

            setSpo2_data(temp_spo2)
            setBp_data(temp_bp)
            setRr_data(temp_rr)
            setTemp_data(temp_temp)
            // setEws_data(temp_ews)
            console.log(temp_spo2)

            if (activeTrendsArray.length === 0) {
                setActiveTrendsArray([
                    {
                        name: 'SpO2',
                        data: temp_spo2,
                        color1: '#FF7529',
                        color2: '#FFD0B6',
                        max: parseInt(Spo2MaxVal) + 5,
                        min: parseInt(Spo2MinVal) - 5,
                    },
                    {
                        name: 'HR',
                        data: temp_bp,
                        color1: '#2ACA44',
                        color2: '#FFEEBA',
                        max: parseInt(BpMaxVal) + 5,
                        min: parseInt(BpMinVal) - 5,
                    },
                    {
                        name: 'RR',
                        data: temp_rr,
                        color1: '#9e00c2',
                        color2: '#C4AAFD',
                        max: parseInt(RrMaxVal) + 5,
                        min: parseInt(RrMinVal) - 5,
                    },
                    {
                        name: 'TEMP',
                        data: temp_temp,
                        color1: '#0C70A3',
                        color2: '#FFEEBA',
                        max: parseInt(TempMaxVal) + 5,
                        min: parseInt(TempMinVal) - 5,
                    },
                ])
            }

            setIsLoading(false)
        }

    }, [medMorningLoading, medNoonLoading, medEveningLoading, alertsLoading, trendsLoading])


    function getDataEfficiently(current_date_string) {
        callMedMorning(current_date_string)
        callMedNoon(current_date_string)
        callMedEvening(current_date_string)

        var date = new Date()
        var from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T00:00:00.000Z`
        var to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T23:59:59.000Z`

        callAlerts(pid, from, to)
        callTrends(pid, current_date_string)
    }

    function callTrends(pid, current_date_string) {
        console.log("Trends Called")
        var apiStart = new Date()
        patientApi.getTrends(pid, current_date_string, 10, 0, current_date_string)
            .then(res => {
                setTrendsApiData(res)
                setTrendsLoading(false)
                var apiEnd = new Date()
                console.log("Trends Time: ", (apiEnd.getTime() - apiStart.getTime()) / 1000)
            })
            .catch(err => { console.log(err) })
    }

    function callAlerts(pid, from, to) {
        console.log("Alerts Called")
        var apiStart = new Date()
        patientApi.getOpenAlerts(pid, from, to)
            .then(res => {
                // var alerts_data = res.data.response.alerts[0].alerts
                setAlertsApiData(res.data.response.alerts[0].alerts)
                setAlertsLoading(false)
                var apiEnd = new Date()
                console.log("Alerts Time: ", (apiEnd.getTime() - apiStart.getTime()) / 1000)
            })
            .catch(err => { console.log(err) })
    }

    function callMedMorning(str) {
        console.log("Morning Called")
        var apiStart = new Date()
        var local_data = []
        medicationApi.getMedications("morning", str, str)
            .then(res => {
                res.data?.response.schedule[pid]?.drugs.map(item => {
                    local_data.push(item)
                })
                setMedMorningData(local_data)
                setMedMorningLoading(false)
                var apiEnd = new Date()
                console.log("Morning Time: ", (apiEnd.getTime() - apiStart.getTime()) / 1000)
            })
            .catch(err => { console.log(err) })
    }
    function callMedNoon(str) {
        console.log("Noon Called")
        var apiStart = new Date()
        var local_data = []
        medicationApi.getMedications("noon", str, str)
            .then(res => {
                res.data?.response.schedule[pid]?.drugs.map(item => {
                    local_data.push(item)
                })
                setMedNoonData(local_data)
                setMedNoonLoading(false)
                var apiEnd = new Date()
                console.log("Noon Time: ", (apiEnd.getTime() - apiStart.getTime()) / 1000)
            })
            .catch(err => { console.log(err) })
    }
    function callMedEvening(str) {
        console.log("Evening Called")
        var apiStart = new Date()
        var local_data = []
        medicationApi.getMedications("evening", str, str)
            .then(res => {
                res.data?.response.schedule[pid]?.drugs.map(item => {
                    local_data.push(item)
                })
                setMedEveningData(local_data)
                setMedEveningLoading(false)
                var apiEnd = new Date()
                console.log("Evening Time: ", (apiEnd.getTime() - apiStart.getTime()) / 1000)
            })
            .catch(err => { console.log(err) })
    }


    function getReqData(current_date_string) {

        var temp_med_data = []


        medicationApi.getMedications("morning", current_date_string, current_date_string)
            .then(res => {
                res.data?.response.schedule[pid]?.drugs.map(item => {
                    temp_med_data.push(item)
                })
                medicationApi.getMedications("noon", current_date_string, current_date_string)
                    .then(res => {
                        res.data?.response.schedule[pid]?.drugs.map(item => {
                            temp_med_data.push(item)
                        })
                        medicationApi.getMedications("evening", current_date_string, current_date_string)
                            .then(res => {
                                res.data?.response.schedule[pid]?.drugs.map(item => {
                                    temp_med_data.push(item)
                                })
                                console.log("MEDICINE DATA : ", temp_med_data)

                                var date = new Date()
                                var from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T00:00:00.000Z`
                                var to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T23:59:59.000Z`
                                // var from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T18:30:00.000Z`
                                // var to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T18:29:59.000Z`

                                patientApi.getOpenAlerts(pid, from, to)
                                    .then(res => {
                                        console.log("ALERTS --- ", res.data.response.alerts[0].alerts)
                                        var alerts_data = res.data.response.alerts[0].alerts


                                        patientApi.getTrends(pid, current_date_string, 10, 0, current_date_string)
                                            .then(res => {
                                                console.log("TRENDS - RESPONSE : ", res)
                                                console.log(res.data?.response)
                                                var temp_spo2 = []
                                                var temp_bp = []
                                                var temp_rr = []
                                                var temp_temp = []
                                                var temp_ews = []

                                                Spo2MaxVal = res.data.response.trend_map.trend_map[0].spo2[0].value
                                                Spo2MinVal = res.data.response.trend_map.trend_map[0].spo2[0].value

                                                BpMaxVal = res.data.response.trend_map.trend_map[3].hr[0].value
                                                BpMinVal = res.data.response.trend_map.trend_map[3].hr[0].value

                                                RrMaxVal = res.data.response.trend_map.trend_map[2].rr[0].value
                                                RrMinVal = res.data.response.trend_map.trend_map[2].rr[0].value

                                                TempMaxVal = res.data.response.trend_map.trend_map[1].temp[0].value
                                                TempMinVal = res.data.response.trend_map.trend_map[1].temp[0].value

                                                EwsMaxVal = res.data.response.trend_map.trend_map[4].ews[0].value
                                                EwsMinVal = res.data.response.trend_map.trend_map[4].ews[0].value

                                                //SPO2

                                                res.data.response.trend_map.trend_map[0].spo2.reverse().map(item => {
                                                    if (parseInt(item.value) < Spo2MinVal) {
                                                        Spo2MinVal = parseInt(item.value)
                                                        console.log("Item Value: ", Spo2MinVal)
                                                    }
                                                    if (parseInt(item.value) > Spo2MaxVal) {
                                                        Spo2MaxVal = parseInt(item.value)
                                                    }
                                                    const indate = to12HourFormat(item.date);
                                                    // const date_val = getDateVal(item.date)
                                                    var meds_added = []
                                                    temp_med_data.map(item => {
                                                        var temp_med_adm_date
                                                        if (item.hasOwnProperty('today_administered_morning')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_morning,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_noon')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_afternoon,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_evening')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_evening,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                    })

                                                    if (meds_added.length === 0) {
                                                        temp_spo2.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                // "med": true,
                                                            }
                                                        )
                                                    }
                                                    else {
                                                        temp_spo2.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                "med": true,
                                                                "medData": meds_added,
                                                            }
                                                        )
                                                    }

                                                })

                                                //BP

                                                res.data.response.trend_map.trend_map[3].hr.reverse().map(item => {
                                                    if (parseInt(item.value) < BpMinVal) {
                                                        BpMinVal = parseInt(item.value)
                                                    }
                                                    if (parseInt(item.value) > BpMaxVal) {
                                                        BpMaxVal = parseInt(item.value)
                                                    }
                                                    const indate = to12HourFormat(item.date);
                                                    // const date_val = getDateVal(item.date)
                                                    var meds_added = []
                                                    temp_med_data.map(item => {
                                                        var temp_med_adm_date
                                                        if (item.hasOwnProperty('today_administered_morning')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_morning,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_noon')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_afternoon,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_evening')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_evening,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                    })

                                                    if (meds_added.length === 0) {
                                                        temp_bp.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                // "med": true,
                                                            }
                                                        )
                                                    }
                                                    else {
                                                        temp_bp.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                "med": true,
                                                                "medData": meds_added,
                                                            }
                                                        )
                                                    }
                                                })

                                                //RR

                                                res.data.response.trend_map.trend_map[2].rr.reverse().map(item => {
                                                    if (parseInt(item.value) < RrMinVal) {
                                                        RrMinVal = parseInt(item.value)
                                                    }
                                                    if (parseInt(item.value) > RrMaxVal) {
                                                        RrMaxVal = parseInt(item.value)
                                                    }
                                                    const indate = to12HourFormat(item.date);
                                                    // const date_val = getDateVal(item.date)
                                                    var meds_added = []
                                                    temp_med_data.map(item => {
                                                        var temp_med_adm_date
                                                        if (item.hasOwnProperty('today_administered_morning')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_morning,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_noon')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_afternoon,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_evening')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_evening,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                    })

                                                    if (meds_added.length === 0) {
                                                        temp_rr.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                // "med": true,
                                                            }
                                                        )
                                                    }
                                                    else {
                                                        temp_rr.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                "med": true,
                                                                "medData": meds_added,
                                                            }
                                                        )
                                                    }
                                                })

                                                //TEMP

                                                res.data.response.trend_map.trend_map[1].temp.reverse().map(item => {
                                                    if (parseInt(item.value) < TempMinVal) {

                                                        TempMinVal = parseInt(item.value)
                                                    }
                                                    if (parseInt(item.value) > TempMaxVal) {
                                                        TempMaxVal = parseInt(item.value)
                                                    }
                                                    const indate = to12HourFormat(item.date);
                                                    // const date_val = getDateVal(item.date)
                                                    var meds_added = []
                                                    temp_med_data.map(item => {
                                                        var temp_med_adm_date
                                                        if (item.hasOwnProperty('today_administered_morning')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_morning,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_noon')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_afternoon,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                        else if (item.hasOwnProperty('today_administered_evening')) {
                                                            temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                                                            if (temp_med_adm_date === indate) {
                                                                meds_added.push(
                                                                    {
                                                                        [item.drugName]: item.dosage_evening,
                                                                    },
                                                                )
                                                            }
                                                        }
                                                    })

                                                    if (meds_added.length === 0) {
                                                        temp_temp.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                // "med": true,
                                                            }
                                                        )
                                                    }
                                                    else {
                                                        temp_temp.push(
                                                            {
                                                                "date": indate,
                                                                "value": parseInt(item.value),
                                                                "med": true,
                                                                "medData": meds_added,
                                                            }
                                                        )
                                                    }
                                                })

                                                //EWS

                                                // res.data.response.trend_map.trend_map[4].ews.reverse().map(item => {
                                                //     if (parseInt(item.value) < EwsMinVal) {
                                                //         EwsMinVal = parseInt(item.value)
                                                //     }
                                                //     if (parseInt(item.value) > EwsMaxVal) {
                                                //         EwsMaxVal = parseInt(item.value)
                                                //     }
                                                //     const indate = to12HourFormat(item.date);
                                                //     // const date_val = getDateVal(item.date)
                                                //     var meds_added = []
                                                //     temp_med_data.map(item => {
                                                //         var temp_med_adm_date
                                                //         if (item.hasOwnProperty('today_administered_morning')) {
                                                //             temp_med_adm_date = to12HourFormat(item.today_administered_morning)

                                                //             if (temp_med_adm_date === indate) {
                                                //                 meds_added.push(
                                                //                     {
                                                //                         [item.drugName]: item.dosage_morning,
                                                //                     },
                                                //                 )
                                                //             }
                                                //         }
                                                //         else if (item.hasOwnProperty('today_administered_noon')) {
                                                //             temp_med_adm_date = to12HourFormat(item.today_administered_noon)

                                                //             if (temp_med_adm_date === indate) {
                                                //                 meds_added.push(
                                                //                     {
                                                //                         [item.drugName]: item.dosage_afternoon,
                                                //                     },
                                                //                 )
                                                //             }
                                                //         }
                                                //         else if (item.hasOwnProperty('today_administered_evening')) {
                                                //             temp_med_adm_date = to12HourFormat(item.today_administered_evening)

                                                //             if (temp_med_adm_date === indate) {
                                                //                 meds_added.push(
                                                //                     {
                                                //                         [item.drugName]: item.dosage_evening,
                                                //                     },
                                                //                 )
                                                //             }
                                                //         }
                                                //     })

                                                //     if (meds_added.length === 0) {
                                                //         temp_ews.push(
                                                //             {
                                                //                 "date": indate,
                                                //                 "value": parseInt(item.value),
                                                //                 // "med": true,
                                                //             }
                                                //         )
                                                //     }
                                                //     else {
                                                //         temp_ews.push(
                                                //             {
                                                //                 "date": indate,
                                                //                 "value": parseInt(item.value),
                                                //                 "med": true,
                                                //                 "medData": meds_added,
                                                //             }
                                                //         )
                                                //     }
                                                // })

                                                setSpo2maxval(parseInt(Spo2MaxVal) + 5)
                                                setSpo2minval(parseInt(Spo2MinVal) - 5)
                                                setBpmaxval(parseInt(BpMaxVal) + 5)
                                                setBpminval(parseInt(BpMinVal) - 5)
                                                setRrmaxval(parseInt(RrMaxVal) + 5)
                                                setRrminval(parseInt(RrMinVal) - 5)
                                                setTempmaxval(parseInt(TempMaxVal) + 5)
                                                setTempminval(parseInt(TempMinVal) - 5)
                                                // setEwsmaxval(parseInt(EwsMaxVal) + 5)
                                                // setEwsminval(parseInt(EwsMinVal) - 5)

                                                console.log("MAX MIN :", Spo2MaxVal)
                                                console.log("MAX MIN :", Spo2MinVal)

                                                alerts_data.map(alert => {
                                                    for (var i = 0; i < temp_spo2.length; i++) {
                                                        var alert_time = to12HourFormat(alert.firstRcvTm)
                                                        var trend_time = temp_spo2[i].date

                                                        if (alert_time === trend_time) {
                                                            if (alert.value.includes("HR")) {
                                                                if (temp_bp[i].hasOwnProperty('alertData')) {
                                                                    temp_bp[i].alertData.push(
                                                                        {
                                                                            name: 'HR',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }
                                                                    )
                                                                }
                                                                else {
                                                                    temp_bp[i] = {
                                                                        ...temp_bp[i],
                                                                        "alert": true,
                                                                        "alertData": [{
                                                                            name: 'HR',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }]
                                                                    }
                                                                }
                                                            }
                                                            if (alert.value.includes("SPO2")) {
                                                                if (temp_spo2[i].hasOwnProperty('alertData')) {
                                                                    temp_spo2[i].alertData.push(
                                                                        {
                                                                            name: 'SpO2',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }
                                                                    )
                                                                }
                                                                else {
                                                                    temp_spo2[i] = {
                                                                        ...temp_spo2[i],
                                                                        "alert": true,
                                                                        "alertData": [{
                                                                            name: 'SpO2',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }]
                                                                    }
                                                                }
                                                            }
                                                            if (alert.value.includes("RR")) {
                                                                if (temp_rr[i].hasOwnProperty('alertData')) {
                                                                    temp_rr[i].alertData.push(
                                                                        {
                                                                            name: 'RR',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }
                                                                    )
                                                                }
                                                                else {
                                                                    temp_rr[i] = {
                                                                        ...temp_rr[i],
                                                                        "alert": true,
                                                                        "alertData": [{
                                                                            name: 'RR',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }]
                                                                    }
                                                                }
                                                            }
                                                            if (alert.value.includes("TEMP")) {
                                                                if (temp_temp[i].hasOwnProperty('alertData')) {
                                                                    temp_temp[i].alertData.push(
                                                                        {
                                                                            name: 'TEMP',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }
                                                                    )
                                                                }
                                                                else {
                                                                    temp_temp[i] = {
                                                                        ...temp_temp[i],
                                                                        "alert": true,
                                                                        "alertData": [{
                                                                            name: 'TEMP',
                                                                            time: alert_time,
                                                                            info: alert.type
                                                                        }]
                                                                    }
                                                                }
                                                            }
                                                            // if (alert.value.includes("EWS")) {
                                                            //     if (temp_ews[i].hasOwnProperty('alertData')) {
                                                            //         temp_ews[i].alertData.push(
                                                            //             {
                                                            //                 name: 'EWS',
                                                            //                 time: alert_time,
                                                            //                 info: alert.type
                                                            //             }
                                                            //         )
                                                            //     }
                                                            //     else {
                                                            //         temp_ews[i] = {
                                                            //             ...temp_ews[i],
                                                            //             "alert": true,
                                                            //             "alertData": [{
                                                            //                 name: 'EWS',
                                                            //                 time: alert_time,
                                                            //                 info: alert.type
                                                            //             }]
                                                            //         }
                                                            //     }
                                                            // }
                                                        }
                                                    }
                                                })

                                                setSpo2_data(temp_spo2)
                                                setBp_data(temp_bp)
                                                setRr_data(temp_rr)
                                                setTemp_data(temp_temp)
                                                // setEws_data(temp_ews)
                                                console.log(temp_spo2)

                                                if (activeTrendsArray.length === 0) {
                                                    setActiveTrendsArray([
                                                        {
                                                            name: 'SpO2',
                                                            data: temp_spo2,
                                                            color1: '#FF7529',
                                                            color2: '#FFD0B6',
                                                            max: parseInt(Spo2MaxVal) + 5,
                                                            min: parseInt(Spo2MinVal) - 5,
                                                        },
                                                        {
                                                            name: 'HR',
                                                            data: temp_bp,
                                                            color1: '#2ACA44',
                                                            color2: '#FFEEBA',
                                                            max: parseInt(BpMaxVal) + 5,
                                                            min: parseInt(BpMinVal) - 5,
                                                        },
                                                        {
                                                            name: 'RR',
                                                            data: temp_rr,
                                                            color1: '#9e00c2',
                                                            color2: '#C4AAFD',
                                                            max: parseInt(RrMaxVal) + 5,
                                                            min: parseInt(RrMinVal) - 5,
                                                        },
                                                        {
                                                            name: 'TEMP',
                                                            data: temp_temp,
                                                            color1: '#0C70A3',
                                                            color2: '#FFEEBA',
                                                            max: parseInt(TempMaxVal) + 5,
                                                            min: parseInt(TempMinVal) - 5,
                                                        },
                                                    ])
                                                }

                                                setIsLoading(false)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            })
                            .catch(err => [
                                console.log(err)
                            ])
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {

        var current_date = new Date()
        var current_date_string = ''

        if (current_date.getMonth() + 1 < 10 || current_date.getDate() < 10) {
            if (current_date.getMonth() + 1 < 10 && current_date.getDate() < 10) {
                current_date_string = `${current_date.getFullYear()}-0${current_date.getMonth() + 1}-0${current_date.getDate()}`
            }
            else if (current_date.getMonth() + 1 < 10 && current_date.getDate() >= 10) {
                current_date_string = `${current_date.getFullYear()}-0${current_date.getMonth() + 1}-${current_date.getDate()}`
            }
            else if (current_date.getMonth() + 1 >= 10 && current_date.getDate() < 10) {
                current_date_string = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-0${current_date.getDate()}`
            }
        }
        else if (current_date.getMonth() + 1 >= 10 && current_date.getDate() >= 10) {
            current_date_string = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDate()}`
        }
        console.log(current_date_string)
        setAntd_selected_date_val(current_date_string)

        // getReqData(current_date_string)
        getDataEfficiently(current_date_string)
    }, [])

    useEffect(() => {
        setGraphLoading(false)
    }, [graphLoading])

    useEffect(() => {
        if (alertName === 'SpO2') {
            spo2AlertRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        else if (alertName === 'HR') {
            bpAlertRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        else if (alertName === 'RR') {
            rrAlertRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        else if (alertName === 'TEMP') {
            tempAlertRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        // else if (alertName === 'EWS') {
        //     ewsAlertRef.current?.scrollIntoView({ behavior: 'smooth' })
        // }
    }, [currentAlert, alertName])

    useEffect(() => {
        if (observationAddState === true) {
            observationAddScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        }

    }, [observationAddState])


    function handleDateChange(date, dateString) {
        // console.log("DATE PAYLOAD---", dateString)
        var temp = dateString.replace(/\//g, "-");
        // console.log("UPDATED STR---", temp)
        setAntd_selected_date_val(temp)
        getReqData(temp)
        // getDataEfficiently(temp)
    }

    const CustomTooltip = (payload) => {
        try {
            if (payload.active && payload.payload && payload.payload.length) {
                return (
                    <div className="custom-tooltip">
                        <p className="tooltip-label" >{`Time : ${payload.label}`}</p>
                        <p>
                            <span className="tooltip-label" style={{ color: "#FF7529" }} >{`SpO2 : ${spo2_data[hoverActiveTooltipIndex].value}`}</span>
                            <span className="tooltip-label" style={{ color: "#2ACA44" }} >{`HR : ${bp_data[hoverActiveTooltipIndex].value}`}</span>
                            <span className="tooltip-label" style={{ color: "#9e00c2" }} >{`RR : ${rr_data[hoverActiveTooltipIndex].value}`}</span>
                        </p>
                        <p>
                            <span className="tooltip-label" style={{ color: "#0C70A3" }} >{`TEMP : ${temp_data[hoverActiveTooltipIndex].value}`}</span>
                            {/* <span className="tooltip-label" style={{ color: "#9e00c2" }} >{`EWS : ${ews_data[hoverActiveTooltipIndex].value}`}</span> */}
                        </p>
                        {/* <p className="desc">{console.log(payload)}</p> */}
                    </div>
                );
            }

            return null;
        }
        catch (err) {
            // console.log(err)
            return null
        }
    };

    const CustomReferenceDot = props => {
        return (
            <circle
                stroke="red"
                stroke-width="4"
                fill="transparent"
                r="7"
                cx={props.cx}
                cy={props.cy}
            />
        );
    };

    const CustomMedReferenceDot = props => {
        return (
            <circle
                stroke="blue"
                stroke-width="4"
                fill="transparent"
                r="7"
                cx={props.cx}
                cy={props.cy}
            />
        );
    };


    return (
        isLoading
            ?
            (
                location.state
                    ?
                    (
                        <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                            <Spin />
                        </div>
                    )
                    :
                    (
                        <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                            <Spin />{history.goBack()}
                        </div>
                    )
            )
            :
            (
                <div style={{ height: "100vh", width: "100%", position: 'relative' }} >
                    <div style={observationState ? { display: 'block' } : { display: 'none' }} className="observation-container" >
                        <div style={{ height: '82%', overflowY: 'auto', marginBottom: '5%' }} >
                            {
                                observationData.map((item, index) => (
                                    observationEditIndex === index
                                        ?
                                        (
                                            <>
                                                <div style={{ display: 'flex', backgroundColor: '#FF7529', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', fontSize: '1.3rem', padding: '1% 2%', marginBottom: '2%', color: 'white' }} >
                                                    <Input placeholder={"Enter Header"} defaultValue={item.header} onChange={(e) => { setObservationEditHeaderVal(e.target.value) }} />
                                                </div>
                                                <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4%', paddingRight: '2%', marginBottom: '4%' }} >
                                                    <TextArea placeholder="Enter Content" defaultValue={item.content} autoSize onChange={(e) => { setObservationEditContentVal(e.target.value) }} />
                                                </div>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <div style={{ display: 'flex', backgroundColor: '#FF7529', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', fontSize: '1.3rem', padding: '1% 2%', marginBottom: '2%', color: 'white' }} >
                                                    <div>
                                                        {item.header}
                                                    </div>

                                                    {
                                                        !observationAddState
                                                            ?
                                                            (
                                                                <div
                                                                    onClick={() => {
                                                                        setObservationEditHeaderVal(item.header)
                                                                        setObservationEditContentVal(item.content)
                                                                        setObservationEditIndex(index)
                                                                        setIsEditState(true)
                                                                    }}
                                                                    className='gv-edit-icon'
                                                                    style={{ cursor: 'pointer' }} >
                                                                    <EditIcon />
                                                                </div>
                                                            )
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4%', paddingRight: '2%', marginBottom: '4%' }} >
                                                    <div>
                                                        {item.content}
                                                    </div>
                                                </div>
                                            </>
                                        )
                                ))
                            }
                            {
                                observationAddState
                                    ?
                                    (
                                        <>
                                            <div style={{ display: 'flex', backgroundColor: '#FF7529', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', fontSize: '1.3rem', padding: '1% 2%', marginBottom: '2%', color: 'white' }} >
                                                <Input placeholder="Enter Header" onChange={(e) => { setObservationAddHeaderVal(e.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4%', paddingRight: '2%', marginBottom: '4%' }} ref={observationAddScrollRef} >
                                                <TextArea placeholder="Enter Content" autoSize onChange={(e) => { setObservationAddContentVal(e.target.value) }} />
                                            </div>
                                        </>
                                    )
                                    :
                                    null
                            }
                        </div>
                        {
                            isEditState
                                ?
                                (
                                    (
                                        <div style={{ textAlign: 'right' }} >
                                            <Button className="secondary" onClick={() => {
                                                setIsEditState(false)
                                                setObservationEditIndex(-1)
                                            }} >
                                                Cancel
                                            </Button>
                                            <Button onClick={() => {
                                                if (observationEditHeaderVal && observationEditContentVal && observationEditHeaderVal !== '' && observationEditContentVal !== '') {
                                                    var temp = observationData
                                                    temp[observationEditIndex] = {
                                                        'header': observationEditHeaderVal,
                                                        'content': observationEditContentVal
                                                    }
                                                    setObservationData(temp)
                                                }
                                                setIsEditState(false)
                                                setObservationEditIndex(-1)
                                            }} >
                                                Save
                                            </Button>
                                        </div>
                                    )
                                )
                                :
                                (
                                    observationAddState
                                        ?
                                        (
                                            <div style={{ textAlign: 'right' }} >
                                                <Button className="secondary" onClick={() => {
                                                    setObservationAddState(false)
                                                }} >
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => {
                                                    if (observationAddHeaderVal && observationAddContentVal && observationAddHeaderVal !== '' && observationAddContentVal !== '') {
                                                        var temp = observationData
                                                        temp = [
                                                            ...temp,
                                                            {
                                                                'header': observationAddHeaderVal,
                                                                'content': observationAddContentVal
                                                            }
                                                        ]
                                                        setObservationData(temp)
                                                        console.log("NEW IBSERVATION : ", temp)
                                                    }
                                                    setObservationAddState(false)
                                                }} >
                                                    Save
                                                </Button>
                                            </div>
                                        )
                                        :
                                        (
                                            <div style={{ textAlign: 'right' }} >
                                                <Button onClick={() => {
                                                    setObservationAddState(true)
                                                }} >
                                                    Add
                                                </Button>
                                            </div>
                                        )
                                )

                        }
                    </div>
                    {/* <div style={patientInfoState ? { display: 'block' } : { display: 'none' }} className="patient-info-container" >
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }} >
                            <div>Age : 22 Y/ Male</div>
                            <div>Admitting Doctor : Vishnu Prasad . K</div>
                            <div>Vist ID : OPM-1234</div>
                            <div>Sample taken : 16/01/2021</div>
                        </div>
                    </div> */}
                    <div className="gv-header-container" >
                        <div style={{ display: 'flex', alignItems: 'center' }} >
                            <LeftOutlined
                                onClick={() => {
                                    history.goBack()
                                }}
                                className="gv-back-btn"
                            />
                            <Button onClick={() => { history.goBack() }} className='secondary' style={{ marginLeft: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0% 10%' }} >
                                <div className="gv-patient-name" style={{ fontSize: '1.4rem' }} >
                                    {
                                        location.state
                                            ?
                                            location.state.name
                                            :
                                            history.goBack()
                                    }
                                </div>
                                <div className="gv-patient-mr" style={{ fontSize: '0.9rem', color: 'rgba(0, 0, 0, 0.5)' }} >
                                    {'MR: '}{location.state ? location.state.mr : history.goBack()}
                                </div>
                            </Button>
                        </div>
                        <div className="gv-header" >
                            Visualizer
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '6px',
                                padding: '0.3% 2%',
                                width: '',
                                fontSize: '1.2rem'
                            }}
                            className='gv-observation'
                            onClick={() => { observationState ? setObservationState(false) : setObservationState(true) }}
                        >
                            <FileSearchOutlined style={{ fontSize: '1.5rem', marginRight: '5%' }} />
                            Observation
                        </div>
                    </div>
                    <div style={observationState || patientInfoState ? { filter: 'blur(4px)' } : null} className="gv-bottom-container" >
                        <div className="gv-bottom-left-whole-container" >
                            <div className="gv-graph-action-btn-container" >
                                <div className="gv-graph-action-btn" style={alertState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(false)
                                    setAlertState(true)
                                    setPieState(false)
                                    setLabState(false)
                                    setProcedureState(false)
                                    setIntakeState(false)
                                    setOutputState(false)
                                }} >
                                    <GraphAlertIcon />
                                    Alerts
                                </div>
                                <div className="gv-graph-action-btn" style={medState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(true)
                                    setAlertState(false)
                                    setPieState(false)
                                    setLabState(false)
                                    setProcedureState(false)
                                    setIntakeState(false)
                                    setOutputState(false)
                                }} >
                                    {/* <DashLineIcon/> */}
                                    <div style={{ height: '3vh', width: '0.8vw', backgroundColor: '#D7A862' }} ></div>
                                    Medicine
                                </div>
                                <div className="gv-graph-action-btn" style={pieState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(false)
                                    setAlertState(false)
                                    setPieState(true)
                                    setLabState(false)
                                    setProcedureState(false)
                                    setIntakeState(false)
                                    setOutputState(false)
                                }} >
                                    <div style={{ height: '3vh', width: '0.8vw', backgroundColor: '#0D3962' }} ></div>
                                    Motion
                                </div>
                                <div className="gv-graph-action-btn" style={labState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(false)
                                    setAlertState(false)
                                    setPieState(false)
                                    setLabState(true)
                                    setProcedureState(false)
                                    setIntakeState(false)
                                    setOutputState(false)
                                }} >
                                    <div style={{ height: '3vh', width: '0.8vw', backgroundColor: '#D0859C' }} ></div>
                                    Lab Report
                                </div>
                                <div className="gv-graph-action-btn" style={procedureState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(false)
                                    setAlertState(false)
                                    setPieState(false)
                                    setLabState(false)
                                    setProcedureState(true)
                                    setIntakeState(false)
                                    setOutputState(false)
                                }} >
                                    <div style={{ height: '3vh', width: '0.8vw', backgroundColor: '#978671' }} ></div>
                                    Procedure
                                </div>
                                <div className="gv-graph-action-btn" style={intakeState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(false)
                                    setAlertState(false)
                                    setPieState(false)
                                    setLabState(false)
                                    setProcedureState(false)
                                    setIntakeState(true)
                                    setOutputState(false)
                                }} >
                                    <div style={{ height: '3vh', width: '0.8vw', backgroundColor: '#3F660E' }} ></div>
                                    Intake
                                </div>
                                <div className="gv-graph-action-btn" style={outputState ? { border: "1px solid orange", color: "orange" } : null} onClick={() => {
                                    setMedState(false)
                                    setAlertState(false)
                                    setPieState(false)
                                    setLabState(false)
                                    setProcedureState(false)
                                    setIntakeState(false)
                                    setOutputState(true)
                                }} >
                                    <div style={{ height: '3vh', width: '0.8vw', backgroundColor: '#506C7B' }} ></div>
                                    Output
                                </div>
                            </div>
                            <div className="gv-bottom-left-container" >
                                <div className="gv-graph-info-container" >
                                    <div className="gv-trend-btns" >
                                        <div onClick={() => {
                                            var flag = true
                                            activeTrendsArray.map((trend, index) => {
                                                if (trend.name === 'SpO2') {
                                                    flag = false
                                                    var temp = activeTrendsArray
                                                    temp.splice(index, 1)
                                                    // console.log("SPLICED ARRAY : ", temp)
                                                    setActiveTrendsArray(temp)
                                                }
                                            })
                                            if (flag) {
                                                var temp = activeTrendsArray
                                                temp.push({
                                                    name: 'SpO2',
                                                    data: spo2_data,
                                                    color1: '#FF7529',
                                                    color2: '#FFD0B6',
                                                    max: spo2maxval,
                                                    min: spo2minval,
                                                })
                                                console.log("SPO2 Pushed : ", temp)
                                                setActiveTrendsArray(temp)
                                            }
                                            setGraphLoading(true)
                                        }} className="trend-btn" style={
                                            activeTrendsArray.some(e => e.name === 'SpO2') ? { border: '2px solid #FF7529', color: '#FF7529' } : { border: '1px solid #BABABA', color: '#BABABA' }
                                        } >
                                            SpO2
                                        </div>
                                        <div onClick={() => {
                                            var flag = true
                                            activeTrendsArray.map((trend, index) => {
                                                if (trend.name === 'HR') {
                                                    flag = false
                                                    var temp = activeTrendsArray
                                                    temp.splice(index, 1)
                                                    // console.log("SPLICED ARRAY : ", temp)
                                                    setActiveTrendsArray(temp)
                                                }
                                            })
                                            if (flag) {
                                                var temp = activeTrendsArray
                                                temp.push({
                                                    name: 'HR',
                                                    data: bp_data,
                                                    color1: '#2ACA44',
                                                    color2: '#FFEEBA',
                                                    max: bpmaxval,
                                                    min: bpminval,
                                                })
                                                setActiveTrendsArray(temp)
                                            }
                                            setGraphLoading(true)
                                        }}
                                            className="trend-btn" style={
                                                activeTrendsArray.some(e => e.name === 'HR') ? { border: '2px solid #2ACA44', color: '#2ACA44' } : { border: '1px solid #BABABA', color: '#BABABA' }
                                            } >
                                            HR
                                        </div>
                                        <div onClick={() => {
                                            var flag = true
                                            activeTrendsArray.map((trend, index) => {
                                                if (trend.name === 'RR') {
                                                    flag = false
                                                    var temp = activeTrendsArray
                                                    temp.splice(index, 1)
                                                    // console.log("SPLICED ARRAY : ", temp)
                                                    setActiveTrendsArray(temp)
                                                }
                                            })
                                            if (flag) {
                                                var temp = activeTrendsArray
                                                temp.push({
                                                    name: 'RR',
                                                    data: rr_data,
                                                    color1: '#9e00c2',
                                                    color2: '#C4AAFD',
                                                    max: rrmaxval,
                                                    min: rrminval,
                                                })
                                                setActiveTrendsArray(temp)
                                            }
                                            setGraphLoading(true)
                                        }} className="trend-btn" style={
                                            activeTrendsArray.some(e => e.name === 'RR') ? { border: '2px solid #9e00c2', color: '#9e00c2' } : { border: '1px solid #BABABA', color: '#BABABA' }
                                        } >
                                            RR
                                        </div>
                                        <div onClick={() => {
                                            var flag = true
                                            activeTrendsArray.map((trend, index) => {
                                                if (trend.name === 'TEMP') {
                                                    flag = false
                                                    var temp = activeTrendsArray
                                                    temp.splice(index, 1)
                                                    // console.log("SPLICED ARRAY : ", temp)
                                                    setActiveTrendsArray(temp)
                                                }
                                            })
                                            if (flag) {
                                                var temp = activeTrendsArray
                                                temp.push({
                                                    name: 'TEMP',
                                                    data: temp_data,
                                                    color1: '#0C70A3',
                                                    color2: '#A8CBDE',
                                                    max: tempmaxval,
                                                    min: tempminval,
                                                })
                                                setActiveTrendsArray(temp)
                                            }
                                            setGraphLoading(true)
                                        }} className="trend-btn" style={
                                            activeTrendsArray.some(e => e.name === 'TEMP') ? { border: '2px solid #0C70A3', color: '#0C70A3' } : { border: '1px solid #BABABA', color: '#BABABA' }
                                        } >
                                            TEMP
                                        </div>
                                        {/* <div onClick={() => {
                                            var flag = true
                                            activeTrendsArray.map((trend, index) => {
                                                if (trend.name === 'EWS') {
                                                    flag = false
                                                    var temp = activeTrendsArray
                                                    temp.splice(index, 1)
                                                    // console.log("SPLICED ARRAY : ", temp)
                                                    setActiveTrendsArray(temp)
                                                }
                                            })
                                            if (flag) {
                                                var temp = activeTrendsArray
                                                temp.push({
                                                    name: 'EWS',
                                                    data: ews_data,
                                                    color1: '#9e00c2',
                                                    color2: '#C4AAFD',
                                                    max: ewsmaxval,
                                                    min: ewsminval,
                                                })
                                                setActiveTrendsArray(temp)
                                            }
                                            setGraphLoading(true)
                                        }} className="trend-btn" style={
                                            activeTrendsArray.some(e => e.name === 'EWS') ? { border: '2px solid #9e00c2', color: '#9e00c2' } : { border: '1px solid #BABABA', color: '#BABABA' }
                                        } >
                                            EWS
                                        </div> */}
                                    </div>
                                    <div className="gv-date" >
                                        <DatePicker style={{ fontSize: "16px" }} defaultValue={moment(antd_selected_date_val, dateFormat)} format={dateFormat} onChange={(date, dateString) => {
                                            setIsLoading(true);
                                            setMedMorningLoading(true)
                                            setMedNoonLoading(true)
                                            setMedEveningLoading(true)
                                            setAlertsLoading(true)
                                            setTrendsLoading(true)
                                            handleDateChange(date, dateString)
                                        }} />
                                    </div>
                                </div>
                                <div className="graphs-container" >
                                    {
                                        graphLoading
                                            ?
                                            (
                                                <div>
                                                    <Spin />
                                                </div>
                                            )
                                            :
                                            (
                                                activeTrendsArray.map((trend) => (
                                                    <div style={{ height: `${100 / activeTrendsArray.length}%`, width: "100%", position: "relative" }} >
                                                        <div className="gv-bg-container" style={{ left: "0", top: "0" }} >
                                                            <div className="gv-graph-lable" style={{ color: trend.color1 }} >
                                                                {trend.name}
                                                            </div>
                                                            <div className="gv-graph-bg" style={{ backgroundColor: trend.color2 }} ></div>
                                                        </div>
                                                        <ResponsiveContainer width="100%" height="100%" >
                                                            <LineChart

                                                                onMouseMove={(payload) => setHoverActiveTooltipIndex(payload.activeTooltipIndex)}

                                                                onClick={(gvdata) => {

                                                                    console.log(gvdata)
                                                                    try {
                                                                        if (gvdata.activeTooltipIndex) {
                                                                            trend.data.map((ele, index) => {
                                                                                if (ele.med === true && index === gvdata.activeTooltipIndex) {
                                                                                    setCurrentMedData(ele.medData)
                                                                                    setAlertState(false)
                                                                                    setMedState(true)
                                                                                    setPieState(false)
                                                                                    setLabState(false)
                                                                                    setProcedureState(false)
                                                                                    setIntakeState(false)
                                                                                    setOutputState(false)
                                                                                }
                                                                            })
                                                                        }
                                                                        if (gvdata.activePayload[0].payload.alert) {
                                                                            setCurrentAlert(gvdata.activePayload[0].payload.date)
                                                                            alertFlag = true
                                                                            bpAlertFlag = true
                                                                            rrAlertFlag = true
                                                                            tempAlertFlag = true
                                                                            ewsAlertFlag = true
                                                                            setAlertName(trend.name)
                                                                            setAlertState(true)
                                                                            setMedState(false)
                                                                            setPieState(false)
                                                                            setLabState(false)
                                                                            setProcedureState(false)
                                                                            setIntakeState(false)
                                                                            setOutputState(false)
                                                                        }
                                                                    }
                                                                    catch (err) {
                                                                        console.log(err)
                                                                        // notification.error({
                                                                        //     message: 'Error',
                                                                        //     description: `${err}`
                                                                        // });
                                                                    }

                                                                }} width="100%" height="100%" data={trend.data}
                                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                                <XAxis dataKey="date" hide />
                                                                <YAxis dataKey="value" domain={[trend.min, trend.max]} axisLine={false} tickLine={false} width={20} tick={{ fill: trend.color1, stroke: trend.color1, strokeWidth: 0.5 }} />
                                                                <Tooltip content={<CustomTooltip />} />
                                                                {
                                                                    trend.data.map((ele) => (
                                                                        ele.med
                                                                            ?
                                                                            (
                                                                                <ReferenceLine x={ele.date} stroke="blue" strokeDasharray="7 7" strokeWidth={3} />
                                                                            )
                                                                            :
                                                                            null
                                                                    ))
                                                                }
                                                                {
                                                                    trend.data.map((ele) => (
                                                                        ele.med
                                                                            ?
                                                                            (
                                                                                <ReferenceDot x={ele.date} y={ele.value} shape={CustomMedReferenceDot} />
                                                                            )
                                                                            :
                                                                            null
                                                                    ))
                                                                }
                                                                {
                                                                    trend.data.map((ele) => (
                                                                        ele.alert
                                                                            ?
                                                                            (
                                                                                <ReferenceDot x={ele.date} y={ele.value} shape={CustomReferenceDot} />
                                                                            )
                                                                            :
                                                                            null
                                                                    ))
                                                                }
                                                                <Line type="monotone" dataKey="value" stroke={trend.color1} strokeWidth={3} dot={false} />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>

                                                ))
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="gv-bottom-right-container" >
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginBottom: '5%' }} >
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }} >
                                    {
                                        alertState
                                            ?
                                            'Alerts'
                                            :
                                            null
                                    }
                                    {
                                        medState
                                            ?
                                            'Medicine'
                                            :
                                            null
                                    }
                                    {
                                        pieState
                                            ?
                                            'Motion'
                                            :
                                            null
                                    }
                                    {
                                        labState
                                            ?
                                            'Lab Report'
                                            :
                                            null
                                    }
                                    {
                                        procedureState
                                            ?
                                            'Procedure'
                                            :
                                            null
                                    }
                                    {
                                        intakeState
                                            ?
                                            'Intake'
                                            :
                                            null
                                    }
                                    {
                                        outputState
                                            ?
                                            'Output'
                                            :
                                            null
                                    }
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%' }} >
                                    <div style={{ height: '15px', width: '20px', borderRadius: '50%', backgroundColor: 'orange' }} ></div>
                                    <div style={{ height: '4px', width: '100%', backgroundColor: 'orange' }} ></div>
                                    <div style={{ height: '15px', width: '20px', borderRadius: '50%', backgroundColor: 'orange' }} ></div>
                                </div>
                            </div>
                            {
                                pieState
                                    ?
                                    (
                                        <div style={{ height: '85%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }} >
                                            <div className='motion-item' >
                                                <VisualStandingIcon />
                                                <div className="moton-info-item" >
                                                    <div>Standing</div>
                                                    <div>45 min</div>
                                                </div>
                                            </div>
                                            <div className='motion-item' >
                                                <VisualSittingIcon />
                                                <div className="moton-info-item" >
                                                    <div>Sitting</div>
                                                    <div>1 hr</div>
                                                </div>
                                            </div>
                                            <div className='motion-item' >
                                                <VisualWalkingIcon />
                                                <div className="moton-info-item" >
                                                    <div>Walking</div>
                                                    <div>30 min</div>
                                                </div>
                                            </div>
                                            <div className='motion-item' >
                                                <VisualSleepingIcon />
                                                <div className="moton-info-item" >
                                                    <div>Sleeping</div>
                                                    <div>30 min</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                alertState
                                    ?
                                    (
                                        <div className="gv-alert-items" >
                                            {
                                                spo2_data.map((item) => (
                                                    item.alert
                                                        ?
                                                        (
                                                            item.alertData.map(alert => {
                                                                var comp
                                                                if (alert.time === currentAlert) {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            ref={alertFlag ? spo2AlertRef : null}
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    alertFlag = false
                                                                }
                                                                else {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                return comp
                                                            }
                                                            )
                                                        )
                                                        :
                                                        null
                                                ))
                                            }
                                            {
                                                bp_data.map((item) => (
                                                    item.alert
                                                        ?
                                                        (
                                                            item.alertData.map(alert => {
                                                                var comp
                                                                if (alert.time === currentAlert) {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            ref={bpAlertFlag ? bpAlertRef : null}
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    bpAlertFlag = false
                                                                }
                                                                else {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                return comp
                                                            }
                                                            )
                                                        )
                                                        :
                                                        null
                                                ))
                                            }
                                            {
                                                rr_data.map((item) => (
                                                    item.alert
                                                        ?
                                                        (
                                                            item.alertData.map(alert => {
                                                                var comp
                                                                if (alert.time === currentAlert) {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            ref={rrAlertFlag ? rrAlertRef : null}
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    rrAlertFlag = false
                                                                }
                                                                else {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                return comp
                                                            }
                                                            )
                                                        )
                                                        :
                                                        null
                                                ))
                                            }
                                            {
                                                temp_data.map((item) => (
                                                    item.alert
                                                        ?
                                                        (
                                                            item.alertData.map(alert => {
                                                                var comp
                                                                if (alert.time === currentAlert) {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            ref={tempAlertFlag ? tempAlertRef : null}
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    tempAlertFlag = false
                                                                }
                                                                else {
                                                                    var str = ''
                                                                    var temp = alert.info.split("_")
                                                                    temp.pop()
                                                                    temp.forEach(item => {
                                                                        str += item + " "
                                                                    })
                                                                    comp = (
                                                                        <div
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {str}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                return comp
                                                            }
                                                            )
                                                        )
                                                        :
                                                        null
                                                ))
                                            }
                                            {/* {
                                                ews_data.map((item) => (
                                                    item.alert
                                                        ?
                                                        (
                                                            item.alertData.map(alert => {
                                                                var comp
                                                                if (alert.time === currentAlert) {
                                                                    
                                                                    comp = (
                                                                        <div
                                                                            ref={ewsAlertFlag ? ewsAlertRef : null}
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {alert.info}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    ewsAlertFlag = false
                                                                }
                                                                else {
                                                                    comp = (
                                                                        <div
                                                                            className="gv-alert-item"
                                                                            style={{
                                                                                border: alert.time === currentAlert ? "3px solid red" : "3px solid rgba(0, 0, 0, 0.2)"
                                                                            }}
                                                                        >
                                                                            <div className="gv-alert-name-time" >
                                                                                <div>
                                                                                    {alert.name}
                                                                                </div>
                                                                                <div>
                                                                                    {alert.time}
                                                                                </div>
                                                                            </div>
                                                                            <div className="gv-alert-info" >
                                                                                {alert.info}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                return comp
                                                            }
                                                            )
                                                        )
                                                        :
                                                        null
                                                ))
                                            } */}
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                medState
                                    ?
                                    (
                                        <div className="gv-med-items" >
                                            {
                                                currentMedData.map((med) => (
                                                    <div className="gv-med-item" >
                                                        <div>
                                                            {med[Object.keys(med)[0]]}
                                                        </div>
                                                        <div>
                                                            {Object.keys(med)[0]}
                                                        </div>
                                                        <ExceptionOutlined style={{ cursor: 'pointer' }} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                labState
                                    ?
                                    (
                                        <div style={{ height: '85%', margin: '0% 5%', overflowY: 'auto' }} >
                                            <Collapse defaultActiveKey={['1']} bordered={false} expandIconPosition='right' >
                                                <Panel className='lab-collapse' header="Biochemistry" key="1" style={{ border: 'none', fontSize: '1.5rem' }} >
                                                    <div className='lr-item-container' >
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '55%' }} >
                                                            <div>
                                                                Random Blood Sugar
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Pre
                                                                    </div>
                                                                    <ArrowUpOutlined style={{ color: 'red' }} />
                                                                    <div style={{ color: 'red' }} >
                                                                        150
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Current
                                                                    </div>
                                                                    <ArrowDownOutlined style={{ color: 'green' }} />
                                                                    <div style={{ color: 'green' }} >
                                                                        70
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderLeft: '1px solid black', width: '45%', marginLeft: '2%', paddingLeft: '2%' }} >
                                                            <div>
                                                                Ref Range
                                                            </div>
                                                            <div>
                                                                80-140 mg/dl
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='lr-item-container' >
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '55%' }} >
                                                            <div>
                                                                Random Blood Sugar
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Pre
                                                                    </div>
                                                                    <ArrowUpOutlined style={{ color: 'red' }} />
                                                                    <div style={{ color: 'red' }} >
                                                                        150
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Current
                                                                    </div>
                                                                    <ArrowDownOutlined style={{ color: 'green' }} />
                                                                    <div style={{ color: 'green' }} >
                                                                        70
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderLeft: '1px solid black', width: '45%', marginLeft: '2%', paddingLeft: '2%' }} >
                                                            <div>
                                                                Ref Range
                                                            </div>
                                                            <div>
                                                                80-140 mg/dl
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Panel>
                                                <Panel className='lab-collapse' header="Serology" key="2" style={{ border: 'none', fontSize: '1.5rem' }} >
                                                    <div className='lr-item-container' >
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '55%' }} >
                                                            <div>
                                                                Random Blood Sugar
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Pre
                                                                    </div>
                                                                    <ArrowUpOutlined style={{ color: 'red' }} />
                                                                    <div style={{ color: 'red' }} >
                                                                        150
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Current
                                                                    </div>
                                                                    <ArrowDownOutlined style={{ color: 'green' }} />
                                                                    <div style={{ color: 'green' }} >
                                                                        70
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderLeft: '1px solid black', width: '45%', marginLeft: '2%', paddingLeft: '2%' }} >
                                                            <div>
                                                                Ref Range
                                                            </div>
                                                            <div>
                                                                80-140 mg/dl
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='lr-item-container' >
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '55%' }} >
                                                            <div>
                                                                Random Blood Sugar
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Pre
                                                                    </div>
                                                                    <ArrowUpOutlined style={{ color: 'red' }} />
                                                                    <div style={{ color: 'red' }} >
                                                                        150
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                                                    <div>
                                                                        Current
                                                                    </div>
                                                                    <ArrowDownOutlined style={{ color: 'green' }} />
                                                                    <div style={{ color: 'green' }} >
                                                                        70
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderLeft: '1px solid black', width: '45%', marginLeft: '2%', paddingLeft: '2%' }} >
                                                            <div>
                                                                Ref Range
                                                            </div>
                                                            <div>
                                                                80-140 mg/dl
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                procedureState
                                    ?
                                    (
                                        <div className='procedure-container' >
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Date of surgery
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='9:00 A.M.' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Provider
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='Lawrence' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Procedure
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='Right Hemithyroidectomy' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                intakeState
                                    ?
                                    (
                                        <div className='procedure-container' >
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Nursing Shift
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='Morning Shift' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Intake Time
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='7:00 A.M.' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Intake Method
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='Enteral Feed, Continuous' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Intake site
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='Jejunostomy tube' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Addition per bag
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Amount Put in
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='1000 ml' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Amount gone in
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='20 ml' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                outputState
                                    ?
                                    (
                                        <div className='procedure-container' >
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Outtake Time
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='9:00 A.M.' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Urine
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='300 ml' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        N/G Aspirate
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Draine stoma etc.
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '5% 0%', fontSize: '1rem' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%', marginRight: '2%' }} >
                                                    <div>
                                                        Stool B . O.
                                                    </div>
                                                    <div>
                                                        :
                                                    </div>
                                                </div>
                                                <Input defaultValue='BO X 1' style={{ padding: '3% 5%', fontSize: '1rem', border: '1px solid orange' }} />
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                            }

                        </div>
                    </div>
                </div>

            )

    )
}

export default GraphVisualizer
