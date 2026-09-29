import React, { useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import { CheckInStatus } from '../types/sports';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Printer,
  ShieldAlert,
  ArrowRight,
  Footprints,
  Shirt
} from 'lucide-react';

export const CallRoomView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    callRoomInspections,
    updateCallRoomStatus,
    athletes,
    teams,
    meetConfig,
    setActiveTab,
  } = useMeet();

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Call room records for this event
  const currentInspections = useMemo(
    () => callRoomInspections.filter(c => c.eventId === activeEvent?.id),
    [callRoomInspections, activeEvent]
  );

  const handleCheckInAll = () => {
    currentInspections.forEach(item => {
      updateCallRoomStatus(item.athleteId, item.eventId, {
        status: 'Cleared',
        uniformApproved: true,
        timeCheckedIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });
  };

  const handleToggleUniform = (athleteId: string, currentVal: boolean) => {
    updateCallRoomStatus(athleteId, activeEvent.id, {
      uniformApproved: !currentVal,
      status: !currentVal ? 'Cleared' : 'Uniform Checked'
    });
  };

  const handleSetStatus = (athleteId: string, status: CheckInStatus) => {
    updateCallRoomStatus(athleteId, activeEvent.id, {
      status,
      timeCheckedIn: status !== 'Not Reported' ? (new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : undefined
    });
  };

  const clearedCount = currentInspections.filter(c => c.status === 'Cleared').length;
  const dnsCount = currentInspections.filter(c => c.status === 'DNS').length;

  return (
    <div className="space-y-6">
      {/* Call Room Status Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Call Room Marshal Desk</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                {activeEvent?.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Inspection station: Bib verification, Spike depth compliance (Max {meetConfig.maxSpikeLengthMm}mm), Uniform validation, Hip numbers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckInAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Check In & Clear All
            </button>
            <button
              onClick={() => setActiveTab('photo-finish')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <span>March to Track</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Call Room Summary Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Check-Ins</span>
            <div className="text-xl font-mono-timing font-bold text-white mt-0.5">
              {currentInspections.length}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Cleared for Track</span>
            <div className="text-xl font-mono-timing font-bold text-emerald-400 mt-0.5">
              {clearedCount} / {currentInspections.length}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-rose-400">DNS / Scratched</span>
            <div className="text-xl font-mono-timing font-bold text-rose-400 mt-0.5">
              {dnsCount}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-400">Inspection Standard</span>
            <div className="text-sm font-mono-timing font-bold text-amber-400 mt-1">
              {meetConfig.maxSpikeLengthMm}mm World Athletics
            </div>
          </div>
        </div>
      </div>

      {/* Call Room Athlete Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Call Room Marshaling Roster
          </span>
          <span className="text-xs text-slate-400">
            Event Scheduled: <strong className="text-amber-400 font-mono-timing">{activeEvent?.scheduledTime}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-14 text-center">Lane</th>
                <th className="py-3 px-4 w-16 text-center">Hip #</th>
                <th className="py-3 px-4 w-16 text-center">Bib</th>
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Spike Check</th>
                <th className="py-3 px-4 text-center">Uniform Rule</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currentInspections.map((item) => {
                const athlete = athleteMap.get(item.athleteId);
                const team = athlete ? teamMap.get(athlete.teamId) : null;
                const isCleared = item.status === 'Cleared';
                const isDns = item.status === 'DNS';

                return (
                  <tr
                    key={item.athleteId}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCleared ? 'bg-emerald-950/10' : isDns ? 'bg-rose-950/10 opacity-70' : ''
                    }`}
                  >
                    {/* Lane */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 font-bold font-mono-timing text-sm text-white">
                        {item.lane}
                      </span>
                    </td>

                    {/* Hip # */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded font-mono-timing text-xs border border-slate-700">
                        #{item.hipNumberAssigned}
                      </span>
                    </td>

                    {/* Bib # */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-950 text-slate-200 font-bold px-2 py-0.5 rounded font-mono-timing text-xs border border-slate-800">
                        {athlete?.bib || '—'}
                      </span>
                    </td>

                    {/* Athlete Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        {athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.timeCheckedIn ? `Reported at ${item.timeCheckedIn}` : 'Awaiting check-in'}
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
                      </div>
                    </td>

                    {/* Spike Depth Check */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 text-emerald-400 font-mono-timing px-2 py-0.5 rounded font-semibold text-[11px]">
                        <Footprints className="w-3 h-3" />
                        {item.spikeLengthMm}mm OK
                      </span>
                    </td>

                    {/* Uniform Rule Check */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleUniform(item.athleteId, item.uniformApproved)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          item.uniformApproved
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <Shirt className="w-3 h-3" />
                        {item.uniformApproved ? 'Compliant' : 'Inspect'}
                      </button>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleSetStatus(item.athleteId, e.target.value as CheckInStatus)}
                        className={`px-2 py-1 rounded text-xs font-bold border focus:outline-none cursor-pointer ${
                          item.status === 'Cleared'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700'
                            : item.status === 'DNS'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-700'
                            : item.status === 'Checked In'
                            ? 'bg-blue-950/60 text-blue-400 border-blue-700'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="Not Reported">Not Reported</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Uniform Checked">Uniform Checked</option>
                        <option value="Cleared">Cleared for Track</option>
                        <option value="DNS">DNS (Did Not Start)</option>
                        <option value="Scratched">Scratched</option>
                      </select>
                    </td>

                    {/* Quick Button */}
                    <td className="py-3 px-4 text-right">
                      {item.status !== 'Cleared' ? (
                        <button
                          onClick={() => handleSetStatus(item.athleteId, 'Cleared')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] shadow transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {currentInspections.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No athletes assigned to Call Room yet. Seed heats under "Heats & Lanes" first.
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
