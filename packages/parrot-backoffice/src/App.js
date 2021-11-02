import React, {useContext, createContext, useEffect} from 'react';
import {RequestManager} from '@parrot/requester-manager';
import Config from './config.json';
import {Spinner} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect, useHistory, useLocation
} from 'react-router-dom';
// Redux imports
import {Provider, useDispatch, useSelector} from 'react-redux';
import store, {resetSession, saveSession, isShowing, toggleSpinner} from '@parrot/store';
// Pages
import ParrotLogin from '@parrot/login-page';
import ParrotHome from '@parrot/home-page';

import './App.scss';

const Auth = {
    isAuthenticated: false,
    signin(cb) {
        Auth.isAuthenticated = true;
        cb();
    },
    signout(cb) {
        Auth.isAuthenticated = false;
        cb();
    }
};

const API_REST_HOST = Config.BASE_URL || 'https://api-staging.parrot.rest';

const authContext = createContext(undefined, undefined);

const useProvideAuth = () => {
    const dispatch = useDispatch();

    const signin = cb => {
        return Auth.signin(() => {
            cb();
        });
    };

    const signout = cb => {
        return Auth.signout(() => {
            dispatch(resetSession());
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            cb();
        });
    };

    return {
        signin,
        signout
    };
};

const ProvideAuth = ({children}) => {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
};

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({children, ...rest}) => {
    const auth = useContext(authContext);
    const history = useHistory();
    const location = useLocation();
    const {from} = location.state || {from: {pathname: '/'}};
    const dispatch = useDispatch();

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token') || '';
        if (access_token !== '') {
            const requester = new RequestManager(API_REST_HOST);
            requester.request({
                endpoint: 'api/auth/token/test',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                before: () => {
                    dispatch(toggleSpinner(true));
                },
                after: () => {
                    dispatch(toggleSpinner(false));
                }
            }).then(payload => {
                if (payload.status === 'ok') {
                    auth.signin(() => {
                        dispatch(saveSession({
                            access_token: sessionStorage.getItem('access_token'),
                            refresh_token: sessionStorage.getItem('refresh_token')
                        }));
                    });
                }
            }).catch(error => {
                // TODO Handle error
                history.replace(from);
            }).finally(() => {
                // TODO Finally
            })
        }
        return function cleanup() {
            // TODO Clean listeners
        };
    }, []);

    return (
        <Route
            {...rest}
            render={({location}) => {
                return Auth.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {from: location}
                        }}
                    />
                );
            }
            }
        />
    );
};

const NoMatch = () => {
    const location = useLocation();

    return (
        <Redirect
            to={{
                pathname: '/login',
                state: { from: location }
            }}
        />
    );
};


const App = () => {

    const spinnerIsShowing = useSelector(isShowing);

    return (
        <ProvideAuth>
            <Router>
                <div className={`App ${spinnerIsShowing ? 'disabled' : ''}`}>
                    <Spinner className={'spinner'} animation="border" role="status" hidden={!spinnerIsShowing}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>

                    <Switch>
                        <Route exact path="/login">
                            <Provider store={store}>
                                <ParrotLogin context={authContext} host={API_REST_HOST}></ParrotLogin>
                            </Provider>
                        </Route>
                        <PrivateRoute exact path="/home">
                            <Provider store={store}>
                                <ParrotHome context={authContext} host={API_REST_HOST}/>
                            </Provider>
                        </PrivateRoute>
                        <Route path="*">
                            <NoMatch/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </ProvideAuth>
    );
};

export default App;
