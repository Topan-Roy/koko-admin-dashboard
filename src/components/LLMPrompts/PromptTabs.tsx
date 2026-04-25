import { BookOpen, Music, Type, Image } from "lucide-react";

import { Link, useLocation } from "react-router-dom";
const StoryIcon = ({ active }: { active: boolean }) => (
  <BookOpen color={active ? "#9333EA" : "#6B7280"} size={16} />
);
const SongIcon = ({ active }: { active: boolean }) => (
  <Music color={active ? "#9333EA" : "#6B7280"} size={16} />
);
const TitleIcon = ({ active }: { active: boolean }) => (
  <Type color={active ? "#9333EA" : "#6B7280"} size={16} />
);
const ImageIcon = ({ active }: { active: boolean }) => (
  <Image color={active ? "#9333EA" : "#6B7280"} size={16} />
);
const tabs = [
  { label: "Story", path: "/dashboard/llm-prompts", icon: StoryIcon },
  { label: "Song", path: "/dashboard/audio-prompts", icon: SongIcon },
  { label: "Title generation", path: "/dashboard/title-prompts", icon: TitleIcon },
  { label: "Image prompts", path: "/dashboard/image-prompts", icon: ImageIcon },
];

export default function PromptTabs() {
  const { pathname } = useLocation();
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-0 px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              <Icon active={isActive} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
