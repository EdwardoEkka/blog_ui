import React, { useState } from 'react';
import Edit from './edit';

function ParentComponent() {
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');

  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const handleFontColorChange = (newFontColor) => {
    setFontColor(newFontColor);
  };

  return (
    <div>
      <Edit fSize={handleFontSizeChange} fColor={handleFontColorChange} />
      <div style={{ fontSize: `${fontSize}px`, color: fontColor }}>
        This text will change according to the selected properties.
      </div>
    </div>
  );
}

export default ParentComponent;
