import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import PromptTabs from "./PromptTabs";
import api from "@/Context/api";
import { toast } from "react-toastify";

interface PromptData {
  _id: string;
  promptKey: string;
  systemPrompt: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export default function SongPrompts() {
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");

  useEffect(() => {
    fetchPromptData();
  }, []);

  const fetchPromptData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/prompts/song_master");
      const data = response.data.data.prompt;
      setPromptData(data);
      setEditedPrompt(data?.systemPrompt || "");
    } catch (error) {
      console.error("Failed to fetch prompt data:", error);
      toast.error("Failed to load prompt data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch("/api/prompts/song_master", {
        systemPrompt: editedPrompt,
      });
      toast.success("Prompt updated successfully!");
      setIsEditing(false);
      fetchPromptData();
    } catch (error) {
      console.error("Failed to update prompt:", error);
      toast.error("Failed to update prompt");
    }
  };

  const handleCancel = () => {
    setEditedPrompt(promptData?.systemPrompt || "");
    setIsEditing(false);
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
                  Song Prompt Management
                </h1>
                <p className="text-sm text-gray-500">
                  View and manage all your Song Master Prompts
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-[#4B5563]">
                      SYSTEM PROMPT:
                    </h2>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-1.5 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2L14 4.667l-9.333 9.333H2v-2.667L11.333 2z" stroke="#9333EA" strokeWidth="1.2" />
                          </svg>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSave}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 cursor-pointer transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="w-full h-[600px] p-4 text-sm text-[#4B5563] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                      placeholder="Enter system prompt..."
                    />
                  ) : (
                    <div className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap min-h-[100px]">
                      {promptData?.systemPrompt || "Not configured yet. Click edit to set."}
                    </div>
                  )}
                  
                  {promptData?.variables && promptData.variables.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-[#4B5563] mb-3">
                        Variables Used:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {promptData.variables.map((variable, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200 font-medium">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
