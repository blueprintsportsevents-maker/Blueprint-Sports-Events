import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import { HeatLaneAssignment } from '../types/sports';
import {
  Layers,
  Shuffle,
  Clock,
  ArrowUpDown,
  Shield,
  Plus,
  Play,
  ClipboardList,
  Camera,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

export const HeatsLanesView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    heatAssignments,
    updateHeatAssignment,
    athletes,
    teams,
    seedHeatsForEvent,
    setActiveTab,
  } = useMeet();

  const [selectedHeatNumber, setSelectedHeatNumber] = useState<number>(1);

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Assignments for current event
  const currentEventAssignments = useMemo(
    () => heatAssignments.filter(h => h.eventId === activeEvent?.id),
    [heatAssignments, activeEvent]
  );

  // Available heat numbers
  const heatNumbers = useMemo(() => {
    const set = new Set(currentEventAssignments.map(h => h.heatNumber));
    if (set.size === 0) return [1];
    return Array.from(set).sort((a, b) => a - b);
  }, [currentEventAssignments]);

  // Current heat assignments sorted by lane
  const currentHeatLanes = useMemo(() => {
    return currentEventAssignments
      .filter(h => h.heatNumber === selectedHeatNumber)
      .sort((a, b) => a.lane - b.lane);
  }, [currentEventAssignments, selectedHeatNumber]);

  // Swap lanes helper
  const handleSwapLane = (assignmentId: string, currentLane: number, targetLane: number) => {
    const existingAtTarget = currentHeatLanes.find(h => h.lane === targetLane);
    if (existingAtTarget) {
      updateHeatAssignment(existingAtTarget.id, { lane: currentLane });
    }
    updateHeatAssignment(assignmentId, { lane: targetLane });
  };

  return (
    <div className="space-y-6">
      {/* Event Header & Heat Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{activeEvent?.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                {activeEvent?.round}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Seeding Rule: <span className="text-slate-200 font-medium">Serpentine Seeding &bull; Preferred Lanes (4, 5, 3, 6, 2, 7, 1, 8)</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => seedHeatsForEvent(activeEvent.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 shadow transition-colors cursor-pointer"
              title="Re-run automatic World Athletics seeding"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              Re-Seed Serpentine
            </button>
            <button
              onClick={() => setActiveTab('call-room')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Open Call Room
            </button>
            <button
              onClick={() => setActiveTab('photo-finish')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              Photo Finish Timing
            </button>
          </div>
        </div>

        {/* Heats Selector Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">Heats:</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {heatNumbers.map((hNum) => (
                <button
                  key={hNum}
                  onClick={() => setSelectedHeatNumber(hNum)}
                  className={`px-4 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    selectedHeatNumber === hNum
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Heat {hNum}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Qualification: <strong className="text-slate-200">{activeEvent?.qualifyingRule || 'Top 2 (Q) + 2 Fastest (q)'}</strong></span>
          </div>
        </div>
      </div>

      {/* Heat Lanes Grid / Visual Track Layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Heat {selectedHeatNumber} of {heatNumbers.length} &bull; Start Lane Draw
          </div>
          <span className="text-[11px] text-amber-400 font-mono-timing font-bold">
            {currentHeatLanes.length} Athletes On Track
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Lane</th>
                <th className="py-3 px-4 w-16 text-center">Bib</th>
                <th className="py-3 px-4">Athlete / Relay Team</th>
                <th className="py-3 px-4">Affiliated Club</th>
                <th className="py-3 px-4 text-center">Seed Time</th>
                <th className="py-3 px-4 text-center">Lane Preference</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Adjust Lane</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currentHeatLanes.map((item) => {
                const athlete = item.athleteId ? athleteMap.get(item.athleteId) : null;
                const team = athlete ? teamMap.get(athlete.teamId) : null;
                const isPreferredLane = [4, 5, 3, 6].includes(item.lane);

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isPreferredLane ? 'bg-blue-950/10' : ''
                    }`}
                  >
                    {/* Lane Number */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold font-mono-timing text-sm ${
                        isPreferredLane
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}>
                        {item.lane}
                      </span>
                    </td>

                    {/* Bib Number */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-950 text-amber-400 font-bold px-2 py-1 rounded font-mono-timing border border-slate-800 text-xs">
                        {athlete?.bib || '—'}
                      </span>
                    </td>

                    {/* Athlete Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        {athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {athlete?.category} &bull; {athlete?.gender}
                      </div>
                    </td>

                    {/* Affiliated Club */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: team?.color || '#3b82f6' }}
                        />
                        <span className="font-bold text-slate-200">{team?.shortCode}</span>
                        <span className="text-slate-400 text-[11px] truncate hidden sm:inline">
                          ({team?.name})
                        </span>
                      </div>
                    </td>

                    {/* Seed Time */}
                    <td className="py-3 px-4 text-center font-mono-timing font-bold text-blue-400">
                      {item.seedMark || 'NT'}
                    </td>

                    {/* Preferred Lane Badge */}
                    <td className="py-3 px-4 text-center">
                      {isPreferredLane ? (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                          Preferred ({item.lane})
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Outer / Inner</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={item.status || 'OK'}
                        onChange={(e) => updateHeatAssignment(item.id, { status: e.target.value as any })}
                        className={`px-2 py-1 rounded text-xs font-bold border focus:outline-none cursor-pointer ${
                          item.status === 'OK'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                            : item.status === 'DNS'
                            ? 'bg-rose-950/40 text-rose-400 border-rose-800'
                            : item.status === 'FS'
                            ? 'bg-amber-950/40 text-amber-400 border-amber-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="OK">OK (Starting)</option>
                        <option value="DNS">DNS (Did Not Start)</option>
                        <option value="DNF">DNF (Did Not Finish)</option>
                        <option value="DQ">DQ (Disqualified)</option>
                        <option value="FS">FS (False Start R16.8)</option>
                      </select>
                    </td>

                    {/* Move Lane */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <select
                          value={item.lane}
                          onChange={(e) => handleSwapLane(item.id, item.lane, Number(e.target.value))}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white cursor-pointer"
                        >
                          {Array.from({ length: activeEvent.laneCount || 8 }, (_, i) => i + 1).map(l => (
                            <option key={l} value={l}>Lane {l}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {currentHeatLanes.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    No athletes assigned to this heat yet. Click "Re-Seed Serpentine" above to assign lanes automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
