import React, { useState, useEffect } from "react";
import "./wardDetails.patientJourney.css";
import { Row, Col, Modal } from "antd";
import { Button } from "../../../Theme/Components/Button/button";
import Vitals from "../vitalsPatientJounrney/vitals.patientJourney";
import Medication from "../medicationPatientJourney/medication.patientJourney";
import Consultants from "../consultantsPatientJourney/consultants.patientJourney";
import Summary from "../summaryPatientJourney/summary.patientJourney";

function WardDetails({
    activeStep,
    wardArray,
    patient,
    summaryModal,
    openSummaryModal,
    pid
}) {
    const [stepArray, setStepArray] = useState(wardArray);

    useEffect(() => {
        setStepArray(wardArray);
    }, [wardArray]);

    const [patientDetailFactors, setPatientDetailFactors] = useState([
        {
            class: "vitals",
            component: Vitals,
            heading: "Vitals",
        },
        {
            class: "pointsToPonder",
            component: Medication,
            heading: "Points to Ponder",
        },
        {
            class: "consultants",
            component: Consultants,
            heading: "Consultants",
        },
    ]);
    const [activeFactor, setActiveFactor] = useState("vitals");

    const handleCancel = () => {
        openSummaryModal(false);
    };

    const activeFactorStyle = {
        color: "#ffffff",
        background: "#FF7529",
        padding: "0.1rem 2rem",
        height: "100%",
    };

    const factorStyle = {
        padding: "0.1rem 2rem",
        height: "100%",
    };

    // console.log(activeFactor);

    return (
        <div className="steps-info-body">
            <div className="wardDetails-info-box">
                {
                    // <div className="factors-heading">
                    //   <Button
                    //     onClick={() => {
                    //       setActiveFactor("vitals");
                    //     }}
                    //     style={
                    //       activeFactor === "vitals"
                    //         ? { ...activeFactorStyle, borderRadius: "8px 0px 0px 0px" }
                    //         : { ...factorStyle, borderRadius: "8px 0px 0px 0px" }
                    //     }
                    //     type="secondary"
                    //   >
                    //     Vitals
                    //   </Button>
                    //   <Button
                    //     onClick={() => {
                    //       openSummaryModal(!summaryModal);
                    //     }}
                    //     style={
                    //       summaryModal
                    //         ? { ...activeFactorStyle, borderRadius: "0px 0px 10px 0px" }
                    //         : { ...factorStyle, borderRadius: "0px 0px 10px 0px" }
                    //     }
                    //     type="secondary"
                    //   >
                    //     summary
                    //   </Button>
                    // </div>
                }

                {patientDetailFactors.map((item, index) => {
                    if (item.class === activeFactor) {
                        if (item.component)
                            return (
                                <React.Fragment key={index}>
                                    <item.component
                                        pid={pid}
                                        activeStep={activeStep}
                                        heading={item.heading}
                                        stepArray={stepArray}
                                        wardArray={stepArray}
                                        patient={patient}
                                    />
                                </React.Fragment>
                            );
                        else return null;
                    }
                })}
            </div>

            <Modal
                visible={summaryModal}
                title=""
                onCancel={handleCancel}
                footer={null}
                closable={true}
                width="100%"
                destroyOnClose={true}
                bodyStyle={{ height: "90vh" }}
                className="summary-modal"
            >
                <Summary stepArray={stepArray} />
            </Modal>
        </div>
    );
}

export default WardDetails;
