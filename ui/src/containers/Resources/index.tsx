import React from 'react';
import { Gallery, GridItem, Grid } from '@patternfly/react-core';
import { useMst } from '../../store/root';
import { useObserver } from 'mobx-react';
import Cards from '../../components/Cards';
import './Resources.css';

export const resourceName = (name: string, displayName: string) => {
  return displayName === '' ? <span>{name}</span> : <span>{displayName}</span>;
};

const Resources = () => {
  const { resources } = useMst();

  return useObserver(() => (
    <React.Fragment>
      <Grid className="hub-resource">
        <GridItem>
          <Gallery hasGutter>
            <Cards resources={resources.filteredResources} />
          </Gallery>
        </GridItem>
      </Grid>
    </React.Fragment>
  ));
};

export default Resources;
