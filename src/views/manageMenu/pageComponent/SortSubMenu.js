import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import MenuReorder from "assets/images/icon/MenuReorder.svg";
import { useDispatch, useSelector } from "react-redux";
import { manageMenu } from "store/reducers/manageMenu/manageMenuReducer";
import { sortMenu } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import Classes from "views/manageMenu/styles/manageMenu.module.scss";

const columns = [
  {
    key: "sort",
  },
  {
    title: Dictionary.submenuTitle,
    dataIndex: "menu_caption",
  },
  {
    title: "Key",
    dataIndex: "menu_key",
  },
];
const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <CustomIcon
                src={MenuReorder}
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: "move",
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};
const DraggableTable = () => {
  const manageMenuData = useSelector((state) => state.manageMenu.value);
  const [data, setData] = useState(manageMenuData.submenus);
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    setData(manageMenuData.submenus);
  }, [manageMenuData.submenus]);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      dispatch(manageMenu({ status: true }));
      setData((previous) => {
        const activeIndex = previous.findIndex((i) => i.id === active.id);
        const overIndex = previous.findIndex((i) => i.id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  const handleSort = () => {
    sortMenu(manageMenuData.newSort)
      .then(() => {
        dispatch(
          manageMenu({
            submenus: "",
            sortModal: false,
            newSort: "",
            reload: !manageMenuData.reload,
            status: false,
          })
        );
        dispatch(
          setNotificationData({
            message: Dictionary.successfullyDone,
            type: "success",
            time: 5000,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  useEffect(() => {
    const newList = [];
    if (manageMenuData.status && data) {
      data?.forEach((element, index) => {
        newList.push({
          entity_id: element.entity_id,
          custom_order_position: index + 1,
        });
      });
    }
    dispatch(manageMenu({ newSort: newList }));
  }, [data]);

  return (
    <>
      <div className={Classes["sort-menu-modal-top-row"]}>
        <div className={Classes["sort-menu-modal-top-detail"]}>
          <span>{Dictionary.title}</span>
          <span>{manageMenuData.record?.menu_caption}</span>
        </div>
        <div className={Classes["sort-menu-modal-top-detail"]}>
          <span>Key</span>
          <span>{manageMenuData.record?.menu_key}</span>
        </div>
      </div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={data.length > 0 ? data?.map((i) => i.id) : []}
          strategy={verticalListSortingStrategy}
        >
          <Table
            className={Classes["sort-menu-modal-width"]}
            components={{
              body: {
                row: Row,
              },
            }}
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={false}
            // this class should be without Classes
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "none-bordered-table t-TcTable-row-light"
                : "none-bordered-table t-TcTable-row-gray"
            }
          />
        </SortableContext>
      </DndContext>
      <div className={Classes["sort-menu-modal-buttons"]}>
        <button disabled={!manageMenuData.status} onClick={handleSort}>
          {Dictionary.save}
        </button>
        <button
          onClick={() =>
            dispatch(
              manageMenu({
                sortModal: false,
                submenus: "",
                newSort: "",
                status: false,
              })
            )
          }
        >
          {Dictionary.cancel}
        </button>
      </div>
    </>
  );
};
export default DraggableTable;
