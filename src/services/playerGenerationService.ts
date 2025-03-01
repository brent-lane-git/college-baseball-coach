import { 
  Player, 
  PlayerYear, 
  Position, 
  Hand, 
  PitchType,
  Pitch,
  BroadPosition,
  PositionRating
} from '../models/player.model';
import { v4 as uuidv4 } from 'uuid';

// Nationality distribution
enum Nationality {
  AMERICAN = 'American',
  CANADIAN = 'Canadian',
  CUBAN = 'Cuban',
  PUERTO_RICAN = 'Puerto Rican',
  DOMINICAN = 'Dominican',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  AUSTRALIAN = 'Australian',
  ITALIAN = 'Italian',
  CZECH = 'Czech'
}

// Probability distributions for nationality
const NATIONALITY_DISTRIBUTION = {
  [Nationality.AMERICAN]: 0.87,
  [Nationality.CANADIAN]: 0.05,
  [Nationality.CUBAN]: 0.01,
  [Nationality.PUERTO_RICAN]: 0.01,
  [Nationality.DOMINICAN]: 0.01,
  [Nationality.JAPANESE]: 0.01,
  [Nationality.KOREAN]: 0.01,
  [Nationality.AUSTRALIAN]: 0.01,
  [Nationality.ITALIAN]: 0.01,
  [Nationality.CZECH]: 0.01
};

// Gem/Bust status for recruits (hidden from user)
enum RecruitStatus {
  GEM = 'gem',
  BUST = 'bust',
  NORMAL = 'normal'
}

// US States with abbreviations
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Helper function for weighted random selection
const weightedRandom = (options: { [key: string]: number }): string => {
  const weights = Object.values(options);
  const keys = Object.keys(options);
  
  // Calculate the sum of all weights
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  // Get a random number between 0 and totalWeight
  let random = Math.random() * totalWeight;
  
  // Find the item corresponding to the random number
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random < 0) {
      return keys[i];
    }
  }
  
  // Fallback (should rarely happen due to floating-point errors)
  return keys[keys.length - 1];
};

// Helper function to generate a random integer within a range
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate a random floating point number within a range
const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Helper function to generate a normal distribution value
const normalDistribution = (mean: number, standardDeviation: number): number => {
  // Box-Muller transform for normal distribution
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  
  // Transform to desired mean and standard deviation
  return z * standardDeviation + mean;
};

// Helper function to clamp a value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Helper function to generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to determine if a player is a gem or bust based on star rating
const determineRecruitStatus = (stars: number): RecruitStatus => {
  const random = Math.random();
  
  let gemChance = 0;
  let bustChance = 0;
  
  switch (stars) {
    case 5:
      gemChance = 0.1;
      bustChance = 0.1;
      break;
    case 4:
      gemChance = 0.1;
      bustChance = 0.1;
      break;
    case 3:
      gemChance = 0.1;
      bustChance = 0.1;
      break;
    case 2:
      gemChance = 0.15;
      bustChance = 0.3;
      break;
    case 1:
      gemChance = 0.2;
      bustChance = 0.6;
      break;
    default:
      gemChance = 0.1;
      bustChance = 0.1;
  }
  
  if (random < gemChance) {
    return RecruitStatus.GEM;
  } else if (random < gemChance + bustChance) {
    return RecruitStatus.BUST;
  } else {
    return RecruitStatus.NORMAL;
  }
};

// Helper function to determine the talent offset for gems/busts
const determineRecruitTalentOffset = (status: RecruitStatus): number => {
  if (status === RecruitStatus.NORMAL) {
    return 0;
  }
  
  const random = Math.random();
  let offset = 0;
  
  if (status === RecruitStatus.GEM) {
    // Positive offset for gems
    if (random < 0.05) {
      offset = 3; // 5% chance of being 3 levels better
    } else if (random < 0.25) {
      offset = 2; // 20% chance of being 2 levels better
    } else {
      offset = 1; // 75% chance of being 1 level better
    }
  } else {
    // Negative offset for busts
    if (random < 0.05) {
      offset = -3; // 5% chance of being 3 levels worse
    } else if (random < 0.25) {
      offset = -2; // 20% chance of being 2 levels worse
    } else {
      offset = -1; // 75% chance of being 1 level worse
    }
  }
  
  return offset;
};

// Helper function to calculate the effective star rating based on gem/bust status
const calculateEffectiveStarRating = (stars: number, status: RecruitStatus): number => {
  if (status === RecruitStatus.NORMAL) {
    return stars;
  }
  
  const offset = determineRecruitTalentOffset(status);
  const effectiveStars = stars + offset;
  
  // Clamp between 1 and 5 stars
  return clamp(effectiveStars, 1, 5);
};

// Helper function to calculate Perfect Game rating based on star rating
const calculatePGRating = (stars: number): number => {
  switch (stars) {
    case 5:
      return randomFloat(9.5, 10);
    case 4:
      return randomFloat(8, 10);
    case 3:
      return randomFloat(7.5, 9.5);
    case 2:
      return randomFloat(6.5, 9);
    case 1:
      return randomFloat(6, 8.5);
    default:
      return randomFloat(6, 10);
  }
};

// Helper function to generate height based on position and preferences
const generateHeight = (position: Position): number => {
  // Heights are in inches
  let mean = 72; // 6'0"
  let stdDev = 3; // 3 inches standard deviation
  
  // Adjust mean based on position
  if (position === Position.FIRST_BASE || position === Position.STARTING_PITCHER) {
    mean = 74; // 6'2"
  } else if (position === Position.CATCHER || position === Position.SECOND_BASE) {
    mean = 70; // 5'10"
  } else if (position === Position.SHORTSTOP) {
    mean = 71; // 5'11"
  }
  
  // Generate height using normal distribution
  const height = Math.round(normalDistribution(mean, stdDev));
  
  // Clamp between 5'6" and 6'7"
  return clamp(height, 66, 79);
};

// Helper function to generate weight based on height
const generateWeight = (height: number): number => {
  // Base weight calculation (a rough approximation for athletes)
  const baseWeight = (height - 60) * 5 + 100;
  
  // Add some random variation
  const variation = normalDistribution(0, 15);
  
  // Calculate final weight
  const weight = Math.round(baseWeight + variation);
  
  // Ensure weight is reasonable (e.g., between 150 and 250 pounds)
  return clamp(weight, 150, 250);
};

// Helper function to determine handedness (batting and throwing)
const determineHandedness = (): { batting: Hand, throwing: Hand } => {
  // About 20% of people are left-handed in general
  const isLeftyThrower = Math.random() < 0.2;
  
  // Determine batting hand
  let battingHand: Hand;
  
  if (isLeftyThrower) {
    // If left-handed thrower, ~70% bat left, ~20% switch hit, ~10% bat right
    const random = Math.random();
    if (random < 0.7) {
      battingHand = Hand.LEFT;
    } else if (random < 0.9) {
      battingHand = Hand.SWITCH;
    } else {
      battingHand = Hand.RIGHT;
    }
  } else {
    // If right-handed thrower, ~80% bat right, ~15% bat left, ~5% switch hit
    const random = Math.random();
    if (random < 0.8) {
      battingHand = Hand.RIGHT;
    } else if (random < 0.95) {
      battingHand = Hand.LEFT;
    } else {
      battingHand = Hand.SWITCH;
    }
  }
  
  return {
    batting: battingHand,
    throwing: isLeftyThrower ? Hand.LEFT : Hand.RIGHT
  };
};

// Helper function to generate correlated mental attributes
const generateMentalAttributes = (stars: number): {
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
} => {
  // Base values adjusted by star rating
  const baseMin = 30 + (stars - 1) * 5;
  const baseMax = 50 + (stars - 1) * 7;
  
  // Generate baseline personality traits with some correlation
  const workEthic = randomInt(baseMin, baseMax + 10);
  const intelligence = randomInt(baseMin, baseMax + 5);
  const integrity = randomInt(baseMin, baseMax);
  
  // Derived traits with some correlation to base traits
  const greed = clamp(randomInt(20, 80) - Math.floor(integrity / 5), 1, 99);
  const coachability = clamp(randomInt(30, 80) + Math.floor(workEthic / 10) - Math.floor(ego / 10), 1, 99);
  const ego = clamp(randomInt(30, 70) + Math.floor(stars * 5), 1, 99);
  const loyalty = clamp(randomInt(30, 70) + Math.floor(integrity / 10) - Math.floor(greed / 10), 1, 99);
  
  // Other mental attributes
  const confidence = clamp(baseMin + randomInt(-10, 40) + Math.floor(stars * 3), 1, 99);
  const composure = clamp(randomInt(baseMin, baseMax) + Math.floor(intelligence / 10), 1, 99);
  const aggressiveness = clamp(randomInt(20, 80), 1, 99);
  const leadership = clamp(randomInt(baseMin, baseMax) + Math.floor(workEthic / 10), 1, 99);
  const adaptability = clamp(randomInt(baseMin, baseMax) + Math.floor(intelligence / 10), 1, 99);
  const recovery = clamp(randomInt(baseMin, baseMax) + Math.floor(workEthic / 10), 1, 99);
  
  return {
    ego,
    confidence,
    composure,
    greed,
    coachability,
    workEthic,
    loyalty,
    intelligence,
    aggressiveness,
    integrity,
    leadership,
    adaptability,
    recovery
  };
};

// Helper function to generate position ratings for a player
const generatePositionRatings = (
  preferredPosition: Position,
  height: number,
  weight: number,
  effectiveStars: number
): PositionRating[] => {
  // Base rating for preferred position based on effective stars
  const basePreferredRating = 40 + (effectiveStars - 1) * 10;
  
  // Generate ratings for all positions
  const positionRatings: PositionRating[] = [];
  const allPositions = Object.values(Position);
  
  // Helper function to determine related positions
  const getRelatedPositions = (pos: Position): Position[] => {
    switch (pos) {
      case Position.FIRST_BASE:
        return [Position.THIRD_BASE, Position.LEFT_FIELD, Position.RIGHT_FIELD];
      case Position.SECOND_BASE:
        return [Position.SHORTSTOP, Position.THIRD_BASE];
      case Position.SHORTSTOP:
        return [Position.SECOND_BASE, Position.THIRD_BASE];
      case Position.THIRD_BASE:
        return [Position.FIRST_BASE, Position.SHORTSTOP];
      case Position.LEFT_FIELD:
        return [Position.CENTER_FIELD, Position.RIGHT_FIELD];
      case Position.CENTER_FIELD:
        return [Position.LEFT_FIELD, Position.RIGHT_FIELD];
      case Position.RIGHT_FIELD:
        return [Position.LEFT_FIELD, Position.CENTER_FIELD];
      case Position.CATCHER:
        return [Position.FIRST_BASE];
      case Position.DESIGNATED_HITTER:
        return [Position.FIRST_BASE, Position.LEFT_FIELD, Position.RIGHT_FIELD];
      case Position.STARTING_PITCHER:
        return [Position.RELIEF_PITCHER];
      case Position.RELIEF_PITCHER:
        return [Position.CLOSING_PITCHER, Position.STARTING_PITCHER];
      case Position.CLOSING_PITCHER:
        return [Position.RELIEF_PITCHER];
      default:
        return [];
    }
  };
  
  // Generate ratings for each position
  allPositions.forEach(position => {
    let rating = 20 + Math.floor(Math.random() * 30); // Base rating between 20-50
    
    // Adjust rating based on preferred position
    if (position === preferredPosition) {
      rating = basePreferredRating + Math.floor(Math.random() * 20);
    } else if (getRelatedPositions(preferredPosition).includes(position)) {
      // Related positions get a boost
      rating = Math.floor(basePreferredRating * 0.8) + Math.floor(Math.random() * 15);
    }
    
    // Adjust based on physical attributes for certain positions
    if ((position === Position.FIRST_BASE || position === Position.DESIGNATED_HITTER) && height >= 74) {
      rating += Math.floor((height - 73) * 2);
    } else if ((position === Position.SHORTSTOP || position === Position.SECOND_BASE) && height <= 72) {
      rating += Math.floor((73 - height) * 2);
    }
    
    // Ensure ratings are within bounds
    rating = clamp(rating, 1, 99);
    
    positionRatings.push({
      position,
      rating
    });
  });
  
  return positionRatings;
};

// Helper function to generate batting attributes
const generateBattingAttributes = (
  effectiveStars: number,
  height: number,
  weight: number,
  battingHand: Hand
): {
  contactVsLeft: number;
  contactVsRight: number;
  powerVsLeft: number;
  powerVsRight: number;
  eye: number;
  discipline: number;
  defensiveness: number;
  groundBallRate: number;
  buntingSkill: number;
} => {
  // Base ratings adjusted by effective star rating
  const baseMin = 30 + (effectiveStars - 1) * 8;
  const baseMax = 50 + (effectiveStars - 1) * 10;
  
  // Physical size impacts power and contact tendencies
  const isLarger = height >= 74 && weight >= 200;
  const isSmaller = height <= 70 && weight <= 180;
  
  // Batting hand affects splits
  const hasAdvantageVsRight = battingHand === Hand.LEFT || battingHand === Hand.SWITCH;
  const hasAdvantageVsLeft = battingHand === Hand.RIGHT || battingHand === Hand.SWITCH;
  
  // Generate base contact and power
  let baseContact = randomInt(baseMin, baseMax);
  let basePower = randomInt(baseMin, baseMax);
  
  // Adjust based on size
  if (isLarger) {
    basePower += randomInt(5, 15);
    baseContact -= randomInt(0, 10);
  } else if (isSmaller) {
    baseContact += randomInt(5, 15);
    basePower -= randomInt(0, 10);
  }
  
  // Generate splits
  const contactVsRight = clamp(baseContact + (hasAdvantageVsRight ? randomInt(5, 15) : 0), 1, 99);
  const contactVsLeft = clamp(baseContact + (hasAdvantageVsLeft ? randomInt(5, 15) : 0), 1, 99);
  const powerVsRight = clamp(basePower + (hasAdvantageVsRight ? randomInt(5, 15) : 0), 1, 99);
  const powerVsLeft = clamp(basePower + (hasAdvantageVsLeft ? randomInt(5, 15) : 0), 1, 99);
  
  // Generate other batting attributes
  const eye = clamp(randomInt(baseMin, baseMax), 1, 99);
  const discipline = clamp(randomInt(baseMin, baseMax), 1, 99);
  
  // Smaller players tend to be more defensive hitters and have higher ground ball rates
  let defensiveness = randomInt(baseMin, baseMax);
  let groundBallRate = randomInt(40, 60);
  
  if (isSmaller) {
    defensiveness += randomInt(5, 15);
    groundBallRate += randomInt(5, 15);
  } else if (isLarger) {
    groundBallRate -= randomInt(5, 15);
  }
  
  // Bunting skill tends to be higher for smaller, more defensive players
  let buntingSkill = randomInt(baseMin, baseMax);
  if (isSmaller || defensiveness > 60) {
    buntingSkill += randomInt(5, 15);
  }
  
  // Ensure all values are within bounds
  defensiveness = clamp(defensiveness, 1, 99);
  groundBallRate = clamp(groundBallRate, 1, 99);
  buntingSkill = clamp(buntingSkill, 1, 99);
  
  return {
    contactVsLeft,
    contactVsRight,
    powerVsLeft,
    powerVsRight,
    eye,
    discipline,
    defensiveness,
    groundBallRate,
    buntingSkill
  };
};

// Helper function to generate baserunning and fielding attributes
const generateBaserunningFieldingAttributes = (
  effectiveStars: number,
  height: number,
  weight: number,
  preferredPosition: Position
): {
  speed: number;
  stealingAbility: number;
  range: number;
  armStrength: number;
  armAccuracy: number;
  handling: number;
  blocking: number;
} => {
  // Base ratings adjusted by effective star rating
  const baseMin = 30 + (effectiveStars - 1) * 8;
  const baseMax = 50 + (effectiveStars - 1) * 10;
  
  // Physical size impacts speed and range
  const isLarger = height >= 74 && weight >= 200;
  const isSmaller = height <= 70 && weight <= 180;
  
  // Position impacts certain attributes
  const isInfielder = [
    Position.FIRST_BASE,
    Position.SECOND_BASE,
    Position.SHORTSTOP,
    Position.THIRD_BASE
  ].includes(preferredPosition);
  
  const isOutfielder = [
    Position.LEFT_FIELD,
    Position.CENTER_FIELD,
    Position.RIGHT_FIELD
  ].includes(preferredPosition);
  
  const isCatcher = preferredPosition === Position.CATCHER;
  
  // Generate speed based on size
  let speed = randomInt(baseMin, baseMax);
  if (isSmaller) {
    speed += randomInt(10, 20);
  } else if (isLarger) {
    speed -= randomInt(5, 15);
  }
  
  // Stealing ability correlates with speed
  const stealingAbility = clamp(speed + randomInt(-10, 10), 1, 99);
  
  // Range correlates with speed and position
  let range = clamp(speed + randomInt(-15, 15), 1, 99);
  if (isOutfielder) {
    range += randomInt(5, 15);
  } else if (isInfielder && preferredPosition !== Position.FIRST_BASE) {
    range += randomInt(0, 10);
  }
  
  // Arm strength based on position
  let armStrength = randomInt(baseMin, baseMax);
  if (isOutfielder || preferredPosition === Position.THIRD_BASE || preferredPosition === Position.SHORTSTOP) {
    armStrength += randomInt(5, 15);
  }
  
  // Arm accuracy
  let armAccuracy = randomInt(baseMin, baseMax);
  if (isInfielder) {
    armAccuracy += randomInt(5, 15);
  }
  
  // Handling and blocking for catchers
  let handling = randomInt(baseMin, baseMax);
  let blocking = randomInt(baseMin, baseMax);
  
  if (isCatcher) {
    handling += randomInt(10, 20);
    blocking += randomInt(10, 20);
  }
  
  // Ensure all values are within bounds
  speed = clamp(speed, 1, 99);
  range = clamp(range, 1, 99);
  armStrength = clamp(armStrength, 1, 99);
  armAccuracy = clamp(armAccuracy, 1, 99);
  handling = clamp(handling, 1, 99);
  blocking = clamp(blocking, 1, 99);
  
  return {
    speed,
    stealingAbility,
    range,
    armStrength,
    armAccuracy,
    handling,
    blocking
  };
};

// Helper function to generate pitching attributes and pitches
const generatePitchingAttributes = (
  effectiveStars: number,
  height: number,
  weight: number,
  throwingHand: Hand,
  isPitcher: boolean
): {
  stamina: number;
  holdRunners: number;
  pitches: Pitch[];
} => {
  // Base ratings adjusted by effective star rating
  const baseMin = isPitcher ? 40 + (effectiveStars - 1) * 8 : 10;
  const baseMax = isPitcher ? 60 + (effectiveStars - 1) * 8 : 30;
  
  // Stamina and hold runners
  let stamina = randomInt(baseMin, baseMax);
  const holdRunners = randomInt(baseMin, baseMax);
  
  // Starting pitchers get higher stamina
  if (isPitcher && Math.random() < 0.7) {
    stamina += randomInt(10, 20);
  }
  
  // Generate pitches
  const pitches: Pitch[] = [];
  const possiblePitchTypes = Object.values(PitchType);
  
  // All pitchers have a fastball
  const fastballVelocity = clamp(
    randomInt(85, 95) + (isPitcher ? Math.floor(effectiveStars * 1.5) : 0) + (height >= 74 ? randomInt(1, 3) : 0),
    80, 102
  );
  
  pitches.push({
    type: PitchType.FF,
    control: clamp(randomInt(baseMin, baseMax), 1, 99),
    movement: clamp(randomInt(baseMin - 10, baseMax - 10), 1, 99),
    stuff: clamp(randomInt(baseMin, baseMax), 1, 99),
    velocity: Math.min(99, fastballVelocity) // Scale 80-102 mph to 0-99 rating
  });
  
  // Number of additional pitches based on effective stars and whether they're a pitcher
  const numPitches = isPitcher ? 
    Math.min(2 + Math.floor(effectiveStars / 2), 5) : 
    Math.min(1 + Math.floor(effectiveStars / 3), 2);
  
  // Select random additional pitches
  const selectedPitches = new Set([PitchType.FF]); // Already have fastball
  
  while (selectedPitches.size < numPitches + 1) {
    const randomPitch = possiblePitchTypes[Math.floor(Math.random() * possiblePitchTypes.length)];
    
    if (!selectedPitches.has(randomPitch)) {
      selectedPitches.add(randomPitch);
      
      // Generate pitch attributes
      const control = clamp(randomInt(baseMin - 10, baseMax), 1, 99);
      const movement = clamp(randomInt(baseMin, baseMax + 10), 1, 99);
      const stuff = clamp(randomInt(baseMin - 5, baseMax + 5), 1, 99);
      
      // Calculate velocity as a percentage of fastball velocity
      let velocityPercentage = 0;
      
      switch (randomPitch) {
        case PitchType.SL:
        case PitchType.CU:
        case PitchType.KC:
          velocityPercentage = randomInt(75, 85);
          break;
        case PitchType.CH:
        case PitchType.FS:
        case PitchType.SC:
          velocityPercentage = randomInt(80, 90);
          break;
        case PitchType.FC:
        case PitchType.SI:
          velocityPercentage = randomInt(90, 95);
          break;
        case PitchType.EP:
        case PitchType.KN:
          velocityPercentage = randomInt(60, 70);
          break;
        default:
          velocityPercentage = randomInt(75, 90);
      }
      
      const velocity = Math.floor((fastballVelocity * velocityPercentage) / 100);
      
      pitches.push({
        type: randomPitch,
        control,
        movement,
        stuff,
        velocity: Math.min(99, velocity