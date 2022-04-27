import React from 'react'
import './medicineCollapse.css'

function MedicineCollapse({ specs }) {
    return (
        <div className="medicine-collapse-container" >
            <div className="medicine-collapse-number" >
                {specs["number"]}
            </div>
            <div className="medicine-collapse-details" >
                <div className="collapse-medicine-name" >
                    {specs["drug"]}
                </div>
                <div className="collapse-medicine-number" >
                    {specs["type"]}
                </div>
            </div>
        </div>
    )
}

export default MedicineCollapse
