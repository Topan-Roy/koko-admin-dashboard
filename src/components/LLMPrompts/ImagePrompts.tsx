import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import PromptTabs from "./PromptTabs";
import api from "@/Context/api";
import { toast } from "react-toastify";

export type ImagePromptKey = "story_image" | "album_cover";

interface ImagePromptData {
  _id: string;
  promptKey: string;
  systemPrompt: string;
  variables: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ImagePromptsResponse {
  story_image: ImagePromptData | null;
  album_cover: ImagePromptData | null;
}

const IMAGE_KEYS: { key: ImagePromptKey; label: string; description: string }[] = [
  {
    key: "story_image",
    label: "Story image prompt",
    description: "Template for each story scene illustration. Used once per scene.",
  },
  {
    key: "album_cover",
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
    story_image: "",
    album_cover: "",
  });

  const fetchImagePrompts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/prompts/image-prompts");
      const d = response.data?.data ?? response.data;
      setData(d);
      setEditedPrompts({
        story_image: d?.story_image?.systemPrompt ?? "",
        album_cover: d?.album_cover?.systemPrompt ?? "",
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
      if (err.response?.status === 404) {
        toast.error("Prompt not found. Run npm run seed:image-prompts on the backend once.");
      } else {
        toast.error(msg);
      }
    }
  };

  const handleCancelEdit = (key: ImagePromptKey) => {
    const prompt = key === "story_image" ? data?.story_image : data?.album_cover;
    setEditedPrompts((prev) => ({ ...prev, [key]: prompt?.systemPrompt ?? "" }));
    setEditingKey(null);
  };

  return (
    <div className="flex items-start justify-center bg-[#F9F9F9]">
      <SideBar />
      <div className="w-full pb-4">
        <AdminHeader />
        <div className="mt-6 px-6">
          <PromptTabs />
          <div className="mt-6">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-[#111827] mb-1">
                Image prompts
              </h1>
              <p className="text-sm text-[#4B5563]">
                Edit prompts used for story scene illustrations and song album cover images. Use placeholders in the template; the backend fills them when generating images.
              </p>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {IMAGE_KEYS.map(({ key, label, description }) => {
                  const prompt = key === "story_image" ? data?.story_image : data?.album_cover;
                  const isEditing = editingKey === key;
                  const placeholders = key === "story_image" ? STORY_PLACEHOLDERS : ALBUM_PLACEHOLDERS;

                  return (
                    <div
                      key={key}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-sm font-semibold text-[#4B5563]">
                          {label}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                      </div>
                      <div className="p-6">
                        {prompt ? (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">
                                promptKey: <code className="bg-gray-100 px-1 rounded">{key}</code>
                              </span>
                              <div className="flex items-center gap-2">
                                {!isEditing ? (
                                  <button
                                    type="button"
                                    onClick={() => setEditingKey(key)}
                                    className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded hover:bg-purple-100 cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleSave(key)}
                                      className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCancelEdit(key)}
                                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            {isEditing ? (
                              <textarea
                                value={editedPrompts[key]}
                                onChange={(e) =>
                                  setEditedPrompts((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                className="w-full min-h-[200px] p-4 text-sm text-[#4B5563] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono resize-y"
                                placeholder="Enter system prompt with placeholders..."
                              />
                            ) : (
                              <div className="text-sm text-[#4B5563] whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {prompt.systemPrompt}
                              </div>
                            )}
                            {prompt.variables?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <span className="text-xs font-medium text-[#4B5563]">Variables: </span>
                                <span className="text-xs text-[#6B7280]">
                                  {prompt.variables.join(", ")}
                                </span>
                              </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs font-medium text-[#4B5563] mb-2">Placeholders you can use:</p>
                              <ul className="text-xs text-[#6B7280] space-y-1">
                                {placeholders.map((p) => (
                                  <li key={p.name}>
                                    <code className="bg-gray-100 px-1 rounded">{p.name}</code> — {p.desc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div className="py-6">
                            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
                              This prompt is not seeded yet. Ask your backend admin to run{" "}
                              <code className="bg-amber-100 px-1 rounded">npm run seed:image-prompts</code> once to create default prompts.
                            </p>
                          </div>
                        )}
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
