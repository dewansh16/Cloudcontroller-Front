import React from 'react'
import './AlertList.Components.Alerts.css'


import Alert from '../Alert/Alert.components.Alerts';


const AlertList = (props) => {
    console.log("props AlertList", props);

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    // const date = new Date(props.Alerts[0].lastRcvTm);
    const date = new Date();
    const date1 = `${date.getDate()}  ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    return (
        <div className='alert-list'>
            {/* <div className='alerts-date'>
                <p>{date1}</p>
            </div> */}
            <div className='alerts-list-body'>
                <Alert pid={props.pid} props={props.props} data={props.Alerts}></Alert>
            </div>
        </div>
    )
}
export default AlertList