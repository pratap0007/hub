import React from 'react';
import {
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  Pagination,
  GridItem,
  Grid
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [perPgae, setPerPage] = React.useState(20);

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
      <Grid>
        <GridItem>
          <Pagination
            itemCount={200}
            perPage={perPgae}
            onSetPage={setPage}
            onPerPageSelect={perPageSelect}
            page={pageNumber}
            isCompact
          />

          <Gallery hasGutter>
            {Array.apply(0, Array(20)).map((x, i) => (
              <GalleryItem key={i}>
                <Link to="details">
                  <Card isHoverable className="resource-card">
                    <CardBody>Resources</CardBody>
                  </Card>
                </Link>
              </GalleryItem>
            ))}
          </Gallery>
        </GridItem>
      </Grid>
    </React.Fragment>
  );
};

export default Resources;
