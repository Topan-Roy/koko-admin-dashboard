import { useState, useRef, useEffect } from "react";
import { X, Music, Image } from "lucide-react";
import api from "@/Context/api";
import { toast } from "react-toastify";
import type { FreeLibraryItem } from "../types";

export default function EditFreeLibraryItem({
  item,
  onClose,
  onSuccess,
}: {
  item: FreeLibraryItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [duration, setDuration] = useState(item.duration != null ? String(item.duration) : "");
  const [isActive, setIsActive] = useState(item.isActive);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setDuration(item.duration != null ? String(item.duration) : "");
    setIsActive(item.isActive);
  }, [item._id, item.title, item.description, item.duration, item.isActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      const durNum = duration.trim() ? parseInt(duration, 10) : null;
      if (durNum !== null && !isNaN(durNum)) formData.append("duration", String(durNum));
      formData.append("isActive", String(isActive));
      if (audioFile) formData.append("audio", audioFile);
      if (coverFile) formData.append("coverImage", coverFile);

      await api.patch(`/api/free-library/${item._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Item updated");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">Edit Free Library Item</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <p className="text-sm text-gray-600 capitalize">{item.type}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={0}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Replace audio (optional)</label>
            <input
              ref={audioRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => audioRef.current?.click()}
              className="w-full flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 px-3 hover:border-purple-400 hover:bg-purple-50/30 transition-colors"
            >
              <Music className="text-gray-400" size={24} />
              <span className="text-sm text-gray-600">
                {audioFile ? audioFile.name : "Upload new audio to replace"}
              </span>
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Replace cover (optional)</label>
            <input
              ref={coverRef}
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              className="w-full flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 px-3 hover:border-purple-400 hover:bg-purple-50/30 transition-colors"
            >
              <Image className="text-gray-400" size={24} />
              <span className="text-sm text-gray-600">
                {coverFile ? coverFile.name : "Upload new cover to replace"}
              </span>
            </button>
            {item.coverImageUrl && !coverFile && (
              <img src={item.coverImageUrl} alt="" className="mt-2 w-20 h-20 rounded object-cover" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="edit-active" className="text-sm text-gray-700">Active (visible to users)</label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
              style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
