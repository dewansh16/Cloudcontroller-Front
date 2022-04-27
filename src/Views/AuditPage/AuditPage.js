import React, { useState, useEffect } from 'react'
import { GiBackwardTime } from 'react-icons/gi'
import { BsBookmark } from 'react-icons/bs'
// import { AiFillPushpin } from 'react-icons/ai'
import { FcBookmark } from 'react-icons/fc'
import { Menu, Dropdown, Button, Spin, Checkbox } from 'antd';
import { SearchOutlined, SyncOutlined, DownloadOutlined, DownOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Button as CustBtn } from '../../Theme/Components/Button/button'
import auditApi from '../../Apis/auditApis'
import moment from 'moment';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { CSVLink } from "react-csv";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import './auditPage.css'

import { DatePicker, Input } from 'antd'
// const { RangePicker } = DatePicker
const { Search } = Input;


var data = [

    {
        "name": "12 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "1 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "2 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "3 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "4 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "5 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "6 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "7 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "8 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "9 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "10 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "11 am",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "12 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "1 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "2 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "3 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "4 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "5 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "6 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "7 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "8 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "9 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "10 pm",
        "audit_num": 0,
        "audits": [],
    },
    {
        "name": "11 pm",
        "audit_num": 0,
        "audits": [],
    },

]

const headers = [
    { label: "Created At", key: "createdAt" },
    { label: "ID", key: "id" },
    { label: "PID", key: "pid" },
    { label: "Request Body", key: "req_bosy" },
    { label: "Route", key: "route" },
    { label: "Route String", key: "route_str" },
    { label: "Response Body", key: "rsp_body" },
    { label: "Response Code", key: "rsp_code" },
    { label: "Tenant", key: "tenant" },
    { label: "Updated At", key: "updatedAt" },
    { label: "User Email", key: "user_email" },
    { label: "User Role", key: "user_role" },
    { label: "Verb", key: "Deleted" },
]


function AuditPage() {

    const [activeBar, setActiveBar] = useState(-1)
    const [loading, setLoading] = useState(true)

    const [roleMenu, setRoleMenu] = useState()
    const [userMenu, setUserMenu] = useState()

    const [currentRole, setCurrentRole] = useState('Filter by Role')
    const [currentUser, setCurrentUser] = useState('Filter by User')

    const [currentFromDateString, setCurrentFromDateString] = useState('')
    const [currentToDateString, setCurrentToDateString] = useState('')

    const [totalAudits, setTotalAudits] = useState(0)
    const [updatedAudits, setUpdatedAudits] = useState(0)
    const [deletedAudits, setDeletedAudits] = useState(0)
    const [accessedAudits, setAccessedAudits] = useState(0)

    const [completeAuditLog, setCompleteAuditLog] = useState([])

    const [auditInfoState, setAuditInfoState] = useState(false)

    const [currentSelectedAuditInfo, setCurrentSelectedAuditInfo] = useState({})

    const [jsonDiffData, setJsonDiffData] = useState([])

    const [jsonDiffState, setJsonDiffState] = useState(false)

    const [searchAuditState, setSearchAuditState] = useState('')

    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {
        var today = new Date()
        var yesterday = new Date(today)
        // yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0)
        yesterday.setMinutes(0)
        yesterday.setSeconds(0)

        var from = yesterday.toISOString()
        var to = today.toISOString()

        setCurrentFromDateString(`${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`)
        setCurrentToDateString(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)

        getDataForDateChange(from, to)

    }, [])

    function getDataForDateChange(from, to) {
        auditApi.getAudit(from, to)
            .then(res => {
                console.log("RESPONSE FROM API", res.data.response)
                var users = []
                var roles = []

                setTotalAudits(res.data.response.auditLog.length)
                var temp_audit_updated = 0
                var temp_audit_deleted = 0
                var temp_audit_accessed = 0

                setCompleteAuditLog(res.data.response.auditLog)

                res.data.response.auditLog.map(item => {
                    if (item.user_role && !roles.includes(item.user_role)) {
                        roles.push(item.user_role)
                    }
                    if (item.user_email && !users.includes(item.user_email)) {
                        users.push(item.user_email)
                    }

                    if (item.verb === 'post' || item.verb === 'put') {
                        temp_audit_updated = temp_audit_updated + 1
                    }
                    else if (item.verb === 'delete') {
                        temp_audit_deleted = temp_audit_deleted + 1
                    }
                    else if (item.verb === 'get') {
                        temp_audit_accessed = temp_audit_accessed + 1
                    }


                    data.map(ele => {
                        var item_date = new Date(item.createdAt)
                        var item_hrs = item_date.getHours()

                        var item_hrs_str = `${item_hrs <= 12 ? item_hrs : item_hrs - 12} ${item_hrs < 12 ? 'am' : 'pm'}`

                        console.log("ELE/Hrs: ", ele.name, item_hrs_str)

                        if (ele.name === item_hrs_str) {
                            ele.audit_num = ele.audit_num + 1
                            ele.audits.push(item)
                        }
                    })


                })

                setUpdatedAudits(temp_audit_updated)
                setDeletedAudits(temp_audit_deleted)
                setAccessedAudits(temp_audit_accessed)

                populateRolesUsersMenu(roles, users)
                console.log(data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function populateRolesUsersMenu(roles, users) {
        setRoleMenu(
            <Menu onClick={(payload) => {
                if (payload.key === '1') {
                    setCurrentRole('Filter by Role')
                }
                else {
                    setCurrentRole(payload.key)
                }
            }} >
                <Menu.Item key="1">
                    None
                </Menu.Item>
                {
                    roles.map(item => (
                        <Menu.Item key={item}>
                            {item}
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
        setUserMenu(
            <Menu onClick={(payload) => {
                if (payload.key === '1') {
                    setCurrentUser('Filter by User')
                }
                else {
                    setCurrentUser(payload.key)
                }
            }} >
                <Menu.Item key="1">
                    None
                </Menu.Item>
                {
                    users.map(item => (
                        <Menu.Item key={item}>
                            {item}
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
    }

    function handleDateChange(value, dateString) {
        var temp_from = dateString.replace(/\//g, "-")
        var temp_to = dateString.replace(/\//g, "-")
        setCurrentFromDateString(temp_from)
        setCurrentToDateString(temp_to)
        setLoading(true)
        var temp_from_iso = new Date(temp_from)
        var temp_to_iso = new Date(temp_to)
        temp_from_iso.setHours(0)
        temp_from_iso.setMinutes(0)
        temp_from_iso.setSeconds(0)
        temp_to_iso.setHours(23)
        temp_to_iso.setMinutes(59)
        temp_to_iso.setSeconds(59)
        getDataForDateChange(temp_from_iso.toISOString(), temp_to_iso.toISOString())
        data = [
            {
                "name": "12 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "1 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "2 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "3 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "4 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "5 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "6 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "7 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "8 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "9 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "10 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "11 am",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "12 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "1 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "2 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "3 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "4 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "5 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "6 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "7 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "8 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "9 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "10 pm",
                "audit_num": 0,
                "audits": [],
            },
            {
                "name": "11 pm",
                "audit_num": 0,
                "audits": [],
            },

        ]
    }
    // function handleDateChange(value, dateString) {
    //     var temp_from = dateString[0].replace(/\//g, "-")
    //     var temp_to = dateString[1].replace(/\//g, "-")
    //     setCurrentFromDateString(temp_from)
    //     setCurrentToDateString(temp_to)
    //     setLoading(true)
    //     var temp_from_iso = new Date(temp_from)
    //     var temp_to_iso = new Date(temp_to)
    //     temp_from_iso.setHours(0)
    //     temp_from_iso.setMinutes(0)
    //     temp_from_iso.setSeconds(0)
    //     temp_to_iso.setHours(0)
    //     temp_to_iso.setMinutes(0)
    //     temp_to_iso.setSeconds(0)
    //     getDataForDateChange(temp_from_iso.toISOString(), temp_to_iso.toISOString())
    // }

    function displayDateString(isoString) {
        var temp_date = new Date(isoString)

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        var ampm = ''
        var hrs
        if (temp_date.getHours() > 11) {
            ampm = 'p.m.'
            if (temp_date.getHours() === 12) {
                hrs = temp_date.getHours()
            }
            else {
                hrs = temp_date.getHours() - 12
            }
        }
        else {
            ampm = 'a.m.'
            hrs = temp_date.getHours()
        }

        var dateString = `${temp_date.getDate() < 10 ? '0' : ''}${temp_date.getDate()} ${monthNames[temp_date.getMonth()]} ${temp_date.getFullYear()} -- ${hrs < 10 ? '0' : ''}${hrs}:${temp_date.getMinutes() < 10 ? '0' : ''}${temp_date.getMinutes()}:${temp_date.getSeconds() < 10 ? '0' : ''}${temp_date.getSeconds()} ${ampm}`

        return dateString
    }

    function displayListTitleString(verb, routeStr) {

        var action = ''
        if (routeStr) {
            if (verb === 'post' || verb === 'put') {
                if (routeStr === 'Alert') {
                    action = `Updated an ${routeStr}`
                }
                else if (routeStr === 'Medication') {
                    action = `Updated a ${routeStr}`
                }
                else {
                    action = `Updated ${routeStr}`
                }
            }
            else if (verb === 'get') {
                if (routeStr === 'Alert') {
                    action = `Accessed an ${routeStr}`
                }
                else if (routeStr === 'Medication') {
                    action = `Accessed a ${routeStr}`
                }
                else {
                    action = `Accessed ${routeStr}`
                }
            }
            else if (verb === 'delete') {
                if (routeStr === 'Alert') {
                    action = `Deleted an ${routeStr}`
                }
                else if (routeStr === 'Medication') {
                    action = `Deleted a ${routeStr}`
                }
                else {
                    action = `Deleted ${routeStr}`
                }
            }
        }
        else {
            if (verb === 'post' || verb === 'put') {
                action = 'Updated'
            }
            else if (verb === 'get') {
                action = 'Accessed'
            }
            else if (verb === 'delete') {
                action = 'Deleted'
            }
        }

        var title_string = `${action}`

        return title_string
    }

    function handleCheckBox(e, item) {
        console.log(jsonDiffData)
        if (e.target.checked) {
            if (jsonDiffData.length < 2) {
                setJsonDiffData(state => [...state, item])
            }
        }
        else {
            var tempDiff = [...jsonDiffData]
            if (tempDiff.includes(item)) {
                for (var i = 0; i < tempDiff.length; i++) {
                    if (tempDiff[i] === item) {
                        tempDiff.splice(i, 1);
                    }
                }
                setJsonDiffData(tempDiff)
            }
        }
    }

    function handleAuditInfo() {
        setAuditInfoState(true)
    }

    function handleJsonDiff() {
        setJsonDiffState(true)
    }

    function auditList() {
        return (
            <div className="audit-list-container" >
                {
                    completeAuditLog.map((item, index) => (
                        item.user_role === currentRole || currentRole === 'Filter by Role'
                            ?
                            (
                                item.user_email === currentUser || currentUser === 'Filter by User'
                                    ?
                                    (
                                        searchAuditState && searchAuditState !== ''
                                            ?
                                            (
                                                displayListTitleString(item.verb, item.route_str).toLowerCase().includes(searchAuditState.toLowerCase())
                                                    ?
                                                    (
                                                        <div className="audit-list-item" key={index} >
                                                            <div className="audit-list-item-date" style={{ color: "rgba(6, 166, 0, 1)" }}  >
                                                                {
                                                                    displayDateString(item.createdAt)
                                                                }
                                                            </div>
                                                            <div className="audit-list-item-title" >
                                                                <div>
                                                                    {
                                                                        displayListTitleString(item.verb, item.route_str)
                                                                    }
                                                                </div>
                                                                <div style={{ color: "#00000075" }} >
                                                                    {
                                                                        item.route
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="audit-list-item-author" >
                                                                By {item.user_email}
                                                            </div>
                                                            <div className="audit-list-item-mark" style={{ width: '11%' }} >
                                                                <BsBookmark style={{ fontSize: "25px" }} />
                                                            </div>
                                                            <div className="audit-list-item-mark" style={{ width: '5%' }} >
                                                                <CustBtn className="secondary" onClick={() => { setCurrentSelectedAuditInfo(item); handleAuditInfo() }} >
                                                                    <InfoCircleOutlined />
                                                                </CustBtn>
                                                            </div>
                                                            <div className="audit-list-item-mark" >
                                                                <Checkbox disabled={jsonDiffData.length === 2 && !jsonDiffData.includes(item) ? true : false} onChange={(e) => { handleCheckBox(e, item) }} />
                                                            </div>
                                                        </div>
                                                    )
                                                    :
                                                    null
                                            )
                                            :
                                            (
                                                <div className="audit-list-item" key={index} >
                                                    <div className="audit-list-item-date" style={{ color: "rgba(6, 166, 0, 1)" }}  >
                                                        {
                                                            displayDateString(item.createdAt)
                                                        }
                                                    </div>
                                                    <div className="audit-list-item-title" >
                                                        <div>
                                                            {
                                                                displayListTitleString(item.verb, item.route_str)
                                                            }
                                                        </div>
                                                        <div style={{ color: "#00000075" }} >
                                                            {
                                                                item.route
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="audit-list-item-author" >
                                                        By {item.user_email}
                                                    </div>
                                                    <div className="audit-list-item-mark" style={{ width: '11%' }} >
                                                        <BsBookmark style={{ fontSize: "25px" }} />
                                                    </div>
                                                    <div className="audit-list-item-mark" style={{ width: '5%' }} >
                                                        <CustBtn className="secondary" onClick={() => { setCurrentSelectedAuditInfo(item); handleAuditInfo() }} >
                                                            <InfoCircleOutlined />
                                                        </CustBtn>
                                                    </div>
                                                    <div className="audit-list-item-mark" >
                                                        <Checkbox disabled={jsonDiffData.length === 2 && !jsonDiffData.includes(item) ? true : false} onChange={(e) => { handleCheckBox(e, item) }} />
                                                    </div>
                                                </div>
                                            )
                                    )
                                    :
                                    null
                            )
                            :
                            null

                    ))
                }
                {/* <div className="audit-list-item" >
                    <div className="audit-list-item-date" style={{ color: "rgba(217, 56, 114, 1)" }}  >
                        27 September 2021 -- 12:02:04 p.m.
                    </div>
                    <div className="audit-list-item-title" >
                        Created a Prescription for Nathan
                    </div>
                    <div className="audit-list-item-author" >
                        By Dr. Phimine
                    </div>
                    <div className="audit-list-item-mark" >
                        <FcBookmark style={{ fontSize: "25px" }} />
                    </div>
                </div> */}
            </div>
        )
    }

    function handleRefresh() {
        setLoading(true)
        setActiveBar(-1)
        var temp_from_iso = new Date(currentFromDateString)
        var temp_to_iso = new Date(currentToDateString)
        temp_from_iso.setHours(0)
        temp_from_iso.setMinutes(0)
        temp_from_iso.setSeconds(0)
        temp_to_iso.setHours(23)
        temp_to_iso.setMinutes(59)
        temp_to_iso.setSeconds(59)
        getDataForDateChange(temp_from_iso.toISOString(), temp_to_iso.toISOString())
    }

    function getOldAudit() {
        var p = new Date(jsonDiffData[0].createdAt).getTime()
        var q = new Date(jsonDiffData[1].createdAt).getTime()
        var min = Math.min(p, q)
        if (min === p) {
            return 0
        }
        else {
            return 1
        }
    }

    function getAuditDate(item) {
        var n = new Date(item.createdAt)
        return n.toDateString()
    }

    function getNewAudit() {
        var p = new Date(jsonDiffData[0].createdAt).getTime()
        var q = new Date(jsonDiffData[1].createdAt).getTime()
        var max = Math.max(p, q)
        if (max === p) {
            return 0
        }
        else {
            return 1
        }
    }

    return (
        loading
            ?
            (
                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <Spin />
                </div>
            )
            :
            (
                <div className="audit-container" >


                    {
                        auditInfoState
                            ?
                            (
                                <div className='audit-info-container' >
                                    <div style={{ width: '100%', textAlign: 'right' }} >
                                        <CustBtn className="secondary" onClick={() => { setAuditInfoState(false) }} >
                                            <CloseOutlined />
                                        </CustBtn>
                                    </div>
                                    <div style={{ fontSize: '1rem', paddingLeft: '2%', color: '#000000a8' }} >
                                        {
                                            `Route: ${currentSelectedAuditInfo.route}`
                                        }
                                    </div>
                                    <div className="audit-info-content-container" >
                                        <div className="audit-info-content" >
                                            <div className="audit-content-header" >
                                                Request Body
                                            </div>
                                            <div className="audit-content-data" >
                                                <pre style={{ margin: '0', height: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '2%' }} >{JSON.stringify(JSON.parse(currentSelectedAuditInfo.req_body), null, 2)}</pre>
                                            </div>
                                        </div>
                                        <div className="audit-info-content" >
                                            <div className="audit-content-header" >
                                                Response Body
                                            </div>
                                            <div className="audit-content-data" >
                                                {/* <pre style={{ margin: '0', height: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '2%' }} >{JSON.stringify(tempJson, null, 2)}</pre> */}
                                                <pre style={{ margin: '0', height: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '2%' }} >{JSON.stringify(JSON.parse(currentSelectedAuditInfo.rsp_body), null, 2)}</pre>
                                            </div>
                                        </div>
                                        <div className="audit-info-content" >
                                            <div className="audit-content-header" >
                                                Response Code
                                            </div>
                                            <div className="audit-content-data" style={{ fontSize: '6rem', color: '#ff4700', justifyContent: 'center' }} >
                                                {/* 404 */}
                                                {currentSelectedAuditInfo.rsp_code}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            null
                    }

                    {
                        jsonDiffState
                            ?
                            (
                                <div className='audit-diff-container' >
                                    <div style={{ width: '100%', textAlign: 'right' }} >
                                        <CustBtn className="secondary" onClick={() => { setJsonDiffState(false) }} >
                                            <CloseOutlined />
                                        </CustBtn>
                                    </div>
                                    <div style={{ padding: '2%', height: '90%' }} >
                                        <div className="audit-content-header" style={{ margin: '0' }} >
                                            Request Body Diff
                                        </div>
                                        <div className='diffs-container' >
                                            <ReactDiffViewer
                                                oldValue={JSON.stringify(JSON.parse(jsonDiffData[getOldAudit()].req_body), undefined, 4)}
                                                newValue={JSON.stringify(JSON.parse(jsonDiffData[getNewAudit()].req_body), undefined, 4)}
                                                splitView={true}
                                                compareMethod={DiffMethod.WORDS}
                                                leftTitle={getAuditDate(jsonDiffData[getOldAudit()])}
                                                rightTitle={getAuditDate(jsonDiffData[getNewAudit()])}
                                            // renderContent={highlightSyntax}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            null
                    }


                    <div className="audit-navbar" style={auditInfoState || jsonDiffState ? { filter: "blur(4px)" } : null} >
                        {/* <div className="audit-refresh" >
                            <GiBackwardTime style={{ fontSize: "30px" }} />
                        </div> */}
                        <CustBtn onClick={() => handleRefresh()} className='secondary' >
                            <SyncOutlined style={{ fontSize: '25px' }} />
                        </CustBtn>
                        <Dropdown overlay={roleMenu} trigger={['click']}>
                            <Button className='audit-filter-btn' style={{ padding: '1.5% 2%', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '16%' }} >
                                {currentRole} <DownOutlined />
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={userMenu} trigger={['click']}>
                            <Button className='audit-filter-btn' style={{ padding: '1.5% 2%', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '16%' }} >
                                {currentUser} <DownOutlined />
                            </Button>
                        </Dropdown>
                        {/* <div className="audit-perform-check" >
                            Perform Check
                        </div>
                        <div style={{ color: "#878787", fontSize: "16px" }} >
                            Last checked 20 days before
                        </div> */}
                        <Search
                            placeholder="Search Audit"
                            allowClear
                            enterButton
                            size="large"
                            onChange={(e) => setSearchAuditState(e.target.value)}
                            style={{ width: "25%", boxShadow: "0px 10px 10px 1px rgb(0 0 0 / 5%)" }}
                        />
                        {/* <RangePicker
                            style={{ padding: '0.6% 1%' }}
                            defaultValue={[moment(currentFromDateString, dateFormat), moment(currentToDateString, dateFormat)]}
                            format={dateFormat}
                            onChange={(value, dateString) => handleDateChange(value, dateString)}
                        /> */}
                        <DatePicker
                            style={{ padding: '0.6% 5%' }}
                            defaultValue={moment(currentFromDateString, dateFormat)}
                            format={dateFormat}
                            onChange={(value, dateString) => handleDateChange(value, dateString)}
                        />
                    </div>
                    <div className="audit-graph-container" style={auditInfoState || jsonDiffState ? { filter: "blur(4px)" } : null} >
                        <ResponsiveContainer width="100%" height="100%" >
                            <BarChart width="100%" height="100%" data={data}>
                                <XAxis dataKey="name" tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    itemStyle={{
                                        color: "#F0BF2B"
                                    }}
                                    wrapperStyle={{
                                        color: "white",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "#382C07",
                                        borderRadius: "6px"
                                    }}
                                    cursor={{ fill: 'white' }}
                                />
                                <Bar dataKey="audit_num" onClick={(data, index) => {
                                    setActiveBar(index)
                                    console.log(data)
                                    setCompleteAuditLog(data.audits)
                                }}>
                                    {data.map((entry, index) => (
                                        <Cell cursor="pointer" fill={index === activeBar ? '#382C07' : 'rgba(240, 191, 43, 0.2)'} key={`cell-${index}`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="audit-action-bar" style={auditInfoState || jsonDiffState ? { filter: "blur(4px)" } : null} >
                        {/* <div className="audit-sync" >
                            <SyncOutlined style={{ fontSize: "25px" }} />
                        </div> */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '45%' }} >
                            <div className="audit-details" >
                                <div className="audit-detail" >
                                    Total:
                                </div>
                                <div className="audit-detail-val" >
                                    {totalAudits}
                                </div>
                            </div>
                            <div className="audit-details" >
                                <div className="audit-detail" >
                                    Updated:
                                </div>
                                <div className="audit-detail-val" >
                                    {updatedAudits}
                                </div>
                            </div>
                            <div className="audit-details" >
                                <div className="audit-detail" >
                                    Deleted:
                                </div>
                                <div className="audit-detail-val" >
                                    {deletedAudits}
                                </div>
                            </div>
                            <div className="audit-details" >
                                <div className="audit-detail" >
                                    Accessed:
                                </div>
                                <div className="audit-detail-val" >
                                    {accessedAudits}
                                </div>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "38%"
                        }} >
                            <CustBtn onClick={() => { handleJsonDiff() }} className='primary' disabled={jsonDiffData.length === 2 ? false : true} >
                                View Diff
                            </CustBtn>
                            <CustBtn className='secondary' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                <BsBookmark style={{ fontSize: "25px", marginRight: "10%" }} /> Flagged
                            </CustBtn>
                            <CSVLink headers={headers} data={completeAuditLog} filename="audit_data.csv">
                                <CustBtn className='secondary' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <DownloadOutlined style={{ fontSize: "20px", marginRight: "10%" }} />Download
                                </CustBtn>
                            </CSVLink>
                            {/* <div className="audit-action-btn" >
                                <BsBookmark style={{ fontSize: "25px", marginRight: "10%" }} /> Flagged
                            </div>
                            <div className="audit-action-btn" >
                                <DownloadOutlined style={{ fontSize: "20px", marginRight: "10%" }} />Download
                            </div> */}
                        </div>
                    </div>
                    <div className="audit-list" style={auditInfoState || jsonDiffState ? { filter: "blur(4px)" } : null} >
                        {
                            auditList()
                        }
                    </div>
                </div>
            )
    )
}

export default AuditPage
