import PropTypes from "prop-types";
import { Player } from "@lottiefiles/react-lottie-player";
import { loaderIcon, onboardCard } from "../../../assets/assets";

const lottie = {
  onboardCard,
  loaderIcon,
};

const getAnimationDataKey = (key) => {
  return lottie[key] || null;
};

const LottieLoader = ({ lottieKey, className = "" }) => {
  const animationData = getAnimationDataKey(lottieKey);

  return (
    <div className={`${className}`}>
      <Player autoplay loop src={animationData} />
    </div>
  );
};

LottieLoader.propTypes = {
  lottieKey: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default LottieLoader;
