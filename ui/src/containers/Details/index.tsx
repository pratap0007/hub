import React from 'react';
import { useMst } from '../../store/root';
import { useObserver } from 'mobx-react';
import { Spinner } from '@patternfly/react-core';

const Details: React.FC = () => {
  const { resources } = useMst();

  return useObserver(() =>
    resources.resources.size === 0 ? (
      <Spinner />
    ) : (
      <React.Fragment>
        <span>
          {console.log(resources.isLoading)}
          {console.log('in details----', resources.resources.get('1').name)}
          Add Resources detail here
        </span>
      </React.Fragment>
    )
  );
};
export default Details;
