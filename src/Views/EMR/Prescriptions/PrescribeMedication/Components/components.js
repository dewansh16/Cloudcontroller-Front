import React from 'react'
import Icons from '../../../../../Utils/iconMap'
import './components.css'
import Tooltip from 'antd/lib/tooltip'


// const propTypes = {
//     selected: [true, false],
//     valid: [true, false, null],
//     text: string,
//     children: react.node,
// }

const setClasssName = (valid, selected) => {
    const validityStatus = valid === null ? "unupdated" : valid ? "valid" : "invalid"
    const selectStatus = selected ? " selected" : ""
    return `li-item ${validityStatus}${selectStatus}`
}

function MenuListItem({ children, text, valid, selected, ...rest }) {
    const ValidIconStyle = {
        color: selected ? "#1BC114" : "#1BC114",
    }
    const WarningIconStyle = {
        color: selected ? "orange" : "orange",
    }
    const InvalidIconStyle = {
        color: selected ? "#EB1348" : "#EB1348",
    }
    return (
        <Tooltip placement="right" color="#000000" overlayInnerStyle={{ borderRadius: "6px" }} title={valid === null ? "unupdated changes" : valid ? "" : "invalid form"}>
            <li className={setClasssName(valid, selected)} {...rest}>
                <span>{!text ? "New Medicine" : text.slice(0, 9) + (text.length > 9 ? "..." : "")}</span>
                <i>
                    {
                        valid === "none" ? "" : valid === null ? Icons.exclamationCircleFilled({ style: WarningIconStyle }) : valid ? Icons.checkCircleFilled({ style: ValidIconStyle }) : Icons.plusCircleFilled({ style: InvalidIconStyle, rotate: 45 })
                    }
                </i>
            </li>
        </Tooltip>
    )
}

function MedicineSearchListHeader({ children, title1, title2 }) {
    const nameTypeMap = {
        product_name: "product name",
        generic_name: "generic name",
    }
    return (
        <div className="med-search-list-header">
            <span>
                {nameTypeMap[title1]}
            </span>
            <span>
                {title2}
            </span>
        </div >
    )
}

function MedicineSearchListItem({ children, selected, data, nameType, ...rest }) {
    const name = `${data[nameType]?.slice(0, 12)}${data[nameType].length > 12 ? "..." : ""} ${data["strength"] ? data["strength"] + " mg " : ""}${data["route"]} ${data["form"]}`.slice(0, 36)
    return (
        <li className={`med-search-li-item${selected ? " selected" : ""}`} {...rest}>
            <p style={{ padding: 0, margin: 0, fontWeight: 500, fontSize: "16px", letterSpacing: "0.02em" }}>{name}</p>
            <span style={{ padding: 0, margin: 0, fontWeight: 500, fontSize: "16px", letterSpacing: "0.02em" }}>
                {data.marketing_status?.slice(0, 10)}{data.marketing_status?.length > 10 ? "..." : ""}
            </span>
        </li >
    )
}

export { MenuListItem, MedicineSearchListItem, MedicineSearchListHeader }
