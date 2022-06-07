import React, { useState, useEffect } from "react";

import {
    Collapse,
    Button,
    Divider,
    Spin,
    Popover,
    Row,
    Col,
    Dropdown,
    Tag,
    Menu,
    Form,
    Select,
} from "antd";
import {
    CaretRightOutlined,
    CheckOutlined,
    TagOutlined,
    BellOutlined,
} from "@ant-design/icons";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Brush,
    ResponsiveContainer,
} from "recharts";

import "./Alert.Components.Alerts.Components.css";

import alertApi from "../../../../../Apis/alertApis";
import patientApi from "../../../../../Apis/patientApis";
import userApi from "../../../../../Apis/userApis";
import { InfluxDB } from "@influxdata/influxdb-client";
import moment from "moment";

const { Panel } = Collapse;

const { Option } = Select;
//if expired disable checkbtn with grey color

const Alert = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [ecgData, setEcgData] = useState(null);

    const [tags, setTags] = useState();
    const [tagLoading, isTagLoading] = useState(true);
    const [doctorList, setDoctorList] = useState(null);

    const [checkBtn, setCheckBtn] = useState(false);
    const [tagBtn, setTagBtn] = useState(false);
    const [bellBtn, setBellBtn] = useState(false);

    const [alertEcgData, setAlertEcgData] = useState(null);

    const alertData = props.data;

    const PanelStyle = {
        backgroundColor: "white",
        border: "1px solid #C7C7C7",
        borderRadius: "6px",
        boxShadow: "0px 0px 20px 3px #6F6C6C0D",
    };

    const checkBtnStyle = {
        border: "1px solid #86D283",
        color: "#86D283",
        background: "green",
    };

    const expiredBtnStyle = {
        background: "#7d7d7d",
        color: "white",
    };

    const tagBtnStyle = {
        border: "1px solid #FFD966",
        color: "#FFD966",
    };

    const bellBtnStyle = {
        border: "1px solid #FB2D77",
        color: "#FB2D77",
    };

    const editAcknowledged = () => {
        const data = {
            status: `${checkBtn ? "open" : "close"}`,
            text: "Raghav added a note",
            timeout: 14400,
        };

        alertApi
            .editAcknowledged(props.data.id, data)
            .then((res) => {
                setCheckBtn(true);
                console.log(res.data.response);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const btnStyle = (status) => {
        if (checkBtn === true) return checkBtnStyle;
        switch (status) {
            case "close":
                return checkBtnStyle;
            case "expired":
                return expiredBtnStyle;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (tagBtn === true) {
            userApi
                .getUserList()
                .then((res) => {
                    console.log(res.data.response);
                    const doctorsData = res.data.response?.users[0].filter(
                        (item) => item.role.toLowerCase() === "doctor"
                    );
                    const Doctors = [];
                    if (doctorsData.length > 0) {
                        for (let i = 0; i < doctorsData.length; i++) {
                            Doctors.push(
                                <Option
                                    value={doctorsData[i].fname + " " + doctorsData[i].lname}
                                >
                                    {doctorsData[i].fname + " " + doctorsData[i].lname}
                                </Option>
                            );
                        }
                    }
                    console.log(doctorsData, Doctors);
                    setDoctorList(Doctors);
                    isTagLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    isTagLoading(false);
                });
        }
    }, [tagBtn]);

    const onFinishTagging = (values) => {
        console.log(values);
        setTags(values.tags);
        const data = {
            tags: values.tags,
        };

        alertApi
            .addTags(props.data.id, data)
            .then((res) => {
                console.log(res.data.response);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    function handleChange(value) {
        console.log(`selected ${value}`);
    }

    const tagContent = (
        <div style={{ width: "320px", padding: "8px" }}>
            {tagLoading && (
                <Spin style={{ position: "relative", left: "40%", top: "30%" }} />
            )}
            {!tagLoading && (
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 18 }}
                    name="basic"
                    onFinish={onFinishTagging}
                >
                    <Form.Item label="Tag Doctors" name="tags" style={{ marginBottom: "14px" }}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: "100%", marginLeft: "4px" }}
                            placeholder="Please select"
                            defaultValue={tags}
                            onChange={handleChange}
                        >
                            {doctorList}
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ marginBottom: "0px" }}>
                        <Button
                            danger
                            small
                            onClick={() => {
                                setTagBtn(!tagBtn);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            small
                            type="primary"
                            htmlType="submit"
                            style={{ marginLeft: "10px" }}
                            onClick={() => {
                                setTagBtn(!tagBtn);
                            }}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );

    const genExtra = () => (
        <div
            onClick={(event) => {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
            }}
            style={
                props.props.fromQuickInfo === undefined ? { marginRight: "15px" } : null
            }
        >
            <Button
                type="text"
                // disabled={
                //     alertData.status === "expired" || alertData.status === "close"
                //         ? true
                //         : false
                // }
                style={btnStyle(alertData?.status)}
                onClick={editAcknowledged}
            >
                <CheckOutlined />
            </Button>
            <Popover trigger="click" content={tagContent} visible={tagBtn}>
                <Button
                    type="text"
                    style={tagBtn ? tagBtnStyle : null}
                    onClick={() => setTagBtn(!tagBtn)}
                >
                    <TagOutlined />
                </Button>
            </Popover>
        </div>
    );

    function to12HourFormat(dates) {
        var date = new Date(dates);
        var hours = date.getHours();
        var minutes = date.getMinutes();

        // Check whether AM or PM
        var newformat = hours >= 12 ? "p.m" : "a.m";

        // Find current hour in AM-PM Format
        hours = hours % 12;

        // To display "0" as "12"
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return hours + ":" + minutes + " " + newformat;
    }

    const panelHeader = ({ device_type = "", status = "", time = new Date(), value = 0 }) => (
        <div style={{ display: "inline-flex", width: "70%" }}>
            <div className="panel-header">
                <div className="panel-header-heading" style={{ textTransform: "uppercase" }}>
                    {`${device_type} ${status}`}
                </div>
                <div className="panel-header-time">
                    Local Time: {to12HourFormat(time)}
                </div>
            </div>
            <div>
                <Divider
                    type="vertical"
                    style={{
                        background: "black",
                        height: "90%",
                        opacity: "10%",
                        display: "inline-block",
                        margin: "8px 40px 8px 20px",
                    }}
                ></Divider>
            </div>
            <div className="panel-header-info">
                <div className="panel-header-heading">
                    {`${device_type}: `} {value ? <span>{value}</span> : null}
                    <br />
                </div>
                <div className="panel-header-time">{time}</div>
            </div>
        </div>
    );
    //

    const processDataForSensor = () => {
        const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
        const org = 'live247';

        const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
        const queryApi = client.getQueryApi(org);

        const date = new Date(props?.data?.time);
        const start = new Date(date.setMinutes(date.getMinutes() - 5));
        const end = new Date(date.setMinutes(date.getMinutes() + 5));
        const deviceType = props?.data?.value_of?.toLowerCase();

        const query = `from(bucket: "emr_dev")
                |> range(start: ${start?.toISOString()}, stop: ${end?.toISOString()})
                |> filter(fn: (r) => r["_measurement"] == "${props.pid}_${deviceType}")
                |> yield(name: "mean")`;
        
        let index = 0;
        const arrayRes = [];
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                index++;
                const dataQueryInFlux = tableMeta?.toObject(row) || {};
                arrayRes.push({
                    value: dataQueryInFlux?._value,
                    time: dataQueryInFlux?._time,
                    xData: index,
                    yData: dataQueryInFlux?._value
                });
            },
            error(error) {
                console.error(error)
                console.log('nFinished ERROR')
            },
            complete() {
                setEcgData(arrayRes);
                setIsLoading(false);
            },
        })
    }

    useEffect(() => {
        if (isOpen) {
            processDataForSensor();
        }
    }, [isOpen]);

    const menu = (
        <Menu>
            {/* {tags.map((item, index) => {
                if (index === 0) {
                    return;
                }
                return (
                    <Menu.Item>
                        <a>Dr . {item}</a>
                    </Menu.Item>
                );
            })} */}
        </Menu>
    );

    const cropNumbers = (num) => {
        return parseFloat(num).toFixed(1);
    };

    return (
        <>
            <Collapse
                bordered={false}
                ghost
                expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                className="site-collapse-custom-collapse"
                expandIconPosition={"right"}
                onChange={() => {
                    setIsOpen(!isOpen);
                }}
            >
                <Panel
                    header={panelHeader(
                        props.data
                    )}
                    key="1"
                    className="site-collapse-custom-panel"
                    extra={genExtra()}
                    style={{
                        ...PanelStyle,
                        borderLeft: "6px Solid  #FB2D77",
                    }}
                >
                    {isLoading && (
                        <Spin style={{ position: "relative", left: "50%", top: "30%" }} />
                    )}

                    {/* {!isLoading && ecgData?.patient_sensor_data.length < 1 && (
                        <div style={{ width: "100%", height: "200px" }}>
                            <div
                                className="no-alerts-div"
                                style={{ position: "relative", fontSize: "32px" }}
                            >
                                <h1>GRAPH not available for this alert</h1>
                            </div>
                        </div>
                    )} */}

                    {!isLoading && (
                        <div
                            className="body-chart"
                            style={{
                                margin: "20px auto",
                                height: ecgData?.length > 0 ? "300px" : "50px",
                                width: "100%",
                            }}
                        >
                            {ecgData?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        width={200}
                                        height={200}
                                        data={ecgData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <XAxis dataKey="xData" hide={true} />
                                        <YAxis
                                            hide={true}
                                            domain={["dataMin - 300", "dataMax + 200"]}
                                        />
                                        {/* <Brush
                                        dataKey="name"
                                        height={30}
                                        stroke="#686868"
                                        startIndex={brushStart - 4 * 128}
                                        endIndex={brushStart + 5 * 128}
                                    /> */}
                                        <Line
                                            type="monotone"
                                            dataKey="yData"
                                            dot={false}
                                            strokeWidth={3}
                                            animationDuration={5000}
                                            stroke="#393939"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ textAlign: "center" }}>No data</div>
                            )}
                        </div>
                    )}
                </Panel>
            </Collapse>
        </>
    );
};

export default Alert;
