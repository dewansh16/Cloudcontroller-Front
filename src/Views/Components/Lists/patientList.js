import React, { useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { InfluxDB } from "@influxdata/influxdb-client";
import { isJsonString } from "../../../Utils/utils";

import { Row, Col, Divider, Grid, Tooltip } from "antd";

import Colors from "../../../Theme/Colors/colors";
import Icons from "../../../Utils/iconMap";
import ChartsBlock from "./listComponent/chartsBlock";
import { Button } from "../../../Theme/Components/Button/button";
import moment from "moment";

// import { arrDataChart } from "../../arrayChart";

const { useBreakpoint } = Grid;

const PatientListItem = (props) => {
    const screens = useBreakpoint();
    // const newArrayDataChart = [...arrDataChart];

    const dividerColor = "black";
    const listThemeColor = "#444444";
    const border = "#C7C7C7";
    const activeThemeColor = Colors.blue;

    const [totalDay, setTotalDay] = useState(0);

    //animation config
    const variants = {
        hidden: {
            y: -100,
            zIndex: -1,
            display: "none",
            opacity: 0,
            transition: {
                duration: 0.3,
                easing: "easeOut",
            },
        },
        show: {
            y: 0,
            display: "flex",
            zIndex: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                easing: "easeIn",
            },
        },
    };

    const listStyle = {
        borderRadius: "0.3em",
        minHeight: "75px",
        margin: "0 0 8px 0",
        padding: "0.3em 0.5em",
        background: "white",
        display: "flex",
        // justifyContent: "space-around",
        alignItems: "center",
        cursor: "pointer",
        // gap: "0.5rem",
    };

    const listStyleScreenSmall = {
        borderRadius: "0.3em",
        minHeight: "75px",
        margin: "0 0 8px 0",
        padding: "0.3em 2em",
        background: "white",
        display: "flex",
        // justifyContent: "space-around",
        alignItems: "center",
        cursor: "pointer",
    };

    const listItemBorder = {
        borderTop: `1px solid ${border}`,
        borderRight: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        borderLeft: props.critical
            ? `5px solid ${Colors.danger}`
            : `5px solid ${Colors.green}`,
    };

    const selectedListItemBorder = {
        border: `1px solid ${Colors.blue}`,
    };

    const isElementClicked = props.active === props.pid;
    const activeTheme = isElementClicked ? activeThemeColor : listThemeColor;

    const [isChartSectionVisible, setChartSectionVisibility] = React.useState(false);

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
            icon: Icons.bloodPressure({ Style: { color: Colors.darkPurple, transform: 'scale(0.75)' } }),
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
        {
            _key: 'gateway_keep_alive_time',
            valueGateway: 0
        },
    ];

    const [chartBlockData, setChartBlockData] = React.useState(arrDataChart);

    let associatedList = [];
    const isString = isJsonString(props?.data?.demographic_map?.associated_list);
    if (isString) {
        associatedList = JSON.parse(props?.data?.demographic_map?.associated_list);
    }

    const processDataForSensor = (key, newArrChart, chart) => {
        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const query = `from(bucket: "emr_dev")
                |> range(start: -${props.dataFilterOnHeader.valDuration})
                |> filter(fn: (r) => r["_measurement"] == "${props.pid}_${key}")
                |> yield(name: "mean")`;

        const arrayRes = [];
        const arrayTime = [];
        let val_bpd = 0;
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQueryInFlux = tableMeta?.toObject(row) || {};
                if (key === "gateway_keep_alive_time") {
                    chart.valueGateway = new Date(dataQueryInFlux?._value);
                } else if (key === "alphamed_bpd" || key === "ihealth_bpd") {
                    val_bpd = dataQueryInFlux?._value;
                } else {
                    let value = dataQueryInFlux?._value || 0;
                    arrayRes.push({ value, time: dataQueryInFlux?._time });
                }

                let time = new Date(dataQueryInFlux._time);
                time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
                if (!arrayTime.includes(time)) {
                    arrayTime.push(time);
                }
            },
            error(error) {
                console.error(error)
                console.log('nFinished ERROR')
            },
            complete() {
                if (key !== "alphamed_bpd" && key !== "ihealth_bpd") {
                    chart.trendData = arrayRes || [];
                    chart.val = arrayRes[arrayRes.length - 1]?.value || 0;
                    chart.lastTime = arrayRes[arrayRes.length - 1]?.time;
                } else {
                    chart.val_bpd = val_bpd;
                }
                chart.arrayTime = arrayTime || [];
                setChartBlockData([...newArrChart]);
            },
        })
    }

    const disabledBloodPressure = !associatedList?.includes("alphamed") && !associatedList?.includes("ihealth");

    const getDataSensorFromInfluxDB = () => {
        let newArrChart = [...arrDataChart];
        newArrChart = newArrChart.filter(chart => !props.sensorHide.includes(chart?._key));
        
        for (let index = 0; index < newArrChart.length; index++) {
            const chart = newArrChart[index];
            const key = chart?._key;

            if (key !== "blood_pressuer") {
                processDataForSensor(key, newArrChart, chart)
            } else if (!disabledBloodPressure) {
                let arrKeyChild = [];

                if (associatedList?.includes("alphamed")) {
                    arrKeyChild = ["alphamed_bpd", "alphamed_bps"];
                } else {
                    arrKeyChild = ["ihealth_bpd", "ihealth_bps"];
                }

                if (!associatedList?.includes("ecg")) {
                    processDataForSensor("ihealth_hr", newArrChart, newArrChart[2]);
                }

                for (let j = 0; j < arrKeyChild.length; j++) {
                    processDataForSensor(arrKeyChild[j], newArrChart, chart);
                }
            }
        }
    };

    useEffect(() => {
        getDataSensorFromInfluxDB();

        const timeInterval = setInterval(() => {
            getDataSensorFromInfluxDB();
        }, 10000);

        return () => {
            clearInterval(timeInterval);
        }
    }, [props?.pid, props?.dataFilterOnHeader?.valDuration, props?.patientListToShow]);

    // React.useEffect(() => {
    //     var socket = io('http://20.230.234.202:7124', { transports: ['websocket', 'polling', 'flashsocket'] });
    //     socket.on('SENSOR_LOG', function (data) {
    //         const dataSocket = data.body;
    //         console.log("data SENSOR_LOG", data);

    //         if (dataSocket.patientUUID === props.pid) {
    //             const sensorFound = chartBlockData.find(item => item._key === dataSocket.deviceType);
    //             sensorFound.val = dataSocket.bps || 0;
    //             setChartBlockData([...chartBlockData]);
    //         }
    //     })
    // }, []);

    const pushToPatientDetails = () => {
        props.parentProps.history.push({
            pathname: `/dashboard/patient/details/${props.pid}`,
            state: {
                dataFilterHeader: props.dataFilterOnHeader,
            },
        });
    };

    const pushToEdit = () => {
        props.parentProps.history.push(`/dashboard/patient/edit/${props.pid}`);
    };

    const openReport = () => {
        props.parentProps.history.push({
            pathname: `/dashboard/patient/details/${props.pid}/report`,
            search: "?deboarded=true", // query string
            state: {
                deboarded: true,
            },
        });
    };

    const ShowPatientDetails = (e) => {
        e.stopPropagation();
        props.setPatientDetails({ patientDetails: props.data });
        props.setActive(props.pid);
        props.setShowTrend(false);
    };

    function sortDate(a, b) {
        const first = new Date(a).getTime();
        const last = new Date(b).getTime();
        return (first > last) - (first < last)
    }

    const numberOfNightsBetweenDates = (start, end) => {
        let dayCount = 0;
        while (end >= start) {
            dayCount++;
            start.setDate(start.getDate() + 1);
        };

        return dayCount
    }

    const getTotalDayReadingOfSensor = (visible) => {
        if (visible) {
            const totalArrTime = [];
            chartBlockData.map(chart => {
                const arrayTime = chart.arrayTime || [];
                arrayTime.map(time => {
                    if (!totalArrTime?.includes(time)) {
                        totalArrTime.push(time)
                    }
                })
            });

            totalArrTime?.sort(sortDate);
            const minDate = new Date(totalArrTime[0]);
            const maxDate = new Date(totalArrTime[totalArrTime?.length - 1]);
            const total = numberOfNightsBetweenDates(minDate, maxDate)
            setTotalDay(total);
        } else {
            setTotalDay(0);
        }
    };

    const BedDetailsSection = ({ width, marginHouseIcon = "0 0" }) => (

        <div
            style={{
                display: "flex",
                alignItems: "center",
                width: width,
            }}
        >
            <div style={{ width: "16px", marginRight: "0.75rem", marginLeft: "0.25rem" }}>
                <Button
                    style={{ padding: "0em" }}
                    onClick={ShowPatientDetails}
                    type="secondary"
                >
                    {Icons.infoCircleIcon({
                        Style: { width: "16px" },
                    })}
                </Button>
            </div>

            <div style={{ width: "24px", margin: marginHouseIcon }}>
                {Icons.houseIcon({
                    Style: { fill: `${activeTheme}`, width: "24px", opacity: "0.75" },
                })}
            </div>

            <div style={{
                marginLeft: "1rem",
                textAlign: "center"
            }}>
                <div>
                    <Tooltip
                        // visible={!!(totalDay > 0)}
                        // title={`${totalDay} ${totalDay > 1 ? "days" : "day"}`}
                        // onVisibleChange={(visible) => { getTotalDayReadingOfSensor(visible) }}
                    >
                        <div style={{ color: `${activeTheme}`, fontWeight: "bold" }}>
                            {props.Name}
                        </div>
                    </Tooltip>

                    <div style={{ lineHeight: "16px" }}>
                        <span style={{ color: `${activeTheme}` }}>{props.age} Y</span>
                        <span
                            style={{
                                color: `${activeTheme}`,
                                paddingLeft: "1.4em",
                                textTransform: "uppercase",
                            }}
                        >
                            {props.sex[0]}
                        </span>
                    </div>
                </div>
                <div
                    style={{
                        color: `${activeTheme}`,
                        opacity: "0.6",
                        letterSpacing: "1px",
                    }}
                >
                    MR: {props.data.demographic_map.med_record}
                </div>
            </div>
        </div>
    );

    const NameSection = ({ width }) => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: width,
            }}
        >
            <span style={{ color: `${activeTheme}`, fontWeight: "bold" }}>
                {props.Name}
            </span>
            <div style={{ display: "inline-flex", justifyContent: "space-between" }}>
                <span style={{ color: `${activeTheme}` }}>{props.age} Y</span>
                <span
                    style={{
                        color: `${activeTheme}`,
                        paddingLeft: "1.4em",
                        textTransform: "uppercase",
                    }}
                >
                    {props.sex[0]}
                </span>
            </div>
        </div>
    );

    const EwsSection = ({ width }) => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: width,
            }}
        >
            <span
                style={{
                    color: `${activeTheme}`,
                    fontWeight: "normal",
                    fontSize: "1.25em",
                }}
            >
                EWS
            </span>
            <span
                style={{
                    color: `${activeTheme}`,
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    textAlign: "center",
                }}
            >
                {props.ews}
            </span>
        </div>
    );

    const ChartSection = ({ width, hideDateGateway = false }) => (
        <Row justify="space-around" gutter={2} style={{ width: width }}>
            {chartBlockData.map((item, i) => {
                if (props.sensorHide.includes(item?._key)) return null;

                if (hideDateGateway && item?._key !== "gateway_keep_alive_time") {
                    return (
                        <div
                            key={i}
                            className="chart_item"
                            style={{
                                display: "flex", alignItems: "center",
                                width: "16.4%"
                            }}
                        >
                            <Divider
                                type="vertical"
                                style={{
                                    background: `${dividerColor}`,
                                    opacity: "0.2",
                                    height: "3em",
                                }}
                            ></Divider>
                            <ChartsBlock
                                Icon={item.icon}
                                name={item.name}
                                value={item?.val}
                                valueBpd={item?.val_bpd || 0}
                                chartData={item?.trendData}
                                dataKey="value"
                                strokeColor={item.color}
                                keyChart={item?._key}
                                lastTime={item?.lastTime}
                            />
                        </div>
                    )
                } else {
                    return (
                        <div
                            key={i}
                            className="chart_item"
                            style={{
                                display: "flex", alignItems: "center",
                                width: item?._key === "gateway_keep_alive_time" ? "8%" : "15%"
                            }}
                        >
                            {item?._key !== "gateway_keep_alive_time" ? (
                                <>
                                    <Divider
                                        type="vertical"
                                        style={{
                                            background: `${dividerColor}`,
                                            opacity: "0.2",
                                            height: "3em",
                                        }}
                                    ></Divider>
                                    <ChartsBlock
                                        Icon={item.icon}
                                        name={item.name}
                                        value={item?.val}
                                        valueBpd={item?.val_bpd || 0}
                                        chartData={item?.trendData}
                                        dataKey="value"
                                        strokeColor={item.color}
                                        keyChart={item?._key}
                                        lastTime={item?.lastTime}
                                    />
                                </>
                            ) : (
                                <>
                                    <Divider
                                        type="vertical"
                                        style={{
                                            background: `${dividerColor}`,
                                            opacity: "0.2",
                                            height: "3em",
                                        }}
                                    ></Divider>
                                    <div>{!!item?.valueGateway ? moment(item?.valueGateway).format("MMM DD YYYY hh:mm:ss a") : "NA"}</div>
                                </>
                            )}
                        </div>
                    );
                }
            })}
        </Row>
    );

    const CustomDivider = ({ height = "100%" }) => (
        <div
            style={{ width: "1px", background: `${border}`, height: height }}
        ></div>
    );

    // const flexType = !props.showTrend ? span = { 4} : flex = { 1}
    // if (props.patientType === "deboarded") {
    //     return (
    //         <div
    //             key={props.pid}
    //             style={
    //                 isElementClicked
    //                     ? { ...listStyle, ...selectedListItemBorder }
    //                     : { ...listStyle, ...listItemBorder }
    //             }
    //         >
    //             <BedDetailsSection width="16%" />
    //             {/* <CustomDivider />
    //             <NameSection width="10%" /> */}

    //             <CustomDivider />
    //             <div
    //                 style={{
    //                     width: "20%",
    //                     display: "flex",
    //                     alignItems: "center",
    //                     justifyContent: "center",
    //                 }}
    //             >
    //                 <Button onClick={pushToEdit} type="secondary">
    //                     Edit Patient
    //                 </Button>
    //             </div>
    //             <CustomDivider />
    //             <div
    //                 style={{
    //                     width: "12%",
    //                     display: "flex",
    //                     alignItems: "center",
    //                     justifyContent: "center",
    //                 }}
    //             >
    //                 <Button onClick={openReport} type="secondary">
    //                     Report
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // } else {
    if (screens.xl) {
        return (
            <div
                key={props.pid}
                style={
                    isElementClicked
                        ? { ...listStyle, ...selectedListItemBorder }
                        : { ...listStyle, ...listItemBorder }
                }
                onClick={pushToPatientDetails}
            >
                <Tooltip title="abc">
                    <BedDetailsSection width="16%" />
                </Tooltip>

                <ChartSection width="84%" />
            </div>
        );
    } else {
        return (
            <React.Fragment key={props.pid}>
                <div
                    style={
                        isElementClicked
                            ? { ...listStyleScreenSmall, ...selectedListItemBorder }
                            : { ...listStyleScreenSmall, ...listItemBorder }
                    }
                    onClick={pushToPatientDetails}
                >
                    <BedDetailsSection width="34%" marginHouseIcon="0 0.5rem" />

                    <CustomDivider height="3rem" />
                    {/* eslint-disable-next-line */}
                    <div
                        style={{ width: "23%", textAlign: "center" }}
                        onClick={(event) => {
                            event.stopPropagation();
                            setChartSectionVisibility(!isChartSectionVisible);
                        }}
                    >
                        <span>View Trends</span>
                    </div>

                    <CustomDivider height="3rem" />
                    <div onClick={ShowPatientDetails} style={{ width: "23%", textAlign: "center" }}>
                        <span>View Details</span>
                    </div>

                    <CustomDivider height="3rem" />
                    <div onClick={ShowPatientDetails} style={{ width: "20%", textAlign: "center" }}>
                        <span>{!!chartBlockData?.[6]?.valueGateway ? moment(chartBlockData?.[6]?.valueGateway).format("MMM DD hh:mm:ss a") : "NA"}</span>
                    </div>
                </div>
                <motion.div
                    style={
                        isElementClicked ? {
                            ...listStyle,
                            ...selectedListItemBorder,
                            position: "relative",
                            top: "0rem",
                        } : {
                            ...listStyle,
                            ...listItemBorder,
                            position: "relative",
                            top: "0rem",
                        }
                    }
                    initial={"hidden"}
                    animate={isChartSectionVisible ? "show" : "hidden"}
                    exit={"hidden"}
                    variants={variants}
                >
                    <ChartSection width="100%" hideDateGateway />
                </motion.div>
            </React.Fragment>
        );
    }
};

export { PatientListItem };
