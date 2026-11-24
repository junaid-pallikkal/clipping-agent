import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { extractYouTubeId, fetchYouTubeMetadata, getYouTubeThumbnail } from '@/lib/youtube';
import { SAMPLE_TRANSCRIPT } from '@/lib/mockData';
import { SUBTITLE_PRESETS } from '@/lib/subtitles';
import { Clip } from '@/types';
import { UploadCloud, Link as LinkIcon, Folder } from 'lucide-react';

export const VideoUploadModal: React.FC = () => {
  const { isUploadModalOpen, setUploadModalOpen, projects, addVideoAsset, addClips, addTranscript, setActiveView } = useWorkspaceStore();

  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !videoUrl) return;

    setIsUploading(true);
    for (let p = 10; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setProgress(p);
    }

    const ytId = extractYouTubeId(videoUrl);
    let videoTitle = title || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Web Video Import');
    let thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';

    if (ytId) {
      thumbnailUrl = getYouTubeThumbnail(ytId);
      const meta = await fetchYouTubeMetadata(videoUrl);
      if (meta?.title && !title) videoTitle = meta.title;
    }

    const playableUrl = file ? URL.createObjectURL(file) : '/sample-clip.mp4';

    const newVideo = addVideoAsset({
      workspace_id: 'ws-agency-alpha',
      project_id: selectedProjectId || undefined,
      title: videoTitle,
      source_type: activeTab === 'upload' ? 'upload' : 'youtube',
      source_url: videoUrl || undefined,
      duration_seconds: 1800,
      resolution_width: 1920,
      resolution_height: 1080,
      fps: 30,
      file_size_bytes: file?.size || 650000000,
      status: 'completed',
    });

    // Populate transcript for synchronized subtitles
    addTranscript(newVideo.id, {
      ...SAMPLE_TRANSCRIPT,
      id: `tr-${newVideo.id}`,
      video_asset_id: newVideo.id,
    });

    // Generate 2 ready-to-edit clips for the newly ingested video
    const generatedClips: Clip[] = [
      {
        id: `clip-ingest-${Date.now()}-1`,
        workspace_id: 'ws-agency-alpha',
        video_asset_id: newVideo.id,
        title: `${videoTitle}: Core Breakthrough`,
        summary: 'Identified as the highest retention segment with strong opening hook.',
        hook_sentence: 'The single biggest mistake most founders make in 2026...',
        virality_score: 94,
        virality_breakdown: { hook_score: 96, pacing_score: 92, emotional_peak: 91, retention_score: 95 },
        start_time: 0.0,
        end_time: 25.0,
        duration_seconds: 25.0,
        aspect_ratio: '9:16',
        crop_center_x: 0.5,
        status: 'ready',
        video_url: playableUrl,
        thumbnail_url: thumbnailUrl,
        subtitles: { ...SUBTITLE_PRESETS.hormozi_bold },
        created_at: new Date().toISOString(),
      },
      {
        id: `clip-ingest-${Date.now()}-2`,
        workspace_id: 'ws-agency-alpha',
        video_asset_id: newVideo.id,
        title: `${videoTitle}: Execution Framework`,
        summary: 'High-pacing sequence explaining the exact tactical steps.',
        hook_sentence: 'If you can take one long video and cut it into twelve viral hooks...',
        virality_score: 89,
        virality_breakdown: { hook_score: 90, pacing_score: 94, emotional_peak: 85, retention_score: 88 },
        start_time: 8.0,
        end_time: 28.0,
        duration_seconds: 20.0,
        aspect_ratio: '9:16',
        crop_center_x: 0.52,
        status: 'ready',
        video_url: playableUrl,
        thumbnail_url: thumbnailUrl,
        subtitles: { ...SUBTITLE_PRESETS.mrbeast_pop },
        created_at: new Date().toISOString(),
      },
    ];

    addClips(generatedClips);

    setIsUploading(false);
    setProgress(0);
    setUploadModalOpen(false);
    setActiveView('projects');
  };

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => !isUploading && setUploadModalOpen(false)}
      title="Upload Long-Form Video"
      description="Add a source video to your media library for AI transcription and highlight generation."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source Tab Toggle */}
        <div className="flex rounded-xl bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'upload' ? 'bg-white shadow-xs text-[#202124]' : 'text-zinc-600'
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'url' ? 'bg-white shadow-xs text-[#202124]' : 'text-zinc-600'
            }`}
          >
            Import via Link
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div className="border-2 border-dashed border-[#EEEEEE] hover:border-[#E54848]/60 rounded-xl p-6 text-center cursor-pointer transition-all">
            <input
              type="file"
              id="file-upload"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-[#E54848] mb-2" />
              <span className="text-xs font-semibold text-[#202124]">
                {file ? file.name : 'Click to browse or drag & drop video'}
              </span>
              <span className="text-[11px] text-[#747474] mt-1">
                MP4, MOV, WEBM or MKV (up to 4GB)
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#202124]">Video Link</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=... or Google Drive URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Video Title */}
        <div>
          <label className="block text-xs font-semibold text-[#202124] mb-1">Video Title</label>
          <input
            type="text"
            placeholder="e.g. Masterclass Episode 42: Building SaaS"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          />
        </div>

        {/* Project Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#202124] mb-1">
            Assign to Project Folder
          </label>
          <div className="relative">
            <Folder className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
            >
              <option value="">No Project (Uncategorized)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-[#747474]">
              <span>Ingesting and preparing audio streams...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#E54848] h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
          <Button variant="ghost" type="button" onClick={() => setUploadModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isUploading}
            disabled={!file && !videoUrl}
          >
            Start Processing
          </Button>
        </div>
      </form>
    </Modal>
  );
};
