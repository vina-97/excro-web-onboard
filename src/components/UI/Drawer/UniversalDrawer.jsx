import { Drawer } from "antd";
import PropTypes from "prop-types";
import closeIcon from "../../../assets/images/common-icons/onboard_business_close_icon.svg";

const UniversalDrawer = ({
  title,
  open,
  onClose,
  children,
  size = "default",
}) => {
  return (
    <Drawer
      title={title}
      placement="right"
      size={size}
      open={open}
      onClose={onClose}
      closeIcon={
        <div className="flex items-center border border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-3 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer">
          <img src={closeIcon} alt="close" />
        </div>
      }
      rootClassName="custom-drawer"
    >
      {children}
    </Drawer>
  );
};

UniversalDrawer.propTypes = {
  open: PropTypes.bool.isRequired, // ✅ v6 standard
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  size: PropTypes.oneOf(["default", "large"]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default UniversalDrawer;
