import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Icons from "../../Utils/iconMap";
import patientApi from "../../Apis/patientApis";
import PatientParticular from "../PatientDetailsCom/patient";
import { PatientListItem } from "../Components/Lists/patientList";
import {
  PaginationBox,
  computeTotalPages,
} from "../Components/PaginationBox/pagination";
import {
  Row,
  Col,
  List,
  notification,
  Dropdown,
  Modal,
  Form,
  Grid,
  Input as Inputs,
  Select,
} from "antd";
import { Button } from "../../Theme/Components/Button/button";
import WardSelector from "./components/wardSelector";
import { Input } from "../../Theme/Components/Input/input";
import FilterMenu from "./components/filterMenu";
import Navbar from "../../Theme/Components/Navbar/navbar";
// import { primaryButtonStyle, primaryButtonWithNoOutlineStyle, primaryButtonShadowedStyle } from '../../Theme/styles';
import NotesSection from "../PatientDetails/components/notesSection";
import TrendTimeSelector from "../PatientIcu/components/trendTimeSelector";
import { SearchOutlined } from "@ant-design/icons";
import Hotkeys from "react-hot-keys";
import getAge from "../../Utils/getAge";
import "./patientDashboard.css";
const { useBreakpoint } = Grid;
const { Search } = Inputs;
const { Option } = Select;
const HotkeysDemo = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const onKeyDown = (keyName, e, handle) => {
    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const goToRoutes = (values) => {
    const text = values.nlp.toLowerCase();
    if (text === "dashboard") {
      props.prop.history.push("/dashboard/patient/list");
    }
    if (text === "details boydey") {
      props.prop.history.push(
        "/dashboard/patient/details/patient156dbd7a-ba82-4503-bd58-21ccaffe6bc2"
      );
    }
    if (text === "alerts") {
      props.prop.history.push("/dashboard/patient/alerts");
    }
  };
  return (
    <Hotkeys keyName="shift+a,alt+s,command+p" onKeyUp={onKeyDown}>
      <Modal
        width={800}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <h1
            style={{
              textAlign: "center",
              fontFamily: "Lexend",
              fontSize: "35px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "44px",
              letterSpacing: "0.3em",
            }}
          >
            NLP Search
          </h1>
          <Form onFinish={goToRoutes}>
            <Form.Item name="nlp">
              <Input
                autoFocus
                style={{
                  height: "50px",
                }}
                prefix={
                  <SearchOutlined
                    style={{
                      fontSize: "16px",
                    }}
                  />
                }
                placeholder="Vitals of Nathan"
              />
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: "center", margin: "20px" }}>
                <Button
                  style={{
                    height: "40px",
                    width: "180px",
                    background: "#E48F5A",
                    borderRadius: "6px",
                    fontFamily: "Lexend",
                    fontSize: "24px",
                    color: "white",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "31px",
                  }}
                  htmlType="submit"
                >
                  search
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </Hotkeys>
  );
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function PatientDashboard(props) {
  const screens = useBreakpoint();
  const [patient, setPatient] = useState({
    isLoading: true,
    list: [],
  });
  const pageSize = 10;
  const [currentPageVal, setCurrentPageVal] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientListToShow, setPatientList] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [wardDetails, setWardDetails] = useState({ text: null, value: null });
  const [patientType, setSelectedPatient] = useState("incare");
  // const [showModal, setShowModal] = useState(false);

  //animation config
  const patientDetailsAnimationConfig = {
    hidden: {
      x: 1000,
      transition: {
        duration: 0.4,
        easing: "easeOut",
      },
    },
    show: {
      x: 0,
      transition: {
        duration: 0.4,
        easing: "easeIn",
      },
    },
  };
  const notesSectionAnimationConfig = {
    hidden: {
      x: -1000,
      transition: {
        duration: 0.4,
        easing: "easeOut",
      },
    },
    show: {
      x: 0,
      transition: {
        duration: 0.4,
        easing: "easeIn",
      },
    },
  };

  // to set active element
  const [active, setActive] = React.useState("");

  // state to toggle visibility of trends
  const [showTrend, setShowTrend] = React.useState(true);

  // blur screen to show dropdown
  const [isBlur, setBlur] = useState({
    filter: false,
  });

  const filtersConfig = {
    ews: [-1, 20],
    spo2: [-1, 100],
    rr: [-1, 100],
  };
  // filtering options
  const [filters, setFilters] = useState(filtersConfig);

  const [searchOptions, setSearchOptions] = useState({
    locationUuid: null,
    fname: null,
    lname: null,
    duration: 3,
    medRecord: null,
  });

  const timeIntervalOptions = [
    { name: "8 Hours", val: 1 },
    { name: "12 Hours", val: 2 },
    { name: "24 Hours", val: 3 },
    { name: "48 Hours", val: 4 },
    { name: "76 Hours", val: 5 },
    { name: "7 Days", val: 6 },
    { name: "14 Days", val: 7 },
  ];
  const filterPatients = (data) => {
    let filteredData = data?.filter((patient) => {
      return (
        parseInt(patient.PatientState.EWS) >= filters.ews[0] &&
        parseInt(patient.PatientState.EWS) <= filters.ews[1] &&
        parseInt(patient.ews_map.spo2) >= filters.spo2[0] &&
        parseInt(patient.ews_map.spo2) <= filters.spo2[1] &&
        parseInt(patient.ews_map.rr) >= filters.rr[0] &&
        parseInt(patient.ews_map.rr) <= filters.rr[1]
      );
    });
    return filteredData;
  };
  // to sort patient
  const sortPatient = (data) => {
    data?.sort((item, nextItem) => {
      return (
        parseInt(nextItem.PatientState.EWS) - parseInt(item.PatientState.EWS)
      );
    });
    return data;
  };
  const searchPatient = (val) => {
    let name = val.split(" ");
    let medRecord = val;
    setSearchOptions({
      ...searchOptions,
      fname: name[0].length > 0 ? name[0] : null,
      lname: name[1]?.length > 0 ? name[1] : null || null,
      medRecord: medRecord,
    });
  };

  // set type of patients -- all, discharged, in care
  function showSelectedPatient(val) {
    setSelectedPatient(val);
  }
  //filter based on selected type of patients
  function filterBasedonPatientType(patientList) {
    let filteredData = filterPatients(patientList);
    const filteredPatients = filteredData.filter((patient) => {
      switch (patientType) {
        case "all":
          return patient;
        case "discharged":
          return (
            patient.demographic_map.discharge_date !== null &&
            patient.demographic_map.discharge_date !== undefined &&
            patient.demographic_map.status !== "Deboarded"
          );
        case "incare":
          return (
            (patient.demographic_map.discharge_date === null ||
              patient.demographic_map.discharge_date === undefined) &&
            patient.demographic_map.status !== "Deboarded"
          );
        case "deboarded": {
          return patient.demographic_map.status === "Deboarded";
        }
        default:
          return patient;
      }
    });
    setPatientList(filteredPatients);
  }

  function fetchPatientList() {
    setPatient({ isLoading: true });
    patientApi
      .getPatientList(
        pageSize,
        pageSize * (currentPageVal - 1),
        searchOptions,
        patientType
      )
      .then((res) => {
        setTotalPages(
          computeTotalPages(res.data.response.patientTotalCount, pageSize)
        );
        let data = res.data.response.patients;
        let sortedData = sortPatient(data);
        setPatient({ isLoading: false, list: sortedData });
        // let filteredData = filterPatients(sortedData);
        filterBasedonPatientType(sortedData);
      })
      .catch((err) => {
        setPatient({ isLoading: false });
        notification.error({
          message: "Failure in fetching patients",
        });
      });
  }

  useEffect(() => {}, [active]);

  useInterval(fetchPatientList, 300000);

  useEffect(() => {
    fetchPatientList();
  }, [currentPageVal, searchOptions, patientType]);

  // useEffect(() => {
  //   filterBasedonPatientType(patient.list);
  // }, [patientType]);

  const showBlur = (type) => {
    setBlur({ ...isBlur, [type]: !isBlur[type] });
  };

  return (
    <>
      <HotkeysDemo prop={props} />
      {isBlur.filter ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            backdropFilter: "blur(4px)",
            zIndex: "2",
          }}
        ></div>
      ) : null}
      <Navbar
        startChildren={
          <WardSelector
            wardDetails={wardDetails}
            setWardDetails={setWardDetails}
            patientList={patient.list}
            setPatientList={setPatientList}
            locationUuid={searchOptions.locationUuid}
            searchOptions={searchOptions}
            setLocationUuid={setSearchOptions}
          />
        }
        centerChildren={
          <>
            <Search
              placeholder="input search text"
              onSearch={searchPatient}
              enterButton
              allowClear
            />
            <Button type="secondary" onClick={fetchPatientList}>
              {Icons.sync({ Style: { fontSize: "1.257rem" } })}
            </Button>
            <Dropdown
              overlay={FilterMenu(
                filters,
                setFilters,
                filterPatients,
                patient.list,
                setPatientList,
                filtersConfig
              )}
              trigger={["click"]}
              onVisibleChange={() => showBlur("filter")}
              visible={isBlur.filter}
            >
              <Button
                style={{ zIndex: isBlur.filter ? "3" : "0" }}
                type="secondary"
              >
                {Icons.filterIcon({ Style: { fontSize: "1.257rem" } })}
              </Button>
            </Dropdown>
            <TrendTimeSelector
              timeIntervalOptions={timeIntervalOptions}
              searchOptions={searchOptions}
              setFilters={setSearchOptions}
            />
          </>
        }
        endChildren={
          <>
            <PaginationBox
              totalPages={totalPages}
              currentPageVal={currentPageVal}
              setCurrentPageVal={setCurrentPageVal}
            />
          </>
        }
      />
      {patientDetails !== null && !showTrend && (
        <motion.div
          initial={"hidden"}
          animate={patientDetails !== null && !showTrend ? "show" : "hidden"}
          exit={"hidden"}
          variants={patientDetailsAnimationConfig}
          style={{
            zIndex: "335",
            padding: "2rem",
            width: screens.xl ? "50vw" : "100%",
            right: "0",
            top: "0",
            height: "100%",
            background: "white",
            position: "fixed",
            boxShadow: "-14px 16px 32px 5px rgb(114 102 102 / 25%)",
            WebkitBoxShadow: "-14px 16px 32px 5px rgb(114 102 102 / 25%)",
            MozBoxShadow: " -14px 16px 32px 5px rgb(114 102 102 / 25%)",
            transition: "0.3s ease",
          }}
        >
          <PatientParticular
            patient={patientDetails}
            setShowNotes={setShowNotes}
            setShowTrend={setShowTrend}
            setActive={setActive}
          />
        </motion.div>
      )}
      <Row style={{ display: "flex", flexDirection: "column" }}>
        {!showNotes && (
          <>
            <Col
              style={{
                width: "20em",
                margin: "10px 20px",
                display: "inline-flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <h3 style={{ width: "8rem", margin: "0" }}>Patient Type: </h3>
              </div>
              <Select
                defaultValue="incare"
                style={{ width: "100%" }}
                onSelect={showSelectedPatient}
              >
                <Option value="incare">In Care</Option>
                <Option value="discharged">Discharged</Option>
                <Option value="deboarded">Deboarded</Option>
                <Option value="all">All Patients</Option>
              </Select>
            </Col>
            <Col flex="auto" style={{ margin: "10px 20px" }}>
              <List
                loading={patient.isLoading}
                dataSource={patientListToShow}
                renderItem={(item) => (
                  //TODO:optimize the props -- unnecessary props
                  <PatientListItem
                    patientType={patientType}
                    parentProps={props}
                    key={item.demographic_map.pid}
                    showTrend={showTrend}
                    setShowTrend={setShowTrend}
                    critical={
                      item.PatientState.state === "CRITICAL" ? true : false
                    }
                    bedNumber={item.location_map?.ward || "NA"}
                    Name={`${item.demographic_map.fname} ${item.demographic_map.lname[0]}.`}
                    age={
                      getAge(new Date(), new Date(item.demographic_map.DOB)) ||
                      ""
                    }
                    sex={item.demographic_map.sex}
                    //pid is passed to set active element
                    pid={item.demographic_map.pid}
                    ews={item.PatientState.EWS}
                    data={item}
                    patientDetails={patientDetails}
                    setPatientDetails={setPatientDetails}
                    active={active}
                    setActive={setActive}
                  />
                )}
              ></List>
            </Col>
          </>
        )}
        {showNotes && (
          <motion.div
            initial={"hidden"}
            animate={showNotes ? "show" : "hidden"}
            exit={"hidden"}
            variants={notesSectionAnimationConfig}
            style={{
              zIndex: "345",
              padding: "2rem",
              width: screens.xl ? "50vw" : "100%",
              position: "fixed",
              right: screens.xl ? "50vw" : "0",
              top: "0",
              height: "100%",
              background: "white",
              boxShadow: "-14px 16px 32px 5px rgb(114 102 102 / 25%)",
              WebkitBoxShadow: "-14px 16px 32px 5px rgb(114 102 102 / 25%)",
              MozBoxShadow: " -14px 16px 32px 5px rgb(114 102 102 / 25%)",
              transition: "0.3s ease",
            }}
          >
            <NotesSection
              setNotes={setShowNotes}
              pid={patientDetails.patientDetails.demographic_map.pid}
            />
          </motion.div>
        )}
      </Row>
    </>
  );
}
