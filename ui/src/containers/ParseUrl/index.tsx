import React from 'react';
import { useMst } from '../../store/root';
import { Params } from '../../common/params';
import { AuthCodeProps } from '../../store/auth';
const ParseUrl: React.FC = () => {
  const { resources, user } = useMst();

  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('status');
    const code = searchParams.get('code');

    // It checks status and code and then redirect to authentication
    if (status === '200' && code !== null) {
      const codeFinal: AuthCodeProps = {
        code: code
      };
      user.authenticate(codeFinal);
    }
    if (searchParams.has(Params.Query)) {
      resources.setSearch(searchParams.get(Params.Query));
    }
    if (searchParams.has(Params.Tag)) {
      const tags = searchParams.getAll(Params.Tag);
      resources.setSearch(`tags:${tags.join(',')}`);
      resources.setSearchedTags(searchParams.getAll(Params.Tag));
    }
    if (searchParams.has(Params.SortBy)) {
      resources.setSortBy(searchParams.get(Params.SortBy));
    }
    // Storing url params to store inorder to parse the url only after successfully resource load
    resources.setURLParams(window.location.search);
  }
  return <> </>;
};
export default ParseUrl;
