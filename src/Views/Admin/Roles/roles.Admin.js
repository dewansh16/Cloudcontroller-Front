import React, { useEffect, useState } from "react";
import { Button } from "../../../Theme/Components/Button/button";
import { Input, Row, Col, Spin } from "antd";
import Icons from "../../../Utils/iconMap";
import "../admin.css";
import "../RoleAndPermission/roleAndPermission.css";
import RoleAndPermission from "../RoleAndPermission/roleAndPermission";
import roleApi from "../../../Apis/roleApis";
import "./roles.admin.css";

function Roles({ currentTenant }) {
  const inputRef = React.useRef(null);
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState(0);
  const [isNewRoleButtonActive, setNewRoleButtonActive] = useState(true);
  const [roleStatusList, setRoleStatusList] = useState([]);
  const [roleInput, setRoleInput] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [rolesData, setRolesData] = useState([]);
  const [updateList, setUpdateList] = useState(true);

  useEffect(() => {
    console.log("roles useeffect ran");
    if (currentTenant.uuid !== undefined) {
      setLoading(true);
      roleApi
        .getRoleList(currentTenant.uuid)
        .then((res) => {
          console.log(res.data.response);
          setRolesData(res.data.response.roles[0]);
          setLoading(false);
          let rolesNameArray = [];
          let statusList = [];
          res.data.response.roles[0].map((role) => {
            rolesNameArray.push(role.role_name);
            statusList.push({
              role: role.role_name,
              completed: true,
              role_uuid: role.role_uuid,
            });
          });
          setRoles((prevState) => {
            if (
              prevState.length === rolesNameArray.length ||
              prevState.length === 0
            ) {
              return rolesNameArray;
            } else {
              return prevState;
            }
          });
          setRoleStatusList((prevState) => {
            if (
              prevState.length === statusList.length ||
              prevState.length === 0
            ) {
              return statusList;
            } else {
              return prevState;
            }
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [activeRole, updateList]);

  function createRoleButton() {
    let buttons = [];
    for (let i = 0; i < roles.length; i++) {
      buttons.push(
        <div key={i} style={{ textAlign: "center", position: "relative" }}>
          <Button
            type="text"
            onClick={() => {
              setActiveRole(i);
            }}
            style={chooseRoleButtonStyle(i)}
          >
            <div>{roles[i]}</div>
          </Button>
        </div>
      );
    }
    return buttons;
  }

  function createNewRole() {
    setRoles((roles) => [...roles, roleInput]);
    let statusList = roleStatusList;
    statusList.push({
      role: roleInput,
      completed: false,
    });
    setRoleStatusList(statusList);
    setActiveRole(statusList.length - 1);
  }

  const configRoleName = (e) => {
    setRoleInput(e.target.value);
  };

  const addRoleButtonConfig = () => {
    let flag = true;
    roleStatusList.map((item) => {
      if (item.completed === false) {
        flag = false;
      }
    });
    console.log("funtion ran");
    if (flag) setNewRoleButtonActive(true);
    else setNewRoleButtonActive(false);
  };

  function chooseRoleButtonStyle(i) {
    if (i === activeRole) {
      return roleButtonActiveStyle;
    } else return roleButtonStyle;
  }

  const roleButtonActiveStyle = {
    width: "80%",
    margin: "10px",
    height: "64px",
    color: "white",
    fontWeight: "400",

    fontSize: "18px",
    border: "none",
    background: "#393939",
    opacity: "0.8",
    boxShadow: "0px 25px 25px -15px rgba(119, 119, 119, 0.5)",
  };

  const roleButtonStyle = {
    margin: "10px",
    width: "60%",
    height: "64px",
    fontWeight: "400",
    opacity: "50%",
    fontSize: "18px",
  };

  const sharedProps = {
    ref: inputRef,
  };

  console.log(isLoading, rolesData, currentTenant.uuid);

  return (
    <div className="role-container">
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0em 1em",
          }}
        >
          <Button
            // className=""
            onClick={() => {
              inputRef.current.focus({
                cursor: "start",
              });
            }}
            style={{
              marginBottom: "0px",
              fontSize: "20px",
            }}
          >
            Add New Role
          </Button>
        </div>
        <div className="roles-container">
          <div className="roles">
            {createRoleButton().map((item) => {
              return item;
            })}
            <div style={{ textAlign: "center", position: "relative" }}>
              <Row style={{ marginTop: "2em" }}>
                <Col span={20}>
                  <Input
                    {...sharedProps}
                    onChange={configRoleName}
                    type="text"
                  ></Input>
                </Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  span={4}
                >
                  <Button
                    disabled={!isNewRoleButtonActive}
                    onClick={() => {
                      createNewRole();
                      addRoleButtonConfig();
                    }}
                    style={{ padding: "0.2rem", borderRadius: "3px" }}
                  >
                    Add
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      {isLoading && currentTenant.uuid !== undefined ? (
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "500px",
          }}
        >
          <Spin
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      ) : roles.length > 0 ? (
        <RoleAndPermission
          activeRole={activeRole}
          roles={roles}
          roleStatusList={roleStatusList}
          setRoles={setRoles}
          setRoleStatusList={setRoleStatusList}
          addRoleButtonConfig={addRoleButtonConfig}
          currentTenant={currentTenant}
          rolePermissions={rolesData[activeRole]?.categories_permission}
          setActiveRole={setActiveRole}
          updateList={updateList}
          setUpdateList={setUpdateList}
        />
      ) : (
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "500px",
          }}
        >
          <div className="add-newRole-div">
            <h1>Add a new Role</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
