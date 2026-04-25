import { Plus, Trash2, Pencil } from "lucide-react";
import Pagination from "../ui/Pagination";
import AddAvatarModal from "./AddAvatarModalProps";
import { useState, useEffect } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";

/** Matches Postman: Avatar has imageUrl and colors array (gradient). */
export interface Avatar {
  _id: string;
  imageUrl: string;
  colors: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Avatars() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const normalizeColor = (color: string) =>
    color.startsWith("#") ? color : `#${color}`;

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/avatars");
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.avatars ?? [];
      setAvatars(list);
    } catch (err) {
      console.error("Failed to fetch Avatars", err);
      toast.error("Failed to load avatars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  const handleSaveAvatar = async () => {
    await fetchAvatars();
    setIsModalOpen(false);
    setEditingAvatar(null);
  };

  const handleEdit = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/avatars/${id}`);
      setAvatars((prev) => prev.filter((item) => item._id !== id));
      toast.success("Avatar deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete avatar");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = avatars.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#4B5563]">
          Profile Avatars
        </h2>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-[#9458E8] via-[#A43EE7] to-[#CA00E5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Avatar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0.5 mb-6">
          {currentItems.map((item) => (
            <div key={item._id} className="flex flex-col w-40 h-40 ">
              <div
                className="relative rounded-xl overflow-hidden
                   cursor-pointer shadow-sm border border-gray-200
                   flex items-center justify-center
                   transition-transform hover:scale-105 group"
                style={{
                  background: item.colors?.length
                    ? `linear-gradient(90deg,
                ${normalizeColor(item.colors[0])} 0%,
                ${normalizeColor(item.colors[1] || item.colors[0])} 50%,
                ${normalizeColor(item.colors[2] || item.colors[0])} 100%)`
                    : "#f3f3f3",
                }}
              >
                <button
                  onClick={() => handleEdit(item)}
                  className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-50 shadow-sm"
                  title="Edit"
                >
                  <Pencil size={14} className="text-purple-600" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
                <img
                  src={item.imageUrl}
                  alt="Avatar"
                  className="w-32 h-32 object-contain p-4"
                />
              </div>
              <p className="text-xs text-center text-[#4B5563] font-medium mt-1">
                Avatar
              </p>
            </div>
          ))}
        </div>
      )}

      <Pagination
        totalItems={avatars.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <AddAvatarModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingAvatar(null); }}
        apiEndpoint="/api/avatars"
        categoryName="Avatar"
        onSave={handleSaveAvatar}
        avatarMode
        editAvatar={editingAvatar}
      />
    </div>
  );
}
