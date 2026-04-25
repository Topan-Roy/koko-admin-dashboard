import React from 'react'
import { actvityData } from '../data/userManagementData'
import StoryComponent from './StoryComponent'
import SongComponent from './SongComponent'
import StoryIcon from '@/components/svgs/StoryIcon'
import SongIcon from '@/components/svgs/SongIcon'

enum TapData {
    Story = "Story",
    Song = "Song"
}

const showComponent = {
    "Story": <StoryComponent />,
    "Song": <SongComponent />
}

export default function UserDetailsActivity({ userData }: { userData: any }) {
    if (!userData) return null;
    const [songOrStory, setSongOrStory] = React.useState<TapData>(TapData.Story)
    return (
        <div>
            <div className='mt-6 flex items-center justify-center gap-6 md:flex-nowrap flex-wrap'>
                {
                    actvityData.map(activity => <div className='bg-[#F9FAFB] border-[1px] border-[#E5E7EB] p-[17px] w-full rounded-[6px]'>
                        <div className='flex items-center justify-between'>
                            <p className='text-[#374151] text-[11.9px] leading-[20px] font-[400]'>{activity.category}</p>
                            <div>{activity.icon}</div>
                        </div>
                        <h1 className='text-[#000000] font-[700] text-[20px] leading-[32px] my-2'>{activity.total}</h1>
                        <p className='text-[#6B7280] text-[10.2px] leading-[16px] font-[400]'>Last created: {activity.last_created}</p>
                    </div>)
                }
            </div>
            <div className='w-full px-6 bg-[#F9FAFB] rounded-[6px] mt-6 shadow'>

            </div>
            <div className='w-full border-t-[1px] mt-6 border-[#E5E7EB]'></div>
            <div className='  '>
                <div className='flex items-center justify-start gap-6 border-b-[1px] border-[#E5E7EB]'>
                    <div onClick={() => setSongOrStory(TapData.Story)} className={`flex items-center justify-center gap-[10px] py-3 ${songOrStory === TapData.Story ? "border-b-[2px] border-b-[#9458E8]" : ""}`}>
                        <StoryIcon color={songOrStory === TapData.Story ? "#9458E8" : "#6B7280"} />
                        <span className={`font-[700] text-[11.9px] leading-[20px] ${songOrStory === TapData.Story ? "text-[#9458E8]" : "text-[#6B7280]"} inter-font cursor-pointer`}>Story</span>
                    </div>
                    <div onClick={() => setSongOrStory(TapData.Song)} className={`flex items-center justify-center gap-[10px] py-3 ${songOrStory === TapData.Song ? "border-b-[2px] border-b-[#9458E8]" : ""}`}>
                        <SongIcon color={songOrStory === TapData.Song ? "#9458E8" : "#6B7280"} />
                        <span className={`font-[700] text-[11.9px] leading-[20px] ${songOrStory === TapData.Song ? "text-[#9458E8]" : "text-[#6B7280]"} inter-font cursor-pointer`}>Music</span>
                    </div>
                    {/* <div className='flex items-center justify-center gap-[10px] py-3'>
                                    <LLMBlockListIcon />
                                    <Link to={`/dashboard/llm-blocklist-prompts`} className='font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font cursor-pointer'>LLM Blocklist</Link>
                                </div> */}
                </div>
            </div>
            {
                showComponent[songOrStory]
            }
        </div>
    )
}
