import React, { Fragment, useState } from "react";
import { Select } from "antd";
import Classes from "components/SelectColor/SelectColor.module.scss";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import Filter from "assets/images/icon/Filter.svg";

const { Option } = Select;

const SelectColor = (props) => {
  const [state, setState] = useState(false);
  const { items, className, width, placeholder, status, onChange, prefix, showSearch, name, loading, ...rest } = props;

  return (
    <Select
      allowClear
      showSearch={showSearch}
      {...rest}
      status={status}
      suffixIcon={
        loading ? (
          <div className={Classes["spinner"]} />
        ) : (
          <CustomIcon src={state ? null : DropDown} size={20} name={`drop-down-icon-${name}`} color="#2B9570" />
        )
      }
      className={`${className}`}
      style={{ width: width }}
      onFocus={!loading ? () => setState(true) : () => ""}
      onBlur={() => setState(false)}
      optionLabelProp="label"
      placeholder={
        <Fragment>
          {!!prefix && (
            <CustomIcon
              className={Classes["select-prefix-icon"]}
              src={Filter}
              size={20}
              name={`filter-icon-${name}`}
              color={state ? "#2B9570" : "#bdbdbd"}
            />
          )}
          {placeholder}
        </Fragment>
      }
      onChange={onChange}
      optionFilterProp="children"
      filterOption={(input, option) => option.children.includes(input)}>
      {items.map((item) => (
        <Option
          className={Classes["color-option"]}
          value={item.value}
          key={item.id}
          label={
            <Fragment>
              {!!prefix && <CustomIcon className={Classes["select-prefix-icon"]} src={Filter} size={20} name="filter-option-icon" color="#bdbdbd" />}
              {item.text}
            </Fragment>
          }>
          <div>
            <div style={{ backgroundColor: `#${item.value}` }}></div>
            <p>{item.text}</p>
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default SelectColor;
