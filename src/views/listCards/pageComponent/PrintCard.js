import React, {
  Fragment,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { useReactToPrint } from "react-to-print";
import Variables from "assets/styles/_Variables.scss";
import ButtonComponent from "components/button/ButtonComponent";
import { listCardsState } from "store/reducers/listCards/listCardsReducer";
import Classes from "views/listCards/styles/PrintAndSendToCustomer.module.scss";

const PrintCard = () => {
  const componentRef = useRef(null);
  const [style, setStyle] = useState(false);
  const [loading, setLoading] = useState(false);
  const onBeforeGetContentResolve = useRef(null);
  const listCardsData = useSelector(listCardsState);
  const [text, setText] = useState("old boring text");
  const { record } = listCardsData;

  const handleAfterPrint = useCallback(() => {
    setStyle(false);
  }, []);

  const handleBeforePrint = useCallback(() => {
    setStyle(true);
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
    documentTitle: "24",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  const handleClick = () => {
    setStyle(true);
    handlePrint();
  };

  useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <Fragment>
      <div className={Classes["print-container"]}>
        {loading && <p className={Classes.indicator}>{Dictionary.loading}</p>}
        <div className={Classes["print-wrapper"]}>
          <div
            ref={componentRef}
            text={text}
            className={Classes["print-wrapper-print"]}
          >
            <div
              className={Classes["print-part"]}
              style={
                style ? { marginTop: "25%", transform: "rotate(180deg)" } : {}
              }
            >
              <div className={Classes["print-sender"]}>
                <p style={style ? { marginRight: 150 } : {}}>
                  شرکت توسعه تجارت الکترونیک نگاه پرداخت فردای کارآفرین
                </p>
                <p style={style ? { marginRight: 200, width: 350 } : {}}>
                  تهران،بلوار آفریقا،خیابان ناهید غربی،پلاک 36،طبقه 1، واحد 104،
                  واحد کارت
                </p>
                <p style={style ? { marginRight: 150, marginTop: 55 } : {}}>
                  1967756974
                </p>
                <p style={style ? { marginRight: 400 } : {}}>
                  {Dictionary.phone}: 02179468000
                </p>
                <p style={style ? { marginRight: 445 } : {}}>021-23350</p>
                <p style={style ? { marginRight: 150, marginTop: 20 } : {}}>
                  {record?.fullName}
                </p>
                <p style={style ? { marginRight: 180, width: 350 } : {}}>
                  {record?.address}
                </p>
                <p style={style ? { marginRight: 150, marginTop: 58 } : {}}>
                  {record?.postalCode}
                </p>
                <p style={style ? { marginRight: 400 } : {}}>
                  {Dictionary.mobile}: {record?.mobileNumber || "--"}
                </p>
              </div>

              {record?.postal_barcode && (
                <div
                  className={Classes["bar-code"]}
                  style={
                    style
                      ? { marginTop: 16, marginRight: 150 }
                      : { marginRight: 16 }
                  }
                >
                  <Barcode
                    width={1}
                    height={48}
                    fontSize={14}
                    format="CODE128"
                    displayValue={false}
                    font={Variables.Regular}
                    value={record?.postal_barcode}
                    lineColor={Variables.GreyDark5}
                  />
                  <span>{record?.postal_barcode}</span>
                </div>
              )}
            </div>
          </div>
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
export default PrintCard;
