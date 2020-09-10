import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import { useObserver } from 'mobx-react';
import { Text, TextVariants } from '@patternfly/react-core';
import { Grid, GridItem } from '@patternfly/react-core';
import { Button } from '@patternfly/react-core/dist/js/components';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import '@patternfly/react-core/dist/styles/base.css';

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

const checkboxes = (items: Filterable[]) =>
  items.map((c: Filterable) => (
    <Checkbox
      key={c.id}
      label={c.name}
      isChecked={c.selected}
      onChange={() => c.toggle()}
      aria-label="controlled checkbox"
      id={`${c.id}`}
      name={c.name}
    />
  ));

const Filter: React.FC<FilterList> = ({ store, header }) => {
  return useObserver(() => (
    <div style={{ margin: '3em' }}>
      <Grid sm={6} md={4} lg={3} xl2={1}>
        <GridItem span={1} rowSpan={2} style={{ width: '10em' }}>
          <Text component={TextVariants.h1} style={{ fontWeight: 'bold' }}>
            {header}
          </Text>
        </GridItem>

        <GridItem rowSpan={2}>
          <Button variant="plain" aria-label="Clear" onClick={store.clear}>
            <TimesIcon />
          </Button>
        </GridItem>
      </Grid>

      <Grid>
        <GridItem>
          <div>{checkboxes(store.list)}</div>
        </GridItem>
      </Grid>
    </div>
  ));
};

export default Filter;
