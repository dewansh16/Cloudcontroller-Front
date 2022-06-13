import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

import { Input, Select } from "antd";
const { TextArea } = Input;
const { Option } = Select;

const Logger = () => {
    const [data, setData] = useState([]);
    const [typeLog, setTypeLog] = useState("SENSOR_LOG_DATA");

    useEffect(() => {
        var socket = io('http://20.230.234.202:7124', { transports: ['websocket', 'polling', 'flashsocket'] });

        socket.on(`${typeLog}`, function ({ body }) {
            console.log("---------------------- socket", body);
            data.push(body);
            setData([...data]);
        })
    }, [typeLog]);

    return (
        <div style={{ padding: "1rem 2rem", height: "100vh" }}>
            <div>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center"
                    }}
                >
                    <h3 style={{ margin: "0" }}>Log Type: </h3>
                    <Select
                        defaultValue="SENSOR_LOG_DATA"
                        style={{ width: "9rem", marginLeft: "1rem" }}
                        onSelect={(val) => setTypeLog(val)}
                    >
                        <Option value="SENSOR_LOG_KEEP_ALIVE">Keep alive</Option>
                        <Option value="SENSOR_LOG_DATA">Sensor data</Option>
                    </Select>
                </div>
            </div>
            <div style={{ height: "calc(100vh - 80px", marginTop: "1rem" }}>
                <div style={{
                    border: "1px solid #ff9452",
                    height: "100%",
                    borderRadius: "8px",
                    overflow: "auto"    
                }}>
                    {data.map((item, index) => {
                        return (
                            <div key={index} style={{ padding: "0.5rem 3rem", borderBottom: "1px solid #ddd", wordBreak: "break-all" }}>
                                {`${index+1}: ${JSON.stringify(item)}`}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Logger;
