import React, { useState } from 'react'
import { Radio, Select, Row, Col, Affix } from 'antd';
import { Button } from '../../../../../Theme/Components/Button/button';

import { BellOutlined } from '@ant-design/icons';

import './AllAlertsHeader.Components.AllAlerts.Components.css'


import Icons from '../../../../../Utils/iconMap';


const AllAlertsHeader = (props) => {

    const [topBellBtn, setTopBellBtn] = useState(false);

    const topBellBtnStyle = {
        color: '#FB2D77',
        height: '50px',
        border: '1px solid #FB2D77'
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
                <div className="alert-dashboard-grid" style={{ gridTemplateColumns: "1fr 5fr 2fr" }}>
                    <div className="alert-select-location " style={{ marginLeft: "32px" }}>
                        <Button className='back-buttons' onClick={props.goBack} >{Icons.headerBackArrow({})}</Button>
                    </div>


                    <div className="alert-utility-group patient-details-header-second-column">
                        <div className='alert-type'>
                            <Radio.Group defaultValue="all" buttonStyle="solid"
                                onChange={(e) => {
                                    props.setUserType(e.target.value);
                                }}
                                style={{ backgroundColor: '#EBF4FF', display: 'flex', borderRadius: '6px', justifyContent: 'center', width: '100%', margin: 'auto' }}
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


                    <div className="alert-list-controllers">
                        {
                            // <div className='top-button-box'>
                            // <div className='bell-button-box'>
                            //     <Button type="text" style={topBellBtn ? topBellBtnStyle : { height: '50px', border: '1px solid #EDEDED' }} onClick={() => setTopBellBtn(!topBellBtn)}>
                            //         <BellOutlined style={{ fontSize: '19px' }} />
                            //     </Button>
                            // </div>
                            // <div className='filter-button-box'>
                            //     <Select
                            //         style={{ width: '112px', display: 'flex', height: '50px' }}
                            //         placeholder="filter"
                            //     >
                            //     </Select>
                            // </div>
                            // </div>
                        }
                    </div>

                </div>
            </Affix>

        </div >
    )
}

export default AllAlertsHeader