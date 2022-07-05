import React, { useState } from 'react';

import IconBulbOn from "../../../../Assets/Images/bulbOn.png"
import IconBulbOff from "../../../../Assets/Images/bulbOff.png";
import { Button, Checkbox, Input, Popover } from 'antd';

import "./styles.css";
import moment from 'moment';

const BulbIcon = () => {
    const [isTurnOn, setIsTurnOn] = useState(false);
    const [arrayNote, setArrayNote] = useState([{
        id: new Date().getTime(),
        note: "note",
        status: 1
    }]);
    const [valueInput, setValInput] = useState("");

    return (
        <Popover
            title="Add Note"
            placement="right"
            trigger={["click"]}
            content={
                <div className='popover-notes'>
                    <div className='row-notes header-note'>
                        <div className='col-date'>Date</div>
                        <div className='col-note'>Note</div>
                        <div className='col-status'></div>
                    </div>
                    <div>
                        {arrayNote?.map((note, index) => {
                            return (
                                <div className='row-notes body-notes'>
                                    <div className='col-date'>{moment(note?.id).format("MMM DD YYYY")}</div>
                                    <div className='col-note'>{note?.note}</div>
                                    <div className='col-status'>
                                        <Checkbox checked={note?.status === 1 ? true : false} />    
                                    </div>
                                </div>
                                // <div key={index} style={{ marginBottom: "8px" }}>{note}</div>
                            )
                        })}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Input value={valueInput} onChange={(event) => setValInput(event?.target?.value)} />
                        <Button 
                            type='primary' 
                            style={{ fontSize: "12px", marginLeft: "0.5rem" }}
                            onClick={() => {
                                const newArr = [...arrayNote, valueInput];
                                setArrayNote([...newArr]);
                                setValInput("");
                            }}
                        >
                            Add
                        </Button>
                    </div>
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