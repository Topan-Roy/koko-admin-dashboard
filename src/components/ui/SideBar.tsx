import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "../svgs/DashboardIcon";
import LogoIcon from "../svgs/LogoIcon";
import UserIcon from "../svgs/UserIcon";
import Avatar from "../svgs/Avatar";
import LLMIcon from "../svgs/LLMIcon";
import CoinIcon from "../svgs/CoinIcon";
import Report_Analytics from "../svgs/ReportAnalytics";
import TransactionIcon from "../svgs/TransactionIcon";
import FAQIcon from "../svgs/FAQIcon";
import AdminAccountIcon from "../svgs/AdminAccountIcon";
import LibraryIcon from "../svgs/LibraryIcon";
import { AdminRoutes } from "@/App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/Context/AuthProvider";

export default function SideBar() {
  const { logOut, user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logOut();
    navigate("/", { replace: true });
  };
  const isLLMPromptsActive =
    pathname === AdminRoutes.LLMPrompts ||
    pathname === "/dashboard/audio-prompts" ||
    pathname === "/dashboard/title-prompts" ||
    pathname === "/dashboard/image-prompts" ||
    pathname === "/dashboard/llm-blocklist-prompts";

  return (
    <>
      <nav
        className="w-screen sm:z-0 z-[1000] sm:w-[350px] bg-white left-0 h-screen sm:sticky fixed top-0"
        style={{ boxShadow: "1px 0 5px #888" }}
      >
        <Link to="/dashboard">
          <div className="w-full h-[137px] flex items-center justify-center relative cursor-pointer">
            <div className="mt-4">
              <LogoIcon />
            </div>
          </div>
        </Link>

        <ul className="flex flex-col">
          <li
            className={`${
              pathname === AdminRoutes.Dashboard ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <DashboardIcon
              color={pathname === AdminRoutes.Dashboard ? "#9458E8" : "#4B5563"}
            />
            <Link
              to={`/dashboard`}
              className={`${
                pathname === AdminRoutes.Dashboard
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li
            className={`${
              pathname === AdminRoutes.UserManagement ||
              pathname.includes("/dashboard/user-management")
                ? "list-link"
                : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <UserIcon
              color={
                pathname === AdminRoutes.UserManagement ||
                pathname.includes("/dashboard/user-management")
                  ? "#9458E8"
                  : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/user-management`}
              className={`${
                pathname === AdminRoutes.UserManagement ||
                pathname.includes("/dashboard/user-management")
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              User Management
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.AvartarManagement ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <Avatar
              color={
                pathname === AdminRoutes.AvartarManagement
                  ? "#9458E8"
                  : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/avatar-management`}
              className={`${
                pathname === AdminRoutes.AvartarManagement
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              Avatar Management
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.FreeLibrary ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <LibraryIcon
              color={pathname === AdminRoutes.FreeLibrary ? "#9458E8" : "#4B5563"}
            />
            <Link
              to={AdminRoutes.FreeLibrary}
              className={`${
                pathname === AdminRoutes.FreeLibrary ? "text-[#9458E8]" : "#4B5563"
              }`}
            >
              Free Library
            </Link>
          </li>

          <li
            className={`${
              isLLMPromptsActive ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <LLMIcon color={isLLMPromptsActive ? "#9458E8" : "#4B5563"} />
            <Link
              to={`/dashboard/llm-prompts`}
              className={`${isLLMPromptsActive ? "text-[#9458E8]" : "#4B5563"}`}
            >
              LLM Prompts
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.CoinManagementPackage ||
              pathname === AdminRoutes.CoinManagementAnalytics
                ? "list-link"
                : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <CoinIcon
              color={
                pathname === AdminRoutes.CoinManagementPackage ||
                pathname === AdminRoutes.CoinManagementAnalytics
                  ? "#9458E8"
                  : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/coin-management-package`}
              className={`${
                pathname === AdminRoutes.CoinManagementPackage ||
                pathname === AdminRoutes.CoinManagementAnalytics
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              Coin Management
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.ReportAndAnalytics ||
              pathname === AdminRoutes.ApiCostAnalytics ||
              pathname === AdminRoutes.CostVsRevenue
                ? "list-link"
                : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <Report_Analytics
              color={
                pathname === AdminRoutes.ReportAndAnalytics ||
                pathname === AdminRoutes.ApiCostAnalytics ||
                pathname === AdminRoutes.CostVsRevenue
                  ? "#9458E8"
                  : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/report-and-analytics`}
              className={`${
                pathname === AdminRoutes.ReportAndAnalytics ||
                pathname === AdminRoutes.ApiCostAnalytics ||
                pathname === AdminRoutes.CostVsRevenue
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              Reports & Analytics
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.TransactionHistory ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <TransactionIcon
              color={
                pathname === AdminRoutes.TransactionHistory
                  ? "#9458E8"
                  : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/transaction-history`}
              className={`${
                pathname === AdminRoutes.TransactionHistory
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              Transaction History
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.FaqManagement ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <FAQIcon
              color={
                pathname === AdminRoutes.FaqManagement ? "#9458E8" : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/faq-management`}
              className={`${
                pathname === AdminRoutes.FaqManagement
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              FAQ
            </Link>
          </li>

          <li
            className={`${
              pathname === AdminRoutes.AdminAccount ? "list-link" : ""
            } flex items-center justify-start gap-3 py-[12px] px-[28px] inter-font font-[500] text-[13.6px] leading-[24px]`}
          >
            <AdminAccountIcon
              color={
                pathname === AdminRoutes.AdminAccount ? "#9458E8" : "#4B5563"
              }
            />
            <Link
              to={`/dashboard/admin-account`}
              className={`${
                pathname === AdminRoutes.AdminAccount
                  ? "text-[#9458E8]"
                  : "#4B5563"
              }`}
            >
              Admin Account
            </Link>
          </li>
        </ul>

        <div className="flex items-center justify-start gap-3 absolute bottom-0 p-[16px] border-t-[1px] border-[#E5E7EB] left-0 w-full bg-white">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                  fill="url(#paint0_linear_362_91)"
                />
                <path
                  d="M22.6663 26V24.6667C22.6663 23.9594 22.3854 23.2811 21.8853 22.781C21.3852 22.281 20.7069 22 19.9997 22H15.9997C15.2924 22 14.6142 22.281 14.1141 22.781C13.614 23.2811 13.333 23.9594 13.333 24.6667V26"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.667 14.085C23.2388 14.2332 23.7453 14.5671 24.1068 15.0343C24.4683 15.5015 24.6645 16.0756 24.6645 16.6663C24.6645 17.257 24.4683 17.8311 24.1068 18.2983C23.7453 18.7655 23.2388 19.0994 22.667 19.2476"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M26.667 26.0002V24.6669C26.6666 24.0761 26.4699 23.5021 26.1079 23.0351C25.7459 22.5682 25.2391 22.2346 24.667 22.0869"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.9997 19.3333C19.4724 19.3333 20.6663 18.1394 20.6663 16.6667C20.6663 15.1939 19.4724 14 17.9997 14C16.5269 14 15.333 15.1939 15.333 16.6667C15.333 18.1394 16.5269 19.3333 17.9997 19.3333Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_362_91"
                    x1="0"
                    y1="20"
                    x2="40"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9458E8" />
                    <stop offset="0.5" stopColor="#A43EE7" />
                    <stop offset="1" stopColor="#CA00E5" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
          <div className="flex items-start justify-center flex-col">
            <p className="font-[600] text-[13px] leading-[18px] inter-font text-[#111827]">
              {user?.name || "Admin"}
            </p>
            <button
              onClick={handleLogout}
              className="font-[400] text-[#EF4444] text-[11px] leading-[16px] hover:underline transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
