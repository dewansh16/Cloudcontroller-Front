import React from 'react';
import { useParams, useHistory, useLocation } from "react-router-dom";

import moment from "moment";
import { DatePicker } from "antd";
import { Button as CusBtn } from "../../../../Theme/Components/Button/button";

const Header = (props) => {
    const { addTask, currentDate, onChangeDate } = props;

    const pid = useParams().pid;
    const location = useLocation();
    const history = useHistory();

    function placeDatePicker(width) {
        let defaultDate = moment();
        if (currentDate) {
            if (currentDate.split('-').length < 2) {
                defaultDate = moment(`${currentDate}-02`, "YYYY-MM-DD");
            } else {
                defaultDate = moment(currentDate, "YYYY-MM-DD");
            }
        }

        if (width) {
            return (
                <DatePicker
                    onChange={onChangeDate}
                    defaultValue={defaultDate}
                    picker="month"
                    style={{ marginRight: "5%", width: width, height: "3.25rem", minWidth: "10rem" }}
                />
            );
        } else {
            return (
                <DatePicker
                    onChange={onChangeDate}
                    defaultValue={defaultDate}
                    picker="month"
                    style={{ marginRight: "5%", width: "15%", height: "3.25rem", minWidth: "10rem" }}
                />
            );
        }
    }

    return (
        <div
            style={
                addTask
                    ? {
                        filter: "blur(4px)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        height: "5.5rem",
                    }
                    : {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        height: "5.5rem",
                    }
            }
        >
            <CusBtn
                onClick={() => {
                    history.push(
                        `/dashboard/patient/details/${pid}`
                    );
                }}
                className="secondary"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "1rem 5%",
                }}
            >
                <div
                    className="gv-patient-name"
                    style={{ fontSize: "1.4rem" }}
                >
                    {location.state
                        ? location.state.name
                        : history.push(`/dashboard/patient/details/${pid}`)}
                </div>
                <div
                    className="gv-patient-mr"
                    style={{ fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.5)" }}
                >
                    {"MR: "}
                    {location.state
                        ? location.state.mr
                        : history.push(`/dashboard/patient/details/${pid}`)}
                </div>
            </CusBtn>

            {placeDatePicker()}
        </div>
    );
}

export default Header;
