import React from 'react';
import { Tooltip, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';

import Icons from '../../../Utils/iconMap';
import { Button } from '../../../Theme/Components/Button/button';

export default function BasicInfo({ data, handleComponentClose }) {
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