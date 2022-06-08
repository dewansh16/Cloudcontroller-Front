import React from 'react';
import moment from "moment";

import { Button as CusBtn } from "../../../../Theme/Components/Button/button";

const TaskTable = (props) => {
    const { 
        addTask, dataTable, setAddTaskState, startCountTimer, renderTimerClock, 
        disabledBtnAdd = false, CPT_CODE 
    } = props;

    let {timeCount = 0} = props;
    const renderTimeDisplay = (time) => {
        let hours = Math.floor(time / 3600)
        let minutes = Math.floor(time / 60) % 60
        let seconds = time % 60
        let timeDs = [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        return timeDs;
    }

    return (
        <div
            style={addTask ? { filter: "blur(4px)" } : null}
            className="bm-twenty-bottom-container"
        >
            <div className="bm-twenty-header">Tasks</div>

            {dataTable.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "85%",
                        width: "100%",
                    }}
                >
                    <div style={{ margin: "2%" }}>
                        No tasks updated or scheduled yet
                    </div>
                    <CusBtn
                        onClick={() => {
                            timeCount = 0;
                            setAddTaskState(true);
                            startCountTimer('add-task-timer');
                        }}
                        className="primary"
                    >
                        Add
                    </CusBtn>
                </div>
            ) : (
                <div className="bm-sensor-bottom-container">
                    <div className="bm-sensor-bottom-header title-table">Task</div>
                    <div className="bm-sensor-bottom-table-header">
                        <div className="bm-item-header" style={{ width: "20%" }}>Date</div>
                        <div className="bm-item-header" style={{ width: "30%" }}>Staff Name</div>
                        <div className="bm-item-header" style={{ width: "30%" }}>Note</div>
                        <div className="bm-item-header" style={{ width: "20%" }}>Time Spent</div>
                    </div>
                    <div style={{ overflowY: "scroll", height: "calc(100% - 10.5rem)", marginRight: "-6px" }}>
                        {dataTable.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    height: "auto",
                                    fontSize: "1rem",
                                    background: "#ffb300c2",
                                    margin: "0.5% 0%",
                                    paddingTop: "0.5rem",
                                    paddingBottom: "0.5rem"
                                }}
                            >
                                <div className="bm-item-body" style={{ width: "20%" }}>
                                    {moment(item["task_date"]).format("YYYY-MM-DD")}
                                </div>
                                <div className="bm-item-body" style={{ width: "30%" }}>
                                    {item["staff_name"]}
                                </div>
                                <div className="bm-item-body" style={{ width: "30%" }}>
                                    {item["task_note"]}
                                </div>
                                <div className="bm-item-body" style={{ width: "20%" }}>
                                    <span style={{ paddingRight: "10px" }} id={`item-${CPT_CODE}-time-spent-${item.task_id}`}>
                                        {`${renderTimeDisplay(item['task_time_spend'])}`}
                                    </span>
                                    {renderTimerClock(item, CPT_CODE, disabledBtnAdd)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {dataTable.length !== 0 ? (
                <div
                    style={addTask ? { filter: "blur(4px)" } : null}
                    className="bm-bottom-add-btn"
                >
                    <CusBtn
                        onClick={() => {
                            timeCount = 0;
                            setAddTaskState(true);
                            startCountTimer('add-task-timer');
                        }}
                        style={{ padding: "1% 5%" }}
                        disabled={disabledBtnAdd}
                    >
                        Add
                    </CusBtn>
                </div>
            ) : null}
        </div>
    );
}

export default TaskTable;
