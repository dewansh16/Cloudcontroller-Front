import React, { useState } from 'react';
import Landing from './Views/auth';
import DomainSettings from './Views/domainSettings';
import Icons from './Utils/iconMap';
import { Image } from 'antd';
import clientBrand from './Assets/Images/clientLogo.png'
// import backgroundLanding from './Assets/Images/landingBackground.png'
// import Loader from './Assets/loader/loader'
import './homepage.css';
import Modal from 'antd/lib/modal/Modal';
import { buildNumber } from "./Utils/buildNumber";

function HomePage() {
    const [domainSettingsVisibility, setDomainSettingsVisibility] = useState(false);
    
    const showDomainSettings = () => {
        setDomainSettingsVisibility(true)
    }

    const showDomainSettingsOnCancel = () => {
        setDomainSettingsVisibility(false)
    }

    return <><div className='mainContainer' >
        <div className='authContainer'>
            <div className='form'>
                <h2>Welcome Back</h2>
                <Landing showModal={showDomainSettings} />
            </div>
        </div>

        <div className="branding">
            <div className="clientBrand">
                <Image width="300" src={clientBrand} preview={false} />
            </div>
            <div className="heroBrand">
                <span className="poweredby">Powered by </span>
                {Icons.heroIcon({ Style: { fontSize: '1em' } })}
                <span className="live247">Live247.ai</span>
            </div>
        </div>

        <div className='build-number'>
            {"Build: "}
            <span className='number'>{buildNumber}</span>
        </div>
    </div>
        <Modal
            width="40%"
            visible={domainSettingsVisibility}
            onCancel={showDomainSettingsOnCancel}
            centered
            footer={null}
        >
            <DomainSettings onCancel={showDomainSettingsOnCancel} />
        </Modal>
    </>
}

export default HomePage;