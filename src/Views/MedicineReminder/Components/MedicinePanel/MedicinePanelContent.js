import React from 'react'
import Icons from '../../../../Utils/iconMap'

import './medicinePanelContent.css'

function MedicinePanelContent({ pdata, dosage, pName }) {
    return (
        <div className="panel-content-container" >
            <div className="panel-icon-number-container" >
                {Icons.patientInBedIcon({ Style: { width: "30px" } })}
                <div className="panel-number-container" >
                    {pdata.bednumber}
                </div>
            </div>
            <div className="panel-patient-details-container" >
                <div className="panel-patient-name" >
                    {pName}
                </div>
                <div className="panel-patient-id" >
                    MR2021D3930
                </div>
            </div>
            <div className="panel-dosage" >
                {dosage} Doze
            </div>
        </div>
    )
}

export default MedicinePanelContent
