import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import LogoIcon from '../svgs/LogoIcon';
import EyeIcon from '../svgs/EyeIcon';
import { Link } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!auth) throw new Error("AuthContext is undefined. Wrap your app with AuthProvider");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.signin(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-200 w-full flex items-center justify-center px-4">
      <div className="bg-white gap-[24px] rounded-[10px] py-[24px] w-full max-w-md">
        <div>
          <div className="mx-auto flex items-center justify-center"><LogoIcon /></div>
          <h1 className="font-[700] text-[16px] md:text-[24px] leading-[36px] px-[30px] text-[#A43EE7] gradient-text text-center mt-[16px]">
            Sign in to Koko Admin Dashboard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-[24px] pt-[32px] px-[40px]">
          <div>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border mt-1"
            />
          </div>

          <div className="mt-4">
            <label>Password</label>
            <div className="flex items-center border rounded mt-1 px-3 py-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <EyeIcon />
              </button>
            </div>
          </div>
          <div className="mt-[24px] 
           flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" name="check" id="check" className="custom-checkbox" />
              <label htmlFor="check" className="text-[#9458E8] font-[400] text-[11.9px] leading-[20px] ml-[8px]" style={{ fontFamily: "'Inter', sans-serif", }}>Remember me</label>
            </div>
            <Link to={`/dashboard/admin-reset-password`} className="text-[#9458E8] font-[400] text-[11.9px] leading-[20px]" style={{ fontFamily: "'Inter', sans-serif", }}>Forgot your password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
