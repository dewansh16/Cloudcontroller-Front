import React, { useState } from "react";
import { Row, Col, Divider } from "antd";
import Icons from "../../../Utils/iconMap";
import getAge from "../../../Utils/getAge";
import { useHistory } from "react-router-dom";
import NotesSection from "./notesSection";
import "./infoSection.css";
import { Button as Buttons } from "../../../Theme/Components/Button/button";

import Tooltip from "antd/lib/tooltip";

/**
 * Patient information section (sidebar)
 *
 * @param {any} props
 * @returns {JSX} react component
 */
export default function InfoBar(props) {
  let history = useHistory();
  // console.log(history);
  const [recentNote, setRecentNote] = useState(null);

  var patient = props.patient;

  const pushToEdit = () => {
    history.push(`/dashboard/patient/edit/${patient.demographic_map.pid}`);
  };

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

  const trimNotes = (note) => {
    return note.length > 58 ? note.slice(0, 55) + "..." : note;
  };

  const handleGender = (gender) => {
    switch (gender) {
      case "male":
        return "M";
      case "female":
        return "F";
      case "other":
        return "O";
      case "N/A":
        return "N/A";
      default:
        return null;
    }
  };

  const trimName = (name) => {
    if (name.length > 12) {
      return name.slice(0, 11) + "..";
    } else {
      return name;
    }
  };

  return (
    <>
      {props.activeInfoSection === "notes" ? (
        <NotesSection
          refreshFileView={props.refreshFileView}
          refreshFileViewAgain={props.refreshFileViewAgain}
          pid={props.pid}
          setRecentNote={setRecentNote}
        />
      ) : (
        <div
          style={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.05)",
            background: "#FFF",
            paddingTop: "2em",
            position: "absolute",
            width: "100%",
            marginBottom: "120px",
            zIndex: "3",
          }}
        >
          <Row justify="center" span={24}>
            <Col span={24}>
              <div
                style={{
                  display: "inline-flex",
                  justifyContent: "space-evenly",
                  width: "100%",
                  marginTop: "0.2rem",
                }}
              >
                <Buttons className="secondary" onClick={pushToEdit}>
                  Edit Details
                </Buttons>
                <Buttons
                  onClick={() => {
                    props.setInfoSection("notes");
                    props.setDoctorDrawerVisible(false);
                    props.setDrawerVisible(false);
                  }}
                  icon={Icons.edit({ Style: { color: "white" } })}
                >
                  Notes
                </Buttons>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="patient-detail-div">
                  <div>
                    <p>
                      {" "}
                      Age :{" "}
                      {getAge(
                        new Date(),
                        new Date(patient.demographic_map.DOB)
                      )}{" "}
                      {"/ " +
                        (handleGender(
                          patient.demographic_map.sex.slice(0, 7)
                        ) || " Male")}
                    </p>
                  </div>
                  <div>
                    <p>Admission: {patient.demographic_map.admission_date}</p>
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid #FB2D7720",
                    borderRadius: "6px",
                    display: "inline-flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: "0.5em 1em",
                    minWidth: "10.87em",
                    color: "#FB2D77",
                    fontSize: "15px",
                  }}
                >
                  {Icons.exclamationCircleOutlined({})}
                  <span>{patient.PatientState.state}</span>
                  <span>{patient.PatientState.EWS}</span>
                </div>
              </div>
            </Col>
            <Col span={24}>
              <Row justify="center" span={24} style={{ marginTop: "2em" }}>
                <Tooltip title="Click on the edit button to fill this field">
                  <Col span={8}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: "1em", color: "rgba(0,0,0,0.5" }}
                      >
                        Floor
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {patient.location_map.floor || "NA"}
                      </span>
                    </div>
                  </Col>
                </Tooltip>
                <Tooltip title="Click on the edit button to fill this field">
                  <Col span={8}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: "1em", color: "rgba(0,0,0,0.5" }}
                      >
                        Ward
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {patient.location_map.ward || "NA"}
                      </span>
                    </div>
                  </Col>
                </Tooltip>
                <Tooltip title="Click on the edit button to fill this field">
                  <Col span={8}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: "1em", color: "rgba(0,0,0,0.5" }}
                      >
                        Bed
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {patient.demographic_map?.patient_location_table
                          ?.bed_no || "NA"}
                      </span>
                    </div>
                  </Col>
                </Tooltip>
              </Row>
            </Col>
            <Divider />
            <Col
              span={24}
              style={{
                display: "inline-flex",
                justifyContent: "space-around",
                fontWeight: "600",
                color: "#143765",
              }}
            >
              <div className="popup-divs">
                <span style={{}}>Medical Staff</span>
                <Buttons
                  onClick={() => {
                    props.setDrawerVisible(false);
                    props.setDoctorDrawerVisible(!props.doctorDrawerVisible);
                  }}
                >
                  {Icons.rightArrowFilled({})}
                </Buttons>
              </div>
            </Col>
            <Divider />
            {
              //   <Col
              //   span={24}
              //   style={{
              //     display: "inline-flex",
              //     justifyContent: "space-around",
              //     fontWeight: "600",
              //     color: "#143765",
              //   }}
              // >
              //   <div className="popup-divs">
              //     <span style={{}}>Medical Care</span>
              //     <Buttons
              //       onClick={() => {
              //         props.setDoctorDrawerVisible(false);
              //         props.setDrawerVisible(!props.drawerVisible);
              //       }}
              //     >
              //       {Icons.rightArrowFilled({})}
              //     </Buttons>
              //   </div>
              // </Col>
              // <Divider />
            }
            <Col
              span={24}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: "600",
                color: "#143765",
              }}
            >
              <div
                style={{
                  margin: "0.6rem",
                  borderRadius: "6px",
                  fontSize: "14px",
                  width: "90%",
                  maxHeight: "9rem",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    marginBottom: " 10px",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      position: " relative",
                      top: "-14px",
                      left: " 5px",
                      fontSize: " 0.9rem",
                      margin: " 0 0 -1rem 0",
                      letterSpacing: " 1px",
                      background: "white",
                      width: "max-content",
                      padding: " 0 1rem",
                    }}
                  >
                    <span>Recent Notes</span>
                  </div>
                  {recentNote === null &&
                  patient.demographic_map?.note?.useruuid.length > 0 ? (
                    <div className="quickinfo-notes">
                      <div className="quickinfo-notes-header">
                        <div>
                          <p>
                            {" "}
                            Posted by:{" "}
                            <span style={{ opacity: "0.4" }}>
                              {trimName(
                                patient.demographic_map?.note?.useruuid[0]
                                  .fname +
                                  " " +
                                  patient.demographic_map?.note?.useruuid[0]
                                    .lname
                              )}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            {to12HourFormat(
                              patient.demographic_map?.note?.date
                            )}
                          </p>
                        </div>
                      </div>
                      {patient.demographic_map?.note?.pracuuid.length > 0 &&
                        patient.demographic_map?.note?.useruuid[0]
                          ?.user_uuid !==
                          patient.demographic_map?.note?.pracuuid[0]
                            ?.user_uuid && (
                          <div style={{ opacity: "0.6" }}>
                            <div>
                              <p>
                                {" "}
                                Advisor :{" "}
                                <span style={{ opacity: "0.4" }}>
                                  {patient.demographic_map?.note?.pracuuid[0]
                                    ?.fname +
                                    " " +
                                    patient.demographic_map?.note?.pracuuid[0]
                                      ?.lname}
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      <div className="quickinfo-notes-body">
                        <p>
                          {patient.demographic_map?.note !== null
                            ? patient.demographic_map?.note?.note?.slice(-5) ===
                              "<img>"
                              ? trimNotes(
                                  patient.demographic_map?.note?.note?.slice(
                                    0,
                                    -5
                                  )
                                )
                              : trimNotes(patient.demographic_map?.note?.note)
                            : "No notes to show"}
                        </p>
                      </div>
                    </div>
                  ) : recentNote !== null ? (
                    <div className="quickinfo-notes">
                      <div
                        style={{ marginBottom: "0px", opacity: "0.6" }}
                        className="quickinfo-notes-header"
                      >
                        <div>
                          <p>
                            {" "}
                            Posted by:{" "}
                            <span style={{ opacity: "0.4" }}>
                              {trimName(recentNote.pb)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>{to12HourFormat(recentNote.time)}</p>
                        </div>
                      </div>
                      {recentNote.dr !== null &&
                        recentNote.dr !== recentNote.pb && (
                          <div style={{ opacity: "0.6" }}>
                            <div>
                              <p>
                                {" "}
                                Advisor :{" "}
                                <span style={{ opacity: "0.4" }}>
                                  {recentNote.dr}
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      <div className="quickinfo-notes-body">
                        <p>
                          {recentNote.note.slice(-5) === "<img>"
                            ? trimNotes(recentNote.note.slice(0, -5))
                            : trimNotes(recentNote.note)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="quickinfo-notes-body">
                      <p>No notes to show</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}
