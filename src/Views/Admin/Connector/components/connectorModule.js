import React, { useState } from 'react';
import Icons from '../../../../Utils/iconMap';
import { Col, Row, List, Button, Form } from 'antd';
import ConnectorForm from './connectorForm';

export default function ConnectorModule(props) {
    const customMenuSelected = "customMenuSelected";
    const customMenuErrorSelected = "customMenuErrorSelected";
    const customMenu = "customMenu";
    const customMenuError = "customMenuError";
    const required = true;
    const [form] = Form.useForm();
    const [menuState, setMenuState] = useState(1);
    // const patient = new PatientStore({ Demographics: "", Patch: "", Ews: "", Location: "" })
    const [formData, setFormData] = React.useState({});
    const layout = {
        labelCol: { sm: 24, md: 30 },
        wrapperCol: { sm: 24, md: 24 },
    };
    const [patientClass, setClass] = useState({
        isloading: false,
        list: [
            {
                class: "Connectors",
                id: 1,
                error: false,
                added: false,
                Component: ConnectorForm
            },
            {
                class: "AllScript",
                id: 2,
                error: false,
                added: false,
                Component: ConnectorForm
            },
            {
                class: "Cerner",
                id: 3,
                error: false,
                added: false,
                Component: ConnectorForm
            },
            {
                class: "Epic",
                id: 4,
                error: false,
                added: false,
                Component: ConnectorForm
            },
            {
                class: "InstaHms",
                id: 5,
                error: false,
                added: false,
                Component: ConnectorForm
            },

        ]
    })

    const saveDetails = () => {
        form.submit();

    }
    return (
        <>
            <Row justify="center" align="middle" style={{ padding: "2em" }} >
                <div className="addPatient">
                    <Col span={24}>
                        <Row span={24}>
                            <Col span={24}>{props.id ? `patient ID = ${props.id}` : null}</Col>
                            <Col className="addPatientDetailsMenu" xs={24} lg={8}>
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={patientClass.list}
                                    //TODO:add a footer
                                    // footer={
                                    //     // <div style={{ marginTop: "5em" }}>
                                    //     //     <b>ant design</b> footer part
                                    //     // </div>
                                    // }
                                    renderItem={item => (
                                        <div key={item.id.toString()}
                                            onClick={() => setMenuState(item.id)}
                                            className={`menuItem ${item.error ? (menuState === item.id ? customMenuErrorSelected : customMenuError) : (menuState === item.id ? customMenuSelected : customMenu)}`}>
                                            <Row justify="space-around" align="bottom">
                                                <Col span={18} className="addPatientDetailsMenuItem" >
                                                    <span>{item.class}</span>
                                                </Col>
                                                <Col span={6} className="addPatientDetailsMenuItem">
                                                    {item.error ? Icons.exclamationCircleOutlined({}) : ""}
                                                    {item.added ? Icons.CheckCircleFilled({}) : ""}
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                />
                            </Col>
                            <Col style={{ padding: "2em", maxWidth: "65em" }}
                                sm={24}
                                lg={16}
                                className="formScrollContainer"
                            >
                                {patientClass.list.map(Item =>
                                    menuState === Item.id && <Item.Component
                                        layout={layout}
                                        required={required}
                                        menuState={menuState}
                                        setMenuState={setMenuState}
                                        patientClass={patientClass}
                                        setClass={setClass}
                                        formData={formData}
                                        setFormData={setFormData}
                                        setError={props.setError}
                                        setCurrent={props.setCurrent}
                                        form={form}
                                        setPid={props.setPid}
                                        pid={props.pid}
                                    />
                                )}
                            </Col>
                            <Col span={24} order={2}>
                                <Row justify="end" span={12}>
                                    <Col span={8} style={{ padding: "2em 2em 0 0", display: "inline-flex", justifyContent: "space-around" }}>
                                        <Button type="primary" onClick={saveDetails}>Test Connect</Button>
                                        <Button type="primary" onClick={saveDetails}>Save</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </div>
            </Row>
        </>)
}