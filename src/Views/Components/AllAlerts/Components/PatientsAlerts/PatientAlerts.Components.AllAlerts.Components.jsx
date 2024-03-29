import React, { useState, useEffect } from "react";

import {
  Collapse,
  Button,
  Divider,
  Row,
  Col,
  Form,
  Select,
  Spin,
  Popover,
  Tag,
  Dropdown,
  Menu,
} from "antd";
import {
  CaretRightOutlined,
  CheckOutlined,
  TagOutlined,
  BellOutlined,
} from "@ant-design/icons";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Brush,
  ResponsiveContainer,
} from "recharts";

import "./PatientAlerts.Components.AllAlerts.Components.css";

import patientApi from "../../../../../Apis/patientApis";
import alertApi from "../../../../../Apis/alertApis";
import userApi from "../../../../../Apis/userApis";

const { Panel } = Collapse;

const { Option } = Select;

function PatientAlerts(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ecgData, setEcgData] = useState(null);

  const [tags, setTags] = useState(props.item.tags);
  const [tagLoading, isTagLoading] = useState(true);
  const [doctorList, setDoctorList] = useState(null);

  const [checkBtn, setCheckBtn] = useState(
    props.item.status === "close" ? true : false
  );
  const [tagBtn, setTagBtn] = useState(false);
  const [bellBtn, setBellBtn] = useState(false);

  const [alertEcgData, setAlertEcgData] = useState(null);

  const alertData = props.item;

  const checkBtnStyle = {
    border: "1px solid #86D283",
    color: "#86D283",
    background: "green",
  };

  const expiredBtnStyle = {
    background: "#7d7d7d",
    color: "white",
  };

  const tagBtnStyle = {
    border: "1px solid #FFD966",
    color: "#FFD966",
  };

  const bellBtnStyle = {
    border: "1px solid #FB2D77",
    color: "#FB2D77",
  };

  const editAcknowledged = () => {
    setCheckBtn(true);
    props.setOpenCount(props.openCount - 1);
    const data = {
      status: "close",
      text: "Raghav added a note",
      timeout: 14400,
    };

    alertApi
      .editAcknowledged(alertData.id, data)
      .then((res) => {
        console.log(res.data.response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const btnStyle = (status) => {
    if (checkBtn === true) return checkBtnStyle;
    if (props.parentCheckBtn === true) return checkBtnStyle;
    switch (status) {
      case "close":
        return checkBtnStyle;
      case "expired":
        return expiredBtnStyle;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (tagBtn === true) {
      userApi
        .getUserList()
        .then((res) => {
          console.log(res.data.response);
          const doctorsData = res.data.response?.users[0].filter(
            (item) => item.role.toLowerCase() === "doctor"
          );
          const Doctors = [];
          if (doctorsData.length > 0) {
            for (let i = 0; i < doctorsData.length; i++) {
              Doctors.push(
                <Option
                  value={doctorsData[i].fname + " " + doctorsData[i].lname}
                >
                  {doctorsData[i].fname + " " + doctorsData[i].lname}
                </Option>
              );
            }
          }
          console.log(doctorsData, Doctors);
          setDoctorList(Doctors);
          isTagLoading(false);
        })
        .catch((err) => {
          console.log(err);
          isTagLoading(false);
        });
    }
  }, [tagBtn]);

  const menu = (
    <Menu>
      {tags.map((item, index) => {
        if (index === 0) {
          return;
        }
        return (
          <Menu.Item>
            <a>Dr . {item}</a>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const onFinishTagging = (values) => {
    console.log(values);
    setTags(values.tags);
    const data = {
      tags: values.tags,
    };

    alertApi
      .addTags(props.item.id, data)
      .then((res) => {
        console.log(res.data.response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const tagContent = (
    <div style={{ width: "300px" }}>
      {tagLoading && (
        <Spin style={{ position: "relative", left: "40%", top: "30%" }} />
      )}
      {!tagLoading && (
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 18 }}
          name="basic"
          onFinish={onFinishTagging}
        >
          <Form.Item label="Tag Doctors" name="tags">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              defaultValue={tags}
              onChange={handleChange}
            >
              {doctorList}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button
              danger
              small
              onClick={() => {
                setTagBtn(!tagBtn);
              }}
            >
              Cancel
            </Button>
            <Button
              small
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setTagBtn(!tagBtn);
              }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );

  const genExtra = () => (
    <div
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
      style={{ marginRight: "15px" }}
    >
      <Button
        disabled={
          alertData.status === "expired" ||
          checkBtn === true ||
          props.parentCheckBtn === true
            ? true
            : false
        }
        style={btnStyle(alertData.status)}
        type="text"
        onClick={editAcknowledged}
      >
        <CheckOutlined />
      </Button>
      <Popover trigger="click" content={tagContent} visible={tagBtn}>
        <Button
          type="text"
          style={tagBtn ? tagBtnStyle : null}
          onClick={() => setTagBtn(!tagBtn)}
        >
          <TagOutlined />
        </Button>
      </Popover>
      {
        // <Button type="text" style={bellBtn ? bellBtnStyle : null} onClick={() => setBellBtn(!bellBtn)}>
        //     <BellOutlined />
        // </Button>
      }
    </div>
  );

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

  const panelHeader = () => (
    <div
      className="in-patient-alerts"
      style={{ display: "inline-flex", width: "70%" }}
    >
      <div
        className="patient-panel-header"
        style={{
          marginLeft: "3%",
          width: "42%",
        }}
      >
        <div className="patient-panel-header-heading">
          {props.item.type.slice(0, -11)}
          <br />
        </div>
        <div className="patient-panel-header-time">
          {to12HourFormat(props.item.firstRcvTm)}
        </div>
      </div>
      <div>
        <Divider
          type="vertical"
          style={{
            background: "black",
            height: "90%",
            opacity: "10%",
            display: "inline-block",
            margin: "4px 40px 8px 20px",
          }}
        ></Divider>
      </div>
      <div className="patient-panel-header-info">
        <div className="patient-panel-header-heading">
          {" "}
          {props.item.value ? <span>{props.item.value}</span> : null} <br />
        </div>
        <div className="patient-panel-header-time">
          {" "}
          {props.item.lastRcvTm.slice(1, 19)}{" "}
        </div>
      </div>
    </div>
  );
  //

  useEffect(() => {
    if (isOpen === true) {
      const receiveTime = new Date(alertData.firstRcvTm);
      const startTime = new Date(receiveTime.getTime() - 10000).toISOString();
      const endTime = new Date(receiveTime.getTime() + 10000).toISOString();
      patientApi
        .getEcgValue(alertData.pid, startTime, endTime)
        .then((res) => {
          setEcgData(res.data.response);
          console.log(res.data.response);
          let reqData = null;
          res.data?.response?.patient_sensor_data?.map((item) => {
            if (new Date(item.time) <= receiveTime) {
              reqData = item;
            }
          });
          setAlertEcgData(reqData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  let data = [];
  let brushStart = 0;

  if (!isLoading && ecgData) {
    ecgData?.patient_sensor_data.map((item, index) => {
      let array = item.ecg.split(/[ ,]+/);
      var intArr = [];
      if (item === alertEcgData) {
        brushStart = index * 128;
      }
      for (let i = 0; i < array.length; i++) intArr.push(parseInt(array[i]));
      data.push(...intArr);
      // console.log(item.ecg, array, intArr, data);
    });
  }

  let chartData = data.map((value, index) => {
    return {
      xData: index,
      yData: value,
    };
  });

  const cropNumbers = (num) => {
    return parseFloat(num).toFixed(1);
  };

  console.log(props.item, checkBtn, chartData);

  console.log(props, checkBtn);

  return (
    <Collapse
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      className="site-collapse-custom-collapse"
      expandIconPosition={"right"}
      key={props.parentKey + props.index}
      onChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <Panel
        key={props.parentKey + props.index}
        header={panelHeader()}
        className="site-collapse-custom-panel"
        extra={genExtra()}
        style={{
          borderRadius: "6px",
          border: "1px solid #C7C7C7",
          boxShadow: "0px 0px 20px 3px #6f6c6c0d",
          backgroundColor: "white",
          borderLeft: "6px Solid  #FB2D77",
        }}
      >
        {!isLoading &&
          (ecgData?.patient_sensor_data.length < 1 || ecgData === null) && (
            <div style={{ width: "100%", height: "200px" }}>
              <div
                className="no-alerts-div"
                style={{ position: "relative", fontSize: "32px" }}
              >
                <h1>GRAPH not available for this alert</h1>
              </div>
            </div>
          )}
        {!isLoading && ecgData?.patient_sensor_data.length > 1 && (
          <>
            <div style={{ width: "100%" }}>
              <div>
                <Row
                  span={24}
                  style={{
                    width: "90%",
                    marginTop: "13px",
                    marginLeft: "7%",
                  }}
                >
                  <Col span={14}>
                    <Row style={{ marginBottom: "6px" }}>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>SpO2 : </span>
                          {alertEcgData.spo2}
                        </p>
                      </Col>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>PI : </span>
                          {alertEcgData.pi}{" "}
                        </p>
                      </Col>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>PR : </span>
                          {alertEcgData.pr}{" "}
                        </p>
                      </Col>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>Temp :</span>{" "}
                          {cropNumbers(alertEcgData.temperature * (9 / 5) + 32)}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>HRMin :</span> {alertEcgData.hrMin}
                        </p>
                      </Col>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>HRMax :</span> {alertEcgData.hrMax}
                        </p>
                      </Col>
                      <Col className="alert-chart-infos" span={6}>
                        <p>
                          <span>AvgRR :</span> {alertEcgData.avgRR}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={10}>
                    <Row>
                      <Col className="alert-chart-infos" offset={2} span={4}>
                        <p>
                          <span>Tags :</span>
                        </p>
                      </Col>
                      {tags.length > 0 && (
                        <>
                          <Col offset={1} span={9}>
                            <Tag className="alert-doctor-tags" color="#E6F1FF">
                              Dr. {tags[0]}
                            </Tag>
                          </Col>
                          {tags.length > 1 && (
                            <Col
                              span={8}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Dropdown overlay={menu} placement="bottomCenter">
                                <Tag
                                  className="alert-doctor-tags"
                                  color="#E6F1FF"
                                >
                                  +{`${tags.length - 1} more`}
                                </Tag>
                              </Dropdown>
                            </Col>
                          )}
                        </>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
              <div
                className="body-chart"
                style={{ margin: "20px auto", height: "300px", width: "100%" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={200}
                    height={200}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="xData" hide={true} />
                    <YAxis
                      hide={true}
                      domain={["dataMin - 300", "dataMax + 200"]}
                    />
                    <Brush
                      dataKey="name"
                      height={30}
                      stroke="#686868"
                      startIndex={brushStart - 4 * 128}
                      endIndex={brushStart + 5 * 128}
                    />
                    <Line
                      type="monotone"
                      dataKey="yData"
                      dot={false}
                      strokeWidth={3}
                      animationDuration={8000}
                      stroke="#393939"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </Panel>
    </Collapse>
  );
}

export default PatientAlerts;
