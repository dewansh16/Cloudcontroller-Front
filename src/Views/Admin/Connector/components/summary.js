import React from 'react';
import { Result, Row, Col } from 'antd';

export default function Summary(props) {
    return <Row justify="center" align="middle" style={{ padding: "2em" }} >
        <div className="addPatient">
            <Col span={24}>
                <Row span={24} justify="center">
                    <Result
                        status="success"
                        title="Submission success"
                    // subTitle="Please check and modify the following information before resubmitting."
                    ></Result>
                </Row>
            </Col>
        </div>
    </Row>
}