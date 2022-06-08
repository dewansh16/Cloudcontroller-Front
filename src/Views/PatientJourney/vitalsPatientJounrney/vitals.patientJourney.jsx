import React, { useState, useEffect, useRef } from "react";
import { Table, Spin, DatePicker } from "antd";
import { InfluxDB } from "@influxdata/influxdb-client";
import { isJsonString } from "../../../Utils/utils";

import Colors from "../../../Theme/Colors/colors";
import Icons from "../../../Utils/iconMap";
import VitalGraphs from "./vitalGraphs.patientJourney";
import moment from 'moment';

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

import "./vitals.patientJourney.css";

function Vitals({ activeStep, wardArray, patient, pid, valDuration }) {
    const tempmaxval = 0;
    const tempminval = 0;
    const spo2maxval = 0;
    const spo2minval = 0;
    const hrmaxval = 0;
    const hrminval = 0;
    const rrmaxval = 0;
    const rrminval = 0;
    const bpdmaxval = 0;
    const bpdminval = 0;
    const bpsmaxval = 0;
    const bpsminval = 0;
    const weimaxval = 0;
    const weiminval = 0;

    const [stepArray, setStepArray] = useState(wardArray);
    const [graphLoading, setGraphLoading] = useState(false);
    const [antd_selected_date_val, setAntd_selected_date_val] = useState(new Date());
    const [hoverActiveTooltipIndex, setHoverActiveTooltipIndex] = useState(0);

    const [activeTrendsArray, setActiveTrendsArray] = useState([
        {
            _key: "temp",
            name: 'TEMP',
            data: [],
            color1: Colors.purple,
            color2: '#A8CBDE',
            max: tempmaxval,
            min: tempminval,
        },
        {
            _key: "spo2",
            name: 'SpO2',
            data: [],
            color1: Colors.green,
            color2: '#FFD0B6',
            max: spo2maxval,
            min: spo2minval,
        },
        {
            _key: "ecg_hr",
            name: 'HR',
            data: [],
            color1: Colors.darkPink,
            color2: '#FFEEBA',
            max: hrmaxval,
            min: hrminval,
        },
        {
            _key: "ecg_rr",
            name: 'RR',
            data: [],
            color1: Colors.orange,
            color2: '#C4AAFD',
            max: rrmaxval,
            min: rrminval,
        },
        {
            _key: "bpd",
            name: 'BPD',
            data: [],
            color1: Colors.darkPurple,
            color2: '#C4AAFD',
            max: bpdmaxval,
            min: bpdminval,
        },
        {
            _key: "bps",
            name: 'BPS',
            data: [],
            color1: Colors.darkPurple,
            color2: '#C4AAFD',
            max: bpsmaxval,
            min: bpsminval,
        },
        {
            _key: "weight",
            name: 'WEI',
            data: [],
            color1: Colors.yellow,
            color2: '#C4AAFD',
            max: weimaxval,
            min: weiminval,
        }
    ]);

    let associatedList = [];
    const isString = isJsonString(patient?.demographic_map?.associated_list);
    if (isString) {
        associatedList = JSON.parse(patient?.demographic_map?.associated_list);
    }

    const dateFormat = 'YYYY/MM/DD';
    const timerTimeout = useRef();

    useEffect(() => {
        setStepArray(wardArray);
    }, [wardArray]);

    // const editWardName = (step) => {
    //     if (step?.name === undefined) {
    //         return null;
    //     } else if (step?.name.length > 12) return step?.name.slice(0, 12) + ".";
    //     else return step?.name;
    // };

    // const heading = (name) => {
    //     switch (name) {
    //         case "temp": {
    //             return "Temperature";
    //         }
    //         case "spo2": {
    //             return "SPO2";
    //         }
    //         case hrr": {
    //             rhturn "Respiration Rate";
    //         }
    //         case "hr": {
    //             return "Heart Rate";
    //         }
    //         case "bph": {
    //             return "Bloop Pressure";
    //         }
    //     }
    // };

    // const configBloodPressure = (item) => {
    //     if (item === null || item === undefined) return null;
    //     if (item?.deviceData?.bph === null && item?.deviceData?.bpl === null) {
    //         return null;
    //     } else {
    //         return item?.deviceData?.bph + " / " + item?.deviceData?.bpl;
    //     }
    // };

    // const columns = [
    //     {
    //         width: "40%",
    //         title: (
    //             <div
    //                 style={{
    //                     fontFamily: "Lexend",
    //                     fontWeight: "500",
    //                     fontSize: "14px",
    //                     color: "#727272",
    //                 }}
    //             >
    //                 Vitals
    //             </div>
    //         ),
    //         dataIndex: "name",
    //         key: "name",
    //     },
    //     {
    //         width: "30%",
    //         title: (
    //             <div
    //                 style={{
    //                     textAlign: "center",
    //                     fontFamily: "Lexend",
    //                     fontWeight: "500",
    //                     fontSize: "14px",
    //                     color: "#727272",
    //                 }}
    //             >
    //                 {editWardName(stepArray[activeStep])}
    //             </div>
    //         ),
    //         dataIndex: "prevWard",
    //         key: "access",
    //     },
    //     {
    //         width: "30%",
    //         title: (
    //             <div
    //                 style={{
    //                     textAlign: "center",
    //                     fontFamily: "Lexend",
    //                     fontWeight: "500",
    //                     fontSize: "14px",
    //                     color: "#727272",
    //                 }}
    //             >
    //                 {editWardName(stepArray[activeStep + 1])}
    //             </div>
    //         ),
    //         dataIndex: "nextWard",
    //         key: "access",
    //     },
    // ];

    // const [tableData, setTableData] = useState([
    //     {
    //         key: "11",
    //         name: (
    //             <div className="vital-tables-row-name">
    //                 <p>Temperature</p>
    //             </div>
    //         ),
    //         prevWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep]?.deviceData?.temp}</p>
    //             </div>
    //         ),
    //         nextWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep + 1]?.deviceData?.temp}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         key: "12",
    //         name: (
    //             <div className="vital-tables-row-name">
    //                 <p>Heart Rate</p>
    //             </div>
    //         ),
    //         prevWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep]?.deviceData?.hr}</p>
    //             </div>
    //         ),
    //         nextWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep + 1]?.deviceData?.hr}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         key: "13",
    //         name: (
    //             <div className="vital-tables-row-name">
    //                 <p>SPO2</p>
    //             </div>
    //         ),
    //         prevWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep]?.deviceData?.spo2}</p>
    //             </div>
    //         ),
    //         nextWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep + 1]?.deviceData?.spo2}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         key: "14",
    //         name: (
    //             <div className="vital-tables-row-name">
    //                 <p>Blood Pressure</p>
    //             </div>
    //         ),
    //         prevWard: (
    //             <div className="vital-table-values">
    //                 <p>{configBloodPressure(stepArray[activeStep])}</p>
    //             </div>
    //         ),
    //         nextWard: (
    //             <div className="vital-table-values">
    //                 <p>{configBloodPressure(stepArray[activeStep + 1])}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         key: "15",
    //         name: (
    //             <div className="vital-tables-row-name">
    //                 <p>Respiration Rate</p>
    //             </div>
    //         ),
    //         prevWard: (
    //             <divh className="vital-table-values">
    //                 <p>{stepArray[activeStep]?.deviceData?hrr}</p>
    //             </divh
    //         ),
    //         nextWard: (
    //             <div className="vital-table-values">
    //                 <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         key: "16",
    //         name: (
    //             <div className="vital-tables-row-name">
    //                 <p>Weight</p>
    //             </div>
    //         ),
    //         prevWard: (
    //             <div className="vital-table-values">
    //                 {/* <p>{stepArray[activeStep]?.deviceData?.rr}</p> */}
    //             </div>
    //         ),
    //         nextWard: (
    //             <div className="vital-table-values">
    //                 {/* <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p> */}
    //             </div>
    //         ),
    //     },
    // ]);

    // useEffect(() => {
    //     setTableData([
    //         {
    //             key: "11",
    //             name: (
    //                 <div className="vital-tables-row-name">
    //                     <p>Temperature</p>
    //                 </div>
    //             ),
    //             prevWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep]?.deviceData?.temp}</p>
    //                 </div>
    //             ),
    //             nextWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep + 1]?.deviceData?.temp}</p>
    //                 </div>
    //             ),
    //         },
    //         {
    //             key: "12",
    //             name: (
    //                 <div className="vital-tables-row-name">
    //                     <p>Heart Rate</p>
    //                 </div>
    //             ),
    //             prevWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep]?.deviceData?.hr}</p>
    //                 </div>
    //             ),
    //             nextWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep + 1]?.deviceData?.hr}</p>
    //                 </div>
    //             ),
    //         },
    //         {
    //             key: "13",
    //             name: (
    //                 <div className="vital-tables-row-name">
    //                     <p>SPO2</p>
    //                 </div>
    //             ),
    //             prevWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep]?.deviceData?.spo2}</p>
    //                 </div>
    //             ),
    //             nextWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep + 1]?.deviceData?.spo2}</p>
    //                 </div>
    //             ),
    //         },
    //         {
    //             key: "14",
    //             name: (
    //                 <div className="vital-tables-row-name">
    //                     <p>Blood Pressure</p>
    //                 </div>
    //             ),
    //             prevWard: (
    //                 <div className="vital-table-values">
    //                     <p>{configBloodPressure(stepArray[activeStep])}</p>
    //                 </div>
    //             ),
    //             nextWard: (
    //                 <div className="vital-table-values">
    //                     <p>{configBloodPressure(stepArray[activeStep + 1])}</p>
    //                 </div>
    //             ),
    //         },
    //         {
    //             key: "15",
    //             name: (
    //                 <div className="vital-tables-row-name">
    //                     <p>Respiration Rate</p>
    //                 </div>
    //             ),
    //             prevWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep]?.deviceData?.rr}</p>
    //                 </div>
    //             ),
    //             nextWard: (
    //                 <div className="vital-table-values">
    //                     <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p>
    //                 </div>
    //             ),
    //         },
    //         {
    //             key: "16",
    //             name: (
    //                 <div className="vital-tables-row-name">
    //                     <p>Weight</p>
    //                 </div>
    //             ),
    //             prevWard: (
    //                 <div className="vital-table-values">
    //                     {/* <p>{stepArray[activeStep]?.deviceData?.rr}</p> */}
    //                 </div>
    //             ),
    //             nextWard: (
    //                 <div className="vital-table-values">
    //                     {/* <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p> */}
    //                 </div>
    //             ),
    //         },
    //     ]);
    // }, [activeStep, stepArray]);

    const onGetDataSensorFromInfluxByKey = (keySensor, data, type, index) => {
        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const dateQuery = antd_selected_date_val ? new Date(antd_selected_date_val) : new Date();
        const start = new Date(dateQuery.setHours(0, 0, 1));
        const end = new Date(dateQuery.setHours(23, 59, 59));

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${keySensor}")
                |> yield(name: "mean")`;

        const arrayRes = [];
        const newArrayData = [...activeTrendsArray];

        if (type === "delete") {
            newArrayData.splice(index, 1);
        }

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQueryInFlux = tableMeta?.toObject(row) || {};
                const value = dataQueryInFlux?._value || 0;
                arrayRes.push({ value, time: dataQueryInFlux?._time });
            },
            error(error) {
                console.error(error)
                console.log('nFinished ERROR')
            },
            complete() {
                data.data = arrayRes;
                newArrayData.push(data);
                setActiveTrendsArray(newArrayData);
            },
        })
    };

    const getDataChartsActive = () => {
        activeTrendsArray.forEach((chart, index) => {
            chart.data = [];

            if (chart?._key === "bpd" || chart?._key === "bps") {
                let keySensor = "alphamed";

                if (associatedList?.includes("ihealth")) {
                    keySensor = "ihealth";
                }
                onGetDataSensorFromInfluxByKey(`${keySensor}_${chart?._key}`, chart, "delete", index);
            } else {
                onGetDataSensorFromInfluxByKey(chart._key, chart, "delete", index);
            }
        });
    };

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
        setAntd_selected_date_val(current_date_string)
    }, []);

    useEffect(() => {
        if (graphLoading) {
            timerTimeout.current = setTimeout(() => {
                setGraphLoading(false)
            }, 750);
        }

        return () => {
            clearTimeout(timerTimeout.current);
        }
    }, [graphLoading]);

    useEffect(() => {
        setGraphLoading(true);
        getDataChartsActive();
    }, [antd_selected_date_val]);

    function handleDateChange(date, dateString) {
        var temp = dateString.replace(/\//g, "-");
        setAntd_selected_date_val(temp)
    }

    const CustomTooltip = (payload) => {
        try {
            if (payload.active && payload.payload && payload.payload.length) {
                const sensorFound = activeTrendsArray[payload.indexSensor];
                const time = new Date(sensorFound.data[hoverActiveTooltipIndex].time);

                return (
                    <div className="custom-tooltip" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="tooltip-label" style={{ color: sensorFound.color1 }} >
                            {`${sensorFound?.name} : ${sensorFound.data[hoverActiveTooltipIndex].value}`}
                        </span>
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
        <>
            {/* <div className="vitals-body">
                <div className="vitals-table">
                    <div style={{ width: "100%" }}>
                        <Table
                            size="small"
                            className="vital-table"
                            columns={columns}
                            dataSource={tableData}
                            pagination={false}
                            bordered
                        />
                    </div>
                </div>
                <div className="vitals-graphs-section">
                    {chartBlockData.map((item, index) => {
                        return <VitalGraphs item={item} key={index} />;
                    })}
                </div>
            </div> */}
            <div className="gv-bottom-left-container" style={{ height: "100%" }}>
                <div className="gv-graph-info-container" >
                    <div className="gv-trend-btns" >
                        <div
                            onClick={() => {
                                setGraphLoading(true);
                                var flag = true;
                                activeTrendsArray.map((trend, index) => {
                                    if (trend.name === 'TEMP') {
                                        flag = false
                                        var temp = activeTrendsArray
                                        temp.splice(index, 1)
                                        setActiveTrendsArray(temp)
                                    }
                                })
                                if (flag) {
                                    const temp = {
                                        _key: "temp",
                                        name: 'TEMP',
                                        data: [],
                                        color1: Colors.purple,
                                        color2: '#A8CBDE',
                                        max: tempmaxval,
                                        min: tempminval,
                                    }
                                    onGetDataSensorFromInfluxByKey("temp", temp);
                                }
                            }}
                            className="trend-btn"
                            style={
                                activeTrendsArray.some(e => e.name === 'TEMP')
                                    ? { border: `2px solid ${Colors.purple}`, color: Colors.purple }
                                    : { border: '1px solid #BABABA', color: '#BABABA' }
                            }
                        >
                            TEMP
                        </div>

                        <div onClick={() => {
                            setGraphLoading(true);
                            var flag = true;
                            activeTrendsArray.map((trend, index) => {
                                if (trend.name === 'SpO2') {
                                    flag = false
                                    var temp = activeTrendsArray
                                    temp.splice(index, 1)
                                    setActiveTrendsArray(temp)
                                }
                            })
                            if (flag) {
                                const spo2 = {
                                    _key: "spo2",
                                    name: 'SpO2',
                                    data: [],
                                    color1: Colors.green,
                                    color2: '#FFD0B6',
                                    max: spo2maxval,
                                    min: spo2minval,
                                }
                                onGetDataSensorFromInfluxByKey("spo2", spo2);
                            }
                        }}
                            className="trend-btn"
                            style={
                                activeTrendsArray.some(e => e.name === 'SpO2')
                                    ? { border: `2px solid ${Colors.green}`, color: Colors.green }
                                    : { border: '1px solid #BABABA', color: '#BABABA' }
                            }
                        >
                            SpO2
                        </div>

                        <div onClick={() => {
                            setGraphLoading(true);
                            var flag = true;
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
                                const hr = {
                                    _key: "ecg_hr",
                                    name: 'HR',
                                    data: [],
                                    color1: Colors.darkPink,
                                    color2: '#FFEEBA',
                                    max: hrmaxval,
                                    min: hrminval,
                                }
                                onGetDataSensorFromInfluxByKey("ecg_hr", hr);
                            }
                        }}
                            className="trend-btn" style={
                                activeTrendsArray.some(e => e.name === 'HR') ? { border: `2px solid ${Colors.darkPink}`, color: Colors.darkPink } : { border: '1px solid #BABABA', color: '#BABABA' }
                            }>
                            HR
                        </div>

                        <div onClick={() => {
                            setGraphLoading(true);
                            var flag = true;
                            activeTrendsArray.map((trend, index) => {
                                if (trend.name === 'RR') {
                                    flag = false
                                    var temp = activeTrendsArray
                                    temp.splice(index, 1)
                                    setActiveTrendsArray(temp)
                                }
                            })
                            if (flag) {
                                const rr = {
                                    _key: "ecg_rr",
                                    name: 'RR',
                                    data: [],
                                    color1: Colors.orange,
                                    color2: '#C4AAFD',
                                    max: rrmaxval,
                                    min: rrminval,
                                }
                                onGetDataSensorFromInfluxByKey("ecg_rr", rr);
                            }
                        }} className="trend-btn" style={
                            activeTrendsArray.some(e => e.name === 'RR') ? { border: `2px solid ${Colors.orange}`, color: Colors.orange } : { border: '1px solid #BABABA', color: '#BABABA' }
                        }>
                            RR
                        </div>

                        {(associatedList?.includes("alphamed") || associatedList?.includes("ihealth")) && (
                            <>
                                <div onClick={() => {
                                    setGraphLoading(true);
                                    var flag = true;
                                    activeTrendsArray.map((trend, index) => {
                                        if (trend.name === 'BPD') {
                                            flag = false
                                            var temp = activeTrendsArray
                                            temp.splice(index, 1)
                                            setActiveTrendsArray(temp)
                                        }
                                    })
                                    if (flag) {
                                        const bpd = {
                                            _key: "bpd",
                                            name: 'BPD',
                                            data: [],
                                            color1: Colors.darkPurple,
                                            color2: '#C4AAFD',
                                            max: bpdmaxval,
                                            min: bpdminval,
                                        }
                                        onGetDataSensorFromInfluxByKey("bpd", bpd);
                                    }
                                }} className="trend-btn" style={
                                    activeTrendsArray.some(e => e.name === 'BPD') ? { border: `2px solid ${Colors.darkPurple}`, color: Colors.darkPurple } : { border: '1px solid #BABABA', color: '#BABABA' }
                                } >
                                    BPD
                                </div>

                                <div onClick={() => {
                                    setGraphLoading(true);
                                    var flag = true;
                                    activeTrendsArray.map((trend, index) => {
                                        if (trend.name === 'BPS') {
                                            flag = false
                                            var temp = activeTrendsArray
                                            temp.splice(index, 1)
                                            setActiveTrendsArray(temp)
                                        }
                                    })
                                    if (flag) {
                                        const bps = {
                                            _key: "bps",
                                            name: 'BPS',
                                            data: [],
                                            color1: Colors.darkPurple,
                                            color2: '#C4AAFD',
                                            max: bpsmaxval,
                                            min: bpsminval,
                                        }
                                        onGetDataSensorFromInfluxByKey("bps", bps);
                                    }
                                }} className="trend-btn" style={
                                    activeTrendsArray.some(e => e.name === 'BPS') ? { border: `2px solid ${Colors.darkPurple}`, color: Colors.darkPurple } : { border: '1px solid #BABABA', color: '#BABABA' }
                                }>
                                    BPS
                                </div>
                            </>
                        )}

                        <div onClick={() => {
                            setGraphLoading(true);
                            var flag = true;
                            activeTrendsArray.map((trend, index) => {
                                if (trend.name === 'WEI') {
                                    flag = false
                                    var temp = activeTrendsArray
                                    temp.splice(index, 1)
                                    setActiveTrendsArray(temp)
                                }
                            })
                            if (flag) {
                                const weight = {
                                    _key: "weight",
                                    name: 'WEI',
                                    data: [],
                                    color1: Colors.yellow,
                                    color2: '#C4AAFD',
                                    max: weimaxval,
                                    min: weiminval,
                                }
                                onGetDataSensorFromInfluxByKey("weight", weight);
                            }
                        }} className="trend-btn" style={
                            activeTrendsArray.some(e => e.name === 'WEI') ? { border: `2px solid ${Colors.yellow}`, color: Colors.yellow } : { border: '1px solid #BABABA', color: '#BABABA' }
                        } >
                            WEI
                        </div>
                    </div>

                    <div className="gv-date" >
                        <DatePicker
                            style={{ fontSize: "16px" }}
                            defaultValue={moment(antd_selected_date_val, dateFormat)}
                            format={dateFormat}
                            onChange={(date, dateString) => {
                                // setIsLoading(true);
                                // setMedMorningLoading(true)
                                // setMedNoonLoading(true)
                                // setMedEveningLoading(true)
                                // setAlertsLoading(true)
                                // setTrendsLoading(true)
                                handleDateChange(date, dateString)
                            }}
                        />
                    </div>
                </div>
                <div className="graphs-container" >
                    {
                        graphLoading
                            ? (
                                <div><Spin /></div>
                            ) : (
                                activeTrendsArray.map((trend, idx) => (
                                    <div key={`${idx}-${trend.name}`} style={{ height: `${100 / activeTrendsArray.length}%`, width: "100%", position: "relative" }} >
                                        <div className="gv-bg-container" style={{ left: "0", top: "0" }} >
                                            <div className="gv-graph-lable" style={{ color: trend.color1 }} >
                                                {trend.name}
                                            </div>
                                            <div className="gv-graph-bg" style={{ backgroundColor: trend.color2 }} ></div>
                                        </div>
                                        <ResponsiveContainer width="97%" height="100%" >
                                            <LineChart
                                                onMouseMove={(payload) => setHoverActiveTooltipIndex(payload.activeTooltipIndex)}
                                                width="100%" height="100%"
                                                data={trend.data}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <XAxis dataKey="date" hide />
                                                <YAxis dataKey="value" domain={[trend.min, trend.max]} axisLine={false} tickLine={false} width={35} tick={{ fill: trend.color1, stroke: trend.color1, strokeWidth: 0.5 }} />
                                                <Tooltip content={<CustomTooltip indexSensor={idx} />} />
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
                                                <Line type="monotone" dataKey="value" stroke={trend.color1} strokeWidth={3} dot={true} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                ))
                            )
                    }
                </div>
            </div>
        </>
    );
}

export default Vitals;
