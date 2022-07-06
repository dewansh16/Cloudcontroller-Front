import React, { useEffect, useState } from 'react'

import { notification, Spin } from 'antd'

import patientApi from '../../../Apis/patientApis'

import AllAlertsHeader from './Components/AllAlertsHeader/AllAlertsHeader.Components.AllAlerts.Components.jsx'
import AllALertsList from './Components/AllAlertsList/AllAlertsList.Components.AllAlerts.Components'


function FetchAlertData(isAttended) {
    const [response, setResponse] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true);
        patientApi.getAlerts().then((res) => {

            let alerts = res.data?.response.alerts[0].alerts;
            if (isAttended === "attended") {
                alerts = alerts.filter((item) => {
                    return (item.status === 'close');
                })
            }

            if (isAttended === "notAttended") {
                alerts = alerts.filter((item) => {
                    return (item.status === 'open');
                })
            }


            const monthNames = [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ];

            const toNormalDate = (date) => {
                const date1 = new Date(date);
                const date2 = `${date1.getDate()}  ${monthNames[date1.getMonth()]} ${date1.getFullYear()}`;
                return (date2);
            }

            let reqData = [];
            let oneDayAlerts = [];
            let allDates = [];
            let allDatesSorted;
            if (alerts.length > 0) {

                allDates.push(toNormalDate(alerts[0]?.firstRcvTm));
                alerts.forEach(item => {
                    if (!(allDates.includes(toNormalDate(item.firstRcvTm))))
                        allDates.push(toNormalDate(item.firstRcvTm))
                })

                allDatesSorted = allDates.sort(function (a, b) {
                    var dateA = new Date(a), dateB = new Date(b);
                    return dateB - dateA;
                });
                console.log(allDatesSorted);

                allDatesSorted.forEach(date => {
                    alerts.forEach(item => {
                        if (toNormalDate(item.firstRcvTm) === date) {
                            oneDayAlerts.push(item);
                        }
                    })
                    reqData.push(oneDayAlerts)
                    oneDayAlerts = [];
                })
            }

            console.log(reqData);
            setResponse(reqData);
            setLoading(false)
        }).catch((err) => {
            const error = err.response?.data.result;
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `Unable to fetch alerts try later` || ""
                })
                setLoading(false);
            }
        })
    }, [isAttended])
    return [response, loading]
}

const AllAlerts = (props) => {

    const [userType, setUserType] = useState('all');
    const [isAttended, setIsAttended] = useState('notAttended')

    const [data, isLoading] = FetchAlertData(isAttended);


    const goBack = () => {
        props.history.goBack();
    }

    return (
        <div style={{ width: '100%', margin: '0 auto', position: 'relative' }}>
            <div className='alerts-header'>
                <AllAlertsHeader goBack={goBack} setUserType={setUserType} setIsAttended={setIsAttended} />
            </div>

            <div style={{ height: '100vh', position: 'relative' }} >
                <div style={{ backgroundColor: 'white', width: '100%' }}>
                    {!isLoading && (data.length < 1 || data === null || data === undefined || data.length === 0) &&
                        <div className='no-alerts-div'>
                            <h1>No Alerts</h1>
                        </div>
                    }
                    {!isLoading && data !== null && data !== undefined && data.length !== 0 &&
                        data.map((item, index) => (
                            item.length > 0 ?
                                <div className='alerts-body' style={{ backgroundColor: 'white' }}>
                                    <AllALertsList
                                        key={index} Alerts={item} isAttended={isAttended} />
                                </div>
                                : null
                        ))
                    }

                </div>
                {isLoading && <Spin size="large" style={{ position: 'relative', left: '50%', top: '50%' }} />}
            </div>
        </div>
    )
}

export default AllAlerts