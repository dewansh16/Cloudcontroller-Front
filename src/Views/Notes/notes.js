import React from "react";
import { Button, Col, Row, Input, Timeline, Form, message } from "antd";
import "./notes.css";
import Icons from '../../Utils/iconMap';
import { patientApi } from "../../Utils/apiMap";
import { request } from '../../Controllers/agent';

export default function Notes(props) {

    const patientNote = props.patient.patientDetails;
    console.log(props);

    const onBack = () => {
        props.setShowNotes(false);
    }

    const success = () => {
        message.success('Note for the Patient added');
    };

    const error = () => {
        message.error('Failed to Add Note');
    }
    const warning = () => {
        message.warning('Note submission failed');
    };
    const [form] = Form.useForm();

    const onsubmitData = (values) => {
        console.log(values);

        // current time to be sent
        // let noteTime = new Date().toLocaleString();

        let data = {
            "note_uuid": "0",
            "note": values.note,
            "prac_uuid": "SCORE",
            "date": "2021-03-01T00:00:00.000Z",
            "revision": "2021-03-01T00:00:00.000Z",
            "pid": "12345",
            "note_type": "NOTE_TYPE",
            "note_type_uuid": "UUID",
            "id": 1,
            "tenant_id": 4

        }



        console.log(data);
        request.post(`${patientApi.createPatient}/${patientNote.demographic_map.pid}/notes`, data,
            (res) => {
                console.log(res);
                success();
                form.resetFields();


            },
            (err) => {
                console.log(err);
                error();
            }

        )

    }
    const submitFail = () => {
        warning();
    }

    const Dot = (date, time) => {
        return <>
            <span>
                {date}
            </span>
            <br />
            <span>
                {time}
            </span>
        </>
    }

    return (
        <Row>
            <Col span={24}>
                <div className="note-main">
                    <Row justify="start" align="top">
                        <Col flex={3}>
                            <p className="notes-head">
                                Notes
                            </p>
                        </Col>
                        <Col flex={2}>
                            <Row flex={5} align="top">
                                <Col span={12}>
                                    <Input size="middle" placeholder="search" className="searchInput" prefix={Icons.searchIcon({})} />
                                </Col>
                                <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button className="notesBackButton" onClick={onBack}>
                                        Close
                                        {Icons.leftArrowFilled({})}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ padding: "3%" }}>
                            <Timeline>
                                <Timeline.Item dot={Dot('27/05/21', ' 10:00 AM')} >
                                    <Row justify="space-around">
                                        <Col className="saved-notes">
                                            <p>
                                                Nausea, Observations stable. 10 ml in drain. Bowels not open
                                            </p>
                                        </Col>
                                    </Row>
                                </Timeline.Item>
                                <Timeline.Item dot={Dot('27/05/21', ' 9:00 PM')} >
                                    <Row justify="space-around">
                                        <Col className="saved-notes">
                                            <p>
                                                Looks generally well. BP is stable and able to walk today.
                                            </p>
                                        </Col>
                                    </Row>
                                </Timeline.Item>
                                <Timeline.Item dot={Dot('28/05/21', ' 8:00 PM')} >
                                    <Row justify="space-around">
                                        <Col className="saved-notes">
                                            <p>
                                                Patient discharged
                                            </p>
                                        </Col>
                                    </Row>
                                </Timeline.Item>

                            </Timeline>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form form={form} onFinish={onsubmitData} onFinishFailed={submitFail}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item
                                            label=""
                                            name="note"
                                            rules={[{ required: true, message: 'Please add a note!' }]}
                                        >
                                            <Input placeholder="Your Message" className="msgbox-notes"></Input>

                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
                                        <Form.Item>
                                            <Button className="noteMsgButton" htmlType="submit">{Icons.msgIcon({})}</Button>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>

                        </Col>

                    </Row>
                </div>
            </Col>
        </Row>
    );
}