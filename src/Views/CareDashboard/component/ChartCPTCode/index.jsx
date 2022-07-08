import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { Spin } from 'antd';
import {CPT_CODE} from '../../../../Utils/utils.js';

const ChartCPTCode = ({ pid, record, code }) => {
    const [dataChart, setDataChart] = useState({
        loading: true,
        data: []
    });
    const maxValue99457 = 20;
    const maxValue99458 = 40;
    const maxValue99091 = 30;
    const timeInterval = useRef(null);

    const COLORS = ['#ff0000a8', '#008000d1'];
    
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
        if (code == CPT_CODE.CPT_99454) {
            let i = 0;
            timeInterval.current = setInterval(() => {
                i++;
                if (!!record?.totalValueInfux) {
                    const arrayData = record?.totalValueInfux;
                    setDataChart({
                        loading: false,
                        data: [{ value: 16 }, { value: arrayData?.length }]
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
        } 

        if(code == CPT_CODE.CPT_99457){
            let chartValue = Math.floor(record.task_99457 / 60) < maxValue99457 ?  Math.floor(record.task_99457 / 60) / maxValue99457 : 100;
            chartValue = chartValue * 100;
            setDataChart({
                loading: false,
                data: [{ value: maxValue99457 }, { value: chartValue }]
            });
        }

        if(code == CPT_CODE.CPT_99458){
            let chartValue = Math.floor(record.task_99458 / 60) < maxValue99458 ?  Math.floor(record.task_99458 / 60) / maxValue99458 : 100;
            chartValue = chartValue * 100;
            setDataChart({
                loading: false,
                data: [{ value: maxValue99458 }, { value: chartValue }]
            });
        }

        if(code == CPT_CODE.CPT_99091){
            let chartValue = Math.floor(record.task_99091 / 60) < maxValue99091 ?  Math.floor(record.task_99091 / 60) / maxValue99091 : 100;
            chartValue = chartValue * 100
            setDataChart({
                loading: false,
                data: [{ value: maxValue99091 }, { value: chartValue }]
            });
        }

        return () => { clearInterval(timeInterval.current); }
    }, [pid]);

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {dataChart?.loading ? (
                <Spin />
            ) : (
                <PieChart width={60} height={60}>
                    <Pie
                        data={dataChart?.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // label={renderCustomizedLabel}
                        startAngle={-270}
                        outerRadius={30}
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
