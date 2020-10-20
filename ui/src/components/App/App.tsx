import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Page, PageSection, Grid, GridItem } from '@patternfly/react-core';
import { observer } from 'mobx-react';

import Header from '../Header/Header';
import Background from '../BackGround/BackGround';
import { IResourceStore } from '../../store/resources';
import Footer from '../Footer/Footer';
import Resources from '../Resources/Resources';
import LeftPane from '../LeftPane/LeftPane';
import Details from '../Details/Details';

import './App.css';

interface store {
  store: IResourceStore;
}

const App = observer(({ store }: store) => {
  return (
    <Router>
      <Page header={<Header />}>
        <Route exact path="/" component={Background} />
        <PageSection>
          <Grid hasGutter>
            <GridItem span={2} rowSpan={1}>
              <Route exact path="/" component={() => <LeftPane store={store} />}></Route>
            </GridItem>

            <GridItem span={10} rowSpan={2}>
              <Route exact path="/" component={Resources}></Route>
              <Route exact path="/details" component={Details}></Route>
            </GridItem>
          </Grid>
        </PageSection>
        <Footer />
      </Page>
    </Router>
  );
});
export default App;
