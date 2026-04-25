import React from 'react'
import ProfileDetails from './ProfileDetails'

export default function Profile({ userData }: { userData: any }) {
    if (!userData) return null;
    const [showProfileDetails, setShowProfileDetails] = React.useState<boolean>(false)
    const [selectedProfile, setSelectedProfile] = React.useState<any>(null)

    // Log userData to help identify the correct key if it changed
    // console.log("Profile component userData:", userData);

    const profiles = userData.profiles || userData.children || userData.sub_users || userData.subUsers || [];

    console.log("Profiles Extraction Debug:", {
        hasUserData: !!userData,
        keys: userData ? Object.keys(userData) : [],
        profilesFound: profiles.length,
        extractedProfiles: profiles
    });

    const renderProfiles = () => {
        if (profiles.length === 0) {
            return (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#6B7280] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-lg font-medium">No profiles found</p>
                    <p className="text-sm">This user hasn't created any profiles yet.</p>
                </div>
            );
        }

        return profiles.map((profile: any, index: number) => {
            const finalImageUrl = profile.imageUrl || profile.avatar?.imageUrl || (typeof profile.avatar === 'string' ? profile.avatar : null);
            // console.log(`Profile ${index} - Final Image URL:`, finalImageUrl);

            return (
                <div key={index} onClick={() => {
                    setSelectedProfile(profile)
                    setShowProfileDetails(true)
                }} className='bg-white border-[1px] border-[#E5E7EB] rounded-[12px] p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='w-20 h-20 rounded-full bg-gradient-to-br from-[#9458E8] to-[#A43EE7] flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-md overflow-hidden'>
                            {finalImageUrl ? (
                                <img src={finalImageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                (profile.full_name || profile.name || profile.child_name || profile.username || 'P')[0]?.toUpperCase()
                            )}
                        </div>
                        <div className='text-center'>
                            <h3 className='text-[#111827] font-semibold text-lg truncate w-full' title={profile.full_name || profile.name || profile.child_name || profile.username}>
                                {profile.full_name || profile.name || profile.child_name || profile.username || 'Unnamed Profile'}
                            </h3>
                            <p className='text-[#6B7280] text-sm'>{profile.age || profile.child_age || 'N/A'} years • {profile.gender || profile.child_gender || 'N/A'}</p>
                        </div>
                        <button className='w-full py-2 bg-[#F9FAFB] text-[#4B5563] rounded-lg text-sm font-medium hover:bg-[#9458E8] hover:text-white transition-colors duration-300'>
                            View Details
                        </button>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className='my-[20px]'>
            <h1 className='text-[#374151] font-[500] text-[13.6px] leading-[24px]'>User Profiles ({profiles.length})</h1>
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {renderProfiles()}
            </div>
            {
                showProfileDetails && <ProfileDetails setShowProfileDetails={setShowProfileDetails} profile={selectedProfile} />
            }
        </div>
    )
}
