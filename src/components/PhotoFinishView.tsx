import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import {
  Camera,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckCircle,
  Wind,
  Clock,
  Sparkles,
  Download,
  ShieldCheck,
  Crosshair,
  Maximize2,
  Keyboard,
  Edit3,
  Save,
  RotateCcw,
  CheckCheck,
  FilePenLine,
  Printer,
  X,
  FileText
} from 'lucide-react';

export const PhotoFinishView: React.FC = () => {
  const {
    events,
    activeEventId,
    setActiveEventId,
    heatAssignments,
    updateHeatAssignment,
    batchUpdateHeatResults,
    updateEvent,
    athletes,
    teams,
    meetConfig,
    savePhotoFinishCapture,
    setActiveTab,
  } = useMeet();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cursorX, setCursorX] = useState<number>(340);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(110);
  const [brightness, setBrightness] = useState<number>(100);
  const [invert, setInvert] = useState<boolean>(false);
  const [windGauge, setWindGauge] = useState<number>(1.4);
  const [selectedLane, setSelectedLane] = useState<number>(4);
  const [isJudgeVerified, setIsJudgeVerified] = useState<boolean>(true);
  const [capturedNotification, setCapturedNotification] = useState<string | null>(null);

  // Printout States
  const [showPrintoutModal, setShowPrintoutModal] = useState<boolean>(false);
  const [canvasSnapshot, setCanvasSnapshot] = useState<string | null>(null);

  // Manual Entry States
  const [entryMode, setEntryMode] = useState<'scanner' | 'manual'>('scanner');
  const [manualTimeValue, setManualTimeValue] = useState<string>('');
  const [manualReactionValue, setManualReactionValue] = useState<string>('0.142');
  const [manualTimingType, setManualTimingType] = useState<'FAT' | 'HT'>('FAT');
  const [manualRows, setManualRows] = useState<{ [lane: number]: { time: string; reaction: string; status: any } }>({});

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

  // Calculate base time based on cursor position
  // Left = 9.800s, Right = 10.200s (or event specific)
  const baseTimeSeconds = useMemo(() => {
    const is200m = activeEvent?.distanceOrApparatus?.includes('200');
    const is400m = activeEvent?.distanceOrApparatus?.includes('400');
    const is110h = activeEvent?.distanceOrApparatus?.includes('110');
    const is800m = activeEvent?.distanceOrApparatus?.includes('800');

    if (is800m) return 102.0;
    if (is400m) return 48.0;
    if (is200m) return 19.8;
    if (is110h) return 12.8;
    return 9.80; // 100m default
  }, [activeEvent]);

  // Scaled time calculation from cursor:
  const currentCalculatedTime = useMemo(() => {
    // 0px to 800px maps to 0.400 seconds delta
    const delta = (cursorX / 800) * 0.40;
    return (baseTimeSeconds + delta).toFixed(3);
  }, [cursorX, baseTimeSeconds]);

  // Render simulated slit-scan photo finish canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Background slit-scan track surface (vertical color striations simulating 2000 lines/sec scan)
    const laneHeight = height / 8;

    // Draw track lanes
    for (let lane = 1; lane <= 8; lane++) {
      const y = (lane - 1) * laneHeight;
      // Lane color alternation
      ctx.fillStyle = lane % 2 === 0 ? '#1e293b' : '#0f172a';
      ctx.fillRect(0, y, width, laneHeight);

      // Lane divider line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Lane number watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`L${lane}`, 20, y + laneHeight / 2 + 8);
    }

    // Draw simulated athlete slit silhouettes (chest/torso crossing finish plane)
    currentLanes.forEach((item) => {
      const lane = item.lane;
      const y = (lane - 1) * laneHeight;
      const athlete = item.athleteId ? athleteMap.get(item.athleteId) : null;
      const team = athlete ? teamMap.get(athlete.teamId) : null;

      // Realistic finish offset per athlete based on their time
      const timeVal = parseFloat(item.time || item.seedMark) || (baseTimeSeconds + 0.1 * lane);
      const timeOffset = (timeVal - baseTimeSeconds) / 0.40 * width;
      const athleteX = Math.max(50, Math.min(width - 80, timeOffset));

      const runnerColor = team?.color || '#3b82f6';

      // Draw stylized slit-photo silhouette
      ctx.save();
      // Runner body gradient
      const grad = ctx.createLinearGradient(athleteX - 40, y, athleteX + 40, y + laneHeight);
      grad.addColorStop(0, 'rgba(255,255,255,0.05)');
      grad.addColorStop(0.5, runnerColor);
      grad.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = grad;

      // Torso shape
      ctx.beginPath();
      ctx.ellipse(athleteX, y + laneHeight * 0.45, 18, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(athleteX - 8, y + laneHeight * 0.22, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      // Torso leading edge line (World Athletics rule: measurement taken at leading torso)
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(athleteX, y + 5);
      ctx.lineTo(athleteX, y + laneHeight - 5);
      ctx.stroke();

      // Athlete name label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`#${athlete?.bib || item.lane} ${athlete?.lastName || ''}`, athleteX - 35, y + laneHeight - 6);

      ctx.restore();
    });

    // Time scale grid on top
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const timeMark = (baseTimeSeconds + (x / width) * 0.40).toFixed(2);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`${timeMark}s`, x + 4, 14);
    }
  }, [baseTimeSeconds, currentLanes, athleteMap, teamMap]);

  // Handle canvas click to position hairline cursor
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const scaleX = canvas.width / rect.width;
    setCursorX(Math.max(0, Math.min(canvas.width, x * scaleX)));
  };

  // Stamp official FAT time for selected lane
  const handleCommitTime = () => {
    const targetLane = currentLanes.find(l => l.lane === selectedLane);
    if (!targetLane) return;

    updateHeatAssignment(targetLane.id, {
      time: currentCalculatedTime,
      wind: windGauge,
      windAssisted: windGauge > 2.0,
      photoFinishTimestamp: Math.round(parseFloat(currentCalculatedTime) * 1000),
      judgeNotes: `Verified by Chief Judge ${meetConfig.photoFinishChief} at ${new Date().toLocaleTimeString()}`
    });

    savePhotoFinishCapture({
      id: `pf-${Date.now()}`,
      eventId: activeEvent.id,
      heatNumber: 1,
      cursorTimeMs: Math.round(parseFloat(currentCalculatedTime) * 1000),
      windGauge,
      isVerified: true,
      verifiedBy: meetConfig.photoFinishChief,
      verifiedAt: new Date().toLocaleTimeString(),
      laneReadings: [
        {
          lane: selectedLane,
          bib: targetLane.athleteId ? (athleteMap.get(targetLane.athleteId)?.bib || 0) : 0,
          athleteName: targetLane.athleteId ? `${athleteMap.get(targetLane.athleteId)?.firstName} ${athleteMap.get(targetLane.athleteId)?.lastName}` : 'Relay',
          calculatedTime: currentCalculatedTime,
          reactionTime: targetLane.reactionTime || '0.142'
        }
      ]
    });

    setCapturedNotification(`Lane ${selectedLane} Official FAT Time recorded: ${currentCalculatedTime}s`);
    setTimeout(() => setCapturedNotification(null), 3000);
  };

  const handleOpenPrintout = () => {
    if (canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCanvasSnapshot(dataUrl);
      } catch {
        // fallback
      }
    }
    setShowPrintoutModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const printSortedLanes = useMemo(() => {
    return [...currentLanes].sort((a, b) => {
      // Put recorded times first, sorted by time
      if (!a.time && !b.time) return a.lane - b.lane;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return parseFloat(a.time) - parseFloat(b.time);
    });
  }, [currentLanes]);

  // Sync manual rows when heat lanes change
  useEffect(() => {
    const initialMap: { [lane: number]: { time: string; reaction: string; status: any } } = {};
    currentLanes.forEach(l => {
      initialMap[l.lane] = {
        time: l.time || '',
        reaction: l.reactionTime || '0.142',
        status: l.status || 'OK'
      };
    });
    setManualRows(initialMap);
  }, [currentLanes]);

  // Sync manual input with selected lane
  useEffect(() => {
    const laneObj = currentLanes.find(l => l.lane === selectedLane);
    setManualTimeValue(laneObj?.time || currentCalculatedTime);
    setManualReactionValue(laneObj?.reactionTime || '0.142');
  }, [selectedLane, currentCalculatedTime]);

  const handleUpdateLaneData = (laneNum: number, newTime: string, newStatus?: any) => {
    setManualRows(prev => ({
      ...prev,
      [laneNum]: {
        ...prev[laneNum],
        time: newTime,
        status: newStatus !== undefined ? newStatus : (prev[laneNum]?.status || 'OK')
      }
    }));

    const targetLane = currentLanes.find(l => l.lane === laneNum);
    if (targetLane) {
      updateHeatAssignment(targetLane.id, {
        time: newTime,
        status: newStatus !== undefined ? newStatus : (targetLane.status || 'OK'),
        photoFinishTimestamp: newTime ? Math.round(parseFloat(newTime) * 1000) : undefined
      });
    }
  };

  const handleCommitManualTime = (targetLaneNum?: number, customTime?: string) => {
    const lane = targetLaneNum || selectedLane;
    const targetLane = currentLanes.find(l => l.lane === lane);
    if (!targetLane) return;

    const timeToSave = customTime !== undefined ? customTime : (manualTimeValue || currentCalculatedTime);
    const methodNote = manualTimingType === 'HT' ? 'Hand Timed (HT)' : 'Manual FAT Key';

    updateHeatAssignment(targetLane.id, {
      time: timeToSave,
      reactionTime: manualReactionValue || targetLane.reactionTime || '0.142',
      wind: windGauge,
      windAssisted: windGauge > 2.0,
      photoFinishTimestamp: Math.round(parseFloat(timeToSave) * 1000),
      judgeNotes: `Manual Entry (${methodNote}) by Chief Judge ${meetConfig.photoFinishChief} at ${new Date().toLocaleTimeString()}`
    });

    savePhotoFinishCapture({
      id: `pf-manual-${Date.now()}`,
      eventId: activeEvent.id,
      heatNumber: 1,
      cursorTimeMs: Math.round(parseFloat(timeToSave) * 1000),
      windGauge,
      isVerified: true,
      verifiedBy: meetConfig.photoFinishChief,
      verifiedAt: new Date().toLocaleTimeString(),
      laneReadings: [
        {
          lane,
          bib: targetLane.athleteId ? (athleteMap.get(targetLane.athleteId)?.bib || 0) : 0,
          athleteName: targetLane.athleteId ? `${athleteMap.get(targetLane.athleteId)?.firstName} ${athleteMap.get(targetLane.athleteId)?.lastName}` : 'Relay',
          calculatedTime: timeToSave,
          reactionTime: manualReactionValue || '0.142'
        }
      ]
    });

    setCapturedNotification(`Lane ${lane} Manual Entry recorded: ${timeToSave}s (${manualTimingType})`);
    setTimeout(() => setCapturedNotification(null), 3000);
  };

  const handleSaveAllManualEntries = () => {
    currentLanes.forEach(l => {
      const row = manualRows[l.lane];
      if (row && row.time && row.time.trim() !== '') {
        updateHeatAssignment(l.id, {
          time: row.time.trim(),
          reactionTime: row.reaction,
          status: row.status,
          wind: windGauge,
          windAssisted: windGauge > 2.0,
          judgeNotes: `Manual Entry by Chief Judge ${meetConfig.photoFinishChief}`
        });
      }
    });
    setCapturedNotification('All manual times and lane statuses saved successfully!');
    setTimeout(() => setCapturedNotification(null), 3000);
  };

  const handleSaveAllResults = () => {
    // 1. Gather all current lane assignments with their latest times & status
    const updatedAssignments = currentLanes.map(item => {
      const rowData = manualRows[item.lane];
      const timeToUse = rowData?.time !== undefined && rowData.time !== '' ? rowData.time : (item.time || '');
      const reactionToUse = rowData?.reaction || item.reactionTime || '0.142';
      const statusToUse = rowData?.status || item.status || 'OK';

      return {
        ...item,
        time: timeToUse,
        reactionTime: reactionToUse,
        status: statusToUse,
        wind: windGauge,
        windAssisted: windGauge > 2.0,
        photoFinishTimestamp: timeToUse ? Math.round(parseFloat(timeToUse) * 1000) : undefined,
        judgeNotes: `Official Result Verified & Saved by Chief Judge ${meetConfig.photoFinishChief} at ${new Date().toLocaleTimeString()}`
      };
    });

    // 2. Compute official rankings and qualification codes for sorted times
    const autoQCount = activeEvent.autoQualifiersPerHeat || 2;
    const sorted = [...updatedAssignments].sort((a, b) => {
      if (!a.time && !b.time) return a.lane - b.lane;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return parseFloat(a.time) - parseFloat(b.time);
    });

    const finalAssignments = sorted.map((item, index) => {
      const rank = item.time ? index + 1 : undefined;
      let qCode: any = '';
      if (rank !== undefined) {
        if (rank <= autoQCount) {
          qCode = 'Q';
        } else if (rank <= autoQCount + (activeEvent.fastestQualifiers || 2)) {
          qCode = 'q';
        }
      }
      return {
        ...item,
        rank,
        qualificationCode: qCode
      };
    });

    // 3. Batch commit to heat assignments in state
    batchUpdateHeatResults(finalAssignments, windGauge);

    // 4. Update Event Status to 'Official'
    updateEvent(activeEvent.id, {
      status: 'Official'
    });

    // 5. Save photo finish capture snapshot in history
    let canvasDataUrl: string | undefined = undefined;
    if (canvasRef.current) {
      try {
        canvasDataUrl = canvasRef.current.toDataURL('image/png');
      } catch {
        // ignore
      }
    }

    savePhotoFinishCapture({
      id: `pf-official-${Date.now()}`,
      eventId: activeEvent.id,
      heatNumber: 1,
      canvasDataUrl,
      cursorTimeMs: Math.round(parseFloat(currentCalculatedTime) * 1000),
      windGauge,
      isVerified: true,
      verifiedBy: meetConfig.photoFinishChief,
      verifiedAt: new Date().toLocaleTimeString(),
      laneReadings: finalAssignments.map(l => ({
        lane: l.lane,
        bib: l.athleteId ? (athleteMap.get(l.athleteId)?.bib || 0) : 0,
        athleteName: l.athleteId
          ? `${athleteMap.get(l.athleteId)?.firstName} ${athleteMap.get(l.athleteId)?.lastName}`
          : 'Relay',
        calculatedTime: l.time || 'NT',
        reactionTime: l.reactionTime || '0.142'
      }))
    });

    // 6. Set rich notification banner
    setCapturedNotification(
      `Official results for ${activeEvent.name} (Heat 1) saved and certified! All lane times and standings are now official.`
    );
  };

  // Helper to parse time string into Hrs, Min, Sec
  const parseTimeToParts = (timeStr: string) => {
    if (!timeStr) return { hrs: '0', min: '0', sec: '' };
    const parts = timeStr.trim().split(':');
    if (parts.length === 3) {
      return { hrs: parts[0] || '0', min: parts[1] || '0', sec: parts[2] || '' };
    } else if (parts.length === 2) {
      return { hrs: '0', min: parts[0] || '0', sec: parts[1] || '' };
    } else {
      return { hrs: '0', min: '0', sec: parts[0] || '' };
    }
  };

  const buildTimeFromParts = (h: string, m: string, s: string) => {
    const numH = parseInt(h, 10) || 0;
    const numM = parseInt(m, 10) || 0;
    const secClean = s.trim();
    if (numH > 0) {
      return `${numH}:${String(numM).padStart(2, '0')}:${secClean}`;
    }
    if (numM > 0) {
      return `${numM}:${secClean}`;
    }
    return secClean;
  };

  const selectedAthlete = useMemo(() => {
    const laneObj = currentLanes.find(l => l.lane === selectedLane);
    return laneObj?.athleteId ? athleteMap.get(laneObj.athleteId) : null;
  }, [currentLanes, selectedLane, athleteMap]);

  return (
    <div className="space-y-6">
      {/* Photo Finish Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">FAT Photo Finish Timing Station</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                1/1000th Second Precision
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Slit-video frame scanner (2,000 lines/sec). Align cursor hairline strictly with leading edge of runner's torso.
            </p>
          </div>

          {/* Right Action: Wind Gauge & Certification */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 font-bold uppercase text-[10px]">WIND:</span>
              <input
                type="number"
                step="0.1"
                value={windGauge}
                onChange={(e) => setWindGauge(parseFloat(e.target.value) || 0)}
                className="w-14 bg-transparent text-amber-300 font-bold font-mono-timing focus:outline-none"
              />
              <span className="text-slate-400 text-[10px]">m/s</span>
              {windGauge > 2.0 && (
                <span className="text-[9px] bg-rose-500/20 text-rose-400 font-bold px-1.5 rounded">
                  Wind Assisted
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-3 py-1.5 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>JUDGE CERTIFIED</span>
            </div>

            <button
              onClick={handleSaveAllResults}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              title="Save all official results and publish to standings"
            >
              <Save className="w-4 h-4" />
              <span>Save Results</span>
            </button>

            <button
              onClick={handleOpenPrintout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              title="Generate Official Photo Finish & Timing Printout Sheet"
            >
              <Printer className="w-4 h-4" />
              <span>Official Printout</span>
            </button>
          </div>
        </div>

        {/* Live Cursor Readout Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                HAIRLINE TIME READOUT
              </span>
              <div className="text-3xl font-black text-amber-400 font-mono-timing led-glow">
                {currentCalculatedTime} <span className="text-sm font-semibold text-slate-400">sec</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800 hidden sm:block"></div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                ACTIVE LANE & ATHLETE
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                <span className="bg-blue-600 text-white font-mono-timing px-2 py-0.5 rounded text-xs font-bold">
                  Lane {selectedLane}
                </span>
                <span>
                  {selectedAthlete ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}` : 'Select lane below'}
                </span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800 hidden sm:block"></div>

            {/* Quick Manual Entry Input Control */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2 px-3 flex items-center gap-2.5 shadow-inner">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 tracking-wider">
                    <Keyboard className="w-3 h-3 text-amber-400" /> MANUAL ENTRY
                  </span>
                  {/* Sec Min Hrs Format Selector */}
                  <div className="flex items-center gap-1 text-[9px] font-mono-timing font-bold text-slate-400">
                    <span className="text-amber-300">SEC</span>
                    <span>&bull;</span>
                    <span className="text-amber-300">MIN</span>
                    <span>&bull;</span>
                    <span className="text-amber-300">HRS</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="text"
                    value={manualTimeValue}
                    onChange={(e) => setManualTimeValue(e.target.value)}
                    placeholder={currentCalculatedTime}
                    className="w-24 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-amber-300 font-mono-timing font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[11px] text-slate-400 font-mono-timing">s</span>
                  <select
                    value={manualTimingType}
                    onChange={(e) => setManualTimingType(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="FAT">FAT</option>
                    <option value="HT">HT (Hand)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleCommitManualTime()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1 cursor-pointer"
                title="Commit manual entry time for selected lane"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply Manual</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveAllResults}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              title="Save all official results and publish to meet standings"
            >
              <Save className="w-4 h-4" />
              <span>Save Results</span>
            </button>
            <button
              onClick={handleCommitTime}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>Record Torso Mark</span>
            </button>
            <button
              onClick={handleOpenPrintout}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Generate Official Photo Finish & Timing Printout Sheet"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Printout</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Go to Results &rarr;
            </button>
          </div>
        </div>

        {capturedNotification && (
          <div className="bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 p-3.5 rounded-xl text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-emerald-950/40 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Results Saved & Certified</div>
                <div className="text-emerald-300/90 text-xs">{capturedNotification}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenPrintout}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg font-bold border border-slate-700 flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print Official Sheet</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <span>View in Results &rarr;</span>
              </button>
              <button
                onClick={() => setCapturedNotification(null)}
                className="p-1 text-emerald-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Photo Finish Canvas Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 flex-wrap gap-2">
          {/* Mode Switcher: Slit-Scan View vs Manual Entry Mode */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 uppercase text-[11px]">View Mode:</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setEntryMode('scanner')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  entryMode === 'scanner'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Slit-Scan Camera</span>
              </button>
              <button
                onClick={() => setEntryMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  entryMode === 'manual'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Manual Entry Grid</span>
              </button>
              <button
                onClick={handleOpenPrintout}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-slate-900 border-l border-slate-800"
                title="Generate Official Photo Finish & Timing Printout Sheet"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Printout Sheet</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span>Image Controls:</span>
            {/* Contrast */}
            <div className="flex items-center gap-1.5">
              <span>Contrast:</span>
              <input
                type="range"
                min="80"
                max="180"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>
            {/* Brightness */}
            <div className="flex items-center gap-1.5">
              <span>Brightness:</span>
              <input
                type="range"
                min="70"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>
            {/* Invert */}
            <button
              onClick={() => setInvert(!invert)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                invert ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Invert Colors
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-timing font-bold text-slate-300 text-xs">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-5 w-[1px] bg-slate-800 mx-1"></div>

            <button
              onClick={handleOpenPrintout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              title="Open and print official photo finish evaluation sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printout</span>
            </button>
          </div>
        </div>

        {/* Viewport with Canvas & Hairline Overlay */}
        <div className="relative border-2 border-slate-700/80 rounded-xl overflow-hidden bg-black select-none shadow-2xl">
          <div
            className="overflow-x-auto"
            style={{
              filter: `contrast(${contrast}%) brightness(${brightness}%) ${invert ? 'invert(1)' : ''}`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
          >
            {/* Target element: Canvas with high-contrast stadium styling */}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair w-full block rounded border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.9)] hover:brightness-105 transition-all"
            />
          </div>

          {/* Interactive Hairline Vertical Line */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-20 flex flex-col items-center"
            style={{ left: `${(cursorX / 800) * 100}%` }}
          >
            {/* Hairline top badge */}
            <div className="bg-amber-400 text-black font-black text-[10px] font-mono-timing px-1.5 py-0.5 rounded shadow -translate-x-1/2 mt-1">
              {currentCalculatedTime}s
            </div>
            {/* Hairline red/gold wire */}
            <div className="w-[2px] h-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
          </div>
        </div>

        {/* Hairline Position Slider */}
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              Scrub Hairline Along Finish Plane
            </span>
            <span className="font-mono-timing text-amber-400 font-bold">{currentCalculatedTime}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="800"
            value={cursorX}
            onChange={(e) => setCursorX(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
          />
        </div>

        {/* MANUAL ENTRY DOCKED CONSOLE (Visible when 'manual' mode selected or toggled) */}
        {entryMode === 'manual' && (
          <div className="mt-4 p-4 bg-slate-950 border border-amber-500/40 rounded-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Manual Time Entry & Review Console
                </h3>
                <p className="text-xs text-slate-400">
                  Direct keying for judges, backup hand times (HT), and obstructed bib overrides
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAllManualEntries}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save All Manual Entries
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">Lane</th>
                    <th className="py-2.5 px-3 w-14 text-center">Bib</th>
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3 text-center">Manual Time (FAT/HT)</th>
                    <th className="py-2.5 px-3 text-center font-bold text-amber-400 font-mono-timing tracking-wider">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-amber-400 font-black">Millisecond &bull; SEC &bull; MIN &bull; HRS</span>
                        <span className="text-[9px] text-slate-400 font-normal tracking-normal uppercase">
                          Hours : Minutes : Seconds : Millisec
                        </span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center font-bold text-slate-300">Status</th>
                    <th className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-600/60 text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono-timing shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Auto Save</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono-timing">
                  {currentLanes.map((item) => {
                    const ath = item.athleteId ? athleteMap.get(item.athleteId) : null;
                    const team = ath ? teamMap.get(ath.teamId) : null;
                    const rowData = manualRows[item.lane] || { time: item.time || '', reaction: item.reactionTime || '0.142', status: item.status || 'OK' };
                    const timeParts = parseTimeToParts(rowData.time);

                    return (
                      <tr key={item.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-bold text-blue-400 text-sm">L{item.lane}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="bg-slate-900 text-amber-300 font-bold px-2 py-0.5 rounded border border-slate-800">
                            #{ath?.bib || '—'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-white">
                          {ath ? `${ath.firstName} ${ath.lastName}` : 'Runner'}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-400">
                          {team?.shortCode}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="text"
                            placeholder="e.g. 9.840"
                            value={rowData.time}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdateLaneData(item.lane, val);
                            }}
                            className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-400"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded px-1.5 py-0.5 shadow-inner">
                            {/* Hrs */}
                            <div className="flex items-center gap-0.5">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                placeholder="0"
                                value={timeParts.hrs !== '0' ? timeParts.hrs : ''}
                                onChange={(e) => {
                                  const newH = e.target.value;
                                  const formatted = buildTimeFromParts(newH, timeParts.min, timeParts.sec);
                                  handleUpdateLaneData(item.lane, formatted);
                                }}
                                className="w-8 bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-center text-[11px] font-bold text-amber-300 focus:outline-none focus:border-amber-400 font-mono-timing"
                              />
                              <span className="text-[9px] text-amber-400/90 uppercase font-black font-mono-timing">hrs</span>
                            </div>
                            <span className="text-slate-600 font-bold">:</span>
                            {/* Min */}
                            <div className="flex items-center gap-0.5">
                              <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="0"
                                value={timeParts.min !== '0' ? timeParts.min : ''}
                                onChange={(e) => {
                                  const newM = e.target.value;
                                  const formatted = buildTimeFromParts(timeParts.hrs, newM, timeParts.sec);
                                  handleUpdateLaneData(item.lane, formatted);
                                }}
                                className="w-8 bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-center text-[11px] font-bold text-amber-300 focus:outline-none focus:border-amber-400 font-mono-timing"
                              />
                              <span className="text-[9px] text-amber-400/90 uppercase font-black font-mono-timing">min</span>
                            </div>
                            <span className="text-slate-600 font-bold">:</span>
                            {/* Sec */}
                            <div className="flex items-center gap-0.5">
                              <input
                                type="text"
                                placeholder="00.000"
                                value={timeParts.sec}
                                onChange={(e) => {
                                  const newS = e.target.value;
                                  const formatted = buildTimeFromParts(timeParts.hrs, timeParts.min, newS);
                                  handleUpdateLaneData(item.lane, formatted);
                                }}
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-center text-[11px] font-bold text-amber-300 focus:outline-none focus:border-amber-400 font-mono-timing"
                              />
                              <span className="text-[9px] text-amber-400/90 uppercase font-black font-mono-timing">sec.ms</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <select
                            value={rowData.status}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdateLaneData(item.lane, rowData.time, val);
                            }}
                            className={`px-2 py-1 rounded text-xs font-bold border transition-colors focus:outline-none cursor-pointer ${
                              rowData.status === 'OK'
                                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
                                : rowData.status === 'DNS'
                                ? 'bg-amber-950/60 border-amber-700/60 text-amber-400'
                                : 'bg-rose-950/60 border-rose-700/60 text-rose-400'
                            }`}
                          >
                            <option value="OK" className="bg-slate-900 text-emerald-400">OK</option>
                            <option value="DNS" className="bg-slate-900 text-amber-400">DNS</option>
                            <option value="DNF" className="bg-slate-900 text-rose-400">DNF</option>
                            <option value="DQ" className="bg-slate-900 text-rose-400">DQ</option>
                            <option value="FS" className="bg-slate-900 text-rose-400">FS</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono-timing font-bold">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="hidden sm:inline">Saved</span>
                            </span>
                            <button
                              onClick={() => handleCommitManualTime(item.lane, rowData.time)}
                              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded font-sans text-[10px] font-bold cursor-pointer transition-colors border border-slate-700"
                              title="Manual force sync"
                            >
                              Save
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lane Selectors & Quick Commit Buttons */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-xs uppercase font-bold text-slate-400 mb-2">
            Select Athlete's Lane to Assign Current Hairline Time:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {currentLanes.map((item) => {
              const ath = item.athleteId ? athleteMap.get(item.athleteId) : null;
              const isSelected = selectedLane === item.lane;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedLane(item.lane)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono-timing">Lane {item.lane}</span>
                    <span className="text-[10px] text-amber-300 font-bold">#{ath?.bib || '—'}</span>
                  </div>
                  <div className="text-[11px] font-bold truncate mt-1">
                    {ath?.lastName || 'Athlete'}
                  </div>
                  <div className="text-[10px] font-mono-timing text-slate-400 mt-0.5 truncate">
                    {item.time ? `${item.time}s` : 'Unrecorded'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Photo Finish Printout Modal */}
      {showPrintoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 md:p-6 flex items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
            {/* Modal Controls Toolbar (Hidden on print) */}
            <div className="no-print bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Official Photo Finish & Timing Printout
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono-timing border border-emerald-500/30">
                      RULE 19 COMPLIANT
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-resolution slit-scan photographic report ready for printer or PDF export
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleSaveAllResults}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  title="Save and certify all official heat results"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Results</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print to Paper / PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintoutModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* The Official Printable Evaluation Sheet (Clean High-Contrast Style) */}
            <div className="p-4 md:p-8 bg-slate-950/70 max-h-[82vh] overflow-y-auto">
              <div
                id="official-photofinish-printout"
                className="bg-white text-slate-950 p-6 md:p-8 rounded-xl shadow-2xl border border-slate-300 mx-auto max-w-3xl space-y-5 font-sans"
              >
                {/* Header Section */}
                <div className="border-b-2 border-slate-900 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-slate-600 uppercase font-mono-timing">
                        OFFICIAL FULLY AUTOMATIC TIMING (FAT) EVALUATION RECORD
                      </div>
                      <h1 className="text-2xl font-black text-slate-950 tracking-tight uppercase mt-0.5">
                        {meetConfig.name}
                      </h1>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        {meetConfig.venueName} &bull; {meetConfig.city}, {meetConfig.country} &bull; {meetConfig.timingSystem}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-slate-950 text-white font-mono-timing font-black text-xs rounded tracking-widest uppercase shadow-sm">
                        OFFICIAL PRINTOUT
                      </span>
                      <div className="text-[11px] font-mono-timing text-slate-700 mt-1 font-bold">
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event & Meet Conditions Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono-timing">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">EVENT:</span>
                    <span className="font-bold text-slate-950 text-xs sm:text-sm">{activeEvent.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">ROUND / HEAT:</span>
                    <span className="font-bold text-slate-950 text-xs sm:text-sm">{activeEvent.round} - Heat 1</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">WIND GAUGE:</span>
                    <span className="font-bold text-slate-950 text-xs sm:text-sm">
                      {windGauge > 0 ? `+${windGauge.toFixed(1)}` : windGauge.toFixed(1)} m/s
                      {windGauge > 2.0 ? ' (Wind Assist)' : ' (Legal)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">TIMING CAMERA:</span>
                    <span className="font-bold text-slate-950 text-xs sm:text-sm">EtherLynx PRO (2,000 fps)</span>
                  </div>
                </div>

                {/* Official Results Table */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Official Order of Finish & Certified FAT Times</span>
                    <span className="text-[10px] text-slate-500 font-mono-timing font-normal">Ranked by finish time</span>
                  </div>
                  <table className="w-full text-left text-xs border border-slate-300">
                    <thead className="bg-slate-100 text-slate-700 font-mono-timing uppercase text-[11px] border-b border-slate-300">
                      <tr>
                        <th className="py-2 px-2.5 text-center w-12">Pl</th>
                        <th className="py-2 px-2.5 text-center w-12">Lane</th>
                        <th className="py-2 px-2.5 text-center w-14">Bib</th>
                        <th className="py-2 px-3">Competitor</th>
                        <th className="py-2 px-3">Affiliation / Club</th>
                        <th className="py-2 px-2.5 text-center">React</th>
                        <th className="py-2 px-3 text-right">FAT Mark</th>
                        <th className="py-2 px-3 text-right">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono-timing text-slate-900">
                      {printSortedLanes.map((item, index) => {
                        const ath = item.athleteId ? athleteMap.get(item.athleteId) : null;
                        const team = ath ? teamMap.get(ath.teamId) : null;
                        const winningTime = parseFloat(printSortedLanes[0]?.time || '0');
                        const currTime = parseFloat(item.time || '0');
                        const delta = (currTime && winningTime && currTime >= winningTime)
                          ? (currTime === winningTime ? '—' : `+${(currTime - winningTime).toFixed(3)}`)
                          : '—';

                        return (
                          <tr key={item.id} className={index === 0 && item.time ? 'bg-amber-50/60 font-semibold' : ''}>
                            <td className="py-2 px-2.5 text-center font-bold">
                              {item.time ? `${index + 1}` : '—'}
                            </td>
                            <td className="py-2 px-2.5 text-center font-bold text-blue-700">
                              L{item.lane}
                            </td>
                            <td className="py-2 px-2.5 text-center font-bold">
                              #{ath?.bib || '—'}
                            </td>
                            <td className="py-2 px-3 font-sans font-bold">
                              {ath ? `${ath.firstName} ${ath.lastName}` : 'Unassigned'}
                            </td>
                            <td className="py-2 px-3 font-sans text-slate-600">
                              {team?.name || 'Unattached'}
                            </td>
                            <td className="py-2 px-2.5 text-center text-slate-600">
                              {item.reactionTime || '0.142'}s
                            </td>
                            <td className="py-2 px-3 text-right font-black text-slate-950">
                              {item.time ? `${item.time}s` : 'NT'}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600">
                              {delta}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Chief Judge Sign-off & World Athletics Compliance Certificate */}
                <div className="border-t-2 border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 uppercase block font-mono-timing text-[11px]">
                      CHIEF PHOTO FINISH JUDGE VERIFICATION:
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      I hereby certify that the times and order of finish shown on this document were determined from the official slit-scan photo finish record in accordance with World Athletics Technical Rule 19.
                    </p>
                    <div className="pt-3 flex items-center justify-between text-xs font-mono-timing text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">CHIEF JUDGE:</span>
                        <strong className="text-slate-900 font-bold">{meetConfig.photoFinishChief}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">STATUS:</span>
                        <span className="font-bold text-emerald-700">VERIFIED & APPROVED</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end space-y-2">
                    <div>
                      <div className="h-8 border-b border-dashed border-slate-400 flex items-end">
                        <span className="text-[11px] font-serif italic text-blue-900 font-bold tracking-wider">
                          {meetConfig.photoFinishChief} &mdash; Official FAT Seal
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono-timing flex justify-between mt-1">
                        <span>Official Signature</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="bg-slate-100 border border-slate-300 rounded p-1.5 text-[10px] font-mono-timing text-slate-600 flex items-center justify-between">
                      <span>SEC/MIN/HRS FAT EVALUATION</span>
                      <span>SYSTEM ID: BPS-FAT-2026-LYNX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
