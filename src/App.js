
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Album from './pages/Album';
import Song from './pages/Song';
import Artist from './pages/Artist'
import Landing from './pages/Landing';
import Login from './pages/Login';

/**
 * provides routing to different pages 
 */
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/albums">
             <Album/>
        </Route>
        <Route exact path="/songs">
             <Song/>
        </Route>
        <Route exact path="/artists">
             <Artist/>
        </Route>
       </Switch>
    </Router> 
  );
}

export default App;
