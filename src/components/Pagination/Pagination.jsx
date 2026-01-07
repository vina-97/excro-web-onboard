import React from "react";
// import { Select } from 'antd';
import PropTypes from "prop-types";
import leftArrow from "../../assets/images/common-icons/leftArrows.svg";
import rightArrow from "../../assets/images/common-icons/rightArrow.svg";

const Pagination = (props) => {
  const { page, limit, pageClicked, disableNext } = props.stateInfo;
  const { setState, ListArray, handlePageChange } = props;

  console.log(pageClicked);

  const goToPrevPage = () => {
    console.log(page);

    if (page > 1) {
      setState((prevState) => ({
        ...prevState,
        page: Number(page) - 1,
      }));
      handlePageChange(Number(page) - 1, limit);
    }
  };

  const goToNextPage = () => {
    if (ListArray?.length >= limit && !disableNext) {
      setState((prevState) => ({
        ...prevState,
        page: Number(page) + 1,
      }));
      handlePageChange(Number(page) + 1, limit);
    }
  };

  // const handleItemChange = (value) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     limit: value,
  //     page: 1,
  //   }));
  //   handlePageChange(1, value); // reset page to 1
  // };

  // const limitArrays = [
  //   { label: 10, value: 10 },
  //   { label: 25, value: 25 },
  //   { label: 50, value: 50 },
  //   { label: 100, value: 100 },
  // ];

  return (
    <div className="flex justify-end py-2 my-2 ml-4">
      {/* <div className="flex items-center gap-2 ">
        <Select
          value={limit}
          size="medium"
          name="limit"
          className="w-20 border-none text-sm h-9 custom-ant-select"
          onChange={handleItemChange}
        >
          {limitArrays.map((limit) => (
            <Select.Option
              key={limit.value}
              value={limit.value}
              className="border-none text-sm"
            >
              {limit.label}
            </Select.Option>
          ))}
        </Select>
      </div> */}
      <div className="flex items-center gap-2 mr-10">
        <button
          className={`flex items-center px-2 py-1 rounded border border-gray-300 text-sm ${
            page <= 1
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-100 hover:border-gray-500 text-primary-black-12"
          }`}
          disabled={page <= 1}
          onClick={goToPrevPage}
        >
          <img src={leftArrow} alt="prevpage" className="w-8 h-7 " />
          <span
            className={`mr-2 font-semibold text-[12px] leading-[12px] ${page <= 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            Previous
          </span>
        </button>
        {console.log(page, "][][][][][][]][")}
        <button
          className={`flex items-center px-2 py-1 rounded  border border-gray-300 text-sm ${
            ListArray?.length < limit || disableNext
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-100 cursor-pointer hover:border-gray-500 text-primary-black-12"
          }`}
          disabled={ListArray?.length < limit || disableNext}
          onClick={goToNextPage}
        >
          <span className="ml-2 font-semibold text-[12px] leading-[12px] cursor-pointer">
            Next
          </span>
          <img src={rightArrow} alt="nextpage" className="w-8 h-7" />
        </button>
      </div>
    </div>
  );
};
Pagination.propTypes = {
  page: PropTypes.number,
  limit: PropTypes.number,
  setState: PropTypes.func,
  ListArray: PropTypes.array,
  stateInfo: PropTypes.object,
};
export default Pagination;
