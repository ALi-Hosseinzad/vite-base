import ButtonComponent from "components/button/ButtonComponent";
import { deleteExpression } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { expression } from "store/reducers/expression/expressionReducer";
import Classes from "views/expression/styles/expression.module.scss";

const DeleteExpression = () => {
  const dispatch = useDispatch();
  const expressionData = useSelector((state) => state.expression.value);
  const record = expressionData.record;
  const errorHandler = useErrorHandler();

  const handleDelete = () => {
    deleteExpression(record?.id)
      .then(() =>
        dispatch(
          expression({
            reload: !expressionData.reload,
            record: "",
            deleteModal: false,
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <div className={Classes["expression-delete-modal"]}>
      <div className={Classes["expression-note-delete-modal"]}>
        آیا مایل به حذف جمله <span>{` "${record.expression}" `}</span>
        از رویداد <span>{` "${record.eventDescription}" `}</span> هستید؟
      </div>
      <div className={Classes["expression-delete-modal-buttons"]}>
        <ButtonComponent
          type="danger"
          htmlType="button"
          classNameBtn={Classes["expression-delete-modal-confirm-button"]}
          onClick={() => handleDelete()}
        >
          {Dictionary.delete}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["expression-delete-modal-cancel-button"]}
          type="default"
          onClick={() =>
            dispatch(expression({ record: "", deleteModal: false }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default DeleteExpression;
