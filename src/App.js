import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Pokedetails from './components/Pokedetails/Pokedetails';
import Pokedex from './components/Pokedex/Pokedex'
function App() {
  return (     
      <Switch>
        <Route exact path="/" render={(props) => <Pokedex {...props} />} />
        <Route
          exact
          path="/:pokemonId"
          render={(props) => <Pokedetails {...props} />}
        />
      </Switch>
  );
}

export default App;