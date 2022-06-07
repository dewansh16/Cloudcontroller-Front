import React, { useState, useEffect } from 'react';

import { Spin } from "antd";
import { InfluxDB } from "@influxdata/influxdb-client";

const CheckData = ({ pid, sensorList, record, billingSummary }) => {
    const [loading, setLoading] = useState(true);
    const [totalDay, setTotalDay] = useState(0);
    const [effect, setRunEffect] = useState(0);

    const checkTotalNumberDateHaveDataFromInflux = (startDate = "", sensorType = "", patch) => {
        const start = new Date(startDate);
        const end = new Date();

        if (start.getTime() > end.getTime()) return;

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
                patch.total = arrDateQuery?.length;
                patch.datesInflux = arrDateQuery;

                let tepm = totalDay;
                tepm += arrDateQuery?.length;
                // setRunEffect(tepm);

                const billFound = billingSummary?.billings?.find(bill => bill?.pid === pid);
                if (!!billFound) {
                    billFound.total = tepm;
                }
                setTotalDay(tepm);
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

    const getFirstDateMonitored = (item) => {
        let result = '';
        if (item.duration) {
            let arrDur = item.duration.split(',');
            if (arrDur.length > 0) {
                result = arrDur[0];
            }
        }
        return result;
    }

    useEffect(() => {
        setLoading(true);
        if (sensorList?.length > 0) {
            sensorList?.forEach((patch) => {
                const startDate = getFirstDateMonitored(patch);
                const typeQuery = shortTypeQueryOfSensor(patch["patches.patch_type"]);
                if (!!startDate && !!typeQuery) {
                    checkTotalNumberDateHaveDataFromInflux(startDate, typeQuery, patch);
                }
            })
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [pid, billingSummary, sensorList]);

    // useEffect(() => {
    //     let total = 0;
    //     sensorList.forEach(patch => {
    //         if (!!patch?.totalDay && patch?.totalDay > 0) {
    //             total += patch?.totalDay;
    //         }
    //     });
    //     if (!!record) {
    //         record.total = total;
    //     }
    //     setTotalDay(total)
    // }, [effect]);

    return (
        <div>
            {loading ? (
                <Spin style={{ transform: "scale(0.8)", marginBottom: "-4px" }} />
            ) : (
                <>
                    {totalDay > 0 ? (
                        <div>{`${totalDay} ${totalDay > 1 ? "days" : "day"}`}</div>
                    ) : null}
                </>
            )}
        </div>
    );
}

export default CheckData;
