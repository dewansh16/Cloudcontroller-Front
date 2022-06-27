import React, { useState, useEffect } from "react";
import { Col, Row, Form, message, notification } from "antd";
import "./addUser.css";
import tenantApi from "../../../Apis/tenantApis";
import userApi from "../../../Apis/userApis";
import Password from "antd/lib/input/Password";
import { Button } from "../../../Theme/Components/Button/button";
import { Input } from "../../../Theme/Components/Input/input";
import { Select, SelectOption } from "../../../Theme/Components/Select/select";

const Joi = require("joi");

export default function AddUser(props) {
    const [isUploading, setIsUploading] = useState(false);

    const [tenants, setTenants] = useState([]);

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

    const addUserSchema = Joy.object({
        title: Joy.string().required(),
        fname: Joy.string().required(),
        lname: Joy.string().required(),
        username: Joy.string().required(),
        password: Joy.string().required().min(4).max(40),
        role: Joy.string().required(),
        tenant_id: Joy.string().required(),
        phone: Joy.string().required(),
        email: Joy.string().required(),
    });

    function fetchTenantList() {
        tenantApi
            .getTenantList()
            .then((res) => {
                console.log(res.data?.response);

                const data = res.data?.response.tenants;
                setTenants(data);
                form.setFieldsValue({
                    tenant: props?.activeTenant
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        return fetchTenantList();
    }, [props?.visible]);

    const success = () => {
        message.success("New User been added");
    };

    // const error = (err) => {
    //     message.error(err);
    // };

    const warning = () => {
        const key = "warning";
        message.warning({ content: "User submission failed", key, duration: 1 });
    };

    const addFail = (err) => {
        const key = "warning";
        message.error({ content: "" + err, key, duration: 3 });
    };

    function validate(data, schema) {
        const { error } = schema.validate(data);
        return error;
    }

    const handleAddUser = (values) => {
        setIsUploading(true);

        let tenantUser = JSON.parse(localStorage.getItem("user"));
        try {
            let addUserError = validate(
                {
                    title: values.title,
                    fname: values.firstName,
                    lname: values.lastName,
                    username: values.username,
                    password: values.Password,
                    role: values.role,
                    tenant_id: values.tenant,
                    phone: values.phone,
                    email: values.email,
                },
                addUserSchema
            );

            if (addUserError !== undefined) {
                throw new Error(addUserError);
            }

            let data = {
                title: values.title,
                fname: values.firstName,
                lname: values.lastName,
                username: values.username,
                password: values.Password,
                role: values.role,
                tenant_id: values.tenant,
                phone: values.phone,
                email: values.email,
            };
            console.log(data);

            userApi
                .addUser(data)
                .then((res) => {
                    form.resetFields();
                    setIsUploading(false);
                    console.log(res);
                    success();
                    props.state();
                })
                .catch((err) => {
                    addFail(err);
                    setIsUploading(false);
                    console.log("" + err);
                });
        } catch (e) {
            console.error(e);
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

    return (
        <>
            <Row justify="center" align="middle" style={{ padding: "2em" }}>
                <Col span={24}>
                    <Row span={24}>
                        <Col className="addPatientDetailsMenu" span={24}>
                            <Row justify="space-around" align="bottom">
                                <div className="edit-header">
                                    <p>User Information</p>
                                </div>
                            </Row>
                        </Col>
                        <Col
                            style={{ padding: "2em", maxWidth: "65em" }}
                            span={24}
                            className="formScrollContainer"
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={handleAddUser}
                                onFinishFailed={userError}
                            >
                                <Row span={24} justify="space-around">
                                    <Col span={12} style={{ paddingRight: "2em" }}>
                                        <Row>
                                            <Col span={4}>
                                                <Form.Item
                                                    required={true}
                                                    label="Title"
                                                    name="title"
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    className="addPatientDetailsModal"
                                                >
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={true}
                                                    >
                                                        <SelectOption value="Mr.">Mr.</SelectOption>
                                                        <SelectOption value="Mrs.">Mrs.</SelectOption>
                                                        <SelectOption value="Mx.">Mx.</SelectOption>
                                                        <SelectOption value="Master">Master</SelectOption>
                                                        <SelectOption value="Miss">Miss</SelectOption>
                                                        <SelectOption value="Dr.">Dr.</SelectOption>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={19} offset={1}>
                                                <Form.Item
                                                    required={true}
                                                    label="First Name"
                                                    name="firstName"
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    className="addPatientDetailsModal"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            required={true}
                                            label="Email"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    type: "email",
                                                },
                                            ]}
                                            className="addPatientDetailsModal"
                                        >
                                            <Input type="email" />
                                        </Form.Item>

                                        <Form.Item
                                            required={true}
                                            label="Tenant"
                                            name="tenant"
                                            className="addPatientDetailsModal"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterOption={true}
                                                disabled={true}
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                {tenants?.map((tenant, i) => (
                                                    <SelectOption key={i} value={tenant.tenant_uuid}>
                                                        {tenant.tenant_name}
                                                    </SelectOption>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            required={true}
                                            label="Profile Name"
                                            name="username"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            className="addPatientDetailsModal"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            required={true}
                                            label="Last Name"
                                            name="lastName"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            className="addPatientDetailsModal"
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            required={true}
                                            label="Password"
                                            name="Password"
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
                                            <Password style={{ height: "2.7rem" }} />
                                        </Form.Item>

                                        <Form.Item
                                            required={true}
                                            label="Role"
                                            name="role"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            className="addPatientDetailsModal"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterOption={true}
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
                                            label="Phone no."
                                            name="phone"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            className="addPatientDetailsModal"
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Row style={{ marginTop: "54px" }}>
                                            <Col
                                                span={12}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Button
                                                    className="secondary"
                                                    type="text"
                                                    onClick={props.state}
                                                >
                                                    Cancel
                                                </Button>
                                            </Col>
                                            <Col
                                                span={12}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Form.Item style={{ margin: "0px" }}>
                                                    <Button loading={isUploading} htmlType="submit">
                                                        Create User
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
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
