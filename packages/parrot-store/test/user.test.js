import reducer, {resetSession, saveSession} from '../reducers/user';

test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
        value: null
    });
});

test('should handle an user being logged', () => {
    const previousState = {
        value: false
    };
    expect(reducer(previousState, saveSession({
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM1Nzg1OTE4LCJqdGkiOiIzZjQzODFmYjIwZDA0MmYwOGU3NjNlNjI3YjA0ODczNSIsInVzZXJfaWQiOjEzfQ.aqsakCIOhTON2eFy5wls3tCi5S97gErAgqMFW1ptaDE',
        refresh_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzODI5MTUxOCwianRpIjoiOWI2YmU1OGZhZDY0NDYzMGFiN2I4MDcxYTVmZGI1MTMiLCJ1c2VyX2lkIjoxM30.CRg0MFTqKNEWvxfK3e4eJOQvewri_0jA0ALTSGXnovE'
    }))).toEqual({
        value: {
            access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM1Nzg1OTE4LCJqdGkiOiIzZjQzODFmYjIwZDA0MmYwOGU3NjNlNjI3YjA0ODczNSIsInVzZXJfaWQiOjEzfQ.aqsakCIOhTON2eFy5wls3tCi5S97gErAgqMFW1ptaDE',
            refresh_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzODI5MTUxOCwianRpIjoiOWI2YmU1OGZhZDY0NDYzMGFiN2I4MDcxYTVmZGI1MTMiLCJ1c2VyX2lkIjoxM30.CRg0MFTqKNEWvxfK3e4eJOQvewri_0jA0ALTSGXnovE'
        }
    })
});

test('should handle an user being logout', () => {
    const previousState = {
        value: {
            access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM1Nzg1OTE4LCJqdGkiOiIzZjQzODFmYjIwZDA0MmYwOGU3NjNlNjI3YjA0ODczNSIsInVzZXJfaWQiOjEzfQ.aqsakCIOhTON2eFy5wls3tCi5S97gErAgqMFW1ptaDE',
            refresh_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzODI5MTUxOCwianRpIjoiOWI2YmU1OGZhZDY0NDYzMGFiN2I4MDcxYTVmZGI1MTMiLCJ1c2VyX2lkIjoxM30.CRg0MFTqKNEWvxfK3e4eJOQvewri_0jA0ALTSGXnovE'
        }
    };
    expect(reducer(previousState, resetSession())).toEqual({
        value: null
    })
});

