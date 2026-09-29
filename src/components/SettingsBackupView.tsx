import React, { useState, useRef } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  Settings,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Sliders,
  ShieldAlert,
  Server
} from 'lucide-react';

export const SettingsBackupView: React.FC = () => {
  const {
    meetConfig,
    updateMeetConfig,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToSampleData,
    athletes,
    teams,
    events,
    heatAssignments
  } = useMeet();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Blueprint_Meet_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification({
      type: 'success',
      message: 'Full meet database exported successfully!'
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        setNotification({
          type: 'success',
          message: 'Meet database restored successfully!'
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to restore database. Invalid JSON format.'
        });
      }
      setTimeout(() => setNotification(null), 3500);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetSample = () => {
    resetToSampleData();
    setShowResetConfirm(false);
    setNotification({
      type: 'success',
      message: 'Restored original Blueprint National Invitational sample meet data.'
    });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">System Settings & Data Backup</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data persistence, JSON backup archives, timing system bridges, and operational presets
          </p>
        </div>

        {notification && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Database Health Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Database Records</span>
            <div className="text-lg font-mono-timing font-bold text-white mt-0.5">
              {athletes.length + teams.length + events.length + heatAssignments.length} Items
            </div>
            <div className="text-[10px] text-blue-400">LocalStorage Encrypted</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Affiliated Teams</span>
            <div className="text-lg font-mono-timing font-bold text-emerald-400 mt-0.5">
              {teams.length} Clubs
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Registered Athletes</span>
            <div className="text-lg font-mono-timing font-bold text-amber-400 mt-0.5">
              {athletes.length} Competitors
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Lane Assignments</span>
            <div className="text-lg font-mono-timing font-bold text-cyan-400 mt-0.5">
              {heatAssignments.length} Seeds
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Backup Tools & Timing Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Backup & Restore */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Database Backup & Cloud Sync
            </h3>
            <p className="text-xs text-slate-400">Save complete state to local archive or import prior meet</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Export Full Meet Database</h4>
                  <p className="text-xs text-slate-400">
                    Creates an encrypted JSON snapshot of all meet settings, rosters, heats, and verified FAT marks.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Restore Meet from JSON</h4>
                  <p className="text-xs text-slate-400">
                    Upload a previously exported Blueprint JSON backup file to overwrite current meet data.
                  </p>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    Import JSON
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default Blueprint Sample Data
                  </h4>
                  <p className="text-xs text-slate-400">
                    Reloads the official Blueprint Grand Prix sample tournament (8 clubs, 40+ athletes, completed FAT results).
                  </p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors"
                >
                  Reload Sample
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Timing System Bridge Formats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-400" />
              Timing System Integration Formats
            </h3>
            <p className="text-xs text-slate-400">Compatibility specifications with stadium timing hardware</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>FinishLynx LIF / EVT Format</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono-timing">
                  Supported
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Seamlessly maps Lynx Event / Round / Heat / Lane structure with 1/1000th FAT time readings and wind gauge tags.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>Omega Scan'O'Vision & Photocell FAT</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono-timing">
                  Supported
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Captures slit-line timestamps and reaction times from starting block false-start detection sensors.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>Hy-Tek Meet Manager CL2 & Flash Results</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono-timing">
                  Compatible
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Standard roster, bib, and seed mark export available via the "Reports" module CSV output.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Reset to Sample Meet?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will overwrite the current database with the default sample championship (8 teams, 40+ athletes, and recorded times). Any custom changes made will be replaced.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSample}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
