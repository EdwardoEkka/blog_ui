import React, { useState } from "react";
import { TextField, InputLabel, Select, MenuItem, FormControl, Box } from '@mui/material';

function Edit({ fFmaily, fSize, fColor, fAlignment }) {
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    fSize(newSize);
  };

  const handleFontColorChange = (e) => {
    setFontColor(e.target.value);
    fColor(e.target.value);
  };

  const handleFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
    fFmaily(e.target.value);
  };

  return (
    <Box display="flex" gap="20px" padding="20px">
      <TextField
        label="Font Size"
        type="number"
        value={fontSize}
        onChange={handleFontSizeChange}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Font Color"
        type="color"
        value={fontColor}
        onChange={handleFontColorChange}
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="fontFamily">Font Family</InputLabel>
        <Select
          value={fontFamily}
          onChange={handleFontFamilyChange}
          label="Font Family"
          inputProps={{ id: 'fontFamily' }}
          style={{ fontFamily }}
        >
          <MenuItem value="Arial" style={{ fontFamily: "Arial" }}>Arial</MenuItem>
          <MenuItem value="Verdana" style={{ fontFamily: "Verdana" }}>Verdana</MenuItem>
          <MenuItem value="Times New Roman" style={{ fontFamily: "Times New Roman" }}>Times New Roman</MenuItem>
          <MenuItem value="Helvetica" style={{ fontFamily: "Helvetica" }}>Helvetica</MenuItem>
          <MenuItem value="Georgia" style={{ fontFamily: "Georgia" }}>Georgia</MenuItem>
          <MenuItem value="Courier New" style={{ fontFamily: "Courier New" }}>Courier New</MenuItem>
          <MenuItem value="Impact" style={{ fontFamily: "Impact" }}>Impact</MenuItem>
          <MenuItem value="Comic Sans MS" style={{ fontFamily: "Comic Sans MS" }}>Comic Sans MS</MenuItem>
          <MenuItem value="Trebuchet MS" style={{ fontFamily: "Trebuchet MS" }}>Trebuchet MS</MenuItem>
          <MenuItem value="Palatino Linotype" style={{ fontFamily: "Palatino Linotype" }}>Palatino Linotype</MenuItem>
          <MenuItem value="Arial Black" style={{ fontFamily: "Arial Black" }}>Arial Black</MenuItem>
          <MenuItem value="Lucida Console" style={{ fontFamily: "Lucida Console" }}>Lucida Console</MenuItem>
          <MenuItem value="Calibri" style={{ fontFamily: "Calibri" }}>Calibri</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default Edit;
