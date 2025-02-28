// Basic game state model
export interface GameState {
  coachName: string;
  teamName: string;
  // We'll add more properties as we develop the game
  gameInitialized: boolean;
}

// Player position enum
export enum Position {
  PITCHER = 'Pitcher',
  CATCHER = 'Catcher',
  FIRST_BASE = 'First Base',
  SECOND_BASE = 'Second Base',
  THIRD_BASE = 'Third Base',
  SHORTSTOP = 'Shortstop',
  LEFT_FIELD = 'Left Field',
  CENTER_FIELD = 'Center Field',
  RIGHT_FIELD = 'Right Field',
  DESIGNATED_HITTER = 'Designated Hitter'
}

// Player model (to be expanded)
export interface Player {
  id: string;
  name: string;
  position: Position;
  // We'll add skills and attributes later
}

// Game initialization function (placeholder)
export const initializeNewGame = (coachName: string, teamName: string): GameState => {
  return {
    coachName,
    teamName,
    gameInitialized: true
  };
};
