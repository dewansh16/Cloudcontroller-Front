import React, { useState } from 'react'
import './menu.css'

import Icons from '../../../../Utils/iconMap'


// const tempMenuData = [
//     {
//         header: "Information",
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//             "Fourth Element",
//             "Fifth Element"
//         ]
//     },
//     {
//         header: null,
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//         ]
//     },
//     {
//         header: "Medication",
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//         ]
//     },
//     {
//         header: null,
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//         ]
//     },
//     {
//         header: "Medication",
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//         ]
//     },
//     {
//         header: null,
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//         ]
//     },
//     {
//         header: "Medication",
//         elements: [
//             "First Element",
//             "Second Element",
//             "Third Element",
//         ]
//     },
// ]


const createKey = (subgroupId, elementId = null) => {
    return elementId !== null ? `subgroup-${subgroupId + 1}-element-${elementId + 1}` : `subgroup-${subgroupId + 1}`
}


export default function Menu({ menuData, setCurrentState, defaultState }) {


    const [selected, setSelected] = useState(defaultState)

    return (
        <div className="expanded-menu">
            <div className="menu-scroll-container">
                <div className="menu-items">
                    {menuData.map((subGroup, subgroupId) => {
                        return (
                            subGroup.visible && <div className="menu-subgroup" key={createKey(subgroupId,)}>
                                {subGroup.header ? <span className="menu-subgroup-header">{subGroup.header}</span> : null}
                                <ul>
                                    {subGroup.elements.map((tableRowElement, elementId) => {
                                        const createdKey = createKey(subgroupId, elementId);
                                        return (
                                            !tableRowElement.disabled && <li
                                                onClick={() => {
                                                    setSelected(createdKey)
                                                    setCurrentState(createdKey)
                                                }}
                                                className={createdKey === selected ? "menu-item selected" : "menu-item"}
                                                key={createdKey}
                                            >
                                                {
                                                    tableRowElement.disabled && <div className="icon">
                                                        {Icons.lock({})}
                                                    </div>
                                                }
                                                {
                                                    tableRowElement.disabled ? <div className="title" style={{}}>
                                                        {tableRowElement.title}
                                                    </div> : <div className="title" style={{ paddingLeft: "3rem" }}>
                                                        {tableRowElement.title}
                                                    </div>
                                                }
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
