import React from 'react';
import { Result, Row, Col, Spin } from 'antd';
import './summary.css'
const Summary = ({ status, title, children }) => {
    return <Col span={24}>
        <Row span={24} justify="center">
            <Result
                status={status}
                title={title}
                className="add-patient-summary"
            // subTitle="Please check and modify the following information before resubmitting."
            >
                <div style={{
                    background: "white",
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem"
                }}>
                    {children}
                </div>
            </Result>
        </Row>
    </Col>

}

export default Summary;