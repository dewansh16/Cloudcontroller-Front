import React from "react";
import Icons from "../../../Utils/iconMap";
import { Select } from "antd";
const { Option } = Select;

export default function TrendTimeSelector({
    timeIntervalOptions,
    valDuration,
    onSelectValDuration
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-around",
                minWidth: "12.5rem",
                alignItems: "center",
                gap: "0.4rem",
            }}
        >
            <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "1.25em" }}>
                    Duration
                </p>
            </div>
            <Select
                onSelect={onSelectValDuration}
                value={valDuration}
                style={{ fontWeight: "600", borderRadius: "6px", width: "100%" }}
                suffixIcon={Icons.downArrowFilled({
                    style: { color: "black", pointerEvents: "none" },
                })}
            >
                {timeIntervalOptions.map((item, i) => (
                    <Option key={i} value={item.val}>
                        {item.name}
                    </Option>
                ))}
            </Select>
        </div>
    );
}
