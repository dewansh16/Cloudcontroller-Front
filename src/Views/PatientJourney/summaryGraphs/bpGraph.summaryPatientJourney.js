import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BpGraph({ graphValues }) {
  console.log(graphValues);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={400}
        height={400}
        data={graphValues}
        margin={{ top: 30, right: 10, left: 10, bottom: 80 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          padding={{ top: 50 }}
        />
        <YAxis
          domain={["dataMin -10", "dataMax+2"]}
          axisLine={false}
          tickLine={false}
        />
        <CartesianGrid strokeDasharray="5" vertical={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="bph"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
          dot={{ stroke: "#ffffff", fill: "#855CF8", strokeWidth: 1, r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="bpl"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
          dot={{ stroke: "#ffffff", fill: "#82ca9d", strokeWidth: 1, r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default BpGraph;
