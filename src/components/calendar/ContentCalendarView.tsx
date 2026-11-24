import React, { useState } from 'react';
import { useSocialStore } from '@/stores/socialStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { PostCard } from './PostCard';
import { Button } from '@/components/common/Button';
import { Calendar as CalendarIcon, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

export const ContentCalendarView: React.FC = () => {
  const { scheduledPosts, accounts } = useSocialStore();
  const { setActiveView } = useWorkspaceStore();

  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const filteredPosts = scheduledPosts.filter((p) => {
    if (filterAccount === 'all') return true;
    return p.account_id === filterAccount;
  });

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE]">
        <div>
          <h2 className="text-xl font-bold text-[#202124] tracking-tight">Content Publishing Calendar</h2>
          <p className="text-xs text-[#747474] mt-0.5">
            Manage scheduled shorts, reels, and automated distribution across all connected accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Account Filter */}
          <div className="relative">
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="text-xs py-2 pl-3 pr-8 rounded-xl border border-[#EEEEEE] bg-white font-medium text-zinc-700 focus:outline-none focus:border-[#E54848]"
            >
              <option value="all">All Accounts ({accounts.length})</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_name} ({a.platform})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setActiveView('projects')}
          >
            Schedule New Clip
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#EEEEEE] shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#E54848]" />
          <span className="text-xs font-bold text-[#202124]">
            {format(weekDays[0], 'MMMM d')} – {format(weekDays[6], 'MMMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            className="p-1.5 rounded-lg border border-[#EEEEEE] hover:bg-zinc-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600" />
          </button>
          <button
            onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#EEEEEE] hover:bg-zinc-50 cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            className="p-1.5 rounded-lg border border-[#EEEEEE] hover:bg-zinc-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Weekly Visual Columns */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayPosts = filteredPosts.filter((p) => p.scheduled_for.startsWith(dateStr));
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

          return (
            <div
              key={dateStr}
              className={`rounded-2xl p-3 border min-h-[300px] flex flex-col ${
                isToday
                  ? 'bg-[#FFF1F0]/20 border-[#E54848]/30 ring-1 ring-[#E54848]/20'
                  : 'bg-[#FAFAFA] border-[#EEEEEE]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60">
                <span className="text-xs font-bold text-[#202124]">{format(day, 'EEE')}</span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded-md ${
                    isToday ? 'bg-[#E54848] text-white font-bold' : 'text-zinc-500'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {dayPosts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-zinc-400 font-medium">
                    No posts
                  </div>
                ) : (
                  dayPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* List of All Posts */}
      <div className="pt-4">
        <h3 className="text-sm font-semibold text-[#202124] mb-3">All Scheduled & Dispatched Posts</h3>
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EEEEEE] p-10 text-center space-y-3">
            <Clock className="w-10 h-10 text-zinc-300 mx-auto" />
            <h4 className="text-sm font-semibold text-[#202124]">No Posts Scheduled Yet</h4>
            <p className="text-xs text-[#747474] max-w-sm mx-auto">
              Select any extracted clip from your projects or trigger AI Auto-Pilot to automatically fill your queue.
            </p>
            <Button variant="primary" onClick={() => setActiveView('projects')}>
              Go to Clips
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
