import SongComponents from '@/components/LLMPrompts/components/SongComponents'
import { SongAndAudioData } from '@/components/LLMPrompts/data/songAndAudioData'
import Search from '@/components/svgs/Search'


export default function StoryComponent() {
    return (
        <>
            <div className='mt-6'>
                <div className=' p-0 rounded-[8px]'>
                    <h1 className='font-[700] text-[20.4px] leading-[32px] text-[#111827] inter-font'>Stories Created by the Users</h1>
                    <p className='font-[400] text-[13.6px] leading-[24px] inter-font text-[#4B5563] mt-2'>View and manage all generated Stories</p>
                </div>
            </div>
            <div className='mt-6 '>
                <div className='p-6 rounded-[8px] border-[1px] border-[#E5E7EB] '>
                    <div className='py-[9px] pl-[41px] rounded-[8px] border-[1px] border-[#E5E7EB] flex items-center justify-start gap-[11px] w-full md:w-[421px]'>
                        <Search />
                        <input type="search" name="search" id="search" className='font-[400] text-[16px] leading-[24px] inter-font w-full h-full border-none outline-none' placeholder='Search users by name or email' />
                    </div>
                </div>
                <div className=' '>
                    {
                        SongAndAudioData.map((song, index) => (
                            <SongComponents key={index} song={song} />
                        ))
                    }
                </div>
                {/* <div className='mt-6 '><Pagination /></div> */}
            </div>
        </>
    )
}
