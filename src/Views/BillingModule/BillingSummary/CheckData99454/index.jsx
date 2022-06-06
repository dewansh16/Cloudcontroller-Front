import React, { useState, useEffect } from 'react';

import { Spin } from "antd";
import { InfluxDB } from "@influxdata/influxdb-client";

const CheckData = ({ pid, sensorList, duration }) => {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const checkTotalNumberDateHaveDataFromInflux = (startDate = "", sensorType = "", patch) => {
        const start = new Date(startDate);
        const end = new Date();

        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${sensorType}")
                |> yield(name: "mean")
            `
        const arrDateQuery = [];
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                let time = new Date(o._time);
                time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
                
                if (!arrDateQuery.includes(time)) {
                    arrDateQuery.push(time);
                }
            },
            error(error) {
                console.log('ERROR', patch)
            },
            complete() {
                // patch.totalDay = arrDateQuery?.length;
                // patch.datesInflux = arrDateQuery;
                // setTotal(totalDay);
            },
        })
    };

    const shortTypeQueryOfSensor = (patchType) => {
        switch (patchType) {
            case "temperature":
                return "temp"
            case "digital":
                return "weight"
            case "spo2":
                return "spo2"
            case "ecg":
                return "ecg_hr"
            case "alphamed":
                return "alphamed_bpd"
            case "ihealth":
                return "ihealth_bpd"

            default:
                break;
        }
    };

    useEffect(() => {
        setLoading(true);
        if (sensorList?.length > 0) {
            sensorList?.forEach((patch) => {
                const startDate = duration?.[0];
                const typeQuery = shortTypeQueryOfSensor(patch["patches.patch_type"]);
              
                if (!!startDate && !!typeQuery) {
                    checkTotalNumberDateHaveDataFromInflux(startDate, typeQuery, patch);
                }
            })
        }
        
        const timer = setTimeout(() => {
            setLoading(false);
        }, 750);

        return () => {
            clearTimeout(timer);
        }
    }, [pid]);

    return (
        <div>
            {loading ? (
                <Spin style={{ transform: "scale(0.8)", marginBottom: "-4px" }} />
            ) : (
                <>
                    {total > 0 ? (
                        <div>{`${total} ${total > 1 ? "days" : "day"}`}</div>
                    ) : null}
                </>
            )}
        </div>
    );
}

export default CheckData;
