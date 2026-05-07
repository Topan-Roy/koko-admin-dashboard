import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import PromptTabs from "./PromptTabs";
import api from "@/Context/api";
import { toast } from "react-toastify";

export type TitlePromptKey = "title" | "story_title" | "song_title";

interface TitlePromptData {
  _id: string;
  promptKey: string;
  systemPrompt: string;
  variables: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface TitlePromptsResponse {
  title: TitlePromptData | null;
  story_title: TitlePromptData | null;
  song_title: TitlePromptData | null;
}

const TITLE_KEYS: { key: TitlePromptKey; label: string; description: string }[] = [
  { key: "title", label: "Unified Title Prompt", description: "Used for both story and song titles when set. Supports (contentType)." },
  { key: "story_title", label: "Story Title Prompt", description: "Fallback for story titles when unified prompt is not set." },
  { key: "song_title", label: "Song Title Prompt", description: "Fallback for song titles when unified prompt is not set." },
];

const PLACEHOLDERS = [
  { name: "(content)", desc: "Truncated story/song text (plain text)." },
  { name: "(childName)", desc: "Child's name for personalization." },
  { name: "(theme)", desc: "Theme (e.g. Adventure, Musical)." },
  { name: "(contentType)", desc: '"story" or "song". Only for unified title prompt.' },
];

export default function TitlePrompts() {
  const [data, setData] = useState<TitlePromptsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<TitlePromptKey | null>(null);
  const [editedPrompts, setEditedPrompts] = useState<Record<TitlePromptKey, string>>({
    title: "",
    story_title: "",
    song_title: "",
  });

  const fetchTitlePrompts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/prompts/title-prompts");
      const d = response.data?.data ?? response.data;
      setData(d);
      setEditedPrompts({
        title: d?.title?.systemPrompt ?? "",
        story_title: d?.story_title?.systemPrompt ?? "",
        song_title: d?.song_title?.systemPrompt ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch title prompts:", error);
      toast.error("Failed to load title prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitlePrompts();
  }, []);

  const handleSave = async (key: TitlePromptKey) => {
    const systemPrompt = editedPrompts[key]?.trim();
    if (!systemPrompt) {
      toast.error("Prompt text is required");
      return;
    }
    try {
      await api.patch(`/api/prompts/title-prompts/${key}`, { systemPrompt });
      toast.success("Title prompt updated");
      setEditingKey(null);
      fetchTitlePrompts();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to update prompt";
      toast.error(msg);
    }
  };

  const handleCancelEdit = (key: TitlePromptKey) => {
    const prompt = key === "title" ? data?.title : key === "story_title" ? data?.story_title : data?.song_title;
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
                  Title Prompt Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage prompts used to generate titles for stories and songs
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              </div>
            ) : (
              <div className="space-y-8">
                {TITLE_KEYS.map(({ key, label, description }) => {
                  const prompt = key === "title" ? data?.title : key === "story_title" ? data?.story_title : data?.song_title;
                  const isEditing = editingKey === key;

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
                            className="w-full h-[300px] p-4 text-sm text-[#4B5563] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                            placeholder="Enter system prompt..."
                          />
                        ) : (
                          <div className="text-sm text-[#4B5563] whitespace-pre-wrap bg-gray-50/30 p-6 rounded-lg border border-gray-100 min-h-[100px]">
                            {prompt?.systemPrompt || "Not configured yet. Click edit to set."}
                          </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <h3 className="text-xs font-semibold text-[#4B5563] mb-3 uppercase tracking-wider">Available Intelligence Variables:</h3>
                          <div className="flex flex-wrap gap-2">
                            {PLACEHOLDERS.map((p) => (
                              <span key={p.name} title={p.desc} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200 cursor-help">
                                {p.name}
                              </span>
                            ))}
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
