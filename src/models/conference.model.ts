// This file defines the types and interfaces for the conference database

export interface Conference {
  id: number;           // Unique identifier (e.g., 0, 1, 2)
  name: string;         // Full name (e.g., "Southeastern Conference")
  abbreviation: string; // Short name (e.g., "SEC")
  prestige: number;     // 0-100 scale
  color: string;        // Hex code (without #)
}

// Helper function to get conference prestige text
export const getConferencePrestigeText = (prestige: number): string => {
  if (prestige >= 90) return 'Elite';
  if (prestige >= 75) return 'Power';
  if (prestige >= 60) return 'Major';
  if (prestige >= 45) return 'Mid-Major';
  if (prestige >= 30) return 'Minor';
  return 'Low-Level';
};
