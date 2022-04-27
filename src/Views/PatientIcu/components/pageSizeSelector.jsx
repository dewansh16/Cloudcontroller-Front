import React from 'react';
import { Select } from 'antd';
import Icons from '../../../Utils/iconMap';
const { Option } = Select;

export default function PageSizeSelector({ pageSize, pageSizeOptions, setPageSize }) {

    const setPageSizeOnSelect = (val) => {
        setPageSize(val)
    }

    return <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", minWidth: "12.5rem" }}>
        <div >
            <p style={{ margin: 0, fontWeight: "600", fontSize: "1.25em" }}>Page Size</p>
        </div>
        {/* Show page size options */}
        <Select defaultValue={pageSize} style={{ fontWeight: "600", borderRadius: "6px" }} onSelect={setPageSizeOnSelect} suffixIcon={Icons.downArrowFilled({ style: { color: "black", pointerEvents: "none" } })}>
            {pageSizeOptions.map(item =>
                <Option key={item} value={item}>{item}</Option>
            )}
        </Select>
    </div>
}