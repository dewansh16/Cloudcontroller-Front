import React from 'react';
import { Row } from 'antd';
import Icons from '../../../../Utils/iconMap';

export default function Alert({ listThemeColor, alertVal }) {
    return <Row justify="center" align="middle">
        <div>
            {Icons.Alert({ Style: { color: `${listThemeColor}`, } })}
            <br></br>
            <span style={{ color: `${listThemeColor}`, fontWeight: "regular", paddingLeft: "0.7em" }}> {alertVal} </span>
        </div>
    </Row>
}