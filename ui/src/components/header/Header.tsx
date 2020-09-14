import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  PageHeader,
  Brand,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageHeaderTools
} from '@patternfly/react-core';
import { GithubIcon, UserIcon } from '@patternfly/react-icons';
import logo from '../../assets/logo/logo.png';

const Header: React.FC = () => {
  const logoProps = {
    href: '/',
    target: ''
  };

  const headerTools = (
    <PageHeaderTools>
      <PageHeaderToolsGroup
        visibility={{
          default: 'hidden',
          md: 'visible'
        }}
      >
        <PageHeaderToolsItem >
          <span style={{marginRight: '1em',fontWeight: 'bold',fontSize: '1em'}}>{' '}Login</span>
        </PageHeaderToolsItem>

        <PageHeaderToolsItem>
          <UserIcon size="md" style={{ marginRight: '1em' }} />
        </PageHeaderToolsItem>

        <PageHeaderToolsItem>
          <GithubIcon size="md" />
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
    </PageHeaderTools >
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
