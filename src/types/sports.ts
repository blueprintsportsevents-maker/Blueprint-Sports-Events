export type Gender = 'Men' | 'Women' | 'Mixed';

export type AgeCategory = 'Open' | 'Senior' | 'U20' | 'U18' | 'U16' | 'Masters';

export type EventType = 'track' | 'field' | 'relay';

export type FieldMeasurementType = 'distance' | 'height';

export type RoundType = 'Prelims' | 'Semifinals' | 'Finals';

export type CheckInStatus = 'Not Reported' | 'Checked In' | 'Uniform Checked' | 'Spikes Checked' | 'Cleared' | 'DNS' | 'Scratched';

export interface Team {
  id: string;
  name: string;
  shortCode: string;
  color: string;
  secondaryColor?: string;
  coach: string;
  city: string;
  stateCountry: string;
  division?: string;
  district?: string;
}

export interface Athlete {
  id: string;
  bib: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  category: AgeCategory;
  teamId: string;
  district?: string;
  state?: string;
  dateOfBirth?: string;
  medicalCleared: boolean;
  waiverSigned: boolean;
  notes?: string;
}

export interface EventEntry {
  athleteId: string;
  seedMark: string; // e.g., "10.05" or "8.15m"
  seedSeconds?: number;
  confirmed: boolean;
  heatNumber?: number;
  laneNumber?: number;
}

export interface RelayTeamEntry {
  teamId: string;
  seedMark: string;
  seedSeconds?: number;
  confirmed: boolean;
  heatNumber?: number;
  laneNumber?: number;
  runnerIds: string[];
}

export interface SportEvent {
  id: string;
  name: string;
  gender: Gender;
  category: AgeCategory;
  type: EventType;
  distanceOrApparatus: string; // "100m", "400m Hurdles", "Long Jump", "4x100m"
  round: RoundType;
  scheduledTime: string;
  status: 'Scheduled' | 'Call Room Open' | 'At Starting Line' | 'In Progress' | 'Unofficial' | 'Official';
  meetRecord?: { mark: string; holder: string; year: string };
  worldRecord?: { mark: string; holder: string; year: string };
  nationalRecord?: { mark: string; holder: string; year: string };
  windLegalThreshold?: number; // default 2.0
  laneCount: number;
  lanesConfiguration?: number[]; // [4, 5, 3, 6, 2, 7, 1, 8]
  qualifyingRule?: string; // "Top 2 in each heat + 2 fastest times (2Q + 2q)"
  autoQualifiersPerHeat?: number; // 2
  fastestQualifiers?: number; // 2
  entries: EventEntry[];
  relayEntries?: RelayTeamEntry[];
}

export interface HeatLaneAssignment {
  id: string;
  eventId: string;
  heatNumber: number;
  lane: number;
  athleteId?: string;
  teamId?: string; // for relays
  relayRunners?: string[];
  seedMark: string;
  time?: string; // official mark e.g., "9.98"
  reactionTime?: string; // e.g. "0.142"
  wind?: number; // e.g. 1.2
  windAssisted?: boolean;
  rank?: number;
  qualificationCode?: 'Q' | 'q' | 'qR' | 'qJ' | '';
  status?: 'OK' | 'DNS' | 'DNF' | 'DQ' | 'NM' | 'FS'; // FS = False Start
  photoFinishTimestamp?: number; // precise millisecond reading
  judgeNotes?: string;
}

export interface CallRoomInspection {
  athleteId: string;
  eventId: string;
  heatNumber: number;
  lane: number;
  status: CheckInStatus;
  hipNumberAssigned: number;
  spikeLengthMm: number; // e.g., 7mm
  uniformApproved: boolean;
  timeCheckedIn?: string;
}

export interface PhotoFinishCapture {
  id: string;
  eventId: string;
  heatNumber: number;
  canvasDataUrl?: string;
  cursorTimeMs: number;
  windGauge: number;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  laneReadings: {
    lane: number;
    bib: number;
    athleteName: string;
    calculatedTime: string;
    reactionTime: string;
  }[];
}

export interface TeamScore {
  teamId: string;
  teamName: string;
  shortCode: string;
  color: string;
  mensPoints: number;
  womensPoints: number;
  totalPoints: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  eventBreakdown: {
    eventId: string;
    eventName: string;
    athleteName: string;
    rank: number;
    points: number;
  }[];
}

export interface MeetConfig {
  name: string;
  subtitle: string;
  venueName: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  timingSystem: 'Fully Automatic Timing (FAT)' | 'Hand Timed (HT)' | 'Transponder RFID';
  pointsPreset: '10-8-6-5-4-3-2-1' | '10-8-6-4-2-1' | '9-7-6-5-4-3-2-1' | 'Custom';
  customPoints?: number[];
  meetDirector: string;
  chiefReferee: string;
  photoFinishChief: string;
  starterChief: string;
  defaultTrackLanes: number;
  maxSpikeLengthMm: number;
  isOfficialLock: boolean;
}
