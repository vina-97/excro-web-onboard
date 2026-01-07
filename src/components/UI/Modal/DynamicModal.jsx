import React, { useEffect } from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import UniversalModal from "./UniversalModal";

const DynamicModal = ({
  isOpen,
  onClose,
  image,
  title,
  description,
  subContent,
  buttons = [],
  navigation = "",
  className = "",
}) => {
  const MAGICNUMBER_5000 = 5000;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      (navigate(navigation), onClose());
    }, MAGICNUMBER_5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UniversalModal
      title=""
      isOpen={isOpen}
      onClose={false}
      onSubmit={null}
      fetchLoader={null}
      closeIcon={false}
      from="nobtn"
    >
      <div className="flex flex-col items-center py-2 text-center">
        {image && (
          <img
            src={image}
            alt="Modal Icon"
            className="rounded-full w-15 h-15 mb-4 p-3 bg-[#ebf3ff]"
          />
        )}
        {title && <h2 className="text-3xl font-semibold mb-2">{title}</h2>}
        {description && (
          <p className="text-[#344054] text-base sm:text-sm mb-1 font-normal">
            {description}
          </p>
        )}
        {subContent && (
          <p className="text-[#344054] text-base sm:text-sm mb-5 font-normal">
            {subContent}
          </p>
        )}
        <div className={className}>
          {buttons.map((btn, index) => (
            <PrimaryButton
              key={index}
              onNotify={btn.onClick || onClose}
              type={btn.type}
              size="large"
              label={btn.label}
              className={btn.className}
            >
              {btn.label}
            </PrimaryButton>
          ))}
        </div>
      </div>
    </UniversalModal>
  );
};

export default DynamicModal;
