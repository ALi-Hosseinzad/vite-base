import React from "react";
import { Modal } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import Close from "assets/images/icon/Close.svg";
import Classes from "components/modalComponent/ModalComponent.module.scss";

const ModalComponent = React.forwardRef(({ open, title, width, onCancel, children, className, ...props }, ref) => (
  <Modal
    centered
    title={title}
    open={open}
    footer={null}
    className={`${Classes["modal"]} ${className}`}
    ref={ref}
    width={width}
    onCancel={onCancel}
    closeIcon={<CustomIcon size={24} name="print-card-close-icon" src={Close} />}
    {...props}>
    {children}
  </Modal>
));

ModalComponent.displayName = "ModalComponent";

export default ModalComponent;
