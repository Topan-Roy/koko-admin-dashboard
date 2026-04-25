import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import Search from "../svgs/Search";
import FilterIcon from "../svgs/FilterIcon";
import Pagination from "../ui/Pagination";
import {
  statusBadgeStyles,
  subscriptionBadgeStyles,
  type UserTableRow,
  type UserStatus,
} from "./data/usersTableData";
import api from "../../Context/api";

type StatusFilter = "all" | Lowercase<UserStatus>;

const itemsPerPage = 16;
const fetchLimit = 1000;

const getUserStatus = (user: any): UserStatus => {
  if (typeof user?.activeStatus === "boolean") {
    return user.activeStatus ? "Active" : "Inactive";
  }

  if (typeof user?.is_active === "boolean") {
    return user.is_active ? "Active" : "Inactive";
  }

  if (typeof user?.isActive === "boolean") {
    return user.isActive ? "Active" : "Inactive";
  }

  if (typeof user?.status === "string") {
    const normalizedStatus = user.status.trim().toLowerCase();
    if (normalizedStatus === "active") {
      return "Active";
    }
  }

  return "Inactive";
};

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeRange, setTimeRange] = useState("1");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [allUsers, setAllUsers] = useState<UserTableRow[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserTableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/users/query", {
        params: {
          page: 1,
          limit: fetchLimit,
          search: searchQuery || undefined,
          months: timeRange || undefined,
        },
      });

      const dataRes = response.data.data || response.data;
      const results = dataRes.results || [];

      const mappedUsers: UserTableRow[] = results.map((user: any) => ({
        id: user.userId,
        name: user.user,
        email: user.email,
        status: getUserStatus(user),
        profileCreated: user.profileCreated || 0,
        storyCreated: user.storyCreated || 0,
        songCreated: user.songCreated || 0,
        coins: user.coins || 0,
        subscription: user.subscription || "Free",
        joined: new Date(user.joined).toLocaleDateString(),
      }));

      setAllUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, timeRange]);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, timeRange]);

  useEffect(() => {
    const nextFilteredUsers =
      statusFilter === "all"
        ? allUsers
        : allUsers.filter((user) =>
            statusFilter === "active"
              ? user.status === "Active"
              : user.status === "Inactive",
          );

    setTotalResults(nextFilteredUsers.length);
    setTotalPages(Math.max(1, Math.ceil(nextFilteredUsers.length / itemsPerPage)));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredUsers(nextFilteredUsers.slice(startIndex, endIndex));
  }, [allUsers, statusFilter, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const filterOptions: Array<{
    label: string;
    value: StatusFilter;
  }> = [
    { label: "All users", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <section className="flex min-h-screen items-start justify-center bg-[#F9F9F9]">
      <SideBar />
      <div className="w-full pb-6">
        <AdminHeader />

        <div className="my-6 flex items-center justify-between gap-4 px-6">
          <h2 className="font-[700] text-[20.4px] leading-[32px] text-[#111827] inter-font">
            User Management
          </h2>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(event) => setTimeRange(event.target.value)}
              className="h-[42px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pr-9 text-[13px] font-[500] text-[#374151] shadow-[0_4px_12px_rgba(15,23,42,0.04)] outline-none inter-font"
            >
              <option value="1">Last 1 month</option>
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </select>
          </div>
        </div>

        <div className="px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Search />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-[44px] w-full rounded-[8px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[14px] text-[#111827] shadow-[0_4px_12px_rgba(15,23,42,0.04)] outline-none placeholder:text-[#C5C9D3] inter-font"
                placeholder="Search users by name or email"
              />
            </div>

            <div className="relative self-end md:self-auto">
              <button
                type="button"
                onClick={() => setShowFilterMenu((previous) => !previous)}
                className="flex h-[44px] items-center justify-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[13px] font-[500] text-[#111827] shadow-[0_4px_12px_rgba(15,23,42,0.04)] inter-font"
              >
                <FilterIcon />
                Filter
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-[52px] z-20 min-w-[160px] rounded-[10px] border border-[#E5E7EB] bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setShowFilterMenu(false);
                      }}
                      className={`flex w-full items-center rounded-[8px] px-3 py-2 text-left text-[13px] inter-font ${
                        statusFilter === option.value
                          ? "bg-[#F5EEFF] text-[#A43EE7]"
                          : "text-[#4B5563] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 md:px-6">
          <div className="overflow-hidden rounded-[10px] border border-[#ECEEF3] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="overflow-x-auto">
              <table className="min-w-[1160px] w-full">
                <thead className="border-b border-[#F1F5F9]">
                  <tr>
                    <th className="px-6 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      User ID
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      User
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Email
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Active Status
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Profile Created
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Story Created
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Song Created
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Coins
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Subscription
                    </th>
                    <th className="px-3 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Joined
                    </th>
                    <th className="px-6 py-5 text-left text-[12px] font-[600] text-[#374151] inter-font">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-20 text-center text-[14px] text-[#6B7280] inter-font">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#F8FAFC] transition-colors hover:bg-[#FCFCFF]"
                      >
                        <td className="px-6 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          {user.id}
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          <span className="block max-w-[108px] leading-[18px]">
                            {user.name}
                          </span>
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          <span className="block max-w-[106px] break-all leading-[18px]">
                            {user.email}
                          </span>
                        </td>
                        <td className="px-3 py-[9px]">
                          <span
                            className={`inline-flex rounded-full px-[9px] py-[2px] text-[10px] font-[500] inter-font ${statusBadgeStyles[user.status]}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          {user.profileCreated}
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          {user.storyCreated}
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          {user.songCreated}
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          {user.coins}
                        </td>
                        <td className="px-3 py-[9px]">
                          <span
                            className={`inline-flex min-w-[77px] justify-center rounded-full px-[10px] py-[2px] text-[10px] font-[500] inter-font ${(subscriptionBadgeStyles as any)[user.subscription] || "bg-gray-100 text-gray-800"}`}
                          >
                            {user.subscription}
                          </span>
                        </td>
                        <td className="px-3 py-[9px] text-[13px] font-[400] text-[#4B5563] inter-font">
                          {user.joined}
                        </td>
                        <td className="px-6 py-[9px] text-[12px] font-[500] inter-font">
                          <Link
                            to={`/dashboard/user-management/${user.id}`}
                            className="text-[#A43EE7] hover:text-[#8E2DE2]"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={11}
                        className="px-6 py-20 text-center text-[14px] text-[#6B7280] inter-font"
                      >
                        No users found for the current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={totalResults}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
