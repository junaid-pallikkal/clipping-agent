import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useCreditStore } from '@/stores/creditStore';
import { SubscriptionTier } from '@/types';
import { Check } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { quota, isUpgradeModalOpen, setUpgradeModalOpen, switchTier } = useCreditStore();

  const plans: Array<{
    id: SubscriptionTier;
    name: string;
    price: string;
    description: string;
    badge?: string;
    features: string[];
    isPopular?: boolean;
  }> = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      description: 'Ideal for trying out AI highlight extraction.',
      features: ['30 min transcription / mo', '5 clip exports', '1080p with watermark', '1 social account'],
    },
    {
      id: 'creator',
      name: 'Creator',
      price: '$29',
      description: 'For solo podcasters and creators publishing weekly.',
      features: [
        '120 min transcription / mo',
        '30 clip exports',
        'No watermark',
        '5 social accounts',
        'Basic Auto-Pilot',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Studio',
      price: '$79',
      description: 'Full studio power with 4K rendering and client portals.',
      badge: 'Most Popular',
      isPopular: true,
      features: [
        '300 min transcription / mo',
        '100 clip exports',
        '4K Ultra HD exports',
        '15 social accounts',
        '5 team members',
        'Client review portals',
        'Full Auto-Pilot Engine',
      ],
    },
    {
      id: 'agency',
      name: 'Agency Elite',
      price: '$199',
      description: 'For media agencies managing multiple client brands.',
      badge: 'Uncapped',
      features: [
        '1000 min transcription / mo',
        '500 clip exports',
        '50 social accounts',
        '20 team seats',
        'White-label review portal',
        'Dedicated account manager',
      ],
    },
  ];

  return (
    <Modal
      isOpen={isUpgradeModalOpen}
      onClose={() => setUpgradeModalOpen(false)}
      title="Upgrade Your Content Engine"
      description="Select the subscription tier suited for your video output and publishing volume."
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-2">
        {plans.map((plan) => {
          const isCurrent = quota.tier === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'border-[#E54848] bg-[#FFF1F0]/20 shadow-md ring-1 ring-[#E54848]/20'
                  : 'border-[#EEEEEE] bg-white hover:border-zinc-300'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4 bg-[#E54848] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {plan.badge}
                </span>
              )}

              <div>
                <h4 className="text-sm font-bold text-[#202124]">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#202124]">{plan.price}</span>
                  <span className="text-[11px] text-[#747474]">/month</span>
                </div>
                <p className="text-[11px] text-[#747474] mt-1.5 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                <div className="my-4 pt-3 border-t border-[#EEEEEE] space-y-2">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#202124]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-500 cursor-default"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => switchTier(plan.id)}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      plan.isPopular
                        ? 'bg-[#E54848] text-white hover:bg-[#C93636] shadow-xs'
                        : 'bg-zinc-900 text-white hover:bg-black'
                    }`}
                  >
                    Switch to {plan.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between text-xs text-[#747474]">
        <span>Encrypted Stripe billing • Cancel or upgrade at any time</span>
        <Button variant="ghost" onClick={() => setUpgradeModalOpen(false)}>
          Close
        </Button>
      </div>
    </Modal>
  );
};
