import React from 'react'
import { createClassName } from '../../utility';
import "./headers.css"

function Header({ children, className, ...rest }) {
    return (
        <div className="global-dashboard-grid" {...rest}>{children}</div>
    )
}

export default Header
