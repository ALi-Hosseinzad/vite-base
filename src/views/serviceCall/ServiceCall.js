import React, { useState } from "react";
import SelectComponent from "components/SelectComponent/SelectComponent";
import InputComponent from "components/input/InputComponent";
import Classes from "./styles/ServiceCall.module.scss";
import TextAreaComponent from "components/textArea/TextArea";
import { Space } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { callDotin, getTokenToCallDotin } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { useDispatch } from "react-redux";
import Dictionary from "helpers/Dictionary";

const items = [
  { id: 1, value: "Get", text: "Get" },
  { id: 2, value: "Post", text: "Post" },
  { id: 3, value: "Put", text: "Put" },
  { id: 4, value: "Delete", text: "Delete" },
];
const ServiceCall = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [response, setResponse] = useState("");
  const [loadingToken, setLoadinToken] = useState(false);
  function formatJson(text) {
    try {
      JSON.parse(text);
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch (error) {
      return text;
    }
  }
  const handleBodyChange = (event) => {
    const formattedText = formatJson(event.target.value);
    setBody(formattedText);
  };
  const handleSend = () => {
    callDotin({
      path: url,
      body: body.replace(/\n/g, "").replace(/\s+/g, " "),
      access_token: token,
    })
      .then((res) => {
        setResponse(formatJson(res.data.body));
      })
      .catch((error) => {
        setResponse(JSON.stringify(error, null, 2));
      });
  };

  const getToken = () => {
    if (branchCode) {
      setLoadinToken(true);
      getTokenToCallDotin({ branch_code: branchCode })
        .then((res) => setToken(res?.data))
        .catch(() => errorHandler(errorResponse))
        .finally(() => setLoadinToken(false));
    } else {
      dispatch(
        setNotificationData({
          message: Dictionary.requiredBranchCode,
          type: "error",
          time: 5000,
        })
      );
    }
  };

  return (
    <div style={{ direction: "ltr", marginLeft: "16px" }}>
      <h1>service call</h1>
      <div className={Classes["token"]}>
        <Space.Compact>
          <InputComponent
            className={Classes["ltr"]}
            placeholder="token"
            value={token}
          />
          <InputComponent
            width={176}
            className={Classes["branch-code"]}
            placeholder="branch code"
            onChange={(e) => {
              setBranchCode(e.target.value);
              setToken("");
            }}
            value={branchCode}
          />
          <label style={{ marginRight: "31px" }}>:token</label>
        </Space.Compact>
        <ButtonComponent
          type="primary"
          onClick={getToken}
          loading={loadingToken}
        >
          get token
        </ButtonComponent>
      </div>
      <div className={Classes["url"]}>
        <Space.Compact>
          <InputComponent
            className={Classes["ltr"]}
            placeholder="api/accounts"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <SelectComponent
            defaultValue="Post"
            name="isEnabled"
            width={176}
            items={items}
          />
          <label>:url</label>
        </Space.Compact>
        <ButtonComponent type="primary" onClick={handleSend}>
          send
        </ButtonComponent>
      </div>
      <div className={Classes["body"]}>
        <label>body:</label>
        <TextAreaComponent
          value={body}
          width={1075}
          direction="rtl"
          onBlur={handleBodyChange}
          placeholder={`{"text": "sample"}`}
          autoSize={{ minRows: 4, maxRows: 8 }}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className={Classes["res"]}>
        <label>Response:</label>
        <TextAreaComponent
          placeholder="Response"
          width={1075}
          rows={25}
          direction="rtl"
          value={response}
        />
      </div>
    </div>
  );
};
export default ServiceCall;
