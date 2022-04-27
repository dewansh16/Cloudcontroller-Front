import React from 'react';
import { Spin } from 'antd';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import Ecg from '../../../Apis/sockets/ecg';
export default function EcgChart({ pid }) {
    const { chartData, isLoading, hasError } = Ecg({ pid });

    if (hasError) {
        return <div style={{
            height: "8em",
            borderRadius: "6px",
            background: "black",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <p>{hasError}</p>
        </div>
    } else {
        return isLoading ? <div style={{ display: "flex", justifyContent: "center" }}><Spin /></div> :
            <div style={{ height: "8em", borderRadius: "6px" }}>
                <ResponsiveContainer width="100%" height="100%" >
                    <LineChart data={chartData} style={{ background: "#010101", borderRadius: "6px" }}>
                        <Line type="monotone" dataKey="y" stroke="green" strokeWidth="3px" dot={false} isAnimationActive={false} />
                        <YAxis domain={[-2000, 2000]} tick={false} axisLine={false} hide={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
    }
}