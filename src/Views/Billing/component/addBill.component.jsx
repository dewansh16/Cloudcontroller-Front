import React from 'react'
import { Form, Modal, Row, Col } from "../../../Theme/antdComponents";
import BillGenerationFormConfig from "./billForm.config";

function BillGenerationComponent({ isModalVisible, handleCancel, submitForm }) {
    const [form] = Form.useForm();
    const onOk = () => {
        // form
        //     .validateFields()
        //     .then((values) => {
        //         form.resetFields();
        //         submitForm(values);
        //     })
        //     .catch((info) => {
        //         console.info('Validate Failed:', info);
        //     });
        submitForm({

            key: "5",
            serviceName: "Consultation",
            quantity: 1,
            price: 3244,
            amount: 10000,
            paymentStatus: "partiallyPaid",
            paymentMethod: "Insurance"

        });
    }

    const cancelSubmission = () => {
        form.resetFields();
        handleCancel();
    }


    return (
        <Modal title="Add Bill" okText="Submit" maskClosable={false} width="80%" visible={isModalVisible} onCancel={cancelSubmission} onOk={onOk} >
            <Form
                form={form}
                layout="vertical"
                name="generate_bill_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Row span={24} gutter={[12, 8]}>
                    {BillGenerationFormConfig.map(Formitem =>
                        <Col span={Formitem.colSpan} key={Formitem.name}>
                            <Form.Item
                                required={Formitem.required}
                                label={Formitem.label}
                                name={Formitem.name}
                                // validateFirst={Formitem.validateFirst}
                                rules={Formitem.rules}
                            >
                                {Formitem.Input}
                            </Form.Item>
                        </Col>
                    )}
                </Row>
            </Form>
        </Modal>
    )
}

export default BillGenerationComponent;