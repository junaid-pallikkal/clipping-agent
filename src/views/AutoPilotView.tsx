import React from 'react';
import { useAutoPilotStore } from '@/stores/autoPilotStore';
import { ApprovalQueue } from '@/components/autopilot/ApprovalQueue';
import { AutoPilotWizard } from '@/components/autopilot/AutoPilotWizard';
import { ReviewPortalModal } from '@/components/autopilot/ReviewPortalModal';
import { Button } from '@/components/common/Button';
import { Sparkles, Play, Plus, Trash2 } from 'lucide-react';

export const AutoPilotView: React.FC = () => {
  const {
    rules,
    isRunningPipeline,
    setWizardOpen,
    toggleRule,
    deleteRule,
    triggerManualPipeline,
  } = useAutoPilotStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE]">
        <div>
          <h2 className="text-xl font-bold text-[#202124] tracking-tight">AI Auto-Pilot Content Engine</h2>
          <p className="text-xs text-[#747474] mt-0.5">
            Hands-free autonomous production: Ingest $\rightarrow$ Extract $\rightarrow$ Caption $\rightarrow$ Approve $\rightarrow$ Publish.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setWizardOpen(true)}
        >
          New Auto-Pilot Rule
        </Button>
      </div>

      {/* Rules Grid */}
      <div>
        <h3 className="text-sm font-semibold text-[#202124] mb-3">Configured Automation Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-2xl p-5 border border-[#EEEEEE] hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#202124]">{rule.name}</h4>
                      <span className="text-[10px] text-[#747474] font-medium">
                        Source: {rule.source_target}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      rule.is_enabled ? 'bg-[#E54848]' : 'bg-zinc-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                        rule.is_enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-zinc-50 text-[11px] text-[#747474]">
                  <div>
                    <span className="block text-[10px] text-zinc-400">Extracts</span>
                    <span className="font-bold text-[#202124]">{rule.clips_per_video} clips / ep</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400">Cadence</span>
                    <span className="font-bold text-[#202124] capitalize">{rule.publishing_frequency}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400">Published</span>
                    <span className="font-bold text-[#202124]">{rule.total_auto_published} reels</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-600 space-y-1">
                  <div>
                    <span className="text-zinc-400">Target Accounts: </span>
                    <span className="font-medium text-[#202124]">
                      {rule.target_account_ids.length} channels selected
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Approval Policy: </span>
                    <span className="font-medium text-[#202124]">
                      {rule.requires_approval ? 'Holds in Approval Queue' : 'Autonomous 100% Direct Post'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  loading={isRunningPipeline}
                  icon={<Play className="w-3.5 h-3.5 text-[#E54848]" />}
                  onClick={() => triggerManualPipeline(rule.id)}
                >
                  Run Pipeline Now
                </Button>

                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Queue Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#202124]">Client & Editor Approval Queue</h3>
            <p className="text-xs text-[#747474]">
              Review AI-generated highlight cuts before they dispatch to live social accounts.
            </p>
          </div>
        </div>

        <ApprovalQueue />
      </div>

      {/* Modals */}
      <AutoPilotWizard />
      <ReviewPortalModal />
    </div>
  );
};
