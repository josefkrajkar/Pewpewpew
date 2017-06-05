import React from 'react';
import { shallow, mount} from 'enzyme';
import Game from '../game';

describe('<Game/> - rendering of components', () => {
  it ('renders without crashing', () => {
    const component = shallow(<Game/>);
    expect(component).toHaveLength(1);
  });
});

/*
describe('<Resizer/> - rendering', () => {
it('renders without crashing', () => {
  const component = shallow(<Resizer/>);
  expect(component).toHaveLength(1);
});
it('renders props correctly', () => {
  const component = shallow(<Resizer name="resizer"/>);
  expect(component.instance().props.name).toBe('resizer');
});
it('renders children when passed in', () => {
  const component = shallow(<Resizer><div className="unique" /></Resizer> );
  expect(component.contains(<div className="unique" />)).toBe(true);
});
});

describe('<Resizer/> - events', () => {
it('handles the "mouseDown" event properly', () => {
  const component = mount(<Resizer/>);
  const resizer = component.find('div');
  resizer.simulate('mousedown');
  expect(component.state().clicked).toBe(true);
});
it('handles the "MouseUp" event properly', () => {
  const component = mount(<Resizer/>);
  const resizer = component.find('div');
  resizer.simulate('mouseup');
  expect(component.state().clicked).toBe(false);
});
it('handles the "MouseOut" event properly', () => {
  const component = mount(<Resizer/>);
  const resizer = component.find('div');
  resizer.simulate('mouseout');
  expect(component.state().clicked).toBe(false);
});
it('handles the "MouseMove" event properly', () => {
  const component = mount(<Resizer type="both">Content</Resizer>);
  const resizer = component.find('div');
  let x = component.state().style.width;
  let y = component.state().style.height;
  resizer.simulate('mousedown');
  resizer.simulate('mousemove');
  expect(component.state().style.width).not.toBe(x);
  expect(component.state().style.width).not.toBe(y);
});
});

*/




