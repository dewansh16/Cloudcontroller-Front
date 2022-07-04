import React from 'react';

import Select from 'antd/lib/select'
import IconCheck from "../../../Assets/Images/check.svg";

const { Option } = Select;

const SelectTagsPatient = (props) => {
    const { valSelectSearch, tagsSelected, setTagsSelected, arrayOptionTags, onInputChange, colorSelected, setColorSelected } = props;

    const arrayColor = ["#ff0000", "#ff00bf", "#4000ff", "#00ff00", "#ffff00", "#ff8000"];

    const renderColorsTags = () => {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                {arrayColor?.map(color => {
                    const isActive = colorSelected === color || false;
                    return (
                        <div
                            key={color}
                            className="color-item"
                            style={{ display: "flex", alignItems: "center" }}
                            onClick={() => setColorSelected(color)}
                        >
                            <div className="box-color" style={{
                                background: color,
                            }}>
                                {isActive && (
                                    <img src={IconCheck} className="icon-check-color" />
                                )}
                            </div>
                            <div className={`color-text ${isActive ? "text-active" : ""}`}>{color}</div>
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
                style={{ background: tagFound?.color }}
            >
                {props?.label}
            </div>
        );
    }

    return (
        <Select
            showSearch
            mode="multiple"
            placeholder="Select tags"
            filterOption={true}
            onSearch={(val) => onInputChange(val)}
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
                        }}>
                        </div>
                        <div>{tag?.value}</div>
                    </Option>
                )
            })}
        </Select>
    );
}

export default SelectTagsPatient;
