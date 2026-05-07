import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import PromptTabs from "./PromptTabs";
import api from "@/Context/api";
import { toast } from "react-toastify";

export type ImagePromptKey = "story_image_prompt" | "album_cover_prompt";

interface ImagePromptData {
  _id: string;
  promptKey: string;
  systemPrompt: string;
  variables: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ImagePromptsResponse {
  story_image_prompt: ImagePromptData | null;
  album_cover_prompt: ImagePromptData | null;
}

const IMAGE_KEYS: { key: ImagePromptKey; label: string; description: string }[] = [
  {
    key: "story_image_prompt",
    label: "Story image prompt",
    description: "Template for each story scene illustration. Used once per scene.",
  },
  {
    key: "album_cover_prompt",
    label: "Album cover prompt",
    description: "Template for song/album cover image. Used once per song.",
  },
];

const STORY_PLACEHOLDERS = [
  { name: "(style description)", desc: "Visual style for this image (e.g. colorful cartoon)." },
  { name: "(scene text)", desc: "The scene narrative snippet." },
  { name: "(consistency note)", desc: "Note for character/setting consistency." },
  { name: "(title)", desc: "Story title (optional)." },
  { name: "(description)", desc: "Story description (optional)." },
];

const ALBUM_PLACEHOLDERS = [
  { name: "(song title)", desc: "Title of the song." },
  { name: "(characters list)", desc: "Comma-separated characters." },
  { name: "(places list)", desc: "Comma-separated places." },
  { name: "(items list)", desc: "Comma-separated items." },
  { name: "(theme words)", desc: "Theme/mood words." },
  { name: "(time of day)", desc: "e.g. sunset, morning." },
];

export default function ImagePrompts() {
  const [data, setData] = useState<ImagePromptsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<ImagePromptKey | null>(null);
  const [editedPrompts, setEditedPrompts] = useState<Record<ImagePromptKey, string>>({
    story_image_prompt: "",
    album_cover_prompt: "",
  });

  const fetchImagePrompts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/prompts/image-prompts");
      const d = response.data?.data ?? response.data;
      setData(d);
      setEditedPrompts({
        story_image_prompt: d?.story_image_prompt?.systemPrompt ?? "",
        album_cover_prompt: d?.album_cover_prompt?.systemPrompt ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch image prompts:", error);
      toast.error("Failed to load image prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagePrompts();
  }, []);

  const handleSave = async (key: ImagePromptKey) => {
    const systemPrompt = editedPrompts[key]?.trim();
    if (!systemPrompt) {
      toast.error("Prompt text is required");
      return;
    }
    try {
      await api.patch(`/api/prompts/image-prompts/${key}`, { systemPrompt });
      toast.success("Image prompt updated");
      setEditingKey(null);
      fetchImagePrompts();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to update prompt";
      toast.error(msg);
    }
  };

  const handleCancelEdit = (key: ImagePromptKey) => {
    const prompt = key === "story_image_prompt" ? data?.story_image_prompt : data?.album_cover_prompt;
    setEditedPrompts((prev) => ({ ...prev, [key]: prompt?.systemPrompt ?? "" }));
    setEditingKey(null);
  };

  return (
    <div className="flex items-start justify-center bg-[#F9F9F9] min-h-screen">
      <SideBar />
      <div className="w-full pb-10">
        <AdminHeader />
        <div className="mt-6 px-6">
          <PromptTabs />
          <div className="">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-[#111827] mb-1 mt-8">
                  Image Prompt Management
                </h1>
                <p className="text-sm text-gray-500">
                  Edit prompts used for story scene illustrations and song album cover images
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              </div>
            ) : (
              <div className="space-y-8">
                {IMAGE_KEYS.map(({ key, label, description }) => {
                  const prompt = key === "story_image_prompt" ? data?.story_image_prompt : data?.album_cover_prompt;
                  const isEditing = editingKey === key;
                  const placeholders = key === "story_image_prompt" ? STORY_PLACEHOLDERS : ALBUM_PLACEHOLDERS;

                  return (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="text-sm font-semibold text-[#4B5563]">
                              {label.toUpperCase()}:
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isEditing ? (
                              <button
                                onClick={() => setEditingKey(key)}
                                className="p-1.5 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11.333 2L14 4.667l-9.333 9.333H2v-2.667L11.333 2z" stroke="#9333EA" strokeWidth="1.2" />
                                </svg>
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSave(key)}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleCancelEdit(key)}
                                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <textarea
                            value={editedPrompts[key]}
                            onChange={(e) => setEditedPrompts((prev) => ({ ...prev, [key]: e.target.value }))}
                            className="w-full h-[400px] p-4 text-sm text-[#4B5563] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                            placeholder="Enter system prompt with placeholders..."
                          />
                        ) : (
                          <div className="text-sm text-[#4B5563] whitespace-pre-wrap bg-gray-50/30 p-6 rounded-lg border border-gray-100 min-h-[100px]">
                            {prompt?.systemPrompt || "Not configured yet. Click edit to set."}
                          </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {prompt?.variables && prompt.variables.length > 0 && (
                            <div>
                              <h3 className="text-xs font-semibold text-[#4B5563] mb-3 uppercase tracking-wider">Variables Used:</h3>
                              <div className="flex flex-wrap gap-2">
                                {prompt.variables.map((v) => (
                                  <span key={v} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full border border-purple-100">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <h3 className="text-xs font-semibold text-[#4B5563] mb-3 uppercase tracking-wider">Available Placeholders:</h3>
                            <div className="flex flex-wrap gap-2">
                              {placeholders.map((p) => (
                                <span key={p.name} title={p.desc} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200 cursor-help">
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
