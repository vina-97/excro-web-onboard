import { showToast } from "../components/UI/ShowToast";
import { removeUnderScore } from "./TableUtils";
import dayjs from "dayjs";
const nomberTen = 10;
let toastLocked = false;
const TIMEOUT_3000 = 300;
const NUMBER = -2;
const Number100 = 100;
import Cookie from "cookie-universal";

const cookies = Cookie();

export const showSuccess = (data) => {
  if (toastLocked) {
    return;
  }
  toastLocked = true;
  showToast("success", data?.message ?? data);

  setTimeout(() => {
    toastLocked = false;
  }, TIMEOUT_3000); // lock duration
};

export const showFailure = (data) => {
  if (toastLocked) {
    return;
  }

  let message = "";

  if (typeof data === "string") {
    message = data;
  } else if (data instanceof Error) {
    message = data.message || "Something went wrong.";
  } else if (typeof data === "object") {
    message = data?.message || "Something went wrong.";
  } else {
    message = "Something went wrong.";
  }

  toastLocked = true;
  showToast("error", message);

  setTimeout(() => {
    toastLocked = false;
  }, TIMEOUT_3000);
};
export const showWarning = (data) => {
  if (toastLocked) {
    return;
  }
  toastLocked = true;
  showToast("warning", data?.message ?? data);

  setTimeout(() => {
    toastLocked = false;
  }, TIMEOUT_3000); // lock duration
};
export const showInfo = (data) => {
  if (toastLocked) {
    return;
  }
  toastLocked = true;
  showToast("info", data?.message ?? data);

  setTimeout(() => {
    toastLocked = false;
  }, TIMEOUT_3000); // lock duration
};

export const getCookie = () => cookies.get("AdminWeb");
console.log(cookies.get("AdminWeb"), "utils");

export const getStatusDetails = (status, from) => {
  console.log(status);

  const baseClasses = "capitalize font-medium";
  const normalizedStatus = status?.toLowerCase();

  // Mapping of status to class fragments
  const statusClassMap = {
    initiated: "text-blue",
    in_progress: "text-blue",
    completed:
      "border text-center w-20 text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    submitted:
      "border text-center w-20 text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    active:
      "border text-center w-20 text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    approved:
      "border text-center w-20 text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    approve:
      "border text-center w-20 text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    low: "border text-center w-20 text-orange border-orange-border bg-orange-bg flex item-center justify-center rounded-md py-0.5 px-2",
    blocked:
      "border text-center w-20 text-grey border-grey-border bg-grey-bg flex item-center justify-center rounded-md py-0.5 px-2",
    deactive:
      "border text-center w-20 text-grey border-grey-border bg-grey-bg flex item-center justify-center rounded-md py-0.5 px-2",
    reupload:
      "border text-center w-20 text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    pending:
      "border text-center w-20 text-orange border-orange-border bg-orange-bg rounded-md py-0.5",
    medium:
      "border text-center w-20 text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    rejected:
      "border text-center w-20 text-red border-red-border bg-red-bg flex item-center justify-center rounded-md py-0.5 px-2",
  };

  const defaultClass =
    "border text-center w-20 text-orange border-orange-border bg-orange-bg rounded-md py-0.5";

  let classes = statusClassMap[normalizedStatus] || defaultClass;

  if (
    ["initiated", "in_progress"].includes(normalizedStatus) &&
    from === "details"
  ) {
    classes += " text-sm";
  }

  classes += ` ${baseClasses}`;

  return {
    className: classes,
    text: status || "-",
  };
};

export const getStatusDetailsNonWidth = (status, from) => {
  const baseClasses = "capitalize font-medium";
  const normalizedStatus = status?.toLowerCase();

  // Mapping of status to class fragments
  const statusClassMap = {
    initiated: "text-blue",
    in_progress: "text-blue",
    completed:
      "border text-center text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    submitted:
      "border text-center text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    active:
      "border text-center text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    approved:
      "border text-center text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    approve:
      "border text-center text-green border-green-border bg-green-bg flex item-center justify-center rounded-md py-0.5 px-2",
    low: "border text-center text-orange border-orange-border bg-orange-bg flex item-center justify-center rounded-md py-0.5 px-2",
    blocked:
      "border text-center  text-grey border-grey-border bg-grey-bg flex item-center justify-center rounded-md py-0.5 px-2",
    deactive:
      "border text-center  text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    reupload:
      "border text-center text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    pending:
      "border text-center text-orange border-orange-border bg-orange-bg rounded-md py-0.5 px-2",
    medium:
      "border text-center  text-blue border-blue-border bg-blue-bg flex item-center justify-center rounded-md py-0.5 px-2",
    rejected:
      "border text-center text-red border-red-border bg-red-bg flex item-center justify-center rounded-md py-0.5 px-2",
  };

  const defaultClass =
    "border text-center text-orange border-orange-border bg-orange-bg rounded-md py-0.5 px-2";

  let classes = statusClassMap[normalizedStatus] || defaultClass;

  if (
    ["initiated", "in_progress"].includes(normalizedStatus) &&
    from === "details"
  ) {
    classes += " text-sm";
  }

  classes += ` ${baseClasses}`;

  return {
    className: classes,
    text: status || "-",
  };
};

export const getStatus = (status, from) => {
  console.log(status);

  const baseClasses = "capitalize font-medium text-[15px]";
  const normalizedStatus = status?.toLowerCase();

  // Mapping of status to class fragments
  const statusClassMap = {
    initiated: "text-blue",
    in_progress: "text-blue",
    completed: "text-green",
    valid: "text-green",
    submitted: "text-green",
    active: "text-green",
    approved: "text-green",
    approve: "text-green",
    low: "text-orange",
    blocked: "text-grey",
    deactive: "text-blue",
    pending: "text-orange",
    medium: "text-blue",
    reupload: "text-blue",
    rejected: "text-red",
    high: "text-red",
    invalid: "text-red",
  };

  const defaultClass = "text-orange";

  let classes = statusClassMap[normalizedStatus] || defaultClass;

  if (
    ["initiated", "in_progress"].includes(normalizedStatus) &&
    from === "details"
  ) {
    classes += "text-[15px]";
  }

  classes += ` ${baseClasses}`;

  return {
    className: classes,
    text: removeUnderScore(status) || "-",
  };
};

export const shouldShowPagination = (data, page) => {
  // alert(JSON.stringify(data));
  if (data === undefined && page === 1) {
    return false;
  } else if (data?.length === 0 && page === 1) {
    return false;
  } else if (data?.length < nomberTen && page === 1) {
    return false;
  } else if (data?.length < nomberTen && page > 1) {
    return true;
  } else {
    return true;
  }
};
// navigationHelpers.js
export const handleBackClick = (navigate, MAGICNUMBER1) => {
  return navigate(MAGICNUMBER1);
};
export const capitalizeFirstLetter = (str) => {
  const trimmedStr = str.trim();

  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1);
};
export const htmlEntityToHex = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent;
};
export const extractLastPart = (path) => {
  const fileName = path.split("/").pop();
  return fileName;
};
export const isAllEmpty = (data) => {
  const isAllEmpty =
    !Array.isArray(data) ||
    data.length === 0 ||
    (data.length === 1 &&
      Object.values(data[0]).every(
        (val) => val === "" || val === undefined || val === null,
      ));
  return isAllEmpty;
};

export function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatToReadableDate(isoString) {
  return new Date(isoString).toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const IMPORTANT_KEYWORDS = new Set(["aml", "kyc", "pan"]);

export function isAbbreviation(segment) {
  return /^[A-Z]{2,3}$/i.test(segment); // 2–3 letters only
}

export function formatBreadcrumbLabel(segment) {
  return String(segment)
    .trim()
    .split(/[-_]+/) // split on hyphens or underscores
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (IMPORTANT_KEYWORDS.has(lower)) {
        return word.toUpperCase();
      } // AML/KYC/PAN
      if (isAbbreviation(word)) {
        return word.toUpperCase();
      } // e.g., API, GST (if you want)
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function formatStatusName(status) {
  if (!status) {
    return "";
  }

  if (status.toLowerCase() === "approved") {
    return "approve";
  }

  if (
    status.toLowerCase().endsWith("ed") &&
    status.toLowerCase() !== "approved"
  ) {
    const base = status.slice(0, NUMBER);
    return base.charAt(0).toUpperCase() + base.slice(1);
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export const restrictInputValue = (fieldName, value) => {
  const noSpecialFields = ["legalName", "tradeName", "description", "address"];

  // Allows alphanumeric, space, and these specific special characters:
  // . , - _ ( ) [ ] { } / \ & @ ' " : ; ! ? # % + = * ^
  const customAllowedChars = /[^\w\s.,\-_()[\]{}/\\&@'":;!?#%+=*^]/g;

  const config = {
    "phone.number": { mode: "number", max: 10 },
    "client.name": { mode: "alpha", max: 100 },
    legalName: { mode: "custom", customPattern: customAllowedChars, max: 150 },
    name: { mode: "alpha", max: 100 },
    email: { mode: "email", max: 100 },
    reason: { mode: "custom", customPattern: customAllowedChars, max: 500 },
    tradeName: { mode: "custom", customPattern: customAllowedChars, max: 150 },
    description: {
      mode: "custom",
      customPattern: customAllowedChars,
      max: 500,
    },
    address: { max: 500, mode: "custom", customPattern: customAllowedChars },
    "authorizedSignatory.email": { mode: "email", max: 100 },
    "authorizedSignatory.phone.number": { mode: "number", max: 10 },
    "authorizedSignatory.name": { mode: "alpha", max: 100 },
    website: { max: 100, mode: "website" },
    websiteUrl: { max: 100, mode: "website" },
  };

  noSpecialFields.forEach(
    (field) =>
      (config[field] = {
        ...config[field],
        mode: config[field]?.mode || "",
        customPattern: customAllowedChars,
      }),
  );

  const { mode, max, customPattern } = config[fieldName] || {};

  let newValue = value || "";

  switch (mode) {
    case "number":
      newValue = newValue.replace(/\D/g, "");
      break;

    case "alpha":
      newValue = newValue.replace(/[^a-zA-Z ]/g, "").replace(/^\s+/, "");
      break;

    case "noSpecial":
      newValue = newValue.replace(/[^a-zA-Z0-9 ]/g, "").replace(/^\s+/, "");
      break;

    case "email":
      newValue = newValue.replace(/\s/g, "").toLowerCase();
      break;

    case "website":
      newValue = newValue.replace(/\s/g, "").toLowerCase();
      break;

    case "custom":
      if (customPattern) {
        newValue = newValue.replace(customPattern, "");
      }
      break;

    default:
      break;
  }

  if (max) {
    newValue = newValue.slice(0, max);
  }

  return newValue;
};
// utils/formHelpers.js
export const makeSafeKey = (label) =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gi, "_");
export const blockInvalidNumberKeys = (e) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) {
    e.preventDefault();
  }
};
export const convertPercentage = (data) => {
  const used = data?.used;
  const total = data?.total;
  const percentage = (used / total) * Number100;
  return percentage;
};
const baseStyle =
  "py-[9.5px] px-[20px] rounded-[4px] font-semibold text-[12px] leading-[12px] text-center w-[100px] border border-[0.5px] capitalize";

const entityStatus = {
  active: `${baseStyle} text-[#1EAB6C] bg-[#1EAB6C26]  border-[#338A38]`,
  approved: `${baseStyle} text-[#1EAB6C] bg-[#1EAB6C26]  border-[#338A38]`,
  inactive: `${baseStyle} text-[#E11C20] bg-[#FAEAEE]  border-[#C50A0A]`,
  deactive: `${baseStyle} text-[#E11C20] bg-[#FAEAEE]  border-[#C50A0A]`,
  rejected: `${baseStyle} text-[#E11C20] bg-[#FAEAEE]  border-[#C50A0A]`,
  pending: `${baseStyle} text-[#C49231] bg-[#FEFAE9] border-[#C49231]`,
  submitted: `${baseStyle} text-[#3772FF] bg-[#3772FF1F]  border-[#3772FF]`,
};

export const customStatusStyle = (status) => {
  return entityStatus[status?.toLowerCase()];
};

export const setStatusColorText = (status) => {
  console.log(status);
  const color = {
    pending: "text-[#C49231]",
    completed: "text-[#34A853]",
    uploaded: "text-[#34A853]",
    extracted: "text-[#34A853]",
    initiated: "text-[#3772FF]",
    initial: "text-[#3772FF]",
    Initial: "text-[#3772FF]",
    in_progress: "text-[#FD7E14]",
  };

  return color[status];
};
export const checkValue = (val) => {
  const value = val === "" || val === undefined || val === null;
  return value ? "-" : val;
};

export const CheckfileType = (type) => {
  return ["image/png", "image/jpeg", "application/pdf"].includes(type);
};
export const returnTimeZoneDate = (date, custom) => {
  if (date === "" || date === undefined || date === null || date === "-") {
    return "";
  }
  return custom
    ? dayjs(date).format("ddd, MMM DD, YYYY")
    : dayjs(date).format("DD-MMM-YYYY");
};

export const returnDateWithTime = (date) => {
  if (date === "" || date === undefined || date === null || date === "-") {
    return "";
  }
  return dayjs(date).format("DD-MMM-YYYY h:mm a");
};
// export const formatKeyLabel = (key) => {
//   if (!key) {
//     return '';
//   }
//   return key
//     .replace(/\./g, ' ') // replace all dots with spaces
//     .replace(/([A-Z])/g, ' $1') // add space before uppercase letters
//     .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize every word start
//     .trim(); // remove extra spaces
// };

export const formatKeyLabel = (key = "") => {
  if (!key) {
    return "";
  }
  return key
    .replace(/\./g, " ") // dots ➜ spaces
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // split before normal word start after acronym
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase boundaries
    .replace(/\b\w/g, (match) => match.toUpperCase()) // capitalize words
    .trim();
};

// export const formatKeyLabel = (key) => {
//   if (!key) {
//     return '';
//   }

//   const formatted = key
//     .replace(/\./g, ' ')
//     .replace(/([A-Z])/g, ' $1')
//     .replace(/\b\w/g, (char) => char.toUpperCase())
//     .trim();

//   // If the key contains 'email' or 'email id', return lowercase
//   if (formatted.toLowerCase().includes('email')) {
//     return 'email id';
//   }

//   return formatted;
// };
export const windowScrollTo = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const paramsHandling = (type, key) => {
  const params = new URLSearchParams(location.search);
  switch (type) {
    case "get":
      return params.get(key);
    default:
      break;
  }
};
export const safeTrim = (str) => {
  if (typeof str !== "string") {
    return str || "";
  }
  // Remove only leading spaces, keep trailing ones
  return str.replace(/^\s+/, "");
};

export const getScore = (data) => {
  const status = data?.onboarding?.status ?? "";
  console.log(status);
  const MAGIN_50 = 50;
  const MAGIN_75 = 75;
  const MAGIN_100 = 100;

  // const statusKey=['business','bankInformation','kyc','riskManager','completed']
  if (status === "completed" || status === "riskManager") {
    return MAGIN_100;
  }
  // else if (status === 'business') {
  //   return MAGIN_25;
  // }
  else if (status === "bankInformation") {
    return MAGIN_50;
  } else if (status === "kyc") {
    return MAGIN_75;
  }
};

export const setKeyNumber = (tab) => {
  const statusKey = {
    business: 1,
    // bankInformation: 2,
    kyc: 3,
    riskManager: 4,
    completed: 5,
  };
  return statusKey[tab];
};
