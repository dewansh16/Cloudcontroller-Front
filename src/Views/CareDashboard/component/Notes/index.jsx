import React, { useState, useEffect } from 'react';

import IconBulbOn from "../../../../Assets/Images/bulbOn.png"
import IconBulbOff from "../../../../Assets/Images/bulbOff.png";
import billingApi from '../../../../Apis/billingApis';
import {CPT_CODE} from '../../../../Utils/utils';
import {isObject, isArray} from 'lodash';
import { Button, Checkbox, Input, notification, Popover, Spin } from 'antd';

import "./styles.css";
import moment from 'moment';

const Notes = ({ pid, billDate }) => {
    const [isTurnOn, setIsTurnOn] = useState(false);
    const [arrayNote, setArrayNote] = useState([]);
    const [item99453, setItem99453] = useState(null);
    const [valueInput, setValInput] = useState("");
    const [loading, setLoading] = useState(false);

    const getArrNoteData = () => {
        billingApi.getBillingTasks(pid, billDate, '0')
            .then((res) => {
                res.data.response.billingData.map(item => {
                    if(item.code == CPT_CODE.CPT_99453){
                        try{
                            let params = JSON.parse(item.params);
                            if(!isArray(params)){
                                params = [];
                            }
                            const isOn = params?.some(item => item?.status === 0);
                            setIsTurnOn(isOn);
                            setArrayNote(params);
                            setItem99453(item)
                        } catch(err){
                            console.log(err)
                        }
                    }
                })
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
    } 

    const onSaveNoteToDb = (updateData, type = "") => {
        setLoading(true);
        billingApi.updateBillingTask(updateData)
            .then((res) => {
                getArrNoteData();
                notification.success({
                    message: `${type} note successfully!`,
                })
            }).catch(e =>{
                console.log(e)
                notification.error({
                    message: `${type} note failed!`,
                })
                setLoading(false);
            })
    }

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            setLoading(true);
            getArrNoteData();
        }
        return () => { mounted = false; }
    }, [pid]);

    return (
        <Popover
            title="Notes"
            placement="right"
            trigger={["click"]}
            content={
                <div className='popover-notes'>
                    <div style={{ position: "relative" }}>
                        {loading && (
                            <div className="spin-loading-notes">
                                <Spin />
                            </div>
                        )}
                        {arrayNote?.length > 0 && (
                            <div style={ loading ? { filter: "blur(3px)" } : {} }>
                                <div className='row-notes header-note'>
                                    <div className='col-date title'>Date</div>
                                    <div className='col-note title'>Note</div>
                                    <div className='col-status'></div>
                                </div>
                                <div className="note-list">
                                    {arrayNote?.map((note, index) => {
                                        return (
                                            <div key={index} className='row-notes body-notes'>
                                                <div className='col-date'>{moment(note?.task_id).format("MMM DD YYYY hh:mm:ss a")}</div>
                                                <div className='col-note'>{note?.note}</div>
                                                <div className='col-status'>
                                                    <Checkbox 
                                                        defaultChecked={note?.status === 1 ? true : false} 
                                                        onChange={() => {
                                                            const dataUpdate = {
                                                                note: note?.note,
                                                                status: note?.status === 0 ? 1 : 0,
                                                                billing_id: item99453.id,
                                                                code: item99453.code,
                                                                bill_date: item99453.bill_date,
                                                                pid: pid,
                                                                task_id: note?.task_id
                                                            }
                                                            onSaveNoteToDb(dataUpdate, "Update");
                                                        }}
                                                    />    
                                                </div>
                                            </div>
                                            // <div key={index} style={{ marginBottom: "8px" }}>{note}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* {arrayNote?.map((item, index) => {
                        return (
                            <div key={index} style={{ marginBottom: "8px" }}>
                                <p>{item?.note}</p>
                                <div>
                                    {item?.status == 1 && (
                                        <p>Done</p>
                                    )}
                                    {item?.status == 0 && (
                                        <Button 
                                            type='primary' 
                                            style={{ fontSize: "12px", marginLeft: "0.5rem" }}
                                            onClick={() => {
                                                const dataUpdate = {
                                                    note: item.note,
                                                    status: 1,
                                                    billing_id: item99453.id,
                                                    code: item99453.code,
                                                    bill_date: item99453.bill_date,
                                                    pid: pid,
                                                    task_id: item.task_id
                                                }
                                                onSaveNoteToDb(dataUpdate);
                                            }}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })} */}
                    {isObject(item99453) && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Input 
                                value={valueInput} 
                                onChange={(event) => setValInput(event?.target?.value)} 
                            />
                            <Button 
                                type='primary' 
                                style={{ fontSize: "12px", marginLeft: "0.5rem" }}
                                onClick={() => {
                                    const dataAdd = {
                                        note: valueInput,
                                        status: 0,
                                        billing_id: item99453.id,
                                        code: item99453.code,
                                        bill_date: item99453.bill_date,
                                        pid: pid
                                    }
                                    onSaveNoteToDb(dataAdd, "Add");
                                    setValInput("");
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    )}
                    
                </div>
            }
        >
            <img 
                src={isTurnOn ? IconBulbOn : IconBulbOff} 
                style={{ width: "24px", cursor: "pointer" }} 
            />
        </Popover>
    );
}

export default Notes;