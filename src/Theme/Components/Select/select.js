import React from 'react'
import AntdSelect from 'antd/lib/select'
import Icons from '../../../Utils/iconMap'

import { createClassName } from '../../utility';
import './select.css'

const { Option } = AntdSelect;

// use the following code to add the options to the select
// import Select from 'antd/lib/select'
// const { Option } = Select;

function SelectOption({ children, className, ...rest }) {
    return <Option className={`form-select-option` + createClassName(className)} {...rest}>
        {children}
    </Option>
}

function Select({ children, className, ...rest }) {
    return (
        <AntdSelect suffixIcon={Icons.downArrowFilled({ style: { color: "#949494" } })} className={`form-select` + createClassName(className)} {...rest}>
            {children}
        </AntdSelect>
    )
}

export { Select, SelectOption }
