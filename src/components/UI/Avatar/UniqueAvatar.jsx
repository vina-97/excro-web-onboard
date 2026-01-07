import PropTypes from "prop-types";
import ImageLoader from "../ImageLoader";

export const UniqueAvatar = ({ imgSrc = "", initials = "", className }) => {
  return imgSrc ? (
    <ImageLoader imageKey={imgSrc} className={className} />
  ) : (
    <div
      className={`flex items-center justify-center rounded-full font-bold ${className}`}
    >
      {initials}
    </div>
  );
};

UniqueAvatar.propTypes = {
  className: PropTypes.string,
  imgSrc: PropTypes.string,
  initials: PropTypes.string,
};
