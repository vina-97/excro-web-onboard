import React from "react";

const OverFlowMenu = ({ children, onclose, customestyle, top, left }) => {
  const handleClose = () => {
    onclose(false);
  };
  return (
    <div className="flex items-center h-full">
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={handleClose}
      ></div>

      <div className="h-full ">
        <div
          className={`${customestyle} z-50 absolute top-full right-0 bg-white shadow-lg rounded-md 
          before:content-[''] before:absolute before:-top-3 before:right-8 before:w-0 before:h-0 
          before:border-l-[12px] before:border-r-[12px] before:border-b-[12px] 
          before:border-l-transparent before:border-r-transparent before:border-b-white`}
          style={{ top, left }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default OverFlowMenu;
