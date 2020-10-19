import React from 'react';
import { useObserver } from 'mobx-react';
import { Button, Checkbox, Text, TextVariants, Grid, GridItem } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import './Filter.css';

interface Filterable {
  id: number;
  name: string;
  selected: boolean;
  toggle(): void;
}

interface Store {
  list: Filterable[];
  clear(): void;
}

interface FilterList {
  store: Store;
  header: string;
}

/**
 * To convert the first letter of the input word to Upper Case
 * @param str {String}
 */
export const titleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const checkboxes = (items: Filterable[]) =>
  items.map((c: Filterable) => (
    <Checkbox
      key={c.id}
      label={titleCase(c.name)}
      isChecked={c.selected}
      onChange={() => c.toggle()}
      aria-label="controlled checkbox"
      id={`${c.id}`}
      name={c.name}
    />
  ));

const Filter: React.FC<FilterList> = ({ store, header }) => {
  return useObserver(() => (
    <div className="Filter">
      <Grid sm={6} md={4} lg={3} xl2={1}>
        <GridItem className="Text-Header">
          <Text component={TextVariants.h1} style={{ fontWeight: 'bold', width: '4em' }}>
            {header}
          </Text>
        </GridItem>

        <Button variant="plain" aria-label="Clear" onClick={store.clear}>
          <TimesIcon />
        </Button>
      </Grid>

      <Grid>
        <GridItem className="Checkboxes">{checkboxes(store.list)}</GridItem>
      </Grid>
    </div>
  ));
};

export default Filter;
