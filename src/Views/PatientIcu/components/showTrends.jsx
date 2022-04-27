import React from 'react';
import { Checkbox } from 'antd';


export default function ShowTrends({ checkboxOptions, defaultCheckedValues, onChange }) {
    return <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", minWidth: "30rem", maxWidth: "36rem", padding: "1rem" }}>
        <p style={{ margin: "0", fontWeight: "600", fontSize: "1.4em" }}>Show Trends: </p>
        <Checkbox.Group options={checkboxOptions} defaultValue={defaultCheckedValues} onChange={onChange} />
    </div>
}