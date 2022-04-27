import React from 'react'
import AntdInput from 'antd/lib/input'
import AntdInputNumber from 'antd/lib/input-number'

import './input.css'

import { createClassName } from '../../utility';

const { TextArea } = AntdInput;
const { Search } = AntdInput;

function GlobalSearch({ className, ...rest }) {
    return (
        <Search className={`form-select` + createClassName(className)} {...rest} />
    )
}


function GlobalTextArea({ className, ...rest }) {
    return (
        <TextArea className={`form-input` + createClassName(className)} {...rest} />
    )
}

function Input({ className, ...rest }) {
    return (
        <AntdInput className={`form-input` + createClassName(className)} {...rest} />
    )
}

function InputNumber({ className, ...rest }) {
    return (
        <AntdInputNumber className={`form-input-number` + createClassName(className)} {...rest} />
    )
}



export { Input, GlobalTextArea, GlobalSearch, InputNumber }


// propTypes {
//    className: string,
// } 
