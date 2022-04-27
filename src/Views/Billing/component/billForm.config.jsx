import React from 'react'
import { Input, DatePicker, InputNumber } from "../../../Theme/antdComponents";
import moment from "moment";
const dateFormatList = ["YYYY-MM-DD"];

const BillGenerationFormConfig = [
    {
        colSpan: 6,
        required: true,
        label: "Bill Number",
        name: "billNumber",

        rules: [
            { required: true, message: "bill number is required!" },
            { max: 50, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 6,
        required: true,
        label: "Bill Date",
        name: "billDate",

        rules: [
            { required: true, message: "bill number is required!" },
        ],
        className: "",
        Input: <DatePicker
            placeholder="yyyy-mm-dd"
            style={{ minWidth: "100%" }}
            // disabledDate={(current) => {
            //     return current < admissionDate;
            // }}
            format={dateFormatList}
        />,
    },
    {
        colSpan: 6,
        required: true,
        label: "Patient's Name",
        name: "patientName",

        rules: [
            { required: true, message: "bill number is required!" },
            { max: 50, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 6,
        required: true,
        label: "Doctor's Name",
        name: "doctor",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 50, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 18,
        required: true,
        label: "Item/Service",
        name: "serviceName",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 50, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Price per unit",
        name: "price",
        rules: [
            { required: true, message: "bill number is required!" },
        ],
        className: "",
        Input: <InputNumber min={0} max={10000000} style={{ minWidth: "100%" }} />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Quantity",
        name: "quantity",
        rules: [
            { required: true, message: "bill number is required!" },
        ],
        className: "",
        Input: <InputNumber min={0} max={10000000} style={{ minWidth: "100%" }} />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Unit Type",
        name: "unitType",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Amount",
        name: "amount",
        rules: [
            { required: true, message: "bill number is required!" },

        ],
        className: "",
        Input: <InputNumber min={0} max={10000000} style={{ minWidth: "100%" }} />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Discount",
        name: "discount",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Coupon Code",
        name: "coupon",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 12,
        required: true,
        label: "Tax Service",
        name: "taxService",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 12,
        required: true,
        label: "Payment Method",
        name: "paymentMethod",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Total Amount",
        name: "totalAmount",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Paid Amount",
        name: "paidAmount",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
    {
        colSpan: 8,
        required: true,
        label: "Due",
        name: "due",
        rules: [
            { required: true, message: "bill number is required!" },
            { max: 10, message: "bill number exceeds max character limit!" },
        ],
        className: "",
        Input: <Input />,
    },
]


export default BillGenerationFormConfig