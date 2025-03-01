import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, Position, PlayerYear } from '../models/player.model';
import playerGenerationService from '../services/playerGenerationService';

// Define the context type
interface PlayerContextType {
  players: Player[];
  loading: boolean;
  error: string | null;
  getPlayerById: (id: string) => Player | undefined;
  getPlayersByTeam: (teamId: number) => Player[];
  getPlayersByPosition: (position: Position) => Player[];
  generateRecruitingClass: (count?: number) => void;
  generateTeamRoster: (teamId: number, teamPrestige: number, count?: number) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  clearPlayers: () => void;
}

// Create the context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Props for the provider component
interface PlayerProviderProps {
  children: ReactNode;
}

// Provider component
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>