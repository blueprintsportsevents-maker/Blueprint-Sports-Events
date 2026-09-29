import React, { useState, useEffect, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  Tv,
  Play,
  Square,
  RotateCcw,
  Volume2,
  Maximize2,
  Eye,
  Sliders,
  Sparkles,
  Trophy,
  Flame,
  Wind
} from 'lucide-react';

export const LiveStreamView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    heatAssignments,
    athletes,
    teams,
    meetConfig,
  } = useMeet();

  const [activeGraphic, setActiveGraphic] = useState<'lineup' | 'clock' | 'winner' | 'lowerThird'>('clock');
  const [backdropMode, setBackdropMode] = useState<'stadium' | 'green' | 'dark'>('stadium');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Current heat lanes
  const currentLanes = useMemo(() => {
    return heatAssignments
      .filter(h => h.eventId === activeEvent?.id && h.heatNumber === 1)
      .sort((a, b) => a.lane - b.lane);
  }, [heatAssignments, activeEvent]);

  // Winner
  const winner = useMemo(() => {
    const sorted = [...currentLanes].filter(l => l.rank === 1);
    return sorted.length > 0 ? sorted[0] : currentLanes[0];
  }, [currentLanes]);

  const winnerAthlete = winner?.athleteId ? athleteMap.get(winner.athleteId) : null;
  const winnerTeam = winnerAthlete ? teamMap.get(winnerAthlete.teamId) : null;

  // Running race stopwatch
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      const startTime = Date.now() - elapsedMs;
      interval = setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatRaceClock = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    const mins = Math.floor(totalSecs / 60);
    const remSecs = totalSecs % 60;
    if (mins > 0) {
      return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}.${hundredths < 10 ? '0' : ''}${hundredths}`;
    }
    return `${remSecs}.${hundredths < 10 ? '0' : ''}${hundredths}`;
  };

  const handleStartClock = () => setIsRunning(true);
  const handleStopClock = () => setIsRunning(false);
  const handleResetClock = () => {
    setIsRunning(false);
    setElapsedMs(0);
  };

  return (
    <div className="space-y-6">
      {/* Broadcaster Controller Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Tv className="w-6 h-6 text-rose-500 animate-pulse" />
              <h2 className="text-xl font-bold text-white">Live Stream & Broadcaster Overlay Package</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold uppercase border border-rose-500/30">
                1080p 60FPS Broadcast Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              TV broadcast graphics generator for OBS Studio, vMix, and stadium jumbotron overlays
            </p>
          </div>

          {/* Graphics Selector Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveGraphic('clock')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeGraphic === 'clock' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Race Clock Bug
              </button>
              <button
                onClick={() => setActiveGraphic('lineup')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeGraphic === 'lineup' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lane Lineup
              </button>
              <button
                onClick={() => setActiveGraphic('winner')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeGraphic === 'winner' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Winner Banner
              </button>
              <button
                onClick={() => setActiveGraphic('lowerThird')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeGraphic === 'lowerThird' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lower Third
              </button>
            </div>
          </div>
        </div>

        {/* Master Clock Gun Trigger & Studio Canvas Settings */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold text-slate-400">Race Gun Clock:</span>
            <div className="text-2xl font-mono-timing font-black text-amber-400 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 led-glow">
              {formatRaceClock(elapsedMs)}
            </div>

            <div className="flex items-center gap-1.5">
              {!isRunning ? (
                <button
                  onClick={handleStartClock}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Gun</span>
                </button>
              ) : (
                <button
                  onClick={handleStopClock}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Finish Stop</span>
                </button>
              )}

              <button
                onClick={handleResetClock}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
                title="Reset Race Clock"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Backdrop Mode for OBS Chroma Keying */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Feed Canvas:</span>
            <button
              onClick={() => setBackdropMode('stadium')}
              className={`px-2.5 py-1 text-xs font-bold rounded ${
                backdropMode === 'stadium' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Stadium Feed
            </button>
            <button
              onClick={() => setBackdropMode('green')}
              className={`px-2.5 py-1 text-xs font-bold rounded ${
                backdropMode === 'green' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400'
              }`}
              title="Green screen for transparent OBS Chroma Keying"
            >
              OBS Chroma Green
            </button>
            <button
              onClick={() => setBackdropMode('dark')}
              className={`px-2.5 py-1 text-xs font-bold rounded ${
                backdropMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Dark Studio
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Preview Screen (16:9 Aspect Ratio) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-bold text-white uppercase tracking-wider">LIVE PROGRAM OUT</span>
            <span>&bull;</span>
            <span className="text-slate-400 font-mono-timing">CH 1: Track Master</span>
          </div>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Preview</span>
          </button>
        </div>

        {/* 16:9 Viewport */}
        <div
          className={`relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 select-none shadow-inner ${
            backdropMode === 'green'
              ? 'bg-[#00b140]'
              : backdropMode === 'dark'
              ? 'bg-slate-950'
              : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950'
          }`}
        >
          {/* Simulated stadium track visual texture if stadium mode */}
          {backdropMode === 'stadium' && (
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center">
              <div className="text-center opacity-30">
                <div className="text-6xl font-black text-slate-700 uppercase tracking-widest font-chakra">
                  BLUEPRINT STADIUM
                </div>
                <div className="text-sm font-bold text-slate-600 tracking-wider">
                  HOMESTRETCH FINISH LINE CAMERA
                </div>
              </div>
            </div>
          )}

          {/* TOP RIGHT / TOP LEFT: TV BUG & RUNNING CLOCK */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-1.5 px-3 flex items-center gap-2.5 shadow-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-black text-blue-400 tracking-widest leading-none">
                  BLUEPRINT SPORTS
                </div>
                <div className="text-xs font-bold text-white leading-tight">
                  {activeEvent?.name}
                </div>
              </div>
            </div>

            {/* Live Clock Badge */}
            <div className="bg-black/90 backdrop-blur-md border border-amber-500/80 rounded-lg p-1.5 px-3 flex items-center gap-2 shadow-2xl">
              <span className="text-[10px] uppercase font-bold text-amber-400">TIME</span>
              <span className="text-base font-black font-mono-timing text-amber-300 led-glow">
                {formatRaceClock(elapsedMs)}
              </span>
            </div>
          </div>

          {/* TOP RIGHT: WIND GAUGE BUG */}
          <div className="absolute top-4 right-4 z-30">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-1.5 px-3 flex items-center gap-2 shadow-2xl">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold text-slate-400">WIND</span>
              <span className="text-xs font-black font-mono-timing text-white">
                +1.4 m/s
              </span>
            </div>
          </div>

          {/* GRAPHIC OVERLAYS */}

          {/* 1. LANE LINEUP TICKER (Bottom Full-Width or Vertical Lineup) */}
          {activeGraphic === 'lineup' && (
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
              <div className="bg-blue-600 px-4 py-1.5 flex items-center justify-between text-white text-xs font-black tracking-wider uppercase">
                <span>START LIST &bull; {activeEvent?.name} ({activeEvent?.round})</span>
                <span className="text-blue-100 font-mono-timing">HEAT 1 OF 1</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-slate-800 p-2">
                {currentLanes.map((item) => {
                  const ath = item.athleteId ? athleteMap.get(item.athleteId) : null;
                  const team = ath ? teamMap.get(ath.teamId) : null;
                  return (
                    <div key={item.id} className="p-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono-timing font-black text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          L{item.lane}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          #{ath?.bib || '—'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {ath ? `${ath.firstName.charAt(0)}. ${ath.lastName}` : 'Runner'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: team?.color || '#3b82f6' }}
                        />
                        <span>{team?.shortCode}</span>
                      </div>
                      <div className="text-[10px] font-mono-timing text-blue-400 font-semibold">
                        PB: {item.seedMark}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. WINNER BANNER POPUP */}
          {activeGraphic === 'winner' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-center">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  EVENT WINNER &bull; GOLD MEDAL
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {winnerAthlete ? `${winnerAthlete.firstName} ${winnerAthlete.lastName}` : 'Champion Sprinter'}
                  </h2>
                  <div className="text-sm font-bold text-blue-400 mt-1">
                    {winnerTeam?.name} ({winnerTeam?.shortCode})
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-around">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">OFFICIAL TIME</span>
                    <div className="text-3xl font-black font-mono-timing text-amber-300 led-glow">
                      {winner?.time || '9.84'}s
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-800"></div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">WIND</span>
                    <div className="text-lg font-bold font-mono-timing text-white">
                      +1.4 m/s
                    </div>
                  </div>
                </div>

                <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>NEW BLUEPRINT MEET RECORD (MR)</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. LOWER THIRD STRAP */}
          {activeGraphic === 'lowerThird' && (
            <div className="absolute bottom-6 left-6 max-w-md w-full z-30 bg-slate-950/95 backdrop-blur-md border-l-4 border-blue-500 border-y border-r border-slate-800 rounded-r-xl p-4 shadow-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-400">
                  {meetConfig.name}
                </span>
                <span className="text-[10px] font-mono-timing text-amber-400 font-bold">
                  {activeEvent?.scheduledTime}
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{activeEvent?.name}</h3>
              <p className="text-xs text-slate-400">
                {activeEvent?.round} &bull; World Athletics Continental Tour Gold
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
