import React from 'react';
import Resources, { resourceName } from '.';
import { FakeHub } from '../../api/testutil';
import { createProviderAndStore } from '../../store/root';
import { mount, shallow } from 'enzyme';
import { when } from 'mobx';
import { BrowserRouter as Router } from 'react-router-dom';

const TESTDATA_DIR = `src/store/testdata`;
const api = new FakeHub(TESTDATA_DIR);
const { Provider, root } = createProviderAndStore(api);

describe('Resource Component', () => {
  it('should render the resources component', (done) => {
    const component = mount(
      <Provider>
        <Router>
          <Resources />
        </Router>
      </Provider>
    );

    const { resources } = root;
    when(
      () => {
        return !resources.isLoading;
      },
      () => {
        setTimeout(() => {
          const resource = resources.filteredResources;
          expect(resource.length).toBe(6);

          component.update();

          const r = component.find(Resources);
          expect(r.length).toEqual(1);

          expect(component.debug()).toMatchSnapshot();

          done();
        }, 0);
      }
    );
  });

  it('should display the  display name', () => {
    const wrapper = shallow(resourceName('tekton', 'Tekton-Hub'));
    expect(wrapper.find('span').text()).toBe('Tekton-Hub');
  });

  it('should display the name', () => {
    const wrapper = shallow(resourceName('tekton', ''));
    expect(wrapper.find('span').text()).toBe('tekton');
  });
});
