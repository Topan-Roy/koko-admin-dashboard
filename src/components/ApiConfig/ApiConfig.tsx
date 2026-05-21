import { useEffect, useState } from "react";
import AdminHeader from "../ui/AdminHeader";
import SideBar from "../ui/SideBar";
import api from "../../Context/api";
import { toast } from "react-toastify";
import { 
  Music, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Cpu,
  Route,
  Shield,
  Save
} from "lucide-react";

export default function ApiConfig() {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('title');

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
    setConfigs((prevConfigs: any) => {
      const currentConfigs = { ...prevConfigs };
      const root = { ...(currentConfigs[key] || {}) };
      currentConfigs[key] = root;
      const keys = path.split('.');

      let temp = root;
      for (let i = 0; i < keys.length - 1; i++) {
        const next = temp[keys[i]];
        const nextCloned = next && typeof next === 'object' ? { ...next } : {};
        temp[keys[i]] = nextCloned;
        temp = nextCloned;
      }
      temp[keys[keys.length - 1]] = newValue;
      return currentConfigs;
    });
  };

  const toggleKeyVisibility = (field: string) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const storyImageModelValue = configs.story_image_config?.model || "";
  const songImageModelValue = configs.song_image_config?.model || "";

  const tabs = [
    { id: 'title', label: 'Title Config', icon: Route },
    { id: 'story', label: 'Story Config', icon: Cpu },
    { id: 'song', label: 'Song Config', icon: Music },
    { id: 'economics', label: 'Usage Costs', icon: DollarSign },
  ];

  // Components
  const SettingRow = ({ label, description, children, layout = "horizontal" }: any) => (
    <div className={`py-5 border-b border-gray-100 last:border-0 ${layout === 'horizontal' ? 'flex flex-col lg:flex-row lg:items-start justify-between gap-6' : 'flex flex-col gap-3'}`}>
      <div className={layout === 'horizontal' ? "lg:w-5/12 shrink-0" : ""}>
        <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
        {description && <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">{description}</p>}
      </div>
      <div className={layout === 'horizontal' ? "lg:w-7/12 w-full" : "w-full"}>
        {children}
      </div>
    </div>
  );

  const InputField = ({ value, onChange, type = "text", placeholder = "", fieldId = "" }: any) => {
    const isPassword = type === "password";
    const isVisible = showKeys[fieldId];
    const inputType = isPassword ? (isVisible ? "text" : "password") : type;
    const [draftValue, setDraftValue] = useState(value ?? "");

    useEffect(() => {
      setDraftValue(value ?? "");
    }, [value]);

    return (
      <div className="relative group w-full">
        <input
          type={inputType}
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onBlur={() => onChange(draftValue)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange(draftValue);
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder={placeholder}
          className="w-full p-2.5 px-3.5 pr-10 rounded-lg border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-[14px] bg-white text-gray-800 font-medium hover:border-gray-300 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => toggleKeyVisibility(fieldId)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-600 bg-white rounded-md transition-colors"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    );
  };

  const SelectField = ({ value, onChange, options }: any) => {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 px-3.5 rounded-lg border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-[14px] bg-white text-gray-800 font-medium hover:border-gray-300 cursor-pointer appearance-none shadow-sm"
        style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
      >
        <option value="" disabled>Select option...</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  };

  const Section = ({ title, children }: any) => (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <div className="px-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex items-start justify-center bg-[#F9FAFB] min-h-screen">
      <SideBar />
      <div className="w-full pb-12">
        <AdminHeader />
        
        {/* Page Header */}
        <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 bg-white sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-purple-600" size={24} />
              Platform Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage title, story, song, and usage-cost settings.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-all disabled:opacity-70 active:scale-95 flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading configurations...</p>
          </div>
        ) : (
          <div className="px-8 mt-8 flex flex-col lg:flex-row gap-10">
            
            {/* Left Sidebar Tabs */}
            <div className="lg:w-64 shrink-0">
              <nav className="flex flex-col gap-1 sticky top-32">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-purple-600" : "text-gray-400"} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 max-w-4xl">
              
              {/* TAB: TITLE CONFIG */}
              {activeTab === 'title' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <Section title="Title Generation (Gemini)">
                    <SettingRow 
                      label="Title API Key"
                      description="API key used for generating story and song titles."
                    >
                      <InputField 
                        type="password"
                        fieldId="title_text_secret"
                        placeholder="AIzaSy..."
                        value={configs.title_text_config?.secret}
                        onChange={(val: string) => updateNestedValue('title_text_config', 'secret', val)}
                      />
                    </SettingRow>
                    <SettingRow
                      label="Title Model"
                      description="Model used to generate titles."
                    >
                      <InputField
                        placeholder="gemini-2.5-flash"
                        value={configs.title_text_config?.model}
                        onChange={(val: string) => updateNestedValue('title_text_config', 'model', val)}
                      />
                    </SettingRow>
                  </Section>

                </div>
              )}

              {/* TAB: STORY */}
              {activeTab === 'story' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <Section title="Story Creation (Gemini)">
                      <SettingRow label="Story Model" description="Choose which Gemini model writes stories.">
                      <InputField 
                        placeholder="gemini-2.5-flash"
                        value={configs.story_text_config?.model}
                        onChange={(val: string) => updateNestedValue('story_text_config', 'model', val)}
                      />
                    </SettingRow>
                    <SettingRow
                      label="Story API Key"
                      description="API key used for story generation flows."
                    >
                      <InputField
                        type="password"
                        fieldId="story_key"
                        placeholder="AIzaSy..."
                        value={configs.story_text_config?.secret}
                        onChange={(val: string) => updateNestedValue('story_text_config', 'secret', val)}
                      />
                    </SettingRow>
                  
                  </Section>

                  <Section title="Story Images (Gemini)">
                    <SettingRow
                      label="Story Image Model"
                      description="Model used for generating story scene images."
                    >
                      <InputField 
                        placeholder="gemini-2.5-flash-image"
                        value={storyImageModelValue}
                        onChange={(val: string) => updateNestedValue('story_image_config', 'model', val)}
                      />
                    </SettingRow>
                    <SettingRow label="Story Image API Key" description="API key used for story image generation.">
                      <InputField
                        type="password"
                        fieldId="story_image_secret"
                        placeholder="AIzaSy..."
                        value={configs.story_image_config?.secret}
                        onChange={(val: string) => updateNestedValue('story_image_config', 'secret', val)}
                      />
                    </SettingRow>
                  </Section>

                  <Section title="Story Voice">
                    <SettingRow label="Voice Engine" description="Select the service used to generate story audio.">
                      <SelectField
                        value={configs.story_tts_config?.enabled || 'gemini'}
                        onChange={(val: string) => updateNestedValue('story_tts_config', 'enabled', val)}
                        options={[
                          { label: 'Google Gemini', value: 'gemini' },
                          { label: 'Mistral AI', value: 'mistral' },
                          { label: 'OpenAI', value: 'openai' },
                        ]}
                      />
                    </SettingRow>

                    {(!configs.story_tts_config?.enabled || configs.story_tts_config?.enabled === 'gemini') && (
                      <>
                        <SettingRow label="Gemini API Key">
                          <InputField 
                            type="password"
                            fieldId="story_tts_gemini_secret"
                            placeholder="AIzaSy..."
                            value={configs.story_tts_config?.options?.gemini?.secret}
                            onChange={(val: string) => updateNestedValue('story_tts_config', 'options.gemini.secret', val)}
                          />
                        </SettingRow>
                        <SettingRow label="Gemini Voice Model">
                          <InputField 
                            placeholder="gemini-2.5-flash-preview-tts"
                            value={configs.story_tts_config?.options?.gemini?.model}
                            onChange={(val: string) => updateNestedValue('story_tts_config', 'options.gemini.model', val)}
                          />
                        </SettingRow>
                      </>
                    )}

                    {configs.story_tts_config?.enabled === 'mistral' && (
                      <>
                        <SettingRow label="Mistral API Key">
                          <InputField 
                            type="password"
                            fieldId="story_tts_mistral_secret"
                            value={configs.story_tts_config?.options?.mistral?.secret}
                            onChange={(val: string) => updateNestedValue('story_tts_config', 'options.mistral.secret', val)}
                          />
                        </SettingRow>
                        <SettingRow label="Mistral Model and Voice">
                          <div className="grid grid-cols-2 gap-3">
                            <InputField 
                              placeholder="voxtral-mini-tts-2603"
                              value={configs.story_tts_config?.options?.mistral?.model}
                              onChange={(val: string) => updateNestedValue('story_tts_config', 'options.mistral.model', val)}
                            />
                            <InputField 
                              placeholder="jane curious"
                              value={configs.story_tts_config?.options?.mistral?.voice}
                              onChange={(val: string) => updateNestedValue('story_tts_config', 'options.mistral.voice', val)}
                            />
                          </div>
                        </SettingRow>
                      </>
                    )}

                    {configs.story_tts_config?.enabled === 'openai' && (
                      <>
                        <SettingRow label="OpenAI API Key">
                          <InputField 
                            type="password"
                            fieldId="story_tts_openai_secret"
                            value={configs.story_tts_config?.options?.openai?.secret}
                            onChange={(val: string) => updateNestedValue('story_tts_config', 'options.openai.secret', val)}
                          />
                        </SettingRow>
                        <SettingRow label="OpenAI Model and Voice">
                          <div className="grid grid-cols-2 gap-3">
                            <InputField 
                              placeholder="gpt-4o-mini-tts"
                              value={configs.story_tts_config?.options?.openai?.model}
                              onChange={(val: string) => updateNestedValue('story_tts_config', 'options.openai.model', val)}
                            />
                            <InputField 
                              placeholder="coral"
                              value={configs.story_tts_config?.options?.openai?.voice}
                              onChange={(val: string) => updateNestedValue('story_tts_config', 'options.openai.voice', val)}
                            />
                          </div>
                        </SettingRow>
                      </>
                    )}
                  </Section>
                </div>
              )}

              {/* TAB: SONG */}
              {activeTab === 'song' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <Section title="Song Generations (MusicGPT)">
                    <SettingRow label="Lyrics API Key" description="API key used for song lyrics generation.">
                      <InputField 
                        type="password"
                        fieldId="song_text_secret"
                        value={configs.song_text_config?.secret}
                        onChange={(val: string) => updateNestedValue('song_text_config', 'secret', val)}
                      />
                    </SettingRow>
                    <SettingRow label="Audio API Key" description="API key used for song audio task generation.">
                      <InputField
                        type="password"
                        fieldId="song_audio_secret"
                        value={configs.song_audio_config?.secret}
                        onChange={(val: string) => updateNestedValue('song_audio_config', 'secret', val)}
                      />
                    </SettingRow>
                  </Section>

                  <Section title="Song Images (Gemini)">
                    <SettingRow
                      label="Song Cover Model"
                      description="Model used only for song/album cover image generation."
                    >
                      <InputField
                        placeholder="gemini-2.5-flash-image"
                        value={songImageModelValue}
                        onChange={(val: string) => updateNestedValue('song_image_config', 'model', val)}
                      />
                    </SettingRow>
                    <SettingRow label="Song Cover API Key" description="API key used for song cover image generation.">
                      <InputField
                        type="password"
                        fieldId="song_image_secret"
                        placeholder="AIzaSy..."
                        value={configs.song_image_config?.secret}
                        onChange={(val: string) => updateNestedValue('song_image_config', 'secret', val)}
                      />
                    </SettingRow>
                  </Section>
                </div>
              )}

              {/* TAB: ECONOMICS */}
              {activeTab === 'economics' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <Section title="Estimated Usage Costs ($)">
                    <SettingRow label="Gemini Text Cost" description="Estimated cost per 1M input and output tokens.">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Input Cost</label>
                          <InputField 
                            type="number"
                            value={configs.api_usage_pricing?.gemini_input_per_1m_tokens_usd} 
                            onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gemini_input_per_1m_tokens_usd', parseFloat(val))}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Output Cost</label>
                          <InputField 
                            type="number"
                            value={configs.api_usage_pricing?.gemini_output_per_1m_tokens_usd} 
                            onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gemini_output_per_1m_tokens_usd', parseFloat(val))}
                          />
                        </div>
                      </div>
                    </SettingRow>
                    <SettingRow label="Media Cost" description="Estimated cost for image generation and voice output.">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Image (Per Edit/Gen)</label>
                          <InputField 
                            type="number"
                            value={configs.api_usage_pricing?.gemini_image_per_image_usd} 
                            onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gemini_image_per_image_usd', parseFloat(val))}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">GCP TTS (Per 1M Chars)</label>
                          <InputField 
                            type="number"
                            value={configs.api_usage_pricing?.gcp_tts_per_1m_chars_usd} 
                            onChange={(val: string) => updateNestedValue('api_usage_pricing', 'gcp_tts_per_1m_chars_usd', parseFloat(val))}
                          />
                        </div>
                      </div>
                    </SettingRow>
                    <SettingRow label="Song Cost" description="Estimated cost for lyrics generation and music task creation.">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Lyrics (Per Request)</label>
                          <InputField
                            type="number"
                            value={configs.api_usage_pricing?.musicgpt_lyrics_per_request_usd}
                            onChange={(val: string) => updateNestedValue('api_usage_pricing', 'musicgpt_lyrics_per_request_usd', parseFloat(val))}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Music Task (Per Request)</label>
                          <InputField
                            type="number"
                            value={configs.api_usage_pricing?.musicgpt_music_task_per_request_usd}
                            onChange={(val: string) => updateNestedValue('api_usage_pricing', 'musicgpt_music_task_per_request_usd', parseFloat(val))}
                          />
                        </div>
                      </div>
                    </SettingRow>
                  </Section>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
