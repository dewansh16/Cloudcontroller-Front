import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { secondaryButtonStyle } from '../../../Theme/styles';
import ECG from '../../Components/Charts/ecg';


export default function LiveCharts(props) {


    const [key, setKey] = useState(1);


    const buttonsMenu = [
        {
            text: "ECG",
            Component: ECG,
            style: secondaryButtonStyle({
                border: "1px solid #161EDD",
                color: "#161EDD"
            }),

        },
        {
            text: "SPO2",
            Component: null,
            style: secondaryButtonStyle({
                border: "1px solid #161EDD",
                color: "#161EDD"
            }),

        },
        {
            text: "Temperature",
            Component: null,
            style: secondaryButtonStyle({
                border: "1px solid #161EDD",
                color: "#161EDD"
            }),

        },
    ]
    // const changeKey = () => {
    //     setKey(2);
    // }
    return <>
        <Row span={24}>
            {buttonsMenu.map((item, i) =>
                <Col key={i}>
                    <Button
                        type={key === i + 1 ? "default" : "ghost"}
                        size="large"
                        onClick={() => setKey(i + 1)}
                        style={key === i + 1 ? item.style : { margin: "1em" }}>{item.text}</Button>
                </Col>
            )}
        </Row>
        <Row span={24}>
            {buttonsMenu.map((Item, i) =>
                key === i + 1 ? (<Col span={24} key={i}>
                    <Item.Component pid={props.pid} />
                </Col>) : ""
            )}
        </Row>
    </>
}