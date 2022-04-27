import React, { useEffect, useState } from "react";
import { Button } from "../../../Theme/Components/Button/button";

import Icons from "../../../Utils/iconMap";

import { Input, InputNumber } from "../../../Theme/Components/Input/input";
import { Select, SelectOption } from "../../../Theme/Components/Select/select";
import TertiaryMenu from "../../../Theme/Components/Menu/Tertiary/menu";
import Toggle from "../../../Theme/Components/Toggle/toggle";
import { Slider } from "../../../Theme/Components/Slider/slider";

import { RecordTypeSelector } from "./Components/components";

import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Form from "antd/lib/form";
import Spin from "antd/lib/spin";
import notification from "antd/lib/notification";
import Modal from "antd/lib/modal";
import AntdTooltip from "antd/lib/tooltip";
import Collapse from "antd/lib/collapse";

import { useHistory } from "react-router-dom";
import { createClassName } from "../../../Theme/utility";
import patientApi from "../../../Apis/patientApis";
import userApi from "../../../Apis/userApis";
import { UserStore } from "../../../Stores/userStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./vitals.css";

const createVitalName = (name) => {
  const changedName = name.replace("_", " ");
  return changedName[0].toUpperCase() + changedName.slice(1);
};

const { Panel } = Collapse;

function getCurrentTime(dateTime) {
  let time = new Date(dateTime);
  return `${time.getHours()}:${time.getMinutes()} HRS`;
}

function getCurrentDate(dateTime) {
  let dateInstance = new Date(dateTime);
  const month = dateInstance.toLocaleString("default", { month: "long" });
  const date = dateInstance.getDate();

  return `${date}, ${month}`;
}

function FetchUser_self() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getMyself()
      .then((res) => {
        setResponse(res.data.response["users"][0]);
        setLoading(false);
      })
      .catch((err) => {
        if (err) {
          notification.error({
            message: "Error",
            description: `${err.response?.data.result}` || "",
          });
          setLoading(false);
        }
      });
  }, []);
  return [response, loading];
}

function CreateGraphData(pid, graphType, numberOfRecords) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    patientApi
      .getPatientVitals(pid)
      .then((res) => {
        const vitals = res.data.response.vitals;
        let graphData = [];
        const max =
          numberOfRecords > vitals.length ? vitals.length : numberOfRecords;
        for (let i = 0; i < max; i++) {
          let date = getCurrentDate(vitals[i]["date"]);
          let tempData = {};
          tempData["name"] = date;
          tempData[graphType] = vitals[i][graphType];
          graphData.push(tempData);
        }
        setData([...graphData.reverse()]);
        setResponse(vitals);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          notification.error({
            message: "Error",
            description: err || "",
          });
          setLoading(false);
        }
      });
  }, [pid, graphType, numberOfRecords]);
  return [response, data, loading];
}

function FetchVitals(pid) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi
      .getPatientVitals(pid)
      .then((res) => {
        setResponse(res.data.response.vitals);
        setLoading(false);
      })
      .catch((err) => {
        if (err) {
          notification.error({
            message: "Error",
            description: `${err.response?.data.result}` || "",
          });
          setLoading(false);
        }
      });
  }, [pid]);
  return [response, loading];
}

function FetchVitalThresholds(pid) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi
      .getVitalThreshold(pid)
      .then((res) => {
        setResponse(res.data.response.vitalth);
        setLoading(false);
      })
      .catch((err) => {
        if (err) {
          notification.error({
            message: "Error",
            description: `${err.response?.data.result}` || "",
          });
          setLoading(false);
        }
      });
  }, [pid]);
  return [response, loading];
}

function AddVitals(pid, data) {
  patientApi
    .addPatientVitals(pid, data)
    .then((res) => {
      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: res.message,
        });
      } else {
        notification.info({
          message: "Something went wrong",
          description: res.message,
        });
      }
    })
    .catch((err) => {
      if (err) {
        notification.error({
          message: "Error",
          description: `${err.response?.data.result}` || "",
        });
      }
    });
}

function AddVitalThreshold(pid, data) {
  patientApi
    .addVitalThreshold(pid, data)
    .then((res) => {
      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: "Vital threshold added successfully",
        });
      } else {
        notification.info({
          message: "Something went wrong",
          description: res.message,
        });
      }
    })
    .catch((err) => {
      if (err) {
        notification.error({
          message: "Error",
          description: `${err.response?.data.result}` || "",
        });
      }
    });
}

export default function Vitals({
  pid,
  setComponentSupportContent,
  setEmrView,
  patient,
}) {
  let history = useHistory();
  const backToPatientDetails = () => {
    // the below code to always redirect to
    history.push(`/dashboard/patient/details/${pid}`);
    // history.goBack()
  };

  const [user, userDataLoading] = FetchUser_self();
  const VitalAdd = () => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
      // const data = {
      //     height: 5.10,
      //     weight: 81.0,
      //     spo2: "99",
      //     temperature: 99.0,
      //     pulse: "74",
      //     respiration: 3.5,
      //     bpd: "70",
      //     bps: "100",
      // }
      values["user"] = user.fname;
      AddVitals(pid, values);
    };

    const onFinishFailed = () => {
      notification.error({
        message: "Error",
        description: `Vitals cannot be added. All fields required.`,
      });
    };

    const syncDataFromSensors = () => {
      notification.info({
        message: "Not Connected",
        description: `The sensors are not yet connected`,
      });
      form.setFieldsValue({
        height: 5.1,
        weight: 81.0,
        spo2: "99",
        temperature: 99.0,
        pulse: 74,
        respiration: 3.5,
        bpd: "70",
        bps: "100",
        pain_index: "3",
      });
    };

    const menuData = [
      {
        title: "Basic Vitals",
        returnOnSelect: {
          position: 0,
          component: (
            <div className="vitals-add-form">
              <Form
                form={form}
                layout="vertical"
                name="Add Vitals"
                initialValues={{ remember: true }}
                className="myform"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                {/* currentDrug */}
                <Row gutter={[24, 24]} justify="space-between">
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Height"
                      name="height"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        max={10}
                        placeholder="in feet"
                        formatter={(value) => `${value}feet`}
                        parser={(value) => value.replace("feet", "")}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Weight"
                      name="weight"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="in kg"
                        formatter={(value) => `${value}kg(s)`}
                        parser={(value) => value.replace("kg(s)", "")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]} justify="space-between">
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="SpO2"
                      name="spo2"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      {
                        // <InputNumber
                        // placeholder="in %"
                        // formatter={value => `${value}%`}
                        // parser={value => value.replace('%', '')}
                        // />
                      }
                      <Input
                        placeholder="in %"
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Temperature"
                      name="temperature"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="in Fahrenheit"
                        formatter={(value) => `${value}F`}
                        parser={(value) => value.replace("F", "")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]} justify="space-between">
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Heart Rate"
                      name="pulse"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="in BPM"
                        formatter={(value) => `${value}BPM`}
                        parser={(value) => value.replace("BPM", "")}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Respiration Rate"
                      name="respiration"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="in BPM"
                        formatter={(value) => `${value}BPM`}
                        parser={(value) => value.replace("BPM", "")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]} justify="space-between">
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Blood Pressure Diastolic (BPD)"
                      name="bpd"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <Input
                        placeholder="in mmHg"
                        formatter={(value) => `${value}mmHg`}
                        parser={(value) => value.replace("mmHg", "")}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Blood Pressure Systolic (BPS)"
                      name="bps"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <Input
                        placeholder="in mmHg"
                        formatter={(value) => `${value}mmHg`}
                        parser={(value) => value.replace("mmHg", "")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]} justify="space-between">
                  <Col style={{}} span={12}>
                    <Form.Item
                      required={false}
                      label="Pain Index"
                      name="pain_index"
                      rules={[
                        {
                          required: true,
                          message: "required",
                        },
                      ]}
                    >
                      <Input placeholder="0-10" />
                    </Form.Item>
                  </Col>
                  <Col style={{}} span={12}></Col>
                </Row>
                <Row
                  style={{ marginTop: "2rem" }}
                  gutter={[24, 24]}
                  justify="space-between"
                >
                  <Col style={{}} span={6}>
                    {/* TODO: add the sync back when required after alpha */}
                    {/* <Form.Item>
                                        <AntdTooltip
                                            overlayStyle={{ borderRadius: "6px" }}
                                            overlayInnerStyle={{ color: "rgba(255, 255, 255, 1)" }}
                                            color="rgba(53, 53, 53, 1)"
                                            title="autofill by fetching from sensors"
                                        >
                                            <Button
                                                onClick={syncDataFromSensors}
                                                style={{ width: "100%" }}
                                                type="tertiary"
                                            >
                                                Sync
                                            </Button>
                                        </AntdTooltip>
                                    </Form.Item> */}
                  </Col>
                  <Col style={{}} span={6}>
                    <Form.Item>
                      <Button
                        style={{ width: "100%" }}
                        htmlType="submit"
                        type="primary-outlined"
                      >
                        Add
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          ),
        },
      },
      // {
      //     title: "Eye",
      //     returnOnSelect: {
      //         position: 1,
      //         component: "Eye add vitals"
      //     }
      // }
    ];

    const [vitalsAddFormComponent, setVitalsAddFormComponent] = useState(
      menuData[0]["returnOnSelect"]
    );

    return (
      <div className="vitals-add-container">
        <div className="vitals-add-menu">
          <TertiaryMenu
            returnOnSelect={setVitalsAddFormComponent}
            menuData={menuData}
            state={0}
          />
        </div>
        {vitalsAddFormComponent.component}
      </div>
    );
  };

  const VitalView = () => {
    const [vitalsViewSupportContent, setVitalsViewSupportContent] =
      useState(null);

    const VitalsListView = () => {
      const [vitals, isLoading] = FetchVitals(pid);

      useEffect(() => {
        setVitalsViewSupportContent();
        // TODO: add this back alfter alpha
        // <Col style={{ margin: "0 1rem 0 1rem", alignItems: "center", height: "100%" }} span={12}>
        //     <Input placeholder="search" suffixIcon={Icons.searchIcon({})} />
        // </Col>
        return () => {
          setVitalsViewSupportContent(null);
        };
      }, []);

      function CollapsePanel(vital, id) {
        const IconMap = {
          tablet: Icons.medicineBox({}),
        };

        // const monthMap = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        // const dateModified_ = new Date(prescription["date_modified"])
        // const endDate_ = new Date(prescription["end_date"])

        // const dateModified = `${dateModified_.getDate()} ${monthMap[dateModified_.getMonth()]}, ${dateModified_.getFullYear()}`
        // const endDate = `${endDate_.getDate()} ${monthMap[endDate_.getMonth()]}, ${endDate_.getFullYear()}`

        return (
          <Panel
            className="collapse-panel"
            header={
              <div className="vitals-list-item">
                <div className="vital-info">
                  <p>
                    <span style={{ opacity: "0.5" }}>Recorded on: </span>
                    {`${vital.date.slice(0, 10)}`}
                  </p>
                  <p>
                    <span style={{ opacity: "0.5" }}>By: </span>
                    {`${vital.user}`}
                  </p>
                </div>
                <div className="vital-details">
                  <ul>
                    <li>SpO2: {vital.spo2}</li>
                    <li>Respiration: {vital.respiration}</li>
                    <li>Pulse: {vital.pulse}</li>
                    <span style={{ color: "rgba(253, 252, 251, 1)" }}>...</span>
                  </ul>
                </div>
              </div>
            }
            key={id}
          >
            <table style={{ width: "100%" }}>
              {Object.keys(vital).map((element, id) => {
                return (
                  <Row
                    key={id}
                    className="vitals-list-item-tr"
                    gutter={[24, 24]}
                    style={{ width: "100%" }}
                  >
                    <Col
                      className="vitals-list-item-td"
                      span={3}
                      style={{ padding: "0.5rem 0" }}
                    ></Col>
                    <Col
                      className="vitals-list-item-td"
                      span={6}
                      style={{
                        padding: "0.5rem 0",
                        color: "rgba(253, 252, 251, 0.5)",
                      }}
                    >
                      {createVitalName(element)}
                    </Col>
                    <Col
                      className="vitals-list-item-td"
                      span={15}
                      style={{ padding: "0.5rem 0" }}
                    >{`${vital[element]}`}</Col>
                  </Row>
                );
              })}
            </table>
          </Panel>
        );
      }

      return (
        <div style={{ height: "100%", background: "#fff" }}>
          {isLoading ? (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin />
            </div>
          ) : vitals.length > 0 ? (
            <Collapse
              className="vitals-list-collapse"
              expandIconPosition="right"
              style={{
                overflowY: "scroll",
                padding: "1rem",
                maxHeight: "calc(80vh - 12.7rem)",
                margin: "1rem 2rem 1rem 2rem",
                background: "#fff",
              }}
              expandIcon={({ isActive }) =>
                Icons.downArrowFilled({
                  style: { color: "#ffffff" },
                  rotate: isActive ? 180 : 0,
                })
              }
            >
              {vitals.map((vital, id) => {
                return CollapsePanel(vital, id);
              })}
            </Collapse>
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "87px",
                  opacity: 0.15,
                  padding: 0,
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: "500",
                }}
              >
                No Vitals
              </h1>
            </div>
          )}
        </div>
      );
    };

    const VitalsGraphView = () => {
      const [numberOfRecords, setNumberOfRecords] = useState(7);
      const [recordType, setRecordType] = useState([
        "spo2",
        "height",
        "weight",
        "temperature",
        "bpd",
        "bps",
        "pain_index",
        "respiration",
        "pulse",
      ]);

      const graphTypes = [
        "spo2",
        "height",
        "weight",
        "temperature",
        "bpd",
        "bps",
        "pain_index",
        "respiration",
        "pulse",
      ];
      const [currentGraphType, setCurrentGraphType] = useState(graphTypes[0]);
      const [vitals, data, isLoading] = CreateGraphData(
        pid,
        currentGraphType,
        numberOfRecords
      );

      useEffect(() => {
        setVitalsViewSupportContent(
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
              span={16}
            >
              <Select
                style={{ margin: "0 1rem 0 1rem" }}
                defaultValue={7}
                onChange={(e) => setNumberOfRecords(e)}
              >
                <SelectOption value={7}>Last 7 Records</SelectOption>
                <SelectOption value={5}>Last 5 Records</SelectOption>
                <SelectOption value={3}>Last 3 Records</SelectOption>
              </Select>
            </Col>
            <Col
              style={{ padding: "0 2rem 0 2rem", alignItems: "center" }}
              span={24}
            >
              <RecordTypeSelector
                menuListItems={graphTypes}
                defaultState={currentGraphType}
                callBack={setCurrentGraphType}
              />
            </Col>
          </>
        );
        return () => {
          setVitalsViewSupportContent(null);
        };
      }, [currentGraphType, numberOfRecords, data]);

      return isLoading ? (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <LineChart
            width={900}
            height={450}
            data={data}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
            <YAxis dataKey={currentGraphType} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={currentGraphType}
              stroke="#FF7529"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      );
    };

    const toggleOptions = [
      {
        title: "List",
        returnOnSelect: {
          component: <VitalsListView />,
        },
      },
      {
        title: "Graph",
        returnOnSelect: {
          component: <VitalsGraphView />,
        },
      },
    ];
    const state = 0;
    const [currentState, setCurrentState] = useState(
      toggleOptions[state]["returnOnSelect"]
    );

    return (
      <div className="vitals-view-container">
        <Row
          gutter={[24, 24]}
          style={{ alignItems: "center", justifyContent: "flex-start" }}
        >
          <Col style={{ margin: "0 1rem 0 1rem" }} span={6}>
            <Toggle
              options={toggleOptions}
              returnOnSelect={setCurrentState}
              state={state}
            />
          </Col>
          {vitalsViewSupportContent}
        </Row>
        <div className="vitals-view-display">{currentState.component}</div>
      </div>
    );
  };

  const VitalThreshold = () => {
    const [addThresholdForm] = Form.useForm();
    const onFinish = (values) => {
      const user = UserStore.getUser();
      let data = {};
      data["pid"] = pid;
      data["tenant_uuid"] = user.tenant;
      // data["weight_min"] = ""
      // data["weight_max"] = ""
      Object.keys(values).map((field) => {
        if (values[field].type === "float") {
          data[`min_${field}`] = parseFloat(values[field].value[0]);
          data[`max_${field}`] = parseFloat(values[field].value[1]);
        } else {
          data[`${field}_min`] = `${values[field].value[0]}`;
          data[`${field}_max`] = `${values[field].value[1]}`;
        }
      });
      AddVitalThreshold(pid, data);
    };

    const onFinishFailed = () => {
      notification.error({
        message: "Error",
        description: "Threshold cannot be updated. All fields required.",
      });
    };

    const [formData, setFormData] = useState({
      spo2: {
        label: "SpO2",
        value: [96, 100],
        range: [0, 100],
        unit: "%",
        type: "float",
      },
      temp: {
        label: "Temperature",
        value: [95, 99],
        range: [0, 106],
        unit: "Fahrenheit",
        type: "float",
      },
      hr: {
        label: "Heart Rate",
        value: [60, 100],
        range: [0, 200],
        unit: "BPM",
        type: "float",
      },
      rr: {
        label: "Respiration Rate",
        value: [20, 25],
        range: [0, 60],
        unit: "BPM",
        type: "float",
      },
      bps: {
        label: "Blood Pressure Systolic",
        value: [110, 130],
        range: [0, 400],
        unit: "mmHg",
        type: "string",
      },
      bpd: {
        label: "Blood Pressure Diastolic",
        value: [65, 85],
        range: [0, 300],
        unit: "mmHg",
        type: "string",
      },
    });

    addThresholdForm.setFieldsValue({ ...formData });

    return (
      <Form
        style={{ padding: "2rem", width: "100%" }}
        form={addThresholdForm}
        layout="vertical"
        name="addThresholdForm"
        initialValues={{ remember: true }}
        className="myform"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[24, 24]} justify="space-between">
          {Object.keys(formData).map((item, id) => {
            return (
              <Col key={id} style={{}} span={12}>
                <Form.Item
                  required={false}
                  label={`${formData[item].label}`}
                  name={item}
                  rules={[
                    {
                      required: true,
                      message: "required",
                    },
                  ]}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{ display: "inline-block", fontWeight: "medium" }}
                    >
                      Min:{" "}
                      <Input
                        style={{ width: "4rem" }}
                        onChange={(e) => {
                          formData[item].value[0] =
                            e.target.value || formData[item].range[0];
                          setFormData({ ...formData });
                          addThresholdForm.setFieldsValue({ ...formData });
                        }}
                        value={formData[item].value[0]}
                      />
                    </span>
                    <span
                      style={{ display: "inline-block", fontWeight: "medium" }}
                    >
                      Max:{" "}
                      <Input
                        style={{ width: "4rem" }}
                        onChange={(e) => {
                          formData[item].value[1] =
                            e.target.value || formData[item].range[1];
                          setFormData({ ...formData });
                          addThresholdForm.setFieldsValue({ ...formData });
                        }}
                        value={formData[item].value[1]}
                      />
                    </span>
                  </div>
                  <Slider
                    onChange={(e) => {
                      formData[item].value = e;
                      setFormData({ ...formData });
                      addThresholdForm.setFieldsValue({ ...formData });
                    }}
                    min={formData[item].range[0]}
                    max={formData[item].range[1]}
                    range
                    value={[formData[item].value[0], formData[item].value[1]]}
                  />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        <Row gutter={[24, 24]} justify="space-between">
          <Col style={{}} span={12}></Col>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            span={12}
          >
            <Form.Item>
              <Button htmlType="submit" type="primary-outlined">
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  const VitalThresholdView = () => {
    const [vitalthresholds, isLoading] = FetchVitalThresholds(pid);

    function CollapsePanel(threshold, id) {
      const IconMap = {
        tablet: Icons.medicineBox({}),
      };

      // const monthMap = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      // const dateModified_ = new Date(prescription["date_modified"])
      // const endDate_ = new Date(prescription["end_date"])

      // const dateModified = `${dateModified_.getDate()} ${monthMap[dateModified_.getMonth()]}, ${dateModified_.getFullYear()}`
      // const endDate = `${endDate_.getDate()} ${monthMap[endDate_.getMonth()]}, ${endDate_.getFullYear()}`

      return (
        <Panel
          className="collapse-panel"
          header={
            <div className="vitals-list-item">
              <div className="vital-info">
                <p>
                  <span style={{ opacity: "0.5" }}>Recorded on: </span>
                  {`${threshold.createdAt.slice(0, 10)}`}
                </p>
                {/* <p><span style={{ opacity: "0.5" }}>By: </span>{`${vitalthresholds.user}`}</p> */}
              </div>
              <div className="vital-details">
                <ul>
                  <li>Min Temp: {threshold.min_temp}</li>
                  <li>Min HR: {threshold.min_hr}</li>
                  <li>Min Resp: {threshold.min_rr}</li>
                  <span style={{ color: "rgba(253, 252, 251, 1)" }}>...</span>
                </ul>
              </div>
            </div>
          }
          key={id}
        >
          <table style={{ width: "100%" }}>
            {Object.keys(threshold).map((element, id) => {
              return (
                <Row
                  key={id}
                  className="vitals-list-item-tr"
                  gutter={[24, 24]}
                  style={{ width: "100%" }}
                >
                  <Col
                    className="vitals-list-item-td"
                    span={3}
                    style={{ padding: "0.5rem 0" }}
                  ></Col>
                  <Col
                    className="vitals-list-item-td"
                    span={6}
                    style={{
                      padding: "0.5rem 0",
                      color: "rgba(253, 252, 251, 0.5)",
                    }}
                  >
                    {createVitalName(element)}
                  </Col>
                  <Col
                    className="vitals-list-item-td"
                    span={15}
                    style={{ padding: "0.5rem 0" }}
                  >{`${threshold[element]}`}</Col>
                </Row>
              );
            })}
          </table>
        </Panel>
      );
    }

    return (
      <div style={{ height: "100%", background: "#fff" }}>
        {isLoading ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin />
          </div>
        ) : vitalthresholds.length > 0 ? (
          <Collapse
            className="vitals-list-collapse"
            expandIconPosition="right"
            style={{
              overflowY: "scroll",
              padding: "1rem",
              maxHeight: "calc(80vh - 8.7rem)",
              margin: "0 2rem 0 2rem",
              background: "#fff",
            }}
            expandIcon={({ isActive }) =>
              Icons.downArrowFilled({
                style: { color: "#ffffff" },
                rotate: isActive ? 180 : 0,
              })
            }
          >
            {vitalthresholds.map((threshold, id) => {
              return CollapsePanel(threshold, id);
            })}
          </Collapse>
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "87px",
                opacity: 0.15,
                padding: 0,
                color: "rgba(0, 0, 0, 0.85)",
                fontWeight: "500",
              }}
            >
              No Vital Thresholds
            </h1>
          </div>
        )}
      </div>
    );
  };

  const vitalsComponentsList = [
    {
      name: "Add",
      component: <VitalAdd />,
    },
    {
      name: "View",
      component: <VitalView />,
    },
    {
      name: "Threshold",
      component: <VitalThreshold />,
    },
    {
      name: "Threshold History",
      component: <VitalThresholdView />,
    },
  ];

  const defaultState = 1;
  const [currentState, setCurrentState] = useState(defaultState);

  useEffect(() => {
    setComponentSupportContent(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ul className="vitals-menu">
          {vitalsComponentsList.map((item, id) => {
            return (
              <li
                className={
                  `vitals-menu-item` +
                  createClassName(id === currentState ? "selected" : null)
                }
                key={id}
                style={{ display: "inline-block" }}
                onClick={() => {
                  setCurrentState(id);
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        <Button
          style={{ width: "55px", marginLeft: "10%" }}
          onClick={backToPatientDetails}
          type="utility"
          icon={Icons.CloseOutlined({ Style: { color: "#000000" } })}
        />
      </div>
    );

    return () => {
      setComponentSupportContent(null);
    };
  }, [currentState]);
  return (
    <div className="vital-container">
      {vitalsComponentsList[currentState].component}
    </div>
  );
}
