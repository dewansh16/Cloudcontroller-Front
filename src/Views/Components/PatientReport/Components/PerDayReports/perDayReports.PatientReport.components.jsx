import { useState, useEffect } from "react";
import reportApi from "../../../../../Apis/reportApis";
import { notification } from "antd";
import { Spin } from "antd";
import "./perDayReports.PatientReport.components.css";
import EWSchart from "../charts/EWSchart.charts.Report.component";
import PulseRatechart from "../charts/PulseRate.Report.Components";
import RespRatechart from "../charts/RespRate.chart.Report.components";
import SpO2chart from "../charts/SpO2.Report.Components";
import Tempchart from "../charts/Temp.Report.Components";
import { Input } from "antd";
import Footer from "../footer/footer.Report.component";

import Scroll from "react-scroll";

const Element = Scroll.Element;

const { TextArea } = Input;

function FetchReportDetails(pid, date) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    reportApi
      .getEachReportData(pid, date, date)
      .then((res) => {
        setResponse(res.data?.response);
        setLoading(false);
      })
      .catch((err) => {
        if (err) {
          const key = "perDayreportErrorkey";
          notification.error({
            key,
            message: "Error",
            description: `${err.response?.data?.result}` || "",
          });
          setLoading(false);
        }
      });
  }, [pid, date]);

  return [response, loading];
}

const PerDayReports = (props) => {
  function to12HourFormat(dates) {
    var date = new Date(dates);
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

  const toNormalDate = (date) => {
    const date1 = new Date(date);
    const date2 = `${date1.getDate()}  ${
      monthNames[date1.getMonth()]
    } ${date1.getFullYear()}`;
    return date2;
  };

  const reqDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    // console.log([year, month, day].join('-'));
    return [year, month, day].join("-");
  };

  const [reportData, isLoading] = FetchReportDetails(
    props.pid,
    reqDate(props.date)
  );
  // console.log(reportData);
  return (
    <div>
      {!isLoading && reportData !== null && reportData !== undefined && (
        <div className="perday-report-body">
          <div className="report-head">
            <p>Day {props.dayNo} </p>
            <div className="report-head-date">{toNormalDate(props.date)}</div>
          </div>
          <div className="report-charts">
            {reportData?.trend_map?.trend_map[4]?.ews.length > 0 && (
              <EWSchart hourlyChartData={reportData?.trend_map?.trend_map[4]} />
            )}
            {reportData?.trend_map?.trend_map[2]?.rr.length > 0 && (
              <RespRatechart
                hourlyChartData={reportData?.trend_map?.trend_map[2]}
              />
            )}
            {reportData?.trend_map?.trend_map[3]?.hr.length > 0 && (
              <PulseRatechart
                hourlyChartData={reportData?.trend_map?.trend_map[3]}
              />
            )}
            {reportData?.trend_map?.trend_map[0]?.spo2.length > 0 && (
              <SpO2chart
                hourlyChartData={reportData?.trend_map?.trend_map[0]}
              />
            )}
            {reportData?.trend_map?.trend_map[1]?.temp.length > 0 && (
              <Tempchart
                hourlyChartData={reportData?.trend_map?.trend_map[1]}
              />
            )}
          </div>
          <TextArea
            className="change"
            rows={10}
            style={{
              width: "80%",
              margin: "auto",
              display: "block",
              marginTop: "30px",
              backgroundColor: "#E8F5FB",
            }}
            placeholder="Alert"
          />
          <Footer
            endDate={props.date}
            style={{ width: "90%" }}
            pageNo={props.dayNo}
            totalPages={props.totalPages}
          />
        </div>
      )}
      {isLoading && (
        <Spin
          size="small"
          style={{ position: "relative", left: "50%", top: "30%" }}
        />
      )}
    </div>
  );
};

export default PerDayReports;
