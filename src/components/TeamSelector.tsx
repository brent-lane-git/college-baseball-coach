import React, { useState, useEffect } from 'react';
import { useTeams } from '../store/TeamContext';
import { useConferences } from '../store/ConferenceContext';
import { Team, getRatingText } from '../models/team.model';

interface TeamSelectorProps {
  onTeamSelect: (team: Team | null) => void;
  selectedTeam: Team | null;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ onTeamSelect, selectedTeam }) => {
  const { teams, loading, error } = useTeams();
  const { conferences } = useConferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Get conference name by ID
  const getConferenceName = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.name : 'Unknown Conference';
  };

  // Get conference color by ID
  const getConferenceColor = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.color : 'CCCCCC';
  };

  // Initialize and filter teams
  useEffect(() => {
    if (teams && teams.length > 0) {
      setFilteredTeams(
        searchQuery.trim() === ''
          ? teams.slice(0, 20)
          : teams.filter(
              team =>
                team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                team.mascot.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    }
  }, [teams, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleTeamSelect = (team: Team) => {
    onTeamSelect(team);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    onTeamSelect(null);
  };

  if (loading) {
    return <div className="team-selector-loading">Loading teams...</div>;
  }

  if (error) {
    return <div className="team-selector-error">Error loading teams: {error}</div>;
  }

  return (
    <div className="team-selector">
      <div className="team-search-container">
        <input
          type="text"
          placeholder="Search for a team..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(true)}
          className="team-search-input"
        />
        {showDropdown && filteredTeams.length > 0 && (
          <div className="team-dropdown">
            {filteredTeams.slice(0, 10).map(team => (
              <div
                key={team.teamID}
                className="team-option"
                onClick={() => handleTeamSelect(team)}
              >
                <div className="team-option-color" style={{ backgroundColor: `#${team.primaryColor}` }}></div>
                <div className="team-option-name">
                  {team.schoolName} {team.mascot}
                </div>
                <div className="team-option-info">
                  {getConferenceName(team.conferenceID)} | Prestige: {team.prestige}/100
                </div>
              </div>
            ))}
            {filteredTeams.length > 10 && (
              <div className="team-option-more">
                {filteredTeams.length - 10} more results. Refine your search...
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTeam && (
        <div className="selected-team">
          <div className="selected-team-header">
            <h3>
              <span
                className="team-color-dot"
                style={{ backgroundColor: `#${selectedTeam.primaryColor}` }}
              ></span>
              {selectedTeam.schoolName} {selectedTeam.mascot}
            </h3>
            <button className="clear-team-btn" onClick={handleClearSelection}>
              Change Team
            </button>
          </div>
          <div className="selected-team-details">
            <div className="selected-team-info">
              <div>
                <strong>Conference:</strong> {getConferenceName(selectedTeam.conferenceID)}
              </div>
              <div>
                <strong>Location:</strong> {selectedTeam.city}, {selectedTeam.state}
              </div>
              <div>
                <strong>Stadium:</strong> {selectedTeam.stadiumName} (Capacity: {selectedTeam.stadiumCapacity.toLocaleString()})
              </div>
            </div>
            <div className="selected-team-ratings">
              <div>
                <strong>Prestige:</strong> {selectedTeam.prestige}/100
              </div>
              <div>
                <strong>Academics:</strong> {getRatingText(selectedTeam.academics, 'academics')}
              </div>
              <div>
                <strong>Facilities:</strong> {getRatingText(selectedTeam.facilities, 'facilities')}
              </div>
              <div>
                <strong>NIL:</strong> {getRatingText(selectedTeam.nil, 'nil')}
              </div>
              <div>
                <strong>Fanbase:</strong> {getRatingText(selectedTeam.fanbase, 'fanbase')}
              </div>
            </div>
            <div className="selected-team-history">
              <div>
                <strong>Conference Titles:</strong> {selectedTeam.conferenceTitles}
              </div>
              <div>
                <strong>Tournament Appearances:</strong> {selectedTeam.tournamentAppearances}
              </div>
              <div>
                <strong>CWS Appearances:</strong> {selectedTeam.cwsAppearances}
              </div>
              <div>
                <strong>National Championships:</strong> {selectedTeam.nationalChampionships}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
