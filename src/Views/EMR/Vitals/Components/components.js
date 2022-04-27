import React, { useEffect } from 'react'
import Icons from '../../../../Utils/iconMap'
import './components.css'

function RecordTypeSelector({ menuListItems, defaultState, callBack }) {
    useEffect(() => {
    }, [defaultState, menuListItems])
    const elementMap = {
        height: "Height",
        weight: "Weight",
        spo2: "SpO2",
        temperature: "Temperature",
        pulse: "Pulse",
        respiration: "Respiration",
        bpd: "BPD",
        bps: "BPS",
        pain_index: "Pain Index",
    }
    return (
        <div className="record-type-selector">
            {menuListItems.map((element, id) => {
                // const IconStyle = {
                //     color: element === defaultState ? "#ffffff" : "#000000"
                // }
                return <div key={id} onClick={() => callBack(element)} className={element === defaultState ? "selector-item selected" : "selector-item"}>
                    <p>{elementMap[element]}</p>
                </div>
            })}
        </ div >
    )
}

export { RecordTypeSelector }