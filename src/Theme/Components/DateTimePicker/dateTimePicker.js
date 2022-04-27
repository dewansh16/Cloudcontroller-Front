import React from 'react'
import AntdDatePicker from 'antd/lib/date-picker'
import './dateTimePicker.css'
import moment from 'moment'

const AntdRangePicker = AntdDatePicker.RangePicker;


function RangePicker({ children, ...rest }) {
    return (
        <AntdRangePicker
            showTime={{ defaultValue: moment(Date.now()) }}
            format="DD/MM/YYYY HH:mm:ss"
            ranges={{
                'Last 8 hours': [moment().subtract(8, 'hours'), moment()],
                'Last 12 hours': [moment().subtract(12, 'hours'), moment()],
                'Last 24 hours': [moment().subtract(24, 'hours'), moment()],
                // 'Last 36 hours': [moment().subtract(36, 'hours'), moment()],
                'Last 2 Days': [moment().subtract(48, 'hours'), moment()],
                'Last 76 hours': [moment().subtract(76, 'hours'), moment()],
                // 'Last 4 Days': [moment().subtract(96, 'hours'), moment()],
                'Last 7 Days': [moment().subtract(168, 'hours'), moment()],
            }}
            {...rest}
        >
            {children}
        </AntdRangePicker>
    )
}

function DatePicker({ children, ...rest }) {
    return (
        <AntdDatePicker
            format="DD/MM/YYYY"
            // onChange={onChange}
            {...rest}
        >
            {children}
        </AntdDatePicker>
    )
}


export { RangePicker, DatePicker }