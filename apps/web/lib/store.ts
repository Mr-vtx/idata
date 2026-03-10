import { create } from "zustand";

interface User {
  username: string;
  token: string;
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
  setUser: (user: User | null) => void;
  setFiles: (files: FileItem[]) => void;
  logout: () => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  files: [],
  setUser: (user) => {
    if (user) localStorage.setItem("token", user.token);
    set({ user });
  },
  setFiles: (files) => set({ files }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, files: [] });
  },
}));
