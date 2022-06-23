import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import moment from "moment";
import { queryApi } from "../../../Utils/influx";

const GatewayStatus = ({ dataGateway = {} }) => {
    const [loading, setLoading] = useState(false);
    const [dataShow, setDataShow] = useState({});

    const processDataForSensor = (pid, key, time) => {
        let start = "-336h";
        if (key !== "gateway_keep_alive_time") {
            start = new Date(time).toISOString();
        }

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start})
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${key}")
                |> yield(name: "mean")`;

        let lastTime = null;
        let value = null;

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQueryInFlux = tableMeta?.toObject(row) || {};
                if (key === "gateway_keep_alive_time") {
                    value = dataQueryInFlux?._value;
                    lastTime = dataQueryInFlux?._time;
                }

                if (key === "gateway_battery") {
                    value = dataQueryInFlux?._value;
                }

                if (key === "gateway_version") {
                    value = dataQueryInFlux?._value;
                }
            },
            error(error) {
                console.error(error)
                console.log('nFinished ERROR')
            },
            complete() {
                dataGateway[key] = value;
                dataShow[key] = value;

                if (key === "gateway_keep_alive_time") {
                    processDataForSensor(pid, "gateway_version", lastTime);
                    setTimeout(() => {
                        processDataForSensor(pid, "gateway_battery", lastTime);
                    }, 250);
                }

                if (key === "gateway_battery") {
                    setDataShow({...dataShow});
                    setLoading(false);
                }
            },
        })
    }

    useEffect(() => {
        setLoading(true);
        const pid = dataGateway?.patch_patient_map?.pid || "";
        processDataForSensor(pid, "gateway_keep_alive_time");
    }, [dataGateway]);

    return (
        <>
            {loading ? (
                <Spin />
            ) : (
                <div>
                    {!!dataShow?.gateway_battery && (
                        <div style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "16px",
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                                Battery: 
                            </span>
                            <span style={{ fontWeight: "500", marginLeft: "2px" }}>
                                {dataShow?.gateway_battery}%
                            </span>
                        </div>
                    )}

                    {!!dataShow?.gateway_version && (
                        <div style={{
                            width: "100%",
                            textAlign: "center",
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                                Version: 
                            </span>
                            <span style={{ fontSize: "15px", fontWeight: "500", marginLeft: "2px" }}>
                                {dataShow?.gateway_version}
                            </span>
                        </div>
                    )}

                    {!!dataShow?.gateway_keep_alive_time && (
                        <div style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "16px",
                            display: "grid"
                        }}>
                            <span style={{ fontSize: "12px", color: "#000000ad", fontWeight: "400" }}>
                                Last received: 
                            </span>
                            <span style={{ fontSize: "15px", fontWeight: "500", marginLeft: "2px" }}>
                                {moment(dataShow?.gateway_keep_alive_time).format("MMM DD hh:mm:ss a")} 
                            </span>
                        </div>
                    )}
                </div>
            )}
        </>

    );
}

export default GatewayStatus;
