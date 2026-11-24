import React from 'react';
import { ConnectedAccount } from '@/types';
import { useSocialStore } from '@/stores/socialStore';
import { YoutubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from '@/components/common/PlatformIcons';
import { CheckCircle2, Trash2 } from 'lucide-react';

interface AccountCardProps {
  account: ConnectedAccount;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const { disconnectAccount } = useSocialStore();

  const platformMeta = {
    youtube: {
      name: 'YouTube Shorts',
      icon: <YoutubeIcon className="w-5 h-5 text-red-600" />,
      color: 'bg-red-50 text-red-700',
    },
    instagram: {
      name: 'Instagram Reels',
      icon: <InstagramIcon className="w-5 h-5 text-pink-600" />,
      color: 'bg-pink-50 text-pink-700',
    },
    tiktok: {
      name: 'TikTok Video',
      icon: <TikTokIcon className="w-5 h-5 text-black" />,
      color: 'bg-zinc-100 text-zinc-900',
    },
    facebook: {
      name: 'Facebook Pages',
      icon: <FacebookIcon className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 text-blue-700',
    },
  }[account.platform];

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#EEEEEE] hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-zinc-200/60 flex items-center justify-center">
              {platformMeta.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#202124] leading-tight">
                {account.account_name}
              </h4>
              <p className="text-xs text-[#747474] font-medium mt-0.5">
                {account.account_handle}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            <CheckCircle2 className="w-3 h-3" />
            Healthy
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-xl bg-zinc-50 text-[11px] text-[#747474]">
          <div>
            <span className="block text-[10px] text-zinc-400">Total Published</span>
            <span className="font-bold text-[#202124] text-xs">{account.published_count} clips</span>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-400">Platform</span>
            <span className="font-medium text-[#202124]">{platformMeta.name}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-between">
        <span className="text-[10px] text-zinc-400">OAuth 2.0 Connected</span>
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to disconnect ${account.account_name}?`)) {
              disconnectAccount(account.id);
            }
          }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Disconnect account"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
