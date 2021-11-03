import React from 'react';
import {shallow} from 'enzyme';

import Sample from './Sample';

describe('Sample', () => {
    test('should render', () => {
        const wrapper = shallow(
            <Sample/>
        );

        expect(wrapper.exists()).toBeTruthy();
    });
});
