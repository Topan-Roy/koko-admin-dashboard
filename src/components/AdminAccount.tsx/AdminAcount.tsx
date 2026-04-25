import React, { useContext, useState, useRef } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import DemoDataBanner from "../ui/DemoDataBanner";
import ChangePassword from "./components/ChangePassword";
import { AuthContext } from "../../Context/AuthProvider";
import api from "../../Context/api";
import { toast } from "react-toastify";

export default function AdminAcount() {
  const [showPasswordComponent, setShowPasswordComponent] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [fullName, setFullName] = useState(user?.name || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Sync state when user data changes (e.g. after successful update)
  React.useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setPreviewUrl(user.avatar || null);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (fullName) formData.append("full_name", fullName);
      if (selectedFile) formData.append("avatar", selectedFile);
      // username could also be appended if needed

      const response = await api.patch("/api/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        
        // Update global AuthContext to reflect changes in Header/Sidebar
        if (authContext?.updateUser) {
          const updatedUser = response.data.data.user;
          authContext.updateUser({
            id: updatedUser.id,
            name: updatedUser.profile?.full_name || updatedUser.username || updatedUser.email,
            email: updatedUser.email,
            avatar: updatedUser.profile?.avatar,
            role: user?.role // preserve role
          });
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-start justify-center bg-[#F9F9F9]">
      <SideBar />
      <div className="w-full relative">
        <AdminHeader />
        <div className="mt-6 px-6">
          <h1 className="font-[700] text-[20.4px] leading-[32px] text-[#4B5563]">
            Admin Account
          </h1>
          <p className="font-[400] text-[11.9px] leading-5 text-[#6B7280] mt-2">
            View and manage your Admin profile
          </p>
        </div>
        <div className="mt-6 px-6">
          <DemoDataBanner />
        </div>
        <div className="mt-6 px-6">
          <div className="flex items-stretch justify-center gap-6 flex-wrap md:flex-nowrap">
            <div className="flex items-center justify-center flex-col bg-white p-6 rounded-[8px] shadow-md w-full md:w-[30%]">
              <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
                <img
                  src={previewUrl || "/photo-1633332755192-727a05c4013d.jpeg"}
                  alt="Admin Profile"
                  width={100}
                  height={100}
                  className={`object-cover rounded-full w-[100px] h-[100px] ${isEditing ? "opacity-70 border-2 border-dashed border-[#9458E8]" : ""}`}
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              <p className="font-[700] text-[17px] text-[#4B5563] mt-3">
                {fullName || "Admin User"}
              </p>
              <button
                onClick={() => setShowPasswordComponent(true)}
                className="flex mt-6 items-center justify-center text-white cursor-pointer w-full rounded-[6px] px-[22px] py-[11px] text-center"
                style={{
                  background: "linear-gradient(to right, #9458E8, #CA00E5)",
                }}
              >
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.16406 2H3.4974C3.14377 2 2.80464 2.14048 2.55459 2.39052C2.30454 2.64057 2.16406 2.97971 2.16406 3.33333V12.6667C2.16406 13.0203 2.30454 13.3594 2.55459 13.6095C2.80464 13.8595 3.14377 14 3.4974 14H12.8307C13.1844 14 13.5235 13.8595 13.7735 13.6095C14.0236 13.3594 14.1641 13.0203 14.1641 12.6667V8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.4145 1.75015C12.6797 1.48493 13.0394 1.33594 13.4145 1.33594C13.7895 1.33594 14.1492 1.48493 14.4145 1.75015C14.6797 2.01537 14.8287 2.37508 14.8287 2.75015C14.8287 3.12522 14.6797 3.48493 14.4145 3.75015L8.40578 9.75948C8.24748 9.91765 8.05192 10.0334 7.83712 10.0962L5.92178 10.6562C5.86442 10.6729 5.80361 10.6739 5.74572 10.6591C5.68784 10.6442 5.635 10.6141 5.59275 10.5719C5.55049 10.5296 5.52038 10.4768 5.50555 10.4189C5.49072 10.361 5.49172 10.3002 5.50845 10.2428L6.06845 8.32748C6.13147 8.11285 6.24747 7.91752 6.40578 7.75948L12.4145 1.75015Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2">Change Password</span>
              </button>
            </div>
            <div className="bg-white p-6 rounded-[8px] shadow-md w-full">
              <div className="flex items-center justify-between">
                <h1 className="font-[700] text-[15.3px] text-[#4B5563]">
                  Profile Information
                </h1>
                <div 
                  className="flex items-center justify-center gap-2 cursor-pointer group"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_557_22736)">
                      <path
                        d="M8.875 2H4.20833C3.85471 2 3.51557 2.14048 3.26552 2.39052C3.01548 2.64057 2.875 2.97971 2.875 3.33333V12.6667C2.875 13.0203 3.01548 13.3594 3.26552 13.6095C3.51557 13.8595 3.85471 14 4.20833 14H13.5417C13.8953 14 14.2344 13.8595 14.4845 13.6095C14.7345 13.3594 14.875 13.0203 14.875 12.6667V8"
                        stroke="url(#paint0_linear_557_22736)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.1254 1.75015C13.3906 1.48493 13.7503 1.33594 14.1254 1.33594C14.5005 1.33594 14.8602 1.48493 15.1254 1.75015C15.3906 2.01537 15.5396 2.37508 15.5396 2.75015C15.5396 3.12522 15.3906 3.48493 15.1254 3.75015L9.11672 9.75948C8.95842 9.91765 8.76286 10.0334 8.54805 10.0962L6.63272 10.6562C6.57536 10.6729 6.51455 10.6739 6.45666 10.6591C6.39877 10.6442 6.34594 10.6141 6.30369 10.5719C6.26143 10.5296 6.23131 10.4768 6.21648 10.4189C6.20165 10.361 6.20266 10.3002 6.21939 10.2428L6.77939 8.32748C6.84241 8.11285 6.95841 7.91752 7.11672 7.75948L13.1254 1.75015Z"
                        stroke="url(#paint1_linear_557_22736)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_557_22736"
                        x1="2.875"
                        y1="8"
                        x2="14.875"
                        y2="8"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9458E8" />
                        <stop offset="0.5" stopColor="#A43EE7" />
                        <stop offset="1" stopColor="#CA00E5" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_557_22736"
                        x1="6.20605"
                        y1="6.00271"
                        x2="15.5396"
                        y2="6.00271"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9458E8" />
                        <stop offset="0.5" stopColor="#A43EE7" />
                        <stop offset="1" stopColor="#CA00E5" />
                      </linearGradient>
                      <clipPath id="clip0_557_22736">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0.875)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className={`font-[400] text-[11.9px] ${isEditing ? "text-[#CA00E5]" : "gradient-text"}`}>
                    {isEditing ? "Cancel" : "Edit"}
                  </span>
                </div>
              </div>
              <div>
                <form onSubmit={handleUpdateProfile}>
                  <div className="mt-6">
                    <label
                      htmlFor="full_name"
                      className="inter-font font-[500] text-[11.9px] text-[#4B5563]"
                    >
                      Full Name
                    </label>
                    <input
                      className={`mt-2 w-full px-[13px] py-[9px] rounded-[9px] text-[16px] inter-font border-[1px] ${isEditing ? "border-[#9458E8] text-[#111827]" : "border-[#D1D5DB] text-[#6B7280]"}`}
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      readOnly={!isEditing}
                      placeholder="Enter Full Name"
                    />
                  </div>
                  <div className="mt-6">
                    <label
                      htmlFor="email"
                      className="inter-font font-[500] text-[11.9px] text-[#4B5563]"
                    >
                      Email Address
                    </label>
                    <input
                      className="mt-2 w-full px-[13px] py-[9px] rounded-[9px] text-[16px] text-[#6B7280] inter-font border-[1px] border-[#D1D5DB] bg-gray-50"
                      type="text"
                      name="email"
                      id="email"
                      value={user?.email || ""}
                      readOnly
                      placeholder="admin@zekinalbum.com"
                    />
                  </div>
                  {isEditing && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-8 flex items-center justify-center text-white cursor-pointer w-full rounded-[6px] px-[22px] py-[11px] text-center font-bold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{
                        background: "linear-gradient(to right, #9458E8, #CA00E5)",
                      }}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        {showPasswordComponent ? (
          <ChangePassword setShowPasswordComponent={setShowPasswordComponent} />
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
