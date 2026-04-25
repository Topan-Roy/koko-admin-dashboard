export const tableHeader = [
  "Transaction ID",
  "User ID",
  "Name",
  "Email",
  "Amount",
  "Type",
  "Status",
  "Date",
  "Payment Method",
];

export const subscriptionStyle: Record<string, string> = {
  subscription:
    "bg-[#DBEAFE] text-[#1E40AF] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
  coin_purchase:
    "bg-[#F3E8FF] text-[#6B21A8] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
};

export const statusStyle: Record<string, string> = {
  succeeded:
    "bg-[#DCFCE7] text-[#166534] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
  completed:
    "bg-[#DCFCE7] text-[#166534] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
  pending:
    "bg-[#FEF3C7] text-[#92400E] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
  failed:
    "bg-[#FEE2E2] text-[#991B1B] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
  refunded:
    "bg-[#FEF9C3] text-[#854D0E] py-[2px] px-[8px] rounded-[9999px] inter-font text-[10.2px] leading-[20px] font-semibold",
};
