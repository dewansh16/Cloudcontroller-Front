import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { InfluxDB } from "@influxdata/influxdb-client";

import Colors from "../../../Theme/Colors/colors";
import Icons from "../../../Utils/iconMap";
import VitalGraphs from "./vitalGraphs.patientJourney";

// import { arrDataChart } from "../../arrayChart";

import "./vitals.patientJourney.css";

function Vitals({ activeStep, wardArray, patient, pid }) {
    // console.log("Vitals", arrDataChart);
    const [stepArray, setStepArray] = useState(wardArray);

    useEffect(() => {
        setStepArray(wardArray);
    }, [wardArray]);

    const editWardName = (step) => {
        if (step?.name === undefined) {
            return null;
        } else if (step?.name.length > 12) return step?.name.slice(0, 12) + ".";
        else return step?.name;
    };

    const heading = (name) => {
        switch (name) {
            case "temp": {
                return "Temperature";
            }
            case "spo2": {
                return "SPO2";
            }
            case "rr": {
                return "Respiration Rate";
            }
            case "hr": {
                return "Heart Rate";
            }
            case "bph": {
                return "Bloop Pressure";
            }
        }
    };

    const configBloodPressure = (item) => {
        if (item === null || item === undefined) return null;
        if (item?.deviceData?.bph === null && item?.deviceData?.bpl === null) {
            return null;
        } else {
            return item?.deviceData?.bph + " / " + item?.deviceData?.bpl;
        }
    };

    const columns = [
        {
            width: "40%",
            title: (
                <div
                    style={{
                        fontFamily: "Lexend",
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "#727272",
                    }}
                >
                    Vitals
                </div>
            ),
            dataIndex: "name",
            key: "name",
        },
        {
            width: "30%",
            title: (
                <div
                    style={{
                        textAlign: "center",
                        fontFamily: "Lexend",
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "#727272",
                    }}
                >
                    {editWardName(stepArray[activeStep])}
                </div>
            ),
            dataIndex: "prevWard",
            key: "access",
        },
        {
            width: "30%",
            title: (
                <div
                    style={{
                        textAlign: "center",
                        fontFamily: "Lexend",
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "#727272",
                    }}
                >
                    {editWardName(stepArray[activeStep + 1])}
                </div>
            ),
            dataIndex: "nextWard",
            key: "access",
        },
    ];

    const [tableData, setTableData] = useState([
        {
            key: "11",
            name: (
                <div className="vital-tables-row-name">
                    <p>Temperature</p>
                </div>
            ),
            prevWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep]?.deviceData?.temp}</p>
                </div>
            ),
            nextWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep + 1]?.deviceData?.temp}</p>
                </div>
            ),
        },
        {
            key: "12",
            name: (
                <div className="vital-tables-row-name">
                    <p>Heart Rate</p>
                </div>
            ),
            prevWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep]?.deviceData?.hr}</p>
                </div>
            ),
            nextWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep + 1]?.deviceData?.hr}</p>
                </div>
            ),
        },
        {
            key: "13",
            name: (
                <div className="vital-tables-row-name">
                    <p>SPO2</p>
                </div>
            ),
            prevWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep]?.deviceData?.spo2}</p>
                </div>
            ),
            nextWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep + 1]?.deviceData?.spo2}</p>
                </div>
            ),
        },
        {
            key: "14",
            name: (
                <div className="vital-tables-row-name">
                    <p>Blood Pressure</p>
                </div>
            ),
            prevWard: (
                <div className="vital-table-values">
                    <p>{configBloodPressure(stepArray[activeStep])}</p>
                </div>
            ),
            nextWard: (
                <div className="vital-table-values">
                    <p>{configBloodPressure(stepArray[activeStep + 1])}</p>
                </div>
            ),
        },
        {
            key: "15",
            name: (
                <div className="vital-tables-row-name">
                    <p>Respiration Rate</p>
                </div>
            ),
            prevWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep]?.deviceData?.rr}</p>
                </div>
            ),
            nextWard: (
                <div className="vital-table-values">
                    <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p>
                </div>
            ),
        },
        {
            key: "16",
            name: (
                <div className="vital-tables-row-name">
                    <p>Weight</p>
                </div>
            ),
            prevWard: (
                <div className="vital-table-values">
                    {/* <p>{stepArray[activeStep]?.deviceData?.rr}</p> */}
                </div>
            ),
            nextWard: (
                <div className="vital-table-values">
                    {/* <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p> */}
                </div>
            ),
        },
    ]);

    useEffect(() => {
        setTableData([
            {
                key: "11",
                name: (
                    <div className="vital-tables-row-name">
                        <p>Temperature</p>
                    </div>
                ),
                prevWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep]?.deviceData?.temp}</p>
                    </div>
                ),
                nextWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep + 1]?.deviceData?.temp}</p>
                    </div>
                ),
            },
            {
                key: "12",
                name: (
                    <div className="vital-tables-row-name">
                        <p>Heart Rate</p>
                    </div>
                ),
                prevWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep]?.deviceData?.hr}</p>
                    </div>
                ),
                nextWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep + 1]?.deviceData?.hr}</p>
                    </div>
                ),
            },
            {
                key: "13",
                name: (
                    <div className="vital-tables-row-name">
                        <p>SPO2</p>
                    </div>
                ),
                prevWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep]?.deviceData?.spo2}</p>
                    </div>
                ),
                nextWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep + 1]?.deviceData?.spo2}</p>
                    </div>
                ),
            },
            {
                key: "14",
                name: (
                    <div className="vital-tables-row-name">
                        <p>Blood Pressure</p>
                    </div>
                ),
                prevWard: (
                    <div className="vital-table-values">
                        <p>{configBloodPressure(stepArray[activeStep])}</p>
                    </div>
                ),
                nextWard: (
                    <div className="vital-table-values">
                        <p>{configBloodPressure(stepArray[activeStep + 1])}</p>
                    </div>
                ),
            },
            {
                key: "15",
                name: (
                    <div className="vital-tables-row-name">
                        <p>Respiration Rate</p>
                    </div>
                ),
                prevWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep]?.deviceData?.rr}</p>
                    </div>
                ),
                nextWard: (
                    <div className="vital-table-values">
                        <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p>
                    </div>
                ),
            },
            {
                key: "16",
                name: (
                    <div className="vital-tables-row-name">
                        <p>Weight</p>
                    </div>
                ),
                prevWard: (
                    <div className="vital-table-values">
                        {/* <p>{stepArray[activeStep]?.deviceData?.rr}</p> */}
                    </div>
                ),
                nextWard: (
                    <div className="vital-table-values">
                        {/* <p>{stepArray[activeStep + 1]?.deviceData?.rr}</p> */}
                    </div>
                ),
            },
        ]);
    }, [activeStep, stepArray]);

    const arrDataChart = [
        {
            _key: 'temp',
            name: "Temperature",
            icon: Icons.thermometerIcon({ Style: { color: Colors.purple } }),
            val: 0,
            color: Colors.purple,
            trendData: []
        },
        {
            _key: 'spo2',
            name: "SPO2",
            icon: Icons.o2({ Style: { color: Colors.green } }),
            val: 0,
            color: Colors.green,
            trendData: []
        },
        {
            _key: 'ecg_hr',
            name: "Heart Rate",
            icon:  Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
            val: 0,
            color: Colors.darkPink,
            trendData: []
        },
        {
            _key: 'ecg_rr',
            name: "Respiration Rate",
            icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
            val: 0,
            color: Colors.orange,
            trendData: []
        },
        {
            _key: "blood_pressuer",
            name: "Blood Pressure",
            icon: Icons.bloodPressure({ Style: { color: Colors.darkPurple, transform: 'scale(0.75)' } }),
            val: 0,
            val_bpd: 0,
            color: Colors.darkPurple,
            trendData: []
        },
        {
            _key: 'weight',
            name: "Weight",
            icon: Icons.bpIcon({
                Style: { color: Colors.yellow, fontSize: "24px" },
            }),
            val: 0,
            color: Colors.yellow,
            trendData: []
        },
    ]

    const [chartBlockData, setChartBlockData] = React.useState(arrDataChart);

    const processDataForSensor = (key, newArrChart, chart) => {
        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const query = `from(bucket: "emr_dev")
                |> range(start: -48h)
                |> filter(fn: (r) => r["_measurement"] == "${pid}_${key}")
                |> yield(name: "mean")`;

        const arrayRes = [];
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const dataQueryInFlux = tableMeta?.toObject(row) || {};
                if (key === "alphamed_bpd" || key === "ihealth_bpd") {
                    chart.val_bpd = dataQueryInFlux?._value;
                } else {
                    let value = dataQueryInFlux?._value || 0;
                    if (key === "weight") {
                        value = value * 2.2046
                    }
                    arrayRes.push({ value });
                }
            },
            error(error) {
                console.error(error)
                console.log('nFinished ERROR')
            },
            complete() {
                // console.log('nFinished SUCCESS');
                if (key !== "alphamed_bpd" && key !== "ihealth_bpd") {
                    chart.trendData = arrayRes || [];
                    chart.val = arrayRes[arrayRes.length - 1]?.value || 0;
                    setChartBlockData([...newArrChart]);
                }
            },
        })
    }

    const getDataSensorFromInfluxDB = () => {
        let associatedList = [];

        // const isString = isJsonString(props?.data?.demographic_map?.associated_list);
        // if (isString) {
        //     associatedList = JSON.parse(props?.data?.demographic_map?.associated_list);
        // }

        const newArrChart = [...arrDataChart];
        for (let index = 0; index < newArrChart.length; index++) {
            const chart = newArrChart[index];

            const key = chart?._key;
            if (key !== "blood_pressuer") {
                processDataForSensor(key, newArrChart, chart)
            } else {
                let arrKeyChild = [];
                if (associatedList?.includes("alphamed")) {
                    arrKeyChild = ["alphamed_bpd", "alphamed_bps"];
                } else {
                    arrKeyChild = ["ihealth_bpd", "ihealth_bps"];
                }

                for (let j = 0; j < arrKeyChild.length; j++) {
                    processDataForSensor(arrKeyChild[j], newArrChart, chart);
                }
            }
        }
    };

    // useEffect(() => {
    //     getDataSensorFromInfluxDB();

    //     const timeInterval = setInterval(() => {
    //         getDataSensorFromInfluxDB();
    //     }, 10000);

    //     return () => {
    //         clearInterval(timeInterval);
    //     }
    // }, [props.dataFilterOnHeader]);
    
    // React.useEffect(() => {
    //     const dummyBPData = patient.trend_map[1]?.temp?.map((item) => {
    //         return {
    //             date: item.date,
    //             value: 50 + Math.floor(Math.random() * 30),
    //             // value: item.value,
    //         };
    //     });
    //     setChartBlockData([
    //         {
    //             name: "Temperature",
    //             icon: Icons.thermometerIcon({
    //                 Style: { color: Colors.purple },
    //             }),
    //             val:
    //                 parseInt(patient.ews_map?.temp) === -1 ? "NA" : patient.ews_map?.temp,
    //             trendData: patient.trend_map[1]?.temp?.reverse(),
    //             color: Colors.purple,
    //         },
    //         {
    //             name: "SPO2",
    //             icon: Icons.o2({ Style: { color: Colors.green } }),
    //             val:
    //                 parseInt(patient.ews_map?.spo2) === -1 ? "NA" : patient.ews_map?.spo2,
    //             trendData: patient.trend_map[0]?.spo2?.reverse(),
    //             color: Colors.green,
    //         },
    //         {
    //             name: "Heart Rate",
    //             icon: Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
    //             val: parseInt(patient.ews_map?.hr) === -1 ? "NA" : patient.ews_map?.hr,
    //             trendData: patient.trend_map[3]?.hr?.reverse(),
    //             color: Colors.darkPink,
    //         },
    //         {
    //             name: "Respiration Rate",
    //             icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
    //             val: parseInt(patient.ews_map?.rr) === -1 ? "NA" : patient.ews_map?.rr,
    //             trendData: patient.trend_map[2]?.rr?.reverse(),
    //             color: Colors.orange,
    //         },
    //         {
    //             name: "Blood Pressure",
    //             icon: Icons.bpIcon({
    //                 Style: { color: Colors.darkPurple, fontSize: "24px" },
    //             }),
    //             val:
    //             parseInt(patient.ews_map?.rr) === -1
    //               ? "NA"
    //               : patient.ews_map?.rr,
    //             trendData: dummyBPData,
    //             color: Colors.darkPurple,
    //         },
    //         {
    //             name: "Weight",
    //             icon: Icons.bpIcon({
    //                 Style: { color: Colors.yellow, fontSize: "24px" },
    //             }),
    //             val:
    //             parseInt(patient.ews_map?.rr) === -1
    //               ? "NA"
    //               : patient.ews_map?.rr,
    //             color: Colors.yellow,
    //         },
    //     ]);
    // }, []);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div className="vitals-body">
                <div className="vitals-table">
                    <div style={{ width: "100%" }}>
                        <Table
                            size="small"
                            className="vital-table"
                            columns={columns}
                            dataSource={tableData}
                            pagination={false}
                            bordered
                        />
                    </div>
                </div>
                <div className="vitals-graphs-section">
                    {chartBlockData.map((item, index) => {
                        return <VitalGraphs item={item} key={index} />;
                    })}
                </div>
            </div>
        </div>
    );
}

export default Vitals;
