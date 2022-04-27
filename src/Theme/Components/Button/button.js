import React from 'react'
import AntdButton from 'antd/lib/button'
import { createClassName } from '../../utility';
import './button.css'

/** 
 * 
 * @buttonTypes primary, primary-outlined, secondary, secondary-outlined, utility, tertiary
 * @default primary
 */
function Button({ children, className, type, ...rest }) {
    return (
        <AntdButton className={`global-btn ${type || "primary"}` + createClassName(className)} {...rest}>{children}</AntdButton>
    )
}

export { Button }
