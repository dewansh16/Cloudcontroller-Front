import React from 'react';
import { Button } from 'antd';
import './pageController.Report.Components.css'
import { Select } from 'antd';



const { Option } = Select;
const PageController = (props) => {
    return (
        <div className='page-controller' >
            <div className='button-box'><Button style={{
                fontSize: '15px',
                fontFamily: 'Lexend',
                fontWeight: '600', color: '#FBFBFB',
                background: '#FD752A',
                borderColor: '#FD752A',
                height: '48px',
                padding: '4px 35px',
                borderRadius: '6px',
            }}>Download as PDF</Button>
            </div>
        </div>
    )
}

export default PageController;