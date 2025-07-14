'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User } from '@/types';
import { loginUser as apiLoginUser } from '@/services/auth-service';

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name: string) {   
    document.cookie = name+'=; Max-Age=-99999999; path=/;';  
}

export const USER_SESSION_KEY = 'user_session';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateCurrentUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyUserSession = useCallback(async () => {
    setLoading(true);
    try {
      const userCookie = getCookie(USER_SESSION_KEY);
      if (userCookie) {
        const user = JSON.parse(userCookie);
        setUser(user); // ✅ DEBE establecer el usuario desde la cookie
      } else {
        setUser(null);
      }
    } catch(e) {
      console.error('Error verifying session:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUserSession();
  }, [verifyUserSession]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', email); // Debug
      const loggedInUser = await apiLoginUser(email, password);
      console.log('API login result:', loggedInUser); // Debug
      
      if (loggedInUser) {
        setCookie(USER_SESSION_KEY, JSON.stringify(loggedInUser), 7);
        setUser(loggedInUser);
        console.log('Login successful, user set:', loggedInUser); // Debug
        console.log('Cookie set:', getCookie(USER_SESSION_KEY)); // Debug
        return true;
      }
      
      console.log('Login failed - no user returned'); // Debug
      setUser(null);
      return false;
    } catch (error) {
      console.error('Login error:', error); // Debug
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    eraseCookie(USER_SESSION_KEY);
    setUser(null);
  };
  
  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
    setCookie(USER_SESSION_KEY, JSON.stringify(updatedUser), 7);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
