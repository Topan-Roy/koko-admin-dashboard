import LogoIcon from '../svgs/LogoIcon'
import EyeIcon from '../svgs/EyeIcon'

export default function ResetPasswordForm() {
    return (
        <>
            <section className="min-h-screen bg-slate-200 w-full flex items-center justify-center px-4">
                <div className="bg-white gap-[24px] rounded-[10px] py-[24px]">
                    <div>
                        <div className="mx-auto flex items-center justify-center"><LogoIcon /></div>
                        <h1 className="font-[700] text-[16px] text-center md:text-[24px] leading-[36px] px-[30px] text-[#A43EE7] mt-[16px] gradient-text" style={{ fontFamily: "'Inter', sans-serif", }}>Sign in to Koko Admin Dashboard</h1>
                        <h2 className="font-[400] text-[10px] leading-[20px] text-center mt-[5px]" style={{ fontFamily: "'Inter', sans-serif" }}>Enter your credentials to access your admin dashboard</h2>

                    </div>
                    <div className="mt-[24px] pt-[32px] px-[40px]">
                        <div>
                            <label htmlFor="new-password" className="font-[500] text-[11.9px] leading-[20px] text-[#727273]" style={{ fontFamily: "'Inter', sans-serif", }}>New Password</label>
                           <div className="flex items-center justify-center w-full rounded-[6px] border-[1px] border-[#3A3A3ACC] mt-[4px] px-[13px] py-[9px]">
                                <input type="password"
                                    id="new-password"
                                    className="w-full outline-none "
                                    name='new-password'
                                />
                                <EyeIcon />
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <label htmlFor="confirm-password" className="font-[500] text-[11.9px] leading-[20px] text-[#727273]" style={{ fontFamily: "'Inter', sans-serif", }}>Confirm Password</label>
                            <div className="flex items-center justify-center w-full rounded-[6px] border-[1px] border-[#3A3A3ACC] mt-[4px] px-[13px] py-[9px]">
                                <input type="password"
                                    id="confirm-password"
                                    className="w-full outline-none "
                                    name='confirm-password'
                                />
                                <EyeIcon />
                            </div>
                        </div>
                    </div>
                    <div className="mt-[24px] px-[40px]">
                        <button
                            className=" text-center py-[11px] w-full font-[500] text-[11.9px] leading-[20px] rounded-[8px] text-white cursor-pointer"
                            style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" , fontFamily: "'Inter', sans-serif"}}
                        >Submit
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}
