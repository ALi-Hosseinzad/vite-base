import React, {
  Fragment,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import Classes from "views/listCards/styles/PrintAndSendToCustomer.module.scss";
import { useReactToPrint } from "react-to-print";
import ButtonComponent from "components/button/ButtonComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";

const PrintCustomerPassword = () => {
  const dispatch = useDispatch();
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleAfterPrint = useCallback(() => {
    dispatch(
      listCustomers({
        reload: !listCustomersData.reload,
        modal: false,
        current: 0,
      })
    );
  }, []);

  const pageStyle = `
  @page {
    size: auto;
    overflow:none;
  }
`;

  const handleOnBeforeGetContent = useCallback(() => {
    setLoading(true);
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
  }, [setLoading]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "CustomerPassword",
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });
  const handleClick = () => {
    handlePrint();
  };
  return (
    <Fragment>
      <div>
        {loading && <p className={Classes.indicator}>{Dictionary.loading}</p>}
        <div
          ref={componentRef}
          className={Classes["print-password-of-customer"]}
        >
          <p>{Dictionary.platformPassword}:</p>
          <p className={Classes["english-password"]}>
            {listCustomersData.password}
          </p>
        </div>
      </div>
      <ButtonComponent
        type="primary"
        htmlType="button"
        classNameBtn={Classes["print-button"]}
        loading={loading}
        onClick={handleClick}
      >
        {Dictionary.print}
      </ButtonComponent>
    </Fragment>
  );
};

export default PrintCustomerPassword;
