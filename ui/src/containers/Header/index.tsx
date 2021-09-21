import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import {
  PageHeader,
  Brand,
  PageHeaderTools,
  Text,
  TextVariants,
  GridItem,
  Grid,
  Modal,
  ModalVariant,
  TextContent,
  TextList,
  TextListItem,
  Button
} from '@patternfly/react-core';
import logo from '../../assets/logo/logo.png';
import { IconSize } from '@patternfly/react-icons';
import Search from '../../containers/Search';
import './Header.css';
import { scrollToTop } from '../../common/scrollToTop';
import Icon from '../../components/Icon';
import { Icons } from '../../common/icons';
import UserProfile from '../UserProfile';
import { useMst } from '../../store/root';
import { AUTH_BASE_URL, REDIRECT_URI } from '../../config/constants';
import { IProvider } from '../../store/provider';
import { titleCase } from '../../common/titlecase';

const Header: React.FC = observer(() => {
  const { user, providers } = useMst();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = React.useState(false);

  const headerTools = (
    <PageHeaderTools>
      <Grid>
        <GridItem span={10}>
          <Search />
        </GridItem>
        <GridItem span={1} onClick={() => setIsModalOpen(true)} className="header-search-hint">
          <Icon id={Icons.Help} size={IconSize.sm} label={'search-tips'} />
        </GridItem>
      </Grid>
      {user.isAuthenticated && user.refreshTokenInfo.expiresAt * 1000 > global.Date.now() ? (
        <UserProfile />
      ) : (
        <Text
          style={{ textDecoration: 'none' }}
          component={TextVariants.a}
          onClick={() => setIsSignInModalOpen(true)}
        >
          <span className="hub-header-login">
            <b>Login</b>
          </span>
        </Text>
      )}
    </PageHeaderTools>
  );

  const homePage = () => {
    if (!window.location.search) history.push('/');
    scrollToTop();
  };

  return (
    <React.Fragment>
      <PageHeader
        logo={<Brand src={logo} alt="Tekton Hub Logo" onClick={homePage} />}
        headerTools={headerTools}
      />
      <Modal
        variant={ModalVariant.small}
        title="Search tips:"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Grid>
          <TextContent>
            <TextList>
              <TextListItem>Press `/` to quickly focus on search.</TextListItem>
              <TextListItem>Search resources by name, displayName, and tags.</TextListItem>
              <TextListItem>
                Filter resources by tags using the qualifier like `tags:tagA,tagB`
              </TextListItem>
            </TextList>
          </TextContent>
        </Grid>
      </Modal>

      <Modal
        variant={ModalVariant.small}
        title="Sign In:"
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        actions={[
          <Grid key="close-button">
            <GridItem offset={10}>
              <Button
                style={{ marginLeft: '0.7em' }}
                key="cancel"
                variant="secondary"
                onClick={() => setIsSignInModalOpen(false)}
              >
                Close
              </Button>
            </GridItem>
          </Grid>
        ]}
      >
        <Grid>
          {providers.values.slice(0, 1).map((provider: IProvider) => (
            <GridItem key={provider.name} offset={3} span={6} className="header-sigin-button">
              <Button
                variant="secondary"
                component="a"
                isBlock
                href={`${AUTH_BASE_URL}/auth/${provider.name}?redirect_uri=${REDIRECT_URI}`}
              >
                <span className="header-sigin-button__icon ">
                  <Icon id={provider.name as Icons} size={IconSize.sm} label={provider.name} />
                </span>
                {titleCase(provider.name)}
              </Button>
            </GridItem>
          ))}
        </Grid>
      </Modal>
    </React.Fragment>
  );
});
export default Header;
