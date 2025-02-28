import { Conference } from '../models/conference.model';

class ConferenceService {
  private conferences: Conference[] = [];
  private loaded: boolean = false;

  /**
   * Load conferences from the database file
   */
  async loadConferences(): Promise<Conference[]> {
    // If already loaded, return the cached conferences
    if (this.loaded && this.conferences.length > 0) {
      console.log('Returning cached conferences:', this.conferences.length);
      return this.conferences;
    }

    try {
      // Fetch the JSON file from the public folder
      console.log('Fetching conferences database file...');
      const response = await fetch('./conferences-database.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load conferences: ${response.status} ${response.statusText}`);
      }
      
      console.log('Database file fetched, parsing JSON...');
      const data = await response.json();
      console.log('JSON parsed:', data);
      
      // Store the conferences in memory
      this.conferences = data.conferences || [];
      this.loaded = true;
      
      console.log(`Loaded ${this.conferences.length} conferences from database`);
      return this.conferences;
    } catch (error) {
      console.error('Error loading conferences database:', error);
      throw error;
    }
  }

  /**
   * Get all conferences
   */
  async getAllConferences(): Promise<Conference[]> {
    if (!this.loaded) {
      await this.loadConferences();
    }
    return this.conferences;
  }

  /**
   * Get conference by ID
   */
  async getConferenceById(id: number): Promise<Conference | undefined> {
    if (!this.loaded) {
      await this.loadConferences();
    }
    return this.conferences.find(conference => conference.id === id);
  }

  /**
   * Get conference by name or abbreviation
   */
  async getConferenceByName(nameOrAbbr: string): Promise<Conference | undefined> {
    if (!this.loaded) {
      await this.loadConferences();
    }
    
    const lowerQuery = nameOrAbbr.toLowerCase();
    return this.conferences.find(conference => 
      conference.name.toLowerCase().includes(lowerQuery) || 
      conference.abbreviation.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get top conferences by prestige
   */
  async getTopConferencesByPrestige(limit: number = 10): Promise<Conference[]> {
    if (!this.loaded) {
      await this.loadConferences();
    }
    
    return [...this.conferences]
      .sort((a, b) => b.prestige - a.prestige)
      .slice(0, limit);
  }
}

// Create a singleton instance
const conferenceService = new ConferenceService();
export default conferenceService;
