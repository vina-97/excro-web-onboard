import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatBreadcrumbLabel } from "../../utils";
import ImageLoader from "../UI/ImageLoader";
import { Number } from "../../utils/enum";

const BreadCrumbs = ({ renderButton }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const { MINUS_ONE } = Number;

  const buildBreadcrumbs = useCallback((path) => {
    const rawParts = path.split("/").filter(Boolean);

    const lastPart = rawParts[rawParts.length - 1];
    const entityId = /^[a-zA-Z0-9_]{8,}$/.test(lastPart) ? lastPart : null;

    // Remove ID from breadcrumb labels
    const parts = entityId ? rawParts.slice(0, MINUS_ONE) : rawParts;

    const breadcrumbs = parts.map((part, index) => {
      if (index === 0 && part === "merchant-generic-detail") {
        return {
          label: part,
          path: entityId ? `/${part}/${entityId}` : `/${part}`,
        };
      }

      if (index === 1 && parts[0] === "merchant-generic-detail") {
        return {
          label: part,
          path: null,
        };
      }

      return {
        label: part,
        path: "/" + parts.slice(0, index + 1).join("/"),
      };
    });

    setBreadcrumbs(breadcrumbs);
  }, []);

  useEffect(() => {
    if (pathname) {
      buildBreadcrumbs(pathname);
    }
  }, [pathname, buildBreadcrumbs]);

  console.log(breadcrumbs, "brre");

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-2">
      {/* Breadcrumbs */}
      <div className="flex-1 w-full overflow-x-auto">
        <ul className="flex flex-wrap md:flex-nowrap gap-2 items-center whitespace-nowrap">
          {/* Home */}
          <li
            onClick={() => navigate("/create-business")}
            className="flex items-center text-base font-medium cursor-pointer"
          >
            Home
            {breadcrumbs.length > 0 && (
              <ImageLoader
                imageKey="onboardBusinessRightarrow"
                className="w-3 h-3 ml-1"
              />
            )}
          </li>

          {/* Dynamic crumbs */}
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const label = formatBreadcrumbLabel(item.label);
            const finalSearch = `?tab=riskManager`;

            return (
              <li
                key={item.path}
                onClick={
                  !isLast && item.path
                    ? () => navigate(`${item.path}${finalSearch}`)
                    : undefined
                }
                className={`flex items-center text-base capitalize truncate max-w-xs ${
                  isLast
                    ? "text-primary-black-12 font-normal cursor-default"
                    : "cursor-pointer text-grey font-medium"
                }`}
                title={label}
              >
                {label}
                {!isLast && (
                  <ImageLoader
                    imageKey="onboardBusinessRightarrowlight"
                    className="w-3 h-3 ml-1"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Optional button */}
      {renderButton && <div className="mt-2 md:mt-0">{renderButton()}</div>}
    </div>
  );
};

export default BreadCrumbs;
