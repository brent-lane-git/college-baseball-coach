import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conference } from '../models/conference.model';
import conferenceService from '../services/conferenceService';

// Define the context type
interface ConferenceContextType {
  conferences: Conference[];
  loading: boolean;
  error: string | null;
  getConferenceById: (id: number) => Conference | undefined;
  getConferenceByName: (nameOrAbbr: string) => Conference | undefined;
  addConference: (conference: Conference) => void;
  updateConference: (conference: Conference) => void;
  deleteConference: (id: number) => void;
}

// Create the context
const ConferenceContext = createContext<ConferenceContextType | undefined>(undefined);

// Props for the provider component
interface ConferenceProviderProps {
  children: ReactNode;
}

// Provider component
export const ConferenceProvider: React.FC<ConferenceProviderProps> = ({ children }) => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load conferences when the provider mounts
  useEffect(() => {
    const loadConferences = async () => {
      try {
        setLoading(true);
        console.log('Attempting to load conferences...');
        const loadedConferences = await conferenceService.loadConferences();
        console.log('Conferences loaded:', loadedConferences.length);
        setConferences(loadedConferences);
        setError(null);
      } catch (err) {
        console.error('Conference loading error:', err);
        setError('Failed to load conferences database. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    loadConferences();
  }, []);

  // Get conference by ID
  const getConferenceById = (id: number): Conference | undefined => {
    return conferences.find(conf => conf.id === id);
  };

  // Get conference by name or abbreviation
  const getConferenceByName = (nameOrAbbr: string): Conference | undefined => {
    const lowerQuery = nameOrAbbr.toLowerCase();
    return conferences.find(conf => 
      conf.name.toLowerCase().includes(lowerQuery) || 
      conf.abbreviation.toLowerCase().includes(lowerQuery)
    );
  };

  // Add a new conference
  const addConference = (conference: Conference): void => {
    setConferences(prevConferences => {
      const newConferences = [...prevConferences, conference];
      // Save to local storage for persistence
      localStorage.setItem('customConferences', JSON.stringify(newConferences));
      return newConferences;
    });
  };

  // Update an existing conference
  const updateConference = (conference: Conference): void => {
    setConferences(prevConferences => {
      const newConferences = prevConferences.map(c => c.id === conference.id ? conference : c);
      // Save to local storage for persistence
      localStorage.setItem('customConferences', JSON.stringify(newConferences));
      return newConferences;
    });
  };

  // Delete a conference
  const deleteConference = (id: number): void => {
    setConferences(prevConferences => {
      const newConferences = prevConferences.filter(c => c.id !== id);
      // Save to local storage for persistence
      localStorage.setItem('customConferences', JSON.stringify(newConferences));
      return newConferences;
    });
  };

  // Context value
  const value = {
    conferences,
    loading,
    error,
    getConferenceById,
    getConferenceByName,
    addConference,
    updateConference,
    deleteConference
  };

  return <ConferenceContext.Provider value={value}>{children}</ConferenceContext.Provider>;
};

// Custom hook to use the conference context
export const useConferences = (): ConferenceContextType => {
  const context = useContext(ConferenceContext);
  if (context === undefined) {
    throw new Error('useConferences must be used within a ConferenceProvider');
  }
  return context;
};
