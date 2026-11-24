import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { getActiveSubtitleBatch } from '@/lib/subtitles';
import { formatTimecode } from '@/lib/timecode';
import { extractYouTubeId } from '@/lib/youtube';
import { YoutubeIcon } from '@/components/common/PlatformIcons';
import { Play, Pause, RotateCcw, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';

export const VideoPlayer: React.FC = () => {
  const {
    activeClip,
    currentTime,
    duration,
    isPlaying,
    playbackRate,
    setCurrentTime,
    setIsPlaying,
    togglePlayPause,
    setPlaybackRate,
    setCropCenterX,
  } = useEditorStore();

  const { transcripts, videos } = useWorkspaceStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parentVideo = activeClip ? videos.find((v) => v.id === activeClip.video_asset_id) : null;
  const ytId = extractYouTubeId(activeClip?.video_url || '') || (parentVideo ? extractYouTubeId(parentVideo.source_url || '') : null);
  const [previewMode, setPreviewMode] = useState<'studio' | 'youtube'>('studio');

  // Sync video element with store play state
  useEffect(() => {
    if (!videoRef.current || previewMode === 'youtube') return;
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, setIsPlaying, previewMode]);

  // Sync playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync seek if time drifted significantly
  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeClip) return;
    const current = videoRef.current.currentTime;
    
    // Loop playback within clip boundaries
    if (current > activeClip.end_time) {
      videoRef.current.currentTime = activeClip.start_time;
      setCurrentTime(0);
      return;
    }
    
    const relativeTime = Math.max(0, current - activeClip.start_time);
    setCurrentTime(relativeTime);
  };

  const handleSeek = (newRelativeTime: number) => {
    if (!videoRef.current || !activeClip) return;
    const absoluteTime = activeClip.start_time + newRelativeTime;
    videoRef.current.currentTime = absoluteTime;
    setCurrentTime(newRelativeTime);
  };

  // Keyboard shortcut for space bar play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  if (!activeClip) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-2xl text-zinc-500 text-sm">
        No clip selected for preview
      </div>
    );
  }

  // Get active transcript word cues for live subtitle rendering
  const transcript = transcripts[activeClip.video_asset_id];
  const activeWordBatch = transcript
    ? getActiveSubtitleBatch(transcript.words, activeClip.start_time + currentTime, activeClip.subtitles.words_per_batch)
    : null;

  // Aspect ratio dimension styling
  const aspectClass = {
    '9:16': 'aspect-[9/16] max-h-[580px] w-auto',
    '1:1': 'aspect-square max-h-[460px] w-auto',
    '16:9': 'aspect-video max-h-[420px] w-full',
    '4:5': 'aspect-[4/5] max-h-[500px] w-auto',
  }[activeClip.aspect_ratio];

  const sub = activeClip.subtitles;

  // Resolved video URL with reliable fallback
  const resolvedVideoSrc = activeClip.video_url && !activeClip.video_url.includes('ForBigger') && !activeClip.video_url.includes('youtube.com') && !activeClip.video_url.includes('youtu.be')
    ? activeClip.video_url
    : '/sample-clip.mp4';

  return (
    <div className="flex flex-col items-center justify-center w-full select-none">
      {/* Source Preview Switcher for YouTube videos */}
      {ytId && (
        <div className="flex items-center gap-1.5 mb-2.5 bg-zinc-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setPreviewMode('studio')}
            className={clsx(
              'px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              previewMode === 'studio' ? 'bg-white text-[#E54848] shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Studio Reframe</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewMode('youtube');
              setIsPlaying(false);
            }}
            className={clsx(
              'px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              previewMode === 'youtube' ? 'bg-[#E54848] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <YoutubeIcon className="w-3.5 h-3.5" />
            <span>Watch Original YouTube</span>
          </button>
        </div>
      )}

      {/* Video Viewport Frame */}
      <div
        ref={containerRef}
        className={clsx(
          'relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex items-center justify-center',
          aspectClass
        )}
      >
        {previewMode === 'youtube' && ytId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&start=${Math.floor(activeClip.start_time)}&end=${Math.ceil(activeClip.end_time)}&controls=1&rel=0`}
            title={activeClip.title}
            className="w-full h-full rounded-2xl border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={resolvedVideoSrc}
              className="h-full w-full object-cover"
              style={{
                objectPosition: `${activeClip.crop_center_x * 100}% center`,
              }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = activeClip.start_time;
                }
              }}
              onError={(e) => {
                // Graceful fallback to local sample clip
                if (e.currentTarget.src !== window.location.origin + '/sample-clip.mp4') {
                  e.currentTarget.src = '/sample-clip.mp4';
                }
              }}
              playsInline
            />

            {/* Dynamic Karaoke Subtitle Overlay */}
            {activeWordBatch && (
              <div
                className="absolute left-0 right-0 px-4 text-center pointer-events-none transition-all duration-75"
                style={{ top: `${sub.position_y_percent}%` }}
              >
                <div
                  className="inline-block max-w-[90%] leading-tight drop-shadow-md"
                  style={{
                    fontFamily: sub.font_family,
                    fontSize: `${sub.font_size}px`,
                    textTransform: sub.uppercase ? 'uppercase' : 'none',
                    WebkitTextStroke: `${sub.stroke_width}px ${sub.stroke_color}`,
                    paintOrder: 'stroke fill',
                  }}
                >
                  {activeWordBatch.batchWords.map((w, idx) => {
                    const isCurrent = idx === activeWordBatch.activeWordIndex;
                    return (
                      <span
                        key={idx}
                        className={clsx(
                          'inline-block mx-1 transition-transform',
                          isCurrent && sub.active_animation === 'bounce' && 'scale-110 font-black',
                          isCurrent && sub.active_animation === 'zoom' && 'scale-115 font-black'
                        )}
                        style={{
                          color: isCurrent ? sub.highlight_color : sub.font_color,
                        }}
                      >
                        {w.word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Crop Anchor Slider (Visible in 9:16 reframe mode) */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto opacity-0 hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[11px] text-white">
              <span>Speaker Framing:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={activeClip.crop_center_x}
                onChange={(e) => setCropCenterX(parseFloat(e.target.value))}
                className="w-28 accent-[#E54848] cursor-pointer"
              />
              <span>{Math.round(activeClip.crop_center_x * 100)}%</span>
            </div>

            {/* Big Center Play/Pause Trigger */}
            <button
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/25 transition-all text-white group cursor-pointer"
            >
              {!isPlaying && (
                <div className="w-14 h-14 rounded-full bg-[#E54848] text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              )}
            </button>
          </>
        )}
      </div>

      {/* Playback Controls Toolbar */}
      <div className="w-full max-w-md mt-3 px-2 flex items-center justify-between text-xs text-[#202124]">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-[#202124] cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => handleSeek(0)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 cursor-pointer"
            title="Restart clip"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-[11px] text-[#747474] ml-1">
            {formatTimecode(currentTime)} / {formatTimecode(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex rounded-md bg-zinc-100 p-0.5 text-[10px] font-semibold">
            {[1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  playbackRate === rate ? 'bg-white text-[#202124] shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 font-medium text-zinc-600">
            {activeClip.aspect_ratio}
          </span>
        </div>
      </div>
    </div>
  );
};
