import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StaticImageData } from "next/image";

import { Sidebar } from "./Sidebar";
import { HeaderBar, type HeaderChip } from "./HeaderBar";

type DashboardShellProps = {
  children: ReactNode;
  headerTrailing?: ReactNode;
  headerChips?: HeaderChip[];
  headerSearchValue?: string;
  onHeaderSearchChange?: (value: string) => void;
  headerSearchPlaceholder?: string;
  headerHeadline?: string;
  headerSubtitle?: string;
  headerStatusBadge?: string;
  headerShowSearch?: boolean;
  profileImageSrc?: string | StaticImageData;
};

const THEMES = {
  pink: {
    background: "bg-gradient-to-br from-[#fef4f7] via-[#fff6ed] to-[#efe8ff]",
    sidebarBg: "bg-white/80",
    sidebarShadow: "shadow-[0_45px_120px_rgba(249,115,164,0.22)]",
    sidebarBadge: "text-rose-400/80",
    brandText: "text-[#7e3f3b]",
    cardBorder: "border-white/60",
    cardBg: "bg-white/85",
    cardShadow: "shadow-[0_55px_130px_rgba(249,115,164,0.22)]",
    toggleIndicator: "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300",
    toggleShadow: "shadow-rose-200/60",
    buttonBorder: "border-rose-200",
    buttonHoverBorder: "hover:border-rose-400",
    buttonHoverText: "hover:text-rose-500",
  },
  blue: {
    background: "bg-gradient-to-br from-[#f2f8ff] via-[#eef4ff] to-[#dfefff]",
    sidebarBg: "bg-white/85",
    sidebarShadow: "shadow-[0_45px_120px_rgba(56,137,209,0.18)]",
    sidebarBadge: "text-sky-400/80",
    brandText: "text-[#1f2f4e]",
    cardBorder: "border-white/70",
    cardBg: "bg-white/90",
    cardShadow: "shadow-[0_55px_130px_rgba(79,70,229,0.18)]",
    toggleIndicator: "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600",
    toggleShadow: "shadow-sky-200/60",
    buttonBorder: "border-sky-200",
    buttonHoverBorder: "hover:border-sky-400",
    buttonHoverText: "hover:text-sky-500",
  },
} as const;

type ThemeName = keyof typeof THEMES;

type DashboardThemeContextValue = {
  themeName: ThemeName;
  setThemeName: Dispatch<SetStateAction<ThemeName>>;
  styles: (typeof THEMES)[ThemeName];
};

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(
  null,
);

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error(
      "useDashboardTheme must be used within a DashboardShell component",
    );
  }
  return context;
}

export function DashboardShell({
  children,
  headerTrailing,
  headerChips,
  headerSearchValue,
  onHeaderSearchChange,
  headerSearchPlaceholder,
  headerHeadline,
  headerSubtitle,
  headerStatusBadge,
  headerShowSearch = true,
  profileImageSrc,
}: DashboardShellProps) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window === "undefined") {
      return "pink";
    }
    const stored = window.localStorage.getItem("soulmatch-theme");
    return stored === "blue" ? "blue" : "pink";
  });
  const theme = useMemo(() => THEMES[themeName], [themeName]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("soulmatch-theme", themeName);
    }
  }, [themeName]);

  const providerValue = useMemo(
    () => ({
      themeName,
      setThemeName,
      styles: theme,
    }),
    [theme, themeName],
  );

  return (
    <DashboardThemeContext.Provider value={providerValue}>
      <div
        className={`${theme.background} pb-24 pt-12 text-neutral-700 transition-colors duration-500`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] gap-10 px-8">
          <Sidebar
            theme={themeName}
            onThemeChange={setThemeName}
            themeStyles={theme}
          />
          <main
            className={`flex flex-1 flex-col gap-8 rounded-[44px] border p-10 backdrop-blur transition-colors duration-500 ${theme.cardBorder} ${theme.cardBg} ${theme.cardShadow}`}
          >
            <HeaderBar
              trailing={headerTrailing}
              chips={headerChips}
              searchValue={headerSearchValue}
              onSearchChange={onHeaderSearchChange}
              searchPlaceholder={headerSearchPlaceholder}
              headline={headerHeadline}
              subtitle={headerSubtitle}
              statusBadge={headerStatusBadge}
              showSearch={headerShowSearch}
              profileImageSrc={profileImageSrc}
            />
            {children}
          </main>
        </div>
      </div>
    </DashboardThemeContext.Provider>
  );
}
