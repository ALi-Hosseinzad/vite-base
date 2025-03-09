import React, { forwardRef, useState } from "react";
import { Input } from "antd";
import Classes from "components/SearchInput/SearchInput.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import SearchLogo from "assets/images/icon/Search.svg";
import closeIcon from "assets/images/icon/Close.svg";
const { Search } = Input;

const SearchInput =forwardRef(({ ...props }, ref) => {
  const [state, setState] = useState(false);
  const { onSearch, width, placeholder, className, iconName } = props;

  return (
    <Search
      ref={ref}
      prefix={<CustomIcon src={SearchLogo} name={`${iconName}-icon`} color={state ? "#145d32" : "#bdbdbd"} size={20} />}
      placeholder={placeholder}
      allowClear={{ clearIcon: <CustomIcon src={closeIcon} name={`${iconName}-close-icon`} size={20} color="#2A2A2A" /> }}
      onBlur={() => setState(false)}
      onFocus={() => setState(true)}
      onSearch={onSearch}
      style={{ width: width }}
      className={`${Classes.searchInput} ${className}`}
    />
  );
});
export default SearchInput;
