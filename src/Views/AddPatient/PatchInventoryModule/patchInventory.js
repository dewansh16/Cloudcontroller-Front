import React, { useState, useMemo, useEffect } from 'react';
import { notification, Menu, Switch } from 'antd';

import Icons from '../../../Utils/iconMap';
import { isJsonString } from "../../../Utils/utils";
import KitForm from './components/kitForm';
import { UserStore } from "../../../Stores/userStore";
import patientApi from "../../../Apis/patientApis";

import './patchInventory.css';

export default function PatchInventoryModal(props) {
    const layout = {
        labelCol: { sm: 24, md: 30 },
        wrapperCol: { sm: 24, md: 24 },
    };
    const required = true;

    const [menuState, setMenuState] = useState(props.patchClass.list[0].class);
    const [listDeviceAssociated, setListDevice] = useState([]);

    const handleMenuState = ({ item, key }) => {
        setMenuState(key);
        props.resetDataSelect(isIndividualPatchChecked ? 'patch' : 'bundle');
    }

    const [isIndividualPatchChecked, setChecked] = React.useState((props.bundleData.ecg !== null || props.bundleData.spo2 !== null || props.bundleData.temperature !== null || props.bundleData.gateway !== null) ? false : true);

    const handleCheckedState = (value) => {
        setChecked(value)
        setMenuState(props.patchClass.list[0].class)
    }

    const checkWhatFilled = () => {
        if (props.bundleData.ecg !== null || props.bundleData.spo2 !== null || props.bundleData.temperature !== null || props.bundleData.gateway !== null) {
            return false;
        }
        return true;
    }

    const properNameConfig = (type) => {
        switch (type) {
            case 'temperature': return (
                'Temperature'
            );
            case 'ecg': return (
                'ECG'
            );
            case 'spo2': return (
                'Sp02'
            );
            case 'gateway': return (
                'Gateway'
            );
            case 'digital': return (
                'Digital Scale'
            );
            case 'bps': return (
                'BP'
            );
            default: return null
        }
    }

    React.useEffect(() => { }, [menuState, isIndividualPatchChecked]);
    React.useEffect(() => { }, [props.patchClass.list]);

    const associatedList = useMemo(() => {
        let list = [];
        const isString = isJsonString(props.patientData?.associated_list);
        if (isString) {
            list = JSON.parse(props.patientData?.associated_list);
        }
        return list;

    }, [props.patientData]);

    useEffect(() => {
        const { tenant = '' } = UserStore.getUser();

        patientApi
            .getPatientPatches(props?.patientData?.pid, tenant)
            .then((res) => {
                setListDevice(res.data?.response?.patch_patient_map || []);
            })
            .catch((err) => {});
    }, [props?.patientData]);

    // const formatKeyCompare = (keySensor) => ({
    //     "gateway": "gateway",
    //     "ecg": "ecg",
    //     "spo2": "spo2",
    //     "temperature": "temperature",
    //     "digital": "digital",
    // }[keySensor]);

    const checkDisableLayout = (key) => {
        // const formatKey = formatKeyCompare(key);
        if (key !== "bps") {
            if (associatedList?.includes(key)) return true;
            return false;
        } else {
            if (associatedList?.includes("ihealth") || associatedList?.includes("alphamed")) return true;
            return false;
        }
    };
 
    return (
        <div className="formWrapper">
            <div className="menu-container">
                <Menu
                    onClick={handleMenuState}
                    defaultSelectedKeys={[props.patchClass.list[0].class, "bundle"]}
                    mode="inline"
                >
                    {isIndividualPatchChecked && props.patchClass.list.map(listItem =>
                        <Menu.Item
                            key={listItem.class} 
                            className='add-patient-menu-item'
                            // disabled={checkDisableLayout(listItem.class)}
                        >
                            {properNameConfig(listItem.class)}
                        </Menu.Item>
                    )}
                    {!isIndividualPatchChecked && <Menu.Item key="bundle" className='add-patient-menu-item'>
                        Bundle
                    </Menu.Item>}
                </Menu>
            </div>

            <div className="form-container">
                {/* <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", margin: "1rem" }}>
                    <Switch checkedChildren="Individual"
                        disabled={(props.bundleData.ecg === null && props.bundleData.spo2 === null && props.bundleData.temperature === null && props.bundleData.gateway === null &&
                            props.patchData.ecg === null && props.patchData.spo2 === null && props.patchData.temperature === null && props.patchData.gateway === null && props.patchData.alphamed === null && props.patchData.ihealth === null && props.patchData.digitial === null
                        ) ? false : true}
                        unCheckedChildren="Bundle" defaultChecked={checkWhatFilled} onChange={handleCheckedState} />
                </div> */}

                {isIndividualPatchChecked ? <div className="scroll-container">
                    {props.patchClass.list.map((Item) =>
                        menuState === Item.class && <Item.Component
                            pid={props.pid}
                            key={Item.class}
                            layout={layout}
                            required={required}
                            patchData={props.patchData}
                            name={Item.class}
                            savePatchDetails={props.savePatchDetails}
                            form={props.form}
                            type={Item.class}
                            resetDataSelect={props.resetDataSelect}
                            disabled={Item.class !== "gateway" 
                                    ? (checkDisableLayout(Item.class) || !associatedList?.includes("gateway"))
                                    : checkDisableLayout(Item.class)
                                }
                            listDeviceAssociated={listDeviceAssociated}
                            associatedList={associatedList}
                        />
                    )}
                </div> : <div className="scroll-container">
                    <KitForm
                        pid={props.pid}
                        key="bundle"
                        layout={layout}
                        required={required}
                        bundleData={props.bundleData}
                        name="bundle"
                        saveBundleDetails={props.saveBundleDetails}
                        form={props.bundleForm}
                        type="bundle"
                        resetDataSelect={props.resetDataSelect}
                    />
                </div>}
            </div>
        </div>
    );
}