import React, { useState, useRef } from "react";
import {
  Button,
  InputNumber,
  Popover,
  Form,
  Input,
  notification,
  Select,
} from "antd";
import { Button as CustomBtn } from "../../../Theme/Components/Button/button";
import { TagOutlined } from "@ant-design/icons";
import GreenTick from "../../../Assets/Icons/greenTick";
import tenantApi from "../../../Apis/tenantApis";
import locationApi from "../../../Apis/locationApi";
import countryList from "country-region-data";

const { Option } = Select;

function NewTenant({
  cancelTenant,
  setNewTenant,
  setIsInfoPage,
  setChangeui,
  setTenantsLoading,
}) {
  const [floors, setFloors] = useState(0);
  const [wards, setWards] = useState(null);
  const [beds, setBeds] = useState(null);
  const [wardsInFloor, setWardsInFloor] = useState({});
  const [activeFloor, setActiveFloor] = useState(0);
  const [activeWard, setActiveWard] = useState(0);
  const [isFloorTagVisible, setFloorTagVisible] = useState(false);
  const [isWardTagVisible, setWardTagVisible] = useState(false);

  const newTenantRef = useRef();
  const newStreetRef = useRef();
  const newCityRef = useRef();
  const newPinCodeRef = useRef();

  function createNewTenant() {
    var tenantName = newTenantRef.current.value;
    var tenantStreet = newStreetRef.current.value;
    var tenantCity = newCityRef.current.value;
    var tenantState = selectedState;
    var tenantPinCode = newPinCodeRef.current.value;
    var tenantCountry = selectedCountryString;
    tenantApi
      .createNewTenant({
        tenant_name: tenantName,
      })
      .then((res) => {
        console.log(res.data.response.tenants[0].tenant_uuid);
        var tempTenantIdStorage = res.data.response.tenants[0].tenant_uuid;
        tenantApi
          .createNewFacilityMap({
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
            tenant_id: res.data.response.tenants[0].tenant_uuid,
            facility_uuid: "1",
            tax_id_type: "213",
            extra_validation: 1,
            facility_code: "1234",
            facility_map: {
              facility_uuid: "12314",
              active: 1,
              archive: 1,
              building_count: "1",
              buildings: {
                building_1: {
                  floor_count: Object.keys(wardsInFloor).length,
                  floors: wardsInFloor,
                },
              },
            },
          })
          .then((rsp) => {
            console.log(rsp);
            console.log(rsp.data.response.facilities_data.facility_uuid);
            var tempFacilityUuid =
              rsp.data.response.facilities_data.facility_uuid;
            locationApi
              .postLocationData({
                tenant_id: tempTenantIdStorage,
                facility_uuid: tempFacilityUuid,
                active: 1,
                archive: 1,
                building_count: "1",
                buildings: {
                  building_1: {
                    floor_count: Object.keys(wardsInFloor).length,
                    floors: wardsInFloor,
                  },
                },
              })
              .then((respn) => {
                console.log(respn);
                notification.success({
                  message: "Created!",
                  description: "Facility Map Created",
                });
              })
              .catch((err) => {
                console.log(err);
                notification.error({
                  message: "Error",
                  description: `${err}`,
                });
              });
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: "Error",
              description: `${err}`,
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
    setNewTenant(false);
    setIsInfoPage(false);
    setChangeui(false);
    setTenantsLoading(true);
  }

  const setFloorsData = (value) => {
    let newObj;
    for (let i = 1; i <= value; i++) {
      newObj = {
        ...newObj,
        ["floor_" + i]: {
          wards: {
            ward_count: null,
          },
        },
      };
    }
    setWardsInFloor(newObj);
  };

  const addTagAndDescriptioniInFloor = (tagData, descriptionData) => {
    let newObj = {
      ...wardsInFloor,
      ["floor_" + activeFloor]: {
        ...wardsInFloor[`floor_${activeFloor}`],
        tag: tagData,
        description: descriptionData,
      },
    };
    setWardsInFloor(newObj);
  };

  const addTagAndDescriptioniInWard = (tagData, descriptionData) => {
    let newObj = {
      ...wardsInFloor,
      ["floor_" + activeFloor]: {
        ...wardsInFloor[`floor_${activeFloor}`],
        wards: {
          ...wardsInFloor[`floor_${activeFloor}`]["wards"],
          ["ward_" + activeWard]: {
            tag: tagData,
            description: descriptionData,
          },
        },
      },
    };
    setWardsInFloor(newObj);
  };

  const changeWardsInFloor = (totalWards) => {
    let newObj;
    newObj = {
      ...wardsInFloor,
      ["floor_" + activeFloor]: {
        ...wardsInFloor[`floor_${activeFloor}`],
        ward_count: totalWards,
        wards: {},
      },
    };
    for (let i = 1; i <= totalWards; i++) {
      newObj = {
        ...wardsInFloor,
        ["floor_" + activeFloor]: {
          ...newObj[`floor_${activeFloor}`],
          wards: {
            ...newObj[`floor_${activeFloor}`]["wards"],
            ["ward_" + i]: {
              ["bed_count"]: null,
            },
          },
        },
      };
    }
    setWardsInFloor(newObj);
  };

  const changeBedsInWard = (newBeds) => {
    const newObj = {
      ...wardsInFloor,
      ["floor_" + activeFloor]: {
        ...wardsInFloor[`floor_${activeFloor}`],
        wards: {
          ...wardsInFloor[`floor_${activeFloor}`]["wards"],
          ["ward_" + activeWard]: {
            ...wardsInFloor[`floor_${activeFloor}`]["wards"][
              "ward_" + activeWard
            ],
            bed_count: newBeds,
          },
        },
      },
    };
    setWardsInFloor(newObj);
  };

  const initialBeds = (wardNo) => {
    setBeds(
      wardsInFloor[`floor_${activeFloor}`]["wards"][`ward_${wardNo}`] ===
        undefined
        ? null
        : wardsInFloor[`floor_${activeFloor}`]["wards"][`ward_${wardNo}`][
            "bed_count"
          ]
    );
  };

  const initialWards = (floorNo) => {
    setWards(
      wardsInFloor[`floor_${floorNo}`] === undefined
        ? null
        : wardsInFloor[`floor_${floorNo}`][`ward_count`]
    );
  };

  const makeFloorTagVisible = () => {
    setFloorTagVisible(true);
  };

  const hideFloorTag = () => {
    setFloorTagVisible(false);
  };

  const makeWardTagVisible = () => {
    setWardTagVisible(true);
  };

  const hideWardTag = () => {
    setWardTagVisible(false);
  };

  const onFloorTagFinish = (values) => {
    console.log("FLOOR VALUES---", values);
    console.log(
      "FLOOR TAG---",
      values.tag,
      "   FLOOR DESC---",
      values.description
    );
    setFloorTagVisible(false);
    addTagAndDescriptioniInFloor(values.tag, values.description);
  };

  const onWardTagFinish = (values) => {
    console.log("WARD VALUES---", values);
    console.log(
      "WARD TAG---",
      values.tag,
      "   WARD DESC---",
      values.description
    );
    setWardTagVisible(false);
    addTagAndDescriptioniInWard(values.tag, values.description);
  };

  function floorTagContent(floorNumber) {
    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18 }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFloorTagFinish}
      >
        <Form.Item label="Tag" name="tag">
          <Input defaultValue={wardsInFloor[`floor_${floorNumber}`].tag} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input
            defaultValue={wardsInFloor[`floor_${floorNumber}`].description}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button danger small onClick={hideFloorTag}>
            Cancel
          </Button>
          <Button
            small
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "10px" }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }

  const createFloorButtons = () => {
    let buttons = [];
    for (let i = 1; i <= floors; i++) {
      buttons.push(
        <div style={{ textAlign: "center", position: "relative" }}>
          <Button
            type="text"
            onClick={(e) => {
              setActiveFloor(parseInt(e.target.innerText));
              initialWards(parseInt(e.target.innerText));
              setActiveWard(0);
            }}
            style={chooseFloorButtonStyle(i)}
          >
            {" "}
            {activeFloor === i ? <span>Floor &nbsp;</span> : <></>}
            {i}
            {wardsInFloor[`floor_${i}`]["wards"][`ward_count`] ===
            null ? null : (
              <span style={chooseCheckIconStyleFloors(i)}>
                <div>
                  <GreenTick />
                </div>
              </span>
            )}
          </Button>
          {i === activeFloor ? (
            <Popover
              trigger="click"
              content={() => floorTagContent(i)}
              visible={isFloorTagVisible}
              placement="right"
            >
              <Button
                onClick={makeFloorTagVisible}
                style={{
                  position: "absolute",
                  top: "30%",
                  border: "1px solid #FFD966",
                  color: "#FFD966",
                  width: "15%",
                  padding: "0.3rem",
                }}
              >
                <TagOutlined />
              </Button>
            </Popover>
          ) : null}
        </div>
      );
    }
    return buttons;
  };

  function wardTagContent(floorNumber, wardNumber) {
    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18 }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onWardTagFinish}
      >
        <Form.Item label="Tag" name="tag">
          <Input
            defaultValue={
              wardsInFloor[`floor_${floorNumber}`]["wards"][
                `ward_${wardNumber}`
              ].tag
            }
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input
            defaultValue={
              wardsInFloor[`floor_${floorNumber}`]["wards"][
                `ward_${wardNumber}`
              ].description
            }
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button danger small onClick={hideWardTag}>
            Cancel
          </Button>
          <Button
            small
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "10px" }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }

  const createWardButtons = (value) => {
    let buttons = [];
    for (let i = 1; i <= wards; i++) {
      buttons.push(
        <div style={{ textAlign: "center", position: "relative" }}>
          <Button
            type="text"
            onClick={(e) => {
              setActiveWard(parseInt(e.target.innerText));
              initialBeds(parseInt(e.target.innerText));
            }}
            style={chooseWardButtonStyle(i)}
          >
            {wardsInFloor[`floor_${activeFloor}`]["wards"][`ward_${i}`][
              "bed_count"
            ] === null ? null : (
              <span style={checkedIconFilledStyle}>
                <GreenTick />
              </span>
            )}
            {activeWard === i ? <span>Ward &nbsp;</span> : <></>}
            {i}
          </Button>
          {i === activeWard ? (
            <Popover
              content={() => wardTagContent(activeFloor, i)}
              visible={isWardTagVisible}
              placement="right"
            >
              <Button
                onClick={makeWardTagVisible}
                style={{
                  position: "absolute",
                  top: "30%",
                  border: "1px solid #FFD966",
                  color: "#FFD966",
                }}
              >
                <TagOutlined />
              </Button>
            </Popover>
          ) : null}
        </div>
      );
    }
    return buttons;
  };

  const chooseWardButtonStyle = (i) => {
    if (
      i === activeWard &&
      wardsInFloor[`floor_${activeFloor}`]["wards"][`ward_${i}`][
        "bed_count"
      ] !== null
    ) {
      return floorButtonActiveFilledStyle;
    } else if (i === activeWard) {
      return floorButtonActiveStyle;
    } else return floorButtonStyle;
  };

  const chooseFloorButtonStyle = (i) => {
    if (i === activeFloor && checkIsWardsFilled(i)) {
      return floorButtonActiveFilledStyle;
    } else if (i === activeFloor) {
      return floorButtonActiveStyle;
    } else return floorButtonStyle;
  };

  const chooseCheckIconStyleFloors = (i) => {
    if (wardsInFloor[`floor_${i}`]["ward_count"] === null) {
      return checkedIconUnfilledStyle;
    } else if (wardsInFloor[`floor_${i}`]["ward_count"] !== null) {
      console.log(wardsInFloor[`floor_${i}`]["ward_count"]);
      for (let j = 1; j <= wardsInFloor[`floor_${i}`]["ward_count"]; j++) {
        if (
          wardsInFloor[`floor_${i}`]["wards"][`ward_${j}`]["bed_count"] === null
        ) {
          // console.log(wardsInFloor[`floor_${i}`]['wards'][`ward_${i}`]['bed_count'])
          return checkedIconUnfilledStyle;
        }
      }
      return checkedIconFilledStyle;
    }
    return checkedIconUnfilledStyle;
  };

  const checkIsWardsFilled = () => {
    if (wards === undefined || wards === null || wards === 0) return false;
    else {
      for (let i = 1; i <= wards; i++) {
        if (
          wardsInFloor[`floor_${activeFloor}`]["wards"][`ward_${i}`][
            "bed_count"
          ] === null
        ) {
          return false;
        }
      }
      return true;
    }
  };

  const floorButtonStyle = {
    margin: "10px",
    width: "60%",
    height: "64px",
    fontWeight: "600",
    opacity: "50%",
    fontSize: "18px",
    color: "#333333",
  };

  const floorButtonActiveStyle = {
    width: "50%",
    margin: "10px",
    height: "64px",
    color: "white",
    fontWeight: "600",
    opacity: "100",
    fontSize: "18px",
    border: "none",
    background: "#333333",
    opacity: "0.8",
    boxShadow: "0px 25px 25px -15px rgba(119, 119, 119, 0.5)",
  };

  const floorButtonActiveFilledStyle = {
    width: "50%",
    margin: "10px",
    height: "64px",
    color: "white",
    fontWeight: "600",
    opacity: "100",
    fontSize: "18px",
    background: "#444444",
  };

  const checkedIconFilledStyle = {
    marginLeft: "-50px",
    zIndex: "-1",
    position: "absolute",
    color: "#86D283",
  };

  const checkedIconUnfilledStyle = {
    marginLeft: "-50px",
    zIndex: "-1",
    position: "absolute",
    color: "#FB2D77",
  };

  const InputNumberStyle = {
    width: "70px",
    fontWeight: "600",
    fontSize: "16px",
    padding: "10px 0px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.05)",
  };

  function checkAllWardsFilled() {
    console.log("WARDS IN FLOORS", wardsInFloor);
    if (!wardsInFloor) {
      console.log("NOT DEFINED WARDS IN FLOORS");
      return false;
    } else if (Object.keys(wardsInFloor).length === 0) {
      console.log("NOT DEFINED WARDS IN FLOORS 2");
      return false;
    } else {
      for (var i = 1; i <= Object.keys(wardsInFloor).length; i++) {
        if (!wardsInFloor[`floor_${i}`]) {
          console.log("NOT DEFINED FLOORS");
          return false;
        } else {
          if (wardsInFloor[`floor_${i}`].wards.ward_count === null) {
            console.log("WARD COUNT NULL");
            return false;
          } else {
            console.log("I RAN");
            for (
              var j = 1;
              j <= Object.keys(wardsInFloor[`floor_${i}`].wards).length;
              j++
            ) {
              console.log(
                "BED COUNT",
                wardsInFloor[`floor_${i}`].wards[`ward_${j}`].bed_count
              );
              if (
                !wardsInFloor[`floor_${i}`].wards[`ward_${j}`].bed_count ||
                wardsInFloor[`floor_${i}`].wards[`ward_${j}`].bed_count === null
              ) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  const tempVarCountry = countryList.filter(
    (country) => country.countryName === "India"
  );
  const [selectedCountry, setSelectedCountry] = useState(tempVarCountry);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountryString, setSelectedCountryString] = useState("India");

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {checkAllWardsFilled() && wards ? (
        <div className="tenant-info-bar-action-btn">
          <CustomBtn
            onClick={() => cancelTenant()}
            className="secondary"
            style={{ padding: "16px 38px" }}
          >
            Cancel
          </CustomBtn>
          <CustomBtn
            onClick={() => {
              createNewTenant();
            }}
            style={{ padding: "16px 38px" }}
          >
            Save
          </CustomBtn>
        </div>
      ) : (
        console.log("RETURNED FALSE")
      )}
      <div
        style={{
          marginLeft: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p className="data-p">Name</p>
        <input className="data-inp" ref={newTenantRef} />
        <p className="data-p">Country</p>
        <Select
          style={{ marginBottom: "5%", fontWeight: "600", fontSize: "16px" }}
          size="large"
          showSearch
          placeholder="India"
          optionFilterProp="children"
          filterOption={true}
          onSelect={(value) => {
            var country = countryList.filter(
              (country) => country.countryName === value
            );
            setSelectedCountry(country);
            setSelectedCountryString(value);
            setSelectedState("");
          }}
        >
          {countryList.map((country, i) => (
            <Option key={i} value={country.countryName}>
              {country.countryName}
            </Option>
          ))}
        </Select>
        <p className="data-p">State / Province / Region</p>
        <Select
          style={{ marginBottom: "5%", fontWeight: "600", fontSize: "16px" }}
          size="large"
          showSearch
          value={selectedState}
          optionFilterProp="children"
          filterOption={true}
          onSelect={(value) => {
            setSelectedState(value);
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
        <input className="data-inp" ref={newStreetRef} />
        <p className="data-p">Town/City</p>
        <input className="data-inp" ref={newCityRef} />
        <p className="data-p">Pin Code</p>
        <input className="data-inp" ref={newPinCodeRef} />
      </div>
      <div className="tab-three-content" style={{ marginTop: "2%" }}>
        <div style={{ width: "33%" }} className="slider-tables">
          <div className="slider-header">
            <div>
              <p>No. of Floors</p>
            </div>
            <div style={{ fontSize: "2rem" }}>
              <InputNumber
                style={InputNumberStyle}
                defaultValue="0"
                value={floors}
                min={0}
                onChange={(value) => {
                  setFloors(value);
                  setFloorsData(value);
                  setWards(null);
                  setActiveFloor(null);
                }}
              />
            </div>
          </div>
          <div className="buttons-box">
            {createFloorButtons(floors).map((item) => {
              return item;
            })}
          </div>
        </div>
        <div className="slider-tables">
          <div className="slider-header">
            <div>
              <p>No. of Wards</p>
            </div>
            <div style={{ fontSize: "2rem" }}>
              <InputNumber
                style={InputNumberStyle}
                disabled={activeFloor > 0 ? false : true}
                min={0}
                onChange={(value) => {
                  setWards(value);
                  changeWardsInFloor(value);
                  setActiveWard(null);
                }}
                value={wards}
              />
            </div>
          </div>
          <div className="buttons-box">
            {createWardButtons(wards).map((item) => {
              return item;
            })}
          </div>
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",
            height: "90%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <div
              className="slider-header"
              style={{
                height: "90px",
                alignSelf: "start",
                borderBottom: "none",
              }}
            >
              <div>
                <p>No. of Beds</p>
              </div>
              <div style={{ fontSize: "2rem" }}>
                <InputNumber
                  style={InputNumberStyle}
                  min={0}
                  disabled={
                    activeWard > 0 &&
                    activeFloor > 0 &&
                    activeWard <= wards &&
                    activeFloor <= floors
                      ? false
                      : true
                  }
                  onChange={(value) => {
                    setBeds(value);
                    changeBedsInWard(value);
                  }}
                  value={beds}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTenant;
