import React from "react";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { checkValue } from "../utils/index";

const no2 = 2;

export const getDateFromTimeZones = (dateString, formateDateTime) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log(dateString, formateDateTime);
  // let clientAttempt = localStorageGetItem("clientInfo");
  // let offsetTime = clientAttempt?.merchant?.timezone?.name;
  // const date = dayjs(dateString);

  // return !offsetTime
  //   ? date.format("DD-MM-YYYY | hh:mm:ss A")
  //   : dateString?.tz(offsetTime).format(formateDateTime);
};

// export const TooltipCellOrFirstObject = ({ device, field, from }) => {
//   return renderTooltipContent(device, [field], from);
// };

export const TooltipCellOrFirstObject = ({ device, field, from }) => {
  // 🔧 Split the dot-separated path string into an array
  const fieldPath = field.split(".");
  return renderTooltipContent(device, fieldPath, from, field);
};

export function returnSimpleFormatedDateTime(dateString) {
  return !dateString
    ? "-"
    : getDateFromTimeZones(dateString, "YYYY-MM-DD | hh:mm:ss A");
}

export const fixedTwoDigit = (num) => {
  if (typeof num !== "number" || isNaN(num)) {
    return "-"; // Return a default value or handle it as needed
  }
  return num % 1 !== 0 ? parseFloat(num.toFixed(no2)) : num;
};

export const removeUnderScore = (value) => {
  return value
    ?.replaceAll("-", " ")
    ?.replaceAll("_", " ")
    ?.replaceAll("?", " for ")
    ?.replaceAll(" ", " ")
    ?.replaceAll(".", " ")
    ?.replaceAll("%20", " ")
    ?.replace(/(\b)kyc(\b)/g, "KYC")
    ?.replace(/(\b)ip(\b)/g, "IP")
    ?.replace(/(\b)ndr(\b)/g, "NDR")
    ?.replace(/(\b)api(\b)/g, "API")
    ?.replace(/(\b)dr(\b)/g, "DR")
    ?.replace(/(\b)nda(\b)/g, "NDA");
};

export function returnSimpleFormatedDate(dateString) {
  // return dayjs(dateString).format('DD-MM-YYYY');
  return dayjs(dateString).format("DD MMMM YYYY");
}

// const capitalizeFirstLetter = (text) => {
//   return typeof text === 'string' && text.length
//     ? text.charAt(0).toUpperCase() + text.slice(1)
//     : text;
// };

// const renderTooltipContent = (device, fields, from, originalField) => {
//   const value = fields.reduce((obj, field) => obj?.[field], device);
//   if (from === '') {
//     return <>{value === 0 ? 0 : value ? value.toLocaleString('en-IN') : '-'}</>;
//   } else if (from === '2digit') {
//     return (
//       <>
//         {value === 0
//           ? 0
//           : value
//             ? fixedTwoDigit(value).toLocaleString('en-IN')
//             : '-'}
//       </>
//     );
//   } else if (from === 'time') {
//     return (
//       <>
//         <Tooltip
//           title={returnSimpleFormatedDateTime(value)?.toUpperCase()}
//           placement="topLeft"
//         >
//           <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
//             {returnSimpleFormatedDateTime(value)?.toUpperCase()}
//           </div>
//         </Tooltip>
//       </>
//     );
//   } else if (from === 'date') {
//     return (
//       <>
//         <Tooltip title={returnSimpleFormatedDate(value)} placement="topLeft">
//           <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
//             {returnSimpleFormatedDate(value)}{' '}
//           </div>
//         </Tooltip>
//       </>
//     );
//   } else if (from === 'underscore') {
//     return (
//       <Tooltip title={value === 0 ? 0 : value || '-'} placement="topLeft">
//         <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
//           {value === 0 ? 0 : removeUnderScore(value) || '-'}
//         </div>
//       </Tooltip>
//     );
//   } else {
//     const displayValue =
//     value === 0
//       ? 0
//       : originalField === 'email'
//       ? value
//       : capitalizeFirstLetter(value);

//   return (
//     <Tooltip title={displayValue || '-'} placement="topLeft">
//       <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
//         {displayValue || '-'}
//       </div>
//     </Tooltip>
//   );
//   }

//   // else {
//   //   return (
//   //     <Tooltip title={value === 0 ? 0 : value || '-'} placement="topLeft">
//   //       <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
//   //         {value === 0 ? 0 : value || '-'}
//   //       </div>
//   //     </Tooltip>
//   //   );

//   // }

// };

const renderTooltipContent = (device, fields, from, originalField) => {
  const value = fields.reduce((obj, field) => obj?.[field], device);

  const capitalizeFirstLetter = (text) => {
    return typeof text === "string" && text.length
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text;
  };

  // const capitalizeAll = (text) => {
  //   return typeof text === 'string' ? text.toUpperCase() : text;
  // };

  if (from === "") {
    return <>{value === 0 ? 0 : value ? value.toLocaleString("en-IN") : "-"}</>;
  } else if (from === "2digit") {
    return (
      <>
        {value === 0
          ? 0
          : value
            ? fixedTwoDigit(value).toLocaleString("en-IN")
            : "-"}
      </>
    );
  } else if (from === "time") {
    return (
      <Tooltip
        title={returnSimpleFormatedDateTime(value)?.toUpperCase()}
        placement="topLeft"
      >
        <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
          {returnSimpleFormatedDateTime(value)?.toUpperCase()}
        </div>
      </Tooltip>
    );
  } else if (from === "date") {
    return (
      <Tooltip title={returnSimpleFormatedDate(value)} placement="topLeft">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
          {returnSimpleFormatedDate(value)}
        </div>
      </Tooltip>
    );
  } else if (from === "underscore") {
    const transformed =
      originalField === "email"
        ? value
        : capitalizeFirstLetter(removeUnderScore(value));

    return (
      <Tooltip title={value === 0 ? 0 : transformed || "-"} placement="topLeft">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
          {value === 0 ? 0 : transformed || "-"}
        </div>
      </Tooltip>
    );
  } else {
    // 🔤 Capitalization logic here
    const displayValue =
      value === 0
        ? 0
        : [
              "email",
              "clientId",
              "merchantId",
              "client.id",
              "merchant.id",
            ].includes(originalField)
          ? value
          : // : originalField === 'clientId'
            //   ? capitalizeAll(value)
            capitalizeFirstLetter(value);

    return (
      <Tooltip title={displayValue ? displayValue : ""} placement="topLeft">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap mb-0">
          {checkValue(displayValue) || "-"}
        </div>
      </Tooltip>
    );
  }
};
