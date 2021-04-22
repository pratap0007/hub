import React from 'react';
import { observer } from 'mobx-react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Gallery,
  Spinner,
  Title,
  Button
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import { useHistory } from 'react-router-dom';
import { useMst } from '../../store/root';
import { IResource } from '../../store/resource';
import Cards from '../../components/Cards';
import { UpdateURL } from '../../utils/updateUrl';
import './Resources.css';

/* This component  */
const Resources: React.FC = observer(() => {
  const { resources, categories } = useMst();
  const { catalogs, kinds, search, sortBy } = resources;

  const history = useHistory();

  React.useEffect(() => {
    const selectedcategories = categories.selectedByName.join(',');
    const selectedKinds = [...kinds.selected].join(',');
    const selectedCatalogs = catalogs.selectedByName.join(',');

    const url = UpdateURL(search, sortBy, selectedcategories, selectedKinds, selectedCatalogs);
    if (!resources.isLoading) history.replace(`?${url}`);
  }, [search, sortBy, categories.selectedByName, kinds.selected, catalogs.selected]);

  // Function to clear all filters and redirect to home page
  const clearFilter = () => {
    resources.clearAllFilters();
    history.push('/');
  };

  /* This function checks resource length if it is empty return
  `No Resource Found` otherwise returns resources in the cards*/
  const checkResources = (items: IResource[]) => {
    return !items.length ? (
      <EmptyState variant={EmptyStateVariant.full} className="hub-resource-emptystate__margin">
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h5" size="md">
          No Resource Found.
        </Title>
        <Button variant="primary" onClick={clearFilter}>
          Clear All Filters
        </Button>
      </EmptyState>
    ) : (
      <Gallery hasGutter className="hub-resource">
        <Cards items={items} />
      </Gallery>
    );
  };

  return resources.resources.size === 0 ? (
    <Spinner className="hub-spinner" />
  ) : (
    <React.Fragment>{checkResources(resources.filteredResources)}</React.Fragment>
  );
});
export default Resources;
