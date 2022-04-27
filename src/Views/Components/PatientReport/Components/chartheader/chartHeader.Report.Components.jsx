import React from 'react';
import { Row, Col } from 'antd';

const ChartHeader = () => {
    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={2} />
                <Col span={6} />
                <Col span={8} />
                <Col span={2} />
            </Row>
        </div>
    )
}