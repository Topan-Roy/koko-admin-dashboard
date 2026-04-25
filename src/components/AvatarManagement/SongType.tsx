import { Plus, Trash2 } from "lucide-react";
import Pagination from "../ui/Pagination";
import AddAvatarModal from "./AddAvatarModalProps";
import { useState, useEffect } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";
interface SongType {
  _id: string;
  title: string;
  icon: string | null;
  colors: string[];
  createdAt: string;
  updatedAt: string;
}
export default function SongType() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songTypes, setSongTypes] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  useEffect(() => {
    fetchSongTypes();
  }, []);
  const fetchSongTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/song-types");
      const filtered = res.data.data.songTypes.filter(
        (item: SongType) => item.icon
      );
      setSongTypes(filtered);
    } catch (err) {
      console.error("Failed to fetch song types", err);
      toast.error("Failed to fetch song types");
    } finally {
      setLoading(false);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = songTypes.slice(indexOfFirstItem, indexOfLastItem);
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/song-types/${id}`);
      setSongTypes((prev) => prev.filter((item) => item._id !== id));
      toast.success("Song type deleted successfully!");
      const newTotal = songTypes.length - 1;
      const maxPage = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete song type");
    }
  };
  const handleSave = (newItem: SongType) => {
    setSongTypes((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    toast.success("Song type added successfully!");
  };
  const normalizeColor = (color: string) => {
    if (!color) return "#f3f3f3";
    return color.startsWith("#") ? color : `#${color}`;
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#4B5563]">
          Song Types Avatars
        </h2>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-[#9458E8] via-[#A43EE7] to-[#CA00E5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Song Type
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : songTypes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No song types found</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Add your first song type
          </button>
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
                  onClick={() => handleDelete(item._id)}
                  className="
            absolute top-2 right-2 z-10
            w-8 h-8 rounded-full
            bg-white/70 backdrop-blur
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-all duration-200
            hover:bg-red-50 hover:scale-110
            shadow-sm
          "
                  title="Delete"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
                <img
                  src={item.icon!}
                  alt={item.title}
                  className="w-32 h-32 object-contain p-4"
                />
              </div>
              <p className="text-xs text-center text-[#4B5563] font-medium mt-1">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      )}
      {!loading && songTypes.length > 0 && (
        <Pagination
          totalItems={songTypes.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      <AddAvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiEndpoint="/api/song-types"
        categoryName="Song Type"
        onSave={handleSave}
      />
    </div>
  );
}
