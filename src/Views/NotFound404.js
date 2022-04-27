import React from 'react'
export default function NotFound404() {
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            position: "relative",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <iframe src="https://giphy.com/embed/YyKPbc5OOTSQE" title="404giphy" width="70%" height="70%" style={{ position: "absolute" }} frameBorder="0" className="giphy-embed" ></iframe>
        </div>);
}