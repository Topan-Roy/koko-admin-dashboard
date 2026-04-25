import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import Avatars from "./Avatars";
import StoryType from "./StoryType";
import SongType from "./SongType";
import Characters from "./Characters";
import Places from "./Places";
import Items from "./Items";
import Theme from "./Theme";
import api from "@/Context/api";

export default function AvatarManagement() {
  const [selectedCategory, setSelectedCategory] = useState("Avatars");
  const [categories, setCategories] = useState([
    { name: "Avatars", count: 0 },
    { name: "Story Type", count: 0 },
    { name: "Song Type", count: 0 },
    { name: "Characters", count: 0 },
    { name: "Places", count: 0 },
    { name: "Items", count: 0 },
    { name: "Theme", count: 0 },
  ]);

  useEffect(() => {
    const fetchCounts = async () => {
      const fetchWithFallback = async (endpoint: string) => {
        try {
          const res = await api.get(endpoint);
          return res;
        } catch (err) {
          console.error(`Failed to fetch ${endpoint}:`, err);
          return { data: { data: {} } };
        }
      };

      const [
        avatarsRes,
        storyTypesRes,
        songTypesRes,
        charRes,
        placesRes,
        itemsRes,
        themeRes,
      ] = await Promise.all([
        fetchWithFallback("/api/avatars"),
        fetchWithFallback("/api/story-types"),
        fetchWithFallback("/api/song-types"),
        fetchWithFallback("/api/characters"),
        fetchWithFallback("/api/places"),
        fetchWithFallback("/api/items"),
        fetchWithFallback("/api/themes"),
      ]);

      setCategories([
        { name: "Avatars", count: avatarsRes.data.data.avatars?.length || 0 },
        {
          name: "Story Type",
          count:
            storyTypesRes.data.data.storyTypes?.filter((s: any) => s.icon)
              .length || 0,
        },
        {
          name: "Song Type",
          count:
            songTypesRes.data.data.songTypes?.filter((s: any) => s.icon)
              .length || 0,
        },
        {
          name: "Characters",
          count:
            charRes.data.data.characters?.filter((c: any) => c.icon).length ||
            0,
        },
        {
          name: "Places",
          count:
            placesRes.data.data.places?.filter((p: any) => p.icon).length || 0,
        },
        {
          name: "Items",
          count:
            itemsRes.data.data.items?.filter((i: any) => i.icon).length || 0,
        },
        {
          name: "Theme",
          count:
            themeRes.data.data.themes?.filter((t: any) => t.icon).length || 0,
        },
      ]);
    };

    fetchCounts();
  }, []);

  const renderContent = () => {
    switch (selectedCategory) {
      case "Avatars":
        return <Avatars />;
      case "Story Type":
        return <StoryType />;
      case "Song Type":
        return <SongType />;
      case "Characters":
        return <Characters />;
      case "Places":
        return <Places />;
      case "Items":
        return <Items />;
      case "Theme":
        return <Theme />;
      default:
        return <Avatars />;
    }
  };

  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] relative min-h-screen">
      <SideBar />

      <div className="w-full pb-[24px]">
        <AdminHeader />

        <div className="mt-6 px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#374151]">
              Avatar Management
            </h1>
            <p className="text-sm text-[#6B7280]">
              Manage avatars, story types, song types and assets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                  Categories
                </h2>
                <div className="space-y-2">
                  {categories.map((category, index) => {
                    const isActive = selectedCategory === category.name;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`
                                                group cursor-pointer rounded-lg px-3 py-3 flex items-center justify-between
                                                transition-all duration-200
                                                ${
                                                  isActive
                                                    ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-[#9458E8]"
                                                    : "hover:bg-gray-50"
                                                }
                                              `}
                      >
                        <span
                          className={`text-sm font-medium ${
                            isActive ? "text-[#9458E8]" : "text-gray-700"
                          }`}
                        >
                          {category.name}
                        </span>

                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                                      ${
                                                        isActive
                                                          ? "bg-[#9458E8] text-white"
                                                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                                      }
                                                       `}
                        >
                          {category.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="lg:col-span-3">{renderContent()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
