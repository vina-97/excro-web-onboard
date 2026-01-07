import { Button, Modal } from "antd";
import PropTypes from "prop-types";
import closeImg from "../../../assets/images/common-icons/onboard_business_close_icon.svg";

const MAX_WIDTH = 630;
const UniversalModal = ({
  isOpen,
  onClose,
  children,
  title,
  onSubmit,
  fetchLoader,
  from,
  width,
  viewTitle,
  closeIcon,
  customWrapClass,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      wrapClassName={customWrapClass || ""}
      footer={
        from === "nobtn"
          ? null
          : [
              <Button key="cancel" type="submit" onClick={onClose}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="default"
                className="px-6 py-2 rounded-md !text-white"
                onClick={onSubmit}
                disabled={fetchLoader}
                loading={fetchLoader}
              >
                Submit
              </Button>,
            ]
      }
      title={
        title ? (
          <span className="capitalize text-lg font-medium">{title}</span>
        ) : (
          viewTitle?.()
        )
      }
      // closeIcon={
      //   closeIcon ? (
      //     <button
      //       className="flex items-center border-[1px] border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-3 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer"
      //       onClick={onClose}
      //     >
      //       <img src={closeImg} alt="close" />
      //     </button>
      //   ) : undefined
      // }
      closeIcon={
        closeIcon && (
          <button
            className="flex items-center border-[1px] border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-3 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer"
            onClick={onClose}
          >
            <img src={closeImg} alt="close" />
          </button>
        )
      }
      centered
      width={width || MAX_WIDTH}
    >
      {children}
    </Modal>
  );
};

UniversalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.any,
  onSubmit: PropTypes.func,
  fetchLoader: PropTypes.bool,
  from: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewTitle: PropTypes.func,
  closeIcon: PropTypes.bool,
};

export default UniversalModal;
