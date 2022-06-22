import React from 'react';
import { Button, Select } from 'antd';

import Colors from '../../../Theme/Colors/colors';
import Icons from '../../../Utils/iconMap';

import { titlePageLength, arrPagiLength, controlButtonStyle } from "./constant"; 

import './pagination.css';

const { Option } = Select;

function computeTotalPages(maxItems, pageSize) {
    // storage.setItem('pageSize', value)
    let val = Math.ceil(maxItems / parseInt(pageSize))
    return val > 0 ? val : 1;
}

const PaginationBox = ({ totalPages, currentPageVal, setCurrentPageVal, valuePageLength, setValuePageLength }) => {

    const increamentPage = () => {
        if (currentPageVal < totalPages) {
            setCurrentPageVal(currentPageVal + 1)
        }
    }

    const decreamentPage = () => {
        if (currentPageVal > 1) {
            setCurrentPageVal(currentPageVal - 1)
        }
    }
    const setPageValOnSelect = (val) => {
        setCurrentPageVal(val)
    }

    const setValPageLengthOnSelect = (val) => {
        setValuePageLength(val);
        setCurrentPageVal(1);
    }

    return <div className='pagination-box'>
        <Button 
            style={controlButtonStyle}
            disabled={Number(currentPageVal) === 1}
            onClick={decreamentPage}
        >
            {Icons.leftArrowFilled({ Style: { opacity: Number(currentPageVal) === 1 ? "0.5" : "1" } })}
        </Button>
        <div className='pagination-main-box'>
            <Select value={currentPageVal} bordered={false}
                style={{
                    display: 'flex',
                    height: '100%',
                    border: `1px solid ${Colors.orange}`,
                    borderRadius: "6px",
                    zIndex: "1",
                    padding: "0.6rem",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    background: "white"
                }}
                listItemHeight={4} onSelect={setPageValOnSelect}>
                {Array(totalPages).fill().map((__, i) =>
                    <Option key={i} style={{ display: 'flex', height: '100%' }} value={i + 1}>{i + 1}</Option>
                )}
            </Select>
            <div className="total-page-box">
                <h1>out of {totalPages}</h1>
            </div>
        </div>
        <Button 
            style={controlButtonStyle} 
            disabled={Number(currentPageVal) === Number(totalPages)}
            onClick={increamentPage}
        >
            {Icons.rightArrowFilled({ Style: { opacity: Number(currentPageVal) === Number(totalPages) ? "0.5" : "1" }})}
        </Button>

        {valuePageLength && (
            <div className='pagination-box-length'>
                <div className="total-page-box">
                    <h1>{titlePageLength}</h1>
                </div>
                <Select value={valuePageLength} bordered={false}
                    style={{
                        display: 'flex',
                        height: '100%',
                        border: `1px solid ${Colors.orange}`,
                        borderRadius: "6px",
                        zIndex: "1",
                        padding: "0.6rem",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                        background: "white"
                    }}
                    onSelect={setValPageLengthOnSelect}
                >
                    {arrPagiLength.map(length => (
                        <Option key={length} style={{ display: 'flex', height: '100%' }} value={length}>{length}</Option>
                    ))}
                </Select>
            </div>
        )}
    </div>
}

export { PaginationBox, computeTotalPages }