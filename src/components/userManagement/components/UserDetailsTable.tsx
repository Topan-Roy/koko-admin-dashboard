export default function UserDetailsTable({ userData }: { userData: any }) {
    if (!userData) return null;
    const isUserActive = Boolean(userData.activeStatus ?? userData.is_active);

    return (
        <div className='w-full'>
            <table className='w-full mt-6'>
                <thead className='w-full'>
                    <tr className='w-full'>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px]'>Full Name</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Email</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Age</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Gender</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Account Status</th>
                    </tr>
                </thead>
                <div className='w-full mt-2'></div>
                <tbody className=''>
                    <tr>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.username}</td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.email}</td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.age || userData.children?.[0]?.age || "N/A"}</td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.gender || userData.children?.[0]?.gender || "N/A"}</td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{isUserActive ? "Active" : "Inactive"}</td>
                    </tr>
                </tbody>
            </table>
            <table className='w-full mt-6'>
                <thead className='w-full'>
                    <tr className='w-full'>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px]'>Subscription</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Joined Date</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Content Created</th>
                        <th className='text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Coins</th>
                        <th className='text-[#6B7280] text-[#6B7280] text-[11.9px] leading-[20px] inter-font font-[400] text-left w-[256px] '>Profile created</th>
                    </tr>
                </thead>
                <div className='w-full mt-2'></div>
                <tbody className=''>
                    <tr>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.subscription || "Free"}</td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "N/A"}</td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>
                            {(userData.favoriteStories || []).length} Stories, {(userData.favoriteSongs || []).length} Songs
                        </td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>
                            <p className='py-[5px] px-[16px] border-[1px] border-[#D1D5DB] rounded-[6px] w-[80%]'>{userData.coins || 0}</p>
                        </td>
                        <td className='text-[#000000] font-[400] text-[16px] leading-[24px] text-left '>{userData.main_user_settings?.sub_users_count || 0}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
