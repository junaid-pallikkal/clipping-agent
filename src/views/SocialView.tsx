import React from 'react';
import { useSocialStore } from '@/stores/socialStore';
import { AccountCard } from '@/components/social/AccountCard';
import { ConnectModal } from '@/components/social/ConnectModal';
import { Button } from '@/components/common/Button';
import { Plus, ShieldCheck, Share2 } from 'lucide-react';

export const SocialView: React.FC = () => {
  const { accounts, setConnectModalOpen } = useSocialStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE]">
        <div>
          <h2 className="text-xl font-bold text-[#202124] tracking-tight">Connected Social Accounts</h2>
          <p className="text-xs text-[#747474] mt-0.5">
            Manage official OAuth 2.0 authorized publishing channels for automated distribution.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setConnectModalOpen(true)}
        >
          Connect New Account
        </Button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-[#202124] block">
            Official Platform API Compliance & Encryption Standard
          </span>
          <p className="text-[#747474] mt-0.5 leading-relaxed">
            All access tokens and refresh tokens are encrypted at rest with AES-256-GCM in our server vault. We strictly interact through official YouTube Data, Instagram Graph, and TikTok Posting APIs. Passwords are never seen or stored.
          </p>
        </div>
      </div>

      {/* Accounts Grid or Clean Empty State */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#EEEEEE] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF1F0] text-[#E54848] flex items-center justify-center mx-auto">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#202124]">No Accounts Connected Yet</h3>
          <p className="text-xs text-[#747474] max-w-sm mx-auto">
            Connect your YouTube Shorts, Instagram Reels, TikTok, or Facebook Page to enable automated 1-click publishing.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setConnectModalOpen(true)}
          >
            Connect First Account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      )}

      {/* Connect Modal */}
      <ConnectModal />
    </div>
  );
};
