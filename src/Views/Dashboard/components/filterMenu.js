import React from 'react';
import { Row, Col, Slider } from 'antd';
import { Button } from '../../../Theme/Components/Button/button';


const FilterMenu = (filters, setFilters, filterPatients, patientList, setPatientList, filtersConfig) => {

    const ewsScores = {
        0: '0',
        5: '5',
        10: '10',
        15: '15',
        20: '20',
        25: '25',
    }
    const spo2Scores = {
        55: '55%',
        65: '65%',
        75: '75%',
        85: '85%',
        100: '100%',
    }

    const setFilterValues = (values, type) => {

        switch (type) {
            case 'ews': {
                setFilters({
                    ...filters,
                    ews: values
                })
                break;
            }
            case 'spo2': {
                setFilters({
                    ...filters,
                    spo2: values
                })
                break;
            }
            case 'rr': {
                setFilters({
                    ...filters,
                    rr: values
                })
                break;
            }
            default: break;
        }
    }

    // const [sliderValues, setSliderValues] = React.useState({
    //     'ews': [1, 10],
    //     'spo2': [55, 100],
    //     'rr': [0, 100],
    // });

    const applyFilters = () => {
        let data = filterPatients(patientList);
        setPatientList(data);
    }

    const resetFilters = () => {
        setFilters(filtersConfig)
        setPatientList(patientList);
    }

    return <Row gutter={[8, 32]} style={{ padding: "2em", minWidth: "30rem" }}>
        <Col span={24} style={{ height: "6rem" }}>
            <h3>EWS</h3>
            <Slider range min={0} max={25} value={[`${filters.ews[0]}`, `${filters.ews[1]}`]} marks={ewsScores} onChange={(values) => setFilterValues(values, 'ews')} />
        </Col>
        <Col span={24} style={{ height: "6rem" }}>
            <h3>SpO2 levels</h3>
            <Slider range min={55} max={100} value={[`${filters.spo2[0]}`, `${filters.spo2[1]}`]} marks={spo2Scores} onChange={(values) => setFilterValues(values, 'spo2')} />
        </Col>
        <Col span={24} style={{ height: "6rem" }}>
            <h3>Respiration Rate</h3>
            <Slider range min={0} max={100} value={[`${filters.rr[0]}`, `${filters.rr[1]}`]} marks={spo2Scores} onChange={(values) => setFilterValues(values, 'rr')} />
        </Col>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: "2em" }}>
            <Button onClick={applyFilters} type="secondary">Apply</Button>
            <Button onClick={resetFilters} type="secondary">Reset</Button>
        </div>
    </Row>
}

export default FilterMenu;