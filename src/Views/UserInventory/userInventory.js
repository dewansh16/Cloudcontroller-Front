import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Modal, Spin, Menu, Dropdown } from "antd";
import AddUser from "./AddUser/addUser";
import EditUser from "./EditUser/editUser";
// import PaginationBox from '../Components/paginationBox';
import { PaginationBox } from "../Components/PaginationBox/pagination";
import userApi from "../../Apis/userApis";
import { Button as Buttons } from "../../Theme/Components/Button/button";

import { Input, GlobalSearch } from "../../Theme/Components/Input/input";

import Navbar from "../../Theme/Components/Navbar/navbar";

import "./userinventory.css";

import Icons from "../../Utils/iconMap";
import DropdownIcon from "../../Assets/Icons/dropdownIcon";

import {
    CheckOutlined,
    CloseCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Select, SelectOption } from "../../Theme/Components/Select/select";
import tenantApi from "../../Apis/tenantApis";

export default function UserInventory() {
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userModal, setUserModal] = useState(false);
    const [activeTenant, setActiveTenant] = useState(null);
    const [tenantList, setTenantList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        userApi
            .getMyself()
            .then((res) => {
                setActiveTenant(res.data.response?.users[0]?.tenant_id);
                tenantApi
                    .getTenantList()
                    .then((res) => {
                        setTenantList(res.data.response?.tenants[0]);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    console.log('tenantList', tenantList);

    const showUserModal = () => {
        setUserModal(true);
    };
    const closeAddUser = () => {
        setUserModal(false);
    };

    const [editModal, setEditModal] = useState(false);
    const [record, setRecord] = useState(null);
    const [index, setIndex] = useState(null);
    const [searchType, setSearchType] = useState("Name");

    const showEditModal = (record, index) => {
        setEditModal(true);
        setRecord(record);
        setIndex(index);
    };
    const closeEditUser = () => {
        setEditModal(false);
    };

    const [userListToShow, setUserListToShow] = useState([]);

    function fetchUserList(searchType, value) {
        const firstName = value?.split(" ").slice(0, 1).join(" ");
        const lastName = value?.split(" ").slice(-1).join(" ");
        userApi
            .getUserList(
                searchType,
                firstName,
                lastName,
                10,
                10 * (currentPageVal - 1),
                activeTenant
            )
            .then((res) => {
                const data = res.data?.response.users[0];
                const moodifiedData = data.map((item) => {
                    return {
                        ...item,
                        key: item.id,
                    };
                });
                setUserListToShow(moodifiedData);
                setTotalPages(Math.ceil(res.data?.response.userTotalCount / 10));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onClick = function ({ key }) {
        console.log(`Click on item ${key}`);
        setActiveTenant(key);
    };

    const menu = (
        <Menu onClick={onClick} className='list-user-dropdown-select'>
            {tenantList.map((tenant, index) => (
                <Menu.Item key={tenant.tenant_uuid}>
                    <p>{tenant.tenant_name}</p>
                </Menu.Item>
            ))}
        </Menu>
    );

    useEffect(() => {
        return fetchUserList();
    }, [userModal, editModal, currentPageVal, activeTenant]);

    const searchUser = (value) => {
        console.log(value);
        fetchUserList(searchType, value);
    };

    const getTenantName = (tenant_id) => {
        const selectedTenant = tenantList.filter(
            (item) => item.tenant_uuid === tenant_id
        );
        // console.log(selectedTenant);
        return selectedTenant[0]?.tenant_name;
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "fname",
            key: "patchId",
            ellipsis: true,
            align: "center",
            render: (text, record) => (
                <>
                    {" "}
                    <Row
                        style={{
                            justifyContent: "center",
                            height: "50px",
                            alignItems: "center",
                        }}
                    >
                        <Col style={{ display: "flex" }} span={16}>
                            <text className="table-body-text">
                                {`${text + " " + record.lname}`.slice(0, 15)}
                            </text>
                        </Col>
                    </Row>
                    <Row>
                        {record === activekey ? (
                            <Col span={4} offset={7}>
                                <Button
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    onClick={() => {
                                        showEditModal(record, index);
                                    }}
                                    className="edit-button"
                                >
                                    {" "}
                                    <EditOutlined />{" "}
                                </Button>
                            </Col>
                        ) : (
                            ""
                        )}
                    </Row>
                </>
            ),
            sorter: (a, b) => a.fname.localeCompare(b.fname),
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "patchMap",
            ellipsis: true,
            align: "center",
            render: (dataIndex) => (
                <text className="table-body-text">{dataIndex}</text>
            ),
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "User Status",
            dataIndex: "active",
            key: "patchStatus",
            ellipsis: true,
            align: "center",
            render: (dataIndex) => (
                <div>
                    {dataIndex === 1 ? (
                        <div>
                            {" "}
                            <CheckOutlined
                                style={{
                                    fontSize: "16px",
                                    paddingRight: "10px",
                                    color: "#06A400",
                                }}
                            />{" "}
                            <text className="active-text">Active</text>{" "}
                        </div>
                    ) : (
                        <div>
                            {" "}
                            <CloseCircleOutlined
                                style={{
                                    fontSize: "16px",
                                    paddingRight: "10px",
                                    color: "#DD4A34",
                                }}
                            />{" "}
                            <text className="inactive-text">Inactive</text>{" "}
                        </div>
                    )}
                </div>
            ),
            sorter: (a, b) => a.active - b.active,
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            align: "center",
            width: "20%",
            render: (dataIndex) => (
                <text className="table-body-text">{dataIndex}</text>
            ),
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            ellipsis: true,
            align: "center",
            render: (dataIndex) => (
                <text className="table-body-text">
                    {dataIndex.charAt(0).toUpperCase() + dataIndex.slice(1)}
                </text>
            ),
            sorter: (a, b) => a.role.localeCompare(b.role),
            filters: [
                {
                    text: "Doctor",
                    value: "doctor",
                },
                {
                    text: "Administrator",
                    value: "administrator",
                },
                {
                    text: "Nurse",
                    value: "nurse",
                },
                {
                    text: "Patient",
                    value: "patient",
                },
                {
                    text: "Admin",
                    value: "admin",
                },
                {
                    text: "technician",
                    value: "technician",
                },
            ],
            onFilter: (value, record) => record.role.toLowerCase() === value,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "role",
            ellipsis: true,
            align: "center",
            render: (dataIndex, record, index) => (
                <>
                    <Row style={{ justifyContent: "center" }}>
                        <Col style={{ display: "flex" }} span={16}>
                            <text className="table-body-text phone-number-box">
                                {dataIndex}
                            </text>
                        </Col>
                    </Row>
                    <Row>
                        {record === activekey ? (
                            <Col span={4} offset={7}>
                                <Button
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    onClick={() => {
                                        showEditModal(record, index);
                                    }}
                                    className="edit-button"
                                >
                                    {" "}
                                    <EditOutlined />{" "}
                                </Button>
                            </Col>
                        ) : (
                            ""
                        )}
                    </Row>
                </>
            ),
        },
    ];

    const [activekey, setActiveKey] = useState(null);

    const onClickRow = (record) => {
        return {
            onMouseEnter: () => {
                setActiveKey(record);
            },
            onClick: () => {
                setActiveKey(record);
            },
            onMouseLeave: () => {
                setActiveKey(null);
            },
        };
    };

    return (
        <>
            <Navbar
                startChildren={
                    // <div className="user-header-heading">
                    <Dropdown className="dropdown-select-user" overlay={menu} trigger={["click"]}>
                        <p
                            style={{
                                marginTop: "10px",
                                // marginLeft: "12%",
                                fontWeight: 600,
                                fontSize: "18px",
                                marginBottom: "0px",
                                cursor: "pointer",
                                textAlign: "left",
                            }}
                        >
                            {getTenantName(activeTenant)}{" "}
                            <span style={{ cursor: "pointer" }}>
                                <DropdownIcon />
                            </span>
                        </p>
                    </Dropdown>
                    // </div>
                }
                centerChildren={
                    <>
                        <div style={{ marginRight: "20px" }}>
                            <Select
                                showSearch
                                defaultValue="Name"
                                placeholder="Select Type"
                                optionFilterProp="children"
                                filterOption={true}
                                onChange={(value) => {
                                    setSearchType(value);
                                }}
                            >
                                <SelectOption value="Name">Name</SelectOption>
                                <SelectOption value="Phone">Phone</SelectOption>
                                <SelectOption value="Email">Email</SelectOption>
                            </Select>
                        </div>
                        <div>
                            <GlobalSearch
                                enterButton
                                onSearch={searchUser}
                                style={{
                                    width: "100%",
                                }}
                                placeholder="Type here"
                            />
                        </div>
                        <div>
                            <Buttons
                                type="secondary"
                                style={{ background: "transparent" }}
                                onClick={() => {
                                    fetchUserList();
                                }}
                            >
                                {Icons.sync({ style: { fontSize: "1.257rem" } })}
                            </Buttons>
                        </div>
                    </>
                }
                endChildren={
                    <>
                        <Buttons
                            style={{ marginRight: "20px" }}
                            className="utility"
                            onClick={showUserModal}
                        >
                            {" "}
                            <span style={{ marginRight: "10px" }}>
                                {Icons.PlusOutlined({})}
                            </span>{" "}
                            Add User
                        </Buttons>
                        <div>
                            <PaginationBox
                                totalPages={totalPages}
                                currentPageVal={currentPageVal}
                                setCurrentPageVal={setCurrentPageVal}
                            />
                        </div>
                    </>
                }
            />

            {isLoading && (
                <div
                    style={{
                        position: "relative",
                        height: "100vh",
                    }}
                >
                    {" "}
                    <Spin
                        size="large"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </div>
            )}

            {!isLoading && (
                <>
                    <div className="userinventory-body">
                        <Row
                            className="user-table"
                            justify="start"
                            style={{ margin: "10px 2% 30px 2%", padding: "0" }}
                        >
                            <Table
                                columns={columns}
                                dataSource={userListToShow}
                                size="middle"
                                bordered={true}
                                scroll={{ y: "75vh" }}
                                onRow={onClickRow}
                            />
                        </Row>
                    </div>
                </>
            )}

            <Modal
                visible={userModal}
                title=""
                destroyOnClose={true}
                centered
                footer={null}
                closable={false}
                width="68%"
            >
                <AddUser state={closeAddUser} />
            </Modal>

            <Modal
                centered
                visible={editModal}
                title=""
                destroyOnClose={true}
                footer={null}
                closable={false}
                width="68%"
            >
                <EditUser
                    setActiveKey={setActiveKey}
                    state={closeEditUser}
                    userData={record}
                    index={index}
                    title={"Edit Details"}
                    showCancel
                />
            </Modal>
        </>
    );
}
