import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/db";

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const KEY = "pc_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  async function login(username: string, password: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    if (error) throw error;
    if (!data || data.password !== password)
      throw new Error("아이디 또는 비밀번호가 틀렸습니다.");
    setUser(data as User);
  }

  async function signup(username: string, password: string, nickname: string) {
    const { data: exists } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (exists) throw new Error("이미 사용 중인 아이디입니다.");
    const { data, error } = await supabase
      .from("users")
      .insert({ username, password, nickname })
      .select()
      .single();
    if (error) throw error;
    setUser(data as User);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
