import React from 'react';
// import { motion, AnimatePresence } from "framer-motion";
// import { wrap } from "popmotion";
import { Menu, Button, Image } from 'antd';
// import chargingStep1 from '../../../Assets/Images/PatchInstructions/chargingStep1.jpg';
// import chargingStep2 from '../../../Assets/Images/PatchInstructions/chargingStep2.jpg';
import patchStep1 from '../../../Assets/Images/PatchInstructions/patchStep1.jpg';
import patchStep2 from '../../../Assets/Images/PatchInstructions/patchStep2.jpg';
import patchStep3 from '../../../Assets/Images/PatchInstructions/patchStep3.jpg';
import patchStep4 from '../../../Assets/Images/PatchInstructions/patchStep4.jpeg';
import './patchGuide.css';
import { useState } from 'react';
// const { Meta } = Card;


const Card = ({ properties }) => {
    const { image, title, description } = properties;
    return <div className="guide-card" >
        <Image className="card-image" style={{ marginBottom: "2em" }} height="130px" src={image} alt="guide" />
        <div style={{ padding: "1rem" }}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </div>
}


const PatchGuide = () => {

    const cardArray = [
        {
            id: 0,
            title: "Ecg",
            description: "package and contents",
            image: patchStep1
        },
        {
            id: 1,
            title: "Ecg",
            description: "ecg patch with sticker",
            image: patchStep2
        },
        {
            id: 2,
            title: "Ecg",
            description: "patch without sticker",
            image: patchStep3
        },
        {
            id: 3,
            title: "Ecg",
            description: "applying patch",
            image: patchStep4
        }
    ]

    const [patientClass, setClass] = useState({
        list: [
            {
                class: "ECG",
                error: false,
                added: false,
            },
            {
                class: "SPO2",
                error: false,
                added: false,
            },
            // {
            //     class: "Hospital Info",
            //     error: false,
            //     added: false,
            //     Component: DoctorDetails
            // },
            {
                class: "Temperature",
                error: false,
                added: false,
            },
            //TODO: add or remove from schema
            // {
            //     class: "Insurance",
            //     error: false,
            //     added: false,
            //     Component: InsuranceDetails
            // },
        ]
    })
    const [menuState, setMenuState] = useState(patientClass.list[0].class);


    const [index, setIndex] = useState(0);
    React.useEffect(() => { }, [index])
    const prev = () => {

        if (index > 0) {
            setIndex(index - 1)
        }
    }
    const next = () => {
        if (index < cardArray.length - 1) {
            setIndex(index + 1)
        }
    }
    const handleMenuState = ({ item, key }) => {
        console.log(item, key)
        setMenuState(key);
    }

    return <>
        <div className="menu-container">
            <Menu
                onClick={handleMenuState}
                defaultSelectedKeys={[menuState]}
                mode="inline"
            >
                {patientClass.list.map(listItem =>
                    <Menu.Item key={listItem.class} className='add-patient-menu-item'>
                        {listItem.class}
                    </Menu.Item>
                )}
            </Menu>
        </div>
        <div className='guide-card-slider'>
            <div className="guide-card-slider-wrapper" style={{
                transform: `translateX(-${index * (100 / cardArray.length)}%)`
            }}>
                {cardArray.map((item, i) =>
                    <Card key={i} properties={item} active={index === i} />

                )}
                {/* <Card properties={cardArray[0]} /> */}
            </div>
        </div>
        <div className="button-wrapper">
            <Button shape="circle" onClick={prev} className="prev"> {"<"} </Button>
            <Button shape="circle" onClick={next} className="next">{'>'}</Button>
        </div>
    </>
    // index === i ? '2px solid lightblue !important' : 'none'
}

export default PatchGuide;



