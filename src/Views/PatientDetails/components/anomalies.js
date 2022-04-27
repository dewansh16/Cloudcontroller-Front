import { Collapse, List, Spin } from 'antd';
import React from 'react';
import patientApi from '../../../Apis/patientApis';
import { timeAndDate } from '../../../Utils/dateFormatter';
import { LineChartWithSlider } from '../../Components/Charts/lineChart'
const { Panel } = Collapse;

const headerPanel = (value, start, end, type) => {
    const indivStyle = {
        minWidth: "14em"
    }

    return <div style={{
        display: 'inline-flex',
        justifyContent: 'space-around',
        minWidth: '59em',
        height: "1em"
    }}>
        <div style={indivStyle}>

            <h2 style={{ fontSize: "1em" }}>Type: {type}</h2>
        </div>
        <div style={{ minWidth: "14em", display: "flex", justifyContent: "center" }}>

            <h2 style={{ fontSize: "1em" }}>Value: {value}</h2>
        </div>
        <div style={indivStyle}>

            <p>Start: {start}</p>
        </div>
        <div style={indivStyle}>
            <p>End: {end}</p>

        </div>
    </div>
}



// each panel

const Anomaly = ({ pid, startTime, endTime, value, type }) => {
    const [loading, setLoading] = React.useState(true)
    // const [chartData, setChartData] = React.useState([])
    let temppid = 'patient9b29c17d-4f4b-49e9-9247-f80ff85d3b7c';
    let tempstartTime = '2020-10-06T18:27:28.000Z';
    let tempendTime = '2020-10-06T18:28:10.000Z';
    let newData = [];
    let newi = 0;
    patientApi.getSensorData(temppid, tempstartTime, tempendTime)
        .then(res => {
            let data = res.data.response.patient_sensor_data
            console.log('xxx', data)
            data.map((item, i) => {
                let temp = [];
                // console.log('iii', i)
                newi = newi + i * 128;
                // let index = [];
                item.ecg.split(",").map((val, j) => {
                    // console.log('i,j,val', i, j, val);

                    temp.push({
                        time: newi + j,
                        value: parseInt(val)
                    })
                    return null;
                });
                // console.log('sssssss', newData)
                newData.push(...temp);
                return null;
            });
            // console.log("sss", newData)
            // setChartData(newData)
            setLoading(false)
            // console.log(res.data)

        })
        .catch(err => { console.log(err) })





    // console.log(chartData)
    // tempstartTime, tempendTime, value, pid
    return <Collapse >
        <Panel header={headerPanel(value, timeAndDate(startTime), timeAndDate(endTime), type)} key="1">
            <div>
                {loading ? <Spin></Spin> :
                    <div>

                        <LineChartWithSlider chartData={newData} xAxis="time" yAxis="value" />
                    </div>
                }</div>
        </Panel>
    </Collapse>
}




// main 
const Anomalies = ({ pid }) => {

    const [loading, setLoading] = React.useState(true);
    const [alertData, setAlertData] = React.useState([])
    React.useEffect(() => {
        patientApi.getAnomalies(pid)
            .then(res => {
                setLoading(false)
                setAlertData(res.data.response.alerts[0].alerts)
                console.log(res.data.response.alerts[0].alerts)
            }
            ).catch(err => console.log(err))

    }, [pid])


    console.log('i am getting called again')
    return <div>
        <List
            loading={loading}
            dataSource={alertData}
            renderItem={listItem =>
                <Anomaly pid={pid}
                    startTime={listItem?.firstRcvTm}
                    endTime={listItem?.lastRcvTm}
                    value={listItem?.value}
                    type={listItem?.type}
                />}
        ></List>
    </div>
}

export default Anomalies;