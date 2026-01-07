import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Select } from "antd";
const { Option } = Select;

const Pagination = ({ onPageChange, result }) => {
  const limitLengthCount = 10;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitLengthCount);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (page > 1 || limit > limitLengthCount) {
        await onPageChange({ page, limit });
      }
    };
    if (
      (Array.isArray(result) && result.length === 0) ||
      result.length < limit
    ) {
      setIsLastPage(true);
      if (page > 1) {
        setPage((prev) => prev - 1);
      }
    } else {
      setIsLastPage(false);
    }
    fetchData();
  }, [page, limit]);

  const handleLimitChange = (e) => {
    setLimit(e);
    setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-2 page-limit-select">
        <span className="text-sm text-[#212121]">Page</span>
        <Select
          value={limit}
          onChange={(value) => handleLimitChange(value)}
          className="w-16"
          size="small"
        >
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
      </div>

      <div className="flex items-center gap-2 pagination-button">
        <Button
          onClick={handlePrev}
          disabled={page === 1}
          size="medium"
          icon={<ChevronLeft className="h-4 w-4" />}
          className="flex items-center "
        >
          Prev
        </Button>

        <Button
          onClick={handleNext}
          disabled={isLastPage}
          size="medium"
          iconPosition="end"
          icon={<ChevronRight className="h-4 w-4" />}
          className="flex items-center border border-[#4D4D4D]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
