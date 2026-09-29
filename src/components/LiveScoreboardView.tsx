import React, { useState, useEffect, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  Monitor,
  Smartphone,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Wind,
  Trophy,
  RefreshCw
} from 'lucide-react';

export const LiveScoreboardView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    heatAssignments,
    athletes,
    teams,
    meetConfig,
  } = useMeet();

  const [viewMode, setViewMode] = useState<'jumbotron' | 'spectator'>('jumbotron');
  const [autoCycle, setAutoCycle] = useState<boolean>(true);
  const [cycleIntervalSec, setCycleIntervalSec] = useState<number>(10);
  const [countdown, setCountdown] = useState<number>(cycleIntervalSec);

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Current assignments sorted by rank or lane
  const currentEventAssignments = useMemo(() => {
    const list = heatAssignments.filter(h => h.eventId === activeEvent?.id);
    return list.sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank) return -1;
      if (b.rank) return 1;
      return a.lane - b.lane;
    });
  }, [heatAssignments, activeEvent]);

  // Auto cycling through events
  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Switch to next event
          const currentIndex = events.findIndex(e => e.id === activeEventId);
          const nextIndex = (currentIndex + 1) % events.length;
          setActiveEventId(events[nextIndex].id);
          return cycleIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [autoCycle, cycleIntervalSec, events, activeEventId, setActiveEventId]);

  const handleNextEvent = () => {
    const currentIndex = events.findIndex(e => e.id === activeEventId);
    const nextIndex = (currentIndex + 1) % events.length;
    setActiveEventId(events[nextIndex].id);
    setCountdown(cycleIntervalSec);
  };

  const handlePrevEvent = () => {
    const currentIndex = events.findIndex(e => e.id === activeEventId);
    const prevIndex = (currentIndex - 1 + events.length) % events.length;
    setActiveEventId(events[prevIndex].id);
    setCountdown(cycleIntervalSec);
  };

  const isOfficial = activeEvent?.status === 'Official';

  return (
    <div className="space-y-6">
      {/* Scoreboard Control Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Live Stadium Scoreboard</h2>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('jumbotron')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold cursor-pointer ${
                viewMode === 'jumbotron' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Jumbotron LED</span>
            </button>
            <button
              onClick={() => setViewMode('spectator')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold cursor-pointer ${
                viewMode === 'spectator' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Spectator Mobile</span>
            </button>
          </div>
        </div>

        {/* Auto Cycle Controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAutoCycle(!autoCycle)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
              autoCycle
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {autoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto Cycle ({countdown}s)</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevEvent}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
              title="Previous Event"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextEvent}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
              title="Next Event"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* JUMBOTRON LED VIEW */}
      {viewMode === 'jumbotron' && (
        <div className="bg-black border-4 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Top Jumbotron LED Header */}
          <div className="border-b-2 border-amber-500/40 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-mono-timing font-bold tracking-widest text-amber-500/80">
                {meetConfig.name} &bull; {meetConfig.venueName}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-chakra tracking-wider text-amber-400 uppercase led-glow mt-1">
                {activeEvent?.name}
              </h1>
              <div className="text-sm font-bold text-slate-300 flex items-center gap-3 mt-1">
                <span className="uppercase text-amber-300 font-mono-timing">{activeEvent?.round}</span>
                <span>&bull;</span>
                <span className="text-cyan-400 font-mono-timing flex items-center gap-1">
                  <Wind className="w-4 h-4" /> WIND: +1.4 m/s
                </span>
                <span>&bull;</span>
                <span className="font-mono-timing text-slate-400">MR: {activeEvent?.meetRecord?.mark || '—'}</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded font-black font-mono-timing text-xs uppercase tracking-wider ${
                  isOfficial
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 animate-pulse'
                }`}
              >
                {isOfficial ? 'OFFICIAL RESULT' : 'LIVE / UNOFFICIAL'}
              </span>
            </div>
          </div>

          {/* LED Table Rows */}
          <div className="divide-y divide-slate-900 overflow-x-auto">
            <div className="grid grid-cols-12 py-2 px-3 text-xs font-black font-mono-timing text-amber-500/60 uppercase tracking-wider">
              <div className="col-span-1 text-center">PL</div>
              <div className="col-span-1 text-center">LN</div>
              <div className="col-span-1 text-center">BIB</div>
              <div className="col-span-4">ATHLETE</div>
              <div className="col-span-2">TEAM</div>
              <div className="col-span-2 text-right">TIME</div>
              <div className="col-span-1 text-center">QUAL</div>
            </div>

            {currentEventAssignments.map((item) => {
              const ath = item.athleteId ? athleteMap.get(item.athleteId) : null;
              const team = ath ? teamMap.get(ath.teamId) : null;
              const isWinner = item.rank === 1;

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 items-center py-3.5 px-3 text-sm font-mono-timing transition-colors ${
                    isWinner
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'hover:bg-slate-900/60 text-slate-100'
                  }`}
                >
                  {/* Place */}
                  <div className="col-span-1 text-center font-black text-base">
                    {item.rank ? (
                      <span className={item.rank === 1 ? 'text-amber-400 led-glow' : 'text-slate-300'}>
                        {item.rank}
                      </span>
                    ) : (
                      <span className="text-slate-700">—</span>
                    )}
                  </div>

                  {/* Lane */}
                  <div className="col-span-1 text-center text-slate-400 font-bold">
                    {item.lane}
                  </div>

                  {/* Bib */}
                  <div className="col-span-1 text-center text-amber-400 font-bold">
                    {ath?.bib || '—'}
                  </div>

                  {/* Athlete Name */}
                  <div className="col-span-4 font-black uppercase text-white truncate text-base">
                    {ath ? `${ath.firstName.charAt(0)}. ${ath.lastName}` : 'Runner'}
                  </div>

                  {/* Team */}
                  <div className="col-span-2 font-bold text-cyan-400 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: team?.color || '#3b82f6' }}
                    />
                    <span>{team?.shortCode}</span>
                  </div>

                  {/* Time / Mark */}
                  <div className="col-span-2 text-right font-black text-lg text-amber-400 led-glow">
                    {item.time ? `${item.time}` : '—'}
                  </div>

                  {/* Qualification Code */}
                  <div className="col-span-1 text-center">
                    {item.qualificationCode ? (
                      <span className="bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black text-xs">
                        {item.qualificationCode}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Jumbotron Bottom Ticker */}
          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono-timing text-slate-500">
            <span>TIMING SYSTEM: FULLY AUTOMATIC TIMING (FAT) 1/1000s</span>
            <span>NEXT EVENT IN: {countdown}s</span>
          </div>
        </div>
      )}

      {/* MOBILE SPECTATOR VIEW */}
      {viewMode === 'spectator' && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="text-center pb-2 border-b border-slate-800">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
              SPECTATOR LIVE APP &bull; {meetConfig.venueName}
            </span>
            <h3 className="text-base font-bold text-white mt-1">{activeEvent?.name}</h3>
            <div className="text-xs text-slate-400 mt-0.5">
              {activeEvent?.round} &bull; {activeEvent?.status}
            </div>
          </div>

          <div className="space-y-2">
            {currentEventAssignments.map((item) => {
              const ath = item.athleteId ? athleteMap.get(item.athleteId) : null;
              const team = ath ? teamMap.get(ath.teamId) : null;
              return (
                <div
                  key={item.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 font-mono-timing font-bold text-sm text-slate-300">
                      {item.rank || `L${item.lane}`}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs">
                        {ath ? `${ath.firstName} ${ath.lastName}` : 'Athlete'}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: team?.color || '#3b82f6' }}
                        />
                        <span>{team?.name}</span>
                        <span>&bull;</span>
                        <span className="text-slate-500">Bib #{ath?.bib}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black font-mono-timing text-amber-400">
                      {item.time ? `${item.time}s` : 'NT'}
                    </div>
                    {item.qualificationCode && (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Qual: {item.qualificationCode}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
