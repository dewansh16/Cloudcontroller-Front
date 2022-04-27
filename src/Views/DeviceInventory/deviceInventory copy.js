import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Row,
    Col,
    Modal,
    Tag,
    Popover,
    Dropdown,
    Menu,
    message,
} from "antd";
import { withRouter } from "react-router-dom";
import "./device.css";
import PatchInventoryModal from "./addDevice/addDevice";
import AddBundleModal from "./addBundle/addBundle";
import device1 from "../../Assets/Images/ecg.png";
import device2 from "../../Assets/Images/temp1.png";
import device3 from "../../Assets/Images/watch.jpg";
import device4 from "../../Assets/Images/spo2.jpg";
import device5 from "../../Assets/Images/BUNDLE_png.png";
import deviceApi from "../../Apis/deviceApis";
// import PaginationBox from '../Components/paginationBox';
import { PaginationBox } from "../Components/PaginationBox/pagination";

import Navbar from "../../Theme/Components/Navbar/navbar";

import { Input, GlobalSearch } from "../../Theme/Components/Input/input";

import { Button as Buttons } from "../../Theme/Components/Button/button";

import Icons from "../../Utils/iconMap";
import { UserStore } from "../../Stores/userStore";

import {
    SearchOutlined,
    CaretRightOutlined,
    CaretDownOutlined,
    CheckOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

function PatchInventory() {
    // const { url } = useRouteMatch();

    const [value, setValue] = useState(null);

    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [extraDiv, setExtraDiv] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [updateList, setUpdateList] = useState(false);
    const [activekey, setActiveKey] = useState(null);
    const [visible, setVisible] = useState(false);
    const [bundle, setBundle] = useState(false);

    const [modifiedList, setModifiedList] = useState([]);
    const [filteredlist, setFilteredList] = useState([]);

    const modifyData = (fetchedData) => {
        console.log('fetchedData', fetchedData);
        // const modifiedData = fetchedData.map((device, index) => {
        //     if (device.AssociatedPatch.length > 1) {
        //         return {
        //             ...device,
        //             key: index,
        //         };
        //     } else if (device.AssociatedPatch.length === 1) {
        //         return {
        //             ...device,
        //             key: index,
        //         };
        //     } else if (
        //         device.AssociatedPatch.length === 0 &&
        //         device.patch_type === "gateway"
        //     ) {
        //         return {
        //             ...device,
        //             key: index,
        //         };
        //     } else if (device.patch_group_id === null) {
        //         return {
        //             ...device,
        //             key: index,
        //         };
        //     } else return null;
        // })
        // .filter((device) => device !== null);

        // console.log('modifiedData', modifiedData);
        // setFilteredList(fetchedData);
        // return fetchedData;
    };

    function fetchPatchList(serial) {
        const { tenant } = UserStore.getUser();

        const dataBody = {
            limit: 10, 
            offset: 0,
            tenant_id: tenant
        }

        deviceApi
            .getPatchList(dataBody)
            .then((res) => {
                console.log('getPatchList', res.data?.response, res);
                const data = res.data?.response?.patches;
                // setPatchlist(data);
                // setModifiedList(modifyData(data));
                
                setFilteredList(data);
                setTotalPages(Math.ceil(res.data?.response?.patchTotalCount / 10));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        return fetchPatchList();
    }, [updateList, bundle, visible, currentPageVal]);

    const success = () => {
        const key = "warning";
        message.success({
            content: "status updated successfully",
            key,
            duration: 1,
        });
    };

    const updateActive = (data) => {
        setIsUploading(true);
        console.log(data, value);
        const sendData = [
            {
                patch_type: data.patch_type,
                patch_uuid: data.patch_uuid,
                patch_status: value,
                patch_serial: data.patch_serial,
                tenant_id: data.tenant_id,
            },
        ];
        console.log(sendData);

        deviceApi
            .editPatch(sendData, data.patch_uuid)
            .then((res) => {
                console.log(res.data?.response);

                if (data.AssociatedPatch.length > 1) {
                data.AssociatedPatch.map((item, index) => {
                    const sendData = [
                    {
                        patch_type: item.patch_type,
                        patch_uuid: item.patch_uuid,
                        patch_status: value,
                        patch_serial: item.patch_serial,
                        tenant_id: item.tenant_id,
                    },
                    ];
                    console.log(sendData);
                    deviceApi
                    .editPatch(sendData, item.patch_uuid)
                    .then((res) => {
                        console.log(res.data?.response);
                        if (index === data.AssociatedPatch.length - 1) {
                        setIsUploading(false);
                        openPopover("closePopOver");
                        }
                        success();
                    })
                    .catch((err) => {
                        console.log(err);
                        setIsUploading(false);
                    });
                });
                } else {
                setIsUploading(false);
                openPopover("closePopOver");
                success();
                }
            })
            .catch((err) => {
                console.log(err);
                setIsUploading(false);
            });
    };

    const searchDevice = (value) => {
        console.log(value);

        fetchPatchList(value);
    };

    const showModal = () => {
        setVisible(true);
    };
    const showBundleModal = () => {
        setBundle(true);
    };
    const handleBundle = () => {
        setBundle(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    
    function onChange(pagination, filters, sorter, extra) {
        console.log("params", pagination, filters, sorter, extra);
    }

    const editBtnStyle = {
        height: "40px",
        border: "2px solid #D5F0FF ",
        borderRadius: "6px ",
        fontSize: "16px",
        fontWeight: "500",
        width: "fit-content ",
        padding: "0px 16px ",
        color: "#1479FF",
        position: "absolute",
        top: "0",
        right: "-6px",
    };

    const onEditBtnStyle = {
        height: "40px",
        border: "2px solid #D5F0FF ",
        borderRadius: "6px ",
        fontSize: "16px",
        fontWeight: "500",
        width: "fit-content ",
        padding: "0px 16px ",
        color: "#1479FF",
    };

    const handleImg = (props) => {
        if (props.AssociatedPatch?.length > 1) {
            return device5;
        }
        switch (props.patch_type) {
            case "temperature":
                return device2;
            case "ecg":
                return device1;
            case "spo2":
                return device4;
            case "gateway":
                return device3;
            default:
                return null;
        }
    };

    const content = (
        <div>
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "10px",
                }}
            >
                <Button
                    type="text"
                    loading={isUploading}
                    onClick={(e) => {
                        e.stopPropagation();
                        updateActive(activekey);
                    }}
                    style={{
                        ...onEditBtnStyle,
                        background: "#fff",
                        color: "#06A400",
                        padding: "0px 12px",
                        marginRight: "10px",
                    }}
                >
                    {" "}
                    <CheckOutlined style={{ marginLeft: "0px" }} />
                </Button>
                <Button
                    type="text"
                    onClick={(e) => {
                        openPopover("closePopOver");
                        e.stopPropagation();
                    }}
                    style={{
                        ...onEditBtnStyle,
                        color: "white",
                        backgroundColor: "#1479FF",
                    }}
                >
                    {" "}
                    x
                </Button>
            </div>
            <div style={{ display: "flex" }}>
                <Button
                    onClick={(e) => {
                        setValue(e.target.innerText);
                        e.stopPropagation();
                    }}
                    type="text"
                    className={
                        value === "Inactive" || value === "0"
                        ? "inactive-active-radio-btn"
                        : "inactive-radio-btn"
                    }
                    value="inactive"
                >
                    Inactive
                </Button>
                <Button
                    onClick={(e) => {
                        setValue(e.target.innerText);
                        e.stopPropagation();
                    }}
                    type="text"
                    className={
                        value === "Under Sterilization"
                        ? "notCleaned-active-radio-btn"
                        : "notCleaned-radio-btn"
                    }
                    value="not Cleaned"
                >
                    Under Sterilization
                </Button>
                <Button
                    onClick={(e) => {
                        setValue(e.target.innerText);
                        e.stopPropagation();
                    }}
                    type="text"
                    className={
                        value === "1" || value === "Active"
                        ? "active-active-radio-btn"
                        : "active-radio-btn"
                    }
                    value="active"
                >
                    Active
                </Button>
            </div>
        </div>
    );

    const columns = [
        {
            dataIndex: "patch_type",
            key: "sensorsImage",
            ellipsis: true,
            width: 100,
            render: (dataIndex, record) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img alt="someimage" src={handleImg(record)} width="80px"></img>
                </div>
            )
        },

        {
            title: "Device Serial",
            dataIndex: "patch_serial",
            key: "lastSeen",
            ellipsis: true,
            width: 100,
            render: (dataIndex) => {
                console.log(dataIndex);
                return (
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                        <div>
                            <div>
                            {dataIndex.length > 15
                                ? dataIndex.slice(0, 13) + "..."
                                : dataIndex}
                            </div>
                        </div>
                    </div>
                )
            }
        },

        {
            title: "Device Status",
            dataIndex: "patch_status",
            key: "patchStatus",
            ellipsis: true,
            align: "center",
            width: 150,
            render: (dataIndex, record) => (
                <Row style={{ alignItems: "center", justifyContent: "center" }}>
                    <Col
                        span={24}
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {(dataIndex === "1" || dataIndex === "Active") && (
                            <Tag
                                icon={<CheckOutlined />}
                                style={{
                                    marginRight: "10px",
                                    width: "fit-content",
                                    color: "#06A400",
                                    backgroundColor: "whilte",
                                    fontSize: "16px",
                                    border: "2px solid #06A00020",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "500",
                                    height: "40px",
                                    padding: "0px 16px",
                                }}
                                color="#06A000"
                            >
                                Active
                            </Tag>
                        )}
                        {(dataIndex === "Inactive" || dataIndex === "0") && (
                            <Tag
                                icon={<CloseCircleOutlined />}
                                style={{
                                    marginRight: "10px",
                                    width: "fit-content",
                                    color: "#DD4A34",
                                    backgroundColor: "whilte",
                                    fontSize: "16px",
                                    border: "2px solid #FFBEB4",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "500",
                                    height: "40px",
                                    padding: "0px 16px",
                                }}
                                color="#FFBEB4"
                            >
                                Inactive
                            </Tag>
                        )}
                        {dataIndex === "Under Sterilization" && (
                            <Tag
                                style={{
                                    marginRight: "10px",
                                    width: "fit-content",
                                    color: "#1479FF",
                                    backgroundColor: "whilte",
                                    fontSize: "16px",
                                    border: "2px solid #1479FF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "500",
                                    height: "40px",
                                    padding: "0px 16px",
                                    marginLeft: "-24px",
                                }}
                                color="#FFBEB4"
                            >
                                Under Sterilization
                            </Tag>
                        )}
                        {record === activekey ? (
                            <Popover
                                overlayClassName={"device-status-popup"}
                                trigger="click"
                                visible={editActiveRow === record ? true : false}
                                placement="bottom"
                                content={content}
                                overlayStyle={{ paddingTop: "30px" }}
                                overlayInnerStyle={{ background: "white" }}
                            >
                                {editActiveRow !== record ? (
                                <Button
                                    type="text"
                                    onClick={(e) => {
                                        openPopover(record);
                                        e.stopPropagation();
                                    }}
                                    style={editBtnStyle}
                                >
                                    {" "}
                                    Edit
                                </Button>
                                ) : (
                                ""
                                )}
                            </Popover>
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>
            ),
            filters: [
                {
                    text: "Active",
                    value: "1" || "Active",
                },
                {
                    text: "Under Sterilization",
                    value: "Under Sterilization",
                },
                {
                    text: "Inactive",
                    value: "0" || "Inactive",
                },
            ],

            onFilter: (value, record) => record.patch_status === value,

            oncell: (record, rowindex) => {
                console.log(record, rowindex);
            },
        },

        {
            title: "Sensors",
            dataIndex: "patch_type",
            key: "sensors",
            ellipsis: true,
            width: 100,
            render: (dataIndex, record) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "100px",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                        }}
                    >
                        {record.AssociatedPatch?.length > 1 ? "Bundle" : dataIndex}
                    </span>
                </div>
            ),
            filters: [
                {
                    text: "Bundle",
                    value: "bundle",
                },
                {
                    text: "Gateway",
                    value: "gateway",
                },
                {
                    text: "ecg",
                    value: "ecg",
                },
                {
                    text: "spo2",
                    value: "spo2",
                },
                {
                    text: "Temperature",
                    value: "temperature",
                },
            ],
            onFilter: (value, record) => record.patch_type === value 
        },
        {
            title: "Device In Use",
            dataIndex: "patch_patient_map",
            key: "patchMap",
            ellipsis: true,
            align: "center",
            width: 100,

            render: (dataIndex, record) => (
                <Row style={{ alignItems: "center", justifyContent: "center" }}>
                <Col span={16}>
                    {dataIndex === null ? (
                    <Tag
                        icon={<CloseCircleOutlined />}
                        style={{
                        marginRight: "16px",
                        width: "fit-content",
                        color: "#DD4A34",
                        backgroundColor: "whilte",
                        fontSize: "16px",
                        border: "2px solid #FFBEB4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        height: "40px",
                        padding: "0px 16px",
                        }}
                        color="#FD505C"
                    >
                        Unregistered
                    </Tag>
                    ) : (
                    <Tag
                        icon={<CheckOutlined />}
                        style={{
                        marginRight: "5px",
                        marginLeft: "5px",
                        width: "fit-content",
                        color: "#06A400",
                        backgroundColor: "whilte",
                        fontSize: "16px",
                        border: "2px solid #06A00020",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        height: "40px",
                        padding: "0px 16px",
                        }}
                        color="#06A400"
                    >
                        Registered
                    </Tag>
                    )}
                </Col>
                </Row>
            ),
            filters: [
                {
                text: "Registered",
                value: 1,
                },
                {
                text: "Unregistered",
                value: null,
                },
            ],
            onFilter: (value, record) => {
                if (value === null) {
                return record.patch_patient_map === null;
                }
                if (value === 1) {
                return record.patch_patient_map !== null;
                }
            },
        },

        {
            title: "",
            dataIndex: "",
            key: "expandIcon",
            ellipsis: true,
            width: 10,
        },
    ];

    const customExpandIcon = (props) => {
        console.log('props', props);
        if ( /* props.record.AssociatedPatch.length > 1 */ true) {
            if (props.expanded) {
                //Data-icon when expanding
                return (
                <div
                    onClick={(e) => {
                        props.onExpand(props.record, e);
                    }}
                >
                    <CaretDownOutlined
                        style={{
                            color: "#7750FD",
                            marginRight: "0px",
                            fontSize: "25px",
                            cursor: "pointer",
                        }}
                    />
                </div>
                );
            } else {
                //Data-icon when not expanded
                return (
                <div
                    onClick={(e) => {
                        props.onExpand(props.record, e);
                    }}
                >
                    <CaretRightOutlined
                        style={{
                            color: "#7750FD",
                            marginRight: "0px",
                            fontSize: "25px",
                            cursor: "pointer",
                        }}
                    />
                </div>
                );
            }
        } else {
        //No data-icon
            return null;
        }
    };

    const setInBundleDeviceStatus = (status) => {
        switch (status) {
        case 1:
            return (
            <p className="active-patch">
                {" "}
                <CheckOutlined /> Active
            </p>
            );
        case "1":
            return (
            <p className="active-patch">
                {" "}
                <CheckOutlined /> Active
            </p>
            );
        case 0:
            return (
            <p className="inactive-patch">
                {" "}
                <CloseCircleOutlined /> Inactive
            </p>
            );
        case "0":
            return (
            <p className="inactive-patch">
                {" "}
                <CloseCircleOutlined /> Inactive
            </p>
            );
        case "Under Sterilization":
            return <p className="notclean-patch"> Under Sterilization</p>;
        case "Inactive":
            return (
            <p className="inactive-patch">
                {" "}
                <CloseCircleOutlined /> Inactive
            </p>
            );
        case "Active":
            return (
            <p className="active-patch">
                {" "}
                <CheckOutlined /> Active
            </p>
            );
        default:
            return (
            <p className="inactive-patch">
                {" "}
                <CloseCircleOutlined /> Inactive
            </p>
            );
        }
    };

    const bundleModel = (record) => {
        return (
            <div style={{ width: "100%" }}>
                <span>ssd</span>
                {/* <Row style={{ height: "auto" }}>
                    <Col
                        key={index}
                        span={6}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Row className="bundle-item">
                            <Col span={10}>
                                {
                                <div
                                    style={{ display: "flex", justifyContent: "center" }}
                                >
                                    <img
                                        alt="someimage"
                                        src={handleImg(record)}
                                        width="80px"
                                    />
                                </div>
                                }
                            </Col>
                            <Col span={14}>
                                <div>
                                <div>
                                    <h1
                                        style={{
                                            textAlign: "left",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {" "}
                                        <span>SN:</span>{" "}
                                        {record.patch_serial}
                                    </h1>
                                </div>
                                <div>
                                    {setInBundleDeviceStatus(
                                        record.patch_status
                                    )}
                                </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row> */}
            </div>
        );
    };

    const menu = (
        <Menu>
        <Menu.Item
            style={{
            textAlign: "center",
            padding: "6px 0px 6px 0px",
            fontSize: "16px",
            }}
            onClick={showModal}
            key="0"
        >
            Device
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
            style={{
            textAlign: "center",
            padding: "6px 0px 6px 0px",
            fontSize: "16px",
            }}
            onClick={showBundleModal}
            key="1"
        >
            Bundle
        </Menu.Item>
        </Menu>
    );

    const [editActiveRow, setEditActiveRow] = useState(null);

    const openPopover = (record) => {
        if (record === "closePopOver") {
            setUpdateList(!updateList);
            setEditActiveRow(null);
            setExtraDiv(false);
        }
        if (editActiveRow === null) {
            setEditActiveRow(record);
            setExtraDiv(true);
        } else {
            setUpdateList(!updateList);
            setEditActiveRow(null);
            setExtraDiv(false);
        }
    };

    const onClickRow = (record) => {
        console.log('record', record);
        return {
            onMouseEnter: () => {
                if (editActiveRow === null) {
                    setActiveKey(record);
                    setValue(record.patch_status);
                }
            },
            onMouseLeave: () => {
                if (editActiveRow === null) setActiveKey(null);
            },
        };
    };
    const setRowClassName = (record) => {
        // console.log(record, record === editActiveRow)
        return record === editActiveRow ? "clickRowStyl" : "";
    };

    return (
        <>
            <Navbar
                startChildren={
                    <div className="user-header-heading">
                        <p>Device Inventory</p>
                    </div>  
                }
                centerChildren={
                    <>
                        <div style={{ width: "100%" }}>
                            <GlobalSearch
                                enterButton
                                onSearch={searchDevice}
                                style={{
                                width: "100%",
                                }}
                                placeholder="Type here"
                            />
                        </div>
                    </>
                }
                endChildren={
                    <>
                        <Dropdown
                            overlay={menu}
                            trigger={["click"]}
                            placement="bottomCenter"
                        >
                            <Buttons style={{ marginRight: "24px" }} className="utility">
                                {" "}
                                <span style={{ marginRight: "10px" }}>
                                {Icons.PlusOutlined({})}
                                </span>{" "}
                                Add Device
                            </Buttons>
                        </Dropdown>
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

            <Row
                className="table-body devie-inventory-table"
                justify="start"
                style={{ padding: "0", backgroundColor: "white", margin: "4px" }}
            >
                <div style={{ margin: "30px 2%", width: "100%" }}>
                    {extraDiv === true ? <div className="blur-div"></div> : null}
                    
                    <Table
                        style={{ backgroundColor: "blue" }}
                        columns={columns}
                        dataSource={filteredlist}
                        size="middle"
                        onChange={onChange}
                        pagination={{ position: ["bottomRight"] }}
                        scroll={extraDiv === true ? { y: "hidden" } : { y: "100vh" }}
                        rowClassName={setRowClassName}
                        expandable={{
                            expandIconColumnIndex: 5,
                            expandedRowRender: (record) => bundleModel(record),
                            // rowExpandable: (record) => record.AssociatedPatch.length > 1,
                            expandIcon: (props) => customExpandIcon(props),
                            expandRowByClick: true,
                        }}
                        // rowClassName={(record, index) => { console.log(record, index) }}
                        // onRow={onClickRow}
                    />
                </div>
            </Row>

            <Modal
                visible={visible}
                title=""
                onCancel={handleCancel}
                maskClosable={false}
                footer={null}
                closable={true}
                width="60%"
                destroyOnClose={true}
            >
                <PatchInventoryModal />
            </Modal>

            <Modal
                visible={bundle}
                title=""
                onCancel={handleBundle}
                maskClosable={false}
                footer={null}
                closable={true}
                width="60%"
                destroyOnClose={true}
            >
                <AddBundleModal />
            </Modal>
        </>
    );
}

export default withRouter(PatchInventory);
