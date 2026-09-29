import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import { HeatLaneAssignment, SportEvent } from '../types/sports';
import {
  Activity,
  Award,
  CheckCircle,
  Wind,
  Trophy,
  Flame,
  AlertCircle,
  Save,
  Lock,
  Unlock,
  Share2,
  Tv,
  Printer
} from 'lucide-react';

export const ResultsView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    heatAssignments,
    updateHeatAssignment,
    updateEvent,
    athletes,
    teams,
    meetConfig,
    setActiveTab,
  } = useMeet();

  const [filterHeat, setFilterHeat] = useState<number>(1);
  const [windInput, setWindInput] = useState<number>(1.4);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Current assignments for this event
  const currentEventAssignments = useMemo(
    () => heatAssignments.filter(h => h.eventId === activeEvent?.id),
    [heatAssignments, activeEvent]
  );

  // Available heats
  const heatNumbers = useMemo(() => {
    const set = new Set(currentEventAssignments.map(h => h.heatNumber));
    if (set.size === 0) return [1];
    return Array.from(set).sort((a, b) => a - b);
  }, [currentEventAssignments]);

  const currentHeatAssignments = useMemo(() => {
    return currentEventAssignments.filter(h => h.heatNumber === filterHeat);
  }, [currentEventAssignments, filterHeat]);

  // Auto calculate ranks and qualifiers
  const handleCalculateRanks = () => {
    if (!activeEvent) return;
    const isField = activeEvent.type === 'field';

    // Separate valid times from DNS/DNF/DQ
    const valid = currentEventAssignments.filter(h => h.status === 'OK' && h.time && h.time.trim() !== '');
    const nonValid = currentEventAssignments.filter(h => h.status !== 'OK' || !h.time || h.time.trim() === '');

    // Sort valid
    valid.sort((a, b) => {
      const valA = parseFloat(a.time!) || 999;
      const valB = parseFloat(b.time!) || 999;
      return isField ? valB - valA : valA - valB;
    });

    const mrThreshold = activeEvent.meetRecord ? parseFloat(activeEvent.meetRecord.mark) : null;

    // Apply ranking and Q/q
    const autoQualifiers = activeEvent.autoQualifiersPerHeat || 2;
    const fastestQualifiers = activeEvent.fastestQualifiers || 2;

    valid.forEach((assign, idx) => {
      const rank = idx + 1;
      let qCode: 'Q' | 'q' | '' = '';
      if (idx < autoQualifiers) {
        qCode = 'Q';
      } else if (idx < autoQualifiers + fastestQualifiers) {
        qCode = 'q';
      }

      const markVal = parseFloat(assign.time!);
      let isNewMR = false;
      if (mrThreshold) {
        isNewMR = isField ? markVal > mrThreshold : markVal < mrThreshold;
      }

      updateHeatAssignment(assign.id, {
        rank,
        qualificationCode: qCode,
        wind: windInput,
        windAssisted: windInput > 2.0,
        judgeNotes: isNewMR ? 'NEW MEET RECORD!' : assign.judgeNotes
      });
    });

    nonValid.forEach(assign => {
      updateHeatAssignment(assign.id, {
        rank: undefined,
        qualificationCode: ''
      });
    });

    setSaveAlert('Ranks and Qualifiers (Q/q) calculated and updated!');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  const handleToggleOfficial = () => {
    if (!activeEvent) return;
    const nextStatus = activeEvent.status === 'Official' ? 'In Progress' : 'Official';
    updateEvent(activeEvent.id, { status: nextStatus });
  };

  const isOfficial = activeEvent?.status === 'Official';

  // Sorted list for display: Ranked first, then unranked
  const sortedDisplayAssignments = useMemo(() => {
    return [...currentHeatAssignments].sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank) return -1;
      if (b.rank) return 1;
      return a.lane - b.lane;
    });
  }, [currentHeatAssignments]);

  return (
    <div className="space-y-6">
      {/* Event Header & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">{activeEvent?.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                {activeEvent?.round}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  isOfficial
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {activeEvent?.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Timing: <span className="text-slate-200">{meetConfig.timingSystem}</span> &bull; Wind limit: +2.0 m/s &bull; Auto-Rankings & Qualifiers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCalculateRanks}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              Compute Ranks & Q/q
            </button>

            <button
              onClick={handleToggleOfficial}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow transition-colors cursor-pointer ${
                isOfficial
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isOfficial ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {isOfficial ? 'Results Official (Locked)' : 'Publish as Official'}
            </button>

            <button
              onClick={() => setActiveTab('medals-certificates')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Podium
            </button>
          </div>
        </div>

        {/* Heat Selector & Wind Settings */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">Heat:</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {heatNumbers.map((hNum) => (
                <button
                  key={hNum}
                  onClick={() => setFilterHeat(hNum)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    filterHeat === hNum
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Heat {hNum}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-[10px] font-bold">WIND READING:</span>
              <input
                type="number"
                step="0.1"
                value={windInput}
                onChange={(e) => setWindInput(parseFloat(e.target.value) || 0)}
                className="w-14 bg-transparent text-amber-300 font-bold font-mono-timing focus:outline-none"
              />
              <span className="text-slate-400 text-[10px]">m/s</span>
              {windInput > 2.0 && (
                <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-1.5 rounded">
                  Wind-Assisted [w]
                </span>
              )}
            </div>
          </div>
        </div>

        {saveAlert && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{saveAlert}</span>
          </div>
        )}
      </div>

      {/* Official Results Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <span>Official Classification & Time Records</span>
            {activeEvent?.meetRecord && (
              <span className="text-amber-400 text-[11px] font-mono-timing font-bold">
                (MR: {activeEvent.meetRecord.mark})
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {sortedDisplayAssignments.filter(s => s.rank).length} of {sortedDisplayAssignments.length} Marks Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-14 text-center">Place</th>
                <th className="py-3 px-4 w-12 text-center">Lane</th>
                <th className="py-3 px-4 w-14 text-center">Bib</th>
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Affiliated Team</th>
                <th className="py-3 px-4 text-center">Reaction</th>
                <th className="py-3 px-4 text-center">Official Time / Mark</th>
                <th className="py-3 px-4 text-center">Wind</th>
                <th className="py-3 px-4 text-center">Qual.</th>
                <th className="py-3 px-4">Records & Notes</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedDisplayAssignments.map((item) => {
                const athlete = item.athleteId ? athleteMap.get(item.athleteId) : null;
                const team = athlete ? teamMap.get(athlete.teamId) : null;
                const isPodium = item.rank && item.rank <= 3;
                const isWinner = item.rank === 1;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isWinner
                        ? 'bg-amber-950/20'
                        : isPodium
                        ? 'bg-blue-950/15'
                        : ''
                    }`}
                  >
                    {/* Place / Rank */}
                    <td className="py-3 px-4 text-center">
                      {item.rank ? (
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold font-mono-timing text-sm ${
                            item.rank === 1
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                              : item.rank === 2
                              ? 'bg-slate-300 text-slate-950 font-black'
                              : item.rank === 3
                              ? 'bg-amber-700 text-white font-black'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.rank}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono-timing">—</span>
                      )}
                    </td>

                    {/* Lane */}
                    <td className="py-3 px-4 text-center font-mono-timing font-bold text-slate-400">
                      {item.lane}
                    </td>

                    {/* Bib */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded font-mono-timing text-xs border border-slate-800">
                        {athlete?.bib || '—'}
                      </span>
                    </td>

                    {/* Athlete Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        {athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Seed: <span className="font-mono-timing text-slate-300">{item.seedMark}</span>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: team?.color || '#3b82f6' }}
                        />
                        <span className="font-bold text-slate-200">{team?.shortCode}</span>
                        <span className="text-slate-400 text-[11px] hidden sm:inline">
                          ({team?.name})
                        </span>
                      </div>
                    </td>

                    {/* Reaction Time */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        placeholder="0.140"
                        value={item.reactionTime || ''}
                        onChange={(e) => updateHeatAssignment(item.id, { reactionTime: e.target.value })}
                        className="w-16 px-1.5 py-1 bg-slate-950 border border-slate-800 rounded text-center text-xs font-mono-timing text-slate-300 focus:outline-none focus:border-blue-500"
                      />
                    </td>

                    {/* Time / Mark Editable */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        placeholder="e.g. 9.88"
                        value={item.time || ''}
                        onChange={(e) => updateHeatAssignment(item.id, { time: e.target.value })}
                        className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center font-bold text-amber-400 font-mono-timing text-sm focus:outline-none focus:border-amber-400"
                      />
                    </td>

                    {/* Wind */}
                    <td className="py-3 px-4 text-center font-mono-timing text-xs">
                      {item.wind !== undefined ? (
                        <span className={item.windAssisted ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {item.wind > 0 ? `+${item.wind}` : item.wind}
                          {item.windAssisted && ' [w]'}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Qualification Code (Q/q) */}
                    <td className="py-3 px-4 text-center">
                      {item.qualificationCode ? (
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded font-mono-timing ${
                            item.qualificationCode === 'Q'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {item.qualificationCode}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Records & Notes */}
                    <td className="py-3 px-4">
                      {item.judgeNotes ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Flame className="w-3 h-3" />
                          {item.judgeNotes}
                        </span>
                      ) : (
                        <input
                          type="text"
                          placeholder="Judge note..."
                          value={item.judgeNotes || ''}
                          onChange={(e) => updateHeatAssignment(item.id, { judgeNotes: e.target.value })}
                          className="w-full bg-transparent border-0 text-[11px] text-slate-400 focus:outline-none focus:text-white"
                        />
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={item.status || 'OK'}
                        onChange={(e) => updateHeatAssignment(item.id, { status: e.target.value as any })}
                        className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="OK">OK</option>
                        <option value="DNS">DNS</option>
                        <option value="DNF">DNF</option>
                        <option value="DQ">DQ</option>
                        <option value="FS">FS</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
