import React, { useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useEditorStore } from '@/stores/editorStore';
import { useSocialStore } from '@/stores/socialStore';
import { ViralityGauge } from '@/components/dashboard/ViralityGauge';
import { Button } from '@/components/common/Button';
import { formatTimecode } from '@/lib/timecode';
import {
  Folder,
  Plus,
  Video,
  Sliders,
  Send,
  Trash2,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    videos,
    clips,
    createProject,
    setActiveView,
    deleteClip,
    setUploadModalOpen,
  } = useWorkspaceStore();

  const { setActiveClip } = useEditorStore();
  const { setSelectedPostForSchedule } = useSocialStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    createProject(newProjectName);
    setNewProjectName('');
    setIsCreatingProject(false);
  };

  const filteredVideos = videos.filter((v) => {
    if (selectedProjectId !== 'all' && v.project_id !== selectedProjectId) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE]">
        <div>
          <h2 className="text-xl font-bold text-[#202124] tracking-tight">Projects & Media Library</h2>
          <p className="text-xs text-[#747474] mt-0.5">
            Organize source videos, extracted clips, and campaign folders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<Folder className="w-4 h-4" />}
            onClick={() => setIsCreatingProject(true)}
          >
            New Project Folder
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Video
          </Button>
        </div>
      </div>

      {/* New Project Inline Modal */}
      {isCreatingProject && (
        <form
          onSubmit={handleCreateProjectSubmit}
          className="bg-white p-4 rounded-2xl border border-[#E54848]/40 shadow-xs flex items-center gap-3 animate-in fade-in"
        >
          <Folder className="w-5 h-5 text-[#E54848]" />
          <input
            type="text"
            placeholder="Folder name (e.g. Masterclass Q1, Client Tech Talks)"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#EEEEEE] focus:border-[#E54848] focus:outline-none"
          />
          <Button variant="primary" size="sm" type="submit">
            Create Folder
          </Button>
          <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreatingProject(false)}>
            Cancel
          </Button>
        </form>
      )}

      {/* Project Folders Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedProjectId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedProjectId === 'all'
              ? 'bg-[#E54848] text-white shadow-xs'
              : 'bg-white border border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
          }`}
        >
          All Media ({videos.length})
        </button>

        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedProjectId === proj.id
                ? 'bg-[#E54848] text-white border-[#E54848] shadow-xs'
                : 'bg-white border-[#EEEEEE] text-[#747474] hover:bg-zinc-50'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{proj.name}</span>
          </button>
        ))}
      </div>

      {/* Section 1: Ingested Long Videos */}
      <div>
        <h3 className="text-sm font-semibold text-[#202124] mb-3">Source Long Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-2xl p-4 border border-[#EEEEEE] hover:border-zinc-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Video className="w-4 h-4 text-zinc-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#202124] line-clamp-1">{vid.title}</h4>
                      <span className="text-[10px] text-[#747474] font-mono">
                        {formatTimecode(vid.duration_seconds)} • {vid.resolution_width}x{vid.resolution_height}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    Transcribed
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#747474] font-medium">
                  {vid.clips_count} clips generated
                </span>
                <button
                  onClick={() => setActiveView('studio')}
                  className="text-xs font-semibold text-[#E54848] hover:underline cursor-pointer"
                >
                  Generate More Clips $\rightarrow$
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Extracted Highlight Clips */}
      <div className="pt-4">
        <h3 className="text-sm font-semibold text-[#202124] mb-3">Extracted Highlight Clips ({clips.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="group bg-white rounded-2xl border border-[#EEEEEE] hover:border-[#E54848]/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  className="relative aspect-[16/10] bg-black overflow-hidden cursor-pointer"
                  onClick={() => {
                    setActiveClip(clip);
                    setActiveView('studio');
                  }}
                >
                  <img
                    src={clip.thumbnail_url}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                    <span className="text-xs font-semibold text-white line-clamp-1 drop-shadow-sm">
                      {clip.hook_sentence}
                    </span>
                  </div>
                  <span className="absolute top-2 right-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs">
                    {clip.duration_seconds.toFixed(0)}s
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <ViralityGauge score={clip.virality_score} size="sm" />
                    <span className="text-[10px] text-zinc-400 font-medium">9:16 Vertical</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#202124] line-clamp-1">{clip.title}</h4>
                  <p className="text-xs text-[#747474] line-clamp-2 mt-1">{clip.summary}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#EEEEEE] flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    onClick={() => {
                      setActiveClip(clip);
                      setActiveView('studio');
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-[#202124] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedPostForSchedule({ clipId: clip.id })}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#E54848] hover:bg-[#C93636] text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
                <button
                  onClick={() => deleteClip(clip.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete clip"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
