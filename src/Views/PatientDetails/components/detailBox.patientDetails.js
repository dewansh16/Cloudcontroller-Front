import React from "react";
import Icons from "../../../Utils/iconMap";
import { Button } from "../../../Theme/Components/Button/button";
import { Row, Col } from "antd";
import "./detailBox.patientDetails.css";
import getAge from "../../../Utils/getAge";
import moment from "moment";

function DetailBox({ detailsBox, setDetailBox, patient }) {
    const handleGender = (gender) => {
        switch (gender) {
            case "male":
                return "Male";
            case "female":
                return "Female";
            case "other":
                return "Other";
            case "N/A":
                return "N/A";
            default:
                return null;
        }
    };

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    return (
        <div className="patient-details-body-box">
            <div className="patient-detail-closebox">
                <Button
                    style={{
                        padding: "0px",
                        height: "auto",
                        marginLeft: "5px",
                        position: "absolute",
                        right: "12px",
                        top: "14px",
                    }}
                    type="text"
                    onClick={() => {
                        setDetailBox(!detailsBox);
                    }}
                >
                    {Icons.closeCircleOutlined({})}
                </Button>
            </div>
            <div className="patient-detailbox">
                <Row>
                    <Col className="patient-detailbox-cols" span={12}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.radioFilledIcon({})}{" "}
                        </span>
                        Age : {getAge(new Date(), new Date(patient.demographic_map.DOB))}
                    </Col>
                    <Col className="patient-detailbox-cols" span={12}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.maleIcon({})}
                        </span>
                        {handleGender(patient.demographic_map.sex.slice(0, 7)) || " Male"}
                    </Col>
                    <Col className="patient-detailbox-cols" span={12}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.upDownArrowIcon({})}
                        </span>
                        {patient.demographic_map.height || "175"}cm
                    </Col>
                    <Col className="patient-detailbox-cols" span={12}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.weighingMachineIcon({})}
                        </span>
                        {patient.demographic_map.weight || "70"}kg
                    </Col>
                    <Col className="patient-detailbox-cols" span={24}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.calenderIcon({})}
                        </span>
                        Birth date: {patient.demographic_map.DOB}
                    </Col>
                    <Col className="patient-detailbox-cols" span={24}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.admittedOnIcon({})}
                        </span>
                        Admitted On: {patient.demographic_map.admission_date}
                    </Col>
                    <Col className="patient-detailbox-cols" span={24}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.admittedForIcon({})}
                        </span>
                        Admitted For:{" "}
                        {dateDiffInDays(
                            new Date(patient.demographic_map.admission_date),
                            patient.demographic_map.discharge_date
                                ? new Date(patient.demographic_map.discharge_date)
                                : new Date()
                        )}
                    </Col>
                    <Col className="patient-detailbox-cols" span={24}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.phoneIcon({})}
                        </span>
                        {patient.demographic_map.phone_contact}
                    </Col>
                    <Col className="patient-detailbox-cols" span={24}>
                        <span className="patient-detailbox-col-icon">
                            {Icons.homeIcon({})}
                        </span>{" "}
                        4/17 Kamp Road, GHY, MP-302001
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default DetailBox;
