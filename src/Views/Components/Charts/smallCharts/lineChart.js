import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import Colors from "../../../../Theme/Colors/colors";
import "./lineChart.css";

export default function SmallLineChart({
  dot = false,
  height,
  chartData,
  dataKey,
  strokeWidth = 2,
  strokeColor = Colors.purple,
  showXAxis = false,
  xdatakey = "",
  showYAxis = false,
  showToolTip = false,
  addReferenceArea = false,
  ReferenceAreaFill,
  ReferenceAreaStart,
  ReferenceAreaEnd,
  addMaxReferenceLine = false,
  maxValue,
  addMinReferenceLine = false,
  minValue,
  isAnimationActive = false,
  marginRight,
  name,
}) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p
            style={{ marginBottom: "0px", fontSize: "14px" }}
            className="label"
          >{`value: ${
            payload[0].value === -1 ? "Data not received" : payload[0].value
          }`}</p>
          {name === "EWS" ? null : (
            <p
              style={{ marginBottom: "0px", fontSize: "14px" }}
              className="label"
            >{`Band: ${ReferenceAreaStart} - ${ReferenceAreaEnd}`}</p>
          )}
          <p
            style={{
              marginBottom: "0px",
              color: strokeColor,
              fontSize: "10px",
            }}
            className="tooltip-time"
          >{`${label}`}</p>
        </div>
      );
    }

    return null;
  };

  const renderCustomAxisTick = ({ x, y, payload }) => {
    // console.log(payload.value);
    if (payload.value.includes(":")) {
      // console.log(payload.value);
      const minStart = payload.value.indexOf(":");
      return (
        <g transform={`translate(${x},${y})`}>
          <text fill="#000">
            {payload.value.slice(0, minStart) +
              payload.value.slice(minStart + 3, payload.value.length)}
          </text>
        </g>
      );
      // return to12HourFormat(payload.value);
    } else {
      return (
        <g transform={`translate(${x},${y})`}>
          <text fill="#000">{payload.value}</text>
        </g>
      );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height || "100%"}>
      <LineChart
        width="100%"
        data={chartData}
        margin={marginRight ? { right: 50, top: 10 } : { top: 10 }}
      >
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          activeDot={{ r: 4 }}
          dot={dot}
          isAnimationActive={isAnimationActive}
        />
        {showXAxis && (
          <XAxis
            tick={renderCustomAxisTick}
            style={{ fontWeight: "400", fontSize: "15px", color: "#00000000" }}
            dataKey={xdatakey}
            padding={{ left: 20 }}
            axisLine={false}
            tickLine={false}
            interval={8}
          />
        )}
        {showYAxis && (
          <YAxis
            style={{
              fontWeight: "normal",
              fontSize: "15px",
              color: "#00000000",
            }}
            type="number"
            domain={["dataMin", "dataMax"]}
            interval="preserveStartEnd"
            padding={{ bottom: 10, right: 70 }}
            axisLine={false}
            tickLine={false}
          />
        )}
        {showToolTip && (
          <Tooltip
            content={<CustomTooltip />}
            viewBox={{ x: 0, y: 0, width: 100, height: 100 }}
          />
        )}
        {addReferenceArea && name !== "EWS" && (
          <ReferenceArea
            fill={ReferenceAreaFill}
            y1={ReferenceAreaStart}
            y2={ReferenceAreaEnd}
            alwaysShow={true}
          />
        )}
        {addMaxReferenceLine && (
          <ReferenceLine y={maxValue} stroke="transparent" />
        )}
        {addMinReferenceLine && (
          <ReferenceLine y={minValue} stroke="transparent" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
