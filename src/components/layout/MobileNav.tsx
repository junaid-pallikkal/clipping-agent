import React from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Home, Plus, FolderOpen, Calendar, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, setQuickModeOpen } = useWorkspaceStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#EEEEEE] px-4 flex items-center justify-around z-40 select-none pb-safe">
      {/* 1. Home */}
      <button
        onClick={() => setActiveView('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
          activeView === 'dashboard' ? 'text-[#E54848] font-bold' : 'text-[#747474]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      {/* 2. Projects */}
      <button
        onClick={() => setActiveView('projects')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
          activeView === 'projects' ? 'text-[#E54848] font-bold' : 'text-[#747474]'
        }`}
      >
        <FolderOpen className="w-5 h-5" />
        <span>Projects</span>
      </button>

      {/* 3. Create (+) Prominent Center Button */}
      <button
        onClick={() => setQuickModeOpen(true)}
        className="w-12 h-12 rounded-full bg-[#E54848] hover:bg-[#C93636] active:bg-[#B32B2B] text-white flex items-center justify-center -mt-6 shadow-lg shadow-[#E54848]/30 cursor-pointer transform active:scale-95 transition-transform"
        aria-label="Create New Clips"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 4. Calendar */}
      <button
        onClick={() => setActiveView('calendar')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
          activeView === 'calendar' ? 'text-[#E54848] font-bold' : 'text-[#747474]'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>Calendar</span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => setActiveView('settings')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
          activeView === 'settings' ? 'text-[#E54848] font-bold' : 'text-[#747474]'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </div>
  );
};
