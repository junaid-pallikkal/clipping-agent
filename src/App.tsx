import React from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useSocialStore } from '@/stores/socialStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

// Views
import { DashboardView } from '@/views/DashboardView';
import { StudioView } from '@/views/StudioView';
import { ProjectsView } from '@/views/ProjectsView';
import { ContentCalendarView } from '@/components/calendar/ContentCalendarView';
import { SocialView } from '@/views/SocialView';
import { AutoPilotView } from '@/views/AutoPilotView';
import { AnalyticsView } from '@/views/AnalyticsView';
import { SettingsView } from '@/views/SettingsView';

// Modals
import { QuickModeModal } from '@/components/dashboard/QuickModeModal';
import { VideoUploadModal } from '@/components/dashboard/VideoUploadModal';
import { ScheduleModal } from '@/components/calendar/ScheduleModal';
import { UpgradeModal } from '@/components/commercial/UpgradeModal';

export const App: React.FC = () => {
  const { activeView } = useWorkspaceStore();
  const { selectedPostForSchedule, setSelectedPostForSchedule } = useSocialStore();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'studio':
        return <StudioView />;
      case 'projects':
        return <ProjectsView />;
      case 'calendar':
        return <ContentCalendarView />;
      case 'social':
        return <SocialView />;
      case 'autopilot':
        return <AutoPilotView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row antialiased selection:bg-[#FFF1F0] selection:text-[#E54848]">
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {renderActiveView()}
        </main>

        {/* Mobile-First Bottom Nav (Home | Create | Projects | Calendar | Profile) */}
        <MobileNav />
      </div>

      {/* Global Modals & Dialogs */}
      <QuickModeModal />
      <VideoUploadModal />
      <UpgradeModal />
      
      {selectedPostForSchedule && (
        <ScheduleModal
          isOpen={Boolean(selectedPostForSchedule)}
          onClose={() => setSelectedPostForSchedule(null)}
          clipId={selectedPostForSchedule.clipId}
        />
      )}
    </div>
  );
};
