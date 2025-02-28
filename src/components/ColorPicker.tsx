import React, { useState, useEffect, useRef } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [colorValue, setColorValue] = useState(color || '#000000');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColorValue(color);
  }, [color]);

  // Handle clicks outside of the color picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorValue(newColor);
    onChange(newColor);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  // Common colors for quick selection
  const commonColors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
    '#0000FF', '#4B0082', '#8B00FF', '#000000',
    '#FFFFFF', '#800000', '#FFA500', '#008000',
    '#000080', '#800080', '#808080', '#D4AF37'
  ];

  const handleCommonColorClick = (color: string) => {
    setColorValue(color);
    onChange(color);
  };

  return (
    <div className="color-picker-container" ref={pickerRef}>
      <div 
        className="color-preview-box" 
        style={{ backgroundColor: colorValue }}
        onClick={togglePicker}
      ></div>
      <input 
        type="text" 
        className="color-value-input"
        value={colorValue}
        onChange={(e) => {
          setColorValue(e.target.value);
          if (e.target.value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
            onChange(e.target.value);
          }
        }}
      />
      
      {showPicker && (
        <div className="color-picker-popup">
          <input 
            type="color" 
            value={colorValue}
            onChange={handleColorChange}
            className="color-input"
          />
          <div className="common-colors">
            {commonColors.map(color => (
              <div 
                key={color} 
                className="common-color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleCommonColorClick(color)}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
