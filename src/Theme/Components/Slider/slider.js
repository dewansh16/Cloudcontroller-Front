import React from 'react'
import AntdSLider from 'antd/lib/slider'
import './slider.css'

import { createClassName } from '../../utility'

function Slider({ children, className, ...rest }) {
    return (
        <AntdSLider className={`global-slider` + createClassName(className)} {...rest}>
            {children}
        </AntdSLider>
    )
}

export { Slider }