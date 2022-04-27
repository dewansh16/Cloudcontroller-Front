import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./patientJourney.css";
import WardDetails from "./wardDetails/wardDetails.patientJourney";
import Steps from "./stepspatientJourney/steps.patientJourney";
import { Row, Col } from "antd";

function PatientJourney({
  activeStep,
  setActiveStep,
  stepArray,
  setStepArray,
}) {
  console.log(stepArray, activeStep);

  return (
    <div>
      <div>
        <Row className="patient-journey-main-body">
          <Col span={7} className="steps-table">
            <div className="steps-table-body">
              <Steps
                setStepArray={setStepArray}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                stepArray={stepArray}
              />
            </div>
          </Col>
          <Col span={17} className="steps-info">
            <WardDetails stepArray={stepArray} activeStep={activeStep} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PatientJourney;
