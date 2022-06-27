import React, { useState, useEffect } from 'react';

import { Input, notification, Spin, Tooltip } from 'antd';
import patientApi from '../../../Apis/patientApis';
import moment from 'moment';

const Procedure = ({ pid, date }) => {
    const [procedure, setProcedure] = useState({
        loading: false,
        data: [],
    });

    useEffect(() => {
        patientApi.getPatientProcedure(pid, "", "", "", moment(date).format("YYYY-MM-DD")).then((res) => {
            setProcedure({
                loading: false,
                data: res.data.response['procedure_list']
            });
        }).catch((err) => {
            console.log(err)
            if (err) {
                notification.error({
                    message: 'Error',
                    description: `${err.response?.data.result}` || ""
                })
                setProcedure({
                    loading: false,
                    data: []
                });
            }
        })
    }, [pid, date]);

    return (
        <>
            {procedure.loading ? (
                <div style={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Spin />
                </div>
            ) :
            (
                <div style={{ 
                    padding: "0 1.5rem",
                    height: "78%",
                    overflow: "auto"
                }}>
                    {procedure?.data?.map((item, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                display: "flex", alignItems: "center",
                                border: "1px solid #c3d6b9",
                                borderRadius: "10px",
                                padding: "0.5rem 1rem", 
                                marginBottom: "1rem"
                            }}
                        >
                            <div>
                                <Tooltip title={item?.status || "complete"}>
                                    <div style={{ 
                                        width: "0.85rem", height: "0.85rem", 
                                        borderRadius: "50%", 
                                        background: item?.status === "incomplete" ? "orange" : "green" 
                                    }}></div>
                                </Tooltip>
                            </div>
                            <div style={{ marginLeft: "1rem", fontSize: "0.9rem", color: "#000", width: "100%" }}>
                                <div>
                                    <span style={{ color: "#000000c7", marginRight: "3px" }}>Date: </span>
                                    {moment(item?.date).format("MMM DD YYYY")}
                                </div>
                                <div style={{ display: "flex", alignItems:"center" }}>
                                    {!!item?.code_type && (
                                        <div style={{ marginRight: "2rem", width: "60%" }}>
                                            <span style={{ color: "#000000c7", marginRight: "3px" }}>Code: </span>
                                            <span>{item?.code_type}</span>
                                        </div>
                                    )}
                                    <div style={{ width: "40%" }}>
                                        <span style={{ color: "#000000c7", marginRight: "3px" }}>Label: </span>
                                        {item?.label || "Normal"}
                                    </div>
                                </div>
                                {!!item?.description && (
                                    <div>
                                        <span style={{ color: "#000000c7", marginRight: "3px" }}>Procedure: </span>
                                        {item?.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Procedure;
