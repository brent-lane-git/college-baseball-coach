import React, { useState, useEffect } from 'react';
import { Conference } from '../models/conference.model';
import { useConferences } from '../store/ConferenceContext';
import ColorPicker from './ColorPicker';

interface ConferenceEditorProps {
  conference?: Conference; // Existing conference for editing (undefined for new)
  onSave: (conference: Conference) => void;
  onCancel: () => void;
}

const ConferenceEditor: React.FC<ConferenceEditorProps> = ({ 
  conference, 
  onSave, 
  onCancel 
}) => {
  const { conferences } = useConferences();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Initialize with default values or existing conference data
  const [formData, setFormData] = useState<Partial<Conference>>({
    id: 0,
    name: '',
    abbreviation: '',
    prestige: 50,
    color: '0000FF'
  });

  // Initialize form with existing conference data if editing
  useEffect(() => {
    if (conference) {
      setFormData({
        ...conference
      });
    } else {
      // For new conference, find the highest existing ID and add 1
      const highestId = conferences.length > 0 
        ? Math.max(...conferences.map(c => c.id)) 
        : -1;
      
      setFormData(prev => ({ 
        ...prev, 
        id: highestId + 1
      }));
    }
  }, [conference, conferences]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert to number for number inputs
    if (type === 'number' || name === 'id' || name === 'prestige') {
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

  const handleColorChange = (color: string) => {
    // Remove # if present
    const colorValue = color.startsWith('#') ? color.substring(1) : color;
    setFormData(prev => ({ ...prev, color: colorValue }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.id === undefined || formData.id < 0) {
      errors.id = 'ID must be a non-negative number';
    }

    if (!formData.name?.trim()) {
      errors.name = 'Conference name is required';
    }

    if (!formData.abbreviation?.trim()) {
      errors.abbreviation = 'Abbreviation is required';
    }

    if (formData.prestige === undefined || formData.prestige < 0 || formData.prestige > 100) {
      errors.prestige = 'Prestige must be between 0 and 100';
    }

    if (!formData.color?.match(/^[0-9A-Fa-f]{6}$/)) {
      errors.color = 'Color must be a valid hex code (without #)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Cast to Conference since we've validated all required fields
      onSave(formData as Conference);
    }
  };

  return (
    <div className="conference-editor">
      <h2>{conference ? 'Edit Conference' : 'Create New Conference'}</h2>
      
      <form onSubmit={handleSubmit} className="conference-editor-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="id">Conference ID:</label>
            <input
              type="number"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className={formErrors.id ? 'error' : ''}
              min="0"
              disabled={conference !== undefined} // Can't change ID of existing conference
            />
            {formErrors.id && <div className="error-message">{formErrors.id}</div>}
            <div className="field-help">This auto-generated ID is used as a unique identifier and cannot be changed later.</div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Conference Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'error' : ''}
              placeholder="e.g., Southeastern Conference"
            />
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="abbreviation">Abbreviation:</label>
            <input
              type="text"
              id="abbreviation"
              name="abbreviation"
              value={formData.abbreviation}
              onChange={handleInputChange}
              className={formErrors.abbreviation ? 'error' : ''}
              placeholder="e.g., SEC"
            />
            {formErrors.abbreviation && <div className="error-message">{formErrors.abbreviation}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="prestige">Prestige: {formData.prestige}/100</label>
            <input
              type="range"
              id="prestige"
              name="prestige"
              min="0"
              max="100"
              value={formData.prestige}
              onChange={handleRangeChange}
              className={formErrors.prestige ? 'error' : ''}
            />
            <div className="range-labels">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
            {formErrors.prestige && <div className="error-message">{formErrors.prestige}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="color">Conference Color:</label>
            <ColorPicker 
              color={`#${formData.color}`}
              onChange={handleColorChange}
            />
            {formErrors.color && <div className="error-message">{formErrors.color}</div>}
            <div className="color-preview" style={{ backgroundColor: `#${formData.color}` }}>
              <span className="conf-abbreviation" style={{ 
                color: isDarkColor(formData.color || '') ? '#FFFFFF' : '#000000'
              }}>
                {formData.abbreviation}
              </span>
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="save-button">Save Conference</button>
        </div>
      </form>
    </div>
  );
};

// Helper function to determine if a color is dark
function isDarkColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  
  // Calculate perceived brightness (YIQ formula)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}

export default ConferenceEditor;
