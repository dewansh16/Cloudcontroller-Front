import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { Spin } from 'antd';

const ChartCPTCode = ({ pid, record, CPT_CODE }) => {
    const [dataChart, setDataChart] = useState({
        loading: true,
        data: []
    });

    const timeInterval = useRef(null);

    const COLORS = ['#ff0000', '#008000'];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text
                x={x} y={y} 
                fill="white" 
                textAnchor='middle' 
                dominantBaseline="central" 
                style={{ fontSize: "12px", fontWeight: "300" }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        if (CPT_CODE === "99454") {
            let i = 0;
            timeInterval.current = setInterval(() => {
                i++;

                if (!!record?.totalValueInfux) {
                    setDataChart({
                        loading: false,
                        data: record?.totalValueInfux
                    });
                    clearInterval(timeInterval.current);
                }
    
                if (i === 5) {
                    clearInterval(timeInterval.current);
                    setDataChart({
                        loading: false,
                        data: [{ value: 1 }]
                    });
                }
            }, 1000);
        } else {
            setDataChart({
                loading: false,
                data: [{ value: 1 }]
            });
        }

        return () => { clearInterval(timeInterval.current); }
    }, [pid]);

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {dataChart?.loading ? (
                <Spin />
            ) : (
                <PieChart width={90} height={90}>
                    <Pie
                        data={dataChart?.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        startAngle={-270}
                        outerRadius={40}
                        fill="#fff"
                        dataKey="value"
                    >
                        {dataChart?.data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            )}
        </div>
    );
}

export default ChartCPTCode;
