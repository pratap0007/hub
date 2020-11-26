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
import Search from '../../containers/Search';
import { useHistory } from 'react-router-dom';

const Header: React.FC = () => {
  const history = useHistory();

  const headerTools = (
    <PageHeaderTools>
      <Grid>
        <GridItem span={11}>
          <Search />
        </GridItem>
      </Grid>
      <Text component={TextVariants.h3}>Login</Text>
    </PageHeaderTools>
  );

  return (
    <PageHeader
      logo={<Brand src={logo} alt="Tekton Hub Logo" onClick={() => history.push('/')} />}
      headerTools={headerTools}
    />
  );
};

export default Header;
