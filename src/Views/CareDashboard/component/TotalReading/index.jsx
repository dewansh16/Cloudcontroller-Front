import React, { useState, useEffect } from 'react';

import { Spin } from 'antd';
import { queryApi } from "../../../../Utils/influx";

const TotalReading = ({ pid = "patient66750671-aadf-4012-bbf0-8db8c83fcf29", sensors=[{ key: "temp" }], patientList }) => {
    const [loading, setLoading] = useState(true);
    const [totalReding, setTotalReading] = useState(0);
    const [tempEffect, setTempEffect] = useState(0);
    const [associatedList, setAssociatedList] = useState(sensors);

    useEffect(() => {
        // const newArrAssociated = [...associatedList];
        associatedList.map(patch => {
            queryDataFromInflux(patch.key, patch)
        })
    }, [pid]);

    const queryDataFromInflux = (sensorType = "", patch) => {
        const currentDate = new Date();
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

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
                if (timeLocal.getDate() === currentDate.getDate()) {
                    arrayValueToday.push({ value, time })
                }

                // check data query yesterday
                const yesterday = new Date(currentDate.getDate() - 1);
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
                    patientList[0].yesterday = arrayValueToday;
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
        if (tempEffect === associatedList?.length) {
            let total = 0;
            console.log("------------------------------------", tempEffect, associatedList);
            associatedList.map(patch => {
                console.log("--- patch", patch);
                const totalValueInfux = patch?.totalValueInfux || [];
                total += totalValueInfux?.length || 0;
            })

            setTotalReading(total);
            setLoading(false);
        }
    }, [tempEffect, associatedList]);

    return (
        <>
            {loading ? (
                <Spin />
            ) : (
                <div>{totalReding}</div>
            )}
        </>

    );
}

export default TotalReading;
