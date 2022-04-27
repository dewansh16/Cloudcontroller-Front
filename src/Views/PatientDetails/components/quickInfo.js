import React, { useState, useEffect, useRef } from "react";
import { Row, Col, notification, Spin, Select } from "antd";
import InfoCard from "./infoCards";
import Icons from "../../../Utils/iconMap";
import Colors from "../../../Theme/Colors/colors";
import reportApi from "../../../Apis/reportApis";
import { RangePicker } from "../../../Theme/Components/DateTimePicker/dateTimePicker.js";
import moment from "moment";

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function QuickInfo({ pid, patient }) {
    const [chartInterval, setInterval] = useState(0);
    const [endDate, setEndDate] = useState(new Date().toISOString());
    const [startDate, setStartDate] = useState(
        new Date(new Date().getTime() - 24 * 3600 * 1000).toISOString()
    );
    const [hoursTag, setHoursTag] = useState(null);

    const today = new Date();
    const dt = new Date(today);
    dt.setDate(dt.getDate() - chartInterval);

    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        reportApi
            .getEachReportDataWithDuration(pid, startDate, endDate, hoursTag)
            .then((res) => {
                setData(res.data.response);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                const error = err.response?.data.result;
                if (err) {
                    notification.error({
                        message: "Error",
                        description: `${error}` || "",
                    });
                    setLoading(false);
                }
            });
    }, [hoursTag]);

    useInterval(() => {
        setLoading(true);
        reportApi
            .getEachReportDataWithDuration(pid, startDate, endDate, hoursTag)
            .then((res) => {
                console.log("api fired");
                setData(res.data.response);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                const error = err.response?.data.result;
                if (err) {
                    notification.error({
                        message: "Error",
                        description: `${error}` || "",
                    });
                    setLoading(false);
                }
            });
    }, 60000);

    // useEffect(() => {
    //   console.log("reportApi useEffects interval");
    //   const interval = setInterval(() => {
    //     reportApi
    //       .getEachReportDataWithDuration(pid, startDate, endDate, hoursTag)
    //       .then((res) => {
    //         console.log("api fired");
    //         setData(res.data.response);
    //         setLoading(false);
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //         const error = err.response?.data.result;
    //         if (err) {
    //           notification.error({
    //             message: "Error",
    //             description: `${error}` || "",
    //           });
    //           setLoading(false);
    //         }
    //       });
    //   }, 2000);
    //   return () => clearInterval(interval);
    // }, []);

    const [reqData, setReqData] = useState(null);
    let showTrends = false;

    const checkIsError = (arr) => {
        if (arr !== undefined) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value === -1) {
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        if (data !== null && data !== undefined) {
            setReqData([
                {
                    title: "Temperature",
                    icon: Icons.thermometerIcon({ Style: { color: Colors.yellow } }),
                    trendLine: data?.trend_map?.trend_map[1]?.temp.reverse(),
                    color: Colors.yellow,
                    unit: "F",
                    // min: data?.trend_map?.vitals_threshold[0]?.temp_min,
                    // max: data?.trend_map?.vitals_threshold[0]?.temp_max,
                    min: 93,
                    max: 98,
                    value: parseInt(patient?.ews_map?.temp),
                    isError: checkIsError(data?.trend_map?.trend_map[1]?.temp),
                },
                {
                    title: "SpO2",
                    icon: Icons.o2({ Style: { color: Colors.green } }),
                    trendLine: data?.trend_map?.trend_map[0]?.spo2.reverse(),
                    color: Colors.green,
                    unit: "%",
                    // min: data?.trend_map?.vitals_threshold[0]?.spo2_min,
                    // max: data?.trend_map?.vitals_threshold[0]?.spo2_max,
                    min: 95,
                    max: 100,
                    value: parseInt(patient?.ews_map?.spo2),
                    isError: checkIsError(data?.trend_map?.trend_map[0]?.spo2),
                },
                {
                    title: "Respiration Rate",
                    icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
                    trendLine: data?.trend_map?.trend_map[2]?.rr.reverse(),
                    color: Colors.orange,
                    unit: "bpm",
                    // min: data?.trend_map?.vitals_threshold[0]?.rr_min,
                    // max: data?.trend_map?.vitals_threshold[0]?.rr_max,
                    min: 19,
                    max: 25,
                    value: parseInt(patient?.ews_map?.rr),
                    isError: checkIsError(data?.trend_map?.trend_map[2]?.rr),
                },
                {
                    title: "Heart Rate",
                    icon: Icons.ecgIcon({ Style: { color: Colors.dangerOld } }),
                    trendLine: data?.trend_map?.trend_map[3]?.hr.reverse(),
                    color: Colors.dangerOld,
                    unit: "bpm",
                    // min: data?.trend_map?.vitals_threshold[0]?.hr_min,
                    // max: data?.trend_map?.vitals_threshold[0]?.hr_max,
                    min: 65,
                    max: 80,
                    value: parseInt(patient?.ews_map?.hr),
                    isError: checkIsError(data?.trend_map?.trend_map[3]?.hr),
                },
                {
                    title: "EWS",
                    icon: Icons.ecgIcon({ Style: { color: Colors.yellow } }),
                    trendLine: data?.trend_map?.trend_map[4]?.ews.reverse(),
                    color: Colors.yellow,
                    unit: "",
                    min: null,
                    max: null,
                    value: parseInt(patient?.ews_map?.ews),
                    isError: checkIsError(data?.trend_map?.trend_map[4]?.ews),
                },
            ]);
        }
    }, [data]);

    const changeInterval = (timeMoment) => {
        if (timeMoment !== null) {
            const startDate = new Date(
                moment(timeMoment[0], "MM-DD-YYYY HH:mm:ss").format()
            );
            const endDate = new Date(
                moment(timeMoment[1], "MM-DD-YYYY HH:mm:ss").format()
            );
            const milliseconds = Math.abs(endDate.getTime() - startDate.getTime());
            const hours = milliseconds / 36e5;
            setStartDate(startDate.toISOString());
            setEndDate(endDate.toISOString());
            switch (hours) {
                case 8:
                    setHoursTag(1);
                    break;
                case 12:
                    setHoursTag(2);
                    break;
                case 24:
                    setHoursTag(3);
                    break;
                case 48:
                    setHoursTag(4);
                    break;
                case 76:
                    setHoursTag(5);
                    break;
                case 168:
                    setHoursTag(6);
                    break;
                default:
                    return null;
            }

            if (hours <= 36) {
                setInterval(0);
            } else {
                setInterval(1);
            }
        } else {
            console.log(timeMoment);
        }
    };

    // console.log("patient Data from quicInfo", patient);
    if (reqData !== null) {
        reqData.map((item) => {
            if (item.isError === false) {
                showTrends = true;
            }
        });
    }
    // console.log(showTrends)
    // console.log(startDate, endDate, hoursTag);

    return (
        <>
            {!isLoading && (reqData === null || !showTrends) && (
                <div
                    style={{
                        position: "relative",
                        height: "500px",
                    }}
                >
                    <h1
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "3em",
                            opacity: "0.5",
                        }}
                    >
                        Trend not available
                    </h1>
                </div>
            )}
            {!isLoading && showTrends && (
                <Row>
                    <Col span={24}>
                        <Row style={{ marginBottom: "10px" }}>
                            <Col
                                span={22}
                                style={{ display: "flex", justifyContent: "flex-end" }}
                            >
                                <RangePicker
                                    defaultValue={[moment().subtract(24, "hours"), moment()]}
                                    onChange={changeInterval}
                                />
                            </Col>
                            <Col
                                span={2}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div>
                                    <h1 style={{ marginBottom: "0px", textAlign: "center" }}>
                                        Trends
                                    </h1>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Row span={24} gutter={[12, 8]} style={{ position: "relative" }}>
                        {reqData?.map((item, i) => (
                            <Col xs={24} lg={12} key={i}>
                                <InfoCard
                                    title={item.title}
                                    showTrends={showTrends}
                                    min={item.min}
                                    max={item.max}
                                    chartInterval={chartInterval}
                                    trendLine={item.trendLine}
                                    data={item.value}
                                    icon={item.icon}
                                    unit={item.unit}
                                    color={item.color}
                                />
                            </Col>
                        ))}
                    </Row>
                </Row>
            )}
            {isLoading && (
                <div
                    style={{
                        position: "relative",
                        height: "500px",
                    }}
                >
                    {" "}
                    <Spin
                        size="large"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </div>
            )}
        </>
    );
}
