import React from 'react';
import { Row, Col } from 'antd';
import Icons from '../../../Utils/iconMap';
import Colors from '../../../Theme/Colors/colors';
import SmallLineChart from '../../Components/Charts/smallCharts/lineChart';
import { Link } from 'react-router-dom';
import EcgChart from './liveEcgChart.js';
import getAge from '../../../Utils/getAge';

/**
 * 
 * @param {patientData} data - the entire patient data as returned from the apis 
 * @returns {JSX} card with HR, RR, SPO2, and live ECG monitor
 */
export default function InfoCard({ data, checkedValues }) {

    const borderColor = '1px solid rgba(0,0,0,0.2)';

    const cardHeader = {
        firstCol: {
            style: {
                display: "flex",
                justifyContent: "center",


            },
            innerCol: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
            },
            iconStyle: {
                width: "1.6em"
            },
            ageBlock: {
                display: "inline-flex",
                justifyContent: "space-between"
            }
        },
        secondCol: {
            style: {
                display: "flex",
                alignItems: "center",
                paddingTop: "0.5em",
                paddingLeft: "0.6em",
                borderLeft: borderColor
            },
            pStyle: {
                fontSize: "0.8em",
                color: "rgba(1,1,1,0.6)",
                fontWeight: "500",
                letterSpacing: "0.1em",
            }
        },
        fontStyle: {
            fontSize: "0.8em",
            margin: "0px",
            textTransform: "capitalize",
        }

    }

    const cardBody = {
        style: {
            padding: "1em",
            display: "flex",
            justifyContent: "space-around"
        },
        iconStyle: {
            width: "1.6em"
        }
    }

    const [chartBlockData, setChartBlockData] = React.useState([]);

    React.useEffect(() => {
        setChartBlockData([
            {
                title: "temp",
                icon: Icons.thermometerIcon({ Style: { color: Colors.purple } }),
                val: data.ews_map?.temp,
                trendData: data.trend_map[1].temp,
                color: Colors.purple,
            },
            {
                title: "SpO2",
                icon: Icons.o2({ Style: { color: Colors.green } }),
                val: data.ews_map?.spo2,
                trendData: data.trend_map[0].spo2,
                color: Colors.green,
            },
            {
                title: "Resp Rate",
                icon: Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
                val: data.ews_map?.hr,
                trendData: data.trend_map[3].hr,
                color: Colors.darkPink,
            },
            {
                title: "EWS",
                icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
                val: data.ews_map?.rr,
                trendData: data.trend_map[2].rr,
                color: Colors.orange,
            },
        ])
    }, [data.trend_map, data.ews_map])


    return <div>
        <div style={{
            width: "24rem",
            borderLeft: `0.4em solid ${Colors.lightBlue} `,
            borderTop: borderColor,
            borderBottom: borderColor,
            borderRight: borderColor,
            borderRadius: "6px",
            background: "white",
            position: "relative",
            maxHeight: "25em",
            zIndex: "1"
        }}>
            <Row style={{ borderBottom: borderColor, marginBottom: "0.7em" }} >
                <Col style={cardHeader.firstCol.style}>
                    <div style={{ ...cardHeader.firstCol.innerCol, padding: "0.8em" }}>
                        {Icons.patientInBedIcon({ Style: cardHeader.firstCol.iconStyle })}
                        <div style={cardHeader.firstCol.ageBlock}>
                            <p style={{ ...cardHeader.fontStyle, fontWeight: "400" }}>{getAge(new Date(), new Date(data.demographic_map.DOB))}</p>
                            <p style={{ ...cardHeader.fontStyle, fontWeight: "400" }}>Y</p>
                        </div>
                    </div>
                    <div style={{ ...cardHeader.firstCol.innerCol, padding: "0.8em 0.8em 0.8em 0" }}>
                        {/* TODO: change ward to bed number */}
                        <p style={{ ...cardHeader.fontStyle, fontWeight: "700" }}>{data.location_map.ward}</p>
                        <p style={{ ...cardHeader.fontStyle, fontWeight: "400" }}>{data.demographic_map.sex}</p>
                    </div>
                </Col>
                <Col flex={3} style={cardHeader.secondCol.style}>
                    <div >
                        <Link to={`/dashboard/patient/details/${data.demographic_map.pid}`}>
                            {console.log(`/dashboard/patient/details/${data.demographic_map.pid}`)}
                            <h3 style={{ fontSize: "1.2em", margin: "0" }}>
                                {`${data.demographic_map.title}  ${data.demographic_map.fname}  ${data.demographic_map.mname[0] === undefined ? "" : data.demographic_map.mname[0].toUpperCase()}  ${data.demographic_map.lname}`}
                            </h3>
                        </Link>
                        <p style={cardHeader.secondCol.pStyle}>{`MR: ${data.demographic_map.med_record}`}</p>
                    </div>
                </Col>
            </Row>
            {chartBlockData.map(item => {
                if (checkedValues.includes(item.title)) {
                    return <Row gutter={8} key={item.title} justify="space-around" style={{ padding: "0.3em" }}>
                        <Col style={cardBody.style} span={2}>
                            <div>
                                {item.icon}
                            </div>
                        </Col>
                        <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: "1.4em", fontWeight: "600" }}>
                                {item.val}
                            </div>
                        </Col>
                        <Col span={12}>
                            <SmallLineChart chartData={item.trendData} dataKey="value" strokeColor={item.color} />
                        </Col>
                        {/* <Col style={cardBody.style} span={2}>
                        <div>
                            {item.icon}
                        </div>
                        <div>
                            {item.val}
                        </div>
                    </Col> */}
                    </Row>
                }
                else return null;
            }
            )}

        </div>
        <Row style={{ width: "24rem", marginTop: "-0.3em" }}>
            <Col span={24}>
                <EcgChart pid={data.demographic_map.pid} />
            </Col>
        </Row>
    </div >
}