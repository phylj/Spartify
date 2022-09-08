import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';


// our first snapshot testing
it('renders correctly', () => {
  const tree = renderer
    .create(<App page="https://reactjs.org">react</App>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});