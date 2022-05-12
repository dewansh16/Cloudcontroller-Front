import React from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

import { Row, Col, Divider, Grid, Tooltip } from "antd";
import Colors from "../../../Theme/Colors/colors";
import Icons from "../../../Utils/iconMap";
import ChartsBlock from "./listComponent/chartsBlock";
import { Button } from "../../../Theme/Components/Button/button";
const { useBreakpoint } = Grid;

const PatientListItem = (props) => {
    const screens = useBreakpoint();

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

    const [chartBlockData, setChartBlockData] = React.useState([]);

    const [isChartSectionVisible, setChartSectionVisibility] = React.useState(false);

    React.useEffect(() => {
        // var socket = io('http://localhost:3033', { transports: ['websocket', 'polling', 'flashsocket'] });
        // socket.on('SOCKET_CHANGE', function (data) {
        //     console.log("data", data)
        // })
    }, []);

    React.useEffect(() => {
        setChartBlockData([
            {
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
                name: "Weight",
                icon: Icons.bpIcon({
                    Style: { color: Colors.yellow, fontSize: "24px" },
                }),
                val: 0,
                color: Colors.yellow,
            },
        ]);
    }, [props.data.ews_map, props.data.trend_map]);

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
