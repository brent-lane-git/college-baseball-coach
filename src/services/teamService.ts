import { Team } from '../models/team.model';

class TeamService {
  private teams: Team[] = [];
  private loaded: boolean = false;

  /**
   * Load teams from the database file
   */
  async loadTeams(): Promise<Team[]> {
    // If already loaded, return the cached teams
    if (this.loaded && this.teams.length > 0) {
      console.log('Returning cached teams:', this.teams.length);
      return this.teams;
    }

    try {
      // Fetch the JSON file from the public folder
      console.log('Fetching teams database file...');
      const response = await fetch('./teams-database.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load teams: ${response.status} ${response.statusText}`);
      }
      
      console.log('Database file fetched, parsing JSON...');
      const data = await response.json();
      console.log('JSON data structure:', Object.keys(data));
      
      if (!data.teams) {
        console.error('Missing teams array in the JSON data');
        console.log('Full JSON data:', data);
        throw new Error('Invalid JSON structure: missing teams array');
      }
      
      if (!Array.isArray(data.teams) || data.teams.length === 0) {
        console.error('Teams is not an array or is empty', data.teams);
        throw new Error(`Invalid teams data: ${Array.isArray(data.teams) ? 'empty array' : 'not an array'}`);
      }
      
      // Check the first team object structure
      const firstTeam = data.teams[0];
      console.log('First team structure:', Object.keys(firstTeam));
      
      // Store the teams in memory
      this.teams = data.teams;
      this.loaded = true;
      
      console.log(`Loaded ${this.teams.length} teams from database`);
      return this.teams;
    } catch (error) {
      console.error('Error loading teams database:', error);
      throw error;
    }
  }

  /**
   * Get all teams
   */
  async getAllTeams(): Promise<Team[]> {
    if (!this.loaded) {
      await this.loadTeams();
    }
    return this.teams;
  }

  /**
   * Get team by ID
   */
  async getTeamById(id: number): Promise<Team | undefined> {
    if (!this.loaded) {
      await this.loadTeams();
    }
    return this.teams.find(team => team.teamID === id);
  }

  /**
   * Get teams by conference
   */
  async getTeamsByConference(conference: number): Promise<Team[]> {
    if (!this.loaded) {
      await this.loadTeams();
    }
    return this.teams.filter(team => team.conferenceID === conference);
  }

  /**
   * Search teams by name or mascot
   */
  async searchTeams(query: string): Promise<Team[]> {
    if (!this.loaded) {
      await this.loadTeams();
    }
    
    const lowerQuery = query.toLowerCase();
    return this.teams.filter(team => 
      team.schoolName.toLowerCase().includes(lowerQuery) || 
      team.mascot.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get top teams by prestige
   */
  async getTopTeamsByPrestige(limit: number = 25): Promise<Team[]> {
    if (!this.loaded) {
      await this.loadTeams();
    }
    
    return [...this.teams]
      .sort((a, b) => b.prestige - a.prestige)
      .slice(0, limit);
  }
}

// Create a singleton instance
const teamService = new TeamService();
export default teamService;
