// This file defines the types and interfaces for the team database

export interface Team {
  teamID: number;
  schoolName: string;
  mascot: string;
  abbreviation: string;
  conferenceID: number;  // Reference to conference by numeric ID
  city: string;
  state: string;
  enrollment: number;
  academics: number; // 0-4 scale
  prestige: number; // 0-100 scale
  facilities: number; // 0-4 scale
  nil: number; // 0-4 scale (Name, Image, Likeness)
  stadiumName: string;
  stadiumCapacity: number;
  fanbase: number; // 0-4 scale
  primaryColor: string; // Hex code
  secondaryColor: string; // Hex code
  conferenceTitles: number;
  tournamentAppearances: number;
  cwsAppearances: number;
  nationalChampionships: number;
}

// Helper function to convert numeric ratings to text descriptions
export const getRatingText = (rating: number, attribute: string = 'general'): string => {
  if (attribute === 'academics') {
    switch (rating) {
      case 0:
        return 'Terrible';
      case 1:
        return 'Below Average';
      case 2:
        return 'Average';
      case 3:
        return 'Above Average';
      case 4:
        return 'Ivy';
      default:
        return 'Unknown';
    }
  } else if (attribute === 'facilities') {
    switch (rating) {
      case 0:
        return 'Falling Apart';
      case 1:
        return 'Aging';
      case 2:
        return 'Decent';
      case 3:
        return 'Brand New';
      case 4:
        return 'Pro Level';
      default:
        return 'Unknown';
    }
  } else if (attribute === 'nil') {
    switch (rating) {
      case 0:
        return 'Nonexistent';
      case 1:
        return 'Peanuts';
      case 2:
        return 'Average';
      case 3:
        return 'Rich';
      case 4:
        return 'Unlimited';
      default:
        return 'Unknown';
    }
  } else if (attribute === 'fanbase') {
    switch (rating) {
      case 0:
        return 'Family & Friends';
      case 1:
        return 'Small';
      case 2:
        return 'Average';
      case 3:
        return 'Large';
      case 4:
        return 'Massive';
      default:
        return 'Unknown';
    }
  } else {
    // Default general rating text
    switch (rating) {
      case 0:
        return 'Poor';
      case 1:
        return 'Below Average';
      case 2:
        return 'Average';
      case 3:
        return 'Good';
      case 4:
        return 'Excellent';
      default:
        return 'Unknown';
    }
  }
};

// Helper to get team size category based on enrollment
export const getSchoolSizeCategory = (enrollment: number): string => {
  if (enrollment < 5000) return 'Small';
  if (enrollment < 15000) return 'Medium';
  if (enrollment < 30000) return 'Large';
  return 'Very Large';
};
