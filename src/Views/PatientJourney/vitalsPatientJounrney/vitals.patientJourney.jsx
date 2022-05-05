import { Table } from "antd";
import React, { useState, useEffect } from "react";
import "./vitals.patientJourney.css";
import Colors from "../../../Theme/Colors/colors";
import Icons from "../../../Utils/iconMap";
import VitalGraphs from "./vitalGraphs.patientJourney";

function Vitals({ activeStep, wardArray, patient }) {
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

    const demoChartData = [
        {
            date: "2021-10-03T17:20:01.000Z",
            value: "86",
        },
        {
            date: "2021-10-03T17:05:01.000Z",
            value: "95",
        },
        {
            date: "2021-10-03T16:50:01.000Z",
            value: "90",
        },
        {
            date: "2021-10-03T16:35:01.000Z",
            value: "89",
        },
        {
            date: "2021-10-03T16:20:01.000Z",
            value: "88",
        },
        {
            date: "2021-10-03T16:05:01.000Z",
            value: "87",
        },
        {
            date: "2021-10-03T15:50:01.000Z",
            value: "85",
        },
        {
            date: "2021-10-03T15:35:01.000Z",
            value: "80",
        },
        {
            date: "2021-10-03T15:20:01.000Z",
            value: "89",
        },
        {
            date: "2021-10-03T15:05:01.000Z",
            value: "90",
        },
        {
            date: "2021-10-03T14:50:01.000Z",
            value: "96",
        },
        {
            date: "2021-10-03T14:35:01.000Z",
            value: "95",
        },
        {
            date: "2021-10-03T14:20:01.000Z",
            value: "88",
        },
        {
            date: "2021-10-03T14:05:01.000Z",
            value: "92",
        },
        {
            date: "2021-10-03T13:50:01.000Z",
            value: "85",
        },
        {
            date: "2021-10-03T13:35:01.000Z",
            value: "84",
        },
        {
            date: "2021-10-03T13:20:01.000Z",
            value: "80",
        },
        {
            date: "2021-10-03T13:05:01.000Z",
            value: "79",
        },
        {
            date: "2021-10-03T12:50:01.000Z",
            value: "75",
        },
        {
            date: "2021-10-03T12:35:01.000Z",
            value: "80",
        },
        {
            date: "2021-10-03T12:20:01.000Z",
            value: "88",
        },
        {
            date: "2021-10-03T12:05:01.000Z",
            value: "89",
        },
        {
            date: "2021-10-03T11:50:01.000Z",
            value: "90",
        },
        {
            date: "2021-10-03T11:35:01.000Z",
            value: "92",
        },
        {
            date: "2021-10-03T11:20:01.000Z",
            value: "96",
        },
        {
            date: "2021-10-03T11:05:01.000Z",
            value: "94",
        },
        {
            date: "2021-10-03T10:50:01.000Z",
            value: "95",
        },
        {
            date: "2021-10-03T10:35:01.000Z",
            value: "92",
        },
        {
            date: "2021-10-03T10:20:01.000Z",
            value: "86",
        },
        {
            date: "2021-10-03T10:05:01.000Z",
            value: "97",
        },
        {
            date: "2021-10-03T09:50:01.000Z",
            value: "93",
        },
        {
            date: "2021-10-03T09:35:01.000Z",
            value: "88",
        },
    ];

    const [chartBlockData, setChartBlockData] = React.useState([]);
    
    React.useEffect(() => {
        const dummyBPData = patient.trend_map[1]?.temp?.map((item) => {
            return {
                date: item.date,
                value: 50 + Math.floor(Math.random() * 30),
                // value: item.value,
            };
        });
        setChartBlockData([
            {
                name: "Temperature",
                icon: Icons.thermometerIcon({
                    Style: { color: Colors.purple },
                }),
                val:
                    parseInt(patient.ews_map?.temp) === -1 ? "NA" : patient.ews_map?.temp,
                trendData: patient.trend_map[1]?.temp?.reverse(),
                color: Colors.purple,
            },
            {
                name: "SPO2",
                icon: Icons.o2({ Style: { color: Colors.green } }),
                val:
                    parseInt(patient.ews_map?.spo2) === -1 ? "NA" : patient.ews_map?.spo2,
                trendData: patient.trend_map[0]?.spo2?.reverse(),
                color: Colors.green,
            },
            {
                name: "Heart Rate",
                icon: Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
                val: parseInt(patient.ews_map?.hr) === -1 ? "NA" : patient.ews_map?.hr,
                trendData: patient.trend_map[3]?.hr?.reverse(),
                color: Colors.darkPink,
            },
            {
                name: "Respiration Rate",
                icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
                val: parseInt(patient.ews_map?.rr) === -1 ? "NA" : patient.ews_map?.rr,
                trendData: patient.trend_map[2]?.rr?.reverse(),
                color: Colors.orange,
            },
            {
                name: "Blood Pressure",
                icon: Icons.bpIcon({
                    Style: { color: Colors.darkPurple, fontSize: "24px" },
                }),
                val:
                parseInt(patient.ews_map?.rr) === -1
                  ? "NA"
                  : patient.ews_map?.rr,
                trendData: dummyBPData,
                color: Colors.darkPurple,
            },
            {
                name: "Weight",
                icon: Icons.bpIcon({
                    Style: { color: Colors.yellow, fontSize: "24px" },
                }),
                val:
                parseInt(patient.ews_map?.rr) === -1
                  ? "NA"
                  : patient.ews_map?.rr,
                color: Colors.yellow,
            },
        ]);
    }, []);

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
