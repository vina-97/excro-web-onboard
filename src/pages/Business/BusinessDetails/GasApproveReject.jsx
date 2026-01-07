import { formatToReadableDate } from "../../../../../utils";
import { Controller } from "react-hook-form";
import { Form } from "antd";
import useGenericApprovalList from "../../../../../store/useGenericApprovalList";
import ImageLoader from "../../../../../components/UI/ImageLoader";

const statusColors = {
  approved: {
    border: "border-[#B9F8CF]",
    bg: "bg-[#EFFDF4]",
    text: "text-green",
    badge: "bg-[#DCFCE7] text-[#4CAF50] border-[#8EF3B3]",
    iconKey: "TickWhite",
    iconBg: "bg-[#4CAF50]",
  },
  pending: {
    border: "border-[#FFE7CA]",
    bg: "bg-[#FFF7EE]",
    text: "text-yellow",
    badge: "bg-[#FFECD6] text-[#F8A33A] border-[#FFE7CA]",
    iconKey: "PendingIcon",
    iconBg: "bg-yellow-bg",
  },
  not_verified: {
    border: "border-[#FFE7CA]",
    bg: "bg-[#FFF7EE]",
    text: "text-yellow",
    badge: "bg-[#FFECD6] text-[#F8A33A] border-[#FFE7CA]",
    iconKey: "PendingIcon",
    iconBg: "bg-yellow-bg",
  },
  reupload: {
    border: "border-[#A4C0F8]",
    bg: "bg-[#E4EDFF]",
    text: "text-[#4C84F5]",
    badge: "bg-[#D6E3FF] text-[#4C84F5] border-[#A4C0F8]",
    iconKey: "TickWhite",
    // iconBg: 'bg-purple-500',
  },
  submitted: {
    border: "border-[#B9F8CF]",
    bg: "bg-[#EFFDF4]",
    text: "text-green",
    badge: "bg-[#DCFCE7] text-[#4CAF50] border-[#8EF3B3]",
    iconKey: "TickWhite",
    iconBg: "bg-[#4CAF50]",
  },
  rejected: {
    border: "border-red-300",
    bg: "bg-red-50",
    text: "text-red-900",
    badge: "bg-red-100 text-red-700",
    iconKey: "CloseRed",
    iconBg: "bg-red-500",
    classname: "close-white",
  },
  completed: {
    border: "border-green-border",
    bg: "bg-green-bg",
    text: "text-green",
    badge: "bg-green-bg text-green",
    iconKey: "TickWhite",
    iconBg: "bg-[#4CAF50]",
  },
  Verified: {
    border: "border-green-border",
    bg: "bg-green-bg",
    text: "text-green",
    badge: "bg-green-bg text-green",
    iconKey: "TickWhite",
    iconBg: "bg-[#4CAF50]",
  },
};

function StatusCard({
  title,
  status,
  date,
  colorKey,
  approvedLabel,
  dateLabel,
}) {
  const colors = statusColors[colorKey] || statusColors.pending;

  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg mb-4 border ${colors.border} ${colors.bg}`}
    >
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center rounded-full ${colors.iconBg}`}
        >
          <ImageLoader
            imageKey={colors.iconKey}
            className={`w-6 h-6 ${colors?.classname}`}
          />
        </div>
        <span className="font-medium ml-2 text-[rgb(0,0,0)] text-[15px]">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {status === approvedLabel && date && (
          <span className="text-xs text-light">
            <span className="capitalize">{dateLabel}</span>
            <span className="mx-1"> {formatToReadableDate(date)}</span>
          </span>
        )}
        <span
          className={`py-1 px-2 rounded-4xl text-xs font-semibold mt-1 capitalize border ${colors.badge}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default function ApproveRejectGas({ uniqueKey }) {
  const { onboardHistory } = useGenericApprovalList();
  console.log(onboardHistory);

  return (
    <div className="rounded-lg bg-white border-b-[#E9E9E9] p-6">
      <StatusCard
        title="Client Information"
        status={onboardHistory?.clientInfo?.onboarding?.status}
        date={onboardHistory?.clientInfo?.onboarding?.endedAt}
        colorKey={onboardHistory?.clientInfo?.onboarding?.status}
        approvedLabel={onboardHistory?.clientInfo?.onboarding?.status}
        dateLabel={`${onboardHistory?.clientInfo?.onboarding?.status} on`}
      />

      {/* KYC Status */}
      {onboardHistory?.kycInfo?.kycInfo?.status && (
        <StatusCard
          title="KYC Status"
          status={onboardHistory?.kycInfo?.kycInfo?.status}
          date={onboardHistory?.kycInfo?.kycInfo?.date}
          colorKey={onboardHistory?.kycInfo?.kycInfo?.status}
          approvedLabel={onboardHistory?.kycInfo?.kycInfo?.status}
          dateLabel={`${onboardHistory?.kycInfo?.kycInfo?.status} on`}
        />
      )}

      {/* <StatusCard
        title="Bank"
        status={
          onboardHistory?.bankInfo?.isVerified ? "Verified" : "not_verified"
        }
        date={onboardHistory?.bankInfo?.verficationDate}
        colorKey={
          onboardHistory?.bankInfo?.isVerified ? "Verified" : "not_verified"
        }
        approvedLabel="Verified"
        dateLabel={
          onboardHistory?.bankInfo?.isVerified
            ? "Verified on"
            : "Not Verified on"
        }
      /> */}

      <Form.Item className="mb-4">
        <label className="block font-medium mb-1">
          {uniqueKey === "rejected"
            ? "Reason for Rejected"
            : "Reason for approval"}
          <span className="text-red-500">*</span>
        </label>
        <Controller name="reason" render={({ field }) => console.log(field)} />
      </Form.Item>
    </div>
  );
}
