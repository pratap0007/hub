import React from 'react';
import renderer from 'react-test-renderer';
import BackGround from './BackGround';

it('renders correctly', () => {
  const tree = renderer.create(<BackGround />).toJSON();
  expect(tree).toMatchSnapshot();
});
