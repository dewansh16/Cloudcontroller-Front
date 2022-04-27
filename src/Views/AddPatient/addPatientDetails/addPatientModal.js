import React, { useState } from 'react';
import { Menu } from 'antd';
import './addPatientDetails.css';

export default function AddPatientModal(props) {
    const required = true;
    const layout = {
        labelCol: { sm: 24, md: 24 },
        wrapperCol: { sm: 24, md: 24 },
    };

    const [menuState, setMenuState] = useState(props.patientClass.list[0].class);

    const handleMenuState = ({ item, key }) => {
        setMenuState(key);
    }

    React.useEffect(() => { }, [menuState])
    React.useEffect(() => { }, [props.patientClass.list])

    return <>
        <div className="formWrapper">
            <div className="menu-container">
                <Menu
                    onClick={handleMenuState}
                    defaultSelectedKeys={[menuState]}
                    mode="inline"
                >
                    {props.patientClass.list.map(listItem =>
                        <Menu.Item key={listItem.class} danger={listItem.error} className='add-patient-menu-item'>
                            {listItem.class}
                        </Menu.Item>
                    )}
                </Menu>
            </div>
            <div className="form-container">
                <div className="scroll-container">
                    {props.patientClass.list.map(Item =>
                        menuState === Item.class && <Item.Component
                            key={Item.class}
                            layout={layout}
                            required={required}
                            patientData={props.patientData}
                            setClass={props.setClass}
                            patientClass={props.patientClass}
                            savePatientDetails={props.savePatientDetails}
                            savePractitionersDetails={props.savePractitionersDetails}
                            form={props.form}
                        />
                    )}
                </div>
            </div>
        </div>
    </>

}

