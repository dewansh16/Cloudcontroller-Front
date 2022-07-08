import React, { useState, useEffect } from 'react'
import './reports.css'

import { Button } from '../../../Theme/Components/Button/button'

import internalApi from '../../../Apis/internalApis';
import Icons from '../../../Utils/iconMap'
import { useHistory } from 'react-router-dom'


import { Upload, message, Spin, Input, notification } from 'antd';
import { InboxOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { TextArea } = Input;


function Reports({ pid, pdata, setComponentSupportContent }) {

    const [fileList, setFileList] = useState([])
    const [uploadTypeList, setUploadTypeList] = useState({})

    const [reviewState, setReviewState] = useState(false)
    const [reportDataLoading, setReportDataLoading] = useState(false)

    const [reportData, setReportData] = useState('')

    const [viewDataLoading, setViewDataLoading] = useState(true)
    const [viewData, setViewData] = useState([])

    const [selectedReportData, setSelectedReportData] = useState({})
    const [reportInfoState, setReportInfoState] = useState(false)
    const [selectedDateStr, setSelectedDateStr] = useState('')

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
            return {
                fileList,
            };
        },
        onChange: (file) => {
            console.log("file", file);
            setFileList(file?.fileList || []);
            return false;
        },
        beforeUpload: (file) => {
            // const id = file.uid;
            // setUploadTypeList({
            //     ...uploadTypeList,
            //     [file.uid]: ["Note"],
            // });
            // setFileList([...fileList, file]);
            message.success(`${file.name} File Uploaded Successfully`);
            return false;
        },
        fileList,
    };

    const [reportAddState, setReportAddState] = useState(true)

    function handleUpload() {
        if (fileList.length > 0) {
            fileList.map((item, index) => {
                const formData = new FormData();
                formData.append("file", item);
                
                internalApi
                    .addReport(formData, pid, pdata.demographic_map.tenant_id)
                    .then((res) => {
                        setReportData(res.data.response.Report)
                        setReportDataLoading(false)
                        setReviewState(true)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });
        }
    }

    function handleReportSave() {
        internalApi.saveReport(
            {
                "report": [reportData],
                "tenant_id": pdata.demographic_map.tenant_id
            }
        )
            .then(res => {
                console.log(res)
                notification.success({
                    message: 'Lab Report Saved',
                });
                setReviewState(false)
                setFileList([])
            })
            .catch(err => { console.log(err) })
    }

    function handleViewClick() {
        internalApi.getReports()
            .then(res => { 
                console.log(res.data.response); 
                setViewData(res.data.response.Lab_Report.reverse()); 
                setViewDataLoading(false) 
            })
            .catch(err => { console.log(err) })
    }

    function handleReportInfo(item, date_str) {
        setSelectedReportData(item)
        setReportInfoState(true)
        setSelectedDateStr(date_str)
    }

    let history = useHistory();
    const backToPatientDetails = () => {
        history.push(`/dashboard/patient/details/${pid}`)
    }

    useEffect(() => {
        setComponentSupportContent(
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button style={{ width: "55px" }} onClick={backToPatientDetails} type="utility" icon={Icons.CloseOutlined({ Style: { color: "#000000" } })} />
            </div>
        )
    }, [])

    return (
        <div style={{ height: 'calc(100% - 30px)', width: '100%', position: 'relative' }}>
            {
                reportInfoState
                    ?
                    (
                        <div className="report-info-data-container" >
                            <div style={{ width: '100%', textAlign: 'right' }} >
                                <Button className="secondary" onClick={() => { setReportInfoState(false) }} >
                                    <CloseOutlined />
                                </Button>
                            </div>
                            <div style={{ fontSize: '1rem', marginBottom: '2%' }} >
                                {
                                    selectedDateStr
                                }
                            </div>
                            <div style={{ fontSize: '1.7rem', marginBottom: '1%', color: 'orange' }} >
                                Lab Report Content
                            </div>
                            <div style={{ fontSize: '1.2rem', height: '75%', overflowY: 'scroll' }} >
                                {
                                    selectedReportData.report
                                }
                            </div>
                        </div>
                    )
                    :
                    null
            }

            <div className="report-switch" >
                <div
                    onClick={() => { setReportAddState(true) }}
                    className="report-switch-item"
                    style={reportAddState ? { backgroundColor: 'white', color: 'black' } : null} >
                    Add
                </div>
                <div
                    onClick={() => { setReportAddState(false); handleViewClick() }}
                    className="report-switch-item"
                    style={!reportAddState ? { backgroundColor: 'white', color: 'black' } : null} >
                    View
                </div>
            </div>

            {
                reportAddState
                    ?
                    (
                        !reviewState
                            ?
                            (
                                reportDataLoading
                                    ?
                                    (
                                        <div style={{ height: '80%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                            <Spin />
                                        </div>
                                    )
                                    :
                                    (
                                        <div>
                                            <div className="report-uploader-container" >
                                                <Dragger {...props} showUploadList={true} multiple={true}>
                                                    <p className="ant-upload-drag-icon">
                                                        <InboxOutlined />
                                                    </p>
                                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                    {/* <p className="ant-upload-hint">
                                                    Support for a single or bulk upload.
                                                </p> */}
                                                </Dragger>
                                            </div>
                                            {
                                                fileList.length !== 0
                                                    ?
                                                    (
                                                        <div style={{ textAlign: 'center' }} >
                                                            <Button 
                                                                style={{
                                                                    padding: "0.3rem 1rem",
                                                                    marginTop: "6px"
                                                                }}
                                                                onClick={() => { setReportDataLoading(true); handleUpload() }} 
                                                                className="primary"
                                                            >
                                                                Review
                                                            </Button>
                                                        </div>
                                                    )
                                                    :
                                                    null
                                            }
                                        </div>
                                    )
                            )
                            :
                            (
                                <div style={{ height: '87%', width: '100%' }} >
                                    <div style={{ height: "80%", margin: "2%", overflowY: "scroll" }} >
                                        <TextArea defaultValue={reportData} autoSize={{ minRows: 15, maxRows: 15 }} style={{ fontSize: '1rem' }} />
                                    </div>
                                    <div style={{ textAlign: 'center' }} >
                                        <Button onClick={() => { handleReportSave() }} className="primary" >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            )
                    )
                    :
                    (
                        viewDataLoading
                            ?
                            (
                                <div style={{ height: '80%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <Spin />
                                </div>
                            )
                            :
                            (
                                <div style={{ height: '494px', width: '100%', marginTop: '2%', overflowY: 'scroll' }} >
                                    {
                                        viewData.map((item, index) => {
                                            if (item.tenant_id === pdata.demographic_map.tenant_id) {
                                                var temp_date = new Date(item.date)
                                                var date_str = `${temp_date.toDateString()} ${temp_date.getHours() < 10 ? '0' : ''}${temp_date.getHours()}:${temp_date.getMinutes() < 10 ? '0' : ''}${temp_date.getMinutes()}:${temp_date.getSeconds() < 10 ? '0' : ''}${temp_date.getSeconds()}`
                                                return (
                                                    <div className="labreport-list-item" key={index} >
                                                        {date_str}
                                                        <Button onClick={() => { handleReportInfo(item, date_str) }} className='secondary' >
                                                            {/* <InfoCircleOutlined /> */}
                                                            View
                                                        </Button>
                                                        {/* <Button onClick={() => { handleReportInfo(item, date_str) }} className='secondary' >
                                                            <InfoCircleOutlined />
                                                        </Button> */}
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                    )
            }
        </div>
    )
}

export default Reports
