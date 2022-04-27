import React from 'react';
import { Row, Col, Empty } from 'antd';

export default function NotesSection({ data }) {
    return <Row>
        <Col span={24} style={{
            border: "1px solid rgba(0,0,0,0.4)",
            padding: "1em 1em",
            borderRadius: "10px",
            marginTop: "2rem"
        }}>
            <div
                style={{
                    position: " relative",
                    top: "-28px",
                    left: " 12px",
                    fontSize: " 1rem",
                    margin: " 0 0 -1rem 0",
                    letterSpacing: " 1px",
                    background: "white",
                    width: "max-content",
                    padding: " 0 1rem",
                }}>
                <span>Recent Notes</span>
            </div>

            <p className="PatientDescription">
                {data.note.note === "" || data.note.note === null ?
                    <Empty description="No notes added." /> : data.note.note.replaceAll('<img>', '')}
            </p>

            <div style={{
                position: "relative",
                bottom: "-8px",
                display: "flex",
                fontSize: " 1rem",
                margin: "0px 0px -1rem",
                letterSpacing: " 1px",
                width: "100%",
                padding: "0px 1rem",
                justifyContent: "flex-end",
            }}>
                <span style={{ background: "white", padding: "0px 1rem" }}>Dr: Data fake</span>
            </div>

            {/* {data.note.users && <div
                style={{
                    position: "relative",
                    bottom: "-8px",
                    display: "flex",
                    fontSize: " 1rem",
                    margin: "0px 0px -1rem",
                    letterSpacing: " 1px",
                    width: "100%",
                    padding: "0px 1rem",
                    justifyContent: "flex-end",
                }}>
                <span style={{ background: "white" }}>{`Dr. ${data.note["users.fname"]} ${data.note["users.lname"][0]}`}</span>
            </div>} */}
        </Col>
    </Row>
}