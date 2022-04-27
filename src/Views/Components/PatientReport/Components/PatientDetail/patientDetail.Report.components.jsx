import React from "react";
import "../PatientDetail/patientDetail.Report.Component.css";

import { Row, Col } from "antd";

const PatientDetail = (props) => {
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

  console.log(props.startDate, props.endDate);
  return (
    <div className="detail-box">
      <Row gutter={[16, 40]} className="row-line">
        <Col span={6}>
          Name : <b>{props.details.fname + " " + props.details.lname}</b>{" "}
        </Col>
        <Col span={6}>
          ID : <b>{props.details.id}</b>{" "}
        </Col>
        <Col span={6}>
          Gender : <b>{props.details.sex}</b>
        </Col>
        <Col span={6}>
          Age : <b>24</b>
        </Col>
      </Row>
      {
        // <Row gutter={[16, 40]} className='row-line'>
        // <Col span={12}>Reason for admission  :      <b>Abnormal ElectroCardiogram</b></Col>
        // <Col span={12}>Managing Location  :     <b>Agra</b> </Col>
        // </Row>
      }
      <Row gutter={[16, 40]} className="row-line">
        <Col span={10}>
          Enrollment Period : <b>{props.enrollTime} </b>{" "}
        </Col>
        <Col span={14}>
          {" "}
          {toNormalDate(props.startDate)} ( {to12HourFormat(props.startDate)} )
          - {toNormalDate(props.endDate)} ( {to12HourFormat(props.endDate)} )
        </Col>
      </Row>
      {
        // <Row gutter={[8, 40]} className='row-line'>
        // <Col span={16}>Prescribing Clinician :    <b>Dr. Aditya Vikram Bhattacharya</b></Col>
        // </Row>
      }
    </div>
  );
};

export default PatientDetail;
