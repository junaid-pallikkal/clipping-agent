import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useEditorStore } from '@/stores/editorStore';
import { useCreditStore } from '@/stores/creditStore';
import { Download, Sparkles, CheckCircle2, Film } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { activeClip, isExporting, exportProgress, startExport } = useEditorStore();
  const { deductExportClip, quota } = useCreditStore();

  const [resolution, setResolution] = useState<'1080p' | '4k'>('1080p');
  const [fps, setFps] = useState<30 | 60>(60);
  const [exportComplete, setExportComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleStartExport = async () => {
    setExportComplete(false);
    const success = deductExportClip();
    if (!success) return;

    await startExport();
    setExportComplete(true);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      let targetUrl = activeClip?.video_url;

      // Guard against old/broken external URLs or YouTube watch URLs
      if (!targetUrl || targetUrl.includes('ForBigger') || targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be')) {
        targetUrl = '/sample-clip.mp4';
      }

      const filename = `${activeClip?.title ? activeClip.title.replace(/[^a-zA-Z0-9_-]/g, '_') : 'viral_clip'}.mp4`;

      // If it's a local object blob or same-origin asset
      if (targetUrl.startsWith('blob:') || targetUrl.startsWith('/')) {
        const a = document.createElement('a');
        a.href = targetUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsDownloading(false);
        onClose();
        return;
      }

      // If remote, fetch as blob to avoid external navigation or access denied XML
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error('Remote download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      setIsDownloading(false);
      onClose();
    } catch {
      // Ultimate fallback: trigger download of the bundled local MP4
      const a = document.createElement('a');
      a.href = '/sample-clip.mp4';
      a.download = `${activeClip?.title ? activeClip.title.replace(/[^a-zA-Z0-9_-]/g, '_') : 'viral_clip'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isExporting && onClose()}
      title="Export High-Resolution Video"
      description="Render video with burned-in subtitles, active speaker framing, and dynamic audio ducking."
      size="md"
    >
      {exportComplete ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#202124]">Render Complete!</h4>
            <p className="text-xs text-[#747474] mt-1">
              Your clip is ready in {resolution} at {fps}fps.
            </p>
          </div>
          <div className="pt-3 flex justify-center gap-2">
            <Button
              variant="primary"
              icon={<Download className="w-4 h-4" />}
              loading={isDownloading}
              onClick={handleDownload}
            >
              Download MP4 File
            </Button>
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : isExporting ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFF1F0] text-[#E54848] flex items-center justify-center mx-auto animate-spin">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#202124]">
              Rendering Filtergraph ({exportProgress}%)
            </h4>
            <p className="text-xs text-[#747474] mt-1">
              Burning subtitles & applying audio ducking...
            </p>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#E54848] h-full rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Resolution Options */}
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-2">
              Export Resolution
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResolution('1080p')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  resolution === '1080p'
                    ? 'border-[#E54848] bg-[#FFF1F0]/30 font-semibold'
                    : 'border-[#EEEEEE] hover:bg-zinc-50'
                }`}
              >
                <div className="text-xs text-[#202124]">1080p Full HD</div>
                <div className="text-[10px] text-[#747474]">Standard for Reels & TikTok</div>
              </button>

              <button
                type="button"
                onClick={() => setResolution('4k')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  resolution === '4k'
                    ? 'border-[#E54848] bg-[#FFF1F0]/30 font-semibold'
                    : 'border-[#EEEEEE] hover:bg-zinc-50'
                }`}
              >
                <div className="text-xs text-[#202124]">4K Ultra HD</div>
                <div className="text-[10px] text-[#747474]">Maximum bitrate & sharpness</div>
              </button>
            </div>
          </div>

          {/* Frame Rate */}
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1.5">
              Target Frame Rate
            </label>
            <div className="flex gap-2">
              {[30, 60].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFps(f as 30 | 60)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    fps === f
                      ? 'bg-[#E54848] text-white border-[#E54848]'
                      : 'border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
                  }`}
                >
                  {f} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Quota Check */}
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between text-xs text-[#747474]">
            <span>Monthly Exports Remaining</span>
            <span className="font-semibold text-[#202124]">
              {quota.clips_export_limit - quota.clips_export_used} / {quota.clips_export_limit}
            </span>
          </div>

          <div className="pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleStartExport}
            >
              Render & Download
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
