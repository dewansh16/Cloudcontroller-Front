import React, { useState, useEffect } from "react";

import { Button, InputNumber, Popover, Form, Input, Spin } from "antd";

import { TagOutlined } from "@ant-design/icons";

import GreenTick from "../../../../../Assets/Icons/greenTick";

const Tab3 = ({ selectedTenant }) => {
  const [floors, setFloors] = useState(0);
  const [wards, setWards] = useState(null);
  const [beds, setBeds] = useState(null);
  const [wardsInFloor, setWardsInFloor] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFloors(selectedTenant.floor_count);
    setWardsInFloor(selectedTenant.floors);
    setLoading(false);
  }, [selectedTenant]);

  const [activeFloor, setActiveFloor] = useState(0);
  const [activeWard, setActiveWard] = useState(0);
  const [isFloorTagVisible, setFloorTagVisible] = useState(false);
  const [isWardTagVisible, setWardTagVisible] = useState(false);

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
    // console.log(values.tag, values.description)
    setFloorTagVisible(false);
    addTagAndDescriptioniInFloor(values.tag, values.description);
  };

  const onWardTagFinish = (values) => {
    console.log(values.tag, values.description);
    setWardTagVisible(false);
    addTagAndDescriptioniInWard(values.tag, values.description);
  };

  function floorTagContent(floorObj) {
    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18 }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFloorTagFinish}
      >
        <Form.Item label="Tag" name="tag">
          <Input defaultValue={floorObj.tag} readOnly />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input defaultValue={floorObj.description} readOnly />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
          <Button danger small onClick={hideFloorTag}>
            Cancel
          </Button>
          {/* <Button small type="primary" htmlType="submit" style={{ marginLeft: '10px' }} >
                        Save
                    </Button> */}
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
              content={floorTagContent(wardsInFloor[`floor_${i}`])}
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

  function wardTagContent(wardObj) {
    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18 }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onWardTagFinish}
      >
        <Form.Item label="Tag" name="tag">
          <Input defaultValue={wardObj.tag} readOnly />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input defaultValue={wardObj.description} readOnly />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
          <Button danger small onClick={hideWardTag}>
            Cancel
          </Button>
          {/* <Button small type="primary" htmlType="submit" style={{ marginLeft: '10px' }} >
                        Save
                    </Button> */}
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
              content={wardTagContent(
                wardsInFloor[`floor_${activeFloor}`]["wards"][`ward_${i}`]
              )}
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
    fontSize: "1rem",
    color: "#333333",
  };

  const floorButtonActiveStyle = {
    width: "50%",
    margin: "10px",
    height: "64px",
    color: "white",
    fontWeight: "600",
    opacity: "100",
    fontSize: "1rem",
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
    fontSize: "1rem",
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

  return loading ? (
    <Spin />
  ) : (
    <div className="tab-three-content">
      <div className="slider-tables">
        <div className="slider-header">
          <div>
            <p>No. of Floors</p>
          </div>
          <div style={{ fontSize: "2rem" }}>
            {/* <InputNumber
                                    style={InputNumberStyle}
                                    defaultValue='0'
                                    value={floors}
                                    min={0}
                                    onChange={(value) => { setFloors(value); setFloorsData(value); setWards(null); setActiveFloor(null) }} /> */}
            {floors}
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
            {/* <InputNumber
                                    style={InputNumberStyle}
                                    disabled={activeFloor > 0 ? false : true}
                                    min={0}
                                    onChange={(value) => { setWards(value); changeWardsInFloor(value); setActiveWard(null) }}
                                    value={wards}
                                /> */}
            {wards}
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
            style={{ height: "90px", alignSelf: "start", borderBottom: "none" }}
          >
            <div>
              <p>No. of Beds</p>
            </div>
            <div style={{ fontSize: "2rem" }}>
              {/* <InputNumber
                                        style={InputNumberStyle}
                                        min={0}
                                        disabled={activeWard > 0 && activeFloor > 0 && activeWard <= wards && activeFloor <= floors ? false : true}
                                        onChange={(value) => { setBeds(value); changeBedsInWard(value) }}
                                        value={beds} 
                                    /> */}
              {beds}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab3;
