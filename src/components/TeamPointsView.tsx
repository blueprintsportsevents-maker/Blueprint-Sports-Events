import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  BarChart3,
  Trophy,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle,
  Sliders
} from 'lucide-react';

export const TeamPointsView: React.FC = () => {
  const { teamScores, meetConfig, updateMeetConfig } = useMeet();

  const [activeDivision, setActiveDivision] = useState<'overall' | 'men' | 'women'>('overall');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // Sorted list based on division
  const sortedScores = useMemo(() => {
    return [...teamScores].sort((a, b) => {
      if (activeDivision === 'men') return b.mensPoints - a.mensPoints;
      if (activeDivision === 'women') return b.womensPoints - a.womensPoints;
      return b.totalPoints - a.totalPoints;
    });
  }, [teamScores, activeDivision]);

  const maxPoints = useMemo(() => {
    if (sortedScores.length === 0) return 100;
    const top = activeDivision === 'men'
      ? sortedScores[0].mensPoints
      : activeDivision === 'women'
      ? sortedScores[0].womensPoints
      : sortedScores[0].totalPoints;
    return Math.max(top, 10);
  }, [sortedScores, activeDivision]);

  const handlePresetChange = (preset: any) => {
    updateMeetConfig({ pointsPreset: preset });
  };

  return (
    <div className="space-y-6">
      {/* Header & Preset Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Championship Team Standings</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                Formula: {meetConfig.pointsPreset}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top 8 athletes per event award championship points (1st: 10pts, 2nd: 8pts, 3rd: 6pts, 4th: 5pts...)
            </p>
          </div>

          {/* Division Selector */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveDivision('overall')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeDivision === 'overall' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overall Combined
              </button>
              <button
                onClick={() => setActiveDivision('men')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeDivision === 'men' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Men's Division
              </button>
              <button
                onClick={() => setActiveDivision('women')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeDivision === 'women' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Women's Division
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Championship Podium Cards */}
        {sortedScores.length >= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* 1st Place Trophy Card */}
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-xl p-4 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> 1st Place Leader
                </span>
                <span className="text-2xl font-mono-timing font-black text-amber-400">
                  {activeDivision === 'men' ? sortedScores[0].mensPoints : activeDivision === 'women' ? sortedScores[0].womensPoints : sortedScores[0].totalPoints} pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2 truncate">{sortedScores[0].teamName}</h3>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>Code: <strong className="text-slate-200">{sortedScores[0].shortCode}</strong></span>
                <span>&bull;</span>
                <span className="text-amber-400 font-bold">{sortedScores[0].goldCount} Golds</span>
              </div>
            </div>

            {/* 2nd Place Card */}
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  2nd Place Runner-Up
                </span>
                <span className="text-2xl font-mono-timing font-bold text-slate-200">
                  {activeDivision === 'men' ? sortedScores[1].mensPoints : activeDivision === 'women' ? sortedScores[1].womensPoints : sortedScores[1].totalPoints} pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2 truncate">{sortedScores[1].teamName}</h3>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>Code: <strong className="text-slate-200">{sortedScores[1].shortCode}</strong></span>
                <span>&bull;</span>
                <span className="text-slate-300 font-bold">{sortedScores[1].silverCount} Silvers</span>
              </div>
            </div>

            {/* 3rd Place Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  3rd Place Bronze
                </span>
                <span className="text-2xl font-mono-timing font-bold text-amber-600">
                  {activeDivision === 'men' ? sortedScores[2].mensPoints : activeDivision === 'women' ? sortedScores[2].womensPoints : sortedScores[2].totalPoints} pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2 truncate">{sortedScores[2].teamName}</h3>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>Code: <strong className="text-slate-200">{sortedScores[2].shortCode}</strong></span>
                <span>&bull;</span>
                <span className="text-amber-600 font-bold">{sortedScores[2].bronzeCount} Bronzes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Leaderboard Table with Bar Fill & Accordion Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Team Points Leaderboard & Breakdown
          </span>
          <span className="text-xs text-slate-400">
            Click any team row to inspect individual athlete scoring
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {sortedScores.map((score, idx) => {
            const pointsToDisplay =
              activeDivision === 'men'
                ? score.mensPoints
                : activeDivision === 'women'
                ? score.womensPoints
                : score.totalPoints;

            const percentage = Math.round((pointsToDisplay / maxPoints) * 100);
            const isExpanded = expandedTeamId === score.teamId;

            return (
              <div key={score.teamId} className="group">
                {/* Team summary row */}
                <div
                  onClick={() => setExpandedTeamId(isExpanded ? null : score.teamId)}
                  className={`p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors ${
                    isExpanded ? 'bg-slate-800/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 font-bold font-mono-timing text-sm text-slate-300">
                      {idx + 1}
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: score.color }}
                    />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{score.teamName}</span>
                        <span className="text-xs text-slate-400 font-mono-timing">({score.shortCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Men: <span className="font-mono-timing text-slate-300">{score.mensPoints}pts</span> &bull; Women: <span className="font-mono-timing text-slate-300">{score.womensPoints}pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Bar & Points */}
                  <div className="flex items-center gap-4 flex-1 max-w-md">
                    <div className="flex-1 bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 hidden sm:block">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, percentage)}%`,
                          backgroundColor: score.color || '#3b82f6'
                        }}
                      />
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="text-xl font-black font-mono-timing text-white">
                        {pointsToDisplay}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Points</div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded event-by-event points breakdown */}
                {isExpanded && (
                  <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Event Scoring Log for {score.teamName}:
                    </div>

                    {score.eventBreakdown.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {score.eventBreakdown.map((item, bIdx) => (
                          <div
                            key={bIdx}
                            className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-white">{item.athleteName}</div>
                              <div className="text-[11px] text-slate-400">{item.eventName}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-blue-400 font-black font-mono-timing text-sm">
                                +{item.points} pts
                              </span>
                              <div className="text-[10px] text-slate-500">Rank {item.rank}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 py-2">
                        No official points registered yet. Points are calculated when events are marked with official finish times.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
