import { getStatusLoanList } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import { childbearingLoan } from "store/reducers/loan/ChildbearingLoanReducer";
import { marriageLoan } from "store/reducers/loan/MarriageLoanReducer";

export const getStatusListOfLoan = (errorHandler) => {
  return async (dispatch) => {
    dispatch(marriageLoan({ loadingStatus: true }));
    dispatch(childbearingLoan({ loadingStatus: true }));
    getStatusLoanList()
      .then((res) => {
        const convertList = [];
        res?.data?.forEach((node, index) => {
          const convertObj = {
            id: index,
            value: node.key,
            text: node.description,
          };
          convertList.push(convertObj);
        });
        dispatch(
          marriageLoan({ statusList: convertList, loadingStatus: false })
        );
        dispatch(
          childbearingLoan({ statusList: convertList, loadingStatus: false })
        );
      })
      .catch(() => {
        dispatch(marriageLoan({ loadingStatus: false }));
        dispatch(childbearingLoan({ loadingStatus: false }));
        errorHandler(errorResponse);
      });
  };
};
