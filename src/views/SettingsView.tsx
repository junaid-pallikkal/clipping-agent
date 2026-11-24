import React, { useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useCreditStore } from '@/stores/creditStore';
import { Button } from '@/components/common/Button';
import { WorkspaceRole } from '@/types';
import { Users, CreditCard, Plus, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser } = useWorkspaceStore();
  const { quota, setUpgradeModalOpen } = useCreditStore();

  const [members, setMembers] = useState<Array<{ id: string; name: string; email: string; role: WorkspaceRole }>>([
    { id: '1', name: `${currentUser.full_name} (@${currentUser.username || 'junaidclips'})`, email: currentUser.email, role: 'owner' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('editor');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
      },
    ]);
    setInviteEmail('');
  };

  const isUnlimited = quota.transcription_minutes_limit >= 99999;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#EEEEEE]">
        <h2 className="text-xl font-bold text-[#202124] tracking-tight">Workspace & Team Settings</h2>
        <p className="text-xs text-[#747474] mt-0.5">
          Account profile for @{currentUser.username || 'junaidclips'} • Lifetime VIP Unlimited Access
        </p>
      </div>

      {/* 1. Subscription & Billing Tier */}
      <div className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#202124]">
                  {isUnlimited ? 'Unlimited VIP Lifetime Plan' : `${quota.tier} Plan`}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  Fully Free & Unlimited
                </span>
              </div>
              <p className="text-xs text-[#747474] mt-0.5">
                Lifetime 100% Free Access • Zero Usage Restrictions • 4K Exports Enabled
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => setUpgradeModalOpen(true)}
          >
            Plan Details
          </Button>
        </div>

        {/* Usage Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EEEEEE]">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#747474]">Transcription Minutes</span>
              <span className="font-semibold text-emerald-700">Unlimited (Free)</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#747474]">Clip Exports</span>
              <span className="font-semibold text-emerald-700">Unlimited (4K HD)</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#747474]">Social Channels</span>
              <span className="font-semibold text-emerald-700">Unlimited Channels</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Team Members & RBAC */}
      <div className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#202124] flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-600" />
              <span>Workspace Members & Roles</span>
            </h3>
            <p className="text-xs text-[#747474] mt-0.5">
              Strict role-based isolation: Reviewers only access client portals; Editors cannot access billing.
            </p>
          </div>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} className="flex gap-2 pt-2">
          <input
            type="email"
            placeholder="colleague@agency.com or client@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
            className="text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          >
            <option value="editor">Editor</option>
            <option value="reviewer">Reviewer (Client)</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
            Invite
          </Button>
        </form>

        {/* Members Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EEEEEE] text-[#747474]">
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Access Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/50">
                  <td className="py-2.5 font-semibold text-[#202124]">{m.name}</td>
                  <td className="py-2.5 text-[#747474]">{m.email}</td>
                  <td className="py-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                      {m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
