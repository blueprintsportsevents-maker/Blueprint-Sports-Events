import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import confetti from 'canvas-confetti';
import {
  Award,
  Trophy,
  Medal,
  Sparkles,
  Printer,
  CheckCircle,
  FileCheck,
  Download
} from 'lucide-react';

export const MedalsCertificatesView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    heatAssignments,
    athletes,
    teams,
    teamScores,
    meetConfig,
  } = useMeet();

  const [selectedPodiumRank, setSelectedPodiumRank] = useState<number>(1);

  const activeEvent = useMemo(
    () => events.find(e => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const athleteMap = useMemo(() => new Map(athletes.map(a => [a.id, a])), [athletes]);
  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Top 3 finishers for active event
  const podiumFinishers = useMemo(() => {
    const assignments = heatAssignments
      .filter(h => h.eventId === activeEvent?.id && h.rank && h.rank <= 3)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0));

    return {
      gold: assignments.find(a => a.rank === 1),
      silver: assignments.find(a => a.rank === 2),
      bronze: assignments.find(a => a.rank === 3),
    };
  }, [heatAssignments, activeEvent]);

  // Trigger celebration confetti
  const triggerCeremonyConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#ffffff']
    });
  };

  // Certificate target athlete
  const certificateAthleteAssignment = useMemo(() => {
    if (selectedPodiumRank === 1) return podiumFinishers.gold;
    if (selectedPodiumRank === 2) return podiumFinishers.silver;
    return podiumFinishers.bronze;
  }, [selectedPodiumRank, podiumFinishers]);

  const certAthlete = certificateAthleteAssignment?.athleteId
    ? athleteMap.get(certificateAthleteAssignment.athleteId)
    : null;
  const certTeam = certAthlete ? teamMap.get(certAthlete.teamId) : null;

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Podium Ceremonies & Certificates</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {activeEvent?.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Medal honors, podium presentations, and official federation diploma generation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerCeremonyConfetti}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Celebrate Fanfare
            </button>
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Certificate
            </button>
          </div>
        </div>

        {/* Podium Presentation Block */}
        <div className="pt-6 pb-2">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              OFFICIAL PODIUM STANDINGS
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{activeEvent?.name} ({activeEvent?.round})</h3>
          </div>

          {/* 3D Olympic Podium Structure */}
          <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-2xl mx-auto pt-8">
            {/* 2nd Place - Silver */}
            <div
              onClick={() => setSelectedPodiumRank(2)}
              className="flex-1 flex flex-col items-center cursor-pointer group"
            >
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-slate-300">
                  {podiumFinishers.silver?.athleteId
                    ? athleteMap.get(podiumFinishers.silver.athleteId)?.lastName
                    : 'Silver'}
                </span>
                <div className="text-[11px] font-mono-timing text-blue-400 font-bold">
                  {podiumFinishers.silver?.time ? `${podiumFinishers.silver.time}s` : '—'}
                </div>
              </div>
              <div className="w-full bg-gradient-to-t from-slate-800 to-slate-600 rounded-t-xl h-36 flex flex-col items-center justify-between p-3 border-t-4 border-slate-300 shadow-lg group-hover:brightness-110 transition-all">
                <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black font-mono-timing text-lg shadow-md">
                  2
                </div>
                <span className="text-xs uppercase font-bold text-slate-200">SILVER</span>
              </div>
            </div>

            {/* 1st Place - Gold (Champion) */}
            <div
              onClick={() => setSelectedPodiumRank(1)}
              className="flex-1 flex flex-col items-center cursor-pointer group"
            >
              <div className="text-center mb-2">
                <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-full mb-1">
                  <Trophy className="w-3 h-3" /> Champion
                </div>
                <div className="text-sm font-bold text-white">
                  {podiumFinishers.gold?.athleteId
                    ? `${athleteMap.get(podiumFinishers.gold.athleteId)?.firstName} ${athleteMap.get(podiumFinishers.gold.athleteId)?.lastName}`
                    : 'Gold'}
                </div>
                <div className="text-xs font-mono-timing text-amber-300 font-black">
                  {podiumFinishers.gold?.time ? `${podiumFinishers.gold.time}s` : '—'}
                </div>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-800 via-amber-600 to-amber-500 rounded-t-xl h-52 flex flex-col items-center justify-between p-3 border-t-4 border-amber-300 shadow-xl shadow-amber-500/10 group-hover:brightness-110 transition-all">
                <div className="w-12 h-12 rounded-full bg-amber-300 text-amber-950 flex items-center justify-center font-black font-mono-timing text-2xl shadow-lg">
                  1
                </div>
                <span className="text-xs uppercase font-black text-amber-100 tracking-wider">GOLD MEDAL</span>
              </div>
            </div>

            {/* 3rd Place - Bronze */}
            <div
              onClick={() => setSelectedPodiumRank(3)}
              className="flex-1 flex flex-col items-center cursor-pointer group"
            >
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-amber-600">
                  {podiumFinishers.bronze?.athleteId
                    ? athleteMap.get(podiumFinishers.bronze.athleteId)?.lastName
                    : 'Bronze'}
                </span>
                <div className="text-[11px] font-mono-timing text-blue-400 font-bold">
                  {podiumFinishers.bronze?.time ? `${podiumFinishers.bronze.time}s` : '—'}
                </div>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-950 to-amber-800 rounded-t-xl h-28 flex flex-col items-center justify-between p-3 border-t-4 border-amber-700 shadow-lg group-hover:brightness-110 transition-all">
                <div className="w-9 h-9 rounded-full bg-amber-700 text-white flex items-center justify-center font-black font-mono-timing text-base shadow-md">
                  3
                </div>
                <span className="text-[11px] uppercase font-bold text-amber-200">BRONZE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Preview & Medal Tally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Certificate Display (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 no-print">
            <span className="font-bold uppercase tracking-wider">Official Certificate of Achievement</span>
            <div className="flex items-center gap-2">
              <span>Select Place:</span>
              <button
                onClick={() => setSelectedPodiumRank(1)}
                className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  selectedPodiumRank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                1st Place
              </button>
              <button
                onClick={() => setSelectedPodiumRank(2)}
                className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  selectedPodiumRank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                2nd Place
              </button>
              <button
                onClick={() => setSelectedPodiumRank(3)}
                className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  selectedPodiumRank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                3rd Place
              </button>
            </div>
          </div>

          {/* Printable Official Certificate Document */}
          <div
            id="certificate-printable"
            className="bg-white text-slate-900 rounded-2xl p-8 border-8 border-double border-amber-600 shadow-2xl relative overflow-hidden select-none print-card"
          >
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Trophy className="w-96 h-96 text-slate-950" />
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-black tracking-widest text-amber-700">
                  BLUEPRINT SPORTS EVENTS
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-wide uppercase">
                  Certificate of Achievement
                </h1>
                <p className="text-xs text-slate-500 font-serif italic">
                  This certifies that the official sports performance has been verified and registered
                </p>
              </div>

              <div className="py-2">
                <div className="text-xs uppercase tracking-wider text-slate-500">Proudly Awarded to</div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1 border-b-2 border-slate-300 pb-2 inline-block min-w-[280px]">
                  {certAthlete ? `${certAthlete.firstName} ${certAthlete.lastName}` : 'Championship Athlete'}
                </div>
                <div className="text-xs font-bold text-blue-700 mt-1">
                  Representing {certTeam?.name || 'Affiliated Athletics Club'}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-md mx-auto text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block font-semibold">Event</span>
                  <strong className="text-slate-900 text-sm">{activeEvent?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block font-semibold">Official Mark</span>
                  <strong className="text-blue-700 font-mono-timing text-base">
                    {certificateAthleteAssignment?.time ? `${certificateAthleteAssignment.time}s` : '—'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block font-semibold">Official Finish</span>
                  <strong className="text-amber-700 text-sm">
                    {selectedPodiumRank === 1 ? '1st Place — Champion' : selectedPodiumRank === 2 ? '2nd Place — Runner Up' : '3rd Place — Bronze'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block font-semibold">Venue</span>
                  <span className="text-slate-800 truncate block">{meetConfig.venueName}</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-6 grid grid-cols-3 items-end gap-4 text-center">
                <div className="border-t border-slate-400 pt-1">
                  <div className="font-serif italic text-sm text-slate-800">{meetConfig.meetDirector}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Meet Director</div>
                </div>

                {/* Gold Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 border-2 border-amber-700 shadow-md flex items-center justify-center p-1 text-center">
                    <div className="w-full h-full border border-dashed border-amber-900 rounded-full flex flex-col items-center justify-center">
                      <Medal className="w-5 h-5 text-amber-950" />
                      <span className="text-[7px] font-black text-amber-950 uppercase leading-none">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-400 pt-1">
                  <div className="font-serif italic text-sm text-slate-800">{meetConfig.chiefReferee}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Chief Referee (WA)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medal Tally Table (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-400" />
              Championship Medal Tally
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Ranked by Gold</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-2 text-center text-amber-400">G</th>
                  <th className="py-2.5 px-2 text-center text-slate-300">S</th>
                  <th className="py-2.5 px-2 text-center text-amber-600">B</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {teamScores.map((score, idx) => (
                  <tr key={score.teamId} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: score.color }}
                        />
                        <span className="font-bold text-white">{score.shortCode}</span>
                        <span className="text-slate-400 text-[11px] truncate hidden sm:inline">
                          {score.teamName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center font-mono-timing font-bold text-amber-400">
                      {score.goldCount}
                    </td>
                    <td className="py-2 px-2 text-center font-mono-timing font-bold text-slate-300">
                      {score.silverCount}
                    </td>
                    <td className="py-2 px-2 text-center font-mono-timing font-bold text-amber-600">
                      {score.bronzeCount}
                    </td>
                    <td className="py-2 px-3 text-right font-mono-timing font-black text-white">
                      {score.goldCount + score.silverCount + score.bronzeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
