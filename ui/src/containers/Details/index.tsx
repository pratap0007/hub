import React from 'react';
import { useMst } from '../../store/root';
import { useParams } from 'react-router-dom';
import { useObserver } from 'mobx-react';

const Details: React.FC = () => {
  const { categories, resources } = useMst();

  const { catalog, name, id } = useParams();

  // console.log(name);
  console.log(resources.resources);

  return useObserver(() => (
    <React.Fragment>
      <span>
        Add Resources detail here
        {/* {resources.resources.get(name).name} */}
      </span>
    </React.Fragment>
  ));
};

export default Details;
