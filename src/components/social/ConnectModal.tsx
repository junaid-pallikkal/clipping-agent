import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useSocialStore } from '@/stores/socialStore';
import { SocialPlatform } from '@/types';
import { YoutubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from '@/components/common/PlatformIcons';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const ConnectModal: React.FC = () => {
  const { isConnectModalOpen, selectedPlatform, setConnectModalOpen, connectAccount } = useSocialStore();

  const [platform, setPlatform] = useState<SocialPlatform>(selectedPlatform || 'instagram');
  const [accountName, setAccountName] = useState('');
  const [handle, setHandle] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const platforms: Array<{
    id: SocialPlatform;
    name: string;
    icon: React.ReactNode;
    scopes: string[];
    note: string;
  }> = [
    {
      id: 'instagram',
      name: 'Instagram Reels',
      icon: <InstagramIcon className="w-5 h-5 text-pink-600" />,
      scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
      note: 'Requires an Instagram Professional or Creator account connected to a Facebook Page.',
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      icon: <YoutubeIcon className="w-5 h-5 text-red-600" />,
      scopes: ['youtube.upload', 'youtube.readonly'],
      note: 'Connects your official Google account to upload Shorts with tags and description.',
    },
    {
      id: 'tiktok',
      name: 'TikTok Video',
      icon: <TikTokIcon className="w-5 h-5 text-black" />,
      scopes: ['video.upload', 'video.publish', 'user.info.basic'],
      note: 'Authorizes video uploading directly to your TikTok profile or Creator Inbox.',
    },
    {
      id: 'facebook',
      name: 'Facebook Pages',
      icon: <FacebookIcon className="w-5 h-5 text-blue-600" />,
      scopes: ['pages_manage_posts', 'publish_video'],
      note: 'Publishes high-resolution Reels to your managed Facebook Page.',
    },
  ];

  const handleOAuthSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName || !handle) return;

    setIsAuthorizing(true);
    // Simulate secure OAuth 2.0 handshake with token exchange
    await new Promise((r) => setTimeout(r, 1200));

    connectAccount(platform, accountName, handle);
    setIsAuthorizing(false);
    setAccountName('');
    setHandle('');
  };

  const selectedData = platforms.find((p) => p.id === platform) || platforms[0];

  return (
    <Modal
      isOpen={isConnectModalOpen}
      onClose={() => !isAuthorizing && setConnectModalOpen(false)}
      title="Connect Social Media Channel"
      description="Authorize official platform publishing via secure OAuth 2.0. We never ask for your passwords."
      size="md"
    >
      <form onSubmit={handleOAuthSimulate} className="space-y-4">
        {/* Platform Selector Grid */}
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all text-left ${
                platform === p.id
                  ? 'border-[#E54848] bg-[#FFF1F0]/40 font-semibold'
                  : 'border-[#EEEEEE] hover:bg-zinc-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/60 flex items-center justify-center">
                {p.icon}
              </div>
              <span className="text-xs text-[#202124]">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Account Details */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1">
              Account Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Junaid Clips"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1">
              Social Handle / Channel ID
            </label>
            <input
              type="text"
              placeholder="e.g. @junaidclips"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
            />
          </div>
        </div>

        {/* Security & Scopes Notice */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-[11px] text-[#747474] space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#202124]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>OAuth 2.0 Authorized Permissions</span>
          </div>
          <p>{selectedData.note}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {selectedData.scopes.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-200/60 font-mono text-[9px] text-zinc-700">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
          <Button variant="ghost" type="button" onClick={() => setConnectModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isAuthorizing}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Authorize via {selectedData.name}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
