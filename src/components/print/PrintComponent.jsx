import React, { useEffect, useCallback, useRef, useState } from "react";
import ButtonComponent from "components/button/ButtonComponent";
import { useReactToPrint } from "react-to-print";
import Dictionary from "helpers/Dictionary";
import Classes from "components/print/PrintComponent.module.scss";
import { Space } from "antd";

export const PrintComponent = ({ children, title, classNameBtn, onClick, wrapperClassName, secondClassName }) => {
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (text === "New, Updated Text!" && typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <div>
      {loading && <p className={Classes.indicator}>{Dictionary.loading}</p>}
      <div className={wrapperClassName}>
        <div className={secondClassName}>
          <div ref={componentRef} className={Classes.print} text={text}>
            {children}
          </div>
        </div>
      </div>
      <ButtonComponent
        type="primary"
        htmlType="button"
        classNameBtn={classNameBtn}
        loading={loading}
        onClick={() => {
          handlePrint();
          onClick && onClick();
        }}>
        {title}
      </ButtonComponent>
    </div>
  );
};
