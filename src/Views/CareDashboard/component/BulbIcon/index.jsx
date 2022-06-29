import React, { useState } from 'react';

import IconBulbOn from "../../../../Assets/Images/bulbOn.png"
import IconBulbOff from "../../../../Assets/Images/bulbOff.png";
import { Button, Input, Popover } from 'antd';

const BulbIcon = () => {
    const [isTurnOn, setIsTurnOn] = useState(false);
    const [arrayNote, setArrayNote] = useState([]);
    const [valueInput, setValInput] = useState("");

    return (
        <Popover
            title="Add Note"
            placement="right"
            content={
                <div>
                    {arrayNote?.map((note, index) => {
                        return (
                            <div key={index} style={{ marginBottom: "8px" }}>{note}</div>
                        )
                    })}
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