import React from 'react';
import { Row, Col } from 'antd';
export default function AlertMessage({ critical, listThemeColor, alertMessage, eventTime }) {
    return <>
        {critical && <Row>
            <Col>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <span style={{ color: `${listThemeColor}`, fontWeight: "bold" }}>  {alertMessage} </span>
                    <span style={{ color: `${listThemeColor}`, fontWeight: "regular", marginTop: "-0.3em", opacity: "0.6" }}> Started at {eventTime} </span>
                </div>
            </Col>
        </Row>}
        {!critical && <Row>
            <Col>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <span style={{ color: `${listThemeColor}`, fontWeight: "bold" }}>Patient is Stable </span>
                </div>
            </Col>
        </Row>}
    </>
}