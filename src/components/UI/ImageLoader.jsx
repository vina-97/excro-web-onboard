import PropTypes from "prop-types";
import {
  CloseRed,
  Gallery,
  TickWhite,
  Success,
  failureImage,
  Edit2,
  Country,
  Business,
  Entity,
  Info,
  OpenToggle,
  CloseToggle,
  UpToggle,
  DownToggle,
  EyeIcon,
  EditIcon,
  PDFIcon,
  JpgIcon,
  flagIcon,
  entitybusiIcon,
  detailIcon,
  mccIcon,
  personIcon,
  phoneIcon,
  emailIcon,
  dotsIcon,
  trashIcon,
  closeGrey,
  JSONIcon,
  RightArrow,
  PendingIcon,
  ReuploadIcon,
  DropDownIcon,
  StatfinOnboardLogo,
  PayOnCard,
  ArrowOnboard,
  CloseIcon,
  onboardMenuDelete,
  onboardMenuAdd,
  onboardEditicon,
  onboardDeleteIcon,
  onboardDocsEdit,
  onboardDocsDelete,
  CancelIcon,
  onboardBusinessConfirm,
  onboardBusinessRightarrow,
  onboardBusinessRightarrowlight,
  dokeyIcone,
  onboardBusinessEmail,
  onboardBusinessProfile,
  onboardBusinessPhone,
  onboardBusinessEntity,
  CancelRed,
  BasicInfo,
  BusinessInfo,
  KycInfo,
  BankInfo,
  BusinessLogo,
  BusinessLogoWithClock,
  GetUploadIcon,
  BusinessOnboardVerifiedIcon,
  BusinessOnboardPendingkyc,
  BusinessOnboardBank,
  BusinessOnboardView,
  BusinessOnboardTickMark,
  onboardBusinessProofId,
  onboardBusinessViewIconBlack,
  onboardBusinessEditIconBlack,
  onboardBusinessSuccessToast,
  onboardBusinessErrorToast,
  onboardBusinessDownload,
  onboardBusinessCopy,
  onboardBusinessClosePreview,
  onboardBusinessCloseIconDark,
  onboardBusinessImageIcon,
  onboardBusinessPdfIcon,
  onboardBusinessMismatchedIcon,
  onboardBusinessVerifiedIcon,
  onboardBusinessfileIcon,
  mismatchedIcon,
  verifiedIcon,
  onboardBusinessAMLCheck,
  onboardBusinessFieldVerification,
  onboardBusinessWebsiteCheckIcon,
  onboardBusinessDataCheckIcon,
  upload,
  onboardBusinessDeniedIcon,
  frmIcon,
  alertCircle,
  onboardBusinessGreenArrow,
  paykraftLogo,
  rugrLogo,
} from "../../assets/assets";

const images = {
  CloseRed,
  Gallery,
  TickWhite,
  Success,
  failureImage,
  Edit2,
  Country,
  Business,
  Entity,
  Info,
  OpenToggle,
  CloseToggle,
  UpToggle,
  DownToggle,
  EyeIcon,
  EditIcon,
  PDFIcon,
  JpgIcon,
  flagIcon,
  entitybusiIcon,
  detailIcon,
  mccIcon,
  personIcon,
  phoneIcon,
  emailIcon,
  dotsIcon,
  closeGrey,
  trashIcon,
  JSONIcon,
  RightArrow,
  PendingIcon,
  ReuploadIcon,
  DropDownIcon,
  StatfinOnboardLogo,
  PayOnCard,
  ArrowOnboard,
  CloseIcon,
  onboardMenuDelete,
  onboardMenuAdd,
  onboardEditicon,
  onboardDeleteIcon,
  onboardDocsEdit,
  onboardDocsDelete,
  CancelIcon,
  onboardBusinessConfirm,
  onboardBusinessRightarrow,
  onboardBusinessRightarrowlight,
  dokeyIcone,
  onboardBusinessEmail,
  onboardBusinessProfile,
  onboardBusinessPhone,
  onboardBusinessEntity,
  CancelRed,
  BasicInfo,
  BusinessInfo,
  KycInfo,
  BankInfo,
  BusinessLogo,
  BusinessLogoWithClock,
  GetUploadIcon,
  BusinessOnboardVerifiedIcon,
  BusinessOnboardPendingkyc,
  BusinessOnboardBank,
  BusinessOnboardView,
  BusinessOnboardTickMark,
  onboardBusinessProofId,
  onboardBusinessViewIconBlack,
  onboardBusinessEditIconBlack,
  onboardBusinessSuccessToast,
  onboardBusinessErrorToast,
  onboardBusinessDownload,
  onboardBusinessCopy,
  onboardBusinessClosePreview,
  onboardBusinessCloseIconDark,
  onboardBusinessImageIcon,
  onboardBusinessPdfIcon,
  onboardBusinessMismatchedIcon,
  onboardBusinessVerifiedIcon,
  onboardBusinessfileIcon,
  mismatchedIcon,
  verifiedIcon,
  onboardBusinessAMLCheck,
  onboardBusinessFieldVerification,
  onboardBusinessWebsiteCheckIcon,
  onboardBusinessDataCheckIcon,
  upload,
  onboardBusinessDeniedIcon,
  frmIcon,
  alertCircle,
  onboardBusinessGreenArrow,
  paykraftLogo,
  rugrLogo,
};

const getImageByKey = (key) => {
  return images[key] || null;
};

// Updated ImageLoader with hoverImage prop
const ImageLoader = ({
  imageKey,
  hoverImage,
  isHovered,
  className,
  onClick,
}) => {
  // Choose image based on hover state
  const imageSrc =
    isHovered && hoverImage
      ? getImageByKey(hoverImage)
      : getImageByKey(imageKey);

  return imageSrc ? (
    <img
      src={imageSrc}
      alt={imageKey}
      className={className}
      onError={(e) => {
        e.target.src = Gallery;
      }}
      onClick={onClick}
    />
  ) : (
    <img
      src={Gallery}
      alt={"Gallery"}
      className={className}
      onError={(e) => {
        e.target.src = Gallery;
      }}
      onClick={onClick}
    />
  );
};

ImageLoader.propTypes = {
  imageKey: PropTypes.string.isRequired,
  hoverImage: PropTypes.string, // New prop for hover image
  isHovered: PropTypes.bool, // New prop to control hover state
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ImageLoader;
