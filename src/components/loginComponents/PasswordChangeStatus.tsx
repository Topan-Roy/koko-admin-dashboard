import LogoIcon from '../svgs/LogoIcon'
import { Link } from 'react-router-dom'

export default function PasswordChangeStatus() {
    return (
        <section className="min-h-screen bg-slate-200 w-full flex items-center justify-center px-4">
            <div className="bg-white gap-[24px] rounded-[10px] py-[24px] px-[40px]">
                <div className="mx-auto flex items-center justify-center"><LogoIcon /></div>
                <div className="mx-auto flex items-center justify-center mt-6">
                    <svg width="70" height="56" viewBox="0 0 70 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_557_4112)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M67.6815 1.802C70.6207 4.27743 70.9972 8.66709 68.5221 11.6066L33.3637 53.3569C32.0765 54.8857 30.1942 55.7868 28.1958 55.8313C26.198 55.8758 24.2768 55.0589 22.9235 53.5886L2.41439 31.322C-0.189068 28.4955 -0.00822282 24.0929 2.81846 21.4898C5.64515 18.886 10.0473 19.0669 12.6507 21.8934L27.8075 38.3499L57.8766 2.64243C60.3523 -0.297123 64.7416 -0.673429 67.6815 1.802Z" fill="url(#paint0_linear_557_4112)" />
                        </g>
                        <defs>
                            <linearGradient id="paint0_linear_557_4112" x1="0.574219" y1="27.9995" x2="70.1578" y2="27.9995" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9458E8" />
                                <stop offset="0.5" stopColor="#A43EE7" />
                                <stop offset="1" stopColor="#CA00E5" />
                            </linearGradient>
                            <clipPath id="clip0_557_4112">
                                <rect width="70" height="55" fill="white" transform="translate(0 0.5)" />
                            </clipPath>
                        </defs>
                    </svg>

                </div>
                <div className='mt-6 flex items-center justify-center flex-col'>
                    <h1 className='font-[600] text-[20px] inter-font'>Password Changed!</h1>
                    <p className='mt-[10px] font-[400] text-[16px] inter-font text-[#7C7C7C]'>Return to the Sign in page to enter your account with your new password.</p>
                </div>
                <div className="mt-[24px] w-full relative pb-[40px]">
                    <Link to={`/dashboard/admin-login`}
                        className=" text-center py-[11px] w-full font-[500] text-[11.9px] leading-[20px] rounded-[8px] text-white cursor-pointer absolute left-0 top-0 right-0"
                        style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)", fontFamily: "'Inter', sans-serif" }}
                    >Back to Sign in
                    </Link>
                </div>
            </div>
        </section>
    )
}
