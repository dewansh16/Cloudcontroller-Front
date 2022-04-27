import React, { useState, useRef } from "react";
import Icons from "../../Utils/iconMap";
import { Spin, Dropdown, Menu, notification, Input, Select } from "antd";
import "./admin.css";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import Tab3 from "../Components/Tenants/Components/tab3/tab3.components.tenants";
import DropdownIcon from "../../Assets/Icons/dropdownIcon";
import { Button } from "../../Theme/Components/Button/button";
import tenantApi from "../../Apis/tenantApis";
import NewTenant from "./NewTenantComponent/NewTenant";

import countryList from "country-region-data";
import RoleAndPermission from "./RoleAndPermission/roleAndPermission";
import Roles from "./Roles/roles.Admin";
const { Option } = Select;

export default function Admin() {
  // const columns = [
  //   {
  //     title: (
  //       <div
  //         style={{
  //           fontFamily: "Lexend",
  //           fontWeight: "500",
  //           fontSize: "14px",
  //           color: "#727272",
  //         }}
  //       >
  //         TYPE
  //       </div>
  //     ),
  //     dataIndex: "name",
  //     key: "name",
  //   },
  //   {
  //     title: (
  //       <div
  //         style={{
  //           textAlign: "center",
  //           fontFamily: "Lexend",
  //           fontWeight: "500",
  //           fontSize: "14px",
  //           color: "#727272",
  //         }}
  //       >
  //         READ
  //       </div>
  //     ),
  //     dataIndex: "read",
  //     key: "read",
  //   },
  //   {
  //     title: (
  //       <div
  //         style={{
  //           textAlign: "center",
  //           fontFamily: "Lexend",
  //           fontWeight: "500",
  //           fontSize: "14px",
  //           color: "#727272",
  //         }}
  //       >
  //         WRITE
  //       </div>
  //     ),
  //     dataIndex: "write",
  //     key: "write",
  //   },
  //   {
  //     title: (
  //       <div
  //         style={{
  //           textAlign: "center",
  //           fontFamily: "Lexend",
  //           fontWeight: "500",
  //           fontSize: "14px",
  //           color: "#727272",
  //         }}
  //       >
  //         NO-ACCESS
  //       </div>
  //     ),
  //     dataIndex: "access",
  //     key: "access",
  //   },
  // ];

  // const tableData = [
  //   {
  //     key: "1",
  //     name: (
  //       <div
  //         style={{ fontFamily: "Lexend", fontWeight: "500", fontSize: "16px" }}
  //       >
  //         Create Patient
  //       </div>
  //     ),
  //     read: (
  //       <div style={{ textAlign: "center" }}>
  //         <CheckOutlined style={{ color: "#86D283" }} />
  //       </div>
  //     ),
  //     write: "",
  //     access: "",
  //   },
  //   {
  //     key: "2",
  //     name: (
  //       <div
  //         style={{ fontFamily: "Lexend", fontWeight: "500", fontSize: "16px" }}
  //       >
  //         Delete Patient
  //       </div>
  //     ),
  //     read: (
  //       <div style={{ textAlign: "center" }}>
  //         <CheckOutlined style={{ color: "#86D283" }} />
  //       </div>
  //     ),

  //     write: "",
  //     access: "",
  //   },
  //   {
  //     key: "3",
  //     name: (
  //       <div
  //         style={{ fontFamily: "Lexend", fontWeight: "500", fontSize: "16px" }}
  //       >
  //         View Patient
  //       </div>
  //     ),
  //     read: (
  //       <div style={{ textAlign: "center" }}>
  //         <CheckOutlined style={{ color: "#86D283" }} />
  //       </div>
  //     ),

  //     write: "",
  //     access: "",
  //   },
  // ];

  const showtenantModal = () => {
    setChangeui(true);
    setNewTenant(true);
    setIsPermissionPage(false);
    setIsInfoPage(true);
    setcurrentTenant({});
  };

  const [tenants, setTenants] = useState([]);

  const [location, setLocation] = useState({});

  const [tenantsLoading, setTenantsLoading] = useState(true);

  function getLocation(tenantuuid) {
    setLocation({});
    tenantApi
      .getLocation(tenantuuid)
      .then((res) => {
        var tempFacility = {};
        var tempLocation = {};
        console.log("TENANT UUID---", tenantuuid);
        console.log("FACILITY RESPONSE--", res.data?.response.facilities);
        res.data?.response.facilities.map((item) => {
          var flag = true;
          for (var i = 0; i < item.length; i++) {
            if (item[i].tenant_id === tenantuuid) {
              if (item[i].facility_map.hasOwnProperty("buildings")) {
                tempFacility = item[i].facility_map.buildings.building_1;
              }

              tempLocation = item[i];
              if (item[i].hasOwnProperty("name")) {
                console.log("WAS TRUE");
                newTenantRef.current.value = item[i].name;
                newStreetRef.current.value = item[i].street;
                newCityRef.current.value = item[i].city;
                newPinCodeRef.current.value = item[i].postal_code;

                // setCurrentActiveTenantName(item[i].name)
                // setCurrentActiveTenantStreet(item[i].street)
                // setCurrentActiveTenantCity(item[i].city)
                // setCurrentActiveTenantPinCode(item[i].postal_code)

                setSelectedState(item[i].state);

                var tempVarCountry = countryList.filter(
                  (country) => country.countryName === item[i].country_code
                );
                setSelectedCountry(tempVarCountry);
                setSelectedCountryString(tempVarCountry[0].countryName);
                console.log("COUNTRY NAME", tempVarCountry[0].countryName);
              }
              flag = false;
              break;
            }
          }
          if (flag) {
            console.log("WAS FALSE");
            newTenantRef.current.value = "";
            newStreetRef.current.value = "";
            newCityRef.current.value = "";
            newStateRef.current.value = "";
            newPinCodeRef.current.value = "";
            newCountryRef.current.value = "";
          }
          // if (item[0].tenant_id === tenantuuid) {
          //     tempFacility = item[0].facility_map.buildings.building_1

          //     tempLocation = item[0]
          //     if (item[0].hasOwnProperty("name")) {
          //         console.log("WAS TRUE")
          //         newTenantRef.current.value = item[0].name
          //     }
          //     else {
          //         console.log("WAS FALSE")
          //         newTenantRef.current.value = ""
          //     }
          // }
        });
        setLocation(tempLocation);
        setFacilityMap(tempFacility);
        setLoadingTable(false);
      })
      .catch((err) => {
        console.log(err);
        notification.warning({
          message: "Name Change",
        });
      });
  }

  function dropdownMenu() {
    const menu = (
      <Menu>
        {tenants[0].map((tenant, index) => (
          <Menu.Item
            onClick={() => {
              setcurrentTenant({
                name: tenant.tenant_name,
                uuid: tenant.tenant_uuid,
              });
              getLocation(tenant.tenant_uuid);
              setSelectedCountryString("");
              setSelectedState("");
              setSelectedCountry({});
            }}
          >
            <p>{tenant.tenant_name}</p>
          </Menu.Item>
        ))}
      </Menu>
    );

    return menu;
  }

  const [newTenant, setNewTenant] = useState(false);

  const [changeui, setChangeui] = useState(false);

  const [isInfoPage, setIsInfoPage] = useState(false);

  const [isPermissionPage, setIsPermissionPage] = useState(false);

  const [currentTenant, setcurrentTenant] = useState({});

  // const [roles, setRoles] = useState(["Doctor"]);

  // const [activeRole, setActiveRole] = useState(0);

  // const [isNewRoleButtonActive, setNewRoleButtonActive] = useState(true);

  // const [roleStatusList, setRoleStatusList] = useState([
  //   {
  //     role: "Doctor",
  //     completed: true,
  //   },
  // ]);

  // const [activePermission, setActivePermission] = useState(-1);

  const [isEditedName, setIsEditedName] = useState(false);

  const [isEditedCity, setIsEditedCity] = useState(false);

  const [isEditedState, setIsEditedState] = useState(false);

  const [isEditedCountry, setIsEditedCountry] = useState(false);

  const [isEditedPinCode, setIsEditedPinCode] = useState(false);

  const [isEditedStreet, setIsEditedStreet] = useState(false);

  const [loadingTable, setLoadingTable] = useState(true);

  const [facilityMap, setFacilityMap] = useState({});

  // const [permissions, setPermissions] = useState([
  //   "Patients",
  //   "System",
  //   "Tenants",
  //   "Devices",
  //   "Users ",
  //   "New Field",
  //   "New Field",
  //   "New Field",
  // ]);

  // function createNewRole() {
  //   console.log("function ran");
  //   setRoles((roles) => [...roles, "New Role"]);
  //   let statusList = roleStatusList;
  //   statusList.push({
  //     role: "New Role",
  //     completed: false,
  //   });
  //   setRoleStatusList(statusList);
  // }

  // function createRoleButton() {
  //   let buttons = [];
  //   for (let i = 0; i < roles.length; i++) {
  //     buttons.push(
  //       <div style={{ textAlign: "center", position: "relative" }}>
  //         <Button
  //           type="text"
  //           onClick={() => {
  //             setActiveRole(i);
  //           }}
  //           style={chooseRoleButtonStyle(i)}
  //         >
  //           <div>{roles[i]}</div>
  //         </Button>
  //       </div>
  //     );
  //   }
  //   return buttons;
  // }

  // const configRoleName = (e) => {
  //   console.log(e.target.value);
  //   let newRoles = roles;
  //   newRoles[activeRole] = e.target.value;
  //   let newRoleStatusList = roleStatusList;
  //   newRoleStatusList[activeRole].role = e.target.value;
  //   setRoles(newRoles);
  //   setRoleStatusList(newRoleStatusList);
  // };

  // const roleButtonConfig = () => {
  //   let flag = true;
  //   roleStatusList.map((item) => {
  //     if (item.completed === false) {
  //       flag = false;
  //     }
  //   });
  //   console.log("funtion ran");
  //   if (flag) setNewRoleButtonActive(true);
  //   else setNewRoleButtonActive(false);
  // };

  // console.log(roles[activeRole], roleStatusList, isNewRoleButtonActive);

  // function chooseRoleButtonStyle(i) {
  //   if (i === activeRole) {
  //     return roleButtonActiveStyle;
  //   } else return roleButtonStyle;
  // }

  // function createPermissionButton() {
  //   let buttons = [];
  //   for (let i = 0; i <= permissions.length; i++) {
  //     buttons.push(
  //       <div style={{ textAlign: "center", position: "relative" }}>
  //         <Button
  //           type="text"
  //           onClick={() => {
  //             setActivePermission(i);
  //           }}
  //           style={choosePermissionButtonStyle(i)}
  //         >
  //           {permissions[i]}
  //         </Button>
  //       </div>
  //     );
  //   }
  //   return buttons;
  // }

  // function choosePermissionButtonStyle(i) {
  //   if (i === activePermission) {
  //     return roleButtonActiveStyle;
  //   } else return roleButtonStyle;
  // }

  // const roleButtonActiveStyle = {
  //   width: "80%",
  //   margin: "10px",
  //   height: "64px",
  //   color: "white",
  //   fontWeight: "400",

  //   fontSize: "18px",
  //   border: "none",
  //   background: "#393939",
  //   opacity: "0.8",
  //   boxShadow: "0px 25px 25px -15px rgba(119, 119, 119, 0.5)",
  // };

  // const roleButtonStyle = {
  //   margin: "10px",
  //   width: "60%",
  //   height: "64px",
  //   fontWeight: "400",
  //   opacity: "50%",
  //   fontSize: "18px",
  // };

  const newTenantRef = useRef();
  const newStreetRef = useRef();
  const newCityRef = useRef();
  const newStateRef = useRef();
  const newPinCodeRef = useRef();
  const newCountryRef = useRef();

  function cancelTenant() {
    setNewTenant(false);
    setIsInfoPage(false);
    setChangeui(false);
    setTenantsLoading(true);
  }

  // function createNewTenant() {
  //     tenantApi.createNewTenant({ 'tenant_name': newTenantRef.current.value })
  //         .then(res => console.log(res))
  //         .catch(err => {
  //             console.log(err)
  //             notification.error({
  //                 message: 'Error',
  //                 description: `${err}`
  //             });
  //         })
  //     setNewTenant(false)
  //     setIsInfoPage(false)
  //     setChangeui(false)
  //     setTenantsLoading(true)
  // }

  const tab3Ref = useRef();

  function resetInputFields() {
    newTenantRef.current.value = location.name;
    newStreetRef.current.value = location.street;
    newCityRef.current.value = location.city;
    newPinCodeRef.current.value = location.postal_code;

    var tempVarCountry = countryList.filter(
      (country) => country.countryName === location.country_code
    );
    setSelectedCountry(tempVarCountry);

    setSelectedState(location.state);
    setSelectedCountryString(location.country_code);

    setIsEditedName(false);
    setIsEditedCity(false);
    setIsEditedCountry(false);
    setIsEditedPinCode(false);
    setIsEditedState(false);
    setIsEditedStreet(false);
  }

  function changeTenantData() {
    console.log(currentTenant);
    var tenantName = newTenantRef.current.value;
    var tenantStreet = newStreetRef.current.value;
    var tenantCity = newCityRef.current.value;
    var tenantState = selectedState;
    var tenantPinCode = newPinCodeRef.current.value;
    var tenantCountry = selectedCountryString;
    if (currentTenant.name !== tenantName) {
      tenantApi
        .updateTenantName(
          {
            tenant_name: tenantName,
          },
          currentTenant.uuid
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    tenantApi
      .updateTenantData(
        {
          name: tenantName,
          phone: "",
          fax: "0",
          street: tenantStreet,
          city: tenantCity,
          state: tenantState,
          postal_code: tenantPinCode,
          country_code: tenantCountry,
          federal_ein: "",
          website: "",
          email: "",
          service_location: 1,
          billing_location: 1,
          accepts_assignment: 0,
          pos_code: 0,
          x_12_sender_id: 0,
          attn: "",
          domain_identifier: "",
          facility_npi: "",
          primary_business_entity: 1,
          oid: "1",
          id: 1,
          tenant_id: "1",
          facility_uuid: "1",
          tax_id_type: "213",
          extra_validation: 1,
          facility_code: "1234",
          facility_map: location.facility_map,
        },
        currentTenant.uuid
      )
      .then((res) => {
        console.log(res.data);
        notification.success({
          message: "Updated!",
          description: "Details Changed",
        });
        getLocation(currentTenant.uuid);
        setIsEditedCity(false);
        setIsEditedCountry(false);
        setIsEditedName(false);
        setIsEditedPinCode(false);
        setIsEditedState(false);
        setIsEditedStreet(false);
        if (currentTenant.name !== tenantName) {
          setTenantsLoading(true);
          setChangeui(false);
          setIsInfoPage(false);
        }
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Error",
          description: `${err}`,
        });
      });
  }

  useEffect(() => {
    tenantApi
      .getTenantList()
      .then((res) => {
        setTenants(res.data?.response.tenants);
        setTenantsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Error",
          description: `${err}`,
        });
      });
  }, [tenantsLoading]);

  function tenantBack() {
    setChangeui(false);
    setIsInfoPage(false);
    setIsPermissionPage(false);
  }

  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountryString, setSelectedCountryString] = useState("");

  const [currentActiveTenantName, setCurrentActiveTenantName] = useState("");
  const [currentActiveTenantStreet, setCurrentActiveTenantStreet] =
    useState("");
  const [currentActiveTenantCity, setCurrentActiveTenantCity] = useState("");
  const [currentActiveTenantPinCode, setCurrentActiveTenantPinCode] =
    useState("");

  function changeCountryEditedState(value) {
    var country = countryList.filter(
      (country) => country.countryName === value
    );
    setSelectedCountry(country);
    setSelectedCountryString(value);
    setIsEditedCountry(true);
    setSelectedState("");
  }

  function changeStateEditedState(value) {
    setSelectedState(value);
    setIsEditedState(true);
  }

  function resetCountryState(country_name) {
    setIsEditedCountry(false);
    setSelectedCountryString(country_name);
  }

  // console.log("all Tenants", tenants);

  return (
    <div className="admin-main">
      <div className="tenant-action-bar">
        {changeui ? (
          newTenant ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "22%",
              }}
            >
              <LeftOutlined
                onClick={() => {
                  tenantBack();
                  setNewTenant(false);
                }}
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
              <h1
                style={{
                  marginBottom: "0px",
                  fontSize: "25px",
                  fontWeight: "600",
                }}
              >
                Create New Tenant
              </h1>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "12%",
              }}
            >
              <LeftOutlined
                onClick={tenantBack}
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
              <Dropdown overlay={dropdownMenu} trigger={["click"]}>
                <p
                  style={{
                    fontWeight: "600",
                    fontFamily: "Lexend",
                    fontSize: "18px",
                    marginBottom: "0px",
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "15%",
                    cursor: "pointer",
                  }}
                >
                  {currentTenant.name}
                  <span style={{ cursor: "pointer", marginLeft: "50%" }}>
                    <DropdownIcon />
                  </span>
                </p>
              </Dropdown>
            </div>
          )
        ) : (
          <h1
            style={{ marginBottom: "0px", fontSize: "25px", fontWeight: "600" }}
          >
            Tenants
          </h1>
        )}

        <div style={{ opacity: "0" }}>
          <button className="tenant-action-bar-btn">
            {Icons.sync({ Style: { fontSize: "1.257rem" } })}
          </button>
          <button className="tenant-action-bar-btn">
            {Icons.sortIcon({ Style: { fontSize: "1.257rem" } })}
          </button>
          <button className="tenant-action-bar-btn">
            {Icons.filterIcon({ Style: { fontSize: "1.257rem" } })}
          </button>
          <button className="tenant-action-bar-btn">
            {Icons.searchIcon({ Style: { fontSize: "1.257rem" } })}
          </button>
        </div>
        {changeui ? (
          <Button
            style={{
              fontSize: "18px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              color: "#1F1F1F",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              opacity: "0",
              cursor: "auto",
            }}
          >
            {Icons.PlusOutlined({ fontSize: "18px" })}
            Tenant
          </Button>
        ) : (
          <Button
            onClick={showtenantModal}
            style={{
              fontSize: "18px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              color: "#1F1F1F",
              border: "1px solid rgba(0, 0, 0, 0.2)",
            }}
          >
            {Icons.PlusOutlined({ fontSize: "18px" })}
            Tenant
          </Button>
        )}
      </div>

      {changeui ? (
        <div className="tenant-info-bar">
          <div className="tenant-info-bar-btn">
            <div
              className={
                isInfoPage
                  ? "active left-anim-part-one"
                  : "non-active right-anim-part-one"
              }
              onClick={() => {
                setIsInfoPage(true);
                setIsPermissionPage(false);
                getLocation(currentTenant.uuid);
                setSelectedCountryString("");
                setSelectedState("");
                setSelectedCountry({});
              }}
            >
              Hospital / Branch Info
            </div>
            <div
              className={
                isPermissionPage
                  ? "active right-anim-part-two"
                  : "non-active left-anim-part-two"
              }
              onClick={() => {
                setIsInfoPage(false);
                setIsPermissionPage(true);
              }}
            >
              Roles and Permissions
            </div>
          </div>
        </div>
      ) : tenantsLoading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div className="tenants-table">
          {tenants[0].map((tenant) => (
            <div
              className="tenant-card"
              onClick={() => {
                setcurrentTenant({
                  uuid: tenant.tenant_uuid,
                  name: tenant.tenant_name,
                });
                getLocation(tenant.tenant_uuid);
                setChangeui(true);
                setIsInfoPage(true);
              }}
            >
              {tenant.tenant_name}
            </div>
          ))}
        </div>
      )}

      {isInfoPage ? (
        newTenant ? (
          <NewTenant
            cancelTenant={cancelTenant}
            setNewTenant={setNewTenant}
            setIsInfoPage={setIsInfoPage}
            setChangeui={setChangeui}
            setTenantsLoading={setTenantsLoading}
          />
        ) : (
          <>
            <div
              className={
                isEditedName ||
                isEditedCity ||
                isEditedCountry ||
                isEditedPinCode ||
                isEditedState ||
                isEditedStreet
                  ? "tenant-info-bar-action-btn"
                  : "tenant-info-bar-action-btn hidden"
              }
            >
              <Button
                onClick={() => {
                  resetInputFields();
                }}
                className="secondary"
                style={{ padding: "16px 38px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  changeTenantData();
                }}
                style={{ padding: "16px 38px" }}
              >
                Save
              </Button>
            </div>
            <div className="tenant-info-container">
              <div className="tenant-info-page">
                <div className="tenant-info-data">
                  <p className="data-p">Name</p>
                  <input
                    className="data-inp"
                    ref={newTenantRef}
                    defaultValue={location.name}
                    onChange={(e) => {
                      e.target.value === location.name
                        ? setIsEditedName(false)
                        : setIsEditedName(true);
                    }}
                  />
                  <p className="data-p">Country</p>
                  {/* <input className="data-inp" ref={newCountryRef} defaultValue={location.country_code} onChange={(e) => {
                                                (e.target.value === location.country_code) ?
                                                    setIsEditedState(false)
                                                    :
                                                    setIsEditedState(true)
                                            }} /> */}
                  <Select
                    ref={newCountryRef}
                    style={{
                      marginBottom: "5%",
                      fontWeight: "600",
                      fontSize: "16px",
                      width: "100%",
                    }}
                    size="large"
                    showSearch
                    value={selectedCountryString}
                    optionFilterProp="children"
                    filterOption={true}
                    onSelect={(value) => {
                      value === location.country_code
                        ? resetCountryState(location.country_code)
                        : changeCountryEditedState(value);
                    }}
                  >
                    {countryList.map((country, i) => (
                      <Option key={i} value={country.countryName}>
                        {country.countryName}
                      </Option>
                    ))}
                  </Select>
                  <p className="data-p">State / Province / Region</p>
                  {/* <input className="data-inp" ref={newStateRef} defaultValue={location.state} onChange={(e) => {
                                                (e.target.value === location.state) ?
                                                    setIsEditedState(false)
                                                    :
                                                    setIsEditedState(true)
                                            }} /> */}
                  <Select
                    ref={newStateRef}
                    style={{
                      marginBottom: "5%",
                      fontWeight: "600",
                      fontSize: "16px",
                      width: "100%",
                    }}
                    size="large"
                    showSearch
                    // placeholder={location.state}
                    value={selectedState}
                    optionFilterProp="children"
                    filterOption={true}
                    onSelect={(value) => {
                      value === location.state
                        ? setIsEditedState(false)
                        : changeStateEditedState(value);
                    }}
                  >
                    {selectedCountry.length > 0 &&
                      selectedCountry[0]?.regions?.map((region, i) => (
                        <Option key={i} value={region.name}>
                          {region.name}
                        </Option>
                      ))}
                  </Select>
                  <p className="data-p">House no., Area, Colony, Street</p>
                  <input
                    className="data-inp"
                    ref={newStreetRef}
                    defaultValue={location.street}
                    onChange={(e) => {
                      e.target.value === location.street
                        ? setIsEditedStreet(false)
                        : setIsEditedStreet(true);
                    }}
                  />
                  <p className="data-p">Town/City</p>
                  <input
                    className="data-inp"
                    ref={newCityRef}
                    defaultValue={location.city}
                    onChange={(e) => {
                      e.target.value === location.city
                        ? setIsEditedCity(false)
                        : setIsEditedCity(true);
                    }}
                  />
                  <p className="data-p">Pin Code</p>
                  <input
                    className="data-inp"
                    ref={newPinCodeRef}
                    defaultValue={location.postal_code}
                    onChange={(e) => {
                      e.target.value === location.postal_code
                        ? setIsEditedPinCode(false)
                        : setIsEditedPinCode(true);
                    }}
                  />
                </div>
              </div>
              {loadingTable ? (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <div className="tenant-info-table">
                  <Tab3 selectedTenant={facilityMap} ref={tab3Ref}></Tab3>
                </div>
              )}
            </div>
          </>
        )
      ) : null}

      {isPermissionPage ? <Roles currentTenant={currentTenant} /> : null}
    </div>
  );
}
