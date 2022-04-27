import React from "react";
import { Line } from "@ant-design/charts";
import "./chart.Report.components.css";

const EWSchart = (props) => {
  let ewsData;
  let minval, maxval;
  let minel, maxel;

  if (props.hourlyChartData === undefined) {
    minval = props.chartData.ews[0].value;
    maxval = props.chartData.ews[0].value;
    minel = props.chartData.ews[0];
    maxel = props.chartData.ews[0];
    props.chartData.ews.forEach((item) => {
      if (minval > item.value) {
        minel = item;
        minval = item.value;
      }
      if (maxval < item.value) {
        maxel = item;
        maxval = item.value;
      }
    });
    ewsData = props.chartData.ews.map((item) => {
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
    minval = props.hourlyChartData.ews[0].value;
    maxval = props.hourlyChartData.ews[0].value;
    minel = props.hourlyChartData.ews[0];
    maxel = props.hourlyChartData.ews[0];
    props.hourlyChartData.ews.forEach((item) => {
      if (minval > item.value) {
        minel = item;
        minval = item.value;
      }
      if (maxval < item.value) {
        maxel = item;
        maxval = item.value;
      }
    });
    ewsData = props.hourlyChartData.ews.map((item) => {
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
  // console.log(minelDate, maxelDate, minel.value, maxel.value)

  const data = [...ewsData];

  const config = {
    data,
    height: 200,
    color: "#86D283",
    yField: "value",
    xField: `date`,
    xAxis: {
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
    },
    yAxis: {
      min: 0,
      max: 10,
    },
    annotations: [
      {
        type: "region",
        start: ["min", "4"],
        end: ["max", "7"],
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
            <h5 style={{ marginTop: 16 }}>EWS</h5>
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
        stroke: "#86D283",
        lineWidth: 3,
      },
    },
  };

  return (
    <div className="in-charts">
      <h1>
        <b>EWS</b>
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

export default EWSchart;
