import React, { useState } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  Calendar,
  MapPin,
  ShieldCheck,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  PlayCircle
} from 'lucide-react';

export const ManagementView: React.FC = () => {
  const { meetConfig, updateMeetConfig, events, athletes, teams, setActiveTab, setActiveEventId } = useMeet();
  const [form, setForm] = useState(meetConfig);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMeetConfig(form);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const completedEvents = events.filter(e => e.status === 'Official').length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs uppercase font-semibold text-slate-400">Total Athletes</div>
          <div className="text-2xl font-black text-white font-mono-timing mt-1">{athletes.length}</div>
          <div className="text-[11px] text-blue-400 mt-1 font-medium">From {teams.length} Affiliated Teams</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs uppercase font-semibold text-slate-400">Total Events</div>
          <div className="text-2xl font-black text-white font-mono-timing mt-1">{events.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">{completedEvents} Official / {events.length - completedEvents} Pending</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs uppercase font-semibold text-slate-400">Timing System</div>
          <div className="text-lg font-black text-amber-400 font-mono-timing mt-1 truncate">
            {meetConfig.timingSystem}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Lynx / Omega FAT Ready</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs uppercase font-semibold text-slate-400">Scoring Formula</div>
          <div className="text-xl font-black text-blue-400 font-mono-timing mt-1">{meetConfig.pointsPreset}</div>
          <div className="text-[11px] text-slate-400 mt-1">Championship Top 8</div>
        </div>
      </div>

      {savedNotification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Meet specifications and officials updated successfully!</span>
        </div>
      )}

      {/* Main Meet Settings & Schedule Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Meet Details & Officials Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Meet Configuration & Venue
              </h2>
              <p className="text-xs text-slate-400">General settings, timing standards, and competition venue</p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meet Title</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Sanction Authority</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stadium / Venue Name</label>
              <input
                type="text"
                value={form.venueName}
                onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City, State / Country</label>
              <input
                type="text"
                value={`${form.city}, ${form.country}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setForm({
                    ...form,
                    city: parts[0]?.trim() || '',
                    country: parts[1]?.trim() || ''
                  });
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Certified Meet Officials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meet Director</label>
                <input
                  type="text"
                  value={form.meetDirector}
                  onChange={(e) => setForm({ ...form, meetDirector: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chief Referee (WA/USATF)</label>
                <input
                  type="text"
                  value={form.chiefReferee}
                  onChange={(e) => setForm({ ...form, chiefReferee: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Photo Finish Chief Judge</label>
                <input
                  type="text"
                  value={form.photoFinishChief}
                  onChange={(e) => setForm({ ...form, photoFinishChief: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Head Starter</label>
                <input
                  type="text"
                  value={form.starterChief}
                  onChange={(e) => setForm({ ...form, starterChief: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm font-bold text-white mb-3">Track & Technical Standards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Standard Track Lanes</label>
                <select
                  value={form.defaultTrackLanes}
                  onChange={(e) => setForm({ ...form, defaultTrackLanes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={6}>6 Lanes</option>
                  <option value={8}>8 Lanes (Standard)</option>
                  <option value={9}>9 Lanes (Championship)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Spike Length</label>
                <select
                  value={form.maxSpikeLengthMm}
                  onChange={(e) => setForm({ ...form, maxSpikeLengthMm: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={6}>6 mm (Standard Track)</option>
                  <option value={7}>7 mm (Synthetic Standard)</option>
                  <option value={9}>9 mm (High Jump / Javelin)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wind Legal Limit</label>
                <input
                  type="text"
                  disabled
                  value="+2.0 m/s (World Athletics)"
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Col: Timetable & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Live Timetable & Sessions
              </h2>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono-timing">
                {events.length} Events
              </span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {events.map((evt) => {
                const isOfficial = evt.status === 'Official';
                const isLive = evt.status === 'In Progress' || evt.status === 'Call Room Open';
                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isLive
                        ? 'bg-blue-950/40 border-blue-500/50'
                        : isOfficial
                        ? 'bg-slate-950/70 border-slate-800 opacity-90'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-timing font-bold text-amber-400">
                        {evt.scheduledTime}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isOfficial
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isLive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white mt-1">{evt.name}</div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span>{evt.round} &bull; {evt.gender}</span>
                      <button
                        onClick={() => {
                          setActiveEventId(evt.id);
                          if (evt.status === 'Official') {
                            setActiveTab('results');
                          } else if (evt.status === 'Call Room Open') {
                            setActiveTab('call-room');
                          } else {
                            setActiveTab('heats-lanes');
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        Open Event &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
              Technical Delegate Notice
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully automatic timing in operation. All track records require wind gauge reading strictly under +2.0 m/s. Call room opens 45 minutes prior to event start time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
