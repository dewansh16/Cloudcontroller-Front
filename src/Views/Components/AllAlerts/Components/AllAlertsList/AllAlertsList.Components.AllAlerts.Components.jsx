import React, { useState } from 'react'
import './AllAlertsList.Components.AllAlerts.Components.css'
import PatientsAlertList from '../PatientsList/PatientsAlertList.Components.AllAlerts.Components'

function AllALertsList(props) {

    const [patientWiseAlerts, setPaitentWiseAlerts] = useState([]);

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(props.Alerts[0].lastRcvTm);
    const date1 = `${date.getDate()}  ${monthNames[date.getMonth()]} ${date.getFullYear()}`;


    // console.log(props.Alerts, props.Alerts[0].lastRcvTm, date);
    useState(() => {
        let reqData = [];
        let onePatientAlerts = [];
        let allPatients = [];

        allPatients.push(props.Alerts[0].pid);
        props.Alerts.forEach(item => {
            if (!(allPatients.includes(item.pid))) { allPatients.push(item.pid) }
        });

        // console.log(allPatients);
        allPatients.forEach(patient => {
            props.Alerts.forEach(item => {
                if (item.pid === patient) {
                    onePatientAlerts.push(item)
                }
            })
            reqData.push(onePatientAlerts);
            onePatientAlerts = [];
        })

        setPaitentWiseAlerts(reqData);

    }, [])



    const openAlerts = (data) => {
        let openCount = 0;
        data.map((item) => {
            if (item.status === 'open' || item.status === 'expired')
                openCount++;
        })
        return openCount;
    }

    return (
        <div className='patients-alert-list'>
            <div className='alerts-date'>
                <p>{date1}</p>
            </div>
            <div className='patients-alerts-list-body'>
                {
                    patientWiseAlerts.map((item, index) => (
                        <PatientsAlertList isAttended={props.isAttended} openAlerts={openAlerts(item)} date={date1} data={item} key={index} />
                    ))
                }

            </div>
        </div>
    )
}

export default AllALertsList
