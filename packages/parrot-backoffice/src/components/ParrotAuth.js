import React, {useContext, createContext, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import {Home} from './Home';
import {Login} from './Login';

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

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

const useProvideAuth = () => {
    const [user, setUser] = useState(null);

    const signin = cb => {
        return fakeAuth.signin(() => {
            setUser("user");
            cb();
        });
    };

    const signout = cb => {
        return fakeAuth.signout(() => {
            setUser(null);
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
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
                            <Link to="/public">Public Page</Link>
                        </li>
                        <li>
                            <Link to="/protected">Protected Page</Link>
                        </li>
                    </ul>

                    <Switch>
                        <Route path="/public">
                            <PublicPage/>
                        </Route>
                        <Route path="/login">
                            <Login context={authContext}/>
                        </Route>
                        <PrivateRoute path="/protected">
                            <Home context={authContext}/>
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
    return (
        <Route
            {...rest}
            render={({location}) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
};

const PublicPage = () => {
    return <h3>Public</h3>;
};
