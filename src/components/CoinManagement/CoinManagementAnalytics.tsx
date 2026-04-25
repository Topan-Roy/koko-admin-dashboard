import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import { Link } from "react-router-dom";
import LineChartComponent from "./components/LineChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import {
  cardData,
  tableData,
  tokenSubsriptionCondition,
} from "./data/packageData";

export default function CoinManagementAnalytics() {
  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] relative">
      <SideBar />
      <div className="w-full relative pb-4">
        <AdminHeader />
        <div className="mt-6    px-6 flex items-center justify-between">
          <h1 className="font-[700] text-[20.4px] leading-[32px] inter-font">
            Sales Analytics
          </h1>
          <select
            name=""
            id=""
            className="py-[9px] px-[13px] rounded-[6px] border-[1px] border-[#D1D5DB] outline-none font-[400] inter-font text-[#000000] text-[14px] leading-[1.2]"
          >
            <option value="">6 Months</option>
            <option value="">12 Months</option>
          </select>
        </div>
        <div className="mt-6    px-6">
          <div className="flex items-center justify-start gap-6 border-b-[1px] border-[#E5E7EB] ">
            <div className="flex items-center justify-center gap-[10px] py-3">
              <Link
                to={`/dashboard/coin-management-package`}
                className="font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font cursor-pointer"
              >
                Coin Packages
              </Link>
            </div>
            <div className="flex items-center justify-center gap-[10px] py-3 border-b-[2px] border-b-[#9458E8]">
              <Link
                to={`/dashboard/coin-management-analytics`}
                className="font-[700] text-[11.9px] leading-[20px] text-[#9458E8] inter-font cursor-pointer"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6    px-6 flex items-stretch justify-center gap-6">
          <LineChartComponent />
          <PieChartComponent />
        </div>
        <div className="mt-6    px-6 flex items-stretch justify-center gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="rounded-[8px] border-[1px] border-[#E5E7EB] bg-white p-[25px] shadow-md w-full"
            >
              <div className="flex items-center justify-between">
                <p className="font-[500] text-[11.9px] leading-[50px] inter-font text-[#6B7280]">
                  {card.title}
                </p>
                <div>{card.icon}</div>
              </div>
              <div className="-mt-2 text-[20.4px] leading-[32px] font-[700] text-[#1F2937]">
                {card.value}
              </div>
              <div className="text-[#22C55E] font-[400] text-[11.9px] leading-[20px] inter-font flex items-center justify-start mt-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.6665 4.66699H11.3332V11.3337"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.6665 11.3337L11.3332 4.66699"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <span className="ml-2">{card.change}</span>
                  <span>{card.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6    px-6">
          <div className="bg-white w-full rounded-[8px] shadow-md px-[24px]">
            {" "}
            <br />
            <h1 className="text-[17px] leading-[28px] inter-font text-[#1F2937] my-6 font-[700] mt-6">
              Recent Coin Buyers
            </h1>
            <table className="w-full ">
              <thead>
                <tr>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      User
                    </span>
                  </th>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      Email
                    </span>
                  </th>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      Plan
                    </span>
                  </th>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      Buy Date
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((table, index) => (
                  <tr key={index}>
                    <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                      <span className="text-[14px] leading-5 text-[#333333] text-left">
                        {table.user}
                      </span>
                    </td>
                    <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                      <span className="text-[14px] leading-5 text-[#333333] text-left">
                        {table.email}
                      </span>
                    </td>
                    <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                      <p
                        className={`
                                                    text-[14px] leading-5 text-[#333333] p-1 text-center
                                                    ${
                                                      tokenSubsriptionCondition[
                                                        table.plan as keyof typeof tokenSubsriptionCondition
                                                      ]
                                                    }
                                                `}
                      >
                        {table.plan}
                      </p>
                    </td>
                    <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                      <span className="text-[14px] leading-5 text-[#333333] text-left">
                        {table.buyDate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
