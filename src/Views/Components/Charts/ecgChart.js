import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import Icons from "../../../Utils/iconMap";
import Ecg from "../../../Apis/sockets/ecg";
import { Button } from "../../../Theme/Components/Button/button";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import * as htmlToImage from "html-to-image";
import { takeDecimalNumber } from "../../../Utils/utils";

import { io } from "socket.io-client";

export default function ECGChart({ pid, themeMode, ThemeButton }) {
    //FIXME: handle error using hasError
    const {
        // chartData,
        vitals,
        time,
        isPaused,
        setPaused,
        isLoading,
        isConnected,
        hasError,
    } = Ecg({ pid });

    const saveDataRef = useRef(null);

    // console.log("charData", chartData, "isLoading", isLoading);

    const chartData = [100, 200, 125, 113, 155, 199, 822, 456, 120, 354, 123, 233];

    const [dataNumberShow, setDataNumber] = useState({
        hr: 0,
        spo2: 0,
        rr: 0,
        tempinF: 0,
        pi: 0,
        pr: 0
    });

    useEffect(() => {
        var socket = io('http://20.230.234.202:7124', { transports: ['websocket', 'polling', 'flashsocket'] });

        socket.on("SENSOR_DATA_patiente9c617e0-4242-4828-ba08-66e8d4aa9009", function (data) {
            if (!!data) {
                console.log("---------------------- socket", data);
                setDataNumber({
                    ...saveDataRef.current,
                    ...data,
                });
            }
        })
    }, [pid]);

    useEffect(() => {
        saveDataRef.current = dataNumberShow;
    }, [dataNumberShow]);

    const chartOptions = {
        chart: {
            type: "spline",
            // animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            backgroundColor: "transparent",
        },
        title: {
            text: " ",
        },
        // plotOptions: {
        //     series: {
        //         animation: {
        //             duration: 5000,
        //         },
        //     },
        // },
        xAxis: {
            type: "time",
            tickAmount: 24,
            labels: {
                enabled: false,
            },
            gridLineDashStyle: "Solid",
            gridLineWidth: 1,
            gridLineColor: themeMode === "Light" ? "#E6909A" : "black",
            minorGridLineColor: themeMode === "Light" ? "#F8DEE1" : "black",
            minorGridLineDashStyle: "Solid",
            minorGridLineWidth: 1,
            minorTickColor: "#ffffff",
            minorTickLength: 0,
            minorTickPosition: "inside",
            minorTicks: true,
            minorTickWidth: 1,
            zoomEnabled: true,
            // min: 0,
            // max: 260,
        },
        yAxis: {
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: "#ffffff",
                },
            ],
            tickAmount: 10,
            gridLineDashStyle: "Solid",
            gridLineWidth: 1,
            gridLineColor: themeMode === "Light" ? "#E6909A" : "black",
            minorGridLineColor: themeMode === "Light" ? "#F8DEE1" : "black",
            minorGridLineDashStyle: "Solid",
            minorGridLineWidth: 1,
            minorTickColor: "#999999",
            minorTickLength: 0,
            minorTickPosition: "inside",
            minorTicks: true,
            minorTickWidth: 1,
            min: -1600,
            max: 1600,
            zoomEnabled: true,
            labels: {
                enabled: false,
            },
            title: {
                enabled: true,
                text: "Volts",
            },
        },
        panning: {
            enabled: true,
            type: "x",
        },
        tooltip: {
            formatter: function () {
                return (
                    "<b>" +
                    this.series.name +
                    "</b><br/>" +
                    Highcharts.numberFormat(this.x, 2) +
                    "<br/>" +
                    Highcharts.numberFormat(this.y, 2)
                );
            },
            followTouchMove: false,
        },
        legend: {
            enabled: false,
        },
        exporting: {
            enabled: true,
        },
        series: [
            {
                name: "ECG Data",
                color: themeMode === "Light" ? "black" : "green",
                dataLabels: {
                    enabled: false,
                },
                marker: {
                    enabled: false,
                },
                data: chartData,
            },
        ],
    };

    const labelStyle = {
        opacity: "0.7",
        fontWeight: "600",
        color: themeMode === "Light" ? "black" : "white",
    };

    const vitalInfoBarStyle = {
        margin: "0",
        // padding: "0em",
        border: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const digitStyle = {
        color: themeMode === "Light" ? "rgba(0,0,0,1)" : "white",
        fontFamily: "'Teko', sans-serif",
        fontWeight: "500",
        fontSize: "3.0em",
    };

    const cropNumbers = (num) => {
        return takeDecimalNumber(parseFloat(num));
    };

    const backProp =
        themeMode === "Light" ? { background: "white" } : { background: "black" };

    const onCapture = (id) => {
        htmlToImage
            .toJpeg(document.getElementById(id), { quality: 0.8 })
            .then(function (dataUrl) {
                var link = document.createElement("a");
                let newDate = new Date().toISOString();
                link.download = `ecg-${newDate}.jpeg`;
                link.href = dataUrl;
                link.click();
            });
    };
    return isLoading ? (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
            }}
        >
            <Spin></Spin>
        </div>
    ) : (
        <Row
            id="ecg-chart"
            span={24}
            gutter={[8]}
            style={{
                ...backProp,
                padding: "1em 0 1em 1em",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div
                style={{ position: "absolute", top: "1em", right: "2em", zIndex: "2" }}
            >
                {ThemeButton}
            </div>
            <Col span={6}>
                <Row
                    gutter={[8, 8]}
                    style={
                        themeMode === "Light"
                            ? {
                                padding: "0.6em",
                                background: "rgba(255, 255, 255, 0.3)",
                                boxShadow:
                                    "inset 0px 39px 56px -36px rgba(255, 255, 255, 0.5), inset 0px 4px 28px rgba(154, 146, 210, 0.3)",
                                backdropFilter: "blur(100px)",
                            }
                            : {
                                padding: "0.6em",
                                background: "rgba(255, 255, 255, 0.01)",
                                boxShadow:
                                    "inset 0px 39px 56px -36px rgba(255, 255, 255, 0.5), inset 0px 4px 18px rgba(154, 146, 210, 0.3)",
                                backdropFilter: "blur(100px)",
                            }
                    }
                >
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>HR</span>
                        <span style={digitStyle}>
                            {cropNumbers(dataNumberShow?.hr || 0)}
                            <span style={{ fontSize: "0.8rem", opacity: "0.8" }}> bpm</span>
                        </span>
                    </Col>
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>SPO2</span>
                        <span style={digitStyle}>
                            {cropNumbers(dataNumberShow?.spo2 || 0)}
                            <span style={{ fontSize: "0.8rem", opacity: "0.8" }}> %</span>
                        </span>
                    </Col>
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>RR</span>
                        <span style={digitStyle}>
                            {cropNumbers(dataNumberShow?.rr || 0)}
                            <span style={{ fontSize: "0.8rem", opacity: "0.8" }}> bpm</span>
                        </span>
                    </Col>
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>Temp</span>
                        <span style={digitStyle}>
                            {cropNumbers(dataNumberShow?.tempinF || 0)}
                            <span style={{ fontSize: "0.8rem", opacity: "0.8" }}> °F</span>
                        </span>
                    </Col>
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>PI</span>
                        <span style={digitStyle}>{cropNumbers(dataNumberShow?.pi || 0)}</span>
                    </Col>
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>PR</span>
                        <span style={digitStyle}>{cropNumbers(dataNumberShow?.pr || 0)}</span>
                    </Col>
                    <Col span={12}>
                        <span>Motion:</span> 
                        {/* {motion === "Sleeping" &&  */}
                        {/* {Icons.patientInBedIcon({ style: { fontSize: "1em" } })} */}
                        {vitals.motion === "Standing" && (
                            <span style={{ margin: "0 0 0 1em", width: "3em" }}>
                                {Icons.standing({
                                    Style: { fontSize: "1em", color: "red", height: "4em" },
                                })}
                            </span>
                        )}
                        {vitals.motion === "Sleeping" && (
                            <span
                                style={{ margin: "0 0 0 1em", width: "3em", height: "4em" }}
                            >
                                {Icons.patientInBedIcon({
                                    Style: { fontSize: "1em", color: "red" },
                                })}
                            </span>
                        )}
                        {vitals.motion === "Sitting" && (
                            <span
                                style={{ margin: "0 0 0 1em", width: "3em", height: "4em" }}
                            >
                                {Icons.sitting({ Style: { fontSize: "1em", color: "red" } })}
                            </span>
                        )}
                        {vitals.motion === "Motion" && (
                            <span
                                style={{ margin: "0 0 0 1em", width: "3em", height: "4em" }}
                            >
                                {Icons.running({ Style: { fontSize: "1em", color: "red" } })}
                            </span>
                        )}
                    </Col>
                    <Col span={12} style={vitalInfoBarStyle}>
                        <span style={labelStyle}>Pain</span>
                        <span style={digitStyle}>{5}</span>
                    </Col>
                </Row>
            </Col>
            <Col
                span={18}
                style={{
                    // minHeight: '300px',
                    height: "100%",
                    width: "100%",
                    background: themeMode === "Light" ? "white" : "black",
                }}
            >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                // oneToOne={true}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "5em",
                        /* right: 2em, */
                        width: "100%",
                        zIndex: "5",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        onClick={() => setPaused(!isPaused)}
                        type="secondary"
                        style={{
                            margin: "1em",
                            border: "1px solid rgba(240, 191, 43, 0.3)",
                            outline: "None",
                            height: "2.5em",
                            width: "2.5em",
                            padding: "0.3em 0 0 0",
                            background:
                                themeMode === "Light" ? "#FFFFFF" : "rgba(255, 255, 255, 0.01)",
                            boxShadow:
                                themeMode === "Light"
                                    ? "1px solid rgba(240, 191, 43, 0.3)"
                                    : "inset 0px 4px 18px rgba(247, 212, 106,0.2)",
                        }}
                    >
                        {!isPaused
                            ? Icons.pauseOutlined({
                                Style: { color: themeMode === "Light" ? "#FFFFFF" : "#000" },
                            })
                            : Icons.playFilled({
                                Style: { color: themeMode === "Light" ? "#FFFFFF" : "#000" },
                            })}
                    </Button>
                    {isPaused && (
                        <Button
                            onClick={() => onCapture("ecg-chart")}
                            type="secondary"
                            style={{
                                margin: "1em",
                                border: "1px solid rgba(240, 191, 43, 0.3)",
                                outline: "None",
                                height: "2.5em",
                                color: themeMode === "Light" ? "rgba(0,0,0, 1)" : "#FFFFFF",
                                background:
                                    themeMode === "Light"
                                        ? "#FFFFFF"
                                        : "rgba(255, 255, 255, 0.01)",
                                boxShadow:
                                    themeMode === "Light"
                                        ? "1px solid rgba(240, 191, 43, 0.3)"
                                        : "inset 0px 4px 18px rgba(247, 212, 106,0.2)",
                            }}
                        >
                            Snapshot
                        </Button>
                    )}
                </div>
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "1.2rem",
                            color: themeMode === "Light" ? "rgba(0,0,0, 1)" : "#FFFFFF",
                        }}
                    >
                        {time}
                    </h2>
                </div>
                {/* <ResponsiveContainer>
                    <LineChart data={chartData} style={{ background: "transparent" }}>
                        <Line type="monotone" animationDuration={12000} dataKey="y" stroke={themeMode === 'Light' ? "#000" : "green"} strokeWidth="3px" dot={false} isAnimationActive={true} />
                        <YAxis domain={[-2000, 2000]} tick={false} axisLine={false} hide={true} />
                    </LineChart>
                </ResponsiveContainer> */}
            </Col>
        </Row>
    );
}
