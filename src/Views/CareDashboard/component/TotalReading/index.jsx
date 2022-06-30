import React, { useState, useEffect } from 'react';

import { Spin } from 'antd';
import { queryApi } from "../../../../Utils/influx";

const TotalReading = ({ pid = "patient66750671-aadf-4012-bbf0-8db8c83fcf29", associateList=["temp"] }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        associateList.map(patch => {
            queryDataFromInflux(new Date(), patch)
        })
    }, [pid]);

    const queryDataFromInflux = (startDate = "", sensorType = "") => {
        let start = new Date(startDate);
        const end = new Date();

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${sensorType}")
                |> yield(name: "mean")
            `
        const arrDateQuery = [];

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQuery = tableMeta.toObject(row);
                console.log("dataQuery", dataQuery);
            },
            error(error) {
                console.log('ERROR')
            },
            complete() {

            },
        })
    };

    return (
        <>
            {loading ? (
                <Spin />
            ) : (
                <div>
                    2
                </div>
            )}
        </>

    );
}

export default TotalReading;
