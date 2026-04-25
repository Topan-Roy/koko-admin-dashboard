import LogoIcon from '../svgs/LogoIcon'
import LeftArrow from '../svgs/LeftArrow'
import { Link } from 'react-router-dom'

export default function OTP() {
    return (
        <>
            <section className="min-h-screen bg-slate-200 w-full flex items-center justify-center">
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    `}

                </style>
                <div className="bg-white gap-[24px] rounded-[10px] py-[24px]">
                    <div className='px-[63px]'>
                        <div className="mx-auto flex items-center justify-center"><LogoIcon /></div>
                        <h1 className="font-[700] text-[24px] leading-[36px] px-[30px] text-[#A43EE7] mt-[16px] gradient-text text-center" style={{ fontFamily: "'Inter', sans-serif", }}>Reset your password</h1>
                        <h2 className="font-[400] text-[10px] leading-[20px] text-center mt-[5px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Enter the code send to your Email address to reset your Password
                        </h2>

                    </div>
                    <div className="mt-[24px] pt-[32px] px-[40px]">
                        <div className="flex justify-center items-center space-x-4 py-8">
                            <input type="text" maxLength={1} className="w-[60px] h-[38px] text-center border-2 border-gray-300 rounded-lg focus:border-[#A43EE7] focus:outline-none" />
                            <input type="text" maxLength={1} className="w-[60px] h-[38px] text-center border-2 border-gray-300 rounded-lg focus:border-[#A43EE7] focus:outline-none" />
                            <input type="text" maxLength={1} className="w-[60px] h-[38px] text-center border-2 border-gray-300 rounded-lg focus:border-[#A43EE7] focus:outline-none" />
                            <input type="text" maxLength={1} className="w-[60px] h-[38px] text-center border-2 border-gray-300 rounded-lg focus:border-[#A43EE7] focus:outline-none" />
                            <input type="text" maxLength={1} className="w-[60px] h-[38px] text-center border-2 border-gray-300 rounded-lg focus:border-[#A43EE7] focus:outline-none" />
                        </div>
                    </div>
                    <div className="mt-[24px] mx-[40px] flex items-center justify-center gap-2 rounded-[8px] cursor-pointer" style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}>

                        <button
                            className=" text-center py-[11px] font-[500] text-[11.9px] leading-[20px] text-white cursor-pointer"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >Submit
                        </button>
                    </div>
                    <div className='mt-[24px] mx-[40px] flex items-center justify-center gap-2 cursor-pointer'>
                        <LeftArrow />
                        <Link to={`/dashboard/admin-login`} className='font-[500] text-[11.9px] leading-[20px] text-[#9458E8]'>Back to login</Link>
                    </div>
                </div>
            </section>
        </>
    )
}
