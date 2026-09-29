import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  ClipboardList,
  Activity,
  Trophy,
  Medal,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    meetConfig,
    events,
    heatAssignments,
    athletes,
    teams,
    teamScores,
  } = useMeet();

  const [reportType, setReportType] = useState<'resultsBook' | 'startLists' | 'callRoom' | 'teamScores' | 'medals'>('resultsBook');

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  const handlePrint = () => {
    window.print();
  };

  // CSV Export
  const handleExportCSV = () => {
    let csv = 'Event,Round,Place,Lane,Bib,Athlete,Team,Time_Mark,Wind,Reaction,Status,Notes\n';
    events.forEach(evt => {
      const assigns = heatAssignments.filter(h => h.eventId === evt.id);
      assigns.forEach(a => {
        const ath = a.athleteId ? athleteMap.get(a.athleteId) : null;
        const tm = ath ? teamMap.get(ath.teamId) : null;
        const athleteName = ath ? `"${ath.firstName} ${ath.lastName}"` : 'Relay';
        const teamCode = tm ? tm.shortCode : '';
        csv += `"${evt.name}","${evt.round}",${a.rank || ''},${a.lane},${ath?.bib || ''},${athleteName},${teamCode},"${a.time || ''}","${a.wind || ''}","${a.reactionTime || ''}","${a.status || 'OK'}","${a.judgeNotes || ''}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Blueprint_Meet_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Report Selection Ribbon (Hidden during Print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Official Reports & Meet Bulletin</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generate federation-compliant print sheets, complete result books, and CSV exports
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Official Report
            </button>
          </div>
        </div>

        {/* Report Type Selector Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'resultsBook', label: 'Complete Results Book', icon: Activity },
            { id: 'startLists', label: 'Start Lists / Meet Program', icon: Calendar },
            { id: 'callRoom', label: 'Call Room Marshal Sheet', icon: ClipboardList },
            { id: 'teamScores', label: 'Team Championship Scores', icon: Trophy },
            { id: 'medals', label: 'Official Medal Table', icon: Medal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Printable Report Document View */}
      <div className="bg-white text-slate-950 rounded-xl p-8 border border-slate-300 shadow-xl print-card">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-700">
              WORLD ATHLETICS SANCTIONED COMPETITION &bull; OFFICIAL BULLETIN
            </span>
            <h1 className="text-2xl font-black uppercase text-slate-900 font-serif tracking-tight mt-0.5">
              {meetConfig.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Venue: {meetConfig.venueName}, {meetConfig.city}, {meetConfig.country} &bull; Date: {meetConfig.startDate} to {meetConfig.endDate}
            </p>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900 uppercase">
              {reportType === 'resultsBook'
                ? 'OFFICIAL RESULTS BOOK'
                : reportType === 'startLists'
                ? 'OFFICIAL START LISTS'
                : reportType === 'callRoom'
                ? 'CALL ROOM MARSHAL ROSTER'
                : reportType === 'teamScores'
                ? 'TEAM CHAMPIONSHIP STANDINGS'
                : 'MEDAL TABLE'}
            </div>
            <div className="text-slate-500 font-mono-timing text-[11px]">
              Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
            <div className="text-slate-700 text-[10px] font-semibold">
              Director: {meetConfig.meetDirector} &bull; Chief Ref: {meetConfig.chiefReferee}
            </div>
          </div>
        </div>

        {/* 1. RESULTS BOOK */}
        {reportType === 'resultsBook' && (
          <div className="space-y-6">
            {events.map((evt) => {
              const assigns = heatAssignments
                .filter(h => h.eventId === evt.id)
                .sort((a, b) => {
                  if (a.rank && b.rank) return a.rank - b.rank;
                  if (a.rank) return -1;
                  if (b.rank) return 1;
                  return a.lane - b.lane;
                });

              return (
                <div key={evt.id} className="space-y-2 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between bg-slate-100 p-2 rounded">
                    <span className="font-bold text-sm text-slate-900">
                      {evt.name} &bull; {evt.round} ({evt.gender})
                    </span>
                    <span className="text-xs font-mono-timing text-slate-600 font-bold">
                      Status: {evt.status} &bull; Scheduled: {evt.scheduledTime}
                    </span>
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead className="border-b border-slate-300 font-bold text-slate-700 uppercase">
                      <tr>
                        <th className="py-1 px-2 w-10 text-center">PL</th>
                        <th className="py-1 px-2 w-10 text-center">LN</th>
                        <th className="py-1 px-2 w-12 text-center">BIB</th>
                        <th className="py-1 px-2">ATHLETE</th>
                        <th className="py-1 px-2">TEAM</th>
                        <th className="py-1 px-2 text-center">TIME / MARK</th>
                        <th className="py-1 px-2 text-center">WIND</th>
                        <th className="py-1 px-2 text-center">QUAL</th>
                        <th className="py-1 px-2">NOTES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {assigns.map(a => {
                        const ath = a.athleteId ? athleteMap.get(a.athleteId) : null;
                        const tm = ath ? teamMap.get(ath.teamId) : null;
                        return (
                          <tr key={a.id}>
                            <td className="py-1 px-2 text-center font-bold font-mono-timing">{a.rank || '—'}</td>
                            <td className="py-1 px-2 text-center font-mono-timing text-slate-600">{a.lane}</td>
                            <td className="py-1 px-2 text-center font-mono-timing font-bold">{ath?.bib || '—'}</td>
                            <td className="py-1 px-2 font-bold text-slate-900">{ath ? `${ath.firstName} ${ath.lastName}` : 'Relay'}</td>
                            <td className="py-1 px-2 text-slate-700">{tm?.shortCode || ''}</td>
                            <td className="py-1 px-2 text-center font-black font-mono-timing text-slate-900">{a.time || 'NT'}</td>
                            <td className="py-1 px-2 text-center font-mono-timing text-slate-600">{a.wind ? `${a.wind}m/s` : '—'}</td>
                            <td className="py-1 px-2 text-center font-bold font-mono-timing text-blue-700">{a.qualificationCode || ''}</td>
                            <td className="py-1 px-2 text-[11px] text-amber-700 font-semibold">{a.judgeNotes || ''}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. START LISTS */}
        {reportType === 'startLists' && (
          <div className="space-y-6">
            {events.map((evt) => {
              const assigns = heatAssignments
                .filter(h => h.eventId === evt.id)
                .sort((a, b) => a.lane - b.lane);

              return (
                <div key={evt.id} className="space-y-2 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between bg-slate-100 p-2 rounded">
                    <span className="font-bold text-sm text-slate-900">
                      {evt.name} &bull; {evt.round} ({evt.scheduledTime})
                    </span>
                    <span className="text-xs text-slate-600">
                      Rule: {evt.qualifyingRule}
                    </span>
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead className="border-b border-slate-300 font-bold text-slate-700 uppercase">
                      <tr>
                        <th className="py-1 px-2 w-12 text-center">LANE</th>
                        <th className="py-1 px-2 w-14 text-center">BIB</th>
                        <th className="py-1 px-2">ATHLETE</th>
                        <th className="py-1 px-2">TEAM / AFFILIATION</th>
                        <th className="py-1 px-2 text-right">SEED MARK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {assigns.map(a => {
                        const ath = a.athleteId ? athleteMap.get(a.athleteId) : null;
                        const tm = ath ? teamMap.get(ath.teamId) : null;
                        return (
                          <tr key={a.id}>
                            <td className="py-1 px-2 text-center font-bold font-mono-timing text-slate-900">{a.lane}</td>
                            <td className="py-1 px-2 text-center font-mono-timing font-bold">{ath?.bib || '—'}</td>
                            <td className="py-1 px-2 font-bold text-slate-900">{ath ? `${ath.firstName} ${ath.lastName}` : 'Athlete'}</td>
                            <td className="py-1 px-2 text-slate-700">{tm?.name} ({tm?.shortCode})</td>
                            <td className="py-1 px-2 text-right font-mono-timing font-bold text-slate-900">{a.seedMark}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. TEAM SCORES */}
        {reportType === 'teamScores' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Championship Team Standings</h3>
            <table className="w-full text-xs text-left">
              <thead className="border-b-2 border-slate-900 font-bold text-slate-900 uppercase">
                <tr>
                  <th className="py-2 px-3 w-12 text-center">RANK</th>
                  <th className="py-2 px-3">TEAM / AFFILIATION</th>
                  <th className="py-2 px-3 text-center">CODE</th>
                  <th className="py-2 px-3 text-center">MEN'S PTS</th>
                  <th className="py-2 px-3 text-center">WOMEN'S PTS</th>
                  <th className="py-2 px-3 text-right">TOTAL POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono-timing">
                {teamScores.map((score, idx) => (
                  <tr key={score.teamId}>
                    <td className="py-2 px-3 text-center font-black">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold font-sans">{score.teamName}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{score.shortCode}</td>
                    <td className="py-2 px-3 text-center">{score.mensPoints}</td>
                    <td className="py-2 px-3 text-center">{score.womensPoints}</td>
                    <td className="py-2 px-3 text-right font-black text-sm text-slate-900">{score.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. MEDAL TABLE */}
        {reportType === 'medals' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Official Medal Tally</h3>
            <table className="w-full text-xs text-left">
              <thead className="border-b-2 border-slate-900 font-bold text-slate-900 uppercase">
                <tr>
                  <th className="py-2 px-3 w-12 text-center">RANK</th>
                  <th className="py-2 px-3">TEAM</th>
                  <th className="py-2 px-3 text-center">GOLD</th>
                  <th className="py-2 px-3 text-center">SILVER</th>
                  <th className="py-2 px-3 text-center">BRONZE</th>
                  <th className="py-2 px-3 text-right">TOTAL MEDALS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono-timing">
                {teamScores.map((score, idx) => (
                  <tr key={score.teamId}>
                    <td className="py-2 px-3 text-center font-black">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold font-sans">{score.teamName} ({score.shortCode})</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-600">{score.goldCount}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-600">{score.silverCount}</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-800">{score.bronzeCount}</td>
                    <td className="py-2 px-3 text-right font-black text-sm text-slate-900">
                      {score.goldCount + score.silverCount + score.bronzeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Federation Signature Block */}
        <div className="pt-10 border-t border-slate-300 mt-8 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="font-serif italic text-base text-slate-800 mb-1">{meetConfig.meetDirector}</div>
            <div className="border-t border-slate-400 pt-1 uppercase font-bold text-slate-600">
              Meet Director Signature
            </div>
          </div>
          <div>
            <div className="font-serif italic text-base text-slate-800 mb-1">{meetConfig.chiefReferee}</div>
            <div className="border-t border-slate-400 pt-1 uppercase font-bold text-slate-600">
              Chief Track & Field Referee (WA)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
