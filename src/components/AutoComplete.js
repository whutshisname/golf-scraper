import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import items from '../data/clubTypes.json';

function LimitedAutocomplete({ maxItems }) {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleAutocompleteChange = (event, newValue) => {
    // Check if the new value array is greater than our specified maxItems
    if (newValue.length <= maxItems) {
      setSelectedValues(newValue);
    } else {
      // If it's greater than the limit, we don't update the state.
      event.preventDefault();
    }
  };

  return (
    <Autocomplete
      multiple
      id="limited-autocomplete"
      options={items}
      getOptionLabel={(option) => option.displayValue}
      value={selectedValues}
      onChange={handleAutocompleteChange}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Select Items" />
      )}
    />
  );
}

export default LimitedAutocomplete;
