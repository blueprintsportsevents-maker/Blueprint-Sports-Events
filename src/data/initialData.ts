import { Team, Athlete, SportEvent, HeatLaneAssignment, CallRoomInspection, MeetConfig } from '../types/sports';

export const initialMeetConfig: MeetConfig = {
  name: "BLUEPRINT NATIONAL INVITATIONAL & GRAND PRIX",
  subtitle: "World Athletics Continental Tour - Gold Level",
  venueName: "Blueprint Olympic Athletics Stadium",
  city: "San Francisco, CA",
  country: "United States",
  startDate: "2026-09-29",
  endDate: "2026-09-30",
  timingSystem: "Fully Automatic Timing (FAT)",
  pointsPreset: "10-8-6-5-4-3-2-1",
  meetDirector: "Dr. Marcus Vance",
  chiefReferee: "Elena Rostova (WA Level III)",
  photoFinishChief: "James McCarron",
  starterChief: "Otis Sterling",
  defaultTrackLanes: 8,
  maxSpikeLengthMm: 7,
  isOfficialLock: false,
};

export const initialTeams: Team[] = [
  { id: 'team-1', name: 'Blueprint Athletics Club', shortCode: 'BLUE', color: '#2563eb', secondaryColor: '#60a5fa', coach: 'D. Robinson', city: 'San Francisco', stateCountry: 'CA, USA', division: 'Division I', district: 'District 1' },
  { id: 'team-2', name: 'Metro Speed Academy', shortCode: 'MET', color: '#dc2626', secondaryColor: '#f87171', coach: 'K. Washington', city: 'Chicago', stateCountry: 'IL, USA', division: 'Division I', district: 'District 2' },
  { id: 'team-3', name: 'Apex Track & Field Club', shortCode: 'APX', color: '#16a34a', secondaryColor: '#4ade80', coach: 'S. Campbell', city: 'Atlanta', stateCountry: 'GA, USA', division: 'Division I', district: 'District 3' },
  { id: 'team-4', name: 'Titan Sprint Syndicate', shortCode: 'TTN', color: '#d97706', secondaryColor: '#fbbf24', coach: 'R. Mendez', city: 'Dallas', stateCountry: 'TX, USA', division: 'Division I', district: 'District 4' },
  { id: 'team-5', name: 'Horizon Elite Striders', shortCode: 'HRZ', color: '#7c3aed', secondaryColor: '#a78bfa', coach: 'A. Thorne', city: 'Eugene', stateCountry: 'OR, USA', division: 'Division I', district: 'District 5' },
  { id: 'team-6', name: 'Coastline Athletic Club', shortCode: 'CST', color: '#0891b2', secondaryColor: '#22d3ee', coach: 'M. Dubois', city: 'San Diego', stateCountry: 'CA, USA', division: 'Division I', district: 'District 1' },
  { id: 'team-7', name: 'Summit Distance Project', shortCode: 'SMT', color: '#059669', secondaryColor: '#34d399', coach: 'E. Kipchumba', city: 'Boulder', stateCountry: 'CO, USA', division: 'Division I', district: 'District 6' },
  { id: 'team-8', name: 'Quantum Velocity Club', shortCode: 'QNT', color: '#db2777', secondaryColor: '#f472b6', coach: 'P. Novak', city: 'Toronto', stateCountry: 'ON, CAN', division: 'Division I', district: 'District 2' }
];

export const initialAthletes: Athlete[] = [
  // Men Sprinters
  { id: 'ath-101', bib: 101, firstName: 'Trevon', lastName: 'Cole', gender: 'Men', category: 'Senior', teamId: 'team-1', medicalCleared: true, waiverSigned: true },
  { id: 'ath-102', bib: 102, firstName: 'Andre', lastName: 'DeGrasse-Brown', gender: 'Men', category: 'Senior', teamId: 'team-2', medicalCleared: true, waiverSigned: true },
  { id: 'ath-103', bib: 103, firstName: 'Kobe', lastName: 'Adeyemi', gender: 'Men', category: 'Senior', teamId: 'team-3', medicalCleared: true, waiverSigned: true },
  { id: 'ath-104', bib: 104, firstName: 'Malik', lastName: 'Sterling', gender: 'Men', category: 'Senior', teamId: 'team-4', medicalCleared: true, waiverSigned: true },
  { id: 'ath-105', bib: 105, firstName: 'Julian', lastName: 'Forte', gender: 'Men', category: 'Senior', teamId: 'team-5', medicalCleared: true, waiverSigned: true },
  { id: 'ath-106', bib: 106, firstName: 'Liam', lastName: 'Chen', gender: 'Men', category: 'Senior', teamId: 'team-6', medicalCleared: true, waiverSigned: true },
  { id: 'ath-107', bib: 107, firstName: 'Darius', lastName: 'Vaughn', gender: 'Men', category: 'Senior', teamId: 'team-1', medicalCleared: true, waiverSigned: true },
  { id: 'ath-108', bib: 108, firstName: 'Kenzo', lastName: 'Takahashi', gender: 'Men', category: 'Senior', teamId: 'team-8', medicalCleared: true, waiverSigned: true },

  // Women Sprinters
  { id: 'ath-201', bib: 201, firstName: 'Brianna', lastName: 'Holloway', gender: 'Women', category: 'Senior', teamId: 'team-1', medicalCleared: true, waiverSigned: true },
  { id: 'ath-202', bib: 202, firstName: 'Camille', lastName: 'St. Claire', gender: 'Women', category: 'Senior', teamId: 'team-3', medicalCleared: true, waiverSigned: true },
  { id: 'ath-203', bib: 203, firstName: 'Zaria', lastName: 'Jefferson', gender: 'Women', category: 'Senior', teamId: 'team-2', medicalCleared: true, waiverSigned: true },
  { id: 'ath-204', bib: 204, firstName: 'Natasha', lastName: 'Kovalenko', gender: 'Women', category: 'Senior', teamId: 'team-4', medicalCleared: true, waiverSigned: true },
  { id: 'ath-205', bib: 205, firstName: 'Chloe', lastName: 'Sinclair', gender: 'Women', category: 'Senior', teamId: 'team-5', medicalCleared: true, waiverSigned: true },
  { id: 'ath-206', bib: 206, firstName: 'Maya', lastName: 'Alvarez', gender: 'Women', category: 'Senior', teamId: 'team-6', medicalCleared: true, waiverSigned: true },
  { id: 'ath-207', bib: 207, firstName: 'Khadija', lastName: 'Sylla', gender: 'Women', category: 'Senior', teamId: 'team-7', medicalCleared: true, waiverSigned: true },
  { id: 'ath-208', bib: 208, firstName: 'Sierra', lastName: 'Gomez', gender: 'Women', category: 'Senior', teamId: 'team-8', medicalCleared: true, waiverSigned: true },

  // Men Hurdles & 400m
  { id: 'ath-109', bib: 109, firstName: 'Devon', lastName: 'Allen-Brooks', gender: 'Men', category: 'Senior', teamId: 'team-1', medicalCleared: true, waiverSigned: true },
  { id: 'ath-110', bib: 110, firstName: 'Grant', lastName: 'Holloway-Smith', gender: 'Men', category: 'Senior', teamId: 'team-2', medicalCleared: true, waiverSigned: true },
  { id: 'ath-111', bib: 111, firstName: 'Rai', lastName: 'Benjamin-Cruz', gender: 'Men', category: 'Senior', teamId: 'team-3', medicalCleared: true, waiverSigned: true },
  { id: 'ath-112', bib: 112, firstName: 'Kyron', lastName: 'McMaster-Hall', gender: 'Men', category: 'Senior', teamId: 'team-5', medicalCleared: true, waiverSigned: true },

  // Men 800m / Distance
  { id: 'ath-113', bib: 113, firstName: 'Donavan', lastName: 'Brazier-Cole', gender: 'Men', category: 'Senior', teamId: 'team-7', medicalCleared: true, waiverSigned: true },
  { id: 'ath-114', bib: 114, firstName: 'Emmanuel', lastName: 'Korir-Simba', gender: 'Men', category: 'Senior', teamId: 'team-7', medicalCleared: true, waiverSigned: true },
  { id: 'ath-115', bib: 115, firstName: 'Bryce', lastName: 'Hoppel-Stone', gender: 'Men', category: 'Senior', teamId: 'team-3', medicalCleared: true, waiverSigned: true },
  { id: 'ath-116', bib: 116, firstName: 'Marco', lastName: 'Arop-Miller', gender: 'Men', category: 'Senior', teamId: 'team-8', medicalCleared: true, waiverSigned: true },

  // Women 400m
  { id: 'ath-209', bib: 209, firstName: 'Sydney', lastName: 'McLaughlin-Lee', gender: 'Women', category: 'Senior', teamId: 'team-1', medicalCleared: true, waiverSigned: true },
  { id: 'ath-210', bib: 210, firstName: 'Femke', lastName: 'Bol-Vander', gender: 'Women', category: 'Senior', teamId: 'team-5', medicalCleared: true, waiverSigned: true },
  { id: 'ath-211', bib: 211, firstName: 'Marileidy', lastName: 'Paulino-Rios', gender: 'Women', category: 'Senior', teamId: 'team-4', medicalCleared: true, waiverSigned: true },
  { id: 'ath-212', bib: 212, firstName: 'Salwa', lastName: 'Eid-Nasser', gender: 'Women', category: 'Senior', teamId: 'team-6', medicalCleared: true, waiverSigned: true },

  // Women Long Jump
  { id: 'ath-213', bib: 213, firstName: 'Tara', lastName: 'Davis-Woodhall', gender: 'Women', category: 'Senior', teamId: 'team-1', medicalCleared: true, waiverSigned: true },
  { id: 'ath-214', bib: 214, firstName: 'Malaika', lastName: 'Mihambo-Weber', gender: 'Women', category: 'Senior', teamId: 'team-2', medicalCleared: true, waiverSigned: true },
  { id: 'ath-215', bib: 215, firstName: 'Ese', lastName: 'Brume-Eze', gender: 'Women', category: 'Senior', teamId: 'team-3', medicalCleared: true, waiverSigned: true },
  { id: 'ath-216', bib: 216, firstName: 'Larissa', lastName: 'Iapichino-Rossi', gender: 'Women', category: 'Senior', teamId: 'team-8', medicalCleared: true, waiverSigned: true },
];

export const initialEvents: SportEvent[] = [
  {
    id: 'evt-1',
    name: "Men's 100m Championship",
    gender: 'Men',
    category: 'Senior',
    type: 'track',
    distanceOrApparatus: '100m',
    round: 'Finals',
    scheduledTime: '15:30',
    status: 'Official',
    meetRecord: { mark: '9.88', holder: 'Trevon Cole', year: '2024' },
    worldRecord: { mark: '9.58', holder: 'Usain Bolt', year: '2009' },
    nationalRecord: { mark: '9.69', holder: 'Tyson Gay', year: '2009' },
    windLegalThreshold: 2.0,
    laneCount: 8,
    lanesConfiguration: [4, 5, 3, 6, 2, 7, 1, 8],
    qualifyingRule: 'Final (Top 8)',
    entries: [
      { athleteId: 'ath-101', seedMark: '9.86', confirmed: true },
      { athleteId: 'ath-102', seedMark: '9.89', confirmed: true },
      { athleteId: 'ath-103', seedMark: '9.92', confirmed: true },
      { athleteId: 'ath-104', seedMark: '9.95', confirmed: true },
      { athleteId: 'ath-105', seedMark: '9.99', confirmed: true },
      { athleteId: 'ath-106', seedMark: '10.04', confirmed: true },
      { athleteId: 'ath-107', seedMark: '10.08', confirmed: true },
      { athleteId: 'ath-108', seedMark: '10.12', confirmed: true },
    ]
  },
  {
    id: 'evt-2',
    name: "Women's 100m Championship",
    gender: 'Women',
    category: 'Senior',
    type: 'track',
    distanceOrApparatus: '100m',
    round: 'Finals',
    scheduledTime: '15:45',
    status: 'Official',
    meetRecord: { mark: '10.74', holder: 'Brianna Holloway', year: '2025' },
    worldRecord: { mark: '10.49', holder: 'Florence Griffith-Joyner', year: '1988' },
    nationalRecord: { mark: '10.65', holder: 'Marion Jones', year: '1998' },
    windLegalThreshold: 2.0,
    laneCount: 8,
    lanesConfiguration: [4, 5, 3, 6, 2, 7, 1, 8],
    qualifyingRule: 'Final (Top 8)',
    entries: [
      { athleteId: 'ath-201', seedMark: '10.72', confirmed: true },
      { athleteId: 'ath-202', seedMark: '10.79', confirmed: true },
      { athleteId: 'ath-203', seedMark: '10.84', confirmed: true },
      { athleteId: 'ath-204', seedMark: '10.91', confirmed: true },
      { athleteId: 'ath-205', seedMark: '10.96', confirmed: true },
      { athleteId: 'ath-206', seedMark: '11.02', confirmed: true },
      { athleteId: 'ath-207', seedMark: '11.09', confirmed: true },
      { athleteId: 'ath-208', seedMark: '11.15', confirmed: true },
    ]
  },
  {
    id: 'evt-3',
    name: "Men's 110m Hurdles",
    gender: 'Men',
    category: 'Senior',
    type: 'track',
    distanceOrApparatus: '110m Hurdles',
    round: 'Finals',
    scheduledTime: '16:10',
    status: 'In Progress',
    meetRecord: { mark: '12.98', holder: 'Devon Allen-Brooks', year: '2025' },
    worldRecord: { mark: '12.80', holder: 'Aries Merritt', year: '2012' },
    nationalRecord: { mark: '12.80', holder: 'Aries Merritt', year: '2012' },
    windLegalThreshold: 2.0,
    laneCount: 8,
    lanesConfiguration: [4, 5, 3, 6, 2, 7, 1, 8],
    qualifyingRule: 'Final (Top 8)',
    entries: [
      { athleteId: 'ath-109', seedMark: '12.94', confirmed: true },
      { athleteId: 'ath-110', seedMark: '12.91', confirmed: true },
      { athleteId: 'ath-111', seedMark: '13.04', confirmed: true },
      { athleteId: 'ath-112', seedMark: '13.15', confirmed: true },
      { athleteId: 'ath-103', seedMark: '13.22', confirmed: true },
      { athleteId: 'ath-104', seedMark: '13.30', confirmed: true },
    ]
  },
  {
    id: 'evt-4',
    name: "Women's 400m Dash",
    gender: 'Women',
    category: 'Senior',
    type: 'track',
    distanceOrApparatus: '400m',
    round: 'Finals',
    scheduledTime: '16:30',
    status: 'Call Room Open',
    meetRecord: { mark: '48.95', holder: 'Sydney McLaughlin-Lee', year: '2025' },
    worldRecord: { mark: '47.60', holder: 'Marita Koch', year: '1985' },
    nationalRecord: { mark: '48.70', holder: 'Sanya Richards-Ross', year: '2006' },
    laneCount: 8,
    qualifyingRule: 'Final (Top 8)',
    entries: [
      { athleteId: 'ath-209', seedMark: '48.74', confirmed: true },
      { athleteId: 'ath-210', seedMark: '49.12', confirmed: true },
      { athleteId: 'ath-211', seedMark: '49.20', confirmed: true },
      { athleteId: 'ath-212', seedMark: '49.50', confirmed: true },
      { athleteId: 'ath-203', seedMark: '50.10', confirmed: true },
      { athleteId: 'ath-204', seedMark: '50.45', confirmed: true },
    ]
  },
  {
    id: 'evt-5',
    name: "Men's 800m Run",
    gender: 'Men',
    category: 'Senior',
    type: 'track',
    distanceOrApparatus: '800m',
    round: 'Finals',
    scheduledTime: '16:50',
    status: 'Scheduled',
    meetRecord: { mark: '1:42.50', holder: 'Donavan Brazier', year: '2023' },
    worldRecord: { mark: '1:40.91', holder: 'David Rudisha', year: '2012' },
    nationalRecord: { mark: '1:41.67', holder: 'Bryce Hoppel', year: '2024' },
    laneCount: 8,
    qualifyingRule: 'Final (Top 8)',
    entries: [
      { athleteId: 'ath-113', seedMark: '1:42.34', confirmed: true },
      { athleteId: 'ath-114', seedMark: '1:42.50', confirmed: true },
      { athleteId: 'ath-115', seedMark: '1:42.88', confirmed: true },
      { athleteId: 'ath-116', seedMark: '1:43.05', confirmed: true },
      { athleteId: 'ath-105', seedMark: '1:44.20', confirmed: true },
      { athleteId: 'ath-106', seedMark: '1:44.80', confirmed: true },
    ]
  },
  {
    id: 'evt-6',
    name: "Women's Long Jump",
    gender: 'Women',
    category: 'Senior',
    type: 'field',
    distanceOrApparatus: 'Long Jump',
    round: 'Finals',
    scheduledTime: '15:00',
    status: 'Official',
    meetRecord: { mark: '7.12m', holder: 'Tara Davis-Woodhall', year: '2025' },
    worldRecord: { mark: '7.52m', holder: 'Galina Chistyakova', year: '1988' },
    nationalRecord: { mark: '7.49m', holder: 'Jackie Joyner-Kersee', year: '1994' },
    windLegalThreshold: 2.0,
    laneCount: 1,
    qualifyingRule: '6 attempts (Top 8)',
    entries: [
      { athleteId: 'ath-213', seedMark: '7.18m', confirmed: true },
      { athleteId: 'ath-214', seedMark: '7.15m', confirmed: true },
      { athleteId: 'ath-215', seedMark: '7.08m', confirmed: true },
      { athleteId: 'ath-216', seedMark: '6.95m', confirmed: true },
      { athleteId: 'ath-205', seedMark: '6.72m', confirmed: true },
      { athleteId: 'ath-206', seedMark: '6.65m', confirmed: true },
    ]
  }
];

export const initialHeatAssignments: HeatLaneAssignment[] = [
  // Men's 100m Final (evt-1)
  {
    id: 'hl-1-4',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 4,
    athleteId: 'ath-101', // Trevon Cole
    seedMark: '9.86',
    time: '9.84',
    reactionTime: '0.138',
    wind: 1.4,
    windAssisted: false,
    rank: 1,
    qualificationCode: 'Q',
    status: 'OK',
    photoFinishTimestamp: 9840,
    judgeNotes: 'MR - New Meet Record! Torso crossed finish line cleanly.'
  },
  {
    id: 'hl-1-5',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 5,
    athleteId: 'ath-102', // Andre DeGrasse-Brown
    seedMark: '9.89',
    time: '9.88',
    reactionTime: '0.142',
    wind: 1.4,
    windAssisted: false,
    rank: 2,
    qualificationCode: 'Q',
    status: 'OK',
    photoFinishTimestamp: 9880
  },
  {
    id: 'hl-1-3',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 3,
    athleteId: 'ath-103', // Kobe Adeyemi
    seedMark: '9.92',
    time: '9.93',
    reactionTime: '0.151',
    wind: 1.4,
    windAssisted: false,
    rank: 3,
    qualificationCode: 'Q',
    status: 'OK',
    photoFinishTimestamp: 9930
  },
  {
    id: 'hl-1-6',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 6,
    athleteId: 'ath-104', // Malik Sterling
    seedMark: '9.95',
    time: '9.97',
    reactionTime: '0.148',
    wind: 1.4,
    windAssisted: false,
    rank: 4,
    qualificationCode: 'q',
    status: 'OK',
    photoFinishTimestamp: 9970
  },
  {
    id: 'hl-1-2',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 2,
    athleteId: 'ath-105', // Julian Forte
    seedMark: '9.99',
    time: '10.02',
    reactionTime: '0.158',
    wind: 1.4,
    windAssisted: false,
    rank: 5,
    qualificationCode: 'q',
    status: 'OK',
    photoFinishTimestamp: 10020
  },
  {
    id: 'hl-1-7',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 7,
    athleteId: 'ath-106', // Liam Chen
    seedMark: '10.04',
    time: '10.06',
    reactionTime: '0.162',
    wind: 1.4,
    windAssisted: false,
    rank: 6,
    status: 'OK',
    photoFinishTimestamp: 10060
  },
  {
    id: 'hl-1-1',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 1,
    athleteId: 'ath-107', // Darius Vaughn
    seedMark: '10.08',
    time: '10.11',
    reactionTime: '0.165',
    wind: 1.4,
    windAssisted: false,
    rank: 7,
    status: 'OK',
    photoFinishTimestamp: 10110
  },
  {
    id: 'hl-1-8',
    eventId: 'evt-1',
    heatNumber: 1,
    lane: 8,
    athleteId: 'ath-108', // Kenzo Takahashi
    seedMark: '10.12',
    time: '10.15',
    reactionTime: '0.154',
    wind: 1.4,
    windAssisted: false,
    rank: 8,
    status: 'OK',
    photoFinishTimestamp: 10150
  },

  // Women's 100m Final (evt-2)
  {
    id: 'hl-2-4',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 4,
    athleteId: 'ath-201', // Brianna Holloway
    seedMark: '10.72',
    time: '10.68',
    reactionTime: '0.134',
    wind: 0.9,
    windAssisted: false,
    rank: 1,
    qualificationCode: 'Q',
    status: 'OK',
    photoFinishTimestamp: 10680,
    judgeNotes: 'MR - Meet Record Broken!'
  },
  {
    id: 'hl-2-5',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 5,
    athleteId: 'ath-202', // Camille St. Claire
    seedMark: '10.79',
    time: '10.75',
    reactionTime: '0.140',
    wind: 0.9,
    windAssisted: false,
    rank: 2,
    qualificationCode: 'Q',
    status: 'OK',
    photoFinishTimestamp: 10750
  },
  {
    id: 'hl-2-3',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 3,
    athleteId: 'ath-203', // Zaria Jefferson
    seedMark: '10.84',
    time: '10.82',
    reactionTime: '0.145',
    wind: 0.9,
    windAssisted: false,
    rank: 3,
    qualificationCode: 'Q',
    status: 'OK',
    photoFinishTimestamp: 10820
  },
  {
    id: 'hl-2-6',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 6,
    athleteId: 'ath-204', // Natasha Kovalenko
    seedMark: '10.91',
    time: '10.89',
    reactionTime: '0.149',
    wind: 0.9,
    windAssisted: false,
    rank: 4,
    qualificationCode: 'q',
    status: 'OK',
    photoFinishTimestamp: 10890
  },
  {
    id: 'hl-2-2',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 2,
    athleteId: 'ath-205', // Chloe Sinclair
    seedMark: '10.96',
    time: '10.95',
    reactionTime: '0.155',
    wind: 0.9,
    windAssisted: false,
    rank: 5,
    qualificationCode: 'q',
    status: 'OK',
    photoFinishTimestamp: 10950
  },
  {
    id: 'hl-2-7',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 7,
    athleteId: 'ath-206', // Maya Alvarez
    seedMark: '11.02',
    time: '11.01',
    reactionTime: '0.160',
    wind: 0.9,
    windAssisted: false,
    rank: 6,
    status: 'OK',
    photoFinishTimestamp: 11010
  },
  {
    id: 'hl-2-1',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 1,
    athleteId: 'ath-207', // Khadija Sylla
    seedMark: '11.09',
    time: '11.07',
    reactionTime: '0.163',
    wind: 0.9,
    windAssisted: false,
    rank: 7,
    status: 'OK',
    photoFinishTimestamp: 11070
  },
  {
    id: 'hl-2-8',
    eventId: 'evt-2',
    heatNumber: 1,
    lane: 8,
    athleteId: 'ath-208', // Sierra Gomez
    seedMark: '11.15',
    time: '11.14',
    reactionTime: '0.158',
    wind: 0.9,
    windAssisted: false,
    rank: 8,
    status: 'OK',
    photoFinishTimestamp: 11140
  },

  // Women's Long Jump (evt-6)
  {
    id: 'hl-6-1',
    eventId: 'evt-6',
    heatNumber: 1,
    lane: 1,
    athleteId: 'ath-213', // Tara Davis-Woodhall
    seedMark: '7.18m',
    time: '7.19m',
    wind: 1.1,
    rank: 1,
    status: 'OK',
    judgeNotes: 'MR - New Meet Record in round 5!'
  },
  {
    id: 'hl-6-2',
    eventId: 'evt-6',
    heatNumber: 1,
    lane: 2,
    athleteId: 'ath-214', // Malaika Mihambo-Weber
    seedMark: '7.15m',
    time: '7.12m',
    wind: 0.8,
    rank: 2,
    status: 'OK'
  },
  {
    id: 'hl-6-3',
    eventId: 'evt-6',
    heatNumber: 1,
    lane: 3,
    athleteId: 'ath-215', // Ese Brume-Eze
    seedMark: '7.08m',
    time: '7.05m',
    wind: 1.5,
    rank: 3,
    status: 'OK'
  },
  {
    id: 'hl-6-4',
    eventId: 'evt-6',
    heatNumber: 1,
    lane: 4,
    athleteId: 'ath-216', // Larissa Iapichino
    seedMark: '6.95m',
    time: '6.92m',
    wind: 0.6,
    rank: 4,
    status: 'OK'
  },
  {
    id: 'hl-6-5',
    eventId: 'evt-6',
    heatNumber: 1,
    lane: 5,
    athleteId: 'ath-205',
    seedMark: '6.72m',
    time: '6.70m',
    wind: 1.2,
    rank: 5,
    status: 'OK'
  },
  {
    id: 'hl-6-6',
    eventId: 'evt-6',
    heatNumber: 1,
    lane: 6,
    athleteId: 'ath-206',
    seedMark: '6.65m',
    time: '6.61m',
    wind: 0.7,
    rank: 6,
    status: 'OK'
  },

  // Men's 110m Hurdles (evt-3) - Active
  {
    id: 'hl-3-4',
    eventId: 'evt-3',
    heatNumber: 1,
    lane: 4,
    athleteId: 'ath-110', // Grant Holloway-Smith
    seedMark: '12.91',
    reactionTime: '0.125',
    status: 'OK'
  },
  {
    id: 'hl-3-5',
    eventId: 'evt-3',
    heatNumber: 1,
    lane: 5,
    athleteId: 'ath-109', // Devon Allen-Brooks
    seedMark: '12.94',
    reactionTime: '0.134',
    status: 'OK'
  },
  {
    id: 'hl-3-3',
    eventId: 'evt-3',
    heatNumber: 1,
    lane: 3,
    athleteId: 'ath-111', // Rai Benjamin-Cruz
    seedMark: '13.04',
    reactionTime: '0.142',
    status: 'OK'
  },
  {
    id: 'hl-3-6',
    eventId: 'evt-3',
    heatNumber: 1,
    lane: 6,
    athleteId: 'ath-112', // Kyron McMaster-Hall
    seedMark: '13.15',
    reactionTime: '0.147',
    status: 'OK'
  },
  {
    id: 'hl-3-2',
    eventId: 'evt-3',
    heatNumber: 1,
    lane: 2,
    athleteId: 'ath-103',
    seedMark: '13.22',
    reactionTime: '0.150',
    status: 'OK'
  },
  {
    id: 'hl-3-7',
    eventId: 'evt-3',
    heatNumber: 1,
    lane: 7,
    athleteId: 'ath-104',
    seedMark: '13.30',
    reactionTime: '0.155',
    status: 'OK'
  }
];

export const initialCallRoomInspections: CallRoomInspection[] = [
  { athleteId: 'ath-109', eventId: 'evt-3', heatNumber: 1, lane: 5, status: 'Cleared', hipNumberAssigned: 5, spikeLengthMm: 7, uniformApproved: true, timeCheckedIn: '15:50' },
  { athleteId: 'ath-110', eventId: 'evt-3', heatNumber: 1, lane: 4, status: 'Cleared', hipNumberAssigned: 4, spikeLengthMm: 7, uniformApproved: true, timeCheckedIn: '15:48' },
  { athleteId: 'ath-111', eventId: 'evt-3', heatNumber: 1, lane: 3, status: 'Cleared', hipNumberAssigned: 3, spikeLengthMm: 7, uniformApproved: true, timeCheckedIn: '15:52' },
  { athleteId: 'ath-112', eventId: 'evt-3', heatNumber: 1, lane: 6, status: 'Uniform Checked', hipNumberAssigned: 6, spikeLengthMm: 7, uniformApproved: true, timeCheckedIn: '15:54' },
  { athleteId: 'ath-103', eventId: 'evt-3', heatNumber: 1, lane: 2, status: 'Checked In', hipNumberAssigned: 2, spikeLengthMm: 7, uniformApproved: false, timeCheckedIn: '15:56' },
  { athleteId: 'ath-104', eventId: 'evt-3', heatNumber: 1, lane: 7, status: 'Not Reported', hipNumberAssigned: 7, spikeLengthMm: 7, uniformApproved: false }
];
