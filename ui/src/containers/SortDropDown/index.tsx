import React, { useState } from 'react';
import { Select, SelectVariant, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import { useObserver } from 'mobx-react';
import { useMst } from '../../store/root';
import { SortByFields } from '../../store/resource';
import './SortDropDown.css';

const Sort: React.FC = () => {
  const { resources } = useMst();

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const items: Array<string> = Object.values(SortByFields);
  const keys = items.slice(1).map((value) => (
    <SelectOption
      key={value}
      id={value}
      value={value}
      inputId={value}
      onClick={(e) => {
        resources.setSortBy(e.currentTarget.id.substr(0, e.currentTarget.id.length - 2));
      }}
    />
  ));

  const clearSelection = () => {
    setIsOpen(false);
    setSelected('');
    resources.setSortBy('');
  };

  const onToggle = () => setIsOpen(!isOpen);

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
    isPlaceholder: boolean | undefined
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(value.toString());
      setIsOpen(false);
    }
  };

  return useObserver(() => {
    return (
      <div className="hub-sort">
        <Select
          variant={SelectVariant.typeahead}
          typeAheadAriaLabel="Sort By"
          onToggle={onToggle}
          onSelect={onSelect}
          onClear={clearSelection}
          isOpen={isOpen}
          selections={selected}
          placeholderText="Sort By"
        >
          {keys}
        </Select>
      </div>
    );
  });
};
export default Sort;
