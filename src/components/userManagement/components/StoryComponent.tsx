import React, { useState, useEffect, useCallback } from 'react'
import SongComponents from '@/components/LLMPrompts/components/SongComponents'
import Search from '@/components/svgs/Search'
import api from '@/Context/api'
import { debounce } from 'lodash'
import Pagination from '@/components/ui/Pagination'
import StoryIcon from '@/components/svgs/StoryIcon'
import SongIcon from '@/components/svgs/SongIcon'
import CoinIcon from '@/components/svgs/CoinIcon'

interface StoryComponentProps {
    userId?: string;
}

export default function StoryComponent({ userId }: StoryComponentProps) {
    const [type, setType] = useState<'all' | 'story' | 'song'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    const fetchActivity = async (currentType: string, currentSearch: string, currentPage: number) => {
        setLoading(true);
        try {
            const response = await api.get('/api/users/activity', {
                params: {
                    type: currentType,
                    search: currentSearch,
                    page: currentPage,
                    limit: limit,
                    userId: userId
                }
            });
            setData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch user activity:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    const debouncedFetch = useCallback(
        debounce((t, s, p) => fetchActivity(t, s, p), 500),
        []
    );

    useEffect(() => {
        if (search) {
            debouncedFetch(type, search, page);
        } else {
            fetchActivity(type, search, page);
        }
    }, [type, search, page, userId]);

    const handleTypeChange = (newType: 'all' | 'story' | 'song') => {
        setType(newType);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const metadata = data?.metadata;
    const results = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="pb-10">
            {/* Stats Cards */}
            <div className='mt-6 flex items-center justify-center gap-6 md:flex-nowrap flex-wrap'>
                <div className='bg-[#F9FAFB] border-[1px] border-[#E5E7EB] p-[17px] w-full rounded-[6px]'>
                    <div className='flex items-center justify-between'>
                        <p className='text-[#374151] text-[11.9px] leading-[20px] font-[400] inter-font'>Stories Created</p>
                        <StoryIcon color="#9458E8" />
                    </div>
                    <h1 className='text-[#000000] font-[700] text-[20px] leading-[32px] my-2 inter-font'>{metadata?.totalStoriesCreated || 0}</h1>
                    <p className='text-[#6B7280] text-[10.2px] leading-[16px] font-[400] inter-font'>Last created: {metadata?.lastStoryCreatedAt ? new Date(metadata.lastStoryCreatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className='bg-[#F9FAFB] border-[1px] border-[#E5E7EB] p-[17px] w-full rounded-[6px]'>
                    <div className='flex items-center justify-between'>
                        <p className='text-[#374151] text-[11.9px] leading-[20px] font-[400] inter-font'>Songs Generated</p>
                        <SongIcon color="#9458E8" />
                    </div>
                    <h1 className='text-[#000000] font-[700] text-[20px] leading-[32px] my-2 inter-font'>{metadata?.totalSongsCreated || 0}</h1>
                    <p className='text-[#6B7280] text-[10.2px] leading-[16px] font-[400] inter-font'>Last created: {metadata?.lastSongCreatedAt ? new Date(metadata.lastSongCreatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className='bg-[#F9FAFB] border-[1px] border-[#E5E7EB] p-[17px] w-full rounded-[6px]'>
                    <div className='flex items-center justify-between'>
                        <p className='text-[#374151] text-[11.9px] leading-[20px] font-[400] inter-font'>Coins Used</p>
                        <CoinIcon />
                    </div>
                    <h1 className='text-[#000000] font-[700] text-[20px] leading-[32px] my-2 inter-font'>{metadata?.coinCount || 0}</h1>
                    <p className='text-[#6B7280] text-[10.2px] leading-[16px] font-[400] inter-font'>Total balance</p>
                </div>
            </div>

            <div className='mt-10'>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div>
                        <h1 className='font-[700] text-[20.4px] leading-[32px] text-[#111827] inter-font'>User Activity</h1>
                        <p className='font-[400] text-[13.6px] leading-[24px] inter-font text-[#4B5563] mt-2'>View and manage all generated content</p>
                    </div>

                    {/* Tabs */}
                    <div className='flex items-center bg-gray-100 p-1 rounded-lg'>
                        <button 
                            onClick={() => handleTypeChange('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all inter-font ${type === 'all' ? 'bg-white shadow-sm text-[#9458E8]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => handleTypeChange('story')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all inter-font ${type === 'story' ? 'bg-white shadow-sm text-[#9458E8]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Stories
                        </button>
                        <button 
                            onClick={() => handleTypeChange('song')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all inter-font ${type === 'song' ? 'bg-white shadow-sm text-[#9458E8]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Songs
                        </button>
                    </div>
                </div>
            </div>

            <div className='mt-6'>
                <div className='p-6 rounded-[8px] border-[1px] border-[#E5E7EB] bg-white'>
                    <div className='py-[9px] pl-[41px] rounded-[8px] border-[1px] border-[#E5E7EB] flex items-center justify-start gap-[11px] w-full md:w-[421px] relative'>
                        <div className="absolute left-4">
                            <Search />
                        </div>
                        <input 
                            type="search" 
                            name="search" 
                            id="search" 
                            className='font-[400] text-[16px] leading-[24px] inter-font w-full h-full border-none outline-none' 
                            placeholder='Search by name or prompt...' 
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className='min-h-[400px]'>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9458E8]"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className=''>
                            {results.map((item: any, index: number) => (
                                <SongComponents key={index} song={{
                                    ...item,
                                    user: item.storyName || item.songName || 'Unnamed',
                                    type: item.type || (item.storyName ? 'story' : 'song')
                                }} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <p className="text-lg font-medium inter-font">No activities found</p>
                            <p className="text-sm inter-font">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className='mt-6 flex justify-center'>
                        <Pagination 
                            currentPage={page} 
                            totalPages={pagination.totalPages} 
                            onPageChange={(p) => setPage(p)} 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
