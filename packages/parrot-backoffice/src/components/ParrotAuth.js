import React, {useContext, createContext, useState, useEffect} from 'react';
import Config from '../config.json';
import {Provider} from 'react-redux';
import store from '../store';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect, useHistory, useLocation
} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {resetSession, saveSession} from '../reducers/user';
import {Home} from './Home';
import {RequestManager} from '@parrot/requester-manager';
import ParrotLogin from '@parrot/login-page';

const fakeAuth = {
    isAuthenticated: false,
    signin(cb) {
        fakeAuth.isAuthenticated = true;
        cb();
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        cb();
    }
};

const API_REST_HOST = Config.BASE_URL || 'https://api-staging.parrot.rest';

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext(undefined, undefined);

const useProvideAuth = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    const signin = cb => {
        return fakeAuth.signin(() => {
            setUser("user");
            cb();
        });
    };

    const signout = cb => {
        return fakeAuth.signout(() => {
            dispatch(resetSession());
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            setUser(null);
            cb();
        });
    };

    return {
        user,
        signin,
        signout
    };
};

export const ParrotAuth = () => {
    return (
        <ProvideAuth>
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/protected">Protected Page</Link>
                        </li>
                    </ul>

                    <Switch>
                        <Route path="/login">
                            <Provider store={store}>
                                <ParrotLogin context={authContext} host={API_REST_HOST}></ParrotLogin>
                            </Provider>
                        </Route>
                        <PrivateRoute path="/protected">
                            <Home context={authContext} host={API_REST_HOST}/>
                        </PrivateRoute>
                    </Switch>
                </div>
            </Router>
        </ProvideAuth>
    );
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
    });

    return (
        <Route
            {...rest}
            render={({location}) => {
                return fakeAuth.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                );
            }
            }
        />
    );
};
