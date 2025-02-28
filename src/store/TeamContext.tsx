import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team } from '../models/team.model';
import teamService from '../services/teamService';

// Define the context type
interface TeamContextType {
  teams: Team[];
  loading: boolean;
  error: string | null;
  getTeamById: (id: number) => Team | undefined;
  getTeamsByConference: (conference: number) => Team[];
  searchTeams: (query: string) => Team[];
  getTopTeamsByPrestige: (limit?: number) => Team[];
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: number) => void;
}

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Props for the provider component
interface TeamProviderProps {
  children: ReactNode;
}

// Provider component
export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load teams when the provider mounts
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        console.log('Attempting to load teams in TeamContext...');
        const loadedTeams = await teamService.loadTeams();
        console.log('Teams loaded in TeamContext. Count:', loadedTeams.length);
        console.log('First team:', loadedTeams[0]);
        setTeams(loadedTeams);
        setError(null);
      } catch (err) {
        console.error('Team loading error:', err);
        setError('Failed to load teams database. Please check the console for details.');
      } finally {
        setLoading(false);
        console.log('Loading state set to false in TeamContext');
      }
    };

    loadTeams();
  }, []);

  // Get team by ID
  const getTeamById = (id: number): Team | undefined => {
    return teams.find(team => team.teamID === id);
  };

  // Get teams by conference
  const getTeamsByConference = (conference: number): Team[] => {
    return teams.filter(team => team.conferenceID === conference);
  };

  // Search teams
  const searchTeams = (query: string): Team[] => {
    const lowerQuery = query.toLowerCase();
    return teams.filter(team => 
      team.schoolName.toLowerCase().includes(lowerQuery) || 
      team.mascot.toLowerCase().includes(lowerQuery)
    );
  };

  // Get top teams by prestige
  const getTopTeamsByPrestige = (limit: number = 25): Team[] => {
    return [...teams]
      .sort((a, b) => b.prestige - a.prestige)
      .slice(0, limit);
  };

  // Add a new team
  const addTeam = (team: Team): void => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams, team];
      // Save to local storage for persistence
      localStorage.setItem('customTeams', JSON.stringify(newTeams));
      return newTeams;
    });
  };

  // Update an existing team
  const updateTeam = (team: Team): void => {
    setTeams(prevTeams => {
      const newTeams = prevTeams.map(t => t.teamID === team.teamID ? team : t);
      // Save to local storage for persistence
      localStorage.setItem('customTeams', JSON.stringify(newTeams));
      return newTeams;
    });
  };

  // Delete a team
  const deleteTeam = (id: number): void => {
    setTeams(prevTeams => {
      const newTeams = prevTeams.filter(t => t.teamID !== id);
      // Save to local storage for persistence
      localStorage.setItem('customTeams', JSON.stringify(newTeams));
      return newTeams;
    });
  };

  // Context value
  const value = {
    teams,
    loading,
    error,
    getTeamById,
    getTeamsByConference,
    searchTeams,
    getTopTeamsByPrestige,
    addTeam,
    updateTeam,
    deleteTeam
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

// Custom hook to use the team context
export const useTeams = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};
