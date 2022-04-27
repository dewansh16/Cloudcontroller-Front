import React from 'react';
import clientIcon from '../../../../../Assets/Images/MB.svg'
import heartIcon from '../../../../../Assets/Images/heart.png'
import { Image } from 'antd';
import '../header/header.Report.components.css'

const Header = () => {
    return (
        <div className="report-header">
            <div className="header-logo">
                <Image src={clientIcon} preview={false} ></Image>
            </div>
            <div className='powered-by'>
                <p >Powered By</p>
            </div>
            <div className="heart-logo">
                <Image src={heartIcon} preview={false} ></Image>
            </div>
            <div className='site-link'>
                <p>Live247.ai</p>
            </div>
        </div>
    )
}

export default Header;