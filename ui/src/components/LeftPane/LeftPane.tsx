import React from 'react';
import { useObserver } from 'mobx-react';
import { GridItem, Grid, Text, TextVariants } from '@patternfly/react-core';
import SortByFilter from '../SortByFilter/SortByFilter';
import { IResourceStore } from '../../store/resources';
import CatalogFilter from '../CatalogFilter/CatalogFilter';
import KindFilter from '../KindFilter/KindFilter';
import CategoryFilter from '../CategoryFilter/CategoryFilter';

interface store {
  store: IResourceStore;
}

const LeftPane: React.FC<store> = (props: store) => {
  const store = props.store;
  return useObserver(() => (
    <div>
      <Grid
        sm={6}
        md={4}
        lg={3}
        xl2={1}
        style={{ marginLeft: '1.5em', marginTop: '2em', marginRight: '-2em' }}
      >
        <GridItem span={3}>
          <Text
            component={TextVariants.h1}
            style={{ fontWeight: 'bold', width: '3em', marginTop: '0.3em' }}
          >
            Sort
          </Text>
        </GridItem>
        <GridItem span={9}>
          <SortByFilter store={store} />
        </GridItem>
      </Grid>

      <KindFilter store={store.kindStore} />
      <CatalogFilter store={store.catalogStore} />
      <CategoryFilter store={store.categoryStore} />
    </div>
  ));
};

export default LeftPane;
