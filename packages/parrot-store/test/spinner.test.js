import reducer, {toggleSpinner} from '../reducers/spinner';

test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
        value: false
    });
});

test('should toggle to true the display for spinner', () => {
    const previousState = {
        value: false
    };
    expect(reducer(previousState, toggleSpinner(true))).toEqual({
        value: true
    })
});

test('should toggle to false the display for spinner', () => {
    const previousState = {
        value: false
    };
    expect(reducer(previousState, toggleSpinner(true))).toEqual({
        value: true
    })
});

test('should keep the same value for display the spinner', () => {
    const previousState = {
        value: true
    };
    expect(reducer(previousState, toggleSpinner(true))).toEqual({
        value: true
    })
});
