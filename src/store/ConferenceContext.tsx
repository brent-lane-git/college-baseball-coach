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
  resetConferencesToDefault: () => void;
  setAllConferences: (conferences: Conference[]) => void; // New function
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
  const [originalConferences, setOriginalConferences] = useState<Conference[]>([]);

  // Load conferences when the provider mounts
  useEffect(() => {
    const loadConferences = async () => {
      try {
        setLoading(true);
        console.log('Attempting to load conferences...');
        
        // First check if there are conferences in localStorage
        const localConferences = localStorage.getItem('customConferences');
        
        if (localConferences) {
          try {
            // If localStorage has conferences, use those
            console.log('Found conferences in localStorage. Using stored conferences.');
            const parsedConferences = JSON.parse(localConferences);
            setConferences(parsedConferences);
            
            // Still load the original conferences from the database file for potential reset
            const originalConferencesData = await conferenceService.loadConferences();
            if (originalConferencesData.length > 0) {
              setOriginalConferences(originalConferencesData);
            } else {
              console.warn('Could not load original conferences data for reset');
            }
          } catch (parseError) {
            console.error('Error parsing local storage conferences:', parseError);
            localStorage.removeItem('customConferences'); // Remove invalid data
            
            // Load from database as fallback
            const loadedConferences = await conferenceService.loadConferences();
            if (loadedConferences.length > 0) {
              setConferences(loadedConferences);
              setOriginalConferences(loadedConferences);
            } else {
              // Initialize with empty array if all loading fails
              setConferences([]);
              setOriginalConferences([]);
              setError('Failed to load conferences. Please try refreshing the page.');
            }
          }
        } else {
          // If no localStorage conferences, load from database file
          console.log('No conferences found in localStorage. Loading from database file.');
          const loadedConferences = await conferenceService.loadConferences();
          if (loadedConferences.length > 0) {
            console.log('Conferences loaded:', loadedConferences.length);
            setConferences(loadedConferences);
            setOriginalConferences(loadedConferences);
          } else {
            // Initialize with empty array if loading fails
            setConferences([]);
            setOriginalConferences([]);
            setError('Failed to load conferences. Please try refreshing the page.');
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Conference loading error:', err);
        setConferences([]);
        setOriginalConferences([]);
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

  // Reset conferences to default (original database values)
  const resetConferencesToDefault = (): void => {
    // Reset to original conferences
    setConferences(originalConferences);
    // Remove from localStorage
    localStorage.removeItem('customConferences');
  };

  // Set all conferences (for import functionality)
  const setAllConferences = (newConferences: Conference[]): void => {
    setConferences(newConferences);
    // Save to local storage for persistence
    localStorage.setItem('customConferences', JSON.stringify(newConferences));
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
    deleteConference,
    resetConferencesToDefault,
    setAllConferences
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