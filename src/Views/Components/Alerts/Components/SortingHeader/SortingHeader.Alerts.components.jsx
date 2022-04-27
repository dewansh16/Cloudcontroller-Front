import React, { useState, useEffect } from 'react'
import { Radio, Select, Row, Col, Button, Spin, notification, Affix } from 'antd';

import { BellOutlined } from '@ant-design/icons';

import './SortingHeader.Alerts.Components.css'
import patientApi from '../../../../../Apis/patientApis';

import { Button as Buttons } from '../../../../../Theme/Components/Button/button';

import Icons from '../../../../../Utils/iconMap';


// const { Option } = Select;


function FetchDetails(pid) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        patientApi.getPatientData(pid).then((res) => {
            console.log("xxxx:", res)
            setResponse(res.data?.response?.patients[0])
            setLoading(false);
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
    }, [pid])
    return [response, loading]
}



const SortingHeader = (props) => {

    const [topBellBtn, setTopBellBtn] = useState(false);

    const [data, isLoading] = FetchDetails(props.pid)

    console.log(data);

    const topBellBtnStyle = {
        border: '1px solid #FB2D77',
        color: '#FB2D77',
        height: '50px',
    }

    const buttonStyle = {
        margin: '10px',
        width: '100px',
        height: '40px',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        opacity: '60%',
        fontsize: '16px',
        backgroundColor: '#EBF4FF',
        border: 'none',
    }



    return (
        <div >
            <Affix className='first-affix-box' >
                <div className="alert-dashboard-grid"
                    style={{
                        gridTemplateColumns: "4fr 6fr 0.5fr"
                    }}>
                    <div className="alert-select-location ">
                        <Buttons style={{
                            border: 'none',
                            boxShadow: 'none',
                            marginRight: '10%'
                        }} type='text' className='utility' onClick={props.goBack} >{Icons.headerBackArrow({})}</Buttons>
                        <Buttons style={{
                            margin: "5px",
                            padding: "0.2rem"
                        }} className='utility'
                            onClick={props.toPatientDetails}
                        >
                            <div style={{
                                height: "100%",
                                width: "100%",
                                padding: 'none',
                                border: 'none',
                                minHeight: "50px",
                                minWidth: "170px",
                                position: 'relative'
                            }} className='alert-info-box'>
                                {
                                    !isLoading && data !== null && data !== undefined &&
                                    <>
                                        <h1 style={{
                                            marginBottom: '0px', fontSize: '18px', fontWeight: '500',
                                            textAlign: 'left'
                                        }} >
                                            {`${data?.demographic_map.title === undefined ? '' : data?.demographic_map.title}` + " " + data?.demographic_map.fname + " " + data?.demographic_map.lname}
                                        </h1>
                                        <p style={{
                                            marginBottom: '0px', fontSize: '16px', fontWeight: '400', color: '#A5A5A5', textAlign: 'start'
                                        }} >MR: {data.demographic_map?.med_record}</p>
                                    </>
                                }
                                {
                                    isLoading && (data === undefined || data === null) && <Spin style={{ position: 'absolute', left: '40%', top: '30%' }} />
                                }
                            </div>
                        </Buttons>
                    </div>


                    <div className="alert-utility-group patient-details-header-second-column">
                        <div className='alert-type'>
                            <Radio.Group defaultValue="all" buttonStyle="solid"
                                onChange={(e) => {
                                    props.setUserType(e.target.value);
                                }}
                                style={{
                                    backgroundColor: '#EBF4FF', display: 'flex',
                                    borderRadius: '6px', justifyContent: 'center', width: '100%', margin: 'auto'
                                }}
                            >
                                <Radio.Button value="all" style={buttonStyle}>All</Radio.Button>
                                <Radio.Button value="userAlert" style={{ ...buttonStyle, padding: '0px' }} >User Alert</Radio.Button>
                                <Radio.Button value="systemAlert" style={{ ...buttonStyle, padding: '0px' }}>System Alert</Radio.Button>
                            </Radio.Group >
                        </div >
                        <div className='is-attended'>
                            <Radio.Group defaultValue="notAttended" buttonStyle="solid"
                                onChange={(e) => {
                                    props.setIsAttended(e.target.value);
                                }}
                                style={{ backgroundColor: '#EBF4FF', display: 'flex', borderRadius: '6px', justifyContent: 'center', width: '100%', margin: 'auto' }}
                            >
                                <Radio.Button value="all" style={buttonStyle}>All</Radio.Button>
                                <Radio.Button value="attended" style={buttonStyle}>Attended</Radio.Button>
                                <Radio.Button value="notAttended" style={{ ...buttonStyle, padding: '0px' }}>Not Attended</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>



                </div>
            </Affix>
        </div >
    )
}

export default SortingHeader



// {
//     <div className="alert-list-controllers">
//     <div className='top-button-box'>
//         <div className='bell-button-box'>
//             <Button type="text" style={topBellBtn ? topBellBtnStyle : { height: '50px', border: '1px solid #EDEDED' }} onClick={() => setTopBellBtn(!topBellBtn)}>
//                 <BellOutlined style={{ fontSize: '19px' }} />
//             </Button>
//         </div>
//         <div className='filter-button-box'>
//             <Select
//                 style={{ width: '112px', display: 'flex', height: '50px' }}
//                 placeholder="filter"
//             >
//             </Select>
//         </div>
//     </div>
//     </div>
// }