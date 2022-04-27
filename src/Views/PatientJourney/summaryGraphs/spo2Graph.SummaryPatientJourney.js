import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-90)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

function Spo2Graph({ graphValues }) {
  console.log(graphValues);
  return (
    <div style={{ height: "90%", width: "90%", margin: "auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={400}
          height={400}
          data={graphValues}
          margin={{
            top: 50,
            right: 5,
            bottom: 50,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#855CF8" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#855CF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            domain={["dataMin -10", "dataMax+2"]}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="url(#colorUv)"
            dot={{ stroke: "#ffffff", fill: "#855CF8", strokeWidth: 1, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Spo2Graph;
