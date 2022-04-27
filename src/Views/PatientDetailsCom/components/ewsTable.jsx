import React from 'react';
import { Spin, Empty } from 'antd';
import moment from 'moment';

import patientApi from '../../../Apis/patientApis';
import { Button } from '../../../Theme/Components/Button/button';

import './styles/ewsTable.css';

const isDataPresent = (data) => {
    return (parseInt(data) !== -1) ? data : "--"
}
const EwsTable = ({ pid }) => {
    const today = new Date();
    const prevMonth = new Date(today);
    prevMonth.setDate(prevMonth.getDate() - 30);

    const prevWeek = new Date(today);
    prevWeek.setDate(prevWeek.getDate() - 7);

    const prevDay = new Date(today);
    prevDay.setDate(prevDay.getDate() - 1);

    const [trendMap, setTrendMap] = React.useState(null);
    const [apiState, setApiState] = React.useState({
        isLoading: false,
        hasError: null,
    });
    const [buttonState, setButtonState] = React.useState({ selectedButton: "daily" })

    const fetchEwsTable = (startDate) => {
        setApiState({ isLoading: true });
        
        patientApi.getTrends(pid, startDate, 0, 0, today)
            .then(res => {
                let val = res.data.response.trend_map?.consolidated_trend_map
                if (val !== undefined) {
                    let myArray = Object.entries(val);
                    setTrendMap(myArray);
                }
                console.log(apiState.selectedButton)
                setApiState({ ...apiState, isLoading: false });
            })

            .catch(err => {
                setApiState({ ...apiState, isLoading: false });
                setApiState({ ...apiState, hasError: err });

            });
    }

    React.useEffect(() => {
        fetchEwsTable(prevWeek);
    }, [pid])

    React.useEffect(() => {
    }, [apiState.selectedButton])

    if (!apiState.hasError) {
        return <div>Error in fetching details.</div>
    } else {
        return <>
            <div style={{
                display: "flex",
                justifyContent: "start",
                gap: "2rem",
                marginBottom: "2rem"
            }}>
                <Button disabled={apiState.isLoading}
                    type={buttonState.selectedButton === "daily" ? "" : "utility"}
                    onClick={() => {
                        setButtonState({ selectedButton: "daily" });
                        fetchEwsTable(prevDay);
                    }}>
                    Last 24 Hours
                </Button>

                <Button disabled={apiState.isLoading}
                    type={buttonState.selectedButton === "weekly" ? "" : "utility"}
                    onClick={() => {
                        setButtonState({ selectedButton: "weekly" });
                        fetchEwsTable(prevWeek);
                    }}>
                    Last Week
                </Button>

                <Button disabled={apiState.isLoading}
                    type={buttonState.selectedButton === "monthly" ? "" : "utility"}
                    onClick={() => {
                        setButtonState({ selectedButton: "monthly" });
                        fetchEwsTable(prevMonth);
                    }}>
                    Last Month
                </Button>
            </div>

            {apiState.isLoading && <div style={{ width: "100%", textAlign: "center" }}>
                <Spin />
            </div>}

            {(trendMap !== null && !apiState.isLoading) && (
                <div>
                    <table className="ewsTable">
                        <thead>
                            <tr className="ewsHeader">
                                <th>Date</th>
                                <th>Time</th>
                                <th>SPO2</th>
                                <th>Temp</th>
                                <th>rr</th>
                                <th>bp</th>
                                <th>ews</th>
                            </tr>
                        </thead>
                    </table>

                    <div id="table-wrapper" >
                        <table className="ewsTable">
                            <tbody>
                                {trendMap.length !== 0 && trendMap.map((item => {
                                    const [date, value] = item;
                                    console.log(value)
                                    return (<tr className="ewsContent" key={date}>
                                        <td>{new Date(date).toLocaleDateString()}</td>
                                        <td>{new Date(date).toLocaleTimeString()}</td>
                                        <td>{isDataPresent(value.spo2)}</td>
                                        <td>{isDataPresent(value.temp)}</td>
                                        <td>{isDataPresent(value.rr)}</td>
                                        <td>{isDataPresent(value.hr)}</td>
                                        <td>{isDataPresent(value.ews)}</td>
                                    </tr>)
                                }
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {(trendMap === null && !apiState.isLoading) && <Empty />}
        </>
    }
}
export default EwsTable;