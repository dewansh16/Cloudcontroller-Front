import React from "react";
import { Col, Divider, Tooltip } from "antd";
import SmallLineChart from "../../Charts/smallCharts/lineChart";

export default function ChartsBlock({
    Icon,
    value,
    name,
    chartData,
    dataKey,
    strokeColor,
    span = [1, 1, 2],
}) {
    const toolTipConfig = {
        Temperature: `${value}° F`,
        SPO2: `${value} %`,
        "Heart Rate": `${value} bpm`,
        "Respiration Rate": `${value} bpm`,
        "Weight": `${value} kg`
    };

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
                    flex={1}
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
                    {name === "Blood Pressure" ? (
                        <div>
                            <h3
                                style={{
                                    color: strokeColor,
                                    marginBottom: "0px",
                                    textAlign: "center",
                                }}
                            >
                                {value}
                            </h3>
                            <Divider style={{ margin: "0px" }} />
                            <h3
                                style={{
                                    color: strokeColor,
                                    marginBottom: "0px",
                                    textAlign: "center",
                                }}
                            >
                                70
                            </h3>
                        </div>
                    ) : (
                        <h3 style={{ color: strokeColor }}>{value}</h3>
                    )}
                </Col>
            </Tooltip>
            {chartData && (
                <Col span={span[2]}>
                    <div style={{ width: "100%", height: "100%" }}>
                        <SmallLineChart
                            chartData={chartData}
                            dataKey={dataKey}
                            strokeColor={strokeColor}
                        />
                    </div>
                </Col>
            )}
        </>
    );
}
