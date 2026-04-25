import React from 'react'

export default function ProfileDetails({ setShowProfileDetails, profile }: {
    setShowProfileDetails: React.Dispatch<React.SetStateAction<boolean>>,
    profile: any
}) {
    if (!profile) return null;

    return (
        <div className='fixed top-0 left-0 w-full h-screen z-50 flex items-center justify-center py-8 px-4' style={{ background: "rgba(0, 0, 0, 0.4)" }}>
            <div className='w-full max-w-md bg-white rounded-[16px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300'>
                <div className='flex flex-col items-center text-center'>
                    <div className="w-24 h-24 bg-gradient-to-br from-[#9458E8] to-[#CA00E5] rounded-full p-1 mb-4 shadow-lg">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                            {(profile.imageUrl || profile.avatar?.imageUrl || (typeof profile.avatar === 'string' ? profile.avatar : null)) ? (
                                <img src={profile.imageUrl || profile.avatar?.imageUrl || (typeof profile.avatar === 'string' ? profile.avatar : null)} alt={profile.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">👤</span>
                            )}
                        </div>
                    </div>
                    <h1 className='text-[#111827] font-[700] text-[24px] mb-1'>{profile.full_name || profile.name || profile.child_name || "Unknown Profile"}</h1>
                    <p className='text-[#6B7280] text-[14px] mb-8 font-mono'>ID: {profile.id || profile._id || "N/A"}</p>
                    
                    <div className='w-full space-y-4 text-left'>
                        <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                            <span className='text-[#6B7280] font-[500]'>Age</span>
                            <span className='text-[#111827] font-[600] bg-gray-50 px-3 py-1 rounded-full'>{profile.age || "N/A"} years</span>
                        </div>
                        <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                            <span className='text-[#6B7280] font-[500]'>Gender</span>
                            <span className='text-[#111827] font-[600] bg-gray-50 px-3 py-1 rounded-full'>{profile.gender || "N/A"}</span>
                        </div>
                    </div>
                </div>
                
                <div className='mt-10'>
                    <button 
                        onClick={() => setShowProfileDetails(false)} 
                        className='w-full bg-gradient-to-r from-[#9458E8] to-[#A43EE7] text-white py-[12px] rounded-[10px] font-[600] text-[16px] shadow-md hover:shadow-lg transition-all active:scale-[0.98]'
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    )
}
