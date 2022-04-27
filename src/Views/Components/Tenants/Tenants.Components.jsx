import React from 'react';
import CardBody from './Components/CardBody/cardBody.Tenants.Components';
import './Tenants.css'

const Tenants = (props) => {

    return (
        <div className='main-body'>
            <CardBody setTenantModal={props.setTenantModal} />
        </div>
    )
}

export default Tenants;