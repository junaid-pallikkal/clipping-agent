import React from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { CreditCounter } from '@/components/dashboard/CreditCounter';
import { Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    currentUser,
    searchQuery,
    setSearchQuery,
    setActiveView,
  } = useWorkspaceStore();

  return (
    <header className="h-14 border-b border-[#EEEEEE] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Workspace Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={currentWorkspace.id}
            onChange={(e) => setCurrentWorkspace(e.target.value)}
            className="text-xs font-bold text-[#202124] py-1.5 pl-2.5 pr-7 rounded-xl border border-transparent hover:border-zinc-200 bg-transparent hover:bg-zinc-50 cursor-pointer focus:outline-none transition-all"
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clips, videos, channels (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#EEEEEE] bg-[#FAFAFA] focus:bg-white focus:border-[#E54848] focus:outline-none transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Right Tools: Credit Balance & Profile */}
      <div className="flex items-center gap-3">
        <CreditCounter />

        {/* User Avatar */}
        <div
          onClick={() => setActiveView('settings')}
          className="flex items-center gap-2 pl-2 border-l border-[#EEEEEE] cursor-pointer group select-none"
        >
          <img
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            className="w-7 h-7 rounded-full object-cover border border-zinc-200 group-hover:border-[#E54848] transition-colors"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#202124] group-hover:text-[#E54848] transition-colors leading-tight">
              {currentUser.full_name}
            </span>
            {currentUser.username && (
              <span className="text-[10px] text-zinc-400 font-mono leading-tight">
                @{currentUser.username}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
