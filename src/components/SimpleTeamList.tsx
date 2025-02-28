import React from 'react';
import { useTeams } from '../store/TeamContext';
import { useConferences } from '../store/ConferenceContext';
import { getRatingText } from '../models/team.model';

const SimpleTeamList: React.FC = () => {
  const { teams, loading, error } = useTeams();
  const { conferences } = useConferences();

  // Get conference name by ID
  const getConferenceName = (conferenceID: number): string => {
    const conference = conferences.find(conf => conf.id === conferenceID);
    return conference ? conference.name : 'Unknown Conference';
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!teams || teams.length === 0) {
    return <div>No teams found in context.</div>;
  }

  return (
    <div className="simple-team-list">
      <h3>Simple Team List (Direct from Context)</h3>
      <p>Found {teams.length} teams</p>
      <ul>
        {teams.slice(0, 5).map(team => (
          <li key={team.teamID}>
            <strong>{team.schoolName} {team.mascot}</strong> - {getConferenceName(team.conferenceID)}<br />
            <small>
              Prestige: {team.prestige}/100 | 
              Academics: {getRatingText(team.academics, 'academics')} | 
              Facilities: {getRatingText(team.facilities, 'facilities')} | 
              NIL: {getRatingText(team.nil, 'nil')} | 
              Fanbase: {getRatingText(team.fanbase, 'fanbase')}
            </small>
          </li>
        ))}
        {teams.length > 5 && <li>...and {teams.length - 5} more teams</li>}
      </ul>
    </div>
  );
};

export default SimpleTeamList;
