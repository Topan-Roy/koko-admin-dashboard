import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import EditIcon from "../svgs/EditIcon";
import DeleteIcon from "../svgs/DeleteIcon";
import api from "@/Context/api";
import { toast } from "react-toastify";
import type { FreeLibraryItem } from "./types";
import AddFreeLibraryItem from "./components/AddFreeLibraryItem";
import EditFreeLibraryItem from "./components/EditFreeLibraryItem";

function formatDuration(seconds: number | undefined): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function FreeLibraryManagement() {
  const [items, setItems] = useState<FreeLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FreeLibraryItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/free-library");
      const data = res.data?.data ?? res.data;
      const list = data?.items ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch free library", err);
      toast.error("Failed to load Free Library items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/free-library/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Item deleted");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleToggleActive = async (item: FreeLibraryItem) => {
    try {
      await api.patch(`/api/free-library/${item._id}`, {
        isActive: !item.isActive,
      });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isActive: !i.isActive } : i))
      );
      toast.success(item.isActive ? "Hidden from public" : "Visible to public");
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] relative min-h-screen">
      <SideBar />
      <div className="w-full relative pb-6">
        <AdminHeader />
        <div className="mt-6 px-6">
          <h1 className="font-[700] text-[20.4px] leading-[32px] inter-font">
            Free Library
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Upload free stories and songs for users to stream without using tokens.
          </p>
        </div>
        <div className="mt-6 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#1F2937] text-[15.3px] leading-[28px] font-[600]">
              Library Items
            </h2>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center justify-center py-2 px-4 gap-2 rounded-[6px] text-white text-sm font-medium cursor-pointer hover:opacity-90"
              style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M3.677 8.5H13.0103" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.34375 3.83331V13.1666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {showAdd && (
          <AddFreeLibraryItem
            onClose={() => setShowAdd(false)}
            onSuccess={fetchItems}
          />
        )}
        {showEdit && selectedItem && (
          <EditFreeLibraryItem
            key={selectedItem._id}
            item={selectedItem}
            onClose={() => { setShowEdit(false); setSelectedItem(null); }}
            onSuccess={fetchItems}
          />
        )}

        <div className="mt-6 px-6">
          <div className="bg-white px-6 rounded-[8px] overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">No items yet</p>
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Add your first story or song
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-3 border-b border-[#EBEBEB] font-semibold text-[14px] text-[#333333] text-left">Type</th>
                    <th className="p-3 border-b border-[#EBEBEB] font-semibold text-[14px] text-[#333333] text-left">Title</th>
                    <th className="p-3 border-b border-[#EBEBEB] font-semibold text-[14px] text-[#333333] text-left">Duration</th>
                    <th className="p-3 border-b border-[#EBEBEB] font-semibold text-[14px] text-[#333333] text-left">Status</th>
                    <th className="p-3 border-b border-[#EBEBEB] font-semibold text-[14px] text-[#333333] text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b border-[#EBEBEB] text-[14px] text-[#333333] capitalize">
                        {item.type}
                      </td>
                      <td className="p-3 border-b border-[#EBEBEB] text-[14px] text-[#333333]">
                        <div className="flex items-center gap-2">
                          {item.coverImageUrl && (
                            <img
                              src={item.coverImageUrl}
                              alt=""
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border-b border-[#EBEBEB] text-[14px] text-[#333333]">
                        {formatDuration(item.duration)}
                      </td>
                      <td className="p-3 border-b border-[#EBEBEB]">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[14px] ${
                            item.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 border-b border-[#EBEBEB] text-[14px]">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            className="text-xs font-medium text-gray-600 hover:text-purple-600"
                          >
                            {item.isActive ? "Hide" : "Show"}
                          </button>
                          <div
                            className="cursor-pointer hover:opacity-70"
                            onClick={() => { setSelectedItem(item); setShowEdit(true); }}
                          >
                            <EditIcon />
                          </div>
                          <div
                            className="cursor-pointer hover:opacity-70"
                            onClick={() => handleDelete(item._id)}
                          >
                            <DeleteIcon />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
