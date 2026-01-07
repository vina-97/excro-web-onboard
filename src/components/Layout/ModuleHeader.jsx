import React from "react";
// import { Button } from 'antd';
// import SortIcon from '../../assets/images/common-icons/FunnelSimple.svg';
import PrimaryButton from "../UI/Buttons/PrimaryButton";

export const ModuleHeader = ({ ...props }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl xl:text-xl text-[#010101] leading-5 font-semibold my-1">
          {props.title}
        </h2>
      </div>
      <div>
        <div className="flex gap-3">
          <div className="flex items-center justify-end confirm-btn">
            {/* <Button type="primary" onClick={props.createEntity}>
              + {props.actionName}
            </Button> */}
            <PrimaryButton
              label={props.actionName}
              iconLeft="+"
              onNotify={props.handleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
