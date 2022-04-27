import React from 'react';
import Colors from '../../../Theme/Colors/colors';
import { Button, Select } from 'antd';
import Icons from '../../../Utils/iconMap';
import './pagination.css';
const { Option } = Select;


const controlButtonStyle = {
    height: 'auto',
    width: '1em',
    padding: '1rem 1.5rem',
    border: "none",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '400',
    color: `${Colors.orange}`,
    borderRadius: '6px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
}

function computeTotalPages(maxItems, pageSize) {
    // storage.setItem('pageSize', value)
    let val = Math.ceil(maxItems / parseInt(pageSize))
    return val;
}

const PaginationBox = ({ totalPages, currentPageVal, setCurrentPageVal }) => {

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
    return <div className='pagination-box' style={{ width: "20em" }}>
        <Button style={controlButtonStyle} onClick={decreamentPage}>{Icons.leftArrowFilled({})}</Button>
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
        <Button style={controlButtonStyle} onClick={increamentPage}>{Icons.rightArrowFilled({})}</Button>
    </div>
}

export { PaginationBox, computeTotalPages }