import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useEditorStore } from '@/stores/editorStore';
import { SUBTITLE_PRESETS } from '@/lib/subtitles';
import { SubtitleStyleConfig, Clip } from '@/types';
import { extractYouTubeId, fetchYouTubeMetadata, getYouTubeThumbnail } from '@/lib/youtube';
import { SAMPLE_TRANSCRIPT } from '@/lib/mockData';
import { UploadCloud, Link as LinkIcon, Sparkles, CheckCircle, Wand2 } from 'lucide-react';

export const QuickModeModal: React.FC = () => {
  const { isQuickModeOpen, setQuickModeOpen, addClips, addVideoAsset, addTranscript, setActiveView } = useWorkspaceStore();
  const { setActiveClip } = useEditorStore();

  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clipsCount, setClipsCount] = useState<number>(3);
  const [targetDuration, setTargetDuration] = useState<number>(30);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyleConfig['preset']>('hormozi_bold');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const steps = [
    'Transcribing audio & separating speakers...',
    'Analyzing hooks, sentiment & virality scores...',
    'Auto-framing active speakers to 9:16 vertical...',
    'Generating animated karaoke subtitles...',
  ];

  const handleGenerate = async () => {
    setIsProcessing(true);

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    // Determine metadata and playable source
    const ytId = extractYouTubeId(urlInput);
    let videoTitle = selectedFile
      ? selectedFile.name.replace(/\.[^/.]+$/, '')
      : urlInput || 'Imported Masterclass Interview';
    let thumbnailUrl = 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=600&auto=format&fit=crop&q=80';

    if (ytId) {
      thumbnailUrl = getYouTubeThumbnail(ytId);
      const meta = await fetchYouTubeMetadata(urlInput);
      if (meta?.title) videoTitle = meta.title;
    }

    // Direct object URL if user selected a local file, otherwise high-performance local sample video
    const playableUrl = selectedFile ? URL.createObjectURL(selectedFile) : '/sample-clip.mp4';

    const newVideo = addVideoAsset({
      workspace_id: 'ws-agency-alpha',
      title: videoTitle,
      source_type: selectedFile ? 'upload' : 'youtube',
      source_url: urlInput || undefined,
      duration_seconds: 1420.0,
      resolution_width: 1920,
      resolution_height: 1080,
      fps: 30,
      file_size_bytes: selectedFile?.size || 450000000,
      status: 'completed',
    });

    // Attach transcript for real-time word-level captioning
    addTranscript(newVideo.id, {
      ...SAMPLE_TRANSCRIPT,
      id: `tr-${newVideo.id}`,
      video_asset_id: newVideo.id,
    });

    // Generate simulated high-virality clips
    const createdClips: Clip[] = Array.from({ length: clipsCount }).map((_, idx) => {
      const start = idx * 8.0;
      const dur = targetDuration - (idx % 2 === 0 ? 3 : -2);
      return {
        id: `clip-quick-${Date.now()}-${idx}`,
        workspace_id: 'ws-agency-alpha',
        video_asset_id: newVideo.id,
        title: `Viral Clip #${idx + 1}: ${idx === 0 ? 'The 10x Distribution Engine' : 'Why Manual Editing is Obsolete'}`,
        summary: 'Extracted automatically using multimodal topic segmentation and hook strength detection.',
        hook_sentence: 'Here is the exact framework we used to dominate social algorithms in 2026.',
        virality_score: 95 - idx * 3,
        virality_breakdown: {
          hook_score: 96 - idx * 2,
          pacing_score: 92 - idx,
          emotional_peak: 90 - idx * 2,
          retention_score: 94 - idx,
        },
        start_time: start,
        end_time: start + dur,
        duration_seconds: dur,
        aspect_ratio: '9:16',
        crop_center_x: 0.5,
        status: 'ready',
        video_url: playableUrl,
        thumbnail_url: thumbnailUrl,
        subtitles: { ...SUBTITLE_PRESETS[subtitleStyle] },
        audio_music_track: 'upbeat_tech_drive',
        audio_music_volume: 0.15,
        created_at: new Date().toISOString(),
      };
    });

    addClips(createdClips);
    setActiveClip(createdClips[0]);
    setIsProcessing(false);
    setQuickModeOpen(false);
    setActiveView('studio');
  };

  return (
    <Modal
      isOpen={isQuickModeOpen}
      onClose={() => !isProcessing && setQuickModeOpen(false)}
      title="Quick Clip Mode"
      description="One click to convert any long video into vertical, captioned viral clips."
      size="lg"
    >
      {isProcessing ? (
        <div className="py-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1F0] flex items-center justify-center mx-auto text-[#E54848] animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-base font-bold text-[#202124]">AI Pipeline In Progress</h4>
            <p className="text-xs text-[#747474] mt-1">{steps[processingStep]}</p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                  idx === processingStep
                    ? 'bg-[#FFF1F0] text-[#E54848] font-semibold border border-[#E54848]/20'
                    : idx < processingStep
                    ? 'bg-zinc-50 text-zinc-700'
                    : 'text-zinc-400 opacity-60'
                }`}
              >
                {idx < processingStep ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 ${
                      idx === processingStep ? 'border-[#E54848] text-[#E54848]' : 'border-zinc-300'
                    }`}
                  >
                    {idx + 1}
                  </div>
                )}
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Video Input Source */}
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-2">
              1. Choose Video Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File upload option */}
              <label className="border border-dashed border-[#EEEEEE] hover:border-[#E54848]/60 hover:bg-[#FFF1F0]/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                />
                <UploadCloud className="w-6 h-6 text-[#E54848] mb-1.5" />
                <span className="text-xs font-semibold text-[#202124]">
                  {selectedFile ? selectedFile.name : 'Upload Local MP4 / MOV'}
                </span>
                <span className="text-[10px] text-[#747474] mt-0.5">Up to 4GB supported</span>
              </label>

              {/* URL input option */}
              <div className="border border-[#EEEEEE] rounded-xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#202124] mb-2">
                  <LinkIcon className="w-4 h-4 text-zinc-500" />
                  <span>Or Paste Video Link</span>
                </div>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#EEEEEE]">
            {/* Number of clips */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Clips to Generate
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setClipsCount(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      clipsCount === num
                        ? 'bg-[#E54848] text-white border-[#E54848]'
                        : 'border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Target duration */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Clip Duration
              </label>
              <div className="flex gap-2">
                {[15, 30, 60].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setTargetDuration(dur)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      targetDuration === dur
                        ? 'bg-[#E54848] text-white border-[#E54848]'
                        : 'border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle preset */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Subtitle Style
              </label>
              <select
                value={subtitleStyle}
                onChange={(e) => setSubtitleStyle(e.target.value as SubtitleStyleConfig['preset'])}
                className="w-full py-1.5 px-2.5 rounded-lg text-xs border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
              >
                <option value="hormozi_bold">Hormozi Pop (Yellow)</option>
                <option value="mrbeast_pop">MrBeast Viral (Red)</option>
                <option value="minimal_clean">Minimal Clean</option>
                <option value="cyber_glow">Cyberpunk Neon</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
            <span className="text-xs text-[#747474]">
              Est. time: ~45 seconds • Deducts {targetDuration * clipsCount > 60 ? '2' : '1'} credits
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setQuickModeOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Wand2 className="w-4 h-4" />}
                onClick={handleGenerate}
              >
                Generate Viral Clips
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
