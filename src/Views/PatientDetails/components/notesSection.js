import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "antd/es/grid";
import {
    Button,
    notification,
    message,
    Spin,
    Upload,
    Collapse,
    Image,
    Table,
    Tag,
    Menu,
    Popover,
    Tooltip,
} from "antd";
import Icons from "../../../Utils/iconMap";
import "./notesSection.css";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

import patientApi from "../../../Apis/patientApis";
import Form from "antd/lib/form/Form";
import Modal from "antd/lib/modal/Modal";
import { Select, SelectOption } from "../../../Theme/Components/Select/select";

import internalApi from "../../../Apis/internalApis";
import userApi from "../../../Apis/userApis";
import { Button as Buttons } from "../../../Theme/Components/Button/button";

import { TagOutlined } from "@ant-design/icons";
import { GlobalSearch } from "../../../Theme/Components/Input/input";

const Joi = require("joi");
const { Panel } = Collapse;

// function FetchPatientNotes(pid, uploading, setRecentNote) {
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     patientApi
//       .getPatientNotes(pid)
//       .then((res) => {
//         let notes = res?.data?.response.notes;

//         function sortFunction(a, b) {
//           var dateA = new Date(a.date).getTime();
//           var dateB = new Date(b.date).getTime();
//           return dateA > dateB ? 1 : -1;
//         }

//         notes.sort(sortFunction);
//         //setting the last note to change in infosection
//         if (notes.length > 0) {
//           let lastNote = notes[notes.length - 1];
//           setRecentNote({
//             time: lastNote.date,
//             note: lastNote.note,
//             dr:
//               lastNote["users.fname"] === null
//                 ? "Dr. "
//                 : `${lastNote["users.fname"]} ${lastNote["users.lname"]}`,
//             pb:
//               lastNote["users.fname"] === null
//                 ? "Dr. "
//                 : `${lastNote["users.fname"]} ${lastNote["users.lname"]}`,
//             note_uuid: lastNote.note_uuid,
//           });
//         }

//         setLoading(false);
//         setResponse(notes);
//       })
//       .catch((err) => {
//         if (err) {
//           // Notification.error({
//           //     message: 'Error',
//           //     // description: `${err.response.data.result}` || ""
//           // })
//           console.error(err);
//           setLoading(false);
//         }
//       });
//   }, [pid, uploading]);

//   return [response, loading];
// }

const ImageCollapse = ({ uuid, index }) => {
    const [response, setResponse] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            internalApi
                .getImage(uuid, null)
                .then((res) => {
                    setResponse(res.data?.response);
                    console.log(res);
                    setImageLoading(false);
                })
                .catch((err) => {
                    if (err) {
                        // Notification.error({
                        //     message: 'Error',
                        //     // description: `${err.response.data.result}` || ""
                        // })
                        console.error(err);
                        setImageLoading(false);
                    }
                });
        }
    }, [isOpen]);

    return (
        <Collapse
            key={index}
            onChange={() => {
                setIsOpen(!isOpen);
            }}
            ghost
        >
            <Panel header="Show attachments">
                {imageLoading && (
                    <Spin style={{ position: "relative", left: "50%", top: "30%" }} />
                )}
                {!imageLoading && response?.imagesData?.length > 0 && (
                    <div>
                        <Image.PreviewGroup>
                            {response?.imagesData.map((item) => {
                                return (
                                    <span
                                        style={{
                                            margin: "5% 5%",
                                        }}
                                    >
                                        <Image width={100} src={item.data} />
                                    </span>
                                );
                            })}
                        </Image.PreviewGroup>
                    </div>
                )}
                {!imageLoading && response?.imagesData?.length < 1 && (
                    <div>
                        <h1>Nothing in attachments</h1>
                    </div>
                )}
            </Panel>
        </Collapse>
    );
};

function NotesSection(props) {
    const [sendNotes, setSendNotes] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const [advisorModal, setAdvisorModal] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    // console.log(notes, isLoading);
    const [notesType, setNotesType] = useState("notes");
    const [uploadTypeList, setUploadTypeList] = useState({});
    const [activeFile, setActiveFile] = useState(null);
    const [notesModal, setNotesModal] = useState(false);
    const [activeNote, setActiveNote] = useState(null);
    const [doctorList, setDoctorList] = useState([]);
    const [user, setUser] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [tagBtn, setTagBtn] = useState(false);
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let notesData1 = [];

    const fetchNotes = (note) => {
        patientApi
            .getPatientNotes(props.pid, note)
            .then((res) => {
                let notes = res?.data?.response.notes;

                function sortFunction(a, b) {
                    var dateA = new Date(a.date).getTime();
                    var dateB = new Date(b.date).getTime();
                    return dateA > dateB ? 1 : -1;
                }

                notes.sort(sortFunction);
                //setting the last note to change in infosection
                if (notes.length > 0) {
                    let lastNote = notes[notes.length - 1];
                    if (props.setRecentNote !== undefined) {
                        props.setRecentNote({
                            time: lastNote.date,
                            note: lastNote.note,
                            dr:
                                lastNote["pracuuid.fname"] === null
                                    ? null
                                    : `${lastNote["pracuuid.fname"]} ${lastNote["pracuuid.lname"]}`,
                            pb:
                                lastNote["useruuid.fname"] === null
                                    ? "Dr. "
                                    : `${lastNote["useruuid.fname"]} ${lastNote["useruuid.lname"]}`,
                            note_uuid: lastNote.note_uuid,
                        });
                    }
                }

                setIsLoading(false);
                setNotes(notes);
            })
            .catch((err) => {
                if (err) {
                    // Notification.error({
                    //     message: 'Error',
                    //     // description: `${err.response.data.result}` || ""
                    // })
                    console.error(err);
                    setIsLoading(false);
                }
            });
    };

    useEffect(() => {
        return fetchNotes();
    }, [props.pid, uploading]);

    const tagBtnStyle = {
        margin: "0px 0px 0px 1px",
        width: "3.1em",
        padding: "0px",
        height: "3.1em",
        border: "1px solid #FFD966",
        color: "#FFD966",
    };

    useEffect(() => {
        // userApi
        //     .getUserList()
        //     .then((res) => {
        //         console.log(res.data.response);
        //         const doctorsData = res.data?.response?.users[0].filter(
        //             (item) => item.role.toLowerCase() === "doctor"
        //         );
        //         console.log(doctorsData);
        //         setDoctorList(doctorsData);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }, []);

    useEffect(() => {
        userApi
            .getMyself()
            .then((res) => {
                console.log("current User Data", res);
                setCurrUser(res.data?.response?.users[0].user_uuid);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const openUploadModal = () => {
        setUploadModal(true);
    };
    const openAdvisorModal = () => {
        setAdvisorModal(true);
    };
    const openNotesModal = () => {
        setNotesModal(true);
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [notesData1]);

    function to12HourFormat(dates) {
        var date = new Date(dates);
        var hours = date.getHours();
        var minutes = date.getMinutes();

        // Check whether AM or PM
        var newformat = hours >= 12 ? "p.m" : "a.m";

        // Find current hour in AM-PM Format
        hours = hours % 12;

        // To display "0" as "12"
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return hours + ":" + minutes + " " + newformat;
    }

    const trimName = (note) => {
        return note.length > 15 ? note.slice(0, 13) + ".." : note;
    };

    const notesData = [];
    let oneDayNotes = [];

    if (!isLoading && notes?.length > 0) {
        notes.map((item) => {
            notesData.push({
                time: item.date,
                note: item.note,
                dr:
                    item["pracuuid.fname"] === null
                        ? null
                        : trimName(`${item["pracuuid.fname"]} ${item["pracuuid.lname"]}`),
                pb:
                    item["useruuid.fname"] === null
                        ? "Dr. "
                        : trimName(`${item["useruuid.fname"]} ${item["useruuid.lname"]}`),
                note_uuid: item.note_uuid,
            });
        });
        let firstDay = notesData[0].time;
        notesData.map((item) => {
            if (new Date(item.time).getDate() === new Date(firstDay).getDate()) {
                oneDayNotes.push(item);
                // console.log(firstDay, new Date(item.time).getDate() === new Date(firstDay).getDate())
            } else {
                notesData1.push(oneDayNotes);
                oneDayNotes = [];
                oneDayNotes.push(item);
                firstDay = item.time;
            }
        });
    }
    if (oneDayNotes.length > 0) notesData1.push(oneDayNotes);

    function getDate(date1) {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const date = new Date(date1);
        return `${date.getDate()}  ${monthNames[date.getMonth()]} `;
    }

    const success = () => {
        message.success("New Note added successfully");
    };

    const Joy = Joi.defaults((schema) => {
        switch (schema.type) {
            case "string":
                return schema.allow("");
            case "object":
                return schema.min(1);
            case "number":
                return schema.min(0);
            default:
                return schema;
        }
    });
    const notesSchema = Joy.object({
        advisor: Joy.string().required(),
    });

    function validate(data, schema) {
        const { error } = schema.validate(data);
        return error;
    }

    const addNotes = (values) => {
        try {
            let NotesError = validate(
                {
                    advisor: user,
                },
                notesSchema
            );

            if (NotesError !== undefined) {
                throw new Error(NotesError);
            }
            setUploading(true);
            setSendNotes(true);
            console.log(values);
            let note = values.note;
            if (fileList.length > 0) {
                note = (note || "") + "<img>";
            }

            let data = {
                note: note || "",
                pid: props.pid,
                note_type: notesType,
                id: 1,
                note_uuid: "0",
                user_uuid: currUser,
                prac_uuid: user === "self" ? null : user,
            };

            patientApi
                .addNotesToPatient(props.pid, data)
                .then((res) => {
                    success();
                    form.resetFields();
                    console.log(res.data?.response?.patient_data);
                    const notesResponse = res.data?.response?.patient_data;
                    setSendNotes(false);
                    if (fileList.length > 0) {
                        fileList.map((item, index) => {
                            // values.append('files[]', item);
                            const formData = new FormData();
                            formData.append("data", item);
                            formData.append("template_uuid", notesResponse.note_uuid);
                            formData.append("template_type", notesType);
                            formData.append("pid", props.pid);
                            formData.append("tags", uploadTypeList[item.uid][0]);

                            internalApi
                                .addImage(formData)
                                .then((res) => {
                                    console.log("success", res.response);
                                    if (index === fileList.length - 1) {
                                        props.refreshFileViewAgain(!props.refreshFileView);
                                        setUploading(false);
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        });
                    } else {
                        setUploading(false);
                    }
                    setFileList([]);
                    setUploadTypeList([]);
                })
                .catch((err) => {
                    if (err) {
                        const error = err.response?.data?.result;
                        const key = "error";
                        notification.error({
                            key,
                            message: "Error",
                            description: `${error}` || "",
                        });
                        console.log(err);
                    }
                });
        } catch (e) {
            console.error(e);
            const key = "warning";
            notification.warn({
                key,
                message: "Please Select Advisor",
                description: "Please Select Advisor",
                placement: "topLeft",
                duration: 5,
            });
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
            return {
                fileList,
            };
        },
        beforeUpload: (file) => {
            const id = file.uid;
            setUploadTypeList({
                ...uploadTypeList,
                [file.uid]: ["Note"],
            });
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    console.log(notes, notesData, notesData1);
    // console.log(fileList, uploadTypeList);

    const [form] = Form.useForm();

    // console.log(uploadType, uploadTypeList)

    function handleChange(value) {
        console.log(`selected ${value}`);
        let prevUploadList = uploadTypeList;
        prevUploadList[activeFile.uid] = [value];
        setUploadTypeList(prevUploadList);
    }

    const options = [
        { value: "Note" },
        { value: "Profile Pic" },
        { value: "Prescription" },
        { value: "X-Ray" },
    ];

    function tagRender(props) {
        const { label, value, closable, onClose } = props;
        // console.log(props);
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color="default"
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
            >
                {label}
            </Tag>
        );
    }

    function spreadFunc(data) {
        return data;
    }

    const columns = [
        {
            title: "FileName",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            align: "left",
            width: "40%",
            render: (text, record) => <p style={{ marginBottom: "0px" }}>{text}</p>,
        },

        {
            title: "Select Tags",
            dataIndex: "uid",
            key: "name",
            align: "center",
            width: "50%",
            render: (dataIndex) => (
                <Select
                    mode="multiple"
                    showArrow
                    tagRender={tagRender}
                    options={options}
                    key={dataIndex}
                    defaultValue={spreadFunc(...uploadTypeList[dataIndex])}
                    onChange={handleChange}
                    style={{
                        marginRight: "10px",
                        width: "100%",
                    }}
                ></Select>
            ),
            // sorter: (a, b) => a.email.localeCompare(b.email)
        },
        {
            title: "close",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <Button
                    onClick={() => {
                        const index = fileList.indexOf(activeFile);
                        const newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFileList(newFileList);
                        const newUploadTypeList = uploadTypeList;
                        delete newUploadTypeList[activeFile.uid];
                        setUploadTypeList(newUploadTypeList);
                    }}
                    type="text"
                >
                    x
                </Button>
            ),
        },
    ];

    const onClickRow = (record) => {
        return {
            onClick: () => {
                setActiveFile(record);
            },
            onMouseEnter: () => {
                setActiveFile(record);
            },
        };
    };

    // console.log(activeFile, fileList, uploadTypeList);
    // console.log(activeNote, notesModal);

    function onChange(value) {
        console.log(`selected ${value}`);
        setUser(value);
    }

    const handleNoteChange = (value) => {
        setNotesType(value);
    };

    const tagContent = (
        <Row style={{ alignItems: "center", width: "200px" }}>
            <Col span={6}>
                <h1
                    style={{
                        fontSize: "16px",
                        marginBottom: "0px",
                    }}
                >
                    Tag :{" "}
                </h1>
            </Col>
            <Col span={18}>
                <Select
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    defaultValue={notesType}
                    onChange={handleNoteChange}
                >
                    <SelectOption key="note">Note</SelectOption>
                    <SelectOption key="profile pic">Profile Pic</SelectOption>
                    <SelectOption key="prescription">Prescription</SelectOption>
                    <SelectOption key="x-ray">X-Ray</SelectOption>
                </Select>
            </Col>
        </Row>
    );

    const searchNote = (value) => {
        console.log(value);
        fetchNotes(value);
    };

    return (
        <div
            style={{
                background: "#FFF",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid #FF752950",
                borderRadius: "5px 5px 5px 5px",
                width: "100%",
                // minHeight: "52vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: "3",
                position: "relative",
                minHeight: "500px",
                height: "100%"
                // marginBottom: "20px",
            }}
        >
            <Row className="notes-header" span={24}>
                <Col style={{ display: "flex", alignItems: "center" }} span={8}>
                    <p>Notes</p>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }} span={16}>
                    <GlobalSearch
                        enterButton
                        onSearch={searchNote}
                        style={{
                            width: "100%",
                        }}
                        placeholder="Type here"
                    />
                </Col>
                {
                    // <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
                    // <Tooltip title="Close Notes">
                    // <Button
                    //   style={{ color: "white" }}
                    //   onClick={() => {
                    //     props.setNotes(false);
                    //   }}
                    //   type="text"
                    // >
                    //   {Icons.CloseOutlined({})}
                    // </Button>
                    // </Tooltip>
                    // </Col>
                }
            </Row>

            <Row
                span={24}
                style={{
                    height: "400px",
                    flex: 1,
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        overflow: "visible",
                        position: "absolute",
                        width: "100%",
                        padding: "1em",
                    }}
                >
                    {!isLoading && !sendNotes ? (
                        <>
                            {notesData1.map((item1, index1) => {
                                return (
                                    <div key={index1}>
                                        <div className="notes-date">
                                            <p>{getDate(item1[0].time)}</p>
                                        </div>
                                        {item1.map((item, index) => {
                                            return (
                                                <div
                                                    style={{
                                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                                        marginBottom: " 10px",
                                                        borderRadius: "6px",
                                                    }}
                                                >
                                                    <div className="quickinfo-notes" key={index}>
                                                        <div
                                                            style={{ marginBottom: "0px", opacity: "0.6" }}
                                                            className="quickinfo-notes-header"
                                                        >
                                                            <div>
                                                                <p>
                                                                    {" "}
                                                                    Posted by:{" "}
                                                                    <span style={{ opacity: "0.4" }}>
                                                                        {item.pb}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p>{to12HourFormat(item.time)}</p>
                                                            </div>
                                                        </div>
                                                        {item.dr !== null && item.dr !== item.pb && (
                                                            <div style={{ opacity: "0.6" }}>
                                                                <div>
                                                                    <p>
                                                                        {" "}
                                                                        Advisor :{" "}
                                                                        <span style={{ opacity: "0.4" }}>
                                                                            {item.dr}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="quickinfo-notes-body">
                                                            {item.note.length < 90 ? (
                                                                <p>
                                                                    {item.note.slice(-5) === "<img>"
                                                                        ? item.note.slice(0, -5)
                                                                        : item.note}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <p>{item.note.slice(0, 90) + "..."}</p>
                                                                    <div style={{ textAlign: "right" }}>
                                                                        <Buttons
                                                                            style={{
                                                                                height: "3.1em",
                                                                                fontSize: "12px",
                                                                                padding: "6px",
                                                                            }}
                                                                            className="primary-outlined"
                                                                            onClick={() => {
                                                                                setActiveNote(item);
                                                                                openNotesModal(item);
                                                                            }}
                                                                        >
                                                                            Show Full Notes
                                                                        </Buttons>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {item.note.length < 90 &&
                                                        item.note.slice(-5) === "<img>" ? (
                                                        <ImageCollapse
                                                            uuid={item.note_uuid}
                                                            index={`${index1}${index}`}
                                                        />
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        ""
                    )}
                    {isLoading && (
                        <Spin
                            size="large"
                            style={{ position: "relative", left: "50%", top: "30%" }}
                        />
                    )}
                    {sendNotes && (
                        <Spin
                            size="large"
                            style={{ position: "relative", left: "50%", top: "30%" }}
                        />
                    )}
                </div>
            </Row>
            <Form
                form={form}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={addNotes}
            >
                <Row span={24} style={{ height: "140px" }}>
                    <Col
                        span={24}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div style={{ width: "90%" }}>
                            <Form.Item
                                name="note"
                                rules={[
                                    {
                                        message: "note is empty",
                                    },
                                ]}
                                style={{ marginBottom: "0px" }}
                            >
                                <TextArea
                                    style={{
                                        width: "100%",
                                    }}
                                    allowClear={true}
                                    placeholder="Type Notes"
                                    autoSize={{ minRows: 5, maxRows: 5 }}
                                />
                            </Form.Item>
                        </div>
                    </Col>
                    {
                        // <Col span={6} style={{ display: "flex" }}>
                        // <div
                        //   style={{
                        //     height: "100%",
                        //     width: "100%",
                        //     padding: "10% 0%",
                        //   }}
                        // >
                        //   <Row
                        //     style={{
                        //       height: "50%",
                        //     }}
                        //   >
                        //     <Col span={24} className="textarea-buttons">
                        //       <Buttons
                        //         style={{
                        //           width: "92%",
                        //           height: "95%",
                        //           padding: "3px 0px 0px 0px ",
                        //         }}
                        //         className="primary-outlined"
                        //         onClick={openUploadModal}
                        //       >
                        //         <div>
                        //           <UploadOutlined style={{ fontSize: "16px" }} />
                        //         </div>
                        //         <div>
                        //           <p
                        //             style={{
                        //               marginBottom: "0px",
                        //               textAlign: "center",
                        //               fontSize: "10px",
                        //             }}
                        //           >
                        //             Upload File
                        //           </p>
                        //         </div>
                        //       </Buttons>
                        //     </Col>
                        //   </Row>
                        //   <Row
                        //     style={{
                        //       height: "50%",
                        //     }}
                        //   >
                        //     <Col span={24} className="textarea-buttons">
                        //       <Buttons
                        //         style={{
                        //           width: "92%",
                        //           height: "95%",
                        //           padding: "3px 0px 0px 0px ",
                        //         }}
                        //         className="primary-outlined"
                        //         onClick={openAdvisorModal}
                        //       >
                        //         <div>{Icons.advisorIcon({})}</div>
                        //         <div>
                        //           <p
                        //             style={{
                        //               marginBottom: "0px",
                        //               textAlign: "center",
                        //               fontSize: "10px",
                        //             }}
                        //           >
                        //             Advisor
                        //           </p>
                        //         </div>
                        //       </Buttons>
                        //     </Col>
                        //   </Row>
                        // </div>
                        // </Col>
                    }
                </Row>
                <Row
                    style={{
                        height: "50px",
                        justifyContent: "space-around",
                    }}
                >
                    <Col span={6} className="textarea-buttons">
                        <Tooltip title="Attach File">
                            <Buttons
                                type="secondary"
                                style={{
                                    width: "3.1em",
                                    padding: "0px",
                                    height: "3.1em",
                                }}
                                onClick={openUploadModal}
                            >
                                <div>
                                    <UploadOutlined style={{ fontSize: "24px" }} />
                                </div>
                            </Buttons>
                        </Tooltip>
                    </Col>

                    <Col span={6} className="textarea-buttons">
                        <Tooltip title="Mention Advisor">
                            <Buttons
                                type="secondary"
                                style={{
                                    width: "3.1em",
                                    padding: "0px",
                                    height: "3.1em",
                                }}
                                onClick={openAdvisorModal}
                            >
                                <div>{Icons.advisorIcon({ Style: { fontSize: "24px" } })}</div>
                            </Buttons>
                        </Tooltip>
                    </Col>

                    <Col className="textarea-buttons" span={6}>
                        <Popover trigger="click" content={tagContent} visible={tagBtn}>
                            <Tooltip title="Add Tag" placement="bottom">
                                <Buttons
                                    type="secondary"
                                    style={
                                        tagBtn
                                            ? tagBtnStyle
                                            : {
                                                margin: "0px 0px 0px 1px",
                                                width: "3.1em",
                                                padding: "0px",
                                                height: "3.1em",
                                            }
                                    }
                                    onClick={() => setTagBtn(!tagBtn)}
                                    icon={<TagOutlined style={{ fontSize: "24px" }} />}
                                ></Buttons>
                            </Tooltip>
                        </Popover>
                    </Col>

                    <Col className="textarea-buttons" span={6}>
                        <Form.Item style={{ marginBottom: "0px", width: "100%" }}>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Tooltip title="Send Now">
                                    <Buttons
                                        type="secondary"
                                        style={{
                                            width: "3.1em",
                                            padding: "0px",
                                            height: "3.1em",
                                        }}
                                        loading={uploading}
                                        htmlType="submit"
                                        icon={<SendOutlined style={{ fontSize: "24px" }} />}
                                    ></Buttons>
                                </Tooltip>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                {fileList.length > 0 && (
                    <Row>
                        <Col span={22} offset={2}>
                            <p style={{ marginBottom: "3px" }}>
                                You have {fileList.length} images to upload
                            </p>
                        </Col>
                    </Row>
                )}
            </Form>
            <Modal
                visible={uploadModal}
                centered
                onCancel={() => {
                    setUploadModal(false);
                }}
                width={800}
                footer={null}
                closable={false}
            >
                <div style={{ margin: "10px" }}>
                    <Upload {...uploadProps} showUploadList={false} multiple={true}>
                        <Buttons
                            style={{
                                boxShadow: "rgb(20 121 255 / 5%) 0px 0px 20px 5px",
                                height: "50px",
                                width: "160px",
                            }}
                            icon={<UploadOutlined />}
                        >
                            Select File
                        </Buttons>
                    </Upload>
                </div>
                <div className="upload-table">
                    <Table
                        showHeader={false}
                        columns={columns}
                        dataSource={fileList}
                        pagination={{ position: ["none", "none"] }}
                        // size="middle"
                        // bordered={true}
                        // scroll={{ y: '75vh' }}
                        onRow={onClickRow}
                    />
                </div>
                <Row style={{ marginTop: "20px" }}>
                    <Col
                        span={17}
                        offset={2}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Buttons
                            className="secondary"
                            type="text"
                            onClick={() => {
                                setUploadModal(false);
                                setFileList([]);
                                setUploadTypeList({});
                            }}
                        >
                            Cancel
                        </Buttons>
                    </Col>
                    <Col span={5} style={{ display: "flex", justifyContent: "center" }}>
                        <Buttons
                            onClick={() => {
                                setUploadModal(false);
                            }}
                        >
                            Confirm
                        </Buttons>
                    </Col>
                </Row>
            </Modal>
            <Modal
                visible={notesModal}
                centered
                onCancel={() => {
                    setNotesModal(false);
                }}
                width={800}
                footer={null}
            >
                {activeNote !== null && (
                    <div
                        style={{
                            margin: "20px",
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                            borderRadius: "6px",
                        }}
                    >
                        <div className="quickinfo-notes">
                            <div className="quickinfo-notes-header">
                                <div>
                                    <p>{activeNote.dr}</p>
                                </div>
                                <div>
                                    <p>{to12HourFormat(activeNote.time)}</p>
                                </div>
                            </div>
                            <div className="quickinfo-notes-body">
                                <p>{activeNote.note}</p>
                            </div>
                        </div>
                        <ImageCollapse uuid={activeNote.note_uuid} />
                    </div>
                )}
            </Modal>
            <Modal
                visible={advisorModal}
                centered
                onCancel={() => {
                    setAdvisorModal(false);
                }}
                width={400}
                footer={null}
                closable={false}
            >
                <Row>
                    <Col
                        span={8}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p style={{ marginBottom: "0px" }}>submitted by:</p>
                    </Col>
                    <Col
                        span={16}
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Select
                            showSearch
                            style={{ width: 180 }}
                            placeholder="Choose Doctor"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <SelectOption value="self">Self</SelectOption>
                            {doctorList.map((item) => {
                                return (
                                    <SelectOption value={item.user_uuid}>
                                        {item.fname + " " + item.lname}
                                    </SelectOption>
                                );
                            })}
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <Col
                        span={22}
                        offset={2}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Buttons
                            onClick={() => {
                                setAdvisorModal(false);
                            }}
                        >
                            Confirm
                        </Buttons>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}

export default NotesSection;

//loadingstate
//errorState
//nullState
//dataState

// {
//     <Row style={{ background: 'white', height: '64px', borderBottom: '2px solid #d9d9d9' }} span={24}>
//                 <Col style={{ display: 'flex', alignItems: 'center' }} offset={1} span={15}>
//                     <Select
//                         showSearch
//                         style={{ width: 180 }}
//                         placeholder="Choose Doctor"
//                         optionFilterProp="children"
//                         onChange={onChange}
//                         filterOption={(input, option) =>
//                             option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                         }
//                     >
//                         {doctorList.map((item) => {
//                             return (<SelectOption value={item.user_uuid}>{item.fname + ' ' + item.lname}</SelectOption>)
//                         })}
//                     </Select>
//                 </Col>
//                 <Col span={8} style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
//                 </Col>
//             </Row>
// }
