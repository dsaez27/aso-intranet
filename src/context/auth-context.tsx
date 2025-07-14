"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { loginUser as apiLoginUser } from "@/services/auth-service";
import { getUserByEmail } from "@/services/user-service";

// Este archivo gestiona el estado de autenticación en el lado del cliente.
// Utiliza cookies para mantener la sesión del usuario, que son leídas por el middleware.
// El AuthProvider debe envolver la aplicación para que el contexto esté disponible.

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  // Asegurarse de que la cookie es accesible en toda la aplicación
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name: string) {
  // Borra la cookie estableciendo su caducidad en el pasado y asegurando el path correcto
  document.cookie = name + "=; Max-Age=-99999999; path=/;";
}

export const USER_SESSION_KEY = "user_session";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateCurrentUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyUserSession = useCallback(async () => {
    setLoading(true);
    const userCookie = getCookie(USER_SESSION_KEY);

    if (userCookie) {
      try {
        const sessionUser = JSON.parse(userCookie);
        if (sessionUser?.id && sessionUser?.email) {
          // El usuario ya está validado por la cookie. Simplemente lo establecemos en el estado.
          setUser(sessionUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to parse user session cookie:", e);
        eraseCookie(USER_SESSION_KEY);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    verifyUserSession();
  }, [verifyUserSession]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const loggedInUser = await apiLoginUser(email, password);
      if (loggedInUser) {
        // La cookie debe ser accesible por el middleware, así que se establece con path=/
        setCookie(USER_SESSION_KEY, JSON.stringify(loggedInUser), 7);
        setUser(loggedInUser);
        router.push("/dashboard");
        console.log("Login successful:", loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    eraseCookie(USER_SESSION_KEY);
    setUser(null);
    // Redirige al login. El middleware se encargará de proteger las rutas.
    router.push("/login");
  };

  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
    setCookie(USER_SESSION_KEY, JSON.stringify(updatedUser), 7);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, updateCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
