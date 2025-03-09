import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import Classes from "views/listCards/styles/ListCards.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import { charities } from "store/reducers/charity/charityReducer";
import ModalComponent from "components/modalComponent/ModalComponent";
import TableComponent from "components/table/TableComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import Edit from "assets/images/icon/Edit.svg";
import SwitchComponent from "components/switch/SwitchComponent";
import AddNewCharityModal from "./pageComponent/AddNewCharityModal";
import { getCharity, updateCharity } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { MatchAuthority } from "helpers/MatchAuthority";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import Variables from "assets/styles/_Variables.scss";

const Charity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const [permissions, setPermissions] = useState({
    edit: true,
    create: true,
  });
  const listCharityData = useSelector((state) => state.charities.value);
  const userInfoData = useSelector((state) => state.userInfo.value);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
  const crateTable = () => {
    getCharity(createSearchObject(searchParams, { sortBy: "-createdDate" }))
      .then((res) => {
        const convert = res.data.data?.map((node) => {
          return {
            id: node.id,
            name: node.charity_name,
            accountNumber: node.charity_account_number,
            site: node.website,
            enable: !node.disable,
            key: node.charity_key,
            charity_description: node.charity_description,
          };
        });
        dispatch(
          charities({
            list: convert,
            totalRows: res.data.total_rows,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  const onChange = (record) => {
    updateCharity({
      charity_key: record.key,
      charity_name: record.name,
      charity_account_number: record.accountNumber,
      disable: record.enable,
    })
      .then(() => dispatch(charities({ reload: !listCharityData.reload })))
      .catch(() => errorHandler(errorResponse));
  };
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "5%",
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return index + 1;
        } else {
          return (
            ((pagination.pageNumber === 0
              ? pagination.pageNumber + 1
              : pagination.pageNumber) -
              1) *
              pagination.recordsPerPage +
            (index + 1)
          );
        }
      },
    },
    {
      key: "enable",
      dataIndex: "enable",
      width: "10%",
      render: (_field, record) => (
        <TooltipComponent
          title={!record.enable ? Dictionary.enable : Dictionary.disable}
        >
          <SwitchComponent
            disabled={!permissions.edit}
            defaultChecked={record.enable}
            onChange={() => onChange(record)}
          />
        </TooltipComponent>
      ),
    },
    {
      title: Dictionary.InstitutionName,
      key: "name",
      dataIndex: "name",
      width: "30%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.accNo,
      key: "accountNumber",
      dataIndex: "accountNumber",
      width: "15%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.site,
      key: "site",
      dataIndex: "site",
      width: "30%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },

    {
      key: "status",
      dataIndex: "status",
      className: "table-th-status",
      width: "10%",
      render: (_field, record) => (
        <div className={Classes["list-charity-action"]}>
          <TooltipComponent title={permissions.edit && Dictionary.edit}>
            <span
              onClick={() =>
                permissions.edit &&
                dispatch(charities({ modal: true, record: record, edit: true }))
              }
            >
              <CustomIcon
                color={
                  permissions.edit
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
                cursor={permissions.edit ? "pointer" : "default"}
                src={Edit}
                size={24}
                name={`list-charity-${record.id}-edit`}
              />
            </span>
          </TooltipComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        edit: MatchAuthority(
          userInfoData.authorities,
          "Put:/api/bo/charity/v1"
        ),
        create: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/charity/v1"
        ),
      });
    } else {
      setPermissions({
        edit: true,
        create: true,
      });
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      crateTable();
    }
  }, [listCharityData.reload, searchParams]);
  useEffect(() => {
    let newQueryParam = {
      pageNumber: pagination.pageNumber,
      recordsPerPage: pagination.recordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "pageNumber" && key !== "recordsPerPage") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [pagination.pageNumber, pagination.recordsPerPage]);

  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={Dictionary.charity}
          onClick={() => dispatch(charities({ modal: true, edit: false }))}
          buttonText={Dictionary.addCharity}
        />
      ) : (
        <HeaderPage title={Dictionary.charity} />
      )}
      <ModalComponent
        title={`${Dictionary.add} ${Dictionary.addCharity}`}
        open={listCharityData.modal}
        onCancel={() => dispatch(charities({ modal: false }))}
      >
        <AddNewCharityModal />
      </ModalComponent>
      <TableComponent
        columns={columns}
        dataSource={listCharityData.list}
        count={50}
      />
      {listCharityData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={listCharityData.totalRows}
        />
      )}
    </div>
  );
};
export default Charity;
