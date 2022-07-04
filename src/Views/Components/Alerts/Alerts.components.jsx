import React, { useEffect, useState } from 'react'

import { notification, Spin, Button, Modal, Input, Form } from 'antd'

import alertApi from '../../../Apis/alertApis'


import SortingHeader from './Components/SortingHeader/SortingHeader.Alerts.components'
import AlertList from './Components/AlertList/AlertList.components.Alerts'
import { computeTotalPages } from "../../Components/PaginationBox/pagination";

import './Alerts.components.css'
import {
    SearchOutlined
} from '@ant-design/icons';


import Hotkeys from "react-hot-keys";
import { useParams } from 'react-router-dom'


function FetchAlertData(pid, isAttended, currentPageVal, setTotalPages) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        alertApi.getPatientAlerts(pid, currentPageVal).then((res) => {
            let alerts = res.data?.response || {};
            setResponse(alerts?.data || []);
            setTotalPages(
                computeTotalPages(alerts.count, 25)
            );
            setLoading(false)
        }).catch((err) => {
            if (err) {
                const error = err.response?.data.result;
                notification.error({
                    message: 'Error',
                    description: `${error}` || ""
                })
                setLoading(false);
            }
        })
    }, [pid, isAttended, currentPageVal])
    return [response, loading]
}

const HotkeysDemo = (props) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const onKeyDown = (keyName, e, handle) => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
    }

    const goToRoutes = (values) => {
        const text = values.nlp.toLowerCase();
        if (text === 'dashboard') {
            props.prop.history.push('/dashboard/patient/list')
        }
        if (text === 'details boydey') {
            props.prop.history.push('/dashboard/patient/details/patient156dbd7a-ba82-4503-bd58-21ccaffe6bc2')
        }
    }

    return (
        <Hotkeys
            keyName="shift+a,alt+s,command+p"
            onKeyUp={onKeyDown}
        >
            <Modal
                width={800}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <div>
                    <h1
                        style={{
                            textAlign: 'center',
                            fontFamily: 'Lexend',
                            fontSize: '35px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '44px',
                            letterSpacing: '0.3em',
                        }}
                    >NLP Search</h1>
                    <Form
                        onFinish={goToRoutes}
                    >
                        <Form.Item
                            name='nlp'
                        >
                            <Input
                                autoFocus
                                style={{
                                    height: '50px',
                                }}
                                prefix={<SearchOutlined
                                    style={{
                                        fontSize: '16px',
                                    }}
                                />}
                                placeholder="Vitals of Nathan" />
                        </Form.Item>
                        <Form.Item>
                            <div
                                style={{ textAlign: "center", margin: "20px" }}
                            >
                                <Button
                                    style={{
                                        height: "40px",
                                        width: "180px",
                                        background: "#E48F5A",
                                        borderRadius: "6px",
                                        fontFamily: "Lexend",
                                        fontSize: "24px",
                                        color: "white",
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        lineHeight: "31px"
                                    }
                                    }
                                    htmlType="submit"
                                >search</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </Hotkeys >
    );
}

const Alerts = (props) => {
    const { pid } = useParams();

    const [userType, setUserType] = useState('all');
    const [isAttended, setIsAttended] = useState('notAttended');
    const [currentPageVal, setCurrentPageVal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [data, isLoading] = FetchAlertData(pid, isAttended, currentPageVal, setTotalPages);
   
    const toPatientDetails = () => {
        props.history.push(`/dashboard/patient/details/${pid}`);
    }

    const goBack = () => {
        props.history.goBack();
    }

    return (
        <div style={{ width: '100%', margin: '0 auto', position: 'relative' }}>
            <div className='alerts-header'>
                <SortingHeader 
                    pid={pid} 
                    goBack={goBack} 
                    isLoading={isLoading} 
                    setUserType={setUserType} 
                    setIsAttended={setIsAttended}
                    toPatientDetails={toPatientDetails} 
                    totalPages={totalPages}
                    currentPageVal={currentPageVal}
                    setCurrentPageVal={setCurrentPageVal}
                />
            </div>

            <div style={{ position: 'relative', height: "calc(100vh - 88px)" }}>
                {!isLoading && (data === null || data === undefined || data.length === 0) &&
                    <div className='no-alerts-div'>
                        <h1 style={{ fontSize: "60px" }}>No Alerts</h1>
                    </div>
                }
                    
                {!isLoading && data !== null && data !== undefined && data.length !== 0 &&
                    data.map((item, index) => (
                        <div className='alerts-body' style={{ backgroundColor: 'white' }} key={index}>
                            <AlertList props={props} pid={pid} userType={userType} isAttended={isAttended} Alerts={item} />
                        </div>
                    ))
                }

                <HotkeysDemo prop={props} />

                {isLoading && <Spin size="large" style={{ position: 'relative', left: '50%', top: '50%' }} />}
            </div>
        </div>
    )
}

export default Alerts