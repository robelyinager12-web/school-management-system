"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function Topbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="glass-panel sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 px-6">
      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/50">
        <Search size={16} />
        <input
          placeholder="Search students, teachers, records..."
          className="w-64 bg-transparent outline-none placeholder:text-white/40"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-white/70 hover:bg-white/5">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-500" />
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/80 hover:bg-white/5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <span>{user?.firstName}</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}