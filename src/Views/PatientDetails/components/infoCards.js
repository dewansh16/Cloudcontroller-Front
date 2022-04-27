import React from "react";
import { Row, Col } from "antd";
// import Ecg from '../../../Utils/Charts/ecg'
// import { XAxis } from 'recharts';

import SmallLineChart from "../../Components/Charts/smallCharts/lineChart";

export default function InfoCard(props) {
  // const [chartData, bpm, hr, motion] = Ecg(props.pid);
  const Style = {
    primary: {
      heading: {
        fontSize: "1.2em",
        lineHeight: "25px",
        color: "#5B728F",
        opacity: "0.6",
        letterSpacing: "0.2em",
        marginLeft: "1em",
      },
      data: {
        color: "#5B728F",
        fontWeight: "600",
        fontSize: "2em",
        margin: "0 0.2em 0 0",
      },
      unit: {
        color: "#6D6D6D",
        opacity: "0.6",
      },
    },
  };

  function to12HourFormat(dates) {
    var date = new Date(dates);
    // console.log(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Check whether AM or PM
    var newformat = hours >= 12 ? "p.m" : "a.m";

    // Find current hour in AM-PM Format
    hours = hours % 12;

    // To display "0" as "12"
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return hours + ":" + minutes + " " + newformat;
  }

  const chartData =
    props.chartInterval === 0
      ? props.trendLine?.map((item) => {
          const indate = to12HourFormat(item.date);
          return {
            ...item,
            date: indate,
            value: parseInt(item.value),
          };
        })
      : props.trendLine.map((item) => {
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
          const indate = `${datereq} ${monthNames[monthreq].slice(0, 3)}`;
          return {
            ...item,
            date: indate,
            value: parseInt(item.value),
          };
        });

  // console.log(props.title);

  return (
    <div
      style={{
        background: "#FFF",
        boxShadow: " 0px 0px 20px rgba(0, 0, 0, 0.05)",
        padding: "2em 2em 1em 2em",
        minHeight: "8.7em",
      }}
    >
      {props.isError && (
        <div style={{ width: "100%", height: "11em" }}>
          <Row span={24} justify="space-between">
            <Col
              span={16}
              style={{ display: "inline-flex", justifyContent: "flex-start" }}
            >
              {props.icon}
              <h2 style={Style.primary.heading}>{props.title}</h2>
            </Col>
            <Col></Col>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80%",
              t: "44px",
            }}
          >
            <h1
              style={{
                fontSize: "2em",
                color: "#000",
                opacity: "0.3",
                fontWeight: "600",
              }}
            >
              Trend not available
            </h1>
          </div>
        </div>
      )}
      {!props.isError && (
        <>
          <Row span={24} justify="space-between">
            <Col
              span={16}
              style={{ display: "inline-flex", justifyContent: "flex-start" }}
            >
              {props.icon}
              <h2 style={Style.primary.heading}>{props.title}</h2>
            </Col>
            <Col>
              {/*<span style={Style.primary.data}>{props.data}</span>*/}
              <span style={Style.primary.data}>
                {props.data === -1 ||
                props.data === "-1" ||
                props.data === "-1.00"
                  ? " "
                  : props.data}
              </span>
              <span style={Style.primary.unit}>{props.unit}</span>
            </Col>
          </Row>
          <Row span={24}>
            <Col span={24} style={{ minHeight: "4em" }}>
              <SmallLineChart
                dot={false}
                chartData={chartData}
                height={110}
                dataKey="value"
                xdatakey="date"
                strokeColor={props.color}
                showXAxis={true}
                showYAxis={true}
                showToolTip={true}
                addReferenceArea={true}
                ReferenceAreaFill={`${props.color}70`}
                ReferenceAreaStart={props.min}
                ReferenceAreaEnd={props.max}
                addMinReferenceLine={true}
                minValue={props.min}
                addMaxReferenceLine={true}
                maxValue={props.max}
                marginRight={50}
                name={props.title}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
