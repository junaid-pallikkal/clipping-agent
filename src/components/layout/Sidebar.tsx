import React from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import {
  LayoutDashboard,
  Sliders,
  FolderOpen,
  Calendar,
  Share2,
  Sparkles,
  BarChart3,
  Settings,
  Scissors,
  Plus
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setQuickModeOpen } = useWorkspaceStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'studio', label: 'Video Studio', icon: <Sliders className="w-4 h-4" /> },
    { id: 'projects', label: 'Media Library', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'calendar', label: 'Content Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'social', label: 'Social Channels', icon: <Share2 className="w-4 h-4" /> },
    { id: 'autopilot', label: 'AI Auto-Pilot', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'analytics', label: 'Verified Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Workspace & Team', icon: <Settings className="w-4 h-4" /> },
  ] as const;

  return (
    <aside className="w-60 bg-white border-r border-[#EEEEEE] hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-[#EEEEEE]">
          <div className="w-8 h-8 rounded-xl bg-[#E54848] text-white flex items-center justify-center shadow-xs">
            <Scissors className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-[#202124]">
              CLIP<span className="text-[#E54848]">GENIUS</span>
            </span>
            <span className="text-[9px] text-[#747474] font-mono tracking-wider uppercase font-semibold">
              AI Production
            </span>
          </div>
        </div>

        {/* Quick Create Action Button */}
        <div className="p-3">
          <button
            onClick={() => setQuickModeOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#E54848] hover:bg-[#C93636] active:bg-[#B32B2B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs shadow-[#E54848]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Clips</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFF1F0] text-[#E54848] font-bold'
                    : 'text-[#747474] hover:text-[#202124] hover:bg-zinc-50'
                }`}
              >
                <span className={isActive ? 'text-[#E54848]' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#EEEEEE] text-[11px] text-[#747474]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-zinc-800">All Systems Operational</span>
        </div>
        <p className="text-[10px] text-zinc-400 mt-1">CLIPGENIUS v1.0 • Node v24</p>
      </div>
    </aside>
  );
};
