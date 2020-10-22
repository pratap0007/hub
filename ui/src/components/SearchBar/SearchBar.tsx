import { TextInput } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IResourceStore } from '../../store/resources';
import './SearchBar.css';

export interface store {
  store: IResourceStore;
}

const SearchBar: React.FC<store> = (props: store) => {
  const [value, setValue] = useState('');
  const history = useHistory();

  const onSearchChange = (text: string) => {
    setValue(text);
    props.store.setSearchInput(text);
  };

  const onSearchKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      history.push('/');
    }
    return;
  };

  return (
    <TextInput
      defaultValue={value}
      type="search"
      onChange={onSearchChange}
      onKeyPress={onSearchKeyPress}
      aria-label="text input example"
      placeholder="Search for resources..."
      spellCheck="false"
      className="search-bar"
    />
  );
};

export default SearchBar;
