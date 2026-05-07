import { useEffect, useState } from "react";
import AdminHeader from "../ui/AdminHeader";
import SideBar from "../ui/SideBar";
import api from "../../Context/api";
import { toast } from "react-toastify";
import { Settings, Volume2, Music, BookOpen, ImageIcon, DollarSign, Globe, Link, Eye, EyeOff, Key } from "lucide-react";

export default function ApiConfig() {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/api-config");
      setConfigs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch configs:", error);
      toast.error("Failed to load configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/api/admin/api-config", configs);
      toast.success("Configurations updated successfully");
    } catch (error) {
      console.error("Failed to update configs:", error);
      toast.error("Failed to update configurations");
    } finally {
      setSaving(false);
    }
  };

  const updateNestedValue = (key: string, path: string, newValue: any) => {
    const currentConfigs = { ...configs };
    if (!currentConfigs[key]) currentConfigs[key] = {};
    
    const keys = path.split('.');
    let temp = currentConfigs[key];
    for (let i = 0; i < keys.length - 1; i++) {
      if (!temp[keys[i]]) temp[keys[i]] = {};
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = newValue;

    // Special handling for shared Gemini Key if we want to sync them
    if (path === 'apiKey' && (key === 'story_config' || key === 'image_config' || key === 'tts_config')) {
      // Synchronize across all Gemini-dependent services
      if (currentConfigs.story_config) currentConfigs.story_config.apiKey = newValue;
      if (currentConfigs.image_config) currentConfigs.image_config.apiKey = newValue;
      if (currentConfigs.tts_config) currentConfigs.tts_config.apiKey = newValue;
    }

    setConfigs(currentConfigs);
  };

  const toggleKeyVisibility = (field: string) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const ConfigCard = ({ title, description, icon: Icon, children }: { title: string, description?: string, icon?: any, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-purple-50 rounded-xl">
          {Icon && <Icon className="text-purple-600" size={20} />}
        </div>
        <div>
          <h3 className="font-bold text-[#111827] text-base">{title}</h3>
          {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder = "", helper = "", fieldId = "" }: any) => {
    const isPassword = type === "password";
    const isVisible = showKeys[fieldId];
    const inputType = isPassword ? (isVisible ? "text" : "password") : type;

    return (
      <div className="w-full">
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-0.5">{label}</label>
        <div className="relative group">
          <input
            type={inputType}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-2.5 pr-10 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm bg-gray-50/50 focus:bg-white text-gray-700 font-medium`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => toggleKeyVisibility(fieldId)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {helper && <p className="text-[10px] text-gray-400 mt-1.5 ml-1">{helper}</p>}
      </div>
    );
  };

  const ttsModel = configs.tts_config?.model || "gemini-2.5-flash-preview-tts";
  const ttsApi = configs.tts_config?.generateContentApi || "streamGenerateContent";
  const dynamicTtsEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:${ttsApi}`;
  const manualEndpoint = configs.tts_config?.endpoint;

  return (
    <div className="flex items-start justify-center bg-[#F9F9F9] min-h-screen">
      <SideBar />
      <div className="w-full pb-10">
        <AdminHeader />
        
        <div className="px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">API Infrastructure</h1>
            <p className="text-sm text-gray-500 mt-1">Configure models, endpoints, and credentials across the platform</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50 active:scale-95"
          >
            {saving ? "Deploying Changes..." : "Save Settings"}
          </button>
        </div>

        {loading ? (
          <div className="px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-32 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Synchronizing configurations...</p>
            </div>
          </div>
        ) : (
          <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Global Credentials Card */}
            <ConfigCard 
              title="Global Credentials" 
              description="Primary API keys shared across multiple services"
              icon={Key}
            >
              <InputField 
                label="Master Gemini API Key" 
                type="password"
                fieldId="gemini_master"
                placeholder="Paste Gemini API Key here..."
                value={configs.story_config?.apiKey} 
                onChange={(val: string) => updateNestedValue('story_config', 'apiKey', val)}
                helper="This key is automatically synced for Story, Image, and Audio generation."
              />
            </ConfigCard>

            {/* Story Generation Card */}
            <ConfigCard 
              title="Story Generation" 
              description="Gemini Flash model for narrative text"
              icon={BookOpen}
            >
              <InputField 
                label="Generation Endpoint" 
                value={configs.story_config?.endpoint} 
                onChange={(val: string) => updateNestedValue('story_config', 'endpoint', val)}
              />
            </ConfigCard>

            {/* Image Generation Card */}
            <ConfigCard 
              title="Image Generation" 
              description="Gemini Flash Image model for scene art"
              icon={ImageIcon}
            >
              <InputField 
                label="Image Endpoint" 
                value={configs.image_config?.endpoint} 
                onChange={(val: string) => updateNestedValue('image_config', 'endpoint', val)}
              />
            </ConfigCard>

            {/* Story Audio (TTS) Card */}
            <ConfigCard 
              title="Story Audio (Gemini TTS)" 
              description="Multimodal audio generation settings"
              icon={Volume2}
            >
              <InputField 
                label="Voice Name" 
                placeholder="e.g. Leda"
                value={configs.tts_config?.voiceName} 
                onChange={(val: string) => updateNestedValue('tts_config', 'voiceName', val)}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Model ID" 
                  placeholder="gemini-2.5-flash-preview-tts"
                  value={configs.tts_config?.model} 
                  onChange={(val: string) => updateNestedValue('tts_config', 'model', val)}
                />
                <InputField 
                  label="Generate API" 
                  placeholder="streamGenerateContent"
                  value={configs.tts_config?.generateContentApi} 
                  onChange={(val: string) => updateNestedValue('tts_config', 'generateContentApi', val)}
                />
              </div>
              
              <div className="space-y-4">
                <InputField 
                  label="Full Endpoint Override" 
                  placeholder="Leave empty to use dynamic URL"
                  value={configs.tts_config?.endpoint} 
                  onChange={(val: string) => updateNestedValue('tts_config', 'endpoint', val)}
                  helper="Manually override the full URL if needed."
                />

                <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    {manualEndpoint ? <Link size={10} className="text-blue-500" /> : <Globe size={10} />} 
                    {manualEndpoint ? "Active Manual Override" : "Active Dynamic Endpoint"}
                  </label>
                  <div className={`text-[10px] font-mono break-all leading-relaxed ${manualEndpoint ? 'text-blue-600' : 'text-purple-600'}`}>
                    {manualEndpoint || dynamicTtsEndpoint}
                  </div>
                </div>
              </div>
            </ConfigCard>

            {/* Song Generation (Lyrics) Card */}
            <ConfigCard 
              title="Song Generate" 
              description="MusicGPT API settings for lyrics"
              icon={Music}
            >
              <InputField 
                label="MusicGPT API Key" 
                type="password"
                fieldId="musicgpt_key"
                value={configs.song_config?.apiKey} 
                onChange={(val: string) => updateNestedValue('song_config', 'apiKey', val)}
              />
              <InputField 
                label="Lyrics Endpoint" 
                value={configs.song_config?.lyricsEndpoint} 
                onChange={(val: string) => updateNestedValue('song_config', 'lyricsEndpoint', val)}
              />
            </ConfigCard>

            {/* Song Audio Generate Card */}
            <ConfigCard 
              title="Song Audio Generate" 
              description="MusicGPT MusicAI settings"
              icon={Settings}
            >
              <InputField 
                label="MusicAI Endpoint" 
                value={configs.song_config?.musicEndpoint} 
                onChange={(val: string) => updateNestedValue('song_config', 'musicEndpoint', val)}
              />
              <InputField 
                label="Task Retrieval Endpoint" 
                value={configs.song_config?.getMusicEndpoint} 
                onChange={(val: string) => updateNestedValue('song_config', 'getMusicEndpoint', val)}
              />
            </ConfigCard>

            {/* Economic Pricing Card */}
            <ConfigCard 
              title="Economic Model" 
              description="Cost calculation per 1M units"
              icon={DollarSign}
            >
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Gemini In ($)" 
                  type="number"
                  value={configs.api_usage_pricing?.gemini_input_per_1m_tokens_usd} 
                  onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gemini_input_per_1m_tokens_usd', parseFloat(val))}
                />
                <InputField 
                  label="Gemini Out ($)" 
                  type="number"
                  value={configs.api_usage_pricing?.gemini_output_per_1m_tokens_usd} 
                  onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gemini_output_per_1m_tokens_usd', parseFloat(val))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Image ($/ea)" 
                  type="number"
                  value={configs.api_usage_pricing?.gemini_image_per_image_usd} 
                  onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gemini_image_per_image_usd', parseFloat(val))}
                />
                <InputField 
                  label="GCP TTS ($)" 
                  type="number"
                  value={configs.api_usage_pricing?.gcp_tts_per_1m_chars_usd} 
                  onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gcp_tts_per_1m_chars_usd', parseFloat(val))}
                />
              </div>
            </ConfigCard>

          </div>
        )}
      </div>
    </div>
  );
}
