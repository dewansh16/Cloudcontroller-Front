import React from 'react'
import './AlertList.Components.Alerts.css'


import Alert from '../Alert/Alert.components.Alerts';


const AlertList = (props) => {

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(props.Alerts[0].lastRcvTm);
    const date1 = `${date.getDate()}  ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    console.log(props.Alerts);

    return (
        <div className='alert-list'>
            <div className='alerts-date'>
                <p>{date1}</p>
            </div>
            <div className='alerts-list-body'>

                {
                    props.Alerts.map(item => (
                        <Alert pid={props.pid} props={props.props} data={item}></Alert>
                    )
                    )
                }

            </div>
        </div>
    )
}
export default AlertList