import React, { useState, useEffect } from 'react';

import { Spin } from "antd";
import { InfluxDB } from "@influxdata/influxdb-client";

const CheckData = ({ pid, sensorList, record, billingSummary, valueDate }) => {
    const [loading, setLoading] = useState(false);
    const [totalDay, setTotalDay] = useState(0);
    const [effect, setRunEffect] = useState(0);

    // console.log("pid", pid);

    const checkTotalNumberDateHaveDataFromInflux = (startDate = "", sensorType = "", patch) => {
        const date = new Date(valueDate);
        const firstDayOfMonth = new Date(date.setDate(1));
        firstDayOfMonth.setHours(0, 0, 1);

        let start = new Date(startDate);
        const end = new Date();

        if (start.getTime() > end.getTime()) return;

        if (start?.getTime() < firstDayOfMonth?.getTime()) {
            start = firstDayOfMonth;
        }

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
        // let tepm = effect;

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                let time = new Date(o._time);
                time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
                if (!arrDateQuery.includes(time)) {
                    arrDateQuery.push(time);
                    // tepm += 1;
                }
            },
            error(error) {
                console.log('ERROR', patch)
            },
            complete() {
                patch.total = arrDateQuery?.length;
                patch.datesInflux = arrDateQuery;

                // setRunEffect(tepm);

                // const billFound = billingSummary?.billings?.find(bill => bill?.pid === pid);
                // if (!!billFound) {
                //     let tepm = totalDay;
                //     tepm += arrDateQuery?.length;

                //     billFound.total = tepm;
                //     setTotalDay(tepm);
                // }
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
        setTotalDay(0);
        
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
            const billFound = billingSummary?.billings?.find(bill => bill?.pid === pid);
            let totalArr = [];
            sensorList.forEach(patch => {
                if (!!patch?.total && patch?.total > 0) {
                    totalArr = [...totalArr, ...patch?.datesInflux];
                }
            });

            let result = [];
            result = totalArr.filter(function (element) {
                return result.includes(element) ? '' : result.push(element)
            });

            const total = result?.length;
            billFound.total = total;
            setTotalDay(total);
            setLoading(false);
        }, 1250);

        return () => {
            clearTimeout(timer);
        }
    }, [pid, valueDate]);


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
