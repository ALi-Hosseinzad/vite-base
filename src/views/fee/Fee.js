import React, { useEffect } from "react";
import Dictionary from "helpers/Dictionary";
import FeePage from "./pageComponents/FeePage";
import { useDispatch, useSelector } from "react-redux";
import { MatchAuthority } from "helpers/MatchAuthority";
import HeaderPage from "components/headerPage/HeaderPage";
import { fee, feeState, resetFee } from "store/reducers/fee/FeeReducer";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";

const Fee = () => {
  const dispatch = useDispatch();
  const feeData = useSelector(feeState);
  const userInfoData = useSelector(userInfoState);

  useEffect(() => {
    return () => dispatch(resetFee());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        fee({
          permissions: {
            edit: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/fee/fee-config/update/v1"
            ),
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/fee/fee-config/search/v1"
            ),
          },
        })
      );
    } else {
      dispatch(fee({ permissions: { view: true, edit: true } }));
    }
  }, [userInfoData.authorities]);

  return (
    <div>
      <HeaderPage title={Dictionary.fee + " " + Dictionary.services} />
      {feeData?.permissions?.view && <FeePage />}
    </div>
  );
};
export default Fee;
