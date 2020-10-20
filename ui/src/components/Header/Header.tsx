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

const Header: React.FC = () => {
  const logoProps = {
    href: '/',
    target: ''
  };

  const headerTools = (
    <PageHeaderTools>
      <Grid>
        <GridItem span={11}>
          <SearchBar />
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
