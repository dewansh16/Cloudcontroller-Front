import React from "react";
import { Line } from "@ant-design/charts";
import "./chart.Report.components.css";

const SpO2chart = (props) => {
  let spo2Data;
  let minval, maxval;
  let minel, maxel;
  if (props.hourlyChartData === undefined) {
    minval = props.chartData.spo2[0].value;
    maxval = props.chartData.spo2[0].value;
    minel = props.chartData.spo2[0];
    maxel = props.chartData.spo2[0];
    props.chartData.spo2.forEach((item) => {
      if (minval > item.value) {
        minel = item;
        minval = item.value;
      }
      if (maxval < item.value) {
        maxel = item;
        maxval = item.value;
      }
    });
    spo2Data = props.chartData.spo2.map((item) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const date1 = new Date(item.date);
      const datereq = date1.getDate();
      const monthreq = date1.getMonth();
      const indate = `${datereq} ${monthNames[monthreq]}`;
      return {
        ...item,
        value: parseInt(item.value),
        date: indate,
      };
    });
  } else {
    spo2Data = props.hourlyChartData.spo2.map((item) => {
      minval = props.hourlyChartData.spo2[0].value;
      maxval = props.hourlyChartData.spo2[0].value;
      minel = props.hourlyChartData.spo2[0];
      maxel = props.hourlyChartData.spo2[0];
      props.hourlyChartData.spo2.forEach((item) => {
        if (minval > item.value) {
          minel = item;
          minval = item.value;
        }
        if (maxval < item.value) {
          maxel = item;
          maxval = item.value;
        }
      });
      const date1 = new Date(item.date);
      const hourreq = date1.getHours();
      const minutesreq = date1.getMinutes();
      const indate = `${hourreq} : ${minutesreq}`;
      return {
        ...item,
        value: parseInt(item.value),
        date: indate,
      };
    });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const minelDate = new Date(minel.date);
  const maxelDate = new Date(maxel.date);

  const data = [...spo2Data];

  const config = {
    data,
    height: 200,
    color: "#E48F5A",
    yField: "value",
    xField: "date",
    xAxis: {
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
    },
    yAxis: {
      min: 70,
      max: 110,
    },
    annotations: [
      {
        type: "region",
        start: ["min", "99"],
        end: ["max", "93"],
        regionStyle: {
          fill: "#F1F2FD",
        },
      },
    ],
    size: 8,
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <h5 style={{ marginTop: 16 }}>SpO2 ( % )</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item, index) => {
                const { name, value } = item;
                return (
                  <li
                    key={item.date}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: "#86D283" }}
                    ></span>
                    <span
                      style={{
                        display: "inline-flex",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ margiRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        {value}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
    line: {
      size: 6,
    },
    point: {
      size: 8,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#E48F5A",
        lineWidth: 3,
      },
    },
  };

  return (
    <div className="in-charts">
      <h1>
        <b>SpO2 ( % )</b>
      </h1>
      <div className="chart">
        <div className="chart-display">
          <Line {...config} />
        </div>
        <div className="chart-data-display">
          <div className="maxval">
            <div className="val">
              Max : <b>{maxel.value}</b>
            </div>
            <div style={{ paddingLeft: "15px", paddingTop: "5px" }}>
              {`${maxelDate.getDate()} ${
                monthNames[maxelDate.getMonth()]
              } ${maxelDate.getFullYear()}`}{" "}
              <br />( {`${maxelDate.getHours()} : ${maxelDate.getMinutes()}`} )
            </div>
          </div>
          <div className="minval">
            <div className="val">
              Min : <b>{minel.value}</b>
            </div>
            <div style={{ paddingLeft: "15px", paddingTop: "5px" }}>
              {`${minelDate.getDate()} ${
                monthNames[minelDate.getMonth()]
              } ${minelDate.getFullYear()}`}{" "}
              <br />( {`${minelDate.getHours()} : ${minelDate.getMinutes()}`} )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpO2chart;
