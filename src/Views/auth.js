import React, { useState, useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import storage from '../Controllers/storage';
import { UserStore } from '../Stores/userStore'
import userApi from '../Apis/userApis';
import { withRouter } from 'react-router-dom'
import 'antd/dist/antd.css';
import './auth.css';

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
// import { Button as GlobalButton } from '../Theme/Components/Button/button'
import Icons from '../Utils/iconMap'


const Landing = (props) => {
    const showModal = props.showModal;
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [loading, setLoading] = useState(false);
    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    // trying to auto login
    useEffect(() => {
        const loggedInUser = storage.getItem("user");
        const logoutReason = storage.getItem("logout_reason");
        if (logoutReason) {
            notification.error({
                message: logoutReason,
                description:
                    'Please login again to continue',
                placement: 'topRight'
            });
            storage.removeItem("logout_reason");
        }
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            UserStore.setUser(foundUser.userEmail, foundUser.role, foundUser.tenant);
            props.location.state !== undefined ? props.history.push(props.location.state.from.pathname) :
                props.history.push(foundUser.role.toLowerCase() === "admin" ? '/dashboard/patchInventory' : '/dashboard/patient/list');
        }
        else props.history.push('/');
    }, [props.history]);

    const onFinish = (values) => {
        setLoading(true);
        const newData = {
            username: values?.username?.trim(),
            password: values?.password?.trim(),
        }
        userApi.login(newData)
            .then((res) => {
                    if (res.data.response !== undefined) {
                        localStorage.setItem("user", JSON.stringify(res.data.response));
                        UserStore.setUser(res.data.response.userEmail, res.data.response.role, res.data.response.tenant)
                        
                        if (res.data.response.role.toLowerCase() === "admin") {
                            props.history.push('/dashboard/patchInventory');
                        } else {
                            props.history.push('/dashboard/patient/list');
                        }
                    } else {
                        throw new Error('Unable to fetch user')
                    }
                    setLoading(false);
                }
            )
            .catch(err => {
                setLoading(false);
                const customMessage = ["INVALID_PASSWORD", "INVALID_EMAIL"]
                if (customMessage.includes(err.response?.data?.message || err.response?.data?.error?.errMessage)) {
                    notification.error({
                        message: "Invalid email or password"
                    })
                } else {
                    notification.error({
                        message: "Unable to fetch user at the moment. Please try again later"
                    })
                }
            })
        // Auth.login(values, props, setLoading);
    };


    return <Form className="loginForm" layout="vertical" form={form} onFinish={onFinish} style={{ marginTop: "2em", fontWeight: "500" }}>
        <Form.Item
            label="Email"
            name="username"
            type="email"
            rules={[
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                },
                {
                    required: true,
                    message: 'Please input your E-mail!',
                },
            ]}
        >
            <Input placeholder="Your Email" />
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            hasFeedback
            rules={[{
                required: true,
                message: "please input valid password!"
            },
            ]}
        >
            <Input.Password name="password"
                style={{ background: "white !important" }}
                placeholder="Your Password"
                type="password"
            />
        </Form.Item>
        <Row gutter={[24, 24]} span={24} justify="space-between">
            <Col span={12}>
                <Form.Item shouldUpdate>
                    {() => (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                !form.isFieldsTouched(true) ||
                                !!form.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                        >
                            {loading ? <LoadingOutlined style={{ fontSize: '1.5em' }} /> : 'Log in'}
                        </Button>
                    )}
                </Form.Item>
            </Col>
            <Col span={24} style={{}}>
                {/* <GlobalButton onClick={showModal} style={{ marginTop: "20px", padding: "1rem" }} type="secondary">Settings</GlobalButton> */}
                <p
                    onClick={showModal}
                    style={{
                        marginBottom: "20px",
                        cursor: "pointer",
                        color: "rgba(0,0,0,0.4)",
                        fontFamily: "Lexend",
                        fontStyle: "normal",
                        fontWeight: "600",
                        fontSize: "16px"
                    }}
                >
                    {Icons.settings({
                        Style: {
                            color: "rgba(0,0,0,0.4)",
                            fontStyle: "normal",
                            fontWeight: "600",
                            fontSize: "16px"
                        }
                    })} Domain Settings
                </p>
            </Col>
        </Row>
    </Form >


}

export default withRouter(Landing);



