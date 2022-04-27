import React from "react";
import "./addTenant.css";
// import { Form, message } from "antd";
// import { CheckOutlined } from '@ant-design/icons';
// import TenantPic from "../../../Assets/Images/Tenant.svg";
// import { patientApi } from "../../../Utils/apiMap";
// import { request } from '../../../Controllers/agent';

import Tenants from "../../Components/Tenants/Tenants.Components.jsx";

export default function TenantAdd(props) {

    // const success = () => {
    //     message.success('New Tenant successfully added');
    // };

    // const error = () => {
    //     message.error('Failed to Add New Tenant');
    // }
    // const warning = () => {
    //     message.warning('Tenant submission failed');
    // };
    // const [form] = Form.useForm();

    // const onsubmitData = (values) => {
    //     console.log(values);
    //     let data = {
    //         "tenant_name": values.name,


    //     }

    //     console.log(data);
    //     request.post(`${patientApi.addTenant}`, data,
    //         (res) => {
    //             console.log(res);
    //             success();
    //             form.resetFields();
    //             props.state();

    //         },
    //         (err) => {
    //             console.log(err);
    //             error();
    //         }

    //     )

    // }
    // const submitFail = () => {
    //     warning();
    // }



    return (
        //     <div className="TenantAdd-main">
        //     <Row>
        //         <Col span={8} className="TenantAdd-leftCol">
        //             <Row>
        //                 <Col span={24} className="TenantAdd-headCol">
        //                     <p className="TenantAdd-head">
        //                         Add Tenant
        //                     </p>
        //                 </Col>
        //             </Row>
        //             <Row>
        //                 <Col span={24} className="TenantAdd-formCol">
        //                     <Form form={form} name="tenantForm" layout={"vertical"} onFinish={onsubmitData} onFinishFailed={submitFail}>
        //                         <Form.Item name="name" label="Name" required={false} rules={[{ required: true, message: "Please provide the Tenant name" }]} >
        //                             <Input id="tenantInputname" />
        //                         </Form.Item>
        //                         <Form.Item name="address" label="Address" required={false} rules={[{ required: true, message: "Please provide the Tenant address" }]}>
        //                             <Input.TextArea id="tenantInputAddress" placeholder="Type here..." />
        //                         </Form.Item>
        //                         <Row>
        //                             <Col span={8}>
        //                                 <Form.Item label="Active"></Form.Item>
        //                             </Col>
        //                             <Col span={8}><Switch
        //                                 checkedChildren={<CheckOutlined />}
        //                                 defaultChecked
        //                             /></Col>
        //                             <Form.Item label="Inactive"></Form.Item>
        //                             <Col span={8}></Col>

        //                         </Row>

        //                         <Form.Item >
        //                             <Row>
        //                                 <Col span={24} className="tenantbuttonCol">
        //                                     <Button className="tenantcancel" htmlType="button" onClick={props.state}>
        //                                         Cancel
        //                                     </Button>
        //                                     <Button className="tenantsave" htmlType="submit" >
        //                                         Save
        //                                      </Button>
        //                                 </Col>
        //                             </Row>



        //                         </Form.Item>
        //                     </Form>
        //                 </Col>
        //             </Row>

        //         </Col>
        //         <Col span={16} className="TenantAdd-picCol">
        //             <img src={TenantPic} alt=""></img>
        //         </Col>
        //     </Row>

        // </div>

        <Tenants setTenantModal={props.setTenantModal} />
    );
}