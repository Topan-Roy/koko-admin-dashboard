import React, { useState } from 'react'
import api from '../../../Context/api'
import { toast } from 'react-toastify'

export default function ChangePassword(
    {setShowPasswordComponent}: {setShowPasswordComponent: React.Dispatch<React.SetStateAction<boolean>>}
) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!currentPassword || !newPassword) {
            toast.error("All fields are required");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }

        if (newPassword === currentPassword) {
            toast.error("New password must be different from current password");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/api/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (response.data.code === 200) {
                toast.success("Password changed successfully");
                setShowPasswordComponent(false);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='absolute w-full h-[94vh] top-14 left-0 flex items-center justify-center z-50' style={{ background: "rgb(202, 213, 226, 0.5)" }}>
            <div className='bg-white p-[60px] rounded-[12px] relative w-full md:w-[600px] shadow-2xl'>
                <div onClick={() => setShowPasswordComponent(false)} className='absolute right-[30px] top-[30px] cursor-pointer hover:opacity-70 transition-opacity'>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_557_26830)">
                            <path d="M22.8754 7.13594C22.3879 6.64844 21.6004 6.64844 21.1129 7.13594L15.0004 13.2359L8.88789 7.12344C8.40039 6.63594 7.61289 6.63594 7.12539 7.12344C6.63789 7.61094 6.63789 8.39844 7.12539 8.88594L13.2379 14.9984L7.12539 21.1109C6.63789 21.5984 6.63789 22.3859 7.12539 22.8734C7.61289 23.3609 8.40039 23.3609 8.88789 22.8734L15.0004 16.7609L21.1129 22.8734C21.6004 23.3609 22.3879 23.3609 22.8754 22.8734C23.3629 22.3859 23.3629 21.5984 22.8754 21.1109L16.7629 14.9984L22.8754 8.88594C23.3504 8.41094 23.3504 7.61094 22.8754 7.13594Z" fill="url(#paint0_linear_557_26830)" />
                        </g>
                        <defs>
                            <linearGradient id="paint0_linear_557_26830" x1="6.75977" y1="14.9984" x2="23.241" y2="14.9984" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9458E8" />
                                <stop offset="0.5" stopColor="#A43EE7" />
                                <stop offset="1" stopColor="#CA00E5" />
                            </linearGradient>
                            <clipPath id="clip0_557_26830">
                                <rect width="30" height="30" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                </div>
                <form onSubmit={handleSubmit}>
                    <h1 className='mt-8 font-[700] text-[24px] gradient-text text-center'>Change Your Password</h1>
                    <div className='mt-5'>
                        <label htmlFor="old-password" title='currentPassword' className='font-[400] text-[16px] text-[#4B5563] inter-font'>Enter old password</label>
                        <input 
                            className='text-[#6B7280] mt-2 h-[48px] rounded-[8px] px-[12px] py-[8px] border-[0.5px] border-[#6B7280] w-full inter-font outline-[#9458E8]' 
                            type="password" 
                            name="old-password" 
                            id="old-password" 
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder='Enter old password' 
                        />
                    </div>
                    <div className='mt-5'>
                        <label htmlFor="new-password" title='newPassword' className='font-[400] text-[16px] text-[#4B5563] inter-font'>Set new password</label>
                        <input 
                            className='text-[#6B7280] mt-2 h-[48px] rounded-[8px] px-[12px] py-[8px] border-[0.5px] border-[#6B7280] w-full inter-font outline-[#9458E8]' 
                            type="password" 
                            name="new-password" 
                            id="new-password" 
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='Set new password' 
                        />
                    </div>
                    <div className='mt-5'>
                        <label htmlFor="re-enter-password" className='font-[400] text-[16px] text-[#4B5563] inter-font'>Re-enter new password</label>
                        <input 
                            className='text-[#6B7280] mt-2 h-[48px] rounded-[8px] px-[12px] py-[8px] border-[0.5px] border-[#6B7280] w-full inter-font outline-[#9458E8]' 
                            type="password" 
                            name="re-enter-password" 
                            id="re-enter-password" 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Re-enter new password' 
                        />
                    </div>
                    <div className='mt-8'>
                        <button 
                            type="submit"
                            disabled={loading}
                            className='font-[600] text-[18px] text-[#ffffff] inter-font w-full text-center p-[12px] rounded-[8px] cursor-pointer transition-all hover:opacity-90 disabled:opacity-50' 
                            style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}
                        >
                            {loading ? "Updating..." : "Update password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
