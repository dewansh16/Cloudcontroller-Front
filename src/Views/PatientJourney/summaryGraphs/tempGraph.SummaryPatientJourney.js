import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function TempGraph({ graphValues }) {
  console.log(graphValues);
  return (
    <div style={{ height: "90%", width: "90%", margin: "auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          width={400}
          height={400}
          data={graphValues}
          margin={{
            top: 20,
            right: 0,
            bottom: 20,
            left: 40,
          }}
        >
          <XAxis
            type="number"
            domain={[90, 108]}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            scale="band"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" barSize={8} fill="#08C700" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TempGraph;
