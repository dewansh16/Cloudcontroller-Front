import React from "react";
import { Col, Divider, Tooltip } from "antd";
import { takeDecimalNumber } from "../../../../Utils/utils";
import SmallLineChart from "../../Charts/smallCharts/lineChart";
import moment from "moment";

export default function ChartsBlock({
    Icon,
    value,
    valueBpd,
    name,
    chartData,
    dataKey,
    strokeColor,
    span = [1, 1, 2],
    keyChart,
    lastTime
}) {
    const toolTipConfig = {
        // "Temperature": `${value}° F`,
        // // SPO2: `${value}`,
        // "Heart Rate": `${value} bpm`,
        // "Respiration Rate": `${value} bpm`,
        // "Weight": `${Math.round(value * 100) / 100} lbs`,
        // "Blood Pressure": `${value} - ${valueBpd} mmHg`
    };

    const styleTitle = {
        color: strokeColor,
        marginBottom: "0px",
    }

    const renderValueByKey = (key) => {
        switch (key) {
            case "temp":
                let celsius = 0;
                if (value !== 0) { celsius = 5 / 9 * (value - 32); }
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <h3 style={{
                                ...styleTitle
                            }}>{takeDecimalNumber(value)}</h3>
                            <h5 style={{
                                ...styleTitle,
                                fontWeight: "400"
                            }}>°F</h5>
                        </div>
                        <Divider style={{ margin: "0px" }} />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <h3 style={{
                                ...styleTitle
                            }}>{takeDecimalNumber(celsius)}</h3>
                            <h5 style={{
                                marginBottom: "0px",
                                color: strokeColor,
                                fontWeight: "400"
                            }}>°C</h5>
                        </div>
                    </div>
                )
            case "ecg_hr":
            case "ecg_rr":
                return (
                    <div>
                        <h3 style={{
                            ...styleTitle
                        }}>{takeDecimalNumber(value)}</h3>
                        <h5 style={{
                            ...styleTitle,
                            fontWeight: "400"
                        }}>bpm</h5>
                    </div>
                )
            case "blood_pressuer":
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <h3 style={{
                                ...styleTitle
                            }}>{takeDecimalNumber(value)}</h3>
                            <h5 style={{
                                ...styleTitle,
                                fontWeight: "400"
                            }}>mmHg</h5>
                        </div>
                        <Divider style={{ margin: "0px" }} />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <h3 style={{
                                ...styleTitle
                            }}>{takeDecimalNumber(valueBpd)}</h3>
                            <h5 style={{
                                marginBottom: "0px",
                                color: strokeColor,
                                fontWeight: "400"
                            }}>mmHg</h5>
                        </div>
                    </div>
                )

            case "weight":
                const lbs = value * 2.2046;
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <h3 style={{
                                ...styleTitle
                            }}>{takeDecimalNumber(value)}</h3>
                            <h5 style={{
                                ...styleTitle,
                                fontWeight: "400"
                            }}>kg</h5>
                        </div>
                        <Divider style={{ margin: "0px" }} />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <h3 style={{
                                ...styleTitle,
                            }}>{takeDecimalNumber(lbs)}</h3>
                            <h5 style={{
                                ...styleTitle,
                                fontWeight: "400"
                            }}>lbs</h5>
                        </div>
                    </div>
                )

            default:
                return (
                    <h3 style={{ color: strokeColor, marginBottom: "0px" }}>{takeDecimalNumber(value)}</h3>
                )
        }
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "80%" }}>
                    <Tooltip title={name}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: "0",
                                marginRight: keyChart === "blood_pressuer" ? "-3px" : "6px",
                                marginLeft: keyChart === "blood_pressuer" ? "-4px" : "0px",
                            }}
                        >
                            {Icon}
                        </div>
                    </Tooltip>
                    <Tooltip title={toolTipConfig[name]}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                maxWidth: "fit-content",
                                marginRight: "7px"
                            }}
                        >
                            {renderValueByKey(keyChart)}
                        </div>
                    </Tooltip>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%", height: "90%" }}>
                        <div style={{ width: "100%", height: "100%" }}>
                            <SmallLineChart
                                chartData={chartData}
                                dataKey={dataKey}
                                strokeColor={strokeColor}
                            />
                        </div>
                    </div>
                </div>
                {!!lastTime && (
                    <span style={{ fontSize: "12px", fontWeight: "400", color: strokeColor }}>
                        {moment(lastTime).format("MMM DD hh:mm:ss a")}
                    </span>
                )}
            </div>
        </>
    );
}
