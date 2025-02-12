import { create } from "zustand"

interface themeStore {
    theme: string,
    setTheme: (theme: string) => void
}

export const useThemeStore = create<themeStore>((set)=>({
    theme: localStorage.getItem("theme") || "light",
    setTheme: (theme:string)=>{
        localStorage.setItem("theme", theme)
        set({theme: theme});
    }
}))