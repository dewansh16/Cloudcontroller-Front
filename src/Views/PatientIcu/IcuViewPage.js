import React, { useState } from "react";
import { Input, List, Dropdown, notification } from "antd";
import Icons from "../../Utils/iconMap";
import InfoCard from "./components/InfoCard";
import patientApi from "../../Apis/patientApis";
import storage from "../../Controllers/storage";
import Navbar from "../../Theme/Components/Navbar/navbar";
import TrendTimeSelector from "./components/trendTimeSelector";
import ShowTrends from "./components/showTrends";
import WardSelector from "../Dashboard/components/wardSelector";
import PageSizeSelector from "./components/pageSizeSelector";
import FilterMenu from "../Dashboard/components/filterMenu";
import {
  PaginationBox,
  computeTotalPages,
} from "../Components/PaginationBox/pagination";
import { Button } from "../../Theme/Components/Button/button";
const { Search } = Input;

/**
 *
 * @param value
 * @param setPageSize
 *
 *  - value is the items to show in each page
 *  - setPageSize is the useState method to change state of pageSize
 */
function storePageSize(value, setPageSize) {
  storage.setItem("pageSize", value);
  setPageSize(value);
}

export default function IcuViewPage() {
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPageVal, setCurrentPageVal] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchOptions, setSearchOptions] = React.useState({
    locationUuid: null,
    fname: null,
    lname: null,
    duration: 3,
  });
  const pageSizeOptions = [2, 6, 10];
  const timeIntervalOptions = [
    { name: "8 Hours", val: 1 },
    { name: "12 Hours", val: 2 },
    { name: "24 Hours", val: 3 },
    { name: "48 Hours", val: 4 },
    { name: "76 Hours", val: 5 },
    { name: "7 Days", val: 6 },
    { name: "14 Days", val: 7 },
  ];

  const checkboxOptions = [
    { label: "Temp", value: "temp" },
    { label: "SpO2", value: "SpO2" },
    { label: "Resp Rate", value: "Resp Rate" },
    { label: "EWS", value: "EWS" },
  ];

  const filtersConfig = {
    ews: [-1, 20],
    spo2: [-1, 100],
    rr: [-1, 100],
  };
  // filtering options
  const [filters, setFilters] = React.useState(filtersConfig);
  const [wardDetails, setWardDetails] = useState({ text: null, value: null });
  const [defaultCheckedValues, setDefaultCheckedValues] = React.useState([
    "temp",
    "SpO2",
  ]);
  const [patientList, setPatientList] = React.useState({
    isLoading: true,
    data: [],
  });
  const [patientListToShow, setPatientListToShow] = useState([]);
  const markSelected = (checkedValues) => {
    setDefaultCheckedValues(checkedValues);
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
    console.log(name, medRecord);
    setSearchOptions({ fname: name[0], lname: name[1], medRecord: medRecord });
  };
  // blur screen to show dropdown
  const [isBlur, setBlur] = useState({
    filter: false,
  });

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

  const fetchPatients = () => {
    setPatientList({ isLoading: true });
    // currentPageVal * pageSize
    patientApi
      .getPatientListForIcu(
        pageSize,
        pageSize * (currentPageVal - 1),
        searchOptions
      )
      .then((res) => {
        setTotalPages(
          computeTotalPages(res.data.response.patientTotalCount, pageSize)
        );
        const data = res.data.response.patients;
        let sortedData = sortPatient(data);
        let filteredData = filterPatients(sortedData);
        setPatientList({ isLoading: false, data: sortedData });
        setPatientListToShow(filteredData);
      })
      .catch((__) => {
        setPatientList({ isLoading: false });
        notification.error({
          message: "Unable to fetch patients",
        });
      });
  };
  const showBlur = (type) => {
    setBlur({ ...isBlur, [type]: !isBlur[type] });
  };
  React.useEffect(() => {
    let val = storage.getItem("pageSize");
    let pageSizeVal = val === null || val === undefined ? 10 : parseInt(val);
    setPageSize(pageSizeVal);
  }, []);

  React.useEffect(() => {
    fetchPatients();
  }, [pageSize, currentPageVal, searchOptions]);

  React.useEffect(() => {}, [defaultCheckedValues]);

  return (
    <>
      {isBlur.filter || isBlur.floor || isBlur.doctor || isBlur.ward ? (
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
          <>
            <WardSelector
              wardDetails={wardDetails}
              setWardDetails={setWardDetails}
              patientList={patientList.data}
              setPatientList={setPatientList}
              locationUuid={searchOptions.locationUuid}
              setLocationUuid={setSearchOptions}
            />
            <TrendTimeSelector
              timeIntervalOptions={timeIntervalOptions}
              setFilters={setSearchOptions}
            />
          </>
        }
        centerChildren={
          <>
            <Search
              placeholder="input search text"
              onSearch={searchPatient}
              enterButton
              allowClear
            />
            <Button type="secondary" onClick={fetchPatients}>
              {Icons.sync({ Style: { fontSize: "1.257rem" } })}
            </Button>
            <Dropdown
              overlay={FilterMenu(
                filters,
                setFilters,
                filterPatients,
                patientList.data,
                setPatientListToShow,
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
            <PageSizeSelector
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              setPageSize={setPageSize}
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
      <section style={{ padding: "1rem" }}>
        <div style={{ padding: "1rem 0" }}>
          <ShowTrends
            checkboxOptions={checkboxOptions}
            defaultCheckedValues={defaultCheckedValues}
            onChange={markSelected}
          />
        </div>
        <List
          loading={patientList.isLoading}
          dataSource={patientListToShow}
          grid={{
            gutter: [0, 16],
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 3,
            xxl: 4,
          }}
          renderItem={(item) => (
            <div
              key={item.demographic_map.pid}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InfoCard data={item} checkedValues={defaultCheckedValues} />
            </div>
          )}
        />
      </section>
    </>
  );
}
