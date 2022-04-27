import React, { useState, useEffect } from 'react'


import { Collapse, Button, Divider } from 'antd';
import { CaretRightOutlined, CheckOutlined, TagOutlined, BellOutlined } from '@ant-design/icons';

import './PatientsAlertList.Components.AllAlerts.Components.css'
import PerPatientsAlertsList from '../PerPatientsAlertsList/PerPatientsAlertsList.Components.AllAlerts.Components';

import alertApi from '../../../../../Apis/alertApis';

// import AlarmBellIcon from "../../../../../Assets/Images/alert-bell.svg"

const { Panel } = Collapse;

function PatientsAlertList(props) {

    const [checkBtn, setCheckBtn] = useState(false);
    // const [tagBtn, setTagBtn] = useState(false);
    // const [bellBtn, setBellBtn] = useState(false);
    const [openCount, setOpenCount] = useState(props.openAlerts);


    const checkBtnStyle = {
        border: '1px solid #86D283',
        color: '#86D283',
        background: 'green'
    }

    // const tagBtnStyle = {
    //     border: '1px solid #FFD966',
    //     color: '#FFD966'
    // }

    // const bellBtnStyle = {
    //     border: '1px solid #FB2D77',
    //     color: '#FB2D77'
    // }

    const btnStyle = (status) => {
        if (checkBtn === true)
            return (checkBtnStyle);
        if (openCount === 0)
            return (checkBtnStyle);
        switch (status) {
            case 'close': return (checkBtnStyle);
            default: return null;
        }
    }

    const checkAll = () => {
        for (let item of props.data) {
            if (item.status === 'open') {
                const data = {
                    status: 'close',
                    text: "added a note",
                    timeout: 14400,
                }

                alertApi.editAcknowledged(item.id, data).then((res) => {
                    console.log(res.data.response);
                }).catch((err) => {
                    console.error(err);
                })
            }
        }
    }


    const genExtra = () => (
        <div onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        }}
            style={{ marginRight: '15px' }}
        >
            <Button type="text"
                disabled={checkBtn === true || openCount === 0 ? true : false}
                style={btnStyle()}
                onClick={() => {
                    setCheckBtn(!checkBtn);
                    setOpenCount(0);
                    checkAll();
                }}
            >
                <CheckOutlined />
            </Button>
            {
                //     <Button type="text" style={tagBtn ? tagBtnStyle : null} onClick={() => setTagBtn(!tagBtn)}>
                //     <TagOutlined />
                // </Button>
                // <Button type="text" style={bellBtn ? bellBtnStyle : null} onClick={() => setBellBtn(!bellBtn)}>
                //     <BellOutlined />
                // </Button>
            }
        </div>
    );


    const panelHeader = () => (
        < div style={{ display: 'inline-flex', width: '70%' }}>
            <div className='header-number-box'>
                <div className='header-number'><p style={{ margin: '0px' }}>{openCount}</p></div>
                <div ><Divider style={{ background: 'black', opacity: '20%', height: '10%' }}></Divider></div>
                <div className='header-total-number'><p style={{ margin: '0px' }}>{props.data.length}</p></div>
            </div>
            <div className='patient-panel-header' >
                <div className='patient-panel-header-heading'>{props.data[0].pName} <br /></div>
                <div className='patient-panel-header-time'>MR:{props.data[0].mr}</div>
            </div>
            <div>
                <Divider type="vertical" style={{ background: 'black', height: "90%", opacity: '10%', display: 'inline-block', margin: '4px 40px 8px 20px' }}></Divider>
            </div>
            <div className='patient-panel-header-info'>
                <div className='patient-panel-header-heading'>  <br /></div>
                <div className='patient-panel-header-time'></div>
            </div>

        </div >
    );
    //

    // console.log(props.data);

    return (
        <div className='all-patients-alert'>
            <Collapse
                bordered={false}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className="site-collapse-custom-collapse"
                expandIconPosition={'right'}
                forceRender={true}
                key={props.key}
            >
                <Panel header={panelHeader()} key={props.key} className="site-collapse-custom-panel" extra={genExtra()}
                    style={{
                        backgroundColor: 'white',
                        border: 'none',
                    }}
                >
                    <PerPatientsAlertsList parentCheckBtn={checkBtn} key={props.key} setOpenCount={setOpenCount} openCount={openCount} data={props.data} />

                </Panel>
            </Collapse>
        </div>
    )
}

export default PatientsAlertList
