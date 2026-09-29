import React, { useState, useEffect } from 'react';
import { useMeet } from '../context/MeetContext';
import { BlueprintLogo } from './BlueprintLogo';
import {
  Trophy,
  Users,
  Calendar,
  Layers,
  ClipboardCheck,
  Camera,
  Award,
  BarChart3,
  Tv,
  Monitor,
  FileText,
  Settings,
  Flame,
  Activity,
  ChevronDown
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent?: string;
}

export const Navigation: React.FC = () => {
  const { meetConfig, events, activeEventId, setActiveEventId, activeTab, setActiveTab } = useMeet();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs: TabItem[] = [
    { id: 'management', label: 'Management', icon: Calendar },
    { id: 'athletes-teams', label: 'Athletes & Teams', icon: Users },
    { id: 'events-entries', label: 'Events & Entries', icon: Layers },
    { id: 'heats-lanes', label: 'Heats & Lanes', icon: Layers },
    { id: 'call-room', label: 'Start Lists / Call Room', icon: ClipboardCheck, badge: 'Active' },
    { id: 'photo-finish', label: 'Photo Finish', icon: Camera, badge: 'FAT' },
    { id: 'results', label: 'Results', icon: Activity },
    { id: 'medals-certificates', label: 'Medals & Certificates', icon: Award },
    { id: 'team-points', label: 'Team Points', icon: BarChart3 },
    { id: 'live-stream', label: 'Live Stream', icon: Tv, badge: 'ON AIR' },
    { id: 'live-scoreboard', label: 'Live Scoreboard', icon: Monitor },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Backup & Settings', icon: Settings }
  ];

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 no-print">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center relative cursor-pointer group">
            <BlueprintLogo className="w-10 h-10 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-transform duration-200 group-hover:scale-105" variant="badge" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-chakra font-black tracking-wider text-base text-white uppercase flex items-center gap-1.5">
                BLUEPRINT <span className="text-sky-400">SPORTS EVENT</span>
              </span>
              <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2 py-0.5 rounded border border-sky-500/20">
                PRO MEET SYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-sm sm:max-w-md">
              {meetConfig.name} &bull; {meetConfig.venueName}
            </p>
          </div>
        </div>

        {/* Global Live Bar Status */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Active Event Dropdown Switcher */}
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400 mr-2 uppercase text-[10px] font-bold tracking-wider">Event:</span>
            <select
              value={activeEventId}
              onChange={(e) => setActiveEventId(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id} className="bg-slate-900 text-white">
                  {evt.name} ({evt.round}) - {evt.scheduledTime}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
          </div>

          {/* Master Clock */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1 font-mono-timing text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 text-[10px] uppercase font-bold">FAT CLOCK</span>
            <span className="text-amber-400 font-bold ml-1">{currentTime || '00:00:00'}</span>
          </div>

          {/* Live Stream Indicator */}
          <button
            onClick={() => setActiveTab('live-stream')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>BROADCAST</span>
          </button>
        </div>
      </div>

      {/* Navigation Modules Bar */}
      <nav className="px-2 overflow-x-auto scrollbar-none flex items-center gap-1 border-t border-slate-800/60 bg-slate-900/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-500 text-white bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    tab.badge === 'ON AIR'
                      ? 'bg-rose-600 text-white'
                      : tab.badge === 'FAT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-600/30 text-blue-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
