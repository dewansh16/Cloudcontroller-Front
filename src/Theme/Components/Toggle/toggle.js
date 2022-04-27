import React, { useState } from 'react'
import './toggle.css'

export default function Toggle({ options, state, returnOnSelect }) {
    const [selected, setSelected] = useState(state)
    return (
        <div className="toggle-container">
            {options.map((toggle, id) => {
                return <div onClick={() => { returnOnSelect(toggle.returnOnSelect); setSelected(id) }} key={id} className={id === selected ? `toggle-option selected` : `toggle-option`}>{toggle.title}</div>
            })}
            <div className={`toggle-slider ${selected ? "right" : "left"}`}></div>
        </div>
    )
}
