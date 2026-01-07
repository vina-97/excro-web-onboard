import { Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { checkValue } from "../../../../utils";
import BreadCrumbs from "../../../../components/Layout/BreadCrumbs";
import useMerchantGenericApproval from "../../../../store/useMerchantGenericApproval";
import { TooltipCellOrFirstObject } from "../../../../utils/TableUtils";

const AMLCheckList = () => {
  const { onboardHistory } = useMerchantGenericApproval();

  const { businessID } = useParams();

  const navigate = useNavigate();

  const searchresults = onboardHistory?.aml?.searchResults;

  return (
    <>
      <div className="w-full md:w-auto mb-2 md:mb-0">
        <BreadCrumbs />
      </div>
      <div className="w-full overflow-x-auto mt-5">
        <table className="min-w-full border border-[#7575751A] divide-y divide-gray-200">
          <thead className="bg-[#FBFBFB]">
            <tr>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                Name
              </th>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                DOB/DOR
              </th>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                Gender
              </th>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                ID Number
              </th>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                Match Score (%)
              </th>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                Risk Score (%)
              </th>
              <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                Contact Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {searchresults && searchresults?.length > 0 ? (
              searchresults?.map((item, i) => (
                <tr
                  key={i}
                  className={`${
                    item.category === "Grey"
                      ? "bg-[#FDFDFD]"
                      : item.category === "Black"
                        ? "bg-[#FFF5F5]"
                        : "bg-[#FFFFFF]"
                  } hover:bg-gray-50`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-[#010101] ">
                    <span
                      className="underline cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/merchant-generic-detail/aml-search-results/aml-sanction-detail/${businessID}`,
                          {
                            state: {
                              searchHistoryId:
                                onboardHistory?.aml?.searchHistoryId,
                              sanctionId: item.sanctionId,
                            },
                          },
                        )
                      }
                    >
                      {checkValue(item.caption)}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                    {item?.sdnType === "individual" ? (
                      <Tooltip
                        title={
                          item?.birthDate?.length
                            ? item?.birthDate?.toString().replaceAll(",", ", ")
                            : null
                        }
                      >
                        {item?.birthDate?.length ? item?.birthDate?.[0] : "-"}
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          item?.incorporationDate?.length
                            ? item?.incorporationDate
                                ?.toString()
                                .replaceAll(",", ", ")
                            : null
                        }
                      >
                        {item?.incorporationDate?.length
                          ? item?.incorporationDate?.[0]
                          : "-"}
                      </Tooltip>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium capitalize">
                    {checkValue(item?.gender?.[0])}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                    <Tooltip
                      title={
                        item?.idNumber?.length
                          ? item?.idNumber?.toString().replaceAll(",", ", ")
                          : null
                      }
                    >
                      {checkValue(item?.idNumber?.[0])}
                    </Tooltip>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                    <TooltipCellOrFirstObject
                      device={item?.scoreResults}
                      field="matchScore"
                      from=""
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                    <TooltipCellOrFirstObject
                      device={item?.scoreResults}
                      field="riskScore"
                      from=""
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                    <Tooltip
                      title={
                        item?.phone?.length
                          ? item?.phone?.toString().replaceAll(",", ", ")
                          : null
                      }
                    >
                      {checkValue(item?.phone?.[0])}
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-2 text-center text-sm text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AMLCheckList;
