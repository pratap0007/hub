import { TextInput } from '@patternfly/react-core';
import React, { useState } from 'react';

import './SearchBar.css';

const SearchBar: React.FC = () => {
  const [value, setValue] = useState('');

  const setInput = (event: string) => {
    setValue(event);
  };

  return (
    <TextInput
      value={value}
      type="search"
      onChange={setInput}
      aria-label="text input example"
      placeholder="Search for resources..."
      spellCheck="false"
      className="search-bar"
    />
  );
};

export default SearchBar;
