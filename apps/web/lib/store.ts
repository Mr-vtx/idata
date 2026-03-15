import { create } from "zustand";

interface User {
  username: string;
  token: string;
  email?: string;
  id?: string;
}

interface FileItem {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface Store {
  user: User | null;
  files: FileItem[];
  hydrated: boolean;
  setUser: (user: User | null) => void;
  setFiles: (files: FileItem[]) => void;
  logout: () => void;
  rehydrate: () => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  files: [],
  hydrated: false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("token", user.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.username,
          email: user.email,
          id: user.id,
        }),
      );
    }
    set({ user });
  },

  setFiles: (files) => set({ files }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, files: [], hydrated: true });
  },

  rehydrate: () => {
    try {
      const token = localStorage.getItem("token");
      const raw = localStorage.getItem("user");
      if (token && raw) {
        const part = token.split(".")[1];
        if (!part) throw new Error("bad token");
        const payload = JSON.parse(atob(part));
        const expired = payload.exp && Date.now() / 1000 > payload.exp;
        if (expired) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({ user: null, hydrated: true });
          return;
        }
        const userData = JSON.parse(raw);
        set({ user: { ...userData, token }, hydrated: true });
        return;
      }
    } catch {}
    set({ user: null, hydrated: true });
  },
}));
