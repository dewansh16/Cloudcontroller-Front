import { Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { queryApi } from '../../../../Utils/influx';

import "./styles.css";

const Sensors = ({ pid, associateList, valueDate, patientList }) => {
    const maxValue99454 = 16;

    const [sensors, setSensors] = useState({
        loading: false,
        dataSource: []
    });
    const [daysActive, setTotalDaysActive] = useState(maxValue99454);


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

    const checkTotalNumberDateHaveDataFromInflux = (startDate = "", sensorType = "", patch, temp) => {
        const date = new Date(valueDate);
        const firstDayOfMonth = new Date(date.setDate(1));
        firstDayOfMonth.setHours(0, 0, 1);

        let start = new Date(startDate);
        const end = new Date();     

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
                // console.log("dataQuery", dataQuery);

                // const value = dataQuery?._value;
                // const time = dataQuery?._time;

                let valueTimestamp = new Date(dataQuery._value);

                if (
                    Number(valueTimestamp.getFullYear()) === Number(date.getFullYear())
                    && Number(valueTimestamp.getMonth()) === Number(date.getMonth())
                ) {
                    const timeFormat = `${valueTimestamp.getFullYear()}-${valueTimestamp.getMonth() + 1}-${valueTimestamp.getDate()}`;

                     // check data query today
                    if (valueTimestamp.getDate() === date.getDate()) {
                        if (!arrayValueToday.includes(timeFormat)) {
                            arrayValueToday.push(timeFormat);
                        }
                    }
                    
                    // check data query yesterday
                    const yesterday = new Date(date.getDate() - 1);
                    if (valueTimestamp.getDate() === yesterday.getDate()) {
                        if (!arrayValueYesterday.includes(timeFormat)) {
                            arrayValueYesterday.push(timeFormat);
                        }
                    }

                    // push data for the month
                    if (!arrTotalValue.includes(timeFormat)) {
                        arrTotalValue.push(timeFormat);
                    }
                }
            },
            error(error) {
                console.log('ERROR');
                if (temp === associateList?.length) {
                    onUpdateDataSensor();
                }
            },
            complete() {
                patch.todays = arrayValueToday;
                patch.yesterday = arrayValueYesterday;
                patch.totalInMonth = arrTotalValue;

                if (temp === associateList?.length) {
                    onUpdateDataSensor();
                }
            },
        })
    };

    const onUpdateDataSensor = () => {
        const patientFound = patientList?.find(patient => patient?.pid === pid);
        if (!!patientFound) {
            let arrayDate = [];

            associateList.map(patch => {
                const totalInMonth = patch?.totalInMonth || [];
                arrayDate = [...arrayDate, ...totalInMonth];
            })

            arrayDate = [...new Set(arrayDate)];
            patientFound.arrTotalValue = arrayDate;
            
            const total = arrayDate?.length < maxValue99454 ? maxValue99454 - arrayDate?.length : 0;
            setTotalDaysActive(total);
        }

        setSensors({
            loading: false,
            dataSource: associateList
        });
    }

    useEffect(() => {
        if (associateList?.length > 0) {
            setSensors({
                ...sensors,
                loading: true,
            })

            let temp = 0;
            associateList.map(patchItem => {
                const startDate = getFirstDateMonitored(patchItem);
                const typeQuery = shortTypeQueryOfSensor(patchItem["patches.patch_type"]);
                temp += 1;
                if (!!startDate && !!typeQuery) {
                    checkTotalNumberDateHaveDataFromInflux(startDate, typeQuery, patchItem, temp);
                } else {
                    if (temp === associateList?.length) {
                        onUpdateDataSensor();
                    }
                }
            });
        }

        return () => { };
    }, [associateList, pid]);

    const isGateway = sensors?.dataSource?.some(patch => patch["patches.patch_type"] === "gateway");
    const widthLength = isGateway ? sensors?.dataSource?.length - 1 : sensors?.dataSource?.length;

    const renderItemReadingOfSensor = (propsRender) => {
        const { label = "", keyValue = 0 } = propsRender;

        return (
            <div className='body-item'>
                <div className='column first-column sensor-column'>{label}</div>

                {sensors?.dataSource?.map(patchItem => {
                    if (patchItem["patches.patch_type"] === "gateway") return null;

                    return (
                        <div 
                            key={`today-${patchItem["patches.patch_uuid"]}`}
                            style={{ width: `calc((100% - 150px) / ${widthLength})` }}
                            className="column sensor-column"
                        >
                            {patchItem?.[keyValue]?.length || 0}
                        </div>
                    )
                })}
            </div>
        )
    };

    return (
        <>
            {sensors?.loading ? (
                <>
                    <Spin />
                </>
            ) : (
                <div className="sensor-list">
                    <div className="sensor-list-thead">
                        <div className='column first-column'></div>
                        {sensors?.dataSource?.map(patchItem => {
                            if (patchItem["patches.patch_type"] === "gateway") return null; 

                            return (
                                <div 
                                    key={patchItem["patches.patch_uuid"]}
                                    style={{ width: `calc((100% - 150px) / ${widthLength})` }}
                                    className="column col-type-sensor"
                                >
                                    <span>{patchItem["patches.patch_type"]}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="sensor-list-tbody">
                        {renderItemReadingOfSensor({ label: "Reading today", keyValue: "todays" })}
                        {renderItemReadingOfSensor({ label: "Reading yesterday", keyValue: "yesterday" })}
                        {renderItemReadingOfSensor({ label: "Reading month", keyValue: "totalInMonth" })}
                        {renderItemReadingOfSensor({ label: "Days monitored", keyValue: "" })}
                        {daysActive !== 0 && (
                            <div style={{ paddingLeft: "150px", marginTop: "4px" }}>
                                Total days pending for 99454 to activate: 
                                <span style={{ color: "#ff7529", marginLeft: "4px" }}>
                                    {`${daysActive} ${daysActive > 1 ? "days" : "day"}`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Sensors;
