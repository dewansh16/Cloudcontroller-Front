import React, { useState, useEffect } from 'react';

import { Spin } from "antd";
import { queryApi } from "../../../../Utils/influx";
import moment from 'moment';

// import { InfluxDB } from "@influxdata/influxdb-client";

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

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${sensorType}_timestamp")
                |> yield(name: "mean")
            `
        const arrDateQuery = [];
        // let tepm = effect;

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                // let time = new Date(o._time);
                // time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
                // if (!arrDateQuery.includes(time)) {
                //     arrDateQuery.push(time);
                //     // tepm += 1;
                // }

                let time = new Date(o._value);

                if (
                    Number(time.getFullYear()) === Number(date.getFullYear())
                    && Number(time.getMonth()) === Number(date.getMonth())
                ) {
                    time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
                    if (!arrDateQuery.includes(time)) {
                        arrDateQuery.push(time);
                    }
                }
            },
            error(error) {
                console.log('ERROR', patch)
            },
            complete() {
                patch.total = arrDateQuery?.length;
                patch.datesInflux = arrDateQuery;
                const temp = setRunEffect + 1;
                setRunEffect(temp);
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
                return "ecg"
            case "alphamed":
                return "alphamed"
            case "ihealth":
                return "ihealth"

            default:
                break;
        }
    };

    function sortDate(a, b) {
        const first = new Date(a).getTime();
        const last = new Date(b).getTime();
        return (first > last) - (first < last)
    }

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

    const TOTAL_HOURS_FOR_EACH_SENSOR_BILLED = 16;

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

            totalArr?.sort(sortDate);

            let minDate = null;
            let maxDate = null;
            let totalDayMonitored = 0;

            totalArr = [...new Set(totalArr)];
            
            const timeFilter = new Date(valueDate);
            if (totalArr?.length > 0) {
                const firstDateMonitored = new Date(totalArr[0]);
                const lastDateMonitored = new Date(totalArr[totalArr?.length - 1]);
                // arrayTotalDate = arrayTotalDate?.concat(patch?.datesInflux);

                if (
                    Number(firstDateMonitored.getFullYear()) === Number(timeFilter.getFullYear())
                    && Number(firstDateMonitored.getMonth()) === Number(timeFilter.getMonth())
                ) {
                    if (minDate === null || minDate > firstDateMonitored) {
                        minDate = firstDateMonitored;
                    }

                    if (maxDate === null || maxDate < lastDateMonitored) {
                        maxDate = lastDateMonitored;
                    }
                }
            }

            if (minDate !== null && maxDate !== null) {
                // totalDayMonitored = numberOfNightsBetweenDates(new Date(minDate), new Date(maxDate));
                totalDayMonitored = totalArr?.length;
            }

            if (maxDate) {
                billFound.total = totalDayMonitored;
                billFound["99454"] = {
                    code: "99454",
                    date: maxDate,
                    desc: totalDayMonitored > 15 ? "1 billed" : "",
                    duration: `${totalDayMonitored} ${totalDayMonitored > 1 ? "days" : "day"}`,
                }
            }
           
            setTotalDay(totalDayMonitored);
            setLoading(false);
        }, 2000);

        return () => {
            clearTimeout(timer);
        }
    }, [pid, valueDate, effect]);

    const numberOfNightsBetweenDates = (start, end) => {
        let dayCount = 0;
        while (end >= start) {
            dayCount++;
            start.setDate(start.getDate() + 1);
        };

        return dayCount
    }

    return (
        <div>
            {loading ? (
                <Spin style={{ transform: "scale(0.8)", marginBottom: "-4px" }} />
            ) : (
                <>
                    {
                        totalDay > 0 && (
                            <div>{`${totalDay} ${totalDay > 1 ? "days" : "day"}`}</div>
                        )
                    }
                </>
            )}
        </div>
    );
}

export default CheckData;
