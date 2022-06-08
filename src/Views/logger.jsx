import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

import { Input } from "antd";
const { TextArea } = Input;

const Logger = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        var socket = io('http://20.230.234.202:7124', { transports: ['websocket', 'polling', 'flashsocket'] });

        socket.on("SENSOR_LOG", function ({ body }) {
            console.log("---------------------- socket", body);
            data.push(body);
            setData([...data]);
        })
    }, []);

    return (
        <div style={{ padding: "2rem", height: "100vh" }}>
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
    );
}

export default Logger;
