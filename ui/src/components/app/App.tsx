import React, { useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { Page, PageSection, Grid, GridItem, Pagination } from '@patternfly/react-core';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Background from '../background/Background';

const App: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPgae, setPerPage] = useState(20);

  const setPage = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => {
    setPageNumber(page);
  };
  const perPageSelect = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    perpage: number
  ) => {
    setPerPage(perpage);
  };
  

  return (
    <React.Fragment>
      <Page header={<Header />}>
        <Background />
        <PageSection style={{ height: '80em' }}>
          <Grid hasGutter rowSpan={12}>
            <GridItem span={2} rowSpan={12}>
              Filter
            </GridItem>
            <GridItem span={10} rowSpan={12}>
              Resources
              {/* TODO: pagination should be  should be in Resource container componnet */}
              <Pagination
                itemCount={200}
                perPage={perPgae}
                onSetPage={setPage}
                onPerPageSelect={perPageSelect}
                page={pageNumber}
                isCompact
              />
            </GridItem>
          </Grid>
        </PageSection>
          <Footer />
      </Page> 
      </React.Fragment>
  );
};

export default App;
