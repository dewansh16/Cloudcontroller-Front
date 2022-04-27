import React from 'react'
import Form from 'antd/lib/form'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import notification from 'antd/lib/notification'

import { Button } from '../Theme/Components/Button/button'
import { Input } from '../Theme/Components/Input/input'

import { UserStore } from '../Stores/userStore'

export default function DomainSettings({ onCancel }) {

    const [domainForm] = Form.useForm()

    const onFinish = (values) => {
        console.log(values.apiUrl, values.websockerUrl)
        UserStore.setDomains(values.apiUrl, values.websockerUrl);
        notification.success({
            message: "Updated",
            description: "Domain settings updated",
        })
        onCancel()
    }

    const onFinishFailed = (values) => {
        notification.error({
            message: "Error",
            description: "All fields required",
        })
    }


    return (
        <div style={{ height: "100%", width: "100%", background: "#fff" }}>
            <Form
                form={domainForm}
                layout="vertical"
                className="myform"
                onFinish={onFinish}
                initialValues={{ remember: true }}
                OnFinishFailed={onFinishFailed}
            >
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <h1>Domain Settings</h1>
                    </Col>

                    <Col style={{}} span={24}>
                        <Form.Item
                            label="API Url"
                            name="apiUrl"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Input placeholder="eg. http://192.0.0.1:7XXX" />
                        </Form.Item>
                    </Col>
                    <Col style={{}} span={24}>
                        <Form.Item
                            label="Websocket Url"
                            name="websocketUrl"
                            rules={[{
                                required: true,
                                message: "required"
                            }]}
                        >
                            <Input placeholder="eg. ws://192.0.0.1:7XXX" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col style={{}} span={6}>
                        <Form.Item>
                            <Button onClick={onCancel} type="primary-outlined">Close</Button>
                        </Form.Item>
                    </Col>
                    <Col style={{}} span={6}>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">Save Settings</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
