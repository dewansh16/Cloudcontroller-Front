import React, { useEffect, useState } from 'react'
import patientApi from '../../../Apis/patientApis'
import './prescriptions.css'
import { Button } from '../../../Theme/Components/Button/button'
import Icons from '../../../Utils/iconMap'
import CreatePrescription from './CreatePrescription/createPrescription'
import Spin from 'antd/lib/spin'
import notification from 'antd/lib/notification'

import { useHistory } from 'react-router-dom'

import Collapse from 'antd/lib/collapse'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import CaretUpOutlined from '@ant-design/icons'

const { Panel } = Collapse


function FetchPrescriptions(pid, limit) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        patientApi.getPatientPrescriptions(pid, limit).then((res) => {
            setResponse(res.data.response["prescriptions"])
            setLoading(false);
        }).catch((err) => {
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response?.data.result}` || ""
                })
                setLoading(false);
            }
        })
    }, [pid])
    return [response, loading]
}

export default function Prescriptions({ pid, setComponentSupportContent, setEmrView, patient, setPadding }) {
    // patient: data fetched on the EMR screen about the patient
    const [prescriptions, isLoading] = FetchPrescriptions(pid, 20);
    let history = useHistory();

    const backToPatientDetails = () => {
        // the below code to always redirect to 
        history.push(`/dashboard/patient/details/${pid}`)
        // history.goBack()
    }

    // {
    //     0: {
    //         formData: {
    //             "type": "TABLET",
    //             "doses": "once a day",
    //             "route": "ORAL",
    //             "dosage": "1",
    //             "details": null,
    //             "drugName": "Hydrocodone Polistirex and Chlorpheniramine Polistirex",
    //             "strength": 100,
    //             "frequency": "week(s)",
    //             "tradeName": "ANDA",
    //             "occurrence": "before breakfast",
    //             "frequencyPeriod": "3"
    //         },
    //         valid: null,
    //     },
    //     1: {
    //         formData: {
    //             "type": "INJECTION",
    //             "doses": "once a day",
    //             "route": "INJECTION",
    //             "dosage": "1",
    //             "details": null,
    //             "drugName": "Lisinopril",
    //             "strength": 100,
    //             "frequency": "week(s)",
    //             "tradeName": "ANDA",
    //             "occurrence": "before breakfast",
    //             "frequencyPeriod": "3"
    //         },
    //         valid: null,
    //     }
    // }

    const createMenuData = (prescription) => {
        let tempMenu = []
        if (prescription) {
            prescription["drug"].map((drug, id) => {
                tempMenu.push({
                    data: drug,
                    valid: true,
                })
            })
            return tempMenu
        }
    }

    useEffect(() => {
        setComponentSupportContent(
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
            }}>
                <Button
                    icon={Icons.PlusOutlined({
                        Style: {
                            fontSize: "18px",
                            color: "#fbfdff",
                        }
                    })}
                    type="primary"
                    onClick={() => { setEmrView(<CreatePrescription pid={pid} setEmrView={setEmrView} patient={patient} setPadding={setPadding} />) }}
                >
                    New Prescription
                </Button>
                <Button style={{ width: "55px", marginLeft: "10%" }} onClick={backToPatientDetails} type="utility" icon={Icons.CloseOutlined({ Style: { color: "#000000" } })} />
            </div>
        )

        return () => {
            setComponentSupportContent(null)
            setPadding("0")
        }
    }, [])

    function CollapsePanel(prescription, id) {
        const IconMap = {
            tablet: Icons.medicineBox({})
        }

        const monthMap = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const dateModified_ = new Date(prescription["date_modified"])
        const endDate_ = new Date(prescription["end_date"])

        const dateModified = `${dateModified_.getDate()} ${monthMap[dateModified_.getMonth()]}, ${dateModified_.getFullYear()}`
        const endDate = `${endDate_.getDate()} ${monthMap[endDate_.getMonth()]}, ${endDate_.getFullYear()}`

        return (
            <Panel
                className="collapse-panel"
                header={
                    <div
                        className="prescriptions-list-item"
                    >
                        <div className="prescription-heading">
                            <span>{`${dateModified}  -  ${endDate}`}</span>
                        </div>
                        <div className="duplicate">
                            <Button
                                type="utility"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEmrView(<CreatePrescription pid={pid} setPadding={setPadding} setEmrView={setEmrView} patient={patient} prescription={prescription} medicinesList={createMenuData(prescription)} duplicate={true} />)
                                }}
                            >
                                Duplicate
                            </Button>
                        </div>
                        <div className="medicines">
                            <ul>
                                {prescription["drug"].map((medicine, id) => {
                                    if (id < 6) {
                                        return <li style={{ fontSize: "16px" }} key={id}>{medicine.drugName[0].toUpperCase() + medicine.drugName.slice(1, 13)}</li>
                                    }
                                })}
                                {prescription["drug"].length > 6 ? "..." : null}
                            </ul>
                        </div>
                    </div>
                }
                key={id}

            >
                <table style={{ width: "100%", }}>
                    {prescription["drug"].map((medicine, id) => {
                        return (
                            <Row key={id} className="tr" gutter={[24, 24]} style={{ width: "100%" }}>
                                <Col className="td" span={3} style={{ padding: "0.5rem 0" }}></Col>
                                <Col className="td" span={6} style={{ padding: "0.5rem 0", fontWeight: 500, color: "#525151" }}>{medicine.drugName.slice(0, 13)}</Col>
                                <Col className="td" span={15} style={{ padding: "0.5rem 0" }}>{`${medicine.dosage_morning || medicine.dosage_afternoon || medicine.dosage_evening} ${medicine.type} ${medicine.occurrence} for ${medicine.frequencyPeriod} ${medicine.frequency}`}</Col>
                            </Row>
                        )
                    })}

                </table>
            </Panel>
        )
    }

    return (
        <div style={{ height: "100%", background: "#fff" }}>
            {isLoading ? <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spin />
            </div>
                : (prescriptions.length > 0 ? (
                    <Collapse
                        className="prescription-list-collapse"
                        expandIconPosition="right"
                        style={{ overflowY: "scroll", padding: "1rem", maxHeight: "calc(80vh - 6rem)", margin: "0 2rem 0 2rem", background: "#fff" }}
                    // expandIcon={({ isActive }) => <CaretUpOutlined rotate={isActive ? 180 : 0} />}
                    // expandIcon={({ isActive }) => { Icons.upArrowFilled({ Style: { color: "#143765" }, rotate={ isActive? 180: 0 } }) }}

                    >
                        {prescriptions.map((prescription, id) => {
                            return CollapsePanel(prescription, id)
                        })}
                    </Collapse>
                ) : <div style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}><h1 style={{ margin: 0, fontSize: "87px", opacity: 0.15, padding: 0, color: "rgba(0, 0, 0, 0.85)", fontWeight: "500" }}>No Prescriptions</h1></div>)}
        </div>
    )
}
