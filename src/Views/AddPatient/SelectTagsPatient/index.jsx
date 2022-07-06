import React, { useState } from 'react';

import Select from 'antd/lib/select'
import IconCheck from "../../../Assets/Images/check.svg";
import IconCheckBlack from "../../../Assets/Images/checkBlack.svg";

const { Option } = Select;

const SelectTagsPatient = (props) => {
    const { tagsSelected, setTagsSelected, arrayOptionTags, setArrOptionTags, onBlur } = props;

    const [valSelectSearch, setValSelectSearch] = useState("");
    const [colorSelected, setColorSelected] = useState("#ffffff");

    const arrayColor = [
        {color: "#ffffff", title: "White" },
        {color: "#ff0000bd", title: "Red" },
        {color: "#ff00bfb5", title: "Pink" },
        {color: "#4000ffd9", title: "Blue" },
        {color: "#008000cf", title: "Green" },
        {color: "#cfcf17", title: "Yellow" },
        {color: "#ffa500", title: "Orange" },
    ];

    const renderColorsTags = () => {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                {arrayColor?.map(item => {
                    const isActive = colorSelected === item?.color || false;
                    return (
                        <div
                            key={item?.color}
                            className="color-item"
                            style={{ display: "flex", alignItems: "center" }}
                            onClick={() => setColorSelected(item?.color)}
                        >
                            <div className="box-color" style={{
                                background: item?.color,
                                border: item?.color === "#ffffff" ? "1px solid #ddd" : ""
                            }}>
                                {isActive && (
                                    <img src={item?.color === "#ffffff" ? IconCheckBlack : IconCheck} className="icon-check-color" />
                                )}
                            </div>
                            <div className={`color-text ${isActive ? "text-active" : ""}`}>{item?.title}</div>
                        </div>
                    )
                })}
            </div>
        )
    };

    const tagRender = (props) => {
        const tagFound = arrayOptionTags?.find(tag => tag?.value === props?.value);
        return (
            <div
                className="item-tag-render"
                style={{ 
                    background: tagFound?.color,
                    color: tagFound?.color === "#ffffff" ? "#000000" : "",
                    border: tagFound?.color === "#ffffff" ? "1px solid #ddd" : ""
                }}
            >
                {props?.label}
            </div>
        );
    }

    const onChangeValInputTagsAdd = (val) => {
        const value = val?.trim();

        if (value.includes(";") || value.includes(",")) {
            setValSelectSearch("");

            if (!tagsSelected?.includes(valSelectSearch) && value?.length > 1) {
                const dataNew = {
                    label: valSelectSearch,
                    value: valSelectSearch,
                    color: colorSelected
                };
                
                setArrOptionTags([...arrayOptionTags, dataNew]);
                setTagsSelected([...tagsSelected, dataNew]);
            }
        } else {
            setValSelectSearch(value);
        }
    };

    const onSelectBlur = () => {
        if (typeof onBlur === "function") {
            return onBlur();
        }
        return null;
    }

    return (
        <Select
            showSearch
            mode="multiple"
            placeholder="Select tags"
            style={{ width: "100%" }}
            filterOption={true}
            onSearch={(val) => onChangeValInputTagsAdd(val)}
            autoClearSearchValue={false}
            searchValue={valSelectSearch}
            value={tagsSelected?.map(tag => tag?.value)}
            onDeselect={(val) => {
                const newArr = tagsSelected?.filter(tag => tag?.value !== val);
                setTagsSelected(newArr);
            }}
            onSelect={(val) => {
                const tagFound = arrayOptionTags?.find(item => item?.value === val);
                setTagsSelected([...tagsSelected, tagFound]);
            }}
            onBlur={onSelectBlur}
            notFoundContent={
                valSelectSearch && (
                    <>
                        {renderColorsTags()}
                        <span style={{ fontSize: "12px", color: "#ff7529" }}>
                            Enter , or ; to create a new tag
                        </span>
                    </>
                )
            }
            open={true}
            tagRender={(props) => tagRender(props)}
        >
            {arrayOptionTags?.map(tag => {
                return (
                    <Option 
                        key={tag?.value} 
                        value={tag?.value} 
                        className="item-option-tags"
                    >
                        <div className="box-color-option" style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "4px",
                            marginRight: "6px",
                            background: tag?.color,
                            border: tag?.color === "#ffffff" ? "1px solid #ddd" : ""
                        }}>
                        </div>
                        <div style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}>{tag?.value}</div>
                    </Option>
                )
            })}
        </Select>
    );
}

export default SelectTagsPatient;
