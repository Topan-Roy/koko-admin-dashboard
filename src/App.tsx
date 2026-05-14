import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import NotFoundPage from "./components/NotFound";
import AvatarManagement from "./components/AvatarManagement/AvatarManagement";
import PrivateRoute from "./Context/PrivateRoute";

const AdminLogin = lazy(
  () => import("./components/loginComponents/AdminLogin")
);
const ResetPassword = lazy(
  () => import("./components/loginComponents/ResetPassword")
);
const OTP = lazy(() => import("./components/loginComponents/OPT"));
const UserManagement = lazy(
  () => import("./components/userManagement/UserManagement")
);
const UserDetails = lazy(
  () => import("./components/userManagement/UserDetails")
);

const StoryPrompts = lazy(() => import("./components/LLMPrompts/StoryPrompts"));
const AudioPrompts = lazy(() => import("./components/LLMPrompts/SongPrompts"));
const TitlePrompts = lazy(() => import("./components/LLMPrompts/TitlePrompts"));
const ImagePrompts = lazy(() => import("./components/LLMPrompts/ImagePrompts"));
const StoryAudioPrompts = lazy(() => import("./components/LLMPrompts/StoryAudioPrompts"));
const PromTabs = lazy(() => import("./components/LLMPrompts/PromptTabs"));

const LLMBlockList = lazy(() => import("./components/LLMPrompts/LLMBlockList"));
const CoinManagement = lazy(
  () => import("./components/CoinManagement/CoinManagement")
);
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const CoinManagementAnalytics = lazy(
  () => import("./components/CoinManagement/CoinManagementAnalytics")
);
const TransactionHistory = lazy(
  () => import("./components/TransactionHistory/TransactionHistory")
);
const RevenueReports = lazy(
  () => import("./components/ReportAndAnalytics/RevenueReports")
);
const APICostAnalysis = lazy(
  () => import("./components/ReportAndAnalytics/APICostAnalysis")
);
const CostVSRevenue = lazy(
  () => import("./components/ReportAndAnalytics/CostVSRevenue")
);
const FaqManagement = lazy(() => import("./components/FAQ/FaqManagement"));
const FreeLibraryManagement = lazy(() => import("./components/FreeLibrary/FreeLibraryManagement"));
const AdminAcount = lazy(
  () => import("./components/AdminAccount.tsx/AdminAcount")
);
const ResetPasswordForm = lazy(
  () => import("./components/loginComponents/ResetPasswordForm")
);
const PasswordChangeStatus = lazy(
  () => import("./components/loginComponents/PasswordChangeStatus")
);

const ApiConfig = lazy(() => import("./components/ApiConfig/ApiConfig"));
const Rankings = lazy(() => import("./components/Rankings/Rankings"));
const LoadingFallback = () => <div>Loading...</div>;

export enum AdminRoutes {
  AdminLogin = "/",
  AdminResetPassword = "/dashboard/admin-reset-password",
  AdminChangePassword = "/dashboard/admin-change-password",
  AdminChangePasswordStatus = "/dashboard/admin-change-password-status",
  AdminOtp = "/dashboard/admin-otp",
  Dashboard = "/dashboard",
  UserManagement = "/dashboard/user-management",
  UserDetails = "/dashboard/user-management/:id",
  StoryPrompts = "/dashboard/story-prompts",
  LLMPrompts = "/dashboard/llm-prompts",
  TitlePrompts = "/dashboard/title-prompts",
  ImagePrompts = "/dashboard/image-prompts",
  PromTabs = "/dashboard/promtabs",
  AvartarManagement = "/dashboard/avatar-management",
  AudioPrompts = "/dashboard/audio-prompts",
  LlmBlocklistPrompts = "/dashboard/llm-blocklist-prompts",
  CoinManagementPackage = "/dashboard/coin-management-package",
  CoinManagementAnalytics = "/dashboard/coin-management-analytics",
  TransactionHistory = "/dashboard/transaction-history",
  ReportAndAnalytics = "/dashboard/report-and-analytics",
  ApiCostAnalytics = "/dashboard/api-cost-analytics",
  CostVsRevenue = "/dashboard/cost-vs-revenue",
  FaqManagement = "/dashboard/faq-management",
  FreeLibrary = "/dashboard/free-library",
  AdminAccount = "/dashboard/admin-account",
  ApiConfig = "/dashboard/api-config",
  StoryAudioPrompts = "/dashboard/story-audio-prompts",
  SongAudioPrompts = "/dashboard/song-audio-prompts",
  Rankings = "/dashboard/rankings",
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/dashboard/admin-reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/dashboard/admin-change-password"
          element={<ResetPasswordForm />}
        />
        <Route
          path="/dashboard/admin-change-password-status"
          element={<PasswordChangeStatus />}
        />
        <Route path="/dashboard/admin-otp" element={<OTP />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard/user-management" element={<UserManagement />} />
        <Route
          path="/dashboard/user-management/:id"
          element={<UserDetails />}
        />
        {/* <Route path='/dashboard/story-prompts' element={<StoryPrompts />} /> */}
        <Route
          path="/dashboard/avatar-management"
          element={
            <PrivateRoute>
              <AvatarManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/llm-blocklist-prompts"
          element={
            <PrivateRoute>
              <LLMBlockList />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/audio-prompts"
          element={
            <PrivateRoute>
              <AudioPrompts />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/llm-prompts"
          element={
            <PrivateRoute>
              <StoryPrompts />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/title-prompts"
          element={
            <PrivateRoute>
              <TitlePrompts />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/image-prompts"
          element={
            <PrivateRoute>
              <ImagePrompts />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/ promTabs"
          element={
            <PrivateRoute>
              <PromTabs />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/coin-management-package"
          element={
            <PrivateRoute>
              <CoinManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/coin-management-analytics"
          element={
            <PrivateRoute>
              <CoinManagementAnalytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/transaction-history"
          element={
            <PrivateRoute>
              <TransactionHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/report-and-analytics"
          element={
            <PrivateRoute>
              <RevenueReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/api-cost-analytics"
          element={
            <PrivateRoute>
              <APICostAnalysis />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/cost-vs-revenue"
          element={
            <PrivateRoute>
              <CostVSRevenue />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/faq-management"
          element={
            <PrivateRoute>
              <FaqManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/free-library"
          element={
            <PrivateRoute>
              <FreeLibraryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin-account"
          element={
            <PrivateRoute>
              <AdminAcount />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/api-config"
          element={
            <PrivateRoute>
              <ApiConfig />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/story-audio-prompts"
          element={
            <PrivateRoute>
              <StoryAudioPrompts mode="story" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/song-audio-prompts"
          element={
            <PrivateRoute>
              <StoryAudioPrompts mode="song" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/rankings"
          element={
            <PrivateRoute>
              <Rankings />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
