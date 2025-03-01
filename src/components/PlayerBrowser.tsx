import React, { useState, useEffect } from 'react';
import { 
  Player, 
  Position, 
  getFormattedHeight, 
  getPlayerAge,
  PitchType,
  PITCH_NAME_MAP 
} from '../models/player.model';
import playerGenerationService from '../services/playerGenerationService';
import './PlayerBrowser.css';

const PlayerBrowser: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [generationCount, setGenerationCount] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'card' | 'table'>('table');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [positionFilter, setPositionFilter] = useState<string | null>(null);

  // Generate initial player set
  useEffect(() => {
    generatePlayers();
  }, []);

  // Handle player generation
  const generatePlayers = () => {
    setLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
      const newPlayers = playerGenerationService.generateRecruitingClass(generationCount);
      setPlayers(newPlayers);
      setSelectedPlayer(null);
      setLoading(false);
    }, 500);
  };

  // Handle generating a team roster
  const generateTeamRoster = () => {
    setLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
      // Example team with ID 1 and prestige 75
      const teamRoster = playerGenerationService.generateTeamRoster(1, 75, generationCount);
      setPlayers(teamRoster);
      setSelectedPlayer(null);
      setLoading(false);
    }, 500);
  };

  // Filter players
  const filteredPlayers = players.filter(player => {
    // Filter by star rating if applicable
    if (filterStars !== null && player.recruitingStars !== filterStars) {
      return false;
    }
    
    // Filter by position if applicable
    if (positionFilter && player.preferredPosition !== positionFilter) {
      return false;
    }
    
    return true;
  });

  // Get star display (★)
  const getStarDisplay = (stars: number) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  // Get positional abbrevation
  const getPositionAbbr = (position: string) => {
    return position;
  };

  // Get CSS class based on attribute value
  const getAttributeClass = (value: number) => {
    if (value >= 80) return 'elite';
    if (value >= 65) return 'good';
    if (value >= 50) return 'average';
    if (value >= 35) return 'below-average';
    return 'poor';
  };

  // Format a specific rating with appropriate styling
  const formatRating = (rating: number) => {
    return (
      <span className={`rating ${getAttributeClass(rating)}`}>{rating}</span>
    );
  };

  // Get a formatted measurement from height in inches
  const getHeight = (inches: number) => {
    return getFormattedHeight(inches);
  };

  return (
    <div className="player-browser">
      <div className="browser-controls">
        <div className="generation-controls">
          <input
            type="number"
            min="1"
            max="100"
            value={generationCount}
            onChange={(e) => setGenerationCount(parseInt(e.target.value) || 1)}
          />
          <button 
            className="generate-button"
            onClick={generatePlayers}
            disabled={loading}
          >
            <option value="">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select
            value={positionFilter || ''}
            onChange={(e) => setPositionFilter(e.target.value || null)}
          >
            <option value="">All Positions</option>
            {Object.values(Position).map(position => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          
          <div className="filter-stats">
            {filteredPlayers.length} players shown 
            {filterStars !== null && ` with ${filterStars} stars`}
            {positionFilter && ` at ${positionFilter}`}
          </div>
        </div>
      </div>
      
      {displayMode === 'table' ? (
        <div className="players-table-container">
          <table className="players-table">
            <thead>
              <tr>
                <th>Stars</th>
                <th>Name</th>
                <th>Pos</th>
                <th>Year</th>
                <th>Height/Wt</th>
                <th>B/T</th>
                <th>Contact</th>
                <th>Power</th>
                <th>Speed</th>
                <th>Arm</th>
                <th>Hometown</th>
                <th>School</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map(player => (
                <tr 
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={selectedPlayer?.id === player.id ? 'selected' : ''}
                >
                  <td className="star-col">{getStarDisplay(player.recruitingStars)}</td>
                  <td>{player.firstName} {player.lastName}</td>
                  <td>{getPositionAbbr(player.preferredPosition)}</td>
                  <td>{player.year}</td>
                  <td>{getHeight(player.height)}/{player.weight}</td>
                  <td>{player.battingHand}/{player.throwingHand}</td>
                  <td className={getAttributeClass(Math.floor((player.contactVsLeft + player.contactVsRight) / 2))}>
                    {Math.floor((player.contactVsLeft + player.contactVsRight) / 2)}
                  </td>
                  <td className={getAttributeClass(Math.floor((player.powerVsLeft + player.powerVsRight) / 2))}>
                    {Math.floor((player.powerVsLeft + player.powerVsRight) / 2)}
                  </td>
                  <td className={getAttributeClass(player.speed)}>{player.speed}</td>
                  <td className={getAttributeClass(player.armStrength)}>{player.armStrength}</td>
                  <td>{player.hometown}</td>
                  <td>{player.highSchool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="player-cards">
          {filteredPlayers.map(player => (
            <div 
              key={player.id}
              className={`player-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="card-header">
                <div className="player-name">{player.firstName} {player.lastName}</div>
                <div className="player-stars">{getStarDisplay(player.recruitingStars)}</div>
              </div>
              <div className="card-body">
                <div className="player-position">{player.preferredPosition}</div>
                <div className="player-year">{player.year}</div>
                <div className="player-size">{getHeight(player.height)}, {player.weight} lbs</div>
                <div className="player-hometown">{player.hometown}, {player.state}</div>
                <div className="player-school">{player.highSchool}</div>
                <div className="player-handedness">Bats: {player.battingHand} / Throws: {player.throwingHand}</div>
                <div className="player-key-attributes">
                  <div>
                    <span className="attribute-label">Contact:</span> 
                    {formatRating(Math.floor((player.contactVsLeft + player.contactVsRight) / 2))}
                  </div>
                  <div>
                    <span className="attribute-label">Power:</span> 
                    {formatRating(Math.floor((player.powerVsLeft + player.powerVsRight) / 2))}
                  </div>
                  <div>
                    <span className="attribute-label">Speed:</span> 
                    {formatRating(player.speed)}
                  </div>
                  <div>
                    <span className="attribute-label">Arm:</span> 
                    {formatRating(player.armStrength)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedPlayer && (
        <div className="player-detail">
          <h2>{selectedPlayer.firstName} {selectedPlayer.lastName}</h2>
          <div className="player-detail-header">
            <div className="detail-primary-info">
              <div className="detail-position-info">
                <div>{selectedPlayer.preferredPosition}</div>
                <div className="detail-stars">{getStarDisplay(selectedPlayer.recruitingStars)}</div>
              </div>
              <div>
                <div>{selectedPlayer.year}</div>
                <div>Age: {getPlayerAge(selectedPlayer.birthdate)}</div>
                <div>PG Rating: {selectedPlayer.perfectGameRating.toFixed(1)}</div>
              </div>
              <div>
                <div>{getHeight(selectedPlayer.height)}, {selectedPlayer.weight} lbs</div>
                <div>Bats: {selectedPlayer.battingHand}</div>
                <div>Throws: {selectedPlayer.throwingHand}</div>
              </div>
              <div>
                <div>{selectedPlayer.hometown}, {selectedPlayer.state}</div>
                <div>{selectedPlayer.highSchool}</div>
              </div>
            </div>
          </div>
          
          <div className="detail-sections">
            <div className="detail-section">
              <h3>Batting</h3>
              <div className="attribute-grid">
                <div className="attribute-item">
                  <span className="attribute-label">Contact (L):</span>
                  {formatRating(selectedPlayer.contactVsLeft)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Contact (R):</span>
                  {formatRating(selectedPlayer.contactVsRight)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Power (L):</span>
                  {formatRating(selectedPlayer.powerVsLeft)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Power (R):</span>
                  {formatRating(selectedPlayer.powerVsRight)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Eye:</span>
                  {formatRating(selectedPlayer.eye)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Discipline:</span>
                  {formatRating(selectedPlayer.discipline)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Bunting:</span>
                  {formatRating(selectedPlayer.buntingSkill)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">GB Rate:</span>
                  {formatRating(selectedPlayer.groundBallRate)}
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Running & Fielding</h3>
              <div className="attribute-grid">
                <div className="attribute-item">
                  <span className="attribute-label">Speed:</span>
                  {formatRating(selectedPlayer.speed)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Stealing:</span>
                  {formatRating(selectedPlayer.stealingAbility)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Range:</span>
                  {formatRating(selectedPlayer.range)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Arm Strength:</span>
                  {formatRating(selectedPlayer.armStrength)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Arm Accuracy:</span>
                  {formatRating(selectedPlayer.armAccuracy)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Handling:</span>
                  {formatRating(selectedPlayer.handling)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Blocking:</span>
                  {formatRating(selectedPlayer.blocking)}
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Pitching</h3>
              <div className="attribute-grid">
                <div className="attribute-item">
                  <span className="attribute-label">Stamina:</span>
                  {formatRating(selectedPlayer.stamina)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Hold Runners:</span>
                  {formatRating(selectedPlayer.holdRunners)}
                </div>
              </div>
              
              <h4>Pitches</h4>
              <div className="pitches-grid">
                {selectedPlayer.pitches.map((pitch, index) => (
                  <div key={index} className="pitch-item">
                    <div className="pitch-name">{PITCH_NAME_MAP[pitch.type]} ({pitch.type})</div>
                    <div className="pitch-attributes">
                      <div className="attribute-item">
                        <span className="attribute-label">Velocity:</span>
                        {formatRating(pitch.velocity)}
                      </div>
                      <div className="attribute-item">
                        <span className="attribute-label">Control:</span>
                        {formatRating(pitch.control)}
                      </div>
                      <div className="attribute-item">
                        <span className="attribute-label">Movement:</span>
                        {formatRating(pitch.movement)}
                      </div>
                      <div className="attribute-item">
                        <span className="attribute-label">Stuff:</span>
                        {formatRating(pitch.stuff)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Mental Attributes</h3>
              <div className="attribute-grid">
                <div className="attribute-item">
                  <span className="attribute-label">Work Ethic:</span>
                  {formatRating(selectedPlayer.workEthic)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Coachability:</span>
                  {formatRating(selectedPlayer.coachability)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Intelligence:</span>
                  {formatRating(selectedPlayer.intelligence)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Leadership:</span>
                  {formatRating(selectedPlayer.leadership)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Composure:</span>
                  {formatRating(selectedPlayer.composure)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Confidence:</span>
                  {formatRating(selectedPlayer.confidence)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Loyalty:</span>
                  {formatRating(selectedPlayer.loyalty)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Adaptability:</span>
                  {formatRating(selectedPlayer.adaptability)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Recovery:</span>
                  {formatRating(selectedPlayer.recovery)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Ego:</span>
                  {formatRating(selectedPlayer.ego)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Greed:</span>
                  {formatRating(selectedPlayer.greed)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Aggressiveness:</span>
                  {formatRating(selectedPlayer.aggressiveness)}
                </div>
                <div className="attribute-item">
                  <span className="attribute-label">Integrity:</span>
                  {formatRating(selectedPlayer.integrity)}
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Position Ratings</h3>
              <div className="position-ratings-grid">
                {selectedPlayer.positionRatings
                  .sort((a, b) => b.rating - a.rating) // Sort by rating descending
                  .map((posRating, index) => (
                    <div key={index} className="position-rating-item">
                      <span className="position-label">{posRating.position}:</span>
                      {formatRating(posRating.rating)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerBrowser;{loading ? 'Generating...' : 'Generate Recruiting Class'}
          </button>
          <button 
            className="generate-button"
            onClick={generateTeamRoster}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Team Roster'}
          </button>
        </div>
        
        <div className="display-controls">
          <button 
            className={`view-mode-button ${displayMode === 'table' ? 'active' : ''}`}
            onClick={() => setDisplayMode('table')}
          >
            Table View
          </button>
          <button 
            className={`view-mode-button ${displayMode === 'card' ? 'active' : ''}`}
            onClick={() => setDisplayMode('card')}
          >
            Card View
          </button>
        </div>
        
        <div className="filter-controls">
          <select
            value={filterStars !== null ? filterStars.toString() : ''}
            onChange={(e) => setFilterStars(e.target.value ? parseInt(e.target.value) : null)}
          >
            