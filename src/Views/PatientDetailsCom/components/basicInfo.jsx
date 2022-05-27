import React from 'react';
import { Tooltip, Row, Col, Popconfirm } from 'antd';
import { useHistory } from 'react-router-dom';

import Icons from '../../../Utils/iconMap';
import { Button } from '../../../Theme/Components/Button/button';
import iconDelete from '../../../Assets/Images/iconDelete.png'

export default function BasicInfo({ data, handleComponentClose, onDeletePatient }) {
    const history = useHistory();

    const takeToEditPage = () => {
        history.push(`/dashboard/patient/edit/${data.demographic_map.pid}`);
    }

    return <Row span={24}>
        <Col span={18}>
            <p className="PatientName">
                {data.demographic_map.fname + " " + data.demographic_map.mname + "" + data.demographic_map.lname}
            </p>
            <p className="PatientMR">
                MR: {data.demographic_map.med_record}
            </p>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
            {/* <Popconfirm
                placement="bottom"
                title="Are you sure to delete this patient?"
                onConfirm={() => onDeletePatient(data.demographic_map.pid)}
                okText="Yes"
                cancelText="No"
            >
                <Tooltip title={"Delete patient"}>
                    <Button type="secondary">
                        <img src={iconDelete} width="24" height="22" style={{ marginTop: "-8px" }} />
                    </Button>
                </Tooltip>
            </Popconfirm> */}
            
            <Tooltip title={"Edit patient"}>
                <Button
                    type="secondary"
                    onClick={takeToEditPage}
                >
                    {Icons.edit({ Style: { fontSize: "1.5rem" } })}
                </Button>
            </Tooltip>
            <Tooltip title={"Call patient"}>
                <Button
                    type="secondary"
                    disabled
                >
                    {Icons.phoneOutlined({ Style: { fontSize: "1.5rem" } })}
                </Button>
            </Tooltip>
            <Tooltip
                title={"Close"}
            >
                <Button
                    type="secondary"
                    onClick={handleComponentClose}
                >
                    {Icons.CloseCircleOutlined({ Style: { fontSize: "1.5rem" } })}
                </Button>
            </Tooltip>
        </Col>
    </Row>
}