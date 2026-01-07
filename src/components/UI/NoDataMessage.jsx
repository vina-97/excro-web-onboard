import React from "react";
import circleImg from "../../assets/common-icons/circleImg.svg";
import { Button } from "antd";
import { Plus, FilePlus } from "lucide-react";
const NoDataMessage = ({
  contentOne,
  contentTwo,
  buttonText,
  navigateCreate,
}) => {
  return (
    <>
      <div className="flex justify-center min-h-[400px] px-4 -mt-6">
        <div className="relative text-center w-full max-w-md">
          <div className="relative flex justify-center mb-6">
            <img src={circleImg} alt="background" />
            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 absolute top-[84px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 p-2">
              <FilePlus className="w-5 h-5 text-[#2250CE]" />
            </div>
          </div>
          <div className="absolute top-[130px] left-1/2 -translate-x-1/2 w-[90%] text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {contentOne}
            </h2>

            <p className="text-sm text-gray-500 mb-5">{contentTwo}</p>
            {buttonText && (
              <Button
                type="primary"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-sm transition"
                onClick={() => navigateCreate()}
              >
                <Plus className="w-4 h-4" />
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default NoDataMessage;
