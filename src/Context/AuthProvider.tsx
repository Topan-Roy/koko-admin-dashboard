import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "./api";
import type { ReactNode } from "react";

const AUTH_USER_STORAGE_KEY = "authUser";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface LoginResponseUser {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  profile?: {
    full_name?: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUser: (newUser: User) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const normalizeUser = (rawUser: LoginResponseUser | null | undefined): User | null => {
  if (!rawUser?.id) {
    return null;
  }

  return {
    id: rawUser.id,
    name: rawUser.profile?.full_name || rawUser.name || rawUser.email || "Admin User",
    email: rawUser.email || "",
    avatar: rawUser.profile?.avatar,
    role: rawUser.role,
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(newUser));
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const tokenUser = payload.user || payload;
        const restoredUser = normalizeUser(tokenUser);

        setUser(restoredUser);

        if (restoredUser) {
          localStorage.setItem(
            AUTH_USER_STORAGE_KEY,
            JSON.stringify(restoredUser),
          );
        }
      }
    } catch (err) {
      console.log("Invalid token, clearing storage", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      console.log("Login response:", res.data);

      const userData = normalizeUser(res.data.data.user);
      const accessToken: string = res.data.data.accessToken;
      const refreshToken: string = res.data.data.refreshToken;

      if (!userData || !accessToken) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("authToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userData));

      setUser(userData);

      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/api/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.log("Logout API failed, clearing local session");
    } finally {
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      toast.success("Logged out successfully!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, logOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
