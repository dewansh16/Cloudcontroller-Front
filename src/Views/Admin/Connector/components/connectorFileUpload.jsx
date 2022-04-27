
import React, { useState } from 'react';
import { Col, Row, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';

const { Dragger } = Upload;


export default function ConnectorFileUpload() {

    const props = {
        name: 'file',
        multiple: true,
        accept: ".xlsx,.xlsb,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.binary.macroEnabled.12,application/vnd.ms-excel",
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                console.info(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                console.info(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload: async (e) => {
            console.log('Dropped files', e);
            const file = await e.arrayBuffer();
            // console.info(file)
            const workbook = XLSX.read(file);
            const patientSheet = workbook.Sheets['patient']
            // console.info('workbook', patientSheet)
            const patientArray = XLSX.utils.sheet_to_json(patientSheet)
            console.info('excel data', patientArray)
            return false
        },
    };

    return <Row justify="center" align="middle" style={{ padding: "2em" }} >
        <div className="addPatient">
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>
        </div>
    </Row>
}