import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import ExpandedMenu from '../../Theme/Components/Menu/Expanded/menu'
import notification from 'antd/lib/notification'
import patientApi from '../../Apis/patientApis'
import './emr.css'

import Spin from 'antd/lib/spin'

// EMR Components
import Prescriptions from './Prescriptions/prescriptions'
import Vitals from './Vitals/vitals'
import MedicalHistory from './MedicalHistory/medicalHistory'
import Allergy from './Allergy/allergy'
import Procedure from './Procedure/procedure'
import Reports from './Reports/Reports'


export function createName(title, firstName, middleName, lastName) {
    const name = `${title} ${firstName ? firstName + " " : ""}${middleName ? middleName + " " : ""}${lastName ? lastName : ""}`
    return name.slice(0, 9)
}

function ContactAdmin() {
    return (
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ fontSize: "6rem", opacity: "0.1", margin: "0", padding: "0" }}>Feature Disabled</h1>
            <p style={{ fontSize: "2rem", margin: "0", padding: "0" }}>Contact admin to enable this feature</p>
        </div>
    )
}

function FetchDetails(pid) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        patientApi.getPatientData(pid).then((res) => {
            setResponse(res.data.response.patients[0])
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

export function EmrView({ pid, setEmrView, setPadding, defaultState = "subgroup-2-element-2" }) {

    const [patient, isLoading] = FetchDetails(pid);

    const menuData = [
        {
            header: "information",
            visible: true,
            elements: [
                {
                    title: "Medical History",
                    disabled: false,
                },
                {
                    title: "Vitals",
                    disabled: false,
                },
                {
                    title: "Allergy",
                    disabled: false,
                },
                {
                    title: "Lab Reports",
                    disabled: false,
                },
                {
                    title: "Lifestyle",
                    disabled: true,
                },
                {
                    title: "Family History",
                    disabled: true,
                },
                {
                    title: "Past Illness",
                    disabled: true,
                }
            ]
        },
        {
            header: null,
            visible: true,
            elements: [
                {
                    title: "Hospitalization",
                    disabled: true,
                },
                {
                    title: "Procedures",
                    disabled: false,
                },
                {
                    title: "Preventive Care",
                    disabled: true,
                }
            ]
        },
        {
            header: "medication",
            visible: true,
            elements: [
                {
                    title: "Prescriptions",
                    disabled: false,
                },
                {
                    title: "Immunization",
                    disabled: true,
                },
                {
                    title: "Labs",
                    disabled: true,
                }
            ]
        },
    ]

    const [currentState, setCurrentState] = useState(defaultState);
    const [componentSupportContent, setComponentSupportContent] = useState(null);

    const componentList = {
        "subgroup-1-element-1": <MedicalHistory pid={pid} setComponentSupportContent={setComponentSupportContent} setPadding={setPadding} setEmrView={setEmrView} />,
        "subgroup-1-element-2": <Vitals pid={pid} setComponentSupportContent={setComponentSupportContent} setEmrView={setEmrView} patient={patient} />,
        "subgroup-1-element-3": <Allergy pid={pid} setComponentSupportContent={setComponentSupportContent} setPadding={setPadding} setEmrView={setEmrView} />,
        "subgroup-1-element-4": <Reports pid={pid} pdata={FetchDetails(pid)[0]} setComponentSupportContent={setComponentSupportContent} setPadding={setPadding} setEmrView={setEmrView} />,
        "subgroup-1-element-5": ContactAdmin(),
        "subgroup-1-element-6": ContactAdmin(),
        "subgroup-2-element-1": ContactAdmin(),
        "subgroup-2-element-2": <Procedure pid={pid} setComponentSupportContent={setComponentSupportContent} setPadding={setPadding} setEmrView={setEmrView} />,
        "subgroup-2-element-3": ContactAdmin(),
        "subgroup-3-element-1": <Prescriptions pid={pid} setComponentSupportContent={setComponentSupportContent} setEmrView={setEmrView} setPadding={setPadding} patient={patient} />,
        "subgroup-3-element-2": ContactAdmin(),
        "subgroup-3-element-3": ContactAdmin(),
    }

    useEffect(() => {
        setPadding("1.5rem")
    })

    return (
        patient === null ? <Spin /> : (
            <div className="emr-container">
                <ExpandedMenu defaultState={defaultState} setCurrentState={setCurrentState} menuData={menuData} className="emr-menu" />
                <div className="emr-header">
                    <div className="user-info">
                        <h1>
                            {createName(patient["demographic_map"]["title"], patient["demographic_map"]["fname"], patient["demographic_map"]["mname"], patient["demographic_map"]["lname"])}
                        </h1>
                        <span>
                            MR{patient !== null ? `${patient["demographic_map"]["med_record"]}` : null}
                        </span>
                    </div>

                    {/* 
                        use this class to add content to the top
                    */}
                    <div className="body-support-content">{componentSupportContent}</div>
                </div>
                <div className="emr-body" >
                    {componentList[currentState]}
                </div>

            </div>
        )

    )
}

export default function EMR() {
    const { pid } = useParams()
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();




    const [emrView, setEmrView] = useState(null)
    const [padding, setPadding] = useState("3rem")


    useEffect(() => {
        // setEmrView(<EmrView pid={pid} setEmrView={setEmrView} setPadding={setPadding} defaultState={query.get("pos")} />)
        setEmrView(<EmrView pid={pid} setEmrView={setEmrView} setPadding={setPadding} />)
        setPadding("3rem")
    }, [pid])

    return (
        <div style={{
            height: "100%",
            width: "100%",
            margin: "0",
            padding: padding,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
        }}>
            {emrView}
        </div>
    )
}
