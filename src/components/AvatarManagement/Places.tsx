import { Plus, Trash2 } from "lucide-react";
import Pagination from "../ui/Pagination";
import AddAvatarModal from "./AddAvatarModalProps";
import { useState, useEffect } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";
interface Place {
  _id: string;
  title: string;
  icon: string | null;
  colors: string[];
  createdAt: string;
  updatedAt: string;
}
export default function Places() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const normalizeColor = (color: string) =>
    color.startsWith("#") ? color : `#${color}`;
  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/places");
      const filtered = res.data.data.places.filter((p: Place) => p.icon);
      setPlaces(filtered);
    } catch (err) {
      console.error("Failed to fetch places", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlaces();
  }, []);
  const handleSavePlace = async () => {
    await fetchPlaces();
    setIsModalOpen(false);
  };
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/places/${id}`);
      setPlaces((prev) => prev.filter((item) => item._id !== id));
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete item");
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#4B5563]">Places Avatars</h2>
        <button
          className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-[#9458E8] via-[#A43EE7] to-[#CA00E5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Place
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
      <Pagination
        totalItems={places.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <AddAvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiEndpoint="/api/places"
        categoryName="Place"
        onSave={handleSavePlace}
      />
    </div>
  );
}
