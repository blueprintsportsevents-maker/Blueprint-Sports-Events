import React from 'react';
import { MeetProvider, useMeet } from './context/MeetContext';
import { Navigation } from './components/Navigation';
import { ManagementView } from './components/ManagementView';
import { AthletesTeamsView } from './components/AthletesTeamsView';
import { EventsEntriesView } from './components/EventsEntriesView';
import { HeatsLanesView } from './components/HeatsLanesView';
import { CallRoomView } from './components/CallRoomView';
import { PhotoFinishView } from './components/PhotoFinishView';
import { ResultsView } from './components/ResultsView';
import { MedalsCertificatesView } from './components/MedalsCertificatesView';
import { TeamPointsView } from './components/TeamPointsView';
import { LiveStreamView } from './components/LiveStreamView';
import { LiveScoreboardView } from './components/LiveScoreboardView';
import { ReportsView } from './components/ReportsView';
import { SettingsBackupView } from './components/SettingsBackupView';
import { BlueprintLogo } from './components/BlueprintLogo';
import { Flame, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, meetConfig } = useMeet();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'management' && <ManagementView />}
          {activeTab === 'athletes-teams' && <AthletesTeamsView />}
          {activeTab === 'events-entries' && <EventsEntriesView />}
          {activeTab === 'heats-lanes' && <HeatsLanesView />}
          {activeTab === 'call-room' && <CallRoomView />}
          {activeTab === 'photo-finish' && <PhotoFinishView />}
          {activeTab === 'results' && <ResultsView />}
          {activeTab === 'medals-certificates' && <MedalsCertificatesView />}
          {activeTab === 'team-points' && <TeamPointsView />}
          {activeTab === 'live-stream' && <LiveStreamView />}
          {activeTab === 'live-scoreboard' && <LiveScoreboardView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsBackupView />}
        </main>
      </div>

      {/* Meet System Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-6 text-xs text-slate-500 no-print mt-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BlueprintLogo className="w-5 h-5 flex-shrink-0" variant="icon" />
            <span className="font-bold text-slate-300 font-chakra uppercase tracking-wider">
              BLUEPRINT SPORTS EVENT
            </span>
            <span>&bull;</span>
            <span>Comprehensive Track & Field Meet Management System</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              World Athletics Technical Rule 20 Compliant
            </span>
            <span>&bull;</span>
            <span className="font-mono-timing text-slate-400">FAT 1/1000s Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MeetProvider>
      <MainContent />
    </MeetProvider>
  );
}
