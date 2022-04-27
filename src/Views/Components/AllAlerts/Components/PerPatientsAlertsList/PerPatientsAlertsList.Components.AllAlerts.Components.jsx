import React from 'react'
import PatientAlerts from '../PatientsAlerts/PatientAlerts.Components.AllAlerts.Components';

function PerPatientsAlertsList(props) {
    // console.log(props.data);

    return (
        <div className='in-patient-alerts'>
            {props.data.map((item, index) => {
                return (
                    <PatientAlerts parentCheckBtn={props.parentCheckBtn} parentKey={props.key} key={index} setOpenCount={props.setOpenCount} openCount={props.openCount} item={item} index={index} />
                )
            })}
        </div>
    )
}

export default PerPatientsAlertsList