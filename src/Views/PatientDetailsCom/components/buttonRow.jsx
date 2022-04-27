import React, { useState } from 'react';
import { Row, Col, Badge, notification } from 'antd';
import { Button } from '../../../Theme/Components/Button/button';
import patientApi from '../../../Apis/patientApis';
import Icons from '../../../Utils/iconMap';


export default function ButtonRow({
    deviceType,
    otp,
    otpVisibility,
    viewOtp,
    getOtp,
    alertData,
    pushToPatientDetails,
    openAlerts,
    showNotes,
    openReport }) {

    return <Row justify="space-around">
        <Col>
            <Button onClick={pushToPatientDetails}>Full Details</Button>
        </Col>
        {deviceType === "gateway" &&
            <Col style={{ display: "flex", justifyContent: "center" }}>
                {otp ?
                    (otpVisibility ?
                        <div className='device-info'>
                            <p>
                                <span>OTP: </span>
                                {otp}
                            </p>
                        </div> : <Button type="secondary" onClick={viewOtp}>Get OTP</Button>
                    )
                    :
                    <Button style={{ minWidth: "90px" }} type="secondary" onClick={getOtp}>
                        Get OTP
                    </Button>
                }
                {/* <Button type="secondary" onClick={console.log("otp")}>Get Otp</Button> */}
            </Col>
        }
        <Col>
            <Badge overflowCount={10} count={alertData.isLoadingAlerts ? <Icons.ClockOutlined /> : alertData.alertCount} >
                <Button onClick={openAlerts} type="secondary">Alerts</Button>
            </Badge>
        </Col>
        <Col >
            <Button onClick={showNotes} type="secondary">Notes</Button>
        </Col>
        <Col >
            <Button onClick={openReport} type="secondary">Report</Button>
        </Col>
        {/* <Col >
        <Button onClick={openReport} type="secondary">Upload</Button>
    </Col> */}
    </Row>
}