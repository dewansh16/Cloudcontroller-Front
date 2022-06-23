import React from "react";
import { DatePicker, Radio  } from "antd";
import { Input } from "../../Theme/Components/Input/input";
// import { Select, SelectOption } from "../../Theme/Components/Select/select";
import moment from "moment";
import { governmentIdentity, phone } from "../../Utils/validators";
import countryList from "country-region-data";

import Select from 'antd/lib/select'
const { Option } = Select;

const Joi = require("joi");

//TODO: add deceased_reason and deceased_date

const Joy = Joi.defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.allow("").allow(null);
        case "object":
            return schema.min(1);
        case "number":
            return schema.min(0);
        default:
            return schema;
    }
});

const demographicSchema = Joy.object({
    admission_date: Joy.string().required(),
    discharge_date: Joy.string(),
    med_record: Joy.string().required(),
    title: Joy.string().required(),
    fname: Joy.string().required(),
    lname: Joy.string().required(),
    mname: Joy.string(),
    sex: Joy.string().required(),
    DOB: Joy.string().required(),
    phone_contact: Joy.string().required(),
    phone_cell: Joy.string(),
    email: Joi.string().allow(null, '').email({ tlds: { allow: false } }),
    idtype: Joy.string(),
    idnumber: Joy.string(),
    mothersname: Joy.string(),
    deceased_date: Joy.string(),
});
const locationSchema = Joy.object({
    country_name: Joy.string(),
    street: Joy.string(),
    city: Joy.string(),
    state: Joy.string(),
    postal_code: Joy.string(),
});
const bedAllocationSchema = Joy.object({
    location_uuid: Joy.string(),
    bed: Joy.number(),
});
const practitionersSchema = Joy.object({
    primary_consultant: Joy.array(),
    secondary_consultant: Joy.array(),
    // medical_state: Joy.string(),
});
const guardianSchema = Joy.object({
    guardiansname: Joy.string(),
    guardiansex: Joy.string(),
    guardianrelationship: Joy.string(),
    guardianphone: Joy.string(),
    guardianworkphone: Joy.string(),
    guardianemail: Joi.string().allow(null, '').email({ tlds: { allow: false } }),
    guardianaddress: Joy.string(),
    guardiancity: Joy.string(),
    guardiancountry: Joy.string(),
    guardianstate: Joy.string(),
    guardianpostalcode: Joy.string(),
});

const dateFormatList = ["MMM DD YYYY"];

const demographicsFormItems = (
    props,
    admissionDate,
    setAdmissionDate,
    dischargeDate,
    setDischargeDate,
    errorFirstName,
    errorLastName,
    onInputChange,
    setPatientType,
    patientType
) => [
        {
            required: !props.required,
            label: "Patient Type",
            name: "patient_type",
            rules: [{ required: !props.required, message: "Patient type is required!" }],
            className: "addPatientDetailsModal",
            Input: (
                <Radio.Group onChange={(event) => setPatientType(event?.target?.value)} defaultValue={patientType}>
                    <Radio value="remote">Remote</Radio>
                    <Radio value="hospital" style={{ marginLeft: "2rem" }}>Hospital</Radio>
                </Radio.Group>
            ),
        },
        {
            required: props.required,
            label: `${patientType === "remote" ? "Start" : "Admission"} Date`,
            name: "admission_date",
            rules: [
                { required: props.required, message: `${patientType === "remote" ? "Start" : "Admission"} Date is required!` },
            ],
            className: "addPatientDetailsModal",
            Input: (
                <DatePicker
                    // defaultValue={moment()}
                    placeholder="MMM DD YYYY"
                    style={{ width: "60%" }}
                    onChange={(time) => {
                        setAdmissionDate(time);
                    }}
                    format={dateFormatList}
                />
            ),
        },
        {
            required: !props.required,
            label: `${patientType === "remote" ? "End" : "Discharge"} Date`,
            name: "discharge_date",
            rules: [
                { required: !props.required, message: `${patientType === "remote" ? "End" : "Discharge"} Date is required!` },
            ],
            className: "addPatientDetailsModal",
            Input: (
                <DatePicker
                    placeholder="MMM DD YYYY"
                    style={{ width: "60%" }}
                    disabledDate={(current) => {
                        return current < admissionDate;
                    }}
                    onChange={(time) => {
                        setDischargeDate(time);
                    }}
                    format={dateFormatList}
                />
            ),
        },
        {
            required: props.required,
            label: "Title",
            name: "title",
            rules: [{ required: props.required, message: "Title is required!" }],
            className: "addPatientDetailsModal",
            Input: (
                <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={true}
                >
                    <Option value="Mr.">Mr.</Option>
                    <Option value="Mrs.">Mrs.</Option>
                    <Option value="Mx.">Mx.</Option>
                    <Option value="Master">Master</Option>
                    <Option value="Miss">Miss</Option>
                    <Option value="Ms.">Ms.</Option>
                    <Option value="Dr.">Dr.</Option>
                </Select>
            ),
        },
        {
            required: props.required,
            label: "Medical Record Number",
            name: "med_record",
            rules: [
                {
                    required: props.required,
                    message: "Medical Record number is mandatory!",
                },
            ],
            className: "addPatientDetailsModal",
            Input: <Input />,
        },
        {
            required: props.required,
            label: "First Name",
            name: "fname",
            rules: [{ 
                required: props.required, message: "First Name is required!", 
            }],
            className: "addPatientDetailsModal relative-error",
            Input: <Input onChange={(event) => onInputChange(event.target.value, "firstName")} status={errorFirstName ? "error" : ""} />
        },
        {
            required: !props.required,
            label: "Middle Name",
            name: "mname",
            rules: [{ required: !props.required, message: "Middle name is required!" }],
            className: "addPatientDetailsModal",
            Input: <Input />,
        },
        {
            required: props.required,
            label: "Last Name",
            name: "lname",
            rules: [{ required: props.required, message: "Last Name is required!" }],
            className: "addPatientDetailsModal",
            Input: <Input onChange={(event) => onInputChange(event.target.value, "lastName")} status={errorLastName ? "error" : ""} />,
            // Input: <div style={{ position: "relative" }}>
            //     <Input onChange={(event) => onInputChange(event.target.value, "lastName")} status={errorLastName ? "error" : ""} />
            //     {errorLastName && (
            //         <div style={{ 
            //             position: "absolute",
            //             bottom: "0",
            //             left: "0",
            //             fontSize: "14px",
            //             color: "#FF2B2B",
            //             marginBottom: "-22px"
            //         }}>Last Name is not space!</div>
            //     )}
            // </div>,
        },
        // {
        //     required: props.required,
        //     label: "Weight",
        //     name: "weight",
        //     rules: [{ required: props.required, message: "Weight is required!" }],
        //     className: "addPatientDetailsModal",
        //     Input: <Input />,
        // },
        {
            required: props.required,
            label: "Gender",
            name: "sex",
            rules: [{ required: props.required, message: "Gender is required!" }],
            className: "addPatientDetailsModal",
            Input: (
                <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={true}
                >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                    <Option value="N/A">Rather not say</Option>
                </Select>
            ),
        },
        {
            required: props.required,
            label: "Date of Birth",
            name: "DOB",
            rules: [
                { required: props.required, message: "Date of birth is required!" },
            ],
            className: "addPatientDetailsModal",
            Input: (
                <DatePicker
                    placeholder="MMM DD YYYY"
                    style={{ width: "60%" }}
                    disabledDate={(current) => {
                        return new Date(current).getTime() > new Date().getTime();
                    }}
                    format={dateFormatList}
                />
            ),
        },
        {
            required: props.required,
            hasFeedback: true,
            label: "Phone",
            name: "phone_contact",
            rules: [
                {
                    required: !props.required,
                    message: "Atleast one contact number is required!",
                },
                {
                    pattern: phone,
                    message: "Please recheck the number entered.",
                },
            ],
            className: "addPatientDetailsModal",
            Input: <Input type="tel" />,
        },
        {
            required: !props.required,
            hasFeedback: true,
            label: "Alternate Phone",
            name: "phone_cell",
            rules: [
                {
                    required: !props.required,
                    message: "Atleast one contact number is required!",
                },
                {
                    pattern: phone,
                    message: "Please recheck the number entered.",
                },
            ],
            className: "addPatientDetailsModal",
            Input: <Input type="tel" />,
        },
        {
            required: !props.required,
            label: "Email",
            name: "email",
            rules: [{ type: "email", message: "Not a valid email" }],
            className: "addPatientDetailsModal",
            Input: <Input />,
        },
        {
            required: !props.required,
            label: "Govt ID proof",
            name: "idtype",
            rules: [
                {
                    required: !props.required,
                    message: "Select one ID type!",
                },
            ],
            className: "addPatientDetailsModal",
            Input: (
                <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={true}
                >
                    <Option value="Aadhar">Aadhar</Option>
                    <Option value="Pan card">Pan Card</Option>
                    <Option value="Driving License">Driving License</Option>
                    <Option value="Indian Passport">Indian Passport</Option>
                    <Option value="Other Passport">Other Passport</Option>
                </Select>
            ),
        },
        {
            required: !props.required,
            hasFeedback: true,
            label: "ID Number",
            name: "idnumber",
            validateFirst: true,
            rules: [
                {
                    required: !props.required,
                    message: "Please enter Govt Id Number",
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        switch (getFieldValue("idtype")) {
                            case "Aadhar":
                                return governmentIdentity.aadhar.test(value) ||
                                    governmentIdentity.aadharWithoutSpace.test(value)
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Not a valid aadhar number!"));
                            case "Pan card":
                                return governmentIdentity.panCard.test(value)
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Not a valid pan card number!"));
                            case "Driving License":
                                return governmentIdentity.drivingLicense.test(value) ||
                                    governmentIdentity.drivingLicenseWithoutSpace
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        new Error("Not a valid driving License number!")
                                    );
                            case "Indian Passport":
                                return governmentIdentity.passport.test(value)
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Not a valid passport number!"));
                            case "Other Passport":
                                return Promise.resolve();
                            default:
                                return Promise.resolve();
                            //FIXME: reject promise if govt ID is required
                            //Promise.reject(new Error('Please select a valid Govt. ID first!'));
                        }
                    },
                }),
            ],
            className: "addPatientDetailsModal",
            Input: <Input type="tel" />,
        },
        {
            required: !props.required,
            label: "Mother's Name",
            name: "mothersname",
            rules: [{ required: !props.required, message: "email is required!" }],
            className: "addPatientDetailsModal",
            Input: <Input />,
        },
        {
            required: !props.required,
            label: "Deceased Date",
            name: "deceased_date",
            rules: [{ required: !props.required, message: "email is required!" }],
            className: "addPatientDetailsModal",
            Input: (
                <DatePicker
                    placeholder="MMM DD YYYY"
                    style={{ width: "60%" }}
                    format={dateFormatList}
                />
            ),
        },
    ];

const BedAllocationForm = (
    props,
    floorsArray,
    locationDetail,
    floor,
    wardsArray,
    ward,
    bedsArray
) => [
        {
            required: !props.required,
            label: "Floor",
            name: "floor",
            rules: [{ required: !props.required, message: "Floor no. is required" }],
            className: "addPatientDetailsModal",

            Input: (
                <Select
                    showSearch
                    placeholder="Floor No."
                    optionFilterProp="children"
                    filterOption={true}
                // onChange={floorChange}
                >
                    {floorsArray.map((item, i) => (
                        <Option key={i} value={i + 1}>
                            {locationDetail.buildings["building_1"]?.floors[item].tag
                                ? locationDetail.buildings["building_1"]?.floors[item].tag
                                : i + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            required: !props.required,
            label: "Ward",
            name: "ward",
            rules: [{ required: !props.required, message: "ward no. is required!" }],
            className: "addPatientDetailsModal",

            Input: (
                <Select
                    showSearch
                    placeholder="Ward No."
                    optionFilterProp="children"
                    filterOption={true}
                    // onChange={wardChange}
                    disabled={floor === null ? true : false}
                >
                    {wardsArray.map((item, i) => (
                        <Option key={i} value={i + 1}>
                            {locationDetail.buildings["building_1"]?.floors[
                                floorsArray[floor - 1]
                            ]?.wards[item].tag
                                ? locationDetail.buildings["building_1"]?.floors[
                                    floorsArray[floor - 1]
                                ]?.wards[item].tag
                                : i + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            required: !props.required,
            label: "Bed",
            name: "bed",
            rules: [{ required: !props.required, message: "bed no. is required!" }],
            className: "addPatientDetailsModal",

            Input: (
                <Select
                    showSearch
                    placeholder="Bed No."
                    optionFilterProp="children"
                    filterOption={true}
                    // onChange={bedChange}
                    disabled={ward === null ? true : false}
                >
                    {bedsArray.map((item, i) => (
                        <Option key={i} value={i + 1}>
                            {i + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
    ];

const practitionersForm = (props, doctorList) => [
    {
        required: !props.required,
        label: "Primary Consultant",
        name: "primary_consultant",
        rules: [
            { required: !props.required, message: "Primary consultant is required" },
        ],
        className: "addPatientDetailsModal",

        Input: (
            <Select
                showSearch
                mode="multiple"
                placeholder="Choose Practitioner"
                showArrow={false}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {doctorList.map((item) => {
                    return (
                        <Option value={item.user_uuid}>
                            {item.fname + " " + item.lname}
                        </Option>
                    );
                })}
            </Select>
        ),
    },
    {
        required: !props.required,
        label: "Secondary Consultant",
        name: "secondary_consultant",
        rules: [
            {
                required: !props.required,
                message: "Secondary consultant is required!",
            },
        ],
        className: "addPatientDetailsModal",

        Input: (
            <Select
                showSearch
                mode="multiple"
                placeholder="Choose Practitioner"
                showArrow={false}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {doctorList.map((item) => {
                    return (
                        <Option value={item.user_uuid}>
                            {item.fname + " " + item.lname}
                        </Option>
                    );
                })}
            </Select>
        ),
    },
    // {
    //     required: !props.required,
    //     label: "Medical State",
    //     name: "medical_state",
    //     rules: [{ required: !props.required, message: 'Medical State is required!' }],
    //     className: "addPatientDetailsModal",

    //     Input: <Input />
    // },
];

const AddressFormItems = (props, setCountry, selectedCountry) => [
    {
        required: !props.required,
        label: "Country",
        name: "country_name",
        rules: [{ required: !props.required, message: "Country is required!" }],
        className: "addPatientDetailsModal",
        Input: (
            <Select
                showSearch
                placeholder="India"
                optionFilterProp="children"
                filterOption={true}
                onSelect={setCountry}
            >
                {countryList.map((country, i) => (
                    <Option key={i} value={country.countryName}>
                        {country.countryName}
                    </Option>
                ))}
            </Select>
        ),
    },
    // {
    //     required: !props.required,
    //     label: "Flat/ House no./Building",
    //     name: "flatNumber",
    //     rules: [{ required: props.required, message: 'House number is required!' }],
    //     className: "addPatientDetailsModal",
    //     Input: <Input />
    // },
    {
        required: !props.required,
        label: "House no., Area, Colony, Street",
        name: "street",
        rules: [{ required: !props.required, message: "Street/Area is required!" }],
        className: "addPatientDetailsModal",

        Input: <Input />,
    },
    {
        required: !props.required,
        label: "Town/City",
        name: "city",
        rules: [{ required: !props.required, message: "city is required!" }],
        className: "addPatientDetailsModal",

        Input: <Input />,
    },
    {
        required: !props.required,
        label: "State / Province / Region",
        name: "state",
        rules: [{ required: !props.required, message: "State is required!" }],
        className: "addPatientDetailsModal",
        Input: (
            <Select
                showSearch
                placeholder="Select region"
                optionFilterProp="children"
                filterOption={true}
            >
                {selectedCountry.length > 0 &&
                    selectedCountry[0]?.regions?.map((region, i) => (
                        <Option key={i} value={region.name}>
                            {region.name}
                        </Option>
                    ))}
            </Select>
        ),
    },
    {
        required: !props.required,
        label: "Pin Code",
        name: "postal_code",
        rules: [
            { required: !props.required, message: "Please input your password!" },
        ],
        className: "addPatientDetailsModal",

        Input: <Input />,
    },
];

const GuardianInfoFormItems = (props, setCountry, selectedCountry) => [
    {
        required: !props.required,
        label: "Guardian's Name",
        name: "guardiansname",
        rules: [
            { required: !props.required, message: "Please input your username!" },
        ],
        className: "addPatientDetailsModal",
        Input: <Input />,
    },
    {
        required: !props.required,
        label: "Gender",
        name: "guardiansex",
        rules: [{ required: !props.required, message: "gender is required!" }],
        className: "addPatientDetailsModal",
        Input: (
            <Select
                showSearch
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={true}
            >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
                <Option value="N/A">Rather not say</Option>
            </Select>
        ),
    },
    {
        required: !props.required,
        label: "Relationship with patient",
        name: "guardianrelationship",
        rules: [
            { required: !props.required, message: "Please input your password!" },
        ],
        className: "addPatientDetailsModal",
        Input: <Input />,
    },
    {
        required: !props.required,
        hasFeedback: true,
        label: "Phone",
        name: "guardianphone",
        rules: [
            {
                required: !props.required,
                message: "Atleast one contact number is required!",
            },
            {
                pattern: phone,
                message: "Please recheck the number entered.",
            },
        ],
        className: "addPatientDetailsModal",
        Input: <Input type="tel" />,
    },
    {
        required: !props.required,
        hasFeedback: true,
        label: "Alternate Phone",
        name: "guardianworkphone",
        rules: [
            {
                required: !props.required,
                message: "Atleast one contact number is required!",
            },
            {
                pattern: phone,
                message: "Please recheck the number entered.",
            },
        ],
        className: "addPatientDetailsModal",
        Input: <Input type="tel" />,
    },
    {
        required: !props.required,
        label: "Email",
        hasFeedback: true,
        name: "guardianemail",
        rules: [{ type: "email", message: "Not a valid email" }],
        className: "addPatientDetailsModal",
        Input: <Input />,
    },
    {
        required: !props.required,
        label: "House no., Area, Colony, Street,",
        name: "guardianaddress",
        rules: [
            { required: !props.required, message: "House number is required!" },
        ],
        className: "addPatientDetailsModal",
        Input: <Input />,
    },
    // {
    //     required: !props.required,
    //     label: " Sector, Village",
    //     name: "guardianstreet",
    //     rules: [{ required: !props.required, message: 'Street/Area is required!' }],
    //     className: "addPatientDetailsModal",
    //     Input: <Input />
    // },
    {
        required: !props.required,
        label: "Town/City",
        name: "guardiancity",
        rules: [{ required: !props.required, message: "city is required!" }],
        className: "addPatientDetailsModal",
        Input: <Input />,
    },
    {
        required: !props.required,
        label: "Country",
        name: "guardiancountry",
        rules: [{ required: !props.required, message: "Country is required!" }],
        className: "addPatientDetailsModal",
        Input: (
            <Select
                showSearch
                placeholder="India"
                optionFilterProp="children"
                filterOption={true}
                onSelect={setCountry}
            >
                {countryList.map((country, i) => (
                    <Option key={i} value={country.countryName}>
                        {country.countryName}
                    </Option>
                ))}
            </Select>
        ),
    },
    {
        required: !props.required,
        label: "State / Province / Region",
        name: "guardianstate",
        rules: [{ required: !props.required, message: "State is required!" }],
        className: "addPatientDetailsModal",
        Input: (
            <Select
                showSearch
                placeholder="Select region"
                optionFilterProp="children"
                filterOption={true}
            >
                {selectedCountry.length > 0 &&
                    selectedCountry[0]?.regions?.map((region, i) => (
                        <Option key={i} value={region.name}>
                            {region.name}
                        </Option>
                    ))}
            </Select>
        ),
    },
    {
        required: !props.required,
        label: "Pin Code",
        name: "guardianpostalcode",
        rules: [{ required: !props.required, message: "city is required!" }],
        className: "addPatientDetailsModal",
        Input: <Input />,
    },
];

export {
    demographicsFormItems,
    AddressFormItems,
    GuardianInfoFormItems,
    BedAllocationForm,
    practitionersForm,
    practitionersSchema,
    demographicSchema,
    locationSchema,
    guardianSchema,
    bedAllocationSchema,
};
