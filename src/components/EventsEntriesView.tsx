import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import { SportEvent, Gender, AgeCategory, EventType, RoundType } from '../types/sports';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Award,
  Users,
  CheckCircle,
  XCircle,
  Shuffle,
  ChevronRight,
  Filter
} from 'lucide-react';

export const EventsEntriesView: React.FC = () => {
  const {
    events,
    athletes,
    teams,
    activeEventId,
    setActiveEventId,
    addEvent,
    updateEvent,
    deleteEvent,
    addEntryToEvent,
    removeEntryFromEvent,
    seedHeatsForEvent,
    setActiveTab,
  } = useMeet();

  const [showEventModal, setShowEventModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Form for new event
  const [eventForm, setEventForm] = useState({
    name: '',
    gender: 'Men' as Gender,
    category: 'Senior' as AgeCategory,
    type: 'track' as EventType,
    distanceOrApparatus: '100m',
    round: 'Finals' as RoundType,
    scheduledTime: '17:00',
    status: 'Scheduled' as const,
    laneCount: 8,
    qualifyingRule: 'Final (Top 8)',
    meetRecord: { mark: '', holder: '', year: '2024' },
    worldRecord: { mark: '', holder: '', year: '' }
  });

  // Entry form
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [seedMarkInput, setSeedMarkInput] = useState('');

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'ALL') return events;
    return events.filter(e => e.type === filterType);
  }, [events, filterType]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      ...eventForm,
      lanesConfiguration: [4, 5, 3, 6, 2, 7, 1, 8].slice(0, eventForm.laneCount)
    });
    setShowEventModal(false);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !selectedAthleteId) return;
    addEntryToEvent(activeEvent.id, selectedAthleteId, seedMarkInput || 'NT');
    setSeedMarkInput('');
    setShowEntryModal(false);
  };

  const availableAthletesForEvent = useMemo(() => {
    if (!activeEvent) return [];
    const enteredIds = new Set(activeEvent.entries.map(e => e.athleteId));
    return athletes.filter(a => !enteredIds.has(a.id) && (a.gender === activeEvent.gender || activeEvent.gender === 'Mixed'));
  }, [athletes, activeEvent]);

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400">Filter Events:</span>
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            {['ALL', 'track', 'field', 'relay'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize cursor-pointer ${
                  filterType === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowEventModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Main Grid: Left Event List, Right Entry Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Events Navigation Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Schedule of Events ({filteredEvents.length})</span>
            <span className="text-[11px] text-blue-400 font-medium">Click to manage entries</span>
          </h2>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredEvents.map((evt) => {
              const isSelected = evt.id === activeEvent?.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setActiveEventId(evt.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-timing font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {evt.scheduledTime}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        evt.status === 'Official'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : evt.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <h3 className="font-bold text-sm text-white">{evt.name}</h3>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-medium">
                        {evt.round}
                      </span>
                      <span className="capitalize text-[11px] text-slate-300">{evt.type}</span>
                    </div>
                    <span className="font-semibold text-blue-400">
                      {evt.entries.length} Entries
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Details & Entries Management (7 cols) */}
        {activeEvent ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{activeEvent.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    {activeEvent.round}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scheduled: <span className="text-slate-200 font-mono-timing font-bold">{activeEvent.scheduledTime}</span> &bull; {activeEvent.gender} &bull; {activeEvent.laneCount} Lanes Track
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    seedHeatsForEvent(activeEvent.id);
                    setActiveTab('heats-lanes');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                  title="Serpentine seeding and lane draw according to World Athletics standards"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Seed Heats & Lanes
                </button>
                <button
                  onClick={() => setShowEntryModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Athlete
                </button>
              </div>
            </div>

            {/* Event Records Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Meet Record (MR)</span>
                <div className="font-bold text-white text-sm font-mono-timing mt-0.5">
                  {activeEvent.meetRecord ? `${activeEvent.meetRecord.mark} (${activeEvent.meetRecord.year})` : '—'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{activeEvent.meetRecord?.holder || 'None set'}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">National Record (NR)</span>
                <div className="font-bold text-white text-sm font-mono-timing mt-0.5">
                  {activeEvent.nationalRecord ? `${activeEvent.nationalRecord.mark}` : '—'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{activeEvent.nationalRecord?.holder || 'Federation mark'}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">World Record (WR)</span>
                <div className="font-bold text-white text-sm font-mono-timing mt-0.5">
                  {activeEvent.worldRecord ? `${activeEvent.worldRecord.mark}` : '—'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{activeEvent.worldRecord?.holder || 'World Athletics'}</div>
              </div>
            </div>

            {/* Event Entries Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Roster of Confirmed Entries ({activeEvent.entries.length})</span>
                <span className="text-slate-400 font-normal">Sorted by Seed Mark</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-14 text-center">Bib</th>
                      <th className="py-2.5 px-3">Athlete</th>
                      <th className="py-2.5 px-3">Affiliation</th>
                      <th className="py-2.5 px-3 text-right">Seed Mark</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activeEvent.entries.map((entry, idx) => {
                      const athlete = athleteMap.get(entry.athleteId);
                      const team = athlete ? teamMap.get(athlete.teamId) : null;
                      return (
                        <tr key={entry.athleteId} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-center">
                            <span className="bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded font-mono-timing text-[11px]">
                              {athlete?.bib || '—'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            {athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Unknown Athlete'}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: team?.color || '#3b82f6' }}
                              />
                              <span className="text-slate-300 font-medium">{team?.shortCode}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-timing font-bold text-blue-400">
                            {entry.seedMark}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center text-emerald-400 text-[11px] gap-1 font-semibold">
                              <CheckCircle className="w-3 h-3" /> Confirmed
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => removeEntryFromEvent(activeEvent.id, entry.athleteId)}
                              className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                              title="Scratch/Remove from event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {activeEvent.entries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">
                          No athletes entered yet. Click "Add Athlete" to register entries.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal: Create Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Create Championship Event
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Men's 200m Dash"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={eventForm.gender}
                    onChange={(e) => setEventForm({ ...eventForm, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as EventType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="track">Track (Running)</option>
                    <option value="field">Field (Jump/Throw)</option>
                    <option value="relay">Relay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Round</label>
                  <select
                    value={eventForm.round}
                    onChange={(e) => setEventForm({ ...eventForm, round: e.target.value as RoundType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Finals">Finals</option>
                    <option value="Semifinals">Semifinals</option>
                    <option value="Prelims">Prelims / Heats</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={eventForm.scheduledTime}
                    onChange={(e) => setEventForm({ ...eventForm, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lanes Count</label>
                  <select
                    value={eventForm.laneCount}
                    onChange={(e) => setEventForm({ ...eventForm, laneCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={8}>8 Lanes</option>
                    <option value={6}>6 Lanes</option>
                    <option value={9}>9 Lanes</option>
                    <option value={1}>1 (Field event)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Athlete Entry */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Enter Athlete in {activeEvent?.name}
            </h3>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Athlete</label>
                <select
                  required
                  value={selectedAthleteId}
                  onChange={(e) => setSelectedAthleteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Athlete --</option>
                  {availableAthletesForEvent.map(a => {
                    const team = teamMap.get(a.teamId);
                    return (
                      <option key={a.id} value={a.id}>
                        #{a.bib} {a.firstName} {a.lastName} ({team?.shortCode || 'Club'})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seed Mark / Personal Best
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10.15 or 7.10m"
                  value={seedMarkInput}
                  onChange={(e) => setSeedMarkInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono-timing"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedAthleteId}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
