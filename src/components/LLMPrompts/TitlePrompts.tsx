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
  { key: "title", label: "Unified (title)", description: "Used for both story and song titles when set. Supports (contentType)." },
  { key: "story_title", label: "Story title", description: "Fallback for story titles when unified prompt is not set." },
  { key: "song_title", label: "Song title", description: "Fallback for song titles when unified prompt is not set." },
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
  const [creatingKey, setCreatingKey] = useState<TitlePromptKey | null>(null);
  const [newPromptText, setNewPromptText] = useState("");

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
      if (err.response?.status === 404) {
        toast.error("Prompt not found. Use Create to add it first.");
      } else {
        toast.error(msg);
      }
    }
  };

  const handleCreate = async (key: TitlePromptKey) => {
    const systemPrompt = newPromptText.trim();
    if (!systemPrompt) {
      toast.error("Prompt text is required");
      return;
    }
    try {
      await api.post("/api/prompts", { promptKey: key, systemPrompt });
      toast.success("Title prompt created");
      setCreatingKey(null);
      setNewPromptText("");
      fetchTitlePrompts();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to create prompt");
    }
  };

  const handleCancelEdit = (key: TitlePromptKey) => {
    const prompt = key === "title" ? data?.title : key === "story_title" ? data?.story_title : data?.song_title;
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
                Title generation
              </h1>
              <p className="text-sm text-[#4B5563]">
                Manage prompts used to generate titles for stories and songs. Use the unified prompt for both, or separate story/song title prompts.
              </p>
            </div>

            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="text-sm font-semibold text-[#4B5563] mb-2">Placeholders (use in prompts)</h3>
              <ul className="text-xs text-[#4B5563] space-y-1">
                {PLACEHOLDERS.map((p) => (
                  <li key={p.name}>
                    <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200">{p.name}</code> — {p.desc}
                  </li>
                ))}
              </ul>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {TITLE_KEYS.map(({ key, label, description }) => {
                  const prompt = key === "title" ? data?.title : key === "story_title" ? data?.story_title : data?.song_title;
                  const isEditing = editingKey === key;
                  const isCreating = creatingKey === key;

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
                                placeholder="Enter system prompt..."
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
                          </>
                        ) : (
                          <>
                            {!isCreating ? (
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">Not configured</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCreatingKey(key);
                                    setNewPromptText("");
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#9458E8] to-[#CA00E5] rounded hover:opacity-90 cursor-pointer"
                                >
                                  Create
                                </button>
                              </div>
                            ) : (
                              <div>
                                <textarea
                                  value={newPromptText}
                                  onChange={(e) => setNewPromptText(e.target.value)}
                                  className="w-full min-h-[200px] p-4 text-sm text-[#4B5563] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono resize-y mb-3"
                                  placeholder="Enter system prompt (e.g. with (content), (childName), (theme), (contentType))..."
                                />
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCreate(key)}
                                    disabled={!newPromptText.trim()}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Create prompt
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCreatingKey(null);
                                      setNewPromptText("");
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
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
