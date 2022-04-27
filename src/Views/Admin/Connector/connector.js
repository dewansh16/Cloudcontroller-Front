import React from 'react';
import { Steps, Popover } from 'antd';
import ConnectorModule from './components/connectorModule';
import ConnectorFileUpload from './components/connectorFileUpload';
import Summary from './components/summary';
import './connector.css';

const { Step } = Steps;

const steps = (setError, setCurrent, pid, setPid) => [
    {
        title: 'Connector',
        content: <ConnectorFileUpload />,
    },
    {
        title: 'Summary',
        content: <Summary />,
    }
];


const customDot = (dot, { status, index }) => (
    <Popover
        content={
            <span>
                step {index + 1} status: {status}
            </span>
        }
    >
        <div className={status === "error" ? "outerDotError" : "outerDot"}>
            {console.log(status)}
            <div className={status === "error" ? "innerDotError" : "innerDot"}>
                <span className="dotInnerText">{index + 1}</span>
            </div>
        </div>
    </Popover>
);



export default function Connector() {

    const [current, setCurrent] = React.useState(0);

    const [error, setError] = React.useState(false);
    const onChange = (val) => {
        setCurrent(val)
    }
    return (
        <>
            <div className="flex-container">
                <div className="addPatientMainContainer">
                    <Steps className="addPatientSteps" current={current} status={error ? "error" : "wait"} progressDot={customDot} onChange={onChange}>
                        {steps().map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div >{steps(setError, setCurrent)[current].content}</div>
                </div>
            </div>
        </>
    );
}