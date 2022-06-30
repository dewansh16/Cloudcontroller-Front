import React, { useState, useEffect } from 'react';

import { Spin } from 'antd';
import { queryApi } from "../../../../Utils/influx";

const TotalReading = ({ pid = "patient66750671-aadf-4012-bbf0-8db8c83fcf29", sensors=[{ key: "temp" }], patientList, valueDate }) => {
    const [totalReading, setTotalReading] = useState({
        total: 0,
        loading: true,
    });
    const [tempEffect, setTempEffect] = useState(0);
    const [associatedList, setAssociatedList] = useState(sensors);

    useEffect(() => {
        associatedList.map(patch => {
            queryDataFromInflux(patch.key, patch)
        })
    }, [pid]);

    const queryDataFromInflux = (sensorType = "", patch) => {
        const dateFilter = new Date(valueDate);
        const start = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), 1);
        const end = new Date(dateFilter.getFullYear(), dateFilter.getMonth() + 1, 0, 23, 59, 59);

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${sensorType}")
                |> yield(name: "mean")
            `
        const arrTotalValue = [];
        const arrayValueToday = [];
        const arrayValueYesterday = [];

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQuery = tableMeta.toObject(row);
                const value = dataQuery?._value;
                const time = dataQuery?._time;

                console.log("dataQuery", dataQuery);

                // check data query today
                const timeLocal = new Date(time);
                if (timeLocal.getDate() === dateFilter.getDate()) {
                    arrayValueToday.push({ value, time })
                }

                // check data query yesterday
                const yesterday = new Date(dateFilter.getDate() - 1);
                if (timeLocal.getDate() === yesterday.getDate()) {
                    arrayValueYesterday.push({ value, time })
                }

                // push data for the month
                arrTotalValue.push({ value, time });
            },
            error(error) {
                console.log('ERROR')
            },
            complete() {
                const patientFound = patientList?.filter(patient => patient?.pid === pid);
                if (!!patientFound) {
                    patientList[0].todays = arrayValueToday;
                    patientList[0].yesterday = arrayValueYesterday;
                    patientList[0].totalValueInfux = arrayValueToday;
                }

                // patch.todays = arrayValueToday;
                // patch.yesterday = arrayValueYesterday;
                patch.totalValueInfux = arrTotalValue;

                let temp = tempEffect;
                temp += 1;
                setTempEffect(temp);
            },
        })
    };

    useEffect(() => {
        let mounted = true;

        if (tempEffect === associatedList?.length && mounted) {
            let total = 0;

            associatedList.map(patch => {
                const totalValueInfux = patch?.totalValueInfux || [];
                total += totalValueInfux?.length || 0;
            })

            setTotalReading({
                total: total,
                loading: false,
            });
        }

        return () => { mounted = false; };
    }, [tempEffect, associatedList]);

    return (
        <>
            {totalReading?.loading ? (
                <Spin />
            ) : (
                <div>{`${totalReading?.total} ${totalReading?.total > `` ? 'days' : 'day'}`}</div>
            )}
        </>

    );
}

export default TotalReading;
