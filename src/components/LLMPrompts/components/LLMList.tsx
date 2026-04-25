import DeleteIcon from '@/components/svgs/DeleteIcon'
import EditIcon from '@/components/svgs/EditIcon'
import React from 'react'

export default function LLMList({ block }: { block: any }) {
    const [showUpdate, setShowUpdate] = React.useState<boolean>(false)
    return (
        <>
            <td className='text-[14px] leading-[20px] text-[#333333] text-left p-[10px] border-b-[0.5px] border-[#EBEBEB]'>
                {
                    !showUpdate ? <>{block.word}</> : <>
                        <div className='px-4 py-2 border-[0.3px] border-[#EBEBEB] rounded-[8px] shadow-md flex items-center justify-between'>
                            <input type="text" name="word" id="word" defaultValue={block.word} className='w-full outline-none border-none text-[#333333] text-left' />
                            <div className='flex items-center justify-end gap-6 w-full'>
                                <button onClick={() => setShowUpdate(false)} className='border-[1px] border-[#9458E8] py-[5px] px-[10px] rounded-[6px] text-[11.9px] leading-[20px] text-[#000000] inter-font cursor-pointer'>Close</button>
                                <button className=' py-[5px] px-[10px] rounded-[6px] text-[11.9px] leading-[20px] text-[#ffffff] inter-font cursor-pointer' style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}>Save Changes</button>
                            </div>
                        </div>
                    </>
                }
            </td>
            <td className='text-[14px] leading-[20px] text-[#333333] text-left p-[10px] border-b-[0.5px] border-[#EBEBEB]'>{block.date_added}</td>
            <td className='text-[14px] leading-[20px] text-[#333333] text-left p-[12px] border-b-[0.5px] border-[#EBEBEB] flex items-baseline justify-start gap-[8px]'>
                <div onClick={() => setShowUpdate(true)}><EditIcon /></div>
                <div><DeleteIcon /></div>
            </td>

        </>
    )
}
