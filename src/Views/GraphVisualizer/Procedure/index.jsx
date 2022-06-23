import React, { useState, useEffect } from 'react';

import { Input, notification, Spin, Tooltip } from 'antd';
import patientApi from '../../../Apis/patientApis';
import moment from 'moment';

const Procedure = ({ pid }) => {
    const [procedure, setProcedure] = useState({
        loading: false,
        data: [],
    });

    useEffect(() => {
        patientApi.getPatientProcedure(pid).then((res) => {
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
    }, [pid]);

    console.log("procedure", procedure);
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
                                <Tooltip title={item?.label}>
                                    <div style={{ width: "0.85rem", height: "0.85rem", borderRadius: "50%", background: "green" }}></div>
                                </Tooltip>
                            </div>
                            <div style={{ marginLeft: "1rem", fontSize: "0.9rem", color: "#000000c7" }}>
                                <div>
                                    <span style={{ color: "#000", marginRight: "3px" }}>Date: </span>
                                    {moment(item?.date).format("MMM DD YYYY")}
                                </div>
                                <div>
                                    <div>
                                        <span style={{ color: "#000", marginRight: "3px" }}>Code: </span>
                                        {item?.code_type}
                                    </div>
                                    <div style={{ marginLeft: "2rem" }}>
                                        <span style={{ color: "#000", marginRight: "3px" }}>Status: </span>
                                        {item?.status}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: "#000", marginRight: "3px" }}>Procedure: </span>
                                    {item?.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Procedure;
