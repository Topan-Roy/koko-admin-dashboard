import React from 'react'
import api from "@/Context/api";
import { toast } from "react-toastify";

export default function ProfileDetails({
    setShowProfileDetails,
    profile,
    userId,
    onRefresh
}: {
    setShowProfileDetails: React.Dispatch<React.SetStateAction<boolean>>,
    profile: any,
    userId: string,
    onRefresh: () => void
}) {
    if (!profile) return null;
    const [actionLoading, setActionLoading] = React.useState(false);
    const childId = profile._id || profile.id;
    const isActive = profile.is_active !== false;

    const handleDeleteChild = async () => {
        if (!window.confirm(`Are you sure you want to delete child profile "${profile.full_name || profile.name || profile.child_name}"?`)) return;
        setActionLoading(true);
        try {
            await api.delete(`/api/admin/users/${userId}/children/${childId}`);
            toast.success("Child profile deleted successfully!");
            onRefresh();
            setShowProfileDetails(false);
        } catch (error: any) {
            console.error("Failed to delete child profile:", error);
            toast.error(error?.response?.data?.message || "Failed to delete child profile");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRestoreChild = async () => {
        setActionLoading(true);
        try {
            await api.patch(`/api/admin/users/${userId}/children/${childId}/restore`);
            toast.success("Child profile restored successfully!");
            onRefresh();
            setShowProfileDetails(false);
        } catch (error: any) {
            console.error("Failed to restore child profile:", error);
            toast.error(error?.response?.data?.message || "Failed to restore child profile");
        } finally {
            setActionLoading(false);
        }
    };

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
                        <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                            <span className='text-[#6B7280] font-[500]'>Status</span>
                            <span className={`font-[600] px-3 py-1 rounded-full text-xs ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isActive ? 'Active' : 'Deleted'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className='mt-8 space-y-3'>
                    {isActive ? (
                        <button 
                            onClick={handleDeleteChild}
                            disabled={actionLoading}
                            className='w-full bg-red-600 text-white py-[11px] rounded-[10px] font-[600] text-[15px] shadow-md hover:bg-red-700 hover:shadow-lg transition-all active:scale-[0.98]'
                        >
                            {actionLoading ? "Deleting..." : "Delete Child Profile"}
                        </button>
                    ) : (
                        <button 
                            onClick={handleRestoreChild}
                            disabled={actionLoading}
                            className='w-full bg-green-600 text-white py-[11px] rounded-[10px] font-[600] text-[15px] shadow-md hover:bg-green-700 hover:shadow-lg transition-all active:scale-[0.98]'
                        >
                            {actionLoading ? "Restoring..." : "Restore Child Profile"}
                        </button>
                    )}
                    <button 
                        onClick={() => setShowProfileDetails(false)} 
                        className='w-full border border-gray-300 text-gray-700 py-[11px] rounded-[10px] font-[600] text-[15px] hover:bg-gray-50 transition-all active:scale-[0.98]'
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    )
}
