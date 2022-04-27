import React, { useState } from 'react'

import './guidePage.css'

import { Button as CustmBtn } from '../../Theme/Components/Button/button';
import { Menu, Collapse } from 'antd';
import { LeftOutlined, CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

function GuidePage() {

    const ecgMenu = (
        <Menu>
            <Menu.Item key="1">How to wear a ECG patch</Menu.Item>
            <Menu.Item key="2">Precautions</Menu.Item>
        </Menu>
    );
    const spo2Menu = (
        <Menu>
            <Menu.Item key="1">How to wear a ECG patch</Menu.Item>
            <Menu.Item key="2">Precautions</Menu.Item>
        </Menu>
    );
    const tempMenu = (
        <Menu>
            <Menu.Item key="1">How to wear a ECG patch</Menu.Item>
            <Menu.Item key="2">Precautions</Menu.Item>
        </Menu>
    );


    const [ecgState, setEcgState] = useState(true)
    const [spo2State, setSpo2State] = useState(false)
    const [tempState, setTempState] = useState(false)


    return (
        <div className="gp-container" >
            <div className="gp-navbar" >
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "15%",
                }} >
                    {/* <LeftOutlined /> */}
                    <div className="gp-title" >
                        User Guide
                    </div>
                </div>
                <a href="https://live247.ai/live247/live247/index.html" target="_blank" >
                    <CustmBtn>Detailed User Guide</CustmBtn>
                </a>
            </div>
            <div className="gp-lower-container" >
                {
                    ecgState
                        ?
                        (
                            <div className="gp-lower-left-container" >
                                <div className="gp-video-header" >
                                    How to wear ECG Patch?
                                </div>
                                <video style={{
                                    borderRadius: "10px",
                                    boxShadow: "0px 5px 4px rgba(0, 0, 0, 0.25)",
                                }} id="videoPlayer" width="95%" controls muted="muted" >
                                    <source src="/video/guide/helpvideo?type=ecg" type="video/mp4" />
                                </video>
                            </div>
                        )
                        :
                        null
                }
                {
                    spo2State
                        ?
                        (
                            <div className="gp-lower-left-container" >
                                <div className="gp-video-header" >
                                    How to wear SpO2 Patch?
                                </div>
                                <video style={{
                                    borderRadius: "10px",
                                    boxShadow: "0px 5px 4px rgba(0, 0, 0, 0.25)",
                                }} id="videoPlayer" width="95%" controls muted="muted" >
                                    <source src="/video/guide/helpvideo?type=spo2" type="video/mp4" />
                                </video>
                            </div>
                        )
                        :
                        null
                }
                {
                    tempState
                        ?
                        (
                            <div className="gp-lower-left-container" >
                                <div className="gp-video-header" >
                                    How to wear Temp Patch?
                                </div>
                                <video style={{
                                    borderRadius: "10px",
                                    boxShadow: "0px 5px 4px rgba(0, 0, 0, 0.25)",
                                }} id="videoPlayer" width="95%" controls muted="muted" >
                                    <source src="/video/guide/helpvideo?type=temp" type="video/mp4" />
                                </video>
                            </div>
                        )
                        :
                        null
                }
                <div className="gp-lower-right-container" >
                    <div className="gp-action-container" >
                        <div className="gp-action-header" >
                            Video Guides
                        </div>
                        <Collapse
                            bordered={false}
                            defaultActiveKey={['1']}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            className="site-collapse-custom-collapse"
                            expandIconPosition="right"
                        >
                            <Panel header={
                                <span className="gp-drop-btns" > ECG Guide</span>
                            } key="1" className="site-collapse-custom-panel">
                                <div onClick={() => {
                                    setEcgState(true)
                                    setSpo2State(false)
                                    setTempState(false)
                                }} className={ecgState ? "gp-drop-options gp-active-option" : "gp-drop-options"} >
                                    How to wear a ECG Patch?
                                </div>
                            </Panel>
                            <Panel header={
                                <span className="gp-drop-btns" > SpO2 Guide </span>
                            } key="2" className="site-collapse-custom-panel">
                                <div onClick={() => {
                                    setEcgState(false)
                                    setSpo2State(true)
                                    setTempState(false)
                                }} className={spo2State ? "gp-drop-options gp-active-option" : "gp-drop-options"} >
                                    How to wear a SpO2 Patch?
                                </div>
                            </Panel>
                            <Panel header={
                                <span className="gp-drop-btns" > Temp Guide </span>
                            } key="3" className="site-collapse-custom-panel">
                                <div onClick={() => {
                                    setEcgState(false)
                                    setSpo2State(false)
                                    setTempState(true)
                                }} className={tempState ? "gp-drop-options gp-active-option" : "gp-drop-options"} >
                                    How to wear a Temp Patch?
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuidePage
