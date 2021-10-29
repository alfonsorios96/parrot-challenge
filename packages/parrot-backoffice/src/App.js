import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import './App.css';


import Login from './Login';

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Login</Link>
                            </li>
                            <li>
                                <Link to="/home">Inicio</Link>
                            </li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route path="/home">
                            <h2>Inicio</h2>
                        </Route>
                        <Route path="/">
                            <Login host="http://api-staging.parrot.rest"></Login>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
