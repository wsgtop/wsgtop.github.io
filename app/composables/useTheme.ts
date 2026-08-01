export type Theme = "light" | "dark"

export function useTheme() {
    const theme = useState<Theme>("theme",()=> "light")

    const apply = (next: Theme) => {
        theme.value = next
        if(import.meta.client){
            document.documentElement.classList.toggle("dark", next === "dark")
            localStorage.setItem("theme", next)
        }
    }

    const toggleTheme = () => {
        apply(theme.value === "light" ? "dark" : "light")
    }
    const initTheme = () => {
        if(!import.meta.client){
            return
        }
        const stored = localStorage.getItem("theme") as Theme | null
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        theme.value = stored ?? (prefersDark ? "dark" : "light")
    }

    return {
        theme,
        toggleTheme,
        initTheme,
    }
}