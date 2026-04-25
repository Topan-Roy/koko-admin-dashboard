import LogoIcon from '../svgs/LogoIcon'
import SendIcon from '../svgs/SendIcon'
import LeftArrow from '../svgs/LeftArrow'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
    return (
        <>
            <section className="min-h-screen bg-slate-200 w-full flex items-center justify-center px-4">
                <div className="bg-white gap-[24px] rounded-[10px] py-[24px]">
                    <div className='px-[63px]'>
                        <div className="mx-auto flex items-center justify-center"><LogoIcon /></div>
                        <h1 className="font-[700] text-[16px] text-center md:text-[24px] leading-[36px] px-[30px] text-[#A43EE7] mt-[16px] gradient-text text-center" style={{ fontFamily: "'Inter', sans-serif", }}>Rest your password</h1>
                        <h2 className="font-[400] text-[10px] leading-[20px] text-center mt-[5px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Enter your email address and we'll send you a link to reset your password 
                        </h2>

                    </div>
                    <div className="mt-[24px] pt-[32px] px-[40px]">
                        <div>
                            <label htmlFor="email" className="font-[500] text-[11.9px] leading-[20px] text-[#727273]" style={{ fontFamily: "'Inter', sans-serif", }}>Email address</label>
                            <input type="email"
                                id="email"
                                className="w-full px-[13px] py-[9px] rounded-[6px] outline-none border-[1px] border-[#3A3A3ACC] mt-[4px]"
                            />
                        </div>
                    </div>
                    <div className="mt-[24px] mx-[40px] flex items-center justify-center gap-2 rounded-[8px]" style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}>
                        <SendIcon />
                        <button
                            className=" text-center py-[11px] font-[500] text-[11.9px] leading-[20px] text-white cursor-pointer"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >Send reset link
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
