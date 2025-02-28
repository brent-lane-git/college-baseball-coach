import React, { useState, useEffect } from 'react';
import { useTeams } from '../store/TeamContext';
import { useConferences } from '../store/ConferenceContext';
import { Team, getRatingText } from '../models/team.model';

const TeamBrowser: React.FC = () => {
  const { teams, loading, error, searchTeams } = useTeams();
  const { conferences } = useConferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConference, setFilterConference] = useState<number | 'all'>('all');
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  // Initialize filtered teams when teams data is loaded
  useEffect(() => {
    if (teams && teams.length > 0) {
      applyFilters();
    }
  }, [teams, searchQuery, filterConference]);

  const applyFilters = () => {
    let filtered = teams;
    
    // Apply search filter
    if (searchQuery) {
      filtered = searchTeams(searchQuery);
    }
    
    // Apply conference filter
    if (filterConference !== 'all') {
      filtered = filtered.filter(team => team.conferenceID === filterConference);
    }
    
    // Set filtered teams
    setFilteredTeams(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleConferenceFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterConference(value === 'all' ? 'all' : parseInt(value, 10));
  };

  // Get conference name by ID
  const getConferenceName = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.name : 'Unknown Conference';
  };

  // Get conference abbreviation by ID
  const getConferenceAbbreviation = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.abbreviation : 'N/A';
  };

  // Get conference color by ID
  const getConferenceColor = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.color : 'CCCCCC';
  };

  if (loading) {
    return <div className="team-browser-loading">Loading teams...</div>;
  }

  if (error) {
    return <div className="team-browser-error">Error: {error}</div>;
  }

  // Sort conferences alphabetically for the filter dropdown
  const sortedConferences = [...conferences].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="team-browser">
      <div className="browser-header">
        <h2>Team Browser</h2>
        <button 
          className="back-button"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
      
      <div className="filter-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="conference-filter">
          <label htmlFor="conferenceFilter">Conference:</label>
          <select
            id="conferenceFilter"
            value={filterConference.toString()}
            onChange={handleConferenceFilter}
          >
            <option value="all">All Conferences</option>
            {sortedConferences.map(conf => (
              <option key={conf.id} value={conf.id.toString()}>{conf.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="teams-count">
        {filteredTeams.length} teams 
        {searchQuery && ` matching "${searchQuery}"`}
        {filterConference !== 'all' && ` in ${getConferenceName(filterConference as number)}`}
      </div>
      
      <div className="teams-list">
        {filteredTeams.length > 0 ? (
          <div className="table-responsive">
            <table className="teams-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Conference</th>
                  <th>Location</th>
                  <th>Prestige</th>
                  <th>Academics</th>
                  <th>Facilities</th>
                  <th>NIL</th>
                  <th>Fanbase</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.teamID}>
                    <td>
                      <div className="team-name">
                        <span 
                          className="team-color-dot" 
                          style={{ backgroundColor: `#${team.primaryColor}` }}
                        ></span>
                        {team.schoolName} {team.mascot}
                      </div>
                    </td>
                    <td>
                      <div className="conference-name">
                        <span 
                          className="conference-color" 
                          style={{ backgroundColor: `#${getConferenceColor(team.conferenceID)}` }}
                        ></span>
                        {getConferenceAbbreviation(team.conferenceID)}
                      </div>
                    </td>
                    <td>{team.city}, {team.state}</td>
                    <td>{team.prestige}/100</td>
                    <td>{getRatingText(team.academics, 'academics')}</td>
                    <td>{getRatingText(team.facilities, 'facilities')}</td>
                    <td>{getRatingText(team.nil, 'nil')}</td>
                    <td>{getRatingText(team.fanbase, 'fanbase')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results">
            {searchQuery || filterConference !== 'all' ? 
              "No teams found with the current filters." : 
              "No teams available in the database."}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamBrowser;
