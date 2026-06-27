import React from "react";
import CreditTokensModal from "./CreditTokensModal";

export default function UserDetailsTable({ userData, onRefresh }: { userData: any; onRefresh: () => void }) {
    const [showCreditModal, setShowCreditModal] = React.useState(false);
    if (!userData) return null;
    
    const isUserActive = Boolean(userData.activeStatus ?? userData.is_active);
    const joinedDate = userData.joined || userData.created_at || userData.createdAt;

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 p-6 mt-6 inter-font">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                Account Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
                {/* Full Name */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-medium text-gray-900 mt-1 block">
                        {userData.profile?.full_name || userData.username || "N/A"}
                    </span>
                </div>

                {/* Email */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-medium text-gray-900 mt-1 block break-all">
                        {userData.email || "N/A"}
                    </span>
                </div>

                {/* Account Status */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Account Status</span>
                    <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isUserActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isUserActive ? "bg-green-600" : "bg-red-600"}`}></span>
                            {isUserActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                {/* Subscription */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Subscription</span>
                    <span className="text-sm font-medium text-gray-900 mt-1 block">
                        {userData.subscription || "Free"}
                    </span>
                </div>

                {/* Joined Date */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Joined Date</span>
                    <span className="text-sm font-medium text-gray-900 mt-1 block">
                        {joinedDate ? new Date(joinedDate).toLocaleDateString() : "N/A"}
                    </span>
                </div>

                {/* Profile Count */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Profiles Created</span>
                    <span className="text-sm font-medium text-gray-900 mt-1 block">
                        {userData.main_user_settings?.sub_users_count || 0} / {userData.main_user_settings?.max_sub_users || 4} Profiles
                    </span>
                </div>

                {/* Coins */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Available Coins</span>
                    <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm font-bold text-gray-900">{userData.coins || 0} Coins</span>
                        <button 
                            onClick={() => setShowCreditModal(true)}
                            className="px-2 py-0.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#9458E8] to-[#A43EE7] rounded shadow-sm hover:from-[#8347d7] hover:to-[#933ee7] transition-all"
                        >
                            Credit
                        </button>
                    </div>
                </div>

                {/* Favorite Activity */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Favorites / Saved</span>
                    <span className="text-sm font-medium text-gray-900 mt-1 block">
                        {(userData.favoriteStories || []).length} Stories, {(userData.favoriteSongs || []).length} Songs
                    </span>
                </div>
            </div>

            {showCreditModal && (
                <CreditTokensModal 
                    userId={userData.userId || userData._id || userData.id} 
                    onClose={() => setShowCreditModal(false)}
                    onSuccess={onRefresh}
                />
            )}
        </div>
    );
}
