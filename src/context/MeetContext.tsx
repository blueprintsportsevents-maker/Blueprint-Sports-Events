import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MeetConfig,
  Team,
  Athlete,
  SportEvent,
  HeatLaneAssignment,
  CallRoomInspection,
  PhotoFinishCapture,
  TeamScore,
} from '../types/sports';
import {
  initialMeetConfig,
  initialTeams,
  initialAthletes,
  initialEvents,
  initialHeatAssignments,
  initialCallRoomInspections,
} from '../data/initialData';

interface MeetContextType {
  meetConfig: MeetConfig;
  updateMeetConfig: (updates: Partial<MeetConfig>) => void;
  teams: Team[];
  athletes: Athlete[];
  events: SportEvent[];
  heatAssignments: HeatLaneAssignment[];
  callRoomInspections: CallRoomInspection[];
  photoFinishCaptures: PhotoFinishCapture[];
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Team & Athlete CRUD
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addAthlete: (athlete: Omit<Athlete, 'id'>) => void;
  updateAthlete: (id: string, updates: Partial<Athlete>) => void;
  deleteAthlete: (id: string) => void;
  bulkAssignBibs: (startBib?: number) => void;

  // Event & Seeding
  addEvent: (event: Omit<SportEvent, 'id' | 'entries'>) => void;
  updateEvent: (id: string, updates: Partial<SportEvent>) => void;
  deleteEvent: (id: string) => void;
  addEntryToEvent: (eventId: string, athleteId: string, seedMark: string) => void;
  removeEntryFromEvent: (eventId: string, athleteId: string) => void;
  seedHeatsForEvent: (eventId: string, lanesPattern?: number[]) => void;

  // Lane assignments & Results
  updateHeatAssignment: (id: string, updates: Partial<HeatLaneAssignment>) => void;
  batchUpdateHeatResults: (assignments: HeatLaneAssignment[], wind?: number) => void;

  // Call room
  updateCallRoomStatus: (athleteId: string, eventId: string, updates: Partial<CallRoomInspection>) => void;

  // Photo Finish
  savePhotoFinishCapture: (capture: PhotoFinishCapture) => void;

  // Team points
  teamScores: TeamScore[];

  // Database actions
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;
}

const MeetContext = createContext<MeetContextType | null>(null);

const STORAGE_KEY = 'BLUEPRINT_SPORTS_MEET_DATA_V1';

export const MeetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetConfig, setMeetConfig] = useState<MeetConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CONFIG`);
      return saved ? JSON.parse(saved) : initialMeetConfig;
    } catch {
      return initialMeetConfig;
    }
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TEAMS`);
      return saved ? JSON.parse(saved) : initialTeams;
    } catch {
      return initialTeams;
    }
  });

  const [athletes, setAthletes] = useState<Athlete[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ATHLETES`);
      return saved ? JSON.parse(saved) : initialAthletes;
    } catch {
      return initialAthletes;
    }
  });

  const [events, setEvents] = useState<SportEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_EVENTS`);
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  const [heatAssignments, setHeatAssignments] = useState<HeatLaneAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_HEATS`);
      return saved ? JSON.parse(saved) : initialHeatAssignments;
    } catch {
      return initialHeatAssignments;
    }
  });

  const [callRoomInspections, setCallRoomInspections] = useState<CallRoomInspection[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CALLROOM`);
      return saved ? JSON.parse(saved) : initialCallRoomInspections;
    } catch {
      return initialCallRoomInspections;
    }
  });

  const [photoFinishCaptures, setPhotoFinishCaptures] = useState<PhotoFinishCapture[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('evt-1');
  const [activeTab, setActiveTab] = useState<string>('management');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_CONFIG`, JSON.stringify(meetConfig));
      localStorage.setItem(`${STORAGE_KEY}_TEAMS`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY}_ATHLETES`, JSON.stringify(athletes));
      localStorage.setItem(`${STORAGE_KEY}_EVENTS`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_HEATS`, JSON.stringify(heatAssignments));
      localStorage.setItem(`${STORAGE_KEY}_CALLROOM`, JSON.stringify(callRoomInspections));
    } catch (e) {
      console.error('Failed to sync to local storage', e);
    }
  }, [meetConfig, teams, athletes, events, heatAssignments, callRoomInspections]);

  const updateMeetConfig = (updates: Partial<MeetConfig>) => {
    setMeetConfig(prev => ({ ...prev, ...updates }));
  };

  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const addAthlete = (athleteData: Omit<Athlete, 'id'>) => {
    const newAthlete: Athlete = {
      ...athleteData,
      id: `ath-${Date.now()}`
    };
    setAthletes(prev => [...prev, newAthlete]);
  };

  const updateAthlete = (id: string, updates: Partial<Athlete>) => {
    setAthletes(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAthlete = (id: string) => {
    setAthletes(prev => prev.filter(a => a.id !== id));
    setHeatAssignments(prev => prev.filter(h => h.athleteId !== id));
    setCallRoomInspections(prev => prev.filter(c => c.athleteId !== id));
  };

  const bulkAssignBibs = (startBib: number = 101) => {
    let current = startBib;
    setAthletes(prev =>
      prev.map(a => ({
        ...a,
        bib: current++
      }))
    );
  };

  const addEvent = (eventData: Omit<SportEvent, 'id' | 'entries'>) => {
    const newEvent: SportEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      entries: []
    };
    setEvents(prev => [...prev, newEvent]);
    if (!activeEventId) setActiveEventId(newEvent.id);
  };

  const updateEvent = (id: string, updates: Partial<SportEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setHeatAssignments(prev => prev.filter(h => h.eventId !== id));
    setCallRoomInspections(prev => prev.filter(c => c.eventId !== id));
    if (activeEventId === id) {
      const remaining = events.filter(e => e.id !== id);
      if (remaining.length > 0) setActiveEventId(remaining[0].id);
    }
  };

  const addEntryToEvent = (eventId: string, athleteId: string, seedMark: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        if (evt.entries.some(e => e.athleteId === athleteId)) return evt;
        return {
          ...evt,
          entries: [...evt.entries, { athleteId, seedMark, confirmed: true }]
        };
      })
    );
  };

  const removeEntryFromEvent = (eventId: string, athleteId: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        return {
          ...evt,
          entries: evt.entries.filter(e => e.athleteId !== athleteId)
        };
      })
    );
    setHeatAssignments(prev => prev.filter(h => !(h.eventId === eventId && h.athleteId === athleteId)));
    setCallRoomInspections(prev => prev.filter(c => !(c.eventId === eventId && c.athleteId === athleteId)));
  };

  // Seeding engine: Serpentine & preferred lane drawing (4, 5, 3, 6, 2, 7, 1, 8)
  const seedHeatsForEvent = (eventId: string, customLaneDraw?: number[]) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent || targetEvent.entries.length === 0) return;

    const trackLanesCount = targetEvent.laneCount || meetConfig.defaultTrackLanes || 8;
    const preferredLanes = customLaneDraw || targetEvent.lanesConfiguration || [4, 5, 3, 6, 2, 7, 1, 8].slice(0, trackLanesCount);

    // Sort entries by seedMark (assuming track is fastest first, field is farthest first)
    const sortedEntries = [...targetEvent.entries].sort((a, b) => {
      const numA = parseFloat(a.seedMark) || 999;
      const numB = parseFloat(b.seedMark) || 999;
      return targetEvent.type === 'field' ? numB - numA : numA - numB;
    });

    const numAthletes = sortedEntries.length;
    const numHeats = Math.max(1, Math.ceil(numAthletes / trackLanesCount));

    // Serpentine distribution across heats
    const heatsBuckets: { athleteId: string; seedMark: string }[][] = Array.from({ length: numHeats }, () => []);

    let heatIndex = 0;
    let direction = 1;

    sortedEntries.forEach((entry) => {
      heatsBuckets[heatIndex].push(entry);
      heatIndex += direction;
      if (heatIndex >= numHeats) {
        heatIndex = numHeats - 1;
        direction = -1;
      } else if (heatIndex < 0) {
        heatIndex = 0;
        direction = 1;
      }
    });

    const newAssignments: HeatLaneAssignment[] = [];
    const newCallRoom: CallRoomInspection[] = [];

    heatsBuckets.forEach((heatAthletes, hIdx) => {
      const heatNumber = hIdx + 1;
      heatAthletes.forEach((athleteEntry, aIdx) => {
        const lane = preferredLanes[aIdx % preferredLanes.length] || (aIdx + 1);
        const assignId = `hl-${eventId}-${heatNumber}-${lane}-${Date.now().toString().slice(-4)}`;

        newAssignments.push({
          id: assignId,
          eventId,
          heatNumber,
          lane,
          athleteId: athleteEntry.athleteId,
          seedMark: athleteEntry.seedMark,
          status: 'OK'
        });

        newCallRoom.push({
          athleteId: athleteEntry.athleteId,
          eventId,
          heatNumber,
          lane,
          status: 'Not Reported',
          hipNumberAssigned: lane,
          spikeLengthMm: meetConfig.maxSpikeLengthMm || 7,
          uniformApproved: false
        });
      });
    });

    // Remove old assignments for this event
    setHeatAssignments(prev => [...prev.filter(h => h.eventId !== eventId), ...newAssignments]);
    setCallRoomInspections(prev => [...prev.filter(c => c.eventId !== eventId), ...newCallRoom]);
  };

  const updateHeatAssignment = (id: string, updates: Partial<HeatLaneAssignment>) => {
    setHeatAssignments(prev =>
      prev.map(h => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const batchUpdateHeatResults = (assignments: HeatLaneAssignment[], wind?: number) => {
    setHeatAssignments(prev => {
      const updatedMap = new Map(assignments.map(a => [a.id, a]));
      return prev.map(item => {
        if (updatedMap.has(item.id)) {
          const fresh = updatedMap.get(item.id)!;
          return {
            ...item,
            ...fresh,
            wind: wind !== undefined ? wind : item.wind
          };
        }
        return item;
      });
    });
  };

  const updateCallRoomStatus = (athleteId: string, eventId: string, updates: Partial<CallRoomInspection>) => {
    setCallRoomInspections(prev =>
      prev.map(c =>
        c.athleteId === athleteId && c.eventId === eventId ? { ...c, ...updates } : c
      )
    );
  };

  const savePhotoFinishCapture = (capture: PhotoFinishCapture) => {
    setPhotoFinishCaptures(prev => [capture, ...prev]);
  };

  // Points calculation engine
  const teamScores = useMemo<TeamScore[]>(() => {
    // Scoring scale
    let pointsScale = [10, 8, 6, 5, 4, 3, 2, 1];
    if (meetConfig.pointsPreset === '10-8-6-4-2-1') {
      pointsScale = [10, 8, 6, 4, 2, 1];
    } else if (meetConfig.pointsPreset === '9-7-6-5-4-3-2-1') {
      pointsScale = [9, 7, 6, 5, 4, 3, 2, 1];
    } else if (meetConfig.pointsPreset === 'Custom' && meetConfig.customPoints) {
      pointsScale = meetConfig.customPoints;
    }

    const teamScoresMap: { [teamId: string]: TeamScore } = {};
    teams.forEach(t => {
      teamScoresMap[t.id] = {
        teamId: t.id,
        teamName: t.name,
        shortCode: t.shortCode,
        color: t.color,
        mensPoints: 0,
        womensPoints: 0,
        totalPoints: 0,
        goldCount: 0,
        silverCount: 0,
        bronzeCount: 0,
        eventBreakdown: []
      };
    });

    const athleteMap = new Map(athletes.map(a => [a.id, a]));
    const eventMap = new Map(events.map(e => [e.id, e]));

    // Evaluate completed/official events
    events.forEach(evt => {
      const assignments = heatAssignments.filter(h => h.eventId === evt.id && h.status === 'OK' && h.time);
      if (assignments.length === 0) return;

      // Group assignments or take finals
      const rankedAssignments = [...assignments]
        .filter(a => a.rank && a.rank > 0)
        .sort((a, b) => (a.rank || 99) - (b.rank || 99));

      rankedAssignments.forEach(assign => {
        const rank = assign.rank || 99;
        const pts = pointsScale[rank - 1] || 0;
        if (pts <= 0) return;

        const athlete = assign.athleteId ? athleteMap.get(assign.athleteId) : null;
        const teamId = athlete?.teamId || assign.teamId;

        if (teamId && teamScoresMap[teamId]) {
          const entry = teamScoresMap[teamId];
          entry.totalPoints += pts;

          if (evt.gender === 'Men') {
            entry.mensPoints += pts;
          } else if (evt.gender === 'Women') {
            entry.womensPoints += pts;
          }

          if (rank === 1) entry.goldCount += 1;
          if (rank === 2) entry.silverCount += 1;
          if (rank === 3) entry.bronzeCount += 1;

          entry.eventBreakdown.push({
            eventId: evt.id,
            eventName: `${evt.name} (${evt.round})`,
            athleteName: athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Relay Team',
            rank,
            points: pts
          });
        }
      });
    });

    return Object.values(teamScoresMap).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
      if (b.silverCount !== a.silverCount) return b.silverCount - a.silverCount;
      return b.bronzeCount - a.bronzeCount;
    });
  }, [teams, athletes, events, heatAssignments, meetConfig]);

  const exportDatabaseJSON = (): string => {
    const data = {
      meetConfig,
      teams,
      athletes,
      events,
      heatAssignments,
      callRoomInspections,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.meetConfig && data.teams && data.events) {
        setMeetConfig(data.meetConfig);
        setTeams(data.teams);
        setAthletes(data.athletes || []);
        setEvents(data.events);
        setHeatAssignments(data.heatAssignments || []);
        setCallRoomInspections(data.callRoomInspections || []);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToSampleData = () => {
    setMeetConfig(initialMeetConfig);
    setTeams(initialTeams);
    setAthletes(initialAthletes);
    setEvents(initialEvents);
    setHeatAssignments(initialHeatAssignments);
    setCallRoomInspections(initialCallRoomInspections);
    setActiveEventId('evt-1');
  };

  return (
    <MeetContext.Provider
      value={{
        meetConfig,
        updateMeetConfig,
        teams,
        athletes,
        events,
        heatAssignments,
        callRoomInspections,
        photoFinishCaptures,
        activeEventId,
        setActiveEventId,
        activeTab,
        setActiveTab,
        addTeam,
        updateTeam,
        deleteTeam,
        addAthlete,
        updateAthlete,
        deleteAthlete,
        bulkAssignBibs,
        addEvent,
        updateEvent,
        deleteEvent,
        addEntryToEvent,
        removeEntryFromEvent,
        seedHeatsForEvent,
        updateHeatAssignment,
        batchUpdateHeatResults,
        updateCallRoomStatus,
        savePhotoFinishCapture,
        teamScores,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToSampleData,
      }}
    >
      {children}
    </MeetContext.Provider>
  );
};

export const useMeet = () => {
  const context = useContext(MeetContext);
  if (!context) {
    throw new Error('useMeet must be used within a MeetProvider');
  }
  return context;
};
