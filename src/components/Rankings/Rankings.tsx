import { useEffect, useRef, useState } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import Pagination from "../ui/Pagination";
import api from "@/Context/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RankedItem {
  _id: string | null;
  name: string;
  icon: string | null;
  colors: string[];
  usageCount: number;
}

interface PaginatedCategory {
  results: RankedItem[];
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
  { key: "characters", label: "Characters", emoji: "🧙", apiCategory: "characters" },
  { key: "themes",     label: "Themes",     emoji: "🎨", apiCategory: "themes"     },
  { key: "places",     label: "Places",     emoji: "🏰", apiCategory: "places"     },
  { key: "items",      label: "Items",      emoji: "⚔️",  apiCategory: "items"      },
  { key: "storyTypes", label: "Story Types",emoji: "📖", apiCategory: "story-types"},
  { key: "songTypes",  label: "Song Types", emoji: "🎵", apiCategory: "song-types" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeColor = (c: string) => (c?.startsWith("#") ? c : `#${c}`);

const getRankBadge = (rank: number) => {
  if (rank === 1) return { bg: "linear-gradient(135deg,#FFD700,#FFA500)", text: "#7B4F00", glow: "0 0 12px rgba(255,215,0,.5)" };
  if (rank === 2) return { bg: "linear-gradient(135deg,#C0C0C0,#9E9E9E)", text: "#3D3D3D", glow: "0 0 10px rgba(192,192,192,.4)" };
  if (rank === 3) return { bg: "linear-gradient(135deg,#CD7F32,#A0522D)", text: "#fff",    glow: "0 0 10px rgba(205,127,50,.4)" };
  return { bg: "#F3F4F6", text: "#6B7280", glow: "none" };
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 animate-pulse border-b border-gray-50 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
      <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-2 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="w-16 h-5 bg-gray-200 rounded-full" />
    </div>
  );
}

// ─── Ranked Row ───────────────────────────────────────────────────────────────

function RankedRow({ item, rank, maxCount, pageOffset }: {
  item: RankedItem; rank: number; maxCount: number; pageOffset: number;
}) {
  const absoluteRank = rank + pageOffset;
  const badge = getRankBadge(absoluteRank);
  const barPct = maxCount > 0 ? `${Math.max(4, (item.usageCount / maxCount) * 100)}%` : "4%";

  const gradientBg =
    item.colors.length >= 2
      ? `linear-gradient(135deg,${normalizeColor(item.colors[0])},${normalizeColor(item.colors[item.colors.length - 1])})`
      : item.colors.length === 1
      ? normalizeColor(item.colors[0])
      : "linear-gradient(135deg,#9458E8,#CA00E5)";

  return (
    <div
      className="group flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-purple-50/50 border-b border-gray-50 last:border-b-0"
      style={{ background: absoluteRank <= 3 ? "linear-gradient(90deg,rgba(148,88,232,.03),transparent)" : undefined }}
    >
      {/* Rank badge */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform group-hover:scale-110"
        style={{ background: badge.bg, color: badge.text, boxShadow: badge.glow }}
      >
        {absoluteRank}
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform group-hover:scale-105"
        style={{ background: gradientBg }}
      >
        {item.icon
          ? <img src={item.icon} alt={item.name} className="w-9 h-9 object-contain" />
          : <span className="text-white text-lg font-bold uppercase">{item.name?.charAt(0) || "?"}</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13.5px] text-[#1F2937] inter-font truncate">{item.name}</p>
        <div className="mt-1.5 h-1.5 w-full max-w-[240px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: barPct, background: "linear-gradient(90deg,#9458E8,#CA00E5)" }}
          />
        </div>
      </div>

      {/* Count pill */}
      <div className="shrink-0">
        <span
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: absoluteRank <= 3
              ? "linear-gradient(135deg,rgba(148,88,232,.12),rgba(202,0,229,.08))"
              : "#F3F4F6",
            color: absoluteRank <= 3 ? "#9458E8" : "#6B7280",
          }}
        >
          {item.usageCount.toLocaleString()} uses
        </span>
      </div>
    </div>
  );
}

// ─── Stats overview card ──────────────────────────────────────────────────────

function StatsCard({ emoji, label, totalResults, topItem }: {
  emoji: string; label: string; totalResults: number; topItem?: RankedItem;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{emoji}</span>
        <span className="text-xs font-medium text-[#9458E8] bg-purple-50 px-2 py-1 rounded-full inter-font">
          {totalResults} tracked
        </span>
      </div>
      <p className="text-sm font-semibold text-[#374151] inter-font">{label}</p>
      {topItem
        ? <p className="text-xs text-[#6B7280] inter-font mt-1 truncate">🥇 {topItem.name} · {topItem.usageCount.toLocaleString()} uses</p>
        : <p className="text-xs text-[#9CA3AF] inter-font mt-1">No data yet</p>
      }
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20V14" stroke="#9458E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-[15px] font-semibold text-[#374151] inter-font">No {label} ranked yet</p>
      <p className="text-sm text-[#9CA3AF] inter-font mt-1">
        Usage data will appear here once users create stories.
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const emptyCategory = (): PaginatedCategory => ({
  results: [], page: 1, limit: ITEMS_PER_PAGE, totalResults: 0, totalPages: 1,
});

export default function Rankings() {
  const [overviewData, setOverviewData] = useState<Record<TabKey, PaginatedCategory>>({
    characters: emptyCategory(),
    themes:     emptyCategory(),
    places:     emptyCategory(),
    items:      emptyCategory(),
    storyTypes: emptyCategory(),
    songTypes:  emptyCategory(),
  });

  const [activeTab, setActiveTab] = useState<TabKey>("characters");
  // Per-tab page state
  const [pages, setPages] = useState<Record<TabKey, number>>({
    characters: 1, themes: 1, places: 1, items: 1, storyTypes: 1, songTypes: 1,
  });

  const [tabData, setTabData] = useState<PaginatedCategory>(emptyCategory());
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether overview has been loaded once
  const overviewLoaded = useRef(false);

  // ── Fetch overview (page 1 of all tabs) — once on mount ──────────────────
  const fetchOverview = async () => {
    setLoadingOverview(true);
    setError(null);
    try {
      const res = await api.get("/api/admin/rankings", {
        params: { limit: ITEMS_PER_PAGE },
      });
      const d = res.data.data;
      setOverviewData({
        characters: d.characters ?? emptyCategory(),
        themes:     d.themes     ?? emptyCategory(),
        places:     d.places     ?? emptyCategory(),
        items:      d.items      ?? emptyCategory(),
        storyTypes: d.storyTypes ?? emptyCategory(),
        songTypes:  d.songTypes  ?? emptyCategory(),
      });
      // Seed the active tab with overview data
      setTabData(d[activeTab] ?? emptyCategory());
      overviewLoaded.current = true;
    } catch (err: any) {
      console.error("Failed to fetch rankings:", err);
      setError("Failed to load rankings. Please try again.");
    } finally {
      setLoadingOverview(false);
    }
  };

  // ── Fetch a single tab at a specific page ─────────────────────────────────
  const fetchTab = async (tab: TabKey, page: number) => {
    const tabMeta = TABS.find((t) => t.key === tab)!;
    setLoadingTab(true);
    setError(null);
    try {
      const res = await api.get("/api/admin/rankings", {
        params: { category: tabMeta.apiCategory, page, limit: ITEMS_PER_PAGE },
      });
      const d = res.data.data;
      // The API returns e.g. { characters: { results, page, totalResults, totalPages } }
      const payload: PaginatedCategory = d[tab] ?? emptyCategory();
      setTabData(payload);
      // Update overview first-page cache if we just fetched page 1
      if (page === 1) {
        setOverviewData((prev) => ({ ...prev, [tab]: payload }));
      }
    } catch (err: any) {
      console.error("Failed to fetch tab rankings:", err);
      setError("Failed to load rankings. Please try again.");
    } finally {
      setLoadingTab(false);
    }
  };

  // ── On mount: fetch full overview ────────────────────────────────────────
  useEffect(() => {
    fetchOverview();
  }, []);

  // ── When active tab changes: restore cached data or re-fetch ─────────────
  useEffect(() => {
    if (!overviewLoaded.current) return;
    const currentPage = pages[activeTab];
    if (currentPage === 1) {
      // Use overview cache for page 1
      setTabData(overviewData[activeTab]);
    } else {
      fetchTab(activeTab, currentPage);
    }
  }, [activeTab]);

  // ── When page changes ─────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    setPages((prev) => ({ ...prev, [activeTab]: page }));
    if (page === 1) {
      setTabData(overviewData[activeTab]);
    } else {
      fetchTab(activeTab, page);
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleRefresh = () => {
    setPages({ characters: 1, themes: 1, places: 1, items: 1, storyTypes: 1, songTypes: 1 });
    overviewLoaded.current = false;
    fetchOverview();
  };

  const activeTabMeta = TABS.find((t) => t.key === activeTab)!;
  const currentPage   = pages[activeTab];
  const currentList   = tabData.results;
  const maxCount      = currentList[0]?.usageCount ?? 0;
  const pageOffset    = (currentPage - 1) * ITEMS_PER_PAGE;
  const isLoading     = loadingOverview || loadingTab;

  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] min-h-screen">
      <SideBar />

      <div className="w-full pb-[24px]">
        <AdminHeader />

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="mt-6 px-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-[700] text-[20.4px] leading-[32px] inter-font text-[#1F2937]">
              Content Rankings
            </h1>
            <p className="text-sm text-[#6B7280] inter-font mt-0.5">
              Most-used characters, themes and other story elements
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#9458E8] via-[#A43EE7] to-[#CA00E5] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 hover:shadow-lg inter-font disabled:opacity-60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={isLoading ? "animate-spin" : ""}>
              <path d="M1 4v6h6M23 20v-6h-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isLoading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {/* ── Overview cards ───────────────────────────────────────────── */}
        <div className="mt-6 px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TABS.map((tab) => {
            const cat = overviewData[tab.key];
            return (
              <div key={tab.key} onClick={() => handleTabChange(tab.key)} className="cursor-pointer">
                <StatsCard
                  emoji={tab.emoji}
                  label={tab.label}
                  totalResults={cat.totalResults}
                  topItem={cat.results[0]}
                />
              </div>
            );
          })}
        </div>

        {/* ── Main card ────────────────────────────────────────────────── */}
        <div className="mt-6 px-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-1 px-6 pt-5 border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = overviewData[tab.key].totalResults;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`
                      flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-sm font-semibold inter-font whitespace-nowrap
                      transition-all duration-200 border-b-2 -mb-px
                      ${isActive
                        ? "border-[#9458E8] text-[#9458E8] bg-purple-50/60"
                        : "border-transparent text-[#6B7280] hover:text-[#9458E8] hover:bg-purple-50/30"}
                    `}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                    {!loadingOverview && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        isActive ? "bg-[#9458E8] text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab sub-header */}
            {!isLoading && !error && (
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-50/40 to-pink-50/20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeTabMeta.emoji}</span>
                  <div>
                    <h2 className="font-[700] text-[15px] inter-font text-[#1F2937]">
                      {activeTabMeta.label} Ranking
                    </h2>
                    <p className="text-xs text-[#9CA3AF] inter-font">
                      {tabData.totalResults > 0
                        ? `${tabData.totalResults} items · sorted by total usage in stories`
                        : "Sorted by total usage in stories"}
                    </p>
                  </div>
                </div>
                {currentList.length > 0 && currentPage === 1 && (
                  <div className="flex items-center gap-2 text-xs text-[#6B7280] inter-font">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FFD700]"/><span>1st</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#C0C0C0]"/><span>2nd</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#CD7F32]"/><span>3rd</span></div>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                    <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-[15px] font-semibold text-[#374151] inter-font">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-[#9458E8] to-[#CA00E5] text-white rounded-xl text-sm font-medium inter-font hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            ) : currentList.length === 0 ? (
              <EmptyState label={activeTabMeta.label} />
            ) : (
              <div>
                {currentList.map((item, index) => (
                  <RankedRow
                    key={item._id ?? index}
                    item={item}
                    rank={index + 1}
                    maxCount={maxCount}
                    pageOffset={pageOffset}
                  />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {!isLoading && !error && tabData.totalResults > ITEMS_PER_PAGE && (
              <Pagination
                totalItems={tabData.totalResults}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}

            {/* Footer summary when no pagination needed */}
            {!isLoading && !error && currentList.length > 0 && tabData.totalResults <= ITEMS_PER_PAGE && (
              <div className="px-6 py-4 border-t border-gray-50">
                <p className="text-xs text-[#9CA3AF] inter-font">
                  Showing all {currentList.length} {activeTabMeta.label.toLowerCase()} · sorted by usage
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
