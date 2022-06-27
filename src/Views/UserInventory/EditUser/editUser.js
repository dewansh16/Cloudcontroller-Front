import React, { useState } from "react";
import { Col, Row, Form, message, notification } from "antd";
import "./editUser.css";
import { Button } from "../../../Theme/Components/Button/button";
import userApi from "../../../Apis/userApis";
import { Input } from "../../../Theme/Components/Input/input";
import { Select, SelectOption } from "../../../Theme/Components/Select/select";
import Password from "antd/lib/input/Password";

const Joi = require("joi");

export default function EditUser(props) {
    const record = props.userData;
    const showCancel = props.showCancel ? true : false;
    const disableRole = props.disableEditRole ? true : false;

    const [isUploading, setIsUploading] = useState(false);
    const success = () => {
        const key = "success";
        message.success({
            content: "status updated successfully",
            key,
            duration: 2,
        });
    };
    const warning = () => {
        const key = "warning";
        message.warning({ content: "Fill mandatory values", key, duration: 1 });
    };
    const [form] = Form.useForm();
    const Joy = Joi.defaults((schema) => {
        switch (schema.type) {
            case "string":
                return schema.allow("").allow(null);
            case "object":
                return schema.min(1);
            case "number":
                return schema.min(0);
            default:
                return schema;
        }
    });
    const editUserSchema = Joy.object({
        title: Joy.string().required(),
        fname: Joy.string().required(),
        lname: Joy.string().required(),
        username: Joy.string().required(),
        password: Joy.string().required().min(4).max(20),
        role: Joy.string().required(),
        phone: Joy.string().required(),
        email: Joy.string(),
    });

    function validate(data, schema) {
        const { error } = schema.validate(data);
        return error;
    }

    const handleEditUser = (values) => {
        setIsUploading(true);
        try {
            let editUserError = validate(
                {
                    title: values.title,
                    fname: values.fname,
                    lname: values.lname,
                    username: values.username,
                    password: values.password,
                    role: values.role,
                    phone: values.phone,
                    email: values.email,
                },
                editUserSchema
            );

            if (editUserError !== undefined) {
                throw new Error(editUserError);
            }

            const data = {
                ...values,
                tenant_id: record.tenant_id,
                phone: values.phone,
                password: values.password || record.password,
                user_uuid: record.user_uuid
            };
            userApi
                .editUser(record.user_uuid, data)
                .then((res) => {
                    setIsUploading(false);
                    success();
                    props.state();
                    props.getList();
                })
                .catch((err) => {
                    console.error(err);
                    setIsUploading(false);
                });
        } catch (e) {
            notification.warn({
                message: "Fill mandatory values",
                description: "Mandatory values are marked with *",
                placement: "topRight",
            });
        }
    };
    const userError = () => {
        warning();
    };
    const selectStyle = {
        color: "#474747",
        fontWeight: "500",
        paddingLeft: "0px",
        fontSize: "16px",
        lineHeight: "20px",
        height: "54px",
    };

    return (
        <>
            <Row
                justify="center"
                align="middle"
                style={{ padding: "2em" }}
                className="edit-modal"
            >
                <Col span={24}>
                    <Row span={24}>
                        <Col
                            style={{ padding: "1em", maxWidth: "65em" }}
                            className="formScrollContainer"
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                name="basic"
                                initialValues={{
                                    specialty: record?.specialty,
                                    title: record?.title,
                                    email: record?.email,
                                    fname: record?.fname,
                                    lname: record?.lname,
                                    city: record?.city,
                                    state: record?.state,
                                    facility: record?.facility,
                                    physician_type: record?.physician_type,
                                    tenant_id: record?.tenant_id,
                                    // password: undefined,
                                    phone: record?.phone,
                                    role: record?.role,
                                    active: record?.active,
                                    username: record?.username,
                                }}
                                onFinish={handleEditUser}
                                onFinishFailed={userError}
                            >
                                <Row span={24} justify="space-between">
                                    <Col
                                        span={10}
                                        style={{ paddingRight: "2em", paddingBottom: "4em" }}
                                    >
                                        <div className="edit-header">
                                            <p>{props.title}</p>
                                        </div>
                                    </Col>
                                    <Col
                                        span={10}
                                        style={{ display: "flex", justifyContent: "space-around" }}
                                    >
                                        {showCancel && (
                                            <Form.Item>
                                                <Button
                                                    type="text"
                                                    className="secondary"
                                                    onClick={() => {
                                                        props.state();
                                                        props.setActiveKey(null);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Form.Item>
                                        )}
                                        <Button
                                            style={{ height: "3.2em" }}
                                            loading={isUploading}
                                            className="primary"
                                            htmlType="submit"
                                        >
                                            Update
                                        </Button>
                                    </Col>
                                    <Col span={12} style={{ paddingRight: "2em" }}>
                                        <Row>
                                            <Col span={4}>
                                                <Form.Item
                                                    label="Title"
                                                    required={true}
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    name="title"
                                                    className="addPatientDetailsModal"
                                                >
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={true}
                                                        showArrow={false}
                                                    >
                                                        <SelectOption value="Mr">Mr</SelectOption>
                                                        <SelectOption value="Mrs">Mrs</SelectOption>
                                                        <SelectOption value="Mx">Mx</SelectOption>
                                                        <SelectOption value="Master">Master</SelectOption>
                                                        <SelectOption value="Miss">Miss</SelectOption>
                                                        <SelectOption value="Dr">Dr</SelectOption>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={18} offset={1}>
                                                <Form.Item
                                                    required={true}
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    label="First Name"
                                                    name="fname"
                                                    className="addPatientDetailsModal"
                                                >
                                                    <Input
                                                        onChange={(e) => {
                                                            e.target.value === record.fname
                                                                ? (e.target.style.color = "#474747")
                                                                : (e.target.style.color = "#1479FF");
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item
                                            required={true}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            label="Username"
                                            name="username"
                                            className="addPatientDetailsModal"
                                        >
                                            <Input
                                                disabled={true}
                                                onChange={(e) => {
                                                    e.target.value === record.username
                                                        ? (e.target.style.color = "#474747")
                                                        : (e.target.style.color = "#1479FF");
                                                }}
                                                value={record.username}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            required={true}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            label="User Status"
                                            name="active"
                                            className="addPatientDetailsModal"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterOption={true}
                                                style={selectStyle}
                                            >
                                                <SelectOption value={1}>Active</SelectOption>
                                                <SelectOption value={0}>Inactive</SelectOption>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            required={true}
                                            label="Password"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input a valid password",
                                                    min: 4,
                                                    max: 20,
                                                },
                                            ]}
                                            className="addPatientDetailsModal"
                                        >
                                            <Password
                                                style={{ height: "2.7rem" }}
                                                placeholder={"*********"}
                                                onChange={(e) => {
                                                    e.target.value === record.password
                                                        ? (e.target.style.color = "#474747")
                                                        : (e.target.style.color = "#1479FF");
                                                }}
                                                type="password"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            required={true}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            label="Last Name"
                                            name="lname"
                                            className="addPatientDetailsModal"
                                        >
                                            <Input
                                                onChange={(e) => {
                                                    e.target.value === record.lname
                                                        ? (e.target.style.color = "#474747")
                                                        : (e.target.style.color = "#1479FF");
                                                }}
                                                value={record.lname}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            required={false}
                                            label="Email"
                                            name="email"
                                            className="addPatientDetailsModal"
                                        >
                                            <Input
                                                type="email"
                                                disabled={true}
                                                onChange={(e) => {
                                                    e.target.value === record.email
                                                        ? (e.target.style.color = "#474747")
                                                        : (e.target.style.color = "#1479FF");
                                                }}
                                                value={record.email}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            required={true}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            label="Role"
                                            name="role"
                                            className="addPatientDetailsModal"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterOption={true}
                                                disabled={disableRole}
                                                value={record.role}
                                                style={selectStyle}
                                            >
                                                <SelectOption value="Doctor">Doctor</SelectOption>
                                                <SelectOption value="Nurse">Nurse</SelectOption>
                                                <SelectOption value="Admin">Admin</SelectOption>
                                                <SelectOption value="SuperAdmin">
                                                    SuperAdmin
                                                </SelectOption>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            required={true}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            label="Phone no."
                                            name="phone"
                                            className="addPatientDetailsModal"
                                        >
                                            <Input
                                                onChange={(e) => {
                                                    e.target.value === record.phone
                                                        ? (e.target.style.color = "#474747")
                                                        : (e.target.style.color = "#1479FF");
                                                }}
                                                value={record.phone}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
