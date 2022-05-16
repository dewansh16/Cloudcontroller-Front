import React, { useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import moment from "moment";

function checkErroredValues(type, value) {
    let types = ["temp", "hr", "pi", "pr", "rr"];
    if (types.includes(type.toLowerCase())) {
        return (value < 999 && value > -1)
    } else {
        return (value < 251 && value > -1)
    }
}


export default function Ecg({ pid }) {
    const [chartData, setChartData] = React.useState([]);
    const [tickVal, setTickVal] = React.useState(0);
    const [isLoading, setLoading] = React.useState(false);
    const [isConnected, setConnected] = React.useState(false);
    const [hasError, setError] = React.useState(undefined);
    const [isPaused, setPaused] = React.useState(false);
    const [intervalID, setIntervalID] = React.useState(null);
    const [vitals, setVitals] = React.useState({
        spo2: 0,
        temp: 0,
        tempinF: 0,
        hr: 0,
        motion: "",
        pi: 0,
        pr: 0,
        rr: 0,
    })
    const [time, setTime] = React.useState(null)
    let client = useRef(null);

    useEffect(() => {
        client.current = new W3CWebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ecg?pid=${pid}`);
        client.current.onopen = () => {
            console.log('WebSocket client.current Connected');
            setLoading(false);
            setConnected(true);
        };
        client.current.onerror = (error) => {
            setError("Unable to tap into patient vitals 😔");
            setLoading(false);
        };
        client.current.onclose = () => {
            setError("Unable to tap into patient vitals 😔.")
            console.log('ECG was closed');
        }
    }, [pid])

    useEffect(() => {
        if (!client.current) return;
        let ticker = tickVal;
        client.current.onmessage = (message) => {
            // let arr = chartData
            let arr = [];
            if (isPaused) return;
            var data = JSON.parse(message.data);
            setVitals({
                spo2: checkErroredValues("spo2", data.spo2) ? data.spo2 : 0,
                temp: checkErroredValues("temp", data.temperature) ? data.temperature : 0,
                tempinF: checkErroredValues("temp", (data.temperature * (9 / 5)) + 32) ? (data.temperature * (9 / 5)) + 32 : 0,
                rr: checkErroredValues("rr", data.rr) ? data.rr : 0,
                hr: checkErroredValues("hr", data.hr) ? data.hr : 0,
                motion: data.motion,
                pi: checkErroredValues("pi", data.pi) ? data.pi : 0,
                pr: checkErroredValues("pr", data.pr) ? data.pr : 0,
            })
            // local copy of the chartData to process
            // each data has 128 elements   []
            chartData.map(item => {

                arr.push(item);
            })
            data.ecg.map((item, index) => {
                arr.push({
                    x: ticker,
                    y: item,
                });
                ++ticker;
                if (arr.length > (128 * 6) - 1) {
                    arr.splice(0, 1);
                }
            });
            // replace chartData with array
            setChartData(arr)
            setTickVal(ticker)
        }
        let intervalId = setInterval(() => {
            let date = Date.now();
            setTime(moment(date).format('hh:mm:ss a'))
        })
        setIntervalID(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartData, tickVal, isPaused])

    useEffect(() => {
        return () => {
            client.current.close();
            clearInterval(intervalID);
            setConnected(false);
        }
    }, [])
    return { chartData, vitals, time, isPaused, setPaused, isLoading, isConnected, hasError }
}
