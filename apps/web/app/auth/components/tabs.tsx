"use client";

interface AuthTabsProps {
  tab: "login" | "signup";
  setTab: (tab: "login" | "signup") => void;
}

export default function AuthTabs({ tab, setTab }: AuthTabsProps) {
  return (
    <div className="flex w-full rounded-xl overflow-hidden border border-gray-800">
      <button
        className={`flex-1 py-2 text-center transition ${
          tab === "login"
            ? "bg-brand text-white"
            : "bg-transparent text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => setTab("login")}
      >
        Login
      </button>
      <button
        className={`flex-1 py-2 text-center transition ${
          tab === "signup"
            ? "bg-brand text-white"
            : "bg-transparent text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => setTab("signup")}
      >
        Sign Up
      </button>
    </div>
  );
}
