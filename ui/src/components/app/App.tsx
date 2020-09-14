import React, { useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
  PageSection,
  Grid,
  GridItem,
  Pagination,
  Card,
  CardHeader,
  GalleryItem,
  CardBody,
  Gallery
} from '@patternfly/react-core';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Background from '../background/Background';
import './app.css';

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
        <PageSection>
          <Grid hasGutter>
            <GridItem span={1} rowSpan={1}>
              Filter
            </GridItem>
            <GridItem span={11} rowSpan={2}>
              {/* TODO: pagination should be  should be in Resource container componnet */}
              <Pagination
                itemCount={200}
                perPage={perPgae}
                onSetPage={setPage}
                onPerPageSelect={perPageSelect}
                page={pageNumber}
                isCompact
              />
              <Gallery hasGutter>
                {Array.apply(0, Array(9)).map((x, i) => (
                  <GalleryItem key={i}>
                    <Card style={{ backgroundColor: 'white' }}>
                      <CardBody>This is a card</CardBody>
                    </Card>
                  </GalleryItem>
                ))}
              </Gallery>
            </GridItem>
          </Grid>
        </PageSection>
        <Footer />
      </Page>
    </React.Fragment>
  );
};

export default App;
