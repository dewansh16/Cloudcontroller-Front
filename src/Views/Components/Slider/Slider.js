import React, { useState } from 'react'
import { Slider } from 'antd'

export default function MySlider(props) {
    const onChange = props.onChange || null;
    const [min, setMin] = useState(props.defaultValue[0] || props.defaultValue)
    const [max, setMax] = useState(props.defaultValue[1] || props.defaultValue)
    const sliderOnChange = (value) => {
        setMin(value[0]);
        setMax(value[1]);
        if (onChange !== null) {
            onChange(value);
        }
    }
    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: "1em"
            }}>
                <span>Min: {min}</span>
                <span>Max: {max}</span>
            </div>
            <Slider {...props} onChange={sliderOnChange} />
        </>
    )
}
