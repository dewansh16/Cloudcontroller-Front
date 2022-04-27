import React, { useEffect, useState } from 'react'
import { Button } from 'antd';
import './PrescriptionList.css'

export default function Prescription(props) {
    const [prescriptionHeading, setPrescriptionHeading] = useState(props.prescriptionHeading);

    // 
    const [prescriptionDate, setPrescriptionDate] = useState(props.prescriptionDate)


    // prescriptionMedicineList
    const [prescriptionMedicine, setPrescriptionMedicine] = useState(props.prescriptionMedicine)
    useEffect(() => {
        setPrescriptionHeading()
        setPrescriptionDate()
        setPrescriptionMedicine()
    }, [])
    return (

        <div className="prescription-list">
            <div className="prescriptionDetails">
                <div className="detailsContainer">
                    <p className="prescriptionHeading">{prescriptionHeading}</p>
                    <span>{prescriptionDate[0]} - {prescriptionDate[1]}</span>
                </div>
            </div>
            <div className="prescriptionMedicines">
                <ul>
                    {prescriptionMedicine.map((medicine, key) => {
                        return <li key={key}>{medicine}</li>
                    })}
                </ul>
            </div>
            <div className="pop-up">

                <Button
                    className="prescriptionListButton"
                    style={{
                        height: "51px",
                        background: "#FFFFFF",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        boxSizing: "border-box",
                        boxShadow: "0px 0px 20px 5px rgba(20, 121, 255, 0.05)",
                        borderRadius: "6px",
                        color: "#1f1f1f"
                    }}
                >
                    Duplicate
                </Button>
            </div>
        </div>

    )
}
