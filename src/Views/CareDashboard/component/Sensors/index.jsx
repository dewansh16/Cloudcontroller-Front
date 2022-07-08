import React, { useState, useEffect } from 'react';
import { queryApi } from '../../../../Utils/influx';

const Sensors = ({ pid, associateList, valueDate }) => {
    console.log("associateList", associateList, pid);
    const [tempEffect, setTempEffect] = useState(0);

    

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
        const arrTotalValue = [];
        const arrayValueToday = [];
        const arrayValueYesterday = [];

        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQuery = tableMeta.toObject(row);
                const value = dataQuery?._value;
                const time = dataQuery?._time;

                // console.log("dataQuery", dataQuery);

                // check data query today
                const timeLocal = new Date(time);
                if (timeLocal.getDate() === date.getDate()) {
                    arrayValueToday.push({ value, time })
                }

                // check data query yesterday
                const yesterday = new Date(date.getDate() - 1);
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
        if (associateList?.length > 0) {
            associateList.map(patchItem => {
                const startDate = getFirstDateMonitored(patchItem);
                const typeQuery = shortTypeQueryOfSensor(patchItem["patches.patch_type"]);
                if (!!startDate && !!typeQuery) {
                    checkTotalNumberDateHaveDataFromInflux(startDate, typeQuery, patchItem);
                }
            });
        }

        return () => { };
    }, [associateList, pid]);

    useEffect(() => {
        let mounted = true;

        if (tempEffect === associateList?.length && mounted) {
            let arrayDate = [];

            associateList.map(patch => {
                const totalValueInfux = patch?.totalValueInfux || [];
                totalValueInfux.map(item => {
                    let timer = new Date(item?.time);
                    timer = `${timer.getFullYear()}-${timer.getMonth() + 1}-${timer.getDate()}`;
                    arrayDate.push(timer);
                })
            })

            arrayDate = [...new Set(arrayDate)];
            // patientList[0].totalValueInfux = arrayDate;
            console.log("arrayDate", arrayDate);
        }


        return () => { mounted = false; };
    }, [tempEffect, associateList]);

    return (
        <div>
            a
        </div>
    );
}

export default Sensors;
