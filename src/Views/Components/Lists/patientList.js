import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { InfluxDB } from "@influxdata/influxdb-client";

import { Row, Col, Divider, Grid, Tooltip } from "antd";
import Colors from "../../../Theme/Colors/colors";
import Icons from "../../../Utils/iconMap";
import ChartsBlock from "./listComponent/chartsBlock";
import { Button } from "../../../Theme/Components/Button/button";
const { useBreakpoint } = Grid;

const PatientListItem = (props) => {
    const screens = useBreakpoint();

    // console.log("props", props);

    const dividerColor = "black";
    const listThemeColor = "#444444";
    const border = "#C7C7C7";
    const activeThemeColor = Colors.blue;

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
        height: "75px",
        margin: "0 0 20px 0",
        padding: "0.2em 2em",
        background: "white",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        cursor: "pointer",
        gap: "1rem",
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
            // val:
            // parseInt(props.data.ews_map?.temp) === -1
            //     ? "NA"
            //     : props.data.ews_map?.temp,
            trendData: []
        },
        {
            _key: 'spo2',
            name: "SPO2",
            icon: Icons.o2({ Style: { color: Colors.green } }),
            val: 0,
            color: Colors.green,
            // val:
            // parseInt(props.data.ews_map?.spo2) === -1
            //     ? "NA"
            //     : props.data.ews_map?.spo2,
            trendData: []
        },
        {
            _key: 'heart',
            name: "Heart Rate",
            icon: Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
            val: 0,
            color: Colors.darkPink,
            // val:
            // parseInt(props.data.ews_map?.hr) === -1
            //     ? "NA"
            //     : props.data.ews_map?.hr,
            trendData: []
        },
        {
            _key: 'alphamed',
            name: "Respiration Rate",
            icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
            val: 0,
            color: Colors.orange,
            // val:
            // parseInt(props.data.ews_map?.rr) === -1
            //     ? "NA"
            //     : props.data.ews_map?.rr,
            trendData: []
        },
        {
            _key: 'blood',
            name: "Blood Pressure",
            icon: Icons.bpIcon({
                Style: { color: Colors.darkPurple, fontSize: "24px" },
            }),
            val: 0,
            color: Colors.darkPurple,
            // val:
            // parseInt(props.data.ews_map?.rr) === -1
            //   ? "NA"
            //   : props.data.ews_map?.rr,
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
        },
    ]

    const [chartBlockData, setChartBlockData] = React.useState(arrDataChart);

    React.useEffect(() => {

    }, [props.data.ews_map, props.data.trend_map]);

    const getDataFromInFluxForSensor = () => {
        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const newArrChart = [...chartBlockData];

        for (let index = 0; index < newArrChart.length; index++) {
            const chart = newArrChart[index];
            chart.trendData = [];

            const query = `from(bucket: "emr_dev")
                            |> range(start: -6h)
                            |> filter(fn: (r) => r["_measurement"] == "${props.pid}_${chart?._key}")
                            |> yield(name: "mean")`;
        
            queryApi.queryRows(query, {
                next(row, tableMeta) {
                    const dataQueryInFlux = tableMeta?.toObject(row);
                    const measurement = dataQueryInFlux?._measurement?.split("_") || "";
                    const patientId = measurement?.[0] || "";

                    if (props.pid === patientId) {
                        // newArrChart.forEach(chart => {
                        //     if (chart.name === measurement?.[1]) {
                        //         chart.val = dataQueryInFlux?._value;
                        //         chart.trendData.push( {value: dataQueryInFlux?._value} );
                        //         if (chart.trendData?.length > 30) {
                        //             chart.trendData.splice(0, 1);
                        //         }
                        //     }
                        // })
                        if (chart._key === measurement?.[1]) {
                            chart.val = dataQueryInFlux?._value;
                            chart.trendData.push( {value: dataQueryInFlux?._value} );
                            if (chart.trendData?.length > 30) {
                                chart.trendData.splice(0, 1);
                            }
                        }
                    }
                    console.log('dataQueryInFlux', dataQueryInFlux);
                },
                error(error) {
                    console.error(error)
                    console.log('nFinished ERROR')
                },
                complete() {
                    console.log('nFinished SUCCESS');
                    setChartBlockData(newArrChart);
                },
            })
        } 
    }

    useEffect(() => {
        getDataFromInFluxForSensor();

        const timeInterval = setInterval(() => {
            getDataFromInFluxForSensor();
        }, 5000);

        return () => {
            clearInterval(timeInterval);
        }
    }, []);

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
        props.parentProps.history.push(`/dashboard/patient/details/${props.pid}`);
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
        // console.log(e);
        props.setPatientDetails({ patientDetails: props.data });
        props.setActive(props.pid);
        props.setShowTrend(false);
    };

    const BedDetailsSection = ({ width }) => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: width,
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "4em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {Icons.patientInBedIcon({
                    Style: { color: `${activeTheme}`, width: "2em" },
                })}
                <span
                    style={{
                        color: `${activeTheme}`,
                        fontWeight: "bold",
                        marginTop: "-0.3em",
                    }}
                >
                    {props.bedNumber}
                </span>
            </div>
            <div>
                <span
                    style={{
                        color: `${activeTheme}`,
                        opacity: "0.6",
                        letterSpacing: "1px",
                    }}
                >
                    MR: {props.data.demographic_map.med_record}
                    {/* MR: {props.data.med_record} */}
                </span>
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

    const ChartSection = ({ width }) => (
        <Row justify="space-around" gutter={2} style={{ width: width }}>
            {chartBlockData.map((item, i) => {
                if (i !== 0)
                    return (
                        <React.Fragment key={i}>
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
                                value={item.val}
                                chartData={item.trendData}
                                dataKey="value"
                                strokeColor={item.color}
                            />
                        </React.Fragment>
                    );
                else
                    return (
                        <ChartsBlock
                            key={i}
                            Icon={item.icon}
                            name={item.name}
                            value={item.val}
                            chartData={item.trendData}
                            dataKey="value"
                            strokeColor={item.color}
                        />
                    );
            })}
        </Row>
    );

    const CustomDivider = () => (
        <div
            style={{ width: "1px", background: `${border}`, height: "100%" }}
        ></div>
    );

    // const flexType = !props.showTrend ? span = { 4} : flex = { 1}
    if (props.patientType === "deboarded") {
        return (
            <div
                key={props.pid}
                style={
                    isElementClicked
                        ? { ...listStyle, ...selectedListItemBorder }
                        : { ...listStyle, ...listItemBorder }
                }
            >
                <BedDetailsSection width="10%" />
                <CustomDivider />
                <NameSection width="10%" />
                {/* <CustomDivider />
                <div
                    style={{
                        width: "20%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button onClick={pushToEdit} type="secondary">
                        Edit Patient
                    </Button>
                </div> */}
                <CustomDivider />
                <div
                    style={{
                        width: "12%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button onClick={openReport} type="secondary">
                        Report
                    </Button>
                </div>
            </div>
        );
    } else {
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
                    <div style={{ width: "2%" }}>
                        <Button
                            style={{ padding: "0em" }}
                            onClick={ShowPatientDetails}
                            type="secondary"
                        >
                            {Icons.infoCircleIcon({
                                Style: { width: "2em" },
                            })}
                        </Button>
                    </div>
                    <BedDetailsSection width="12%" />

                    <CustomDivider />
                    <NameSection width="10%" />

                    <CustomDivider />
                    <EwsSection width="5%" />

                    <CustomDivider />
                    <ChartSection width="70%" />
                </div>
            );
        } else {
            return (
                <React.Fragment key={props.pid}>
                    <div
                        style={
                            isElementClicked
                                ? { ...listStyle, ...selectedListItemBorder }
                                : { ...listStyle, ...listItemBorder }
                        }
                        onClick={pushToPatientDetails}
                    >
                        <div style={{ width: "5%" }}>
                            <Button
                                style={{ padding: "0em" }}
                                onClick={ShowPatientDetails}
                                type="secondary"
                            >
                                {Icons.infoCircleIcon({
                                    Style: { width: "2em" },
                                })}
                            </Button>
                        </div>

                        <BedDetailsSection width="20%" />

                        <CustomDivider />
                        <NameSection width="25%" />

                        <CustomDivider />
                        <EwsSection width="10%" />

                        <CustomDivider />
                        {/* eslint-disable-next-line */}
                        <div
                            onClick={(event) => {
                                event.stopPropagation();
                                setChartSectionVisibility(!isChartSectionVisible);
                            }}
                        >
                            <span>View Trends</span>
                        </div>

                        <CustomDivider />
                        <div onClick={ShowPatientDetails}>
                            <span>View Details</span>
                        </div>
                    </div>
                    <motion.div
                        style={
                            isElementClicked ? {
                                ...listStyle,
                                ...selectedListItemBorder,
                                position: "relative",
                                top: "-1.5rem",
                            } : {
                                ...listStyle,
                                ...listItemBorder,
                                position: "relative",
                                top: "-1.5rem",
                            }
                        }
                        initial={"hidden"}
                        animate={isChartSectionVisible ? "show" : "hidden"}
                        exit={"hidden"}
                        variants={variants}
                    >
                        <ChartSection width="100%" />
                    </motion.div>
                </React.Fragment>
            );
        }
    }
};

export { PatientListItem };
