import DeleteIcon from '@/components/svgs/DeleteIcon'
import EditIcon from '@/components/svgs/EditIcon'
import React from 'react'
import AudioSection from "../components/AudioSection"

function SongComponents({ song }: { song: any }) {
    const [showUpdate, setShowUpdate] = React.useState<boolean>(false)
    return (
        <div className='p-[17px] border-[1px] border-[#E5E7EB] rounded-[8px] mt-[24px]'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-center gap-2'>
                    <p className='px-[8px] py-[4px] rounded-[9999px] bg-[#DBEAFE] text-[#1E40AF] font-[500] text-[10.2px] leading-[16px]'>Song</p>
                    <p className='text-[#6B7280] text-[11.9px] leading-[20px] font-[400]'>User: {song.user}</p>
                </div>
                <div className='flex items-center justify-center gap-4'>
                    <div onClick={() => setShowUpdate(true)}><EditIcon /></div>
                    <div><DeleteIcon /></div>
                </div>
            </div>
            <div className='mt-6'>
                <h1 className='font-[500] text-[11.9px] leading-[20px] text-[#6B7280] inter-font'>Categories</h1>
                <p>
                    {
                        song.categories.map((category: any, catIndex: any) => (
                            <span key={catIndex} className='mr-[8px] px-[8px] py-[4px] rounded-[9999px] bg-[#DCFCE7] text-[#166534] font-[500] leading-[16px] text-[10.2px] inter-font'>{category}</span>
                        ))
                    }
                </p>
            </div>
            {
                !showUpdate ? <>
                    <div className='mt-6'>
                        <p className='font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]'>Prompt</p>
                        <div className='p-3 rounded-[6px] bg-slate-100'>
                            <p className='text-[#374151] font-[400] text-[11.9px] leading-[20px] inter-font'>{song.prompt}</p>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <p className='font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]'>Output</p>
                        <AudioSection />
                    </div></> : <>
                    <div className=''>
                        <div className='mt-6'>
                            <p className='font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]'>Prompt</p>
                            <div className='p-3 rounded-[6px] bg-slate-100'>
                                <input type='text' className='text-[#374151] font-[400] text-[11.9px] leading-[20px] inter-font w-full border-none outline-none' defaultValue={song.prompt} />
                            </div>
                        </div>
                        <div className='mt-6 pb-4 border-b-[1px] border-[#E5E7EB]'>
                            <p className='font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]'>Output</p>
                            <AudioSection />
                        </div>
                        <div className='mt-6 flex items-center justify-end gap-6'>
                            <button onClick={() => setShowUpdate(false)} className='border-[1px] border-[#9458E8] py-[9px] px-[17px] rounded-[6px] text-[11.9px] leading-[20px] text-[#000000] inter-font cursor-pointer'>Close</button>
                            <button className=' py-[9px] px-[17px] rounded-[6px] text-[11.9px] leading-[20px] text-[#ffffff] inter-font cursor-pointer' style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}>Save Changes</button>
                        </div>
                    </div></>
            }

        </div>
    )
}

export default React.memo(SongComponents)