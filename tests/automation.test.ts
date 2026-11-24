import test from 'node:test';
import assert from 'node:assert';
import { useSocialStore } from '../src/stores/socialStore.ts';
import { useAutoPilotStore } from '../src/stores/autoPilotStore.ts';
import { useWorkspaceStore } from '../src/stores/workspaceStore.ts';

test('Social Store: Connects YouTube Shorts and Instagram Reels accounts', () => {
  const store = useSocialStore.getState();

  // Connect YouTube account
  store.connectAccount('youtube', 'Junaid Clips YouTube', '@junaidclips_yt');
  let accounts = useSocialStore.getState().accounts;
  const ytAcc = accounts.find((a) => a.platform === 'youtube');
  assert.ok(ytAcc, 'YouTube account should be connected');
  assert.strictEqual(ytAcc.account_name, 'Junaid Clips YouTube');
  assert.strictEqual(ytAcc.account_handle, '@junaidclips_yt');
  assert.strictEqual(ytAcc.health_status, 'healthy');

  // Connect Instagram account
  store.connectAccount('instagram', 'Junaid Clips IG', 'junaidclips_reels');
  accounts = useSocialStore.getState().accounts;
  const igAcc = accounts.find((a) => a.platform === 'instagram');
  assert.ok(igAcc, 'Instagram account should be connected');
  assert.strictEqual(igAcc.account_handle, '@junaidclips_reels');
  assert.strictEqual(igAcc.health_status, 'healthy');
});

test('Social Store: Schedules and dispatches publishing for YouTube and Instagram', async () => {
  const store = useSocialStore.getState();
  const accounts = store.accounts;
  const ytAcc = accounts.find((a) => a.platform === 'youtube')!;
  const igAcc = accounts.find((a) => a.platform === 'instagram')!;

  // Schedule a YouTube post
  const ytPost = store.schedulePost({
    workspace_id: 'ws-junaid-clips',
    clip_id: 'clip-101',
    account_id: ytAcc.id,
    title: '10x Distribution Secrets #Shorts',
    caption: 'How to automate video clipping #Shorts',
    tags: ['shorts', 'automation'],
    scheduled_for: new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled',
    requires_approval: false,
  });

  assert.strictEqual(ytPost.title, '10x Distribution Secrets #Shorts');
  assert.strictEqual(ytPost.status, 'scheduled');

  // Publish YouTube post immediately
  const ytSuccess = await store.publishPostNow(ytPost.id);
  assert.strictEqual(ytSuccess, true);
  const updatedYtPost = useSocialStore.getState().scheduledPosts.find((p) => p.id === ytPost.id)!;
  assert.strictEqual(updatedYtPost.status, 'published');
  assert.ok(updatedYtPost.platform_post_url?.startsWith('https://youtube.com/shorts/'), 'Should generate valid YouTube Shorts URL');

  // Schedule an Instagram post
  const igPost = store.schedulePost({
    workspace_id: 'ws-junaid-clips',
    clip_id: 'clip-101',
    account_id: igAcc.id,
    title: 'Reels Growth Framework',
    caption: 'Dominating short form #Reels',
    tags: ['reels', 'growth'],
    scheduled_for: new Date(Date.now() + 7200000).toISOString(),
    status: 'scheduled',
    requires_approval: false,
  });

  // Publish Instagram post immediately
  const igSuccess = await store.publishPostNow(igPost.id);
  assert.strictEqual(igSuccess, true);
  const updatedIgPost = useSocialStore.getState().scheduledPosts.find((p) => p.id === igPost.id)!;
  assert.strictEqual(updatedIgPost.status, 'published');
  assert.ok(updatedIgPost.platform_post_url?.startsWith('https://instagram.com/reel/'), 'Should generate valid Instagram Reel URL');
});

test('Auto-Pilot Store: Creates rule and executes automated candidate generation & queueing', async () => {
  const apStore = useAutoPilotStore.getState();
  const accounts = useSocialStore.getState().accounts;

  // Create an autonomous rule
  apStore.createRule({
    workspace_id: 'ws-junaid-clips',
    name: 'Junaid YouTube to Instagram Auto-Pilot',
    is_enabled: true,
    source_type: 'youtube_channel',
    source_target: 'https://youtube.com/@junaidclips',
    clips_per_video: 5,
    preferred_duration_range: [20, 45],
    target_account_ids: accounts.map((a) => a.id),
    publishing_frequency: 'daily',
    publishing_times: ['11:30', '18:30'],
    requires_approval: false,
    auto_subtitles_preset: 'hormozi_bold',
  });

  const rules = useAutoPilotStore.getState().rules;
  const createdRule = rules.find((r) => r.name === 'Junaid YouTube to Instagram Auto-Pilot');
  assert.ok(createdRule, 'AutoPilot rule should be created');

  // Trigger manual pipeline run
  const generatedCount = await apStore.triggerManualPipeline(createdRule.id);
  assert.strictEqual(generatedCount, 1);

  // Check that new clip was added to workspaceStore
  const clips = useWorkspaceStore.getState().clips;
  const autoClip = clips.find((c) => c.id.startsWith('clip-auto-'));
  assert.ok(autoClip, 'Auto-generated clip should exist in workspaceStore');

  // Check that post was automatically scheduled
  const scheduled = useSocialStore.getState().scheduledPosts;
  const autoScheduled = scheduled.find((p) => p.clip_id === autoClip.id);
  assert.ok(autoScheduled, 'Clip should be automatically scheduled to publishing channel');
});
