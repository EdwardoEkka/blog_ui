// src/components/TagsInput.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/lab/Autocomplete';

const TagsInput = ({ tags, setTags, availableTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (event, newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

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
