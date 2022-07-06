import React, { useState, useEffect } from 'react';

import IconBulbOn from "../../../../Assets/Images/bulbOn.png"
import IconBulbOff from "../../../../Assets/Images/bulbOff.png";
import { Button, Input, Popover } from 'antd';
import billingApi from '../../../../Apis/billingApis';
import {CPT_CODE} from '../../../../Utils/utils';
import {isObject, isArray} from 'lodash';

const BulbIcon = ({pid, billDate, onSaveNoteToDb}) => {
    const [isTurnOn, setIsTurnOn] = useState(false);
    const [arrayNote, setArrayNote] = useState([]);
    const [item99453, setItem99453] = useState(null);
    const [valueInput, setValInput] = useState("");

    const getArrNoteData = () => {
        billingApi.getBillingTasks(pid, billDate, '0').then((res) => {
            res.data.response.billingData.map(item => {
                if(item.code == CPT_CODE.CPT_99453){
                    try{
                        let params = JSON.parse(item.params);
                        if(!isArray(params)){
                            params = [];
                        }
                        setArrayNote(params);
                        setItem99453(item)
                    } catch(err){
                        console.log(err)
                    }
                }
            })
        }).catch((err) => {
            console.log(err);
        });
    } 

    useEffect(() => {
        getArrNoteData();
    }, [])
    return (
        <Popover
            title="Add Note"
            placement="right"
            trigger={["click"]}
            content={
                <div>
                    {arrayNote?.map((item, index) => {
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
                    })}
                    {isObject(item99453) && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                        <Input value={valueInput} onChange={(event) => setValInput(event?.target?.value)} />
                        <Button 
                            type='primary' 
                            style={{ fontSize: "12px", marginLeft: "0.5rem" }}
                            onClick={() => {
                                const dataUpdate = {
                                    note: valueInput,
                                    status: 0,
                                    billing_id: item99453.id,
                                    code: item99453.code,
                                    bill_date: item99453.bill_date,
                                    pid: pid
                                }
                                onSaveNoteToDb(dataUpdate);
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

export default BulbIcon;