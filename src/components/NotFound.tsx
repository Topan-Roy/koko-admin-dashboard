import { Link } from "react-router-dom";
import SideBar from "./ui/SideBar";
import AdminHeader from "./ui/AdminHeader";

export default function NotFound() {
  return (
    <section className="flex items-start justify-center bg-[#F9F9F9]">
      <SideBar />
      <div className="w-full">
        <AdminHeader />
        <div className="flex flex-col items-center justify-center min-h-[94vh] bg-gray-50 text-center px-4">
          {/* Logo */}
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="mt-2 text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>

          <p className="mt-2 text-gray-600">
            Sorry, the page you’re looking for doesn’t exist or has been moved.
          </p>

          {/* Button */}
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center px-6 py-3 rounded-md font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow hover:opacity-90 transition"
          >
            Go Home
          </Link>

          {/* Back to login */}
          <Link
            to="/"
            className="mt-4 inline-flex items-center text-purple-600 hover:text-pink-500 transition"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
