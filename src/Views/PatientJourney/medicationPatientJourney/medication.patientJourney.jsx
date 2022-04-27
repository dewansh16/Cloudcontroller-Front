import React from "react";
import { Row, Col } from "antd";
import "./medication.patientJourney.css";

function Medication() {
  return (
    <div className="ptp-body">
      <Row className="ptp-upper-Row">
        <Col span={8} className="ptp-upper-Col">
          <div className="ptp-upper-Col-box">
            <div className="ptp-upper-Col-box-header">
              <h1>Illness</h1>
            </div>
            <div className="ptp-upper-Col-box-body">
              <p>Leg Fracture and rupture tissues </p>
            </div>
          </div>
        </Col>
        <Col span={8} className="ptp-upper-Col">
          <div className="ptp-upper-Col-box">
            <div className="ptp-upper-Col-box-header">
              <h1>Risk Factors</h1>
            </div>
            <div className="ptp-upper-Col-box-body">
              <p>Obesity, Hypertension, Diabetes </p>
            </div>
          </div>
        </Col>
        <Col span={8} className="ptp-upper-Col">
          <div className="ptp-upper-Col-box">
            <div className="ptp-upper-Col-box-header">
              <h1>Diagnosis</h1>
            </div>
            <div className="ptp-upper-Col-box-body">
              <p>Blood Analysis, X-Ray</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="ptp-lower-Row">
        <Col span={12} className="ptp-lower-Col">
          <div className="ptp-lower-Col-box">
            <div className="ptp-lower-Col-box-header">
              <span>Notes</span>
            </div>
          </div>
        </Col>
        <Col span={12} className="ptp-lower-Col">
          <div className="ptp-lower-Col-box">
            <div className="ptp-lower-Col-box-header">
              <span>Comments and Advices</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Medication;
