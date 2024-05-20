// src/components/TagsInput.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/lab/Autocomplete';

const TagsInput = ({ tags, setTags, availableTags }) => {
  const [inputValue, setInputValue] = useState('');

 

  return (
    <div>
      <Autocomplete
        multiple
        freeSolo
        options={availableTags}
        value={tags}
        onChange={(event, newTags) => setTags(newTags)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Add a tag"
            fullWidth
          />
        )}
      />
    </div>
  );
};

export default TagsInput;
