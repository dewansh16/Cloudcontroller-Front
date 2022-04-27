import React from "react";
import "./consultants.patientJourney.css";
import { Row, Col } from "antd";

function Consultants() {
  return (
    <div className="consultants-patient-journey">
      <div className="consultants-info-box-row">
        <div className="consultants-info-box-col">
          <div className="consultant-internal-box">
            <div className="consultants-heading">
              <h1>Physician</h1>
            </div>
            <div className="consultants-body">
              <div className="consultant-info">
                <span className="consultant-name">Dr. Rakesh Dubey</span>
                <span className="consultant-time">12:00pm</span>
              </div>
              <div className="consultant-info">
                <span className="consultant-name">Dr. Rakesh Dubey</span>
                <span className="consultant-time">12:00pm</span>
              </div>
            </div>
          </div>
        </div>
        <div className="consultants-info-box-col">
          <div className="consultant-internal-box">
            <div className="consultants-heading">
              <h1>Nurses</h1>
            </div>
            <div className="consultants-body">
              <div className="consultant-info">
                <span className="consultant-name">Dr. Rakesh Dubey</span>
                <span className="consultant-time">12:00pm</span>
              </div>
              <div className="consultant-info">
                <span className="consultant-name">Dr. Rakesh Dubey</span>
                <span className="consultant-time">12:00pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="consultants-info-box-row">
        <div className="consultants-info-box-col">
          <div className="consultant-internal-box">
            <div className="consultants-heading">
              <h1>Incharge</h1>
            </div>
            <div className="consultants-body">
              <div className="consultant-info">
                <span className="consultant-name">Dr. Rakesh Dubey</span>
                <span className="consultant-time">12:00pm</span>
              </div>
              <div className="consultant-info">
                <span className="consultant-name">Dr. Rakesh Dubey</span>
                <span className="consultant-time">12:00pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consultants;
