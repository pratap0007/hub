import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
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
import UserProfile from '../UserProfile';
import { useMst } from '../../store/root';
import './Header.css';
import { scrollToTop } from '../../common/scrollToTop';

/* This componnet returns header for hub , header contains
hub logo,search box and user profile if user is authenticated  */
const Header: React.FC = observer(() => {
  const { user } = useMst();
  const history = useHistory();

  //This function checks expiry time of refresh token
  const checkRefreshToken = () => {
    return user.isAuthenticated && user.refreshTokenInfo.expiresAt * 1000 > global.Date.now()
      ? true
      : false;
  };

  const headerTools = (
    <PageHeaderTools>
      <Grid>
        <GridItem span={11}>
          <Search />
        </GridItem>
      </Grid>
      {checkRefreshToken() ? (
        <UserProfile />
      ) : (
        <Text component={TextVariants.h3}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <span className="hub-header-login">Login</span>
          </Link>
        </Text>
      )}
    </PageHeaderTools>
  );

  /* This function scroll to top of home page and
     redirect to home page if users are at detail page */
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
    </React.Fragment>
  );
});
export default Header;
