import React, { useState } from "react";
import { Row, Col } from "antd";
import "./summary.patientJourney.css";
import { Button } from "../../../Theme/Components/Button/button";
import TempGraph from "../summaryGraphs/tempGraph.SummaryPatientJourney";
import Spo2Graph from "../summaryGraphs/spo2Graph.SummaryPatientJourney";
import BpGraph from "../summaryGraphs/bpGraph.summaryPatientJourney";

function Summary({ stepArray }) {
  const [activeHeader, setActiveHeader] = useState("temp");

  const [activeGraph, setActiveGraph] = useState([
    {
      class: "temp",
      name: "Temperature",
      component: TempGraph,
      graphValues: stepArray.map((item) => {
        return {
          name: item.name,
          value: item.deviceData.temp,
        };
      }),
    },
    {
      class: "spo2",
      name: "SPO2",
      component: Spo2Graph,
      graphValues: stepArray.map((item) => {
        return {
          name: item.name,
          value: item.deviceData.spo2,
        };
      }),
    },
    {
      class: "bp",
      name: "Blood Pressure",
      component: BpGraph,
      graphValues: stepArray.map((item) => {
        return {
          name: item.name,
          bph: item.deviceData.bph,
          bpl: item.deviceData.bpl,
        };
      }),
    },
    {
      class: "rr",
      name: "Respiration Rate",
      component: Spo2Graph,
      graphValues: stepArray.map((item) => {
        return {
          name: item.name,
          value: item.deviceData.rr,
        };
      }),
    },
    {
      class: "hr",
      name: "Heart Rate",
      component: Spo2Graph,
      graphValues: stepArray.map((item) => {
        return {
          name: item.name,
          value: item.deviceData.hr,
        };
      }),
    },
  ]);

  const editWardName = (step) => {
    if (step?.name === undefined) {
      return null;
    } else if (step?.name.length > 12) return step?.name.slice(0, 12) + ".";
    else return step?.name;
  };

  const headerButtonStyle = {
    border: "2px solid #CBCBCE",
    borderRadius: "10px",
    color: "#000000",
    width: "90%",
    height: "100%",
    maxHeight: "44px",
  };

  const activeHeaderStyle = {
    border: "2px solid #FF7529",
    borderRadius: "10px",
    color: "#FF7529",
    width: "90%",
    height: "100%",
    maxHeight: "44px",
  };

  const activeColStyle = {
    backgroundColor: "white",
    backgroundImage:
      "linear-gradient(180deg, rgba(252, 181, 143, 0.4) 0%, #FFFDFC 100%)",
    backgroundSize: "90% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
  };

  return (
    <div style={{ height: "100%" }}>
      <div className="pj-summary-header">
        <h1>Summary</h1>
      </div>
      <div className="pj-summary-body">
        <Row style={{ height: "100%" }}>
          <Col span={16} style={{ height: "100%", overflow: "auto" }}>
            <Row style={{ height: "10%" }}>
              <Col span={4} className="pj-summary-header-col"></Col>
              <Col span={4} className="pj-summary-header-col">
                <Button
                  onClick={() => {
                    setActiveHeader("temp");
                  }}
                  type="secondary"
                  style={
                    activeHeader == "temp"
                      ? activeHeaderStyle
                      : headerButtonStyle
                  }
                >
                  Temp
                </Button>
              </Col>
              <Col span={4} className="pj-summary-header-col">
                <Button
                  onClick={() => {
                    setActiveHeader("spo2");
                  }}
                  type="secondary"
                  style={
                    activeHeader == "spo2"
                      ? activeHeaderStyle
                      : headerButtonStyle
                  }
                >
                  SPO2
                </Button>
              </Col>
              <Col span={4} className="pj-summary-header-col">
                <Button
                  onClick={() => {
                    setActiveHeader("rr");
                  }}
                  type="secondary"
                  style={
                    activeHeader == "rr" ? activeHeaderStyle : headerButtonStyle
                  }
                >
                  RR
                </Button>
              </Col>
              <Col span={4} className="pj-summary-header-col">
                <Button
                  onClick={() => {
                    setActiveHeader("hr");
                  }}
                  type="secondary"
                  style={
                    activeHeader == "hr" ? activeHeaderStyle : headerButtonStyle
                  }
                >
                  HR
                </Button>
              </Col>
              <Col span={4} className="pj-summary-header-col">
                <Button
                  onClick={() => {
                    setActiveHeader("bp");
                  }}
                  type="secondary"
                  style={
                    activeHeader == "bp" ? activeHeaderStyle : headerButtonStyle
                  }
                >
                  BP
                </Button>
              </Col>
            </Row>
            <Row className="pj-summary-table-body">
              <Col span={4}>
                {stepArray.map((item, index) => {
                  return (
                    <Row className="pj-summary-table-Row">
                      <Col
                        className="pj-summary-table-Row-header-Col"
                        span={24}
                      >
                        <h1>{editWardName(item)}</h1>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
              <Col
                style={activeHeader === "temp" ? activeColStyle : null}
                className="pj-summary-table-Col"
                span={4}
              >
                {stepArray.map((item, index) => {
                  return (
                    <Row className="pj-summary-table-Row">
                      <Col
                        style={{ color: "#06A400" }}
                        className={
                          index === stepArray.length - 1
                            ? "pj-summary-table-Row-value-last-Col"
                            : "pj-summary-table-Row-value-Col"
                        }
                        span={24}
                      >
                        <p>{item.deviceData.temp}</p>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
              <Col
                style={activeHeader === "spo2" ? activeColStyle : null}
                className="pj-summary-table-Col"
                span={4}
              >
                {stepArray.map((item, index) => {
                  return (
                    <Row className="pj-summary-table-Row">
                      <Col
                        style={{ color: "#06A400" }}
                        className={
                          index === stepArray.length - 1
                            ? "pj-summary-table-Row-value-last-Col"
                            : "pj-summary-table-Row-value-Col"
                        }
                        span={24}
                      >
                        <p>{item.deviceData.spo2}</p>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
              <Col
                style={activeHeader === "rr" ? activeColStyle : null}
                className="pj-summary-table-Col"
                span={4}
              >
                {stepArray.map((item, index) => {
                  return (
                    <Row className="pj-summary-table-Row">
                      <Col
                        style={{ color: "#06A400" }}
                        className={
                          index === stepArray.length - 1
                            ? "pj-summary-table-Row-value-last-Col"
                            : "pj-summary-table-Row-value-Col"
                        }
                        span={24}
                      >
                        <p>{item.deviceData.rr}</p>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
              <Col
                style={activeHeader === "hr" ? activeColStyle : null}
                className="pj-summary-table-Col"
                span={4}
              >
                {stepArray.map((item, index) => {
                  return (
                    <Row className="pj-summary-table-Row">
                      <Col
                        style={{ color: "#06A400" }}
                        className={
                          index === stepArray.length - 1
                            ? "pj-summary-table-Row-value-last-Col"
                            : "pj-summary-table-Row-value-Col"
                        }
                        span={24}
                      >
                        <p>{item.deviceData.hr}</p>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
              <Col
                style={activeHeader === "bp" ? activeColStyle : null}
                className="pj-summary-table-Col"
                span={4}
              >
                {stepArray.map((item, index) => {
                  return (
                    <Row className="pj-summary-table-Row">
                      <Col
                        style={{ color: "#06A400" }}
                        className={
                          index === stepArray.length - 1
                            ? "pj-summary-table-Row-value-last-Col"
                            : "pj-summary-table-Row-value-Col"
                        }
                        span={24}
                      >
                        <p>
                          {item.deviceData?.bph + "/"}
                          {item.deviceData?.bpl}
                        </p>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
          </Col>
          <Col
            span={8}
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <div className="pj-summary-graph-box">
              {activeGraph.map((item) => {
                if (item.class === activeHeader) {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="pj-summary-graph-header"
                      >
                        <h1>{item.name}</h1>
                      </div>
                      <item.component graphValues={item.graphValues} />
                    </>
                  );
                }
              })}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Summary;
