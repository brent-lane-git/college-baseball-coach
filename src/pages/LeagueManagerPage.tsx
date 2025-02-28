import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../models/team.model';
import { Conference } from '../models/conference.model';
import { useTeams } from '../store/TeamContext';
import { useConferences } from '../store/ConferenceContext';
import TeamEditor from '../components/TeamEditor';
import ConferenceEditor from '../components/ConferenceEditor';
import '../App.css';

enum ManageMode {
  DASHBOARD = 'dashboard',
  EDIT_TEAM = 'edit_team',
  CREATE_TEAM = 'create_team',
  EDIT_CONFERENCE = 'edit_conference',
  CREATE_CONFERENCE = 'create_conference'
}

const LeagueManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { teams, addTeam, updateTeam, deleteTeam } = useTeams();
  const { conferences, addConference, updateConference, deleteConference } = useConferences();
  
  const [mode, setMode] = useState<ManageMode>(ManageMode.DASHBOARD);
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [selectedConference, setSelectedConference] = useState<Conference | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'conferences'>('teams');

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

  // Get teams in a conference
  const getTeamsInConference = (conferenceID: number): Team[] => {
    return teams.filter(team => team.conferenceID === conferenceID);
  };

  // Team operations
  const handleCreateTeam = () => {
    setSelectedTeam(undefined);
    setMode(ManageMode.CREATE_TEAM);
    setSuccessMessage(null);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setMode(ManageMode.EDIT_TEAM);
    setSuccessMessage(null);
  };

  const handleDeleteTeam = (team: Team) => {
    if (window.confirm(`Are you sure you want to delete ${team.schoolName} ${team.mascot}?`)) {
      deleteTeam(team.teamID);
      setSuccessMessage(`${team.schoolName} has been deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleSaveTeam = (team: Team) => {
    if (mode === ManageMode.CREATE_TEAM) {
      addTeam(team);
      setSuccessMessage(`${team.schoolName} has been created.`);
    } else {
      updateTeam(team);
      setSuccessMessage(`${team.schoolName} has been updated.`);
    }
    
    setMode(ManageMode.DASHBOARD);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Conference operations
  const handleCreateConference = () => {
    setSelectedConference(undefined);
    setMode(ManageMode.CREATE_CONFERENCE);
    setSuccessMessage(null);
  };

  const handleEditConference = (conference: Conference) => {
    setSelectedConference(conference);
    setMode(ManageMode.EDIT_CONFERENCE);
    setSuccessMessage(null);
  };

  const handleDeleteConference = (conference: Conference) => {
    // Check if there are teams in this conference
    const teamsInConference = getTeamsInConference(conference.id);
    
    if (teamsInConference.length > 0) {
      alert(`Cannot delete ${conference.name} because it contains ${teamsInConference.length} teams. Reassign the teams first.`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the ${conference.name}?`)) {
      deleteConference(conference.id);
      setSuccessMessage(`${conference.name} has been deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleSaveConference = (conference: Conference) => {
    if (mode === ManageMode.CREATE_CONFERENCE) {
      // Ensure unique ID
      if (conferences.some(c => c.id === conference.id)) {
        alert(`A conference with ID ${conference.id} already exists. Please use a different ID.`);
        return;
      }
      
      addConference(conference);
      setSuccessMessage(`${conference.name} has been created.`);
    } else {
      updateConference(conference);
      setSuccessMessage(`${conference.name} has been updated.`);
    }
    
    setMode(ManageMode.DASHBOARD);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCancel = () => {
    setMode(ManageMode.DASHBOARD);
    setSelectedTeam(undefined);
    setSelectedConference(undefined);
  };

  // Render functions
  const renderTeamsTab = () => {
    // Sort teams by conference and then by name
    const sortedTeams = [...teams].sort((a, b) => {
      // First sort by conference
      const confA = getConferenceName(a.conferenceID);
      const confB = getConferenceName(b.conferenceID);
      const confCompare = confA.localeCompare(confB);
      
      // If in same conference, sort by name
      if (confCompare === 0) {
        return a.schoolName.localeCompare(b.schoolName);
      }
      
      return confCompare;
    });

    return (
      <div className="teams-section">
        <div className="section-header">
          <h2>Teams</h2>
          <button className="create-button" onClick={handleCreateTeam}>Create New Team</button>
        </div>
        
        <div className="table-responsive">
          <table className="manager-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Conference</th>
                <th>Location</th>
                <th>Prestige</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map(team => (
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
                      {getConferenceName(team.conferenceID)}
                    </div>
                  </td>
                  <td>{team.city}, {team.state}</td>
                  <td>{team.prestige}/100</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEditTeam(team)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteTeam(team)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-data">No teams found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderConferencesTab = () => {
    // Sort conferences by prestige
    const sortedConferences = [...conferences].sort((a, b) => b.prestige - a.prestige);
    
    return (
      <div className="conferences-section">
        <div className="section-header">
          <h2>Conferences</h2>
          <button className="create-button" onClick={handleCreateConference}>Create New Conference</button>
        </div>
        
        <div className="table-responsive">
          <table className="manager-table">
            <thead>
              <tr>
                <th>Conference</th>
                <th>Teams</th>
                <th>Prestige</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedConferences.map(conference => {
                const teamsCount = getTeamsInConference(conference.id).length;
                
                return (
                  <tr key={conference.id}>
                    <td>
                      <div className="conference-name">
                        <span 
                          className="conference-color" 
                          style={{ backgroundColor: `#${conference.color}` }}
                        ></span>
                        {conference.name} ({conference.abbreviation})
                      </div>
                    </td>
                    <td>{teamsCount} teams</td>
                    <td>{conference.prestige}/100</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditConference(conference)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteConference(conference)}
                          disabled={teamsCount > 0}
                          title={teamsCount > 0 ? "Cannot delete conference with teams" : ""}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {conferences.length === 0 && (
                <tr>
                  <td colSpan={4} className="no-data">No conferences found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="manager-dashboard">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`} 
            onClick={() => setActiveTab('teams')}
          >
            Teams
          </button>
          <button 
            className={`tab-button ${activeTab === 'conferences' ? 'active' : ''}`} 
            onClick={() => setActiveTab('conferences')}
          >
            Conferences
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'teams' ? renderTeamsTab() : renderConferencesTab()}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>League Manager</h1>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {mode === ManageMode.DASHBOARD && renderDashboard()}
      
      {(mode === ManageMode.CREATE_TEAM || mode === ManageMode.EDIT_TEAM) && (
        <TeamEditor 
          team={selectedTeam}
          onSave={handleSaveTeam}
          onCancel={handleCancel}
        />
      )}
      
      {(mode === ManageMode.CREATE_CONFERENCE || mode === ManageMode.EDIT_CONFERENCE) && (
        <ConferenceEditor 
          conference={selectedConference}
          onSave={handleSaveConference}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default LeagueManagerPage;
