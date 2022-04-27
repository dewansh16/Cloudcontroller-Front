import React, { useState } from 'react'
import './cardBody.Tenants.components.css'

import Tab3 from '../tab3/tab3.components.tenants';

import { Button, Input, Tabs, notification } from 'antd';

import tenantApi from '../../../../../Apis/tenantApis';

const { TextArea } = Input;

const { TabPane } = Tabs;




const CardBody = (props) => {



    const [newTenant, changeNewTenant] = useState('true');
    const [tabNo, changeTabNo] = useState(1);
    const [tenantMapData, setTenantMapData] = useState({});
    const [tenantName, setTenantName] = useState({
        tenant_name: null,
    })
    const [tenantUUID, setTenantUUID] = useState(null);



    const goBack = () => { props.setTenantModal(false) }

    function getTenantId(data) {
        tenantApi.getTenantId(data).then((res) => {
            // console.log(res.data.response.tenants[0].tenant_uuid);
            setTenantUUID(res.data.response.tenants[0].tenant_uuid)
        }).catch((err) => {
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response.data.result}` || ""
                })
            }
        })

    }

    console.log(tenantUUID)

    function setTenantId() {
        getTenantId(tenantName)
    }


    function toAdditonalDetails() {
        changeNewTenant((prevState) => !prevState)
    }

    const changeTabTo2 = () => changeTabNo(2);


    return (

        <>
            <div className='card'>
                {newTenant ?
                    <div style={{
                        textAlign: 'right', marginBottom: '23px', opacity: '50%'
                    }}>
                        <Button type="primary" onClick={goBack} style=
                            {{
                                border: 'none',
                                borderTopLeftRadius: '0',
                                borderTopRightRadius: '0',
                                borderBottomLeftRadius: '6px',
                                borderBottomRightRadius: '0px',
                                background: '#FFFFFF',
                                height: '69px',
                                width: '79px',
                                opacity: '50%'
                            }}><i class="fas fa-times" style={{ fontSize: '30px', color: 'rgba(0, 0, 0, 0.5)' }}></i></Button>
                    </div>
                    :
                    <div style={{
                        textAlign: 'left', marginBottom: '23px', opacity: '50%'
                    }}>
                        <Button type="primary" onClick={toAdditonalDetails} style=
                            {{
                                border: 'none',
                                borderTopLeftRadius: '0',
                                borderTopRightRadius: '0',
                                borderBottomLeftRadius: '0px',
                                borderBottomRightRadius: '6px',
                                background: '#FFFFFF',
                                height: '69px',
                                width: '79px',
                                opacity: '50%'
                            }}><i class="fas fa-arrow-left" style={{ fontSize: '30px', color: 'rgba(0, 0, 0, 0.5)' }}></i></Button>
                    </div>
                }
                <div className='card-header'><p>{newTenant ? "Create Tenant" : "Additional Setup"}</p></div>
                <div className='card-body-box'>
                    {
                        newTenant ?
                            <>
                                <div style={{ width: '460px' }}>
                                    <div style={{ width: '70%', margin: 'auto' }}>
                                        <p>Name of the Tenant *</p>
                                        <Input placeholder="Pune"
                                            style={{ height: '54px', borderRadius: '6px', marginBottom: '37px' }}
                                            value={tenantName.tenant_name}
                                            onChange={(e) => {
                                                setTenantName({
                                                    tenant_name: e.target.value,
                                                })
                                            }} />
                                        {/* <div className='additional-setup-box'>
                                            <div className='aditional-setup-box-text'>
                                                <p>Additional Setup such as<br /><b>Address, Floors, Wards, Beds...</b> <br />(optional) </p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Button type="text"
                                                    disabled={tenantName.tenant_name === null || tenantName.tenant_name.length < 1 ? true : false}
                                                    onClick={() => { toAdditonalDetails(); setTenantId() }}
                                                    style={{
                                                        padding: '0',
                                                        color: '#018EF5',
                                                        fontSize: '21px'
                                                    }}> <i class="fas fa-arrow-right"></i></Button>
                                            </div>
                                        </div> */}
                                        <div style={{ marginBottom: '60px', textAlign: 'left' }}>
                                            <Button type="primary"
                                                disabled={tenantName.tenant_name === null || tenantName.tenant_name.length < 1 ? true : false}
                                                onClick={() => { toAdditonalDetails(); setTenantId() }}
                                                style={{
                                                    fontSize: '18px',
                                                    fontStyle: 'normal',
                                                    fontWeight: '600',
                                                    lineHeight: '23px',
                                                    letterSpacing: '0em',
                                                    height: '55px',
                                                    width: '226px',
                                                    borderRadius: '6px',
                                                    margiin: 'auto',
                                                }}
                                            >Save</Button>
                                        </div>
                                    </div>
                                </div>
                            </> //
                            :
                            <>
                                <Tabs defaultActiveKey={`1`} activeKey={`${tabNo}`} onTabClick={(activeKey) => {
                                    changeTabNo(activeKey);
                                }} centered='true' tabBarStyle={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    lineHeight: '23px',
                                    letterSpacing: '0em',
                                    borderBottom: 'none',
                                }}>
                                    <TabPane tab="Address" key="1" >
                                        <div className='tab-one-content'>
                                            <div style={{ width: '70%', margin: 'auto' }}>

                                                <div style={{ marginTop: '20px', marginBottom: '107px', border: 'none' }}>
                                                    <TextArea
                                                        placeholder="Type Here"
                                                        autoSize={{ minRows: 5 }}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                                                    <Button type="primary" onClick={changeTabTo2} style={{
                                                        fontSize: '18px',
                                                        fontStyle: 'normal',
                                                        fontWeight: '600',
                                                        lineHeight: '23px',
                                                        letterSpacing: '0em',
                                                        height: '55px',
                                                        width: '226px',
                                                        borderRadius: '6px',
                                                        margiin: 'auto',
                                                    }}>Save & Next</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Map" key="2" >
                                        <Tab3 goBack={goBack} tenantMapData={tenantMapData} setTenantMapData={setTenantMapData} />
                                    </TabPane>
                                </Tabs>
                            </>
                    }

                </div>
            </div ></>
    )
}

export default CardBody;
