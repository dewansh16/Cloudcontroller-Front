import moment from 'moment';
import React from 'react';
import getAge from '../../../../Utils/getAge';

import "./styles.css";

const PatientInfo = ({ patient }) => {
    console.log("patient", patient);
    const demographic_map = patient?.demographic_map || {};
    const { 
        DOB = "", sex = "", admission_date = "", discharge_date = "", phone_contact = "",
        street = "", city = "", state = "", country_name = "",
        primary_consultant = [], secondary_consultant = [],
        guardiansname = "", guardianphone = ""
    } = demographic_map;

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    function dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    return (
        <div className='gv-bottom-left-container patient-information' style={{ height: "100%" }}>
            <div className='box-item-info'>
                <div className="info-title">- Demographics</div>
                <div className="info-content">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "2rem" }}>
                            <span className="content-label">+ Age: </span>
                            <span className="content-value">
                                {getAge(new Date(), new Date(DOB))}
                            </span>
                        </div>
                        <div>
                            <span className="content-label">+ Gender: </span>
                            <span className="content-value" style={{ textTransform: "capitalize" }}>
                                {sex.slice(0, 7) || " Male"}
                            </span>
                        </div>
                    </div>
                    {!!phone_contact && (
                        <div>
                            <span className="content-label">+ Phone: </span>
                            <span className="content-value">{phone_contact}</span>
                        </div>
                    )}
                    <div>
                        <span className="content-label">+ Birth Date: </span>
                        <span className="content-value">{moment(DOB).format("MMM DD YYYY")}</span>
                    </div>
                    <div>
                        <span className="content-label">+ Admitted On: </span>
                        <span className="content-value">{moment(admission_date).format("MMM DD YYYY")}</span>
                    </div>
                    <div>
                        <span className="content-label">+ Admitted For: </span>
                        <span className="content-value">
                            {dateDiffInDays(
                                new Date(admission_date),
                                !!discharge_date
                                    ? new Date(discharge_date)
                                    : new Date()
                            )}
                        </span>
                    </div>
                  
                </div>
            </div>
            
            {(street || city || state || country_name) && (
                <div className='box-item-info'>
                    <div className="info-title">- Address</div>
                    <div className="info-content">
                        <span className="content-value">
                            {`+ ${street || ""} ${city || ""} ${state || ""} ${country_name || ""}`}
                        </span>
                    </div>
                </div>
            )} 

            {(primary_consultant?.length > 0 || secondary_consultant?.length > 0) && (
                <div className='box-item-info'>
                    <div className="info-title">- Practitioners</div>
                    <div className="info-content">
                        {primary_consultant?.length > 0 && (
                            <div>
                                <span className="content-label">+ Primary consultant: </span>
                                {primary_consultant?.map((item, index) => (
                                    <div 
                                        key={`${index}-primary_consultant`} 
                                        className="content-value" 
                                        style={{ marginLeft: "1rem" }}
                                    >
                                        <span className="content-label">{`${index + 1}: `}</span>
                                        {`${item?.fname || ""} ${item?.lname || ""}`}
                                    </div>
                                ))}
                            </div>
                        )}
                        {secondary_consultant?.length > 0 && (
                            <div>
                                <span className="content-label">+ Secondary consultant: </span>
                                {secondary_consultant?.map((item, index) => (
                                    <div 
                                        key={`${index}-secondary_consultant`} 
                                        className="content-value" 
                                        style={{ marginLeft: "1rem" }}
                                    >
                                        <span className="content-label">{`${index + 1}: `}</span>
                                        {`${item?.fname || ""} ${item?.lname || ""}`}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(!!guardiansname || !!guardianphone) && (
                <div className='box-item-info'>
                    <div className="info-title">- Guardian</div>
                    <div className="info-content">
                        {!!guardiansname && (
                            <div>
                                <span className="content-label">+ Name: </span>
                                <span className="content-value">{guardiansname}</span>
                            </div>
                        )}
                        {!!guardianphone && (
                            <div>
                                <span className="content-label">+ Phone: </span>
                                <span className="content-value">{guardianphone}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* <div>
                <div className="info-title">- Location</div>
                <div className="info-content">
                    {!!guardiansname && (
                        <div>
                            <span className="content-label">+ Name: </span>
                            <span className="content-value">{guardiansname}</span>
                        </div>
                    )}
                    {!!guardianphone && (
                        <div>
                            <span className="content-label">+ Phone: </span>
                            <span className="content-value">{guardianphone}</span>
                        </div>
                    )}
                </div>
            </div> */}
        </div>
    );
}

export default PatientInfo;
