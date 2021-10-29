import './App.css';
import Login from './Login';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Login host="http://api-staging.parrot.rest"></Login>
            </header>
        </div>
    );
}

export default App;
