// src/models/player.model.ts

// Enums for fixed options
export enum Position {
  CATCHER = 'C',
  FIRST_BASE = '1B',
  SECOND_BASE = '2B',
  THIRD_BASE = '3B',
  SHORTSTOP = 'SS',
  LEFT_FIELD = 'LF',
  CENTER_FIELD = 'CF',
  RIGHT_FIELD = 'RF',
  DESIGNATED_HITTER = 'DH',
  STARTING_PITCHER = 'SP',
  RELIEF_PITCHER = 'RP',
  CLOSING_PITCHER = 'CP'
}

export enum BroadPosition {
  INFIELD = 'IF',
  OUTFIELD = 'OF',
  CORNER_INFIELD = 'CIF',
  MIDDLE_INFIELD = 'MIF',
  BATTERY = 'BAT', // Pitcher/Catcher
  PITCHER = 'P',
  UTILITY = 'UTIL'
}

export enum PlayerYear {
  FRESHMAN = 'Freshman',
  SOPHOMORE = 'Sophomore',
  JUNIOR = 'Junior',
  SENIOR = 'Senior',
  REDSHIRT_FRESHMAN = 'Redshirt Freshman',
  REDSHIRT_SOPHOMORE = 'Redshirt Sophomore',
  REDSHIRT_JUNIOR = 'Redshirt Junior',
  REDSHIRT_SENIOR = 'Redshirt Senior'
}

export enum Hand {
  LEFT = 'Left',
  RIGHT = 'Right',
  SWITCH = 'Switch' // For batting only
}

export enum PitchType {
  FF = 'FF', // Four-Seam Fastball
  CH = 'CH', // Changeup
  CU = 'CU', // Curveball
  FC = 'FC', // Cutter
  EP = 'EP', // Eephus
  FO = 'FO', // Forkball
  KN = 'KN', // Knuckleball
  KC = 'KC', // Knuckle-curve
  SC = 'SC', // Screwball
  SI = 'SI', // Sinker
  SL = 'SL', // Slider
  SV = 'SV', // Slurve
  FS = 'FS', // Splitter
  ST = 'ST'  // Sweeper
}

// Map for getting full pitch names when needed
export const PITCH_NAME_MAP = {
  [PitchType.FF]: 'Four-Seam Fastball',
  [PitchType.CH]: 'Changeup',
  [PitchType.CU]: 'Curveball',
  [PitchType.FC]: 'Cutter',
  [PitchType.EP]: 'Eephus',
  [PitchType.FO]: 'Forkball',
  [PitchType.KN]: 'Knuckleball',
  [PitchType.KC]: 'Knuckle-curve',
  [PitchType.SC]: 'Screwball',
  [PitchType.SI]: 'Sinker',
  [PitchType.SL]: 'Slider',
  [PitchType.SV]: 'Slurve',
  [PitchType.FS]: 'Splitter',
  [PitchType.ST]: 'Sweeper'
};

// Interface for individual pitch attributes
export interface Pitch {
  type: PitchType;
  control: number; // 0-99
  movement: number; // 0-99
  stuff: number; // 0-99
  velocity: number; // 0-99
}

// Interface for position-specific ratings
export interface PositionRating {
  position: Position;
  rating: number; // 0-99
}

// Main Player Interface
export interface Player {
  // Biography
  id: string; // Unique identifier
  firstName: string;
  lastName: string;
  birthdate: Date;
  year: PlayerYear;
  preferredPosition: Position | BroadPosition;
  height: number; // In inches
  weight: number; // In pounds
  battingHand: Hand;
  throwingHand: Hand;
  hometown: string;
  state: string;
  highSchool: string;
  previousSchool?: string;
  jerseyNumber: number;
  agency?: string; // NIL representation
  
  // Recruiting/Scouting
  recruitingStars: number; // 1-5 stars
  perfectGameRating: number; // 0-10 scale
  
  // Mental Attributes (0-99)
  ego: number;
  confidence: number;
  composure: number;
  greed: number;
  coachability: number;
  workEthic: number;
  loyalty: number;
  intelligence: number;
  aggressiveness: number;
  integrity: number;
  leadership: number;
  adaptability: number;
  recovery: number;
  
  // Hitting Attributes (0-99)
  contactVsLeft: number;
  contactVsRight: number;
  powerVsLeft: number;
  powerVsRight: number;
  eye: number;
  discipline: number;
  defensiveness: number; // Defensive hitting (e.g., bunting, hit and run)
  groundBallRate: number; // Tendency to hit grounders
  buntingSkill: number;
  
  // Pitching Attributes (0-99)
  stamina: number;
  holdRunners: number;
  pitches: Pitch[]; // Array of pitch types with individual ratings
  
  // Baserunning & Fielding Attributes (0-99)
  speed: number;
  stealingAbility: number;
  range: number;
  armStrength: number;
  armAccuracy: number;
  handling: number; // General fielding ability
  blocking: number; // Especially important for catchers
  
  // Position-specific ratings
  positionRatings: PositionRating[]; // Rating for each position
  
  // Game state tracking
  teamID?: number; // Reference to the team they're on, if any
  statistics?: any; // Placeholder for stats object
  injuries?: any; // Placeholder for injuries tracking
  developmentTracker?: any; // Placeholder for tracking growth/decline
  
  // Player status attributes
  happinessLevel?: number; // Player satisfaction with their situation
}

// Helper functions

// Get player age based on birthdate
export const getPlayerAge = (birthdate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
};

// Get formatted height (e.g., 6'2")
export const getFormattedHeight = (heightInInches: number): string => {
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}'${inches}"`;
};

// Get position abbreviation
export const getPositionAbbreviation = (position: Position | BroadPosition): string => {
  return position.toString();
};

// Get player's rating at a specific position
export const getPlayerPositionRating = (player: Player, position: Position): number | undefined => {
  const posRating = player.positionRatings.find(pr => pr.position === position);
  return posRating?.rating;
};

// Get full pitch name from abbreviation
export const getPitchFullName = (pitchType: PitchType): string => {
  return PITCH_NAME_MAP[pitchType] || pitchType;
};