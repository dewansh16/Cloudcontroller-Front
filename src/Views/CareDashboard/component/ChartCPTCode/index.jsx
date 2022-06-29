import React from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';

const ChartCPTCode = () => {
    const data = [
        { name: 'Group A', value: 100 },
        { name: 'Group B', value: 50 },
    ];
    
    const COLORS = ['#ff0000', '#008000'];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text x={x} y={y} fill="white" textAnchor='middle' dominantBaseline="central" style={{ fontSize: "12px", fontWeight: "300" }}>
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <PieChart width={90} height={90}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    startAngle={-270}
                    outerRadius={40}
                    fill="#fff"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
}

export default ChartCPTCode;
