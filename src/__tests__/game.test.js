import React from 'react';
import { shallow, mount} from 'enzyme';
import Game from '../game';

describe('<Game/> - rendering of components', () => {
  it ('renders without crashing', () => {
    const component = shallow(<Game/>);
    expect(component).toHaveLength(1);
  });
});

describe('<Game/> - events', () => {
it('handles the "mouseClick" event properly', () => {
  const component = mount(<Game/>);
  component.simulate('click');
  expect(component.state().test_fired).toBe(true);
});
it('handles the "mouseMove" event properly', () => {
  const component = mount(<Game/>);
  component.simulate('mousemove');
  expect(component.state().test_moved).toBe(true);
});
});




