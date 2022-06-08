import React from "react";
import { Col, Divider, Tooltip } from "antd";
import { takeDecimalNumber } from "../../../../Utils/utils";
import SmallLineChart from "../../Charts/smallCharts/lineChart";

export default function ChartsBlock({
    Icon,
    value,
    valueBpd,
    name,
    chartData,
    dataKey,
    strokeColor,
    span = [1, 1, 2],
    keyChart
}) {
    const toolTipConfig = {
        // "Temperature": `${value}° F`,
        // // SPO2: `${value}`,
        // "Heart Rate": `${value} bpm`,
        // "Respiration Rate": `${value} bpm`,
        // "Weight": `${Math.round(value * 100) / 100} lbs`,
        // "Blood Pressure": `${value} - ${valueBpd} mmHg`
    };

    // const renderValueByKey = (key) => {
    //     switch (key) {
    //         case "temp":
    //             const celsius = 5 / 9 * (value - 32);
    //             return (
    //                 <div style={{ textAlign: "center", color: strokeColor }}>
    //                     <div>{`${takeDecimalNumber(value)}°F`}</div>
    //                     <Divider style={{ margin: "0px" }} />
    //                     <div>{`${takeDecimalNumber(celsius)}°C`}</div>
    //                 </div>
    //             )    
    //         case "blood_pressuer":
    //             return (
    //                 <div style={{ textAlign: "center", color: strokeColor }}>
    //                     <div>{`${takeDecimalNumber(value)}mmHg`}</div>
    //                     <Divider style={{ margin: "0px" }} />
    //                     <div>{`${takeDecimalNumber(valueBpd)}mmHg`}</div>
    //                 </div>
    //             )               
        
    //         default:
    //             break;
    //     }
    // };

    return (
        <>
            <Tooltip title={name}>
                <Col
                    span={span[0]}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    flex={0.5}
                >
                    {Icon}
                </Col>
            </Tooltip>
            <Tooltip title={toolTipConfig[name]}>
                <Col
                    span={span[1]}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    flex={1}
                >
                    {/* {renderValueByKey(keyChart)} */}
                    {name === "Blood Pressure" ? (
                        <div>
                            <h3
                                style={{
                                    color: strokeColor,
                                    marginBottom: "0px",
                                    textAlign: "center",
                                }}
                            >
                                {takeDecimalNumber(value)}
                            </h3>
                            <Divider style={{ margin: "0px" }} />
                            <h3
                                style={{
                                    color: strokeColor,
                                    marginBottom: "0px",
                                    textAlign: "center",
                                }}
                            >
                                {takeDecimalNumber(valueBpd)}
                            </h3>
                        </div>
                    ) : (
                        <h3 style={{ color: strokeColor }}>{takeDecimalNumber(value)}</h3>
                    )}
                </Col>
            </Tooltip>
            <Col span={span[2]} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", height: "100%", marginBottom: `${keyChart === "alphamed_bps" ? "-20px" : "0px"}` }}>
                    <SmallLineChart
                        chartData={chartData}
                        dataKey={dataKey}
                        strokeColor={strokeColor}
                    />
                </div>
            </Col>
        </>
    );
}
