import React from 'react'
import { Select, Button } from 'antd';
import Colors from '../../Theme/Colors/colors';
const { Option } = Select;



const PaginationBox = ({ totalPages, currentPageVal, setCurrentPageVal }) => {

    const controlButtonStyle = {
        height: '1em',
        width: '1em',
        padding: '0.6em',
        border: "none",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2em',
        fontWeight: '400',
        color: `${Colors.orange}`,
        borderRadius: '6px',
        boxShadow: '0px 4px 20px rgba(0 0 0 0.5)'
    }

    const increamentPage = () => {
        setCurrentPageVal(currentPageVal + 1)
    }

    const decreamentPage = () => {
        setCurrentPageVal(currentPageVal - 1)
    }
    const setPageValOnSelect = (val) => {
        setCurrentPageVal(val)
    }
    return <div className='pagination-box' style={{ minWidth: "20em" }}>
        <Button style={controlButtonStyle} onClick={increamentPage}>+</Button>
        <div className='page-select'>
            <Select value={currentPageVal} style={{ display: 'flex', height: '100%' }} listItemHeight={4} onSelect={setPageValOnSelect} >
                {Array(totalPages).fill().map((item, i) =>
                    <Option key={i} style={{ display: 'flex', height: '100%' }} value={i + 1}>{i + 1}</Option>
                )}
            </Select>
            <h1>out of {totalPages}</h1>
        </div>
        <Button style={controlButtonStyle} onClick={decreamentPage}>-</Button>
    </div>
}

export default PaginationBox