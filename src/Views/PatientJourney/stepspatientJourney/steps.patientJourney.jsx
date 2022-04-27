import { Empty } from "antd";
import React, { useState, useEffect } from "react";
import { Button } from "../../../Theme/Components/Button/button";
import Icons from "../../../Utils/iconMap";

function Steps({
    stepArray,
    activeStep,
    setActiveStep,
    setStepArray,
    durationArray,
    setDurationArray,
}) {
    const [stepToShow, setStepToShow] = useState(stepArray);
    const [updateArray, setUpdateArray] = useState(true);

    useEffect(() => {
        setStepToShow(stepArray);
    }, [updateArray, stepArray]);
    
    const stepButtonStyle = {
        height: "72px",
        padding: "0px",
        width: "100%",
        borderRadius: "0px 49px 49px 0px",
        paddingLeft: "10%",
    };

    const stepButtonStyleSuccess = {
        height: "72px",
        padding: "0px",
        width: "100%",
        borderRadius: "0px 49px 49px 0px",
        paddingLeft: "10%",
        background: "rgba(218, 253, 217, 0.51)",
    };

    const stepButtonStyleDanger = {
        height: "72px",
        padding: "0px",
        width: "100%",
        borderRadius: "0px 49px 49px 0px",
        paddingLeft: "10%",
        background: "rgba(248, 116, 116, 0.22)",
    };

    const configButtonStyle = (index) => {
        if (index === activeStep || index === activeStep + 1) {
            return stepButtonStyleSuccess;
        } else {
            return stepButtonStyle;
        }
    };

    return (
        <>
            {stepToShow.length > 0 ? (
                <div style={{ height: "100%", overflow: "auto" }}>
                    <div className="insteps-patches-info">
                        <div>
                            <p>{durationArray[0]?.name}</p>
                            <p>{durationArray[0]?.time}</p>
                        </div>
                        <Button
                            type="secondary"
                            onClick={() => {
                                const newStepArray = stepArray;
                                const newDurationArray = durationArray;
                                newDurationArray.reverse();
                                newStepArray.reverse();
                                setActiveStep(stepArray.length - 1 - activeStep);
                                setStepArray(newStepArray);
                                setUpdateArray(!updateArray);
                                setDurationArray(newDurationArray);
                            }}
                        >
                            {Icons.reverseIcon({})}
                        </Button>
                    </div>
                    {stepToShow.map((item, index) => {
                        return (
                            <div key={index} className="journey-step-box">
                                <div className="step-left-box">
                                    {stepArray[activeStep] === item
                                        ? Icons.locationTag({
                                            Style: { width: "20px", height: "20px" },
                                        })
                                        : null}
                                </div>
                                <div className="step-right-box">
                                    <div className="dot-icon-box">{Icons.greenDotIcon({})}</div>
                                    <div className="step-right-box-content">
                                        <Button
                                            type="text"
                                            style={configButtonStyle(index)}
                                            onClick={() => {
                                                setActiveStep(index);
                                            }}
                                        >
                                            <div>
                                                <h1>{item.name}</h1>
                                                <p>
                                                    {"Floor: " + (item.location?.floor || "N/A")}
                                                    {", Ward: " + (item.location?.ward || "N/A")}
                                                    {", Bed: " + (item.bedNo || "N/A")}
                                                </p>
                                                <p>
                                                    {item.entryDate} | {item.entryTime}
                                                </p>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ marginTop: "3%" }} className="insteps-patches-info">
                        <div>
                            <p>{durationArray[1]?.name}</p>
                            <p>{durationArray[1]?.time}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ height: "100%", overflow: "auto" }}>
                    <div className="empty-step-div">
                        <p>No Data to Show</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Steps;
