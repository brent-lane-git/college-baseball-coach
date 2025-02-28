import React, { useState, useEffect } from 'react';
import { Team } from '../models/team.model';
import { useTeams } from '../store/TeamContext';
import { useConferences } from '../store/ConferenceContext';
import ColorPicker from './ColorPicker';

interface TeamEditorProps {
  team?: Team; // Existing team for editing (undefined for new team)
  onSave: (team: Team) => void;
  onCancel: () => void;
}

const TeamEditor: React.FC<TeamEditorProps> = ({ team, onSave, onCancel }) => {
  const { teams } = useTeams();
  const { conferences } = useConferences();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Initialize with default values or existing team data
  const [formData, setFormData] = useState<Partial<Team>>({
    teamID: 0,
    schoolName: '',
    mascot: '',
    abbreviation: '',
    conferenceID: 0,
    city: '',
    state: '',
    enrollment: 0,
    academics: 2,
    prestige: 50,
    facilities: 2,
    nil: 2,
    fanbase: 2,
    stadiumName: '',
    stadiumCapacity: 0,
    primaryColor: '0000FF',
    secondaryColor: 'FFFFFF',
    conferenceTitles: 0,
    tournamentAppearances: 0,
    cwsAppearances: 0,
    nationalChampionships: 0
  });

  // US States for dropdown
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Initialize form with existing team data if editing
  useEffect(() => {
    if (team) {
      setFormData({
        ...team
      });
    } else {
      // For new team, generate the next available ID
      // Find highest ID in the current teams array
      const highestId = teams.length > 0 
        ? Math.max(...teams.map(t => t.teamID)) 
        : -1;
      
      // Set ID to 1 higher than the highest existing ID
      setFormData(prevData => ({
        ...prevData,
        teamID: highestId + 1
      }));
    }
  }, [team, teams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert to number for number inputs
    if (type === 'number' || 
        name === 'teamID' || 
        name === 'enrollment' || 
        name === 'prestige' || 
        name === 'stadiumCapacity' || 
        name === 'conferenceID' ||
        name === 'academics' ||
        name === 'facilities' ||
        name === 'nil' ||
        name === 'fanbase' ||
        name === 'conferenceTitles' ||
        name === 'tournamentAppearances' ||
        name === 'cwsAppearances' ||
        name === 'nationalChampionships') {
      const numValue = parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleColorChange = (color: string, type: 'primary' | 'secondary') => {
    const colorField = type === 'primary' ? 'primaryColor' : 'secondaryColor';
    // Remove # if present
    const colorValue = color.startsWith('#') ? color.substring(1) : color;
    setFormData(prev => ({ ...prev, [colorField]: colorValue }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.schoolName?.trim()) {
      errors.schoolName = 'School name is required';
    }

    if (!formData.mascot?.trim()) {
      errors.mascot = 'Mascot is required';
    }

    if (!formData.abbreviation?.trim()) {
      errors.abbreviation = 'Abbreviation is required';
    } else if (formData.abbreviation.length > 4) {
      errors.abbreviation = 'Abbreviation must be 4 characters or less';
    }

    if (formData.conferenceID === undefined) {
      errors.conferenceID = 'Conference is required';
    }

    if (!formData.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state?.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.stadiumName?.trim()) {
      errors.stadiumName = 'Stadium name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Cast to Team since we've validated all required fields
      onSave(formData as Team);
    }
  };

  // Sort conferences alphabetically for the dropdown
  const sortedConferences = [...conferences].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="team-editor">
      <h2>{team ? 'Edit Team' : 'Create New Team'}</h2>
      
      <form onSubmit={handleSubmit} className="team-editor-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="teamID">Team ID:</label>
            <input
              type="number"
              id="teamID"
              name="teamID"
              value={formData.teamID}
              onChange={handleInputChange}
              min="0"
              disabled={team !== undefined} // Can't change ID of existing team
            />
            <div className="field-help">This auto-generated ID is used as a unique identifier and cannot be changed later.</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="schoolName">School Name:</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              className={formErrors.schoolName ? 'error' : ''}
            />
            {formErrors.schoolName && <div className="error-message">{formErrors.schoolName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="mascot">Mascot:</label>
            <input
              type="text"
              id="mascot"
              name="mascot"
              value={formData.mascot}
              onChange={handleInputChange}
              className={formErrors.mascot ? 'error' : ''}
            />
            {formErrors.mascot && <div className="error-message">{formErrors.mascot}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="abbreviation">Abbreviation (2-4 letters):</label>
            <input
              type="text"
              id="abbreviation"
              name="abbreviation"
              value={formData.abbreviation}
              onChange={handleInputChange}
              maxLength={4}
              className={formErrors.abbreviation ? 'error' : ''}
            />
            {formErrors.abbreviation && <div className="error-message">{formErrors.abbreviation}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="conferenceID">Conference:</label>
              <select
                id="conferenceID"
                name="conferenceID"
                value={formData.conferenceID}
                onChange={handleInputChange}
                className={formErrors.conferenceID ? 'error' : ''}
              >
                <option value="">Select Conference</option>
                {sortedConferences.map(conf => (
                  <option key={conf.id} value={conf.id}>
                    {conf.name} ({conf.abbreviation})
                  </option>
                ))}
              </select>
              {formErrors.conferenceID && <div className="error-message">{formErrors.conferenceID}</div>}
              {sortedConferences.length === 0 && (
                <div className="warning-message">
                  No conferences available. Create a conference first.
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="enrollment">Enrollment:</label>
              <input
                type="number"
                id="enrollment"
                name="enrollment"
                value={formData.enrollment}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={formErrors.city ? 'error' : ''}
              />
              {formErrors.city && <div className="error-message">{formErrors.city}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State:</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={formErrors.state ? 'error' : ''}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {formErrors.state && <div className="error-message">{formErrors.state}</div>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Stadium Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stadiumName">Stadium Name:</label>
              <input
                type="text"
                id="stadiumName"
                name="stadiumName"
                value={formData.stadiumName}
                onChange={handleInputChange}
                className={formErrors.stadiumName ? 'error' : ''}
              />
              {formErrors.stadiumName && <div className="error-message">{formErrors.stadiumName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="stadiumCapacity">Stadium Capacity:</label>
              <input
                type="number"
                id="stadiumCapacity"
                name="stadiumCapacity"
                value={formData.stadiumCapacity}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Team Colors</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryColor">Primary Color:</label>
              <ColorPicker 
                color={`#${formData.primaryColor}`}
                onChange={(color) => handleColorChange(color, 'primary')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secondaryColor">Secondary Color:</label>
              <ColorPicker 
                color={`#${formData.secondaryColor}`}
                onChange={(color) => handleColorChange(color, 'secondary')}
              />
            </div>
          </div>

          <div className="color-preview">
            <div className="color-sample primary" style={{ backgroundColor: `#${formData.primaryColor}` }}></div>
            <div className="color-sample secondary" style={{ backgroundColor: `#${formData.secondaryColor}` }}></div>
            <div className="team-preview">
              {formData.schoolName} {formData.mascot}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Program Ratings</h3>
          
          <div className="rating-slider">
            <label htmlFor="prestige">Prestige: {formData.prestige}/100</label>
            <input
              type="range"
              id="prestige"
              name="prestige"
              min="0"
              max="100"
              value={formData.prestige}
              onChange={handleRangeChange}
            />
          </div>

          <div className="rating-row">
            <div className="rating-slider">
              <label htmlFor="academics">Academics: {formData.academics}/4</label>
              <input
                type="range"
                id="academics"
                name="academics"
                min="0"
                max="4"
                value={formData.academics}
                onChange={handleRangeChange}
              />
            </div>
            
            <div className="rating-slider">
              <label htmlFor="facilities">Facilities: {formData.facilities}/4</label>
              <input
                type="range"
                id="facilities"
                name="facilities"
                min="0"
                max="4"
                value={formData.facilities}
                onChange={handleRangeChange}
              />
            </div>
          </div>

          <div className="rating-row">
            <div className="rating-slider">
              <label htmlFor="nil">NIL: {formData.nil}/4</label>
              <input
                type="range"
                id="nil"
                name="nil"
                min="0"
                max="4"
                value={formData.nil}
                onChange={handleRangeChange}
              />
            </div>
            
            <div className="rating-slider">
              <label htmlFor="fanbase">Fanbase: {formData.fanbase}/4</label>
              <input
                type="range"
                id="fanbase"
                name="fanbase"
                min="0"
                max="4"
                value={formData.fanbase}
                onChange={handleRangeChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Program History</h3>

          <div className="form-row">
            <div className="form-group small">
              <label htmlFor="conferenceTitles">Conference Titles:</label>
              <input
                type="number"
                id="conferenceTitles"
                name="conferenceTitles"
                value={formData.conferenceTitles}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group small">
              <label htmlFor="tournamentAppearances">Tournament Appearances:</label>
              <input
                type="number"
                id="tournamentAppearances"
                name="tournamentAppearances"
                value={formData.tournamentAppearances}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label htmlFor="cwsAppearances">CWS Appearances:</label>
              <input
                type="number"
                id="cwsAppearances"
                name="cwsAppearances"
                value={formData.cwsAppearances}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group small">
              <label htmlFor="nationalChampionships">National Championships:</label>
              <input
                type="number"
                id="nationalChampionships"
                name="nationalChampionships"
                value={formData.nationalChampionships}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="save-button">Save Team</button>
        </div>
      </form>
    </div>
  );
};

export default TeamEditor;
