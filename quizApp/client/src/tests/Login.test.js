import React from "react";
import renderer from 'react-test-renderer'
import { Link } from "react-router-dom";

test('rendersc correctly', () => { 
    const tree = renderer
    .create(<Link to='localhost:3001'>Login</Link>)
    .toJSON();
    expect(tree).toMatchSnapshot()
 })
