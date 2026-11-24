import React, { useState } from 'react';
import { ScheduledPost } from '@/types';
import { useSocialStore } from '@/stores/socialStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { YoutubeIcon, InstagramIcon } from '@/components/common/PlatformIcons';
import { Send, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  post: ScheduledPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { accounts, deleteScheduledPost, publishPostNow } = useSocialStore();
  const { clips } = useWorkspaceStore();

  const [isPublishing, setIsPublishing] = useState(false);

  const account = accounts.find((a) => a.id === post.account_id);
  const clip = clips.find((c) => c.id === post.clip_id);

  const handlePublishNow = async () => {
    setIsPublishing(true);
    await publishPostNow(post.id);
    setIsPublishing(false);
  };

  const statusBadges = {
    scheduled: { text: 'Scheduled', bg: 'bg-blue-50 text-blue-700 border-blue-200/50' },
    publishing: { text: 'Publishing...', bg: 'bg-amber-50 text-amber-700 border-amber-200/50' },
    published: { text: 'Published', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' },
    failed: { text: 'Failed', bg: 'bg-red-50 text-red-700 border-red-200/50' },
    draft: { text: 'Draft Review', bg: 'bg-zinc-100 text-zinc-700 border-zinc-200/50' },
    cancelled: { text: 'Cancelled', bg: 'bg-zinc-100 text-zinc-400' },
  }[post.status];

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#EEEEEE] hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with thumbnail & Channel badge */}
        <div className="flex gap-3 mb-3">
          <div className="w-16 h-20 rounded-xl bg-zinc-900 overflow-hidden relative shrink-0 border border-zinc-200/60">
            <img
              src={clip?.thumbnail_url || 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=300&auto=format&fit=crop&q=80'}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white font-mono px-1 rounded">
              {clip?.duration_seconds.toFixed(0)}s
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadges.bg}`}>
                {statusBadges.text}
              </span>
              <span className="text-[10px] text-[#747474] flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {format(new Date(post.scheduled_for), 'MMM d, h:mm a')}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-[#202124] mt-1.5 line-clamp-1">
              {post.title || clip?.title}
            </h4>
            <p className="text-[11px] text-[#747474] mt-1 line-clamp-2">
              {post.caption}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px]">
          <span className="text-[#747474]">Channel:</span>
          <span className="font-semibold text-[#202124] flex items-center gap-1.5">
            {account?.platform === 'youtube' && <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />}
            {account?.platform === 'instagram' && <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />}
            {account?.account_handle || 'Direct Export'}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 mt-3 border-t border-[#EEEEEE] flex items-center justify-between">
        {post.status === 'published' ? (
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed on Platform
          </span>
        ) : (
          <button
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E54848] text-white hover:bg-[#C93636] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>{isPublishing ? 'Dispatching...' : 'Publish Now'}</span>
          </button>
        )}

        <button
          onClick={() => deleteScheduledPost(post.id)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete scheduled post"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
