import React, { useEffect, useState } from 'react'
import './deviceDetails.DeviceData.Components.PatientQuickInfo.Components.css'
import { Menu, Col, Row, notification, Divider, Popover, Form, Tooltip, Spin } from '../../../../../../Theme/antdComponents'
import { Input, InputNumber, GlobalTextArea } from '../../../../../../Theme/Components/Input/input'
import Icons from '../../../../../../Utils/iconMap'

import { Button as Buttons } from '../../../../../../Theme/Components/Button/button'

import { Line } from '@ant-design/charts';
import patientApi from '../../../../../../Apis/patientApis'
import { SelectOption, Select } from '../../../../../../Theme/Components/Select/select'

const deviceTypeMap = {
    ecg: ['bat_ecg', 7],
    temperature: ['bat_temp', 9],
    spo2: ['bat_spo2', 8],
    gateway: ['bat_gw', 10]
}

function getCurrentDate(dateTime) {
    let dateInstance = new Date(dateTime)
    const month = dateInstance.getMonth() + 1
    const date = dateInstance.getDate()

    return `${dateInstance.getHours()}:${dateInstance.getMinutes() < 10 ? '0' + dateInstance.getMinutes() : dateInstance.getMinutes()} Hrs`
}


function CreateGraphData(pid, deviceType) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const today = new Date();

    useEffect(() => {
        patientApi
            .getTrends(pid, today)
            .then((res) => {
                const batType = res.data.response.trend_map.trend_map[deviceTypeMap[deviceType][1]][deviceTypeMap[deviceType][0]];
                const batMax = batType.length
                //TODO: add a limit if required const batMax = batType.length > 10 ? 10 : batType.length
                for (let i = 0; i < batMax; i++) {
                    let date = getCurrentDate(batType[i]["date"])
                    let tempData = {}
                    tempData["time"] = date
                    tempData["value"] = parseInt(batType[i]["value"])
                    data.push(tempData)
                }
                setData([...data.reverse()]);
                setLoading(false);
                setResponse(res)
            }).catch((err) => {
                if (err) {
                    // console.log(err)
                    // notification.error({
                    //     message: 'Error',
                    //     description: "Some thing went wrong"
                    // })
                    setLoading(false);
                }
            })
    }, [pid])
    return [data, loading]
}

function GetPatientOTP(pid, setOtp, setOtpLoading, callback = () => { }) {
    patientApi.getPatientOtp(pid).then((res) => {
        setOtpLoading(false);
        setOtp(res.data.response.otp[0])
        callback();
    }).catch((err) => {
        if (err) {
            notification.error({
                message: 'Error',
                description: `${err.response?.data.result}` || ""
            })
            setOtpLoading(false);
        }
    })
}

function DeviceDetails({ serial, pid, uuid, duration, deviceType }) {
    const [data, isLoading] = CreateGraphData(pid, deviceType);

    const config = {
        data,
        height: 200,
        padding: "1rem",
        color: '#E893EA',
        yField: 'value',
        xField: 'time',
        xAxis: {
            grid: { line: { style: { stroke: '#eee' } } },
            line: { style: { stroke: '#aaa' } },
        },
        yAxis: {
            min: 0,
            max: 100,
        },
        size: 8,
        tooltip: {
            customContent: (title, items) => {
                return (
                    <>
                        <h5 style={{ marginTop: 16 }}>Battery %</h5>
                        <ul style={{ paddingLeft: 0 }}>
                            {items?.map((item, index) => {
                                const { name, value } = item;
                                return (
                                    <li
                                        key={item.time}
                                        className="g2-tooltip-list-item"
                                        data-index={index}
                                        style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                                    >
                                        <span className="g2-tooltip-marker" style={{ backgroundColor: '#86D283' }}></span>
                                        <span
                                            style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
                                        >
                                            <span style={{ margiRight: 16 }}>{name}:</span>
                                            <span className="g2-tooltip-list-item-value">{value}</span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                );
            },
        },
        line: {
            size: 6,
        },
        point: {
            size: 8,
            shape: 'circle',
            style: {
                fill: 'white',
                stroke: '#E893EA',
                lineWidth: 3,
            },
        },
    };
    const [configForm] = Form.useForm()

    const onFinish = (values) => {
        console.log(values)
        const formData = [
            {
                "patch_uuid": uuid,
                "duration": duration,
                "config": [
                    {
                        "sample_freq": `${values.sample_freq}`,
                        "sample_count": `${values.sample_count}`,
                        "stop_sample": `${values.stop_sample}`,
                    }
                ],
                "command": `${values.command}`,
                "keepaliveTime": `${values.sample_freq}`,
            }
        ]

        patientApi.updatePatch(pid, formData).then((res) => {
            if (res.status === 200) {
                notification.success({
                    message: "Success",
                    description: res.message
                })

            } else {
                console.log(res)
                notification.info({
                    message: "Something went wrong",
                    description: res.message
                })
            }
        }).catch((err) => {
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response?.data.result}` || ""
                })
            }
        })
    }

    const [keepAliveHistory, setKeepAliveHistory] = useState("")
    const fetchKeepAliveHistrory = () => {
        patientApi.getPatientPatches(pid).then((res) => {
            const { keepaliveHistory = "" } = res.data?.response.patch_patient_map[0];
            setKeepAliveHistory(keepaliveHistory ? JSON.stringify(keepaliveHistory) : "--No history found--");
        }).catch((err) => {
            if (err) {
                console.log(err)
                notification.error({
                    message: 'Error',
                    description: `${err}` || ""
                })
            }
        })
    }

    const onFinishFailed = (values) => {};

    const [otp, setOtp] = useState(null);
    const [otpLoading, setOtpLoading] = useState(null);
    const [otpVisibility, setOtpVisibility] = useState(false);

    const viewOtp = () => {
        setOtpVisibility(true);
        setTimeout(() => setOtpVisibility(false), 30000);
    }

    const getOtp = () => {
        GetPatientOTP(pid, setOtp, setOtpLoading, viewOtp);
    }
    // useEffect(() => {
    //     return () => {
    //         setOtpLoading(false);
    //         setOtp(null)
    //     }
    // }, [])
    const [contentPosition, setContentPosition] = useState("default");
    // code for the special select component
    const [items, setItems] = useState(["kill", "save", "pause"])
    const [commandName, setCommandName] = useState("")
    const addItem = () => {
        if (commandName === "") { return }
        setItems([...items, commandName])
        setCommandName("")
    };

    const onNameChange = (e) => {
        setCommandName(e.target.value)
    }
    const displayMap = {
        default: !isLoading ?
            <div>
                <Row gutter={[0, 0]} className='device-info-box' justify="center">
                    <Col className='device-info' span={6}>
                        <p style={{ textAlign: "center" }}><span>Battery Trend</span></p>
                    </Col>
                </Row>
                {data && <Line {...config} />}
                <div style={{ margin: '4em 0px' }}>
                    <Row className='device-info-box'>
                        <Col className='device-info' span={12}>
                            <p><span>Current Status :</span> {data[data.length - 1]?.value === -1 ? "Inactive" : "Active"}</p>
                        </Col>
                        {/* <Col className='device-info' span={12}>
                            <p><span>Last Fetched :</span> {data[data.length - 1]?.value === -1 ? "NA" : data[data.length - 1].time}</p>
                        </Col> */}
                    </Row>
                </div>
            </div> 
            :
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "332px" }}>
                <Spin />
            </div>
        ,
        config: <Form
            form={configForm}
            layout="vertical"
            name="Add Vitals"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ minHeight: "332px" }}
        >
            {/* currentDrug */}
            <Row gutter={[24, 0]} >
                <Col style={{}} span={24}>
                    <Form.Item
                        required={false}
                        label="Command"
                        name="command"
                        rules={[{
                            required: false,
                            // TODO: whether this is a required field
                            message: "required"
                        }]}
                    >
                        <Select
                            placeholder="enter a command"
                            showSearch
                            optionFilterProp="children"
                            filterOption={true}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                        <Input style={{ flex: 'auto' }} value={commandName} onChange={onNameChange} />
                                        <a
                                            style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                            onClick={addItem}
                                        >
                                            + Add command
                                        </a>
                                    </div>
                                </div>
                            )}
                        >
                            {items.map(item => (
                                <SelectOption key={item}>{item}</SelectOption>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col style={{}} span={8}>
                    <Form.Item
                        required={false}
                        label="Frequency"
                        name="sample_freq"
                        rules={[{
                            required: true,
                            message: "required"
                        }]}
                    >
                        <Input
                            placeholder="in seconds"
                        />
                    </Form.Item>
                </Col>
                <Col style={{}} span={8}>
                    <Form.Item
                        required={false}
                        label="Sample Count"
                        name="sample_count"
                        rules={[{
                            required: true,
                            message: "required"
                        }]}
                    >
                        <InputNumber
                            min={0}
                            placeholder=""
                        />
                    </Form.Item>
                </Col>
                <Col style={{}} span={8}>
                    <Form.Item
                        required={false}
                        label="Stop Sample"
                        name="stop_sample"
                        rules={[{
                            required: false,
                            message: "required"
                        }]}
                    >
                        <InputNumber
                            min={0}
                            placeholder=""
                        />
                    </Form.Item>
                </Col>
                <Col xs={8} md={4} >
                    <Form.Item>
                        <Buttons htmlType="submit" style={{ width: "100%" }}>Save</Buttons>
                    </Form.Item>
                </Col>
                <Col xs={8} md={4} >
                    <Form.Item>
                        <Buttons style={{ width: "100%" }} type="secondary" onClick={() => {
                            setContentPosition("default")
                            configForm.resetFields()
                        }}>Cancel</Buttons>
                    </Form.Item>
                </Col>
            </Row>
        </Form>,
        testBaseline: <div
            style={{ minHeight: "332px" }}
        >
            <Buttons type="secondary" onClick={() => setContentPosition("default")}>Cancel</Buttons>
        </div>,
        keepAlive: <div
            style={{ minHeight: "332px" }}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <GlobalTextArea style={{ color: "#121215", fontWeight: "400", fontFamily: "Consolas" }} autoSize={{ minRows: 10 }} value={keepAliveHistory || ""} disabled={false} />
                </Col>
                <Col span={24}>
                    <Buttons type="secondary" onClick={() => setContentPosition("default")}>Cancel</Buttons>
                </Col>
            </Row>
        </div >
    }


    return (
        <div>
            <Row span={24} justify="space-between">
                <Col span={8} style={{ display: "flex", justifyContent: "space-between" }}>
                    <Buttons disabled={contentPosition === "config"} onClick={() => setContentPosition("config")} type="utility">
                        Configure
                    </Buttons>
                    {deviceType === "gateway" && <>
                        {otp ?
                            (otpVisibility ?
                                <div className='device-info'><p><span>OTP:</span> {otp}</p></div>
                                :
                                <Buttons onClick={viewOtp} type="utility">View OTP</Buttons>
                            )
                            :
                            <Buttons style={{ minWidth: "90px" }} type="utility" onClick={getOtp}>
                                {"View OTP"}
                            </Buttons>
                        }
                    </>}

                </Col>
                <Col span={6}>
                    <Buttons disabled={contentPosition === "keepAlive"} onClick={() => { setContentPosition("keepAlive"); fetchKeepAliveHistrory() }} type="utility">Keep Alive</Buttons>
                </Col>
                <Col span={6}>
                    <Buttons disabled={contentPosition === "testBaseline"} onClick={() => setContentPosition("testBaseline")} type="utility">Test & Baseline</Buttons>
                </Col>
            </Row>
            <Row style={{ marginTop: '2em' }}>
                <div className='device-info'>
                    <p><span>Serial</span> {serial}</p>
                </div>
                <div className='device-management-chart' >
                    {displayMap[contentPosition]}
                </div>
            </Row>
        </div>
    )
}

export default DeviceDetails
