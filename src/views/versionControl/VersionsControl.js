import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { versions } from "store/reducers/versions/versionsReducer";
import Dictionary from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import TooltipComponent from "components/tooltip/TooltipComponent";
import VisibleGrey from "assets/images/icon/VisibleGrey.svg";
import Edit from "assets/images/icon/Edit.svg";
import TableComponent from "components/table/TableComponent";
import Classes from "./styles/Versions.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import ModalComponent from "components/modalComponent/ModalComponent";
import VersionDetails from "./pageComponent/VersionsDetails";
import VersionEdit from "./pageComponent/VersionEdit";
import { getAllVersions } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { useNavigate } from "react-router-dom";

const VersionsControl = () => {
  const dispatch = useDispatch();
  const listVersions = useSelector((state) => state.versions.value);
  const errorHandler = useErrorHandler();
  const navigate = useNavigate();

  const crateTable = () => {
    getAllVersions()
      .then((res) => {
        dispatch(
          versions({
            list: res?.data,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  useEffect(() => {
    crateTable();
  }, [listVersions.refresh]);

  const handleDetails = (record) => {
    const apps = [];
    const checkSums = [];
    if (record?.operating_system?.toLowerCase() !== "browser") {
      if (record?.checksums) {
        Object?.keys(record?.checksums)?.forEach((item, index) => {
          checkSums.push({
            version: item,
            checksum: Object?.values(record?.checksums)[index],
            forceVersion:
              record.exception_versions.length > 0
                ? record.exception_versions.find((val) => item === val)
                : false,
          });
        });
      }
    }
    Object.keys(record?.download_links).forEach((item, index) => {
      apps.push({
        app: item,
        link: Object?.values(record.download_links)[index],
      });
    });
    dispatch(
      versions({
        record: record,
        eyeModal: true,
        links: apps,
        checkSums: checkSums,
        description: record.description,
      })
    );
  };

  const handleEdit = (record) => {
    const apps = [];
    const checkSums = [];
    if (record?.operating_system?.toLowerCase() !== "browser") {
      if (record?.checksums) {
        Object?.keys(record?.checksums)?.forEach((item, index) => {
          checkSums.push({
            version: item,
            checksum: Object?.values(record?.checksums)[index],
            forceVersion:
              record.exception_versions.length > 0
                ? record.exception_versions.find((val) => item === val)
                : false,
          });
        });
      }
    }
    Object.keys(record?.download_links).forEach((item, index) => {
      apps.push({
        app: item,
        link: Object.values(record.download_links)[index],
      });
    });
    dispatch(
      versions({
        record: record,
        editModal: true,
        links: apps,
        checkSums: checkSums,
        description: record.description,
        forceUpdate: record?.exception_versions,
      })
    );
  };

  const columns = [
    {
      title: Dictionary.systemType,
      width: "10%",
      key: "operating_system",
      dataIndex: "operating_system",
      render: (record) => record,
    },
    {
      title: Dictionary.minVersion,
      width: "10%",
      key: "min_version",
      dataIndex: "min_version",
      render: (record) => record,
    },
    {
      title: Dictionary.currentVersion,
      width: "10%",
      key: "current_version",
      dataIndex: "current_version",
      render: (record) => record,
    },
    {
      title: "CheckSum",
      key: "checksums",
      dataIndex: "checksums",
      width: "25%",
      render: (_field, record) => {
        if (_field) {
          return _field[record.current_version]
            ? _field[record.current_version]
            : "--";
        } else {
          return "--";
        }
      },
    },
    {
      title: Dictionary.downloadLink,
      key: "download_links",
      dataIndex: "download_links",
      width: "10%",
      render: (_field, record) => `${Object?.keys(_field)?.length} لینک`,
    },
    {
      title: Dictionary.modifiedfeatures,
      key: "description",
      dataIndex: "description",
      width: "20%",
      render: (_field, record) => (
        <div className={Classes["modifiedFeautures"]}>
          {_field?.length > 1 ? (
            _field?.map((item) => <span>{item} , </span>)
          ) : (
            <span>{_field[0]}</span>
          )}
        </div>
      ),
    },
    {
      key: "services",
      dataIndex: "services",
      width: "15%",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["versions-row-icon"]}>
          <TooltipComponent title={Dictionary.details}>
            <CustomIcon
              src={VisibleGrey}
              size={24}
              name={`list-customers-${record.id}-edit`}
              color="#2b9570"
              onClick={() => handleDetails(record)}
            />
          </TooltipComponent>
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              name={`list-customers-${record.id}-edit`}
              onClick={() => handleEdit(record)}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeaderPage
        addIcon={false}
        title={Dictionary.versionsControl}
        onClick={() => navigate("/basic-data/app-versions/version-history")}
        buttonText={Dictionary.versionsHistory}
      />
      <ModalComponent
        width={918}
        title={`${Dictionary.version} ${listVersions.record?.operating_system}`}
        open={listVersions.eyeModal}
        maskClosable={false}
        onCancel={() => dispatch(versions({ eyeModal: false }))}
      >
        <VersionDetails
          onCancel={() => dispatch(versions({ eyeModal: false }))}
          list={listVersions}
        />
      </ModalComponent>
      <ModalComponent
        width={918}
        title={`${Dictionary.edit}/${Dictionary.versionControl} ${listVersions.record.operating_system}`}
        open={listVersions.editModal}
        maskClosable={false}
        onCancel={() =>
          dispatch(
            versions({
              links: [],
              checkSums: [],
              addCheckSum: [],
              addLink: [],
              editModal: false,
              forceUpdate: [],
              record: "",
            })
          )
        }
      >
        <VersionEdit />
      </ModalComponent>
      <TableComponent
        columns={columns}
        dataSource={listVersions?.list}
        count={50}
      />
    </div>
  );
};

export default VersionsControl;
