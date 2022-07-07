import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { ipAddress } from '../Utils/utils';

import { Input, Select } from "antd";
const { TextArea } = Input;
const { Option } = Select;

const Logger = () => {
    const [data, setData] = useState([]);
    let typeLog = localStorage.getItem("typeLog");

    useEffect(() => {
        var socket = io(`http://${ipAddress}:7124`, { transports: ['websocket', 'polling', 'flashsocket'] });

        if (typeLog === null || typeLog === undefined) {
            typeLog = "SENSOR_LOG_DATA";
            localStorage.setItem("typeLog", typeLog);
        }
        console.log("typeLog", typeLog);
        socket.on(`${typeLog}`, function ({ body }) {
            console.log("---------------------- socket", body);
            data.push(body);
            setData([...data]);
        })
    }, []);

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
                        defaultValue={typeLog}
                        style={{ width: "9rem", marginLeft: "1rem" }}
                        onSelect={(val) => { 
                            localStorage.setItem("typeLog", val);
                            setData([]);
                            window.location.reload();
                        }}
                    >
                        <Option value="SENSOR_LOG_DATA">Sensor data</Option>
                        <Option value="SENSOR_LOG_KEEP_ALIVE">Keep alive</Option>
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
