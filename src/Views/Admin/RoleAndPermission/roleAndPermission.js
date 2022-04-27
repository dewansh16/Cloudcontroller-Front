import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../Theme/Components/Button/button";
import { Table, Input, Row, Col, Divider, Checkbox, Form } from "antd";
import Icons from "../../../Utils/iconMap";
import "../admin.css";
import "./roleAndPermission.css";
import roleApi from "../../../Apis/roleApis";

function RoleAndPermission({
  activeRole,
  setActiveRole,
  roles,
  roleStatusList,
  setRoles,
  setRoleStatusList,
  addRoleButtonConfig,
  currentTenant,
  rolePermissions,
  updateList,
  setUpdateList,
}) {
  const [permissedArray, setPermissedArray] = useState(
    rolePermissions ? rolePermissions : []
  );
  const [activePermission, setActivePermission] = useState(0);
  const [permissions, setPermissions] = useState([
    "Patients",
    "Patches",
    "Tenant",
    "Users",
    "Prescription",
  ]);

  const [permissionForm] = Form.useForm();

  const columns = [
    {
      title: (
        <div
          style={{
            fontFamily: "Lexend",
            fontWeight: "500",
            fontSize: "14px",
            color: "#727272",
          }}
        >
          TYPE
        </div>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontFamily: "Lexend",
            fontWeight: "500",
            fontSize: "14px",
            color: "#727272",
          }}
        >
          Access
        </div>
      ),
      dataIndex: "access",
      key: "access",
    },
  ];

  const handleChange = (values) => {
    console.log(values);
    if (permissedArray.indexOf(values[0].name[0]) !== -1) {
      let newPermissedArray = permissedArray;
      let reqIndex = permissedArray.indexOf(values[0].name[0]);
      newPermissedArray.splice(reqIndex, 1);
      setPermissedArray(newPermissedArray);
    } else {
      let newPermissedArray = permissedArray;
      permissedArray.push(values[0].name[0]);
      setPermissedArray(newPermissedArray);
    }
  };

  const initialValues = {
    createPatient: permissedArray,
    viewPatient: permissedArray,
    deletePatient: permissedArray,
    createTenant: permissedArray,
    deleteTenant: permissedArray,
    viewTenant: permissedArray,
    createUser: permissedArray,
    deleteUser: permissedArray,
    viewUser: permissedArray,
    deletePatch: permissedArray,
    createPatch: permissedArray,
    viewPatch: permissedArray,
    createPrescription: permissedArray,
    deletePrescription: permissedArray,
    viewPrescription: permissedArray,
  };

  const patientsTableData = [
    {
      key: "11",
      name: <div style={{ fontSize: "16px" }}>View Patient</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="viewPatient">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("viewPatient")}
                  value="viewPatient"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "12",
      name: <div style={{ fontSize: "16px" }}>Create Patient</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="createPatient">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("createPatient")}
                  value="createPatient"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "13",
      name: <div style={{ fontSize: "16px" }}>Delete Patient</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="deletePatient">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("deletePatient")}
                  value="deletePatient"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
  ];

  const patchesTableData = [
    {
      key: "21",
      name: <div style={{ fontSize: "16px" }}>View Patch</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="viewPatch">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("viewPatch")}
                  value="viewPatch"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "22",
      name: <div style={{ fontSize: "16px" }}>Create Patch</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="createPatch">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("createPatch")}
                  value="createPatch"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "23",
      name: <div style={{ fontSize: "16px" }}>Delete Patch</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="deletePatch">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("deletePatch")}
                  value="deletePatch"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
  ];

  const tenantTableData = [
    {
      key: "31",
      name: <div style={{ fontSize: "16px" }}>View Tenants</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="viewTenant">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("viewTenant")}
                  value="viewTenant"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "32",
      name: <div style={{ fontSize: "16px" }}>Create Tenants</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="createTenant">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("createTenant")}
                  value="createTenant"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "33",
      name: <div style={{ fontSize: "16px" }}>Delete Tenants</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="deleteTenant">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("deleteTenant")}
                  value="deleteTenant"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
  ];

  const usersTableData = [
    {
      key: "41",
      name: <div style={{ fontSize: "16px" }}>View Users</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="viewUser">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("viewUser")}
                  value="viewUser"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "42",
      name: <div style={{ fontSize: "16px" }}>Create Users</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="createUser">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("createUser")}
                  value="createUser"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "43",
      name: <div style={{ fontSize: "16px" }}>Delete Users</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="deleteUser">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("deleteUser")}
                  value="deleteUser"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
  ];

  const prescriptionTableData = [
    {
      key: "51",
      name: <div style={{ fontSize: "16px" }}>View Prescription</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="viewPrescription">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("viewPrescription")}
                  value="viewPrescription"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "52",
      name: <div style={{ fontSize: "16px" }}>Create Prescription</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="createPrescription">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("createPrescription")}
                  value="createPrescription"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
    {
      key: "53",
      name: <div style={{ fontSize: "16px" }}>Delete Prescription</div>,
      access: (
        <div style={{ textAlign: "center" }}>
          <Form
            initialValues={initialValues}
            onFieldsChange={handleChange}
            form={permissionForm}
          >
            <Form.Item name="deletePrescription">
              <Checkbox.Group>
                <Checkbox
                  defaultChecked={permissedArray.includes("deletePrescription")}
                  value="deletePrescription"
                />
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </div>
      ),
      // write: "",
      // access: "",
    },
  ];

  const tables = [
    patientsTableData,
    patchesTableData,
    tenantTableData,
    usersTableData,
    prescriptionTableData,
  ];

  const [tableData, setTableData] = useState(patientsTableData);

  const configRoleName = (e) => {
    console.log(e.target.value);
    let newRoles = roles;
    newRoles[activeRole] = e.target.value;
    console.log(roleStatusList, roles, activeRole);
    let newRoleStatusList = roleStatusList;
    newRoleStatusList[activeRole].role = e.target.value;
    setRoles(newRoles);
    setRoleStatusList(newRoleStatusList);
  };

  function createPermissionButton() {
    let buttons = [];
    for (let i = 0; i <= permissions.length; i++) {
      buttons.push(
        <div key={i} style={{ textAlign: "center", position: "relative" }}>
          <Button
            type="text"
            onClick={() => {
              setActivePermission(i);
              setTableData(tables[i]);
            }}
            style={choosePermissionButtonStyle(i)}
          >
            {permissions[i]}
          </Button>
        </div>
      );
    }
    return buttons;
  }

  function choosePermissionButtonStyle(i) {
    if (i === activePermission) {
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

  const addNewRole = () => {
    let data = {
      role_name: roles[activeRole],
      tenant_id: currentTenant.uuid,
      role_permission: [],
      categories_permission: permissedArray,
    };
    roleApi
      .createNewRole(data)
      .then((res) => {
        let statusList = roleStatusList;
        statusList[activeRole].completed = true;
        console.log(activeRole, statusList);
        setRoleStatusList(statusList);
        addRoleButtonConfig();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
  };

  const updateRole = () => {
    let data = {
      role_name: roles[activeRole],
      role_uuid: roleStatusList[activeRole].role_uuid,
      tenant_id: currentTenant.uuid,
      role_permission: [],
      categories_permission: permissedArray,
    };
    roleApi
      .updateRole(data)
      .then((res) => {
        console.log("updateRole API ran", res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
    addRoleButtonConfig();
  };

  const deleteRole = () => {
    roleApi
      .deleteRole(roleStatusList[activeRole].role_uuid)
      .then((res) => {
        console.log("deleteRole API ran", res);
        let statusList = roleStatusList;
        statusList.splice(activeRole, 1);
        setRoleStatusList(statusList);
        let newRoles = roles;
        newRoles.splice(activeRole, 1);
        setRoles(newRoles);
        if (activeRole !== 0) {
          setActiveRole(activeRole - 1);
        } else {
          setUpdateList(!updateList);
        }
        addRoleButtonConfig();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(roles[activeRole], activeRole, roleStatusList, permissedArray);

  return (
    <Row
      style={{
        display: "flex",
        borderLeft: "1px solid rgba(0, 142, 244, 0.2)",
      }}
    >
      <Row style={{ width: "100%", height: "72px", marginTop: "-1%" }}>
        <Col span={10} className="role-and-permission-header">
          <Row style={{ width: "100%" }}>
            <Col
              offset={4}
              span={5}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1 style={{ marginBottom: "0px", fontSize: "20px" }}>Role :</h1>
            </Col>
            <Col span={15} className="role-and-permission-header">
              <Input
                defaultValue={roles[activeRole]}
                onChange={configRoleName}
                type="text"
              ></Input>
            </Col>
          </Row>
        </Col>
        <Col span={14} className="role-and-permission-header">
          <Row className="roles-action-btn">
            <Col offset={6} span={6} className="center-in-col">
              <Button
                onClick={deleteRole}
                style={{ fontSize: "20px" }}
                className="secondary"
              >
                Delete Role
              </Button>
            </Col>
            <Col span={6} className="center-in-col">
              <Button
                style={{ fontSize: "20px" }}
                onClick={() => {
                  setPermissedArray([]);
                  permissionForm.setFieldsValue({
                    createPatient: [],
                    viewPatient: [],
                    deletePatient: [],
                    createTenant: [],
                    deleteTenant: [],
                    viewTenant: [],
                    createUser: [],
                    deleteUser: [],
                    viewUser: [],
                    deletePatch: [],
                    createPatch: [],
                    viewPatch: [],
                    createPrescription: [],
                    deletePrescription: [],
                    viewPrescription: [],
                  });
                }}
                className="secondary"
              >
                Clear All
              </Button>
            </Col>
            <Col span={6} className="center-in-col">
              <Button
                onClick={
                  roleStatusList[activeRole]?.completed
                    ? updateRole
                    : addNewRole
                }
                disabled={currentTenant.uuid === undefined ? true : false}
                style={{ fontSize: "20px" }}
                className="primary"
              >
                {roleStatusList[activeRole]?.completed ? "Update" : "Add"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
      <Row className="role-and-permission-body">
        <div>
          <h1 style={{ marginBottom: "0px", padding: "0px 35px" }}>
            Categories
          </h1>
          <div className="permissions-container">
            <div className="role-name"></div>
            <div className="permissions">
              <div className="permission">
                {createPermissionButton().map((item) => {
                  return item;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="permissions-table">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
          />
        </div>
      </Row>
    </Row>
  );
}

export default RoleAndPermission;
