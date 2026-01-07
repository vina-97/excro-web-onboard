import ImageLoader from "../../../components/UI/ImageLoader";
import { capitalizeFirstLetter, returnTimeZoneDate } from "../../../utils";
import dayjs from "dayjs";

export default function OnboardHistory({ data }) {
  console.log(data);

  const grouped = Object.values(
    data?.audits?.reduce((acc, item) => {
      const date = item.createdAt
        ? returnTimeZoneDate(item.createdAt, "custom")
        : "-";

      if (!acc[date]) {
        acc[date] = { date, list: [] };
      }

      acc[date].list.push(item);
      return acc;
    }, {}),
  );

  return (
    <div className="relative pl-4 space-y-6 ">
      {grouped &&
        grouped.length > 0 &&
        grouped.map((item, i) => {
          return (
            <div key={i}>
              <div className="text-center text-primary-black-12 text-sm mb-5">
                {item.date}
              </div>
              {item?.list?.length > 0 &&
                item?.list?.map((res, i) => {
                  return (
                    <div className="flex mb-5 w-full" key={i}>
                      <div>
                        <div className="mr-2 flex flex-col items-center shrink-0">
                          <ImageLoader
                            imageKey={"onboardBusinessSuccessToast"}
                            className={"w-6 h-6"}
                          />
                          <span className="w-1 h-6 border-[#EEEEEE] border-l"></span>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="mb-5  flex justify-between items-center">
                          <p className="text-[#000000DE] font-semibold text-base">
                            {capitalizeFirstLetter(res?.event ?? "")}
                          </p>
                          <p className="text-grey text-sm">
                            {dayjs(res.updatedAt).format("h:mm A")}
                          </p>
                        </div>
                        <p className="text-grey text-sm">
                          {capitalizeFirstLetter(res?.action ?? "")}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}
