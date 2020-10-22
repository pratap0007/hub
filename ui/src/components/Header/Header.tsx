import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  PageHeader,
  Brand,
  PageHeaderTools,
  Text,
  TextVariants,
  GridItem,
  Grid
} from '@patternfly/react-core';
import logo from '../../assets/logo/logo.png';
import SearchBar from '../SearchBar/SearchBar';
import { IResourceStore } from '../../store/resources';

interface store {
  store: IResourceStore;
}

const Header: React.FC<store> = (props: store) => {
  const { store } = props;
  const logoProps = {
    href: '/',
    target: ''
  };

  const headerTools = (
    <PageHeaderTools>
      <Grid>
        <GridItem span={11}>
          <SearchBar store={store} />
        </GridItem>
      </Grid>
      <Text component={TextVariants.h3}>Login</Text>
    </PageHeaderTools>
  );

  return (
    <PageHeader
      logo={<Brand src={logo} alt="Tekton Hub Logo" />}
      headerTools={headerTools}
      logoProps={logoProps}
    />
  );
};

export default Header;
