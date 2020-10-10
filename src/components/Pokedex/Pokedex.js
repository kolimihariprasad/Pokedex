import React, { useState, useEffect } from 'react';
import SearchIcon from "@material-ui/icons/Search";
import { TextField } from "@material-ui/core";
import Card from "../Card/Card"
import { getPokemon, getAllPokemon } from '../../services/pokemon'
import './Pokedex.css';

function Pokedex(props) {
    const { history } = props;
    const [pokemonData, setPokemonData] = useState([]);
    const [nextUrl, setNextUrl] = useState('');
    const [prevUrl, setPrevUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const initialURL = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'
    const [filter, setFilter] = useState("");

    useEffect(() => {
        async function fetchData() {
        let response = await getAllPokemon(initialURL)
        setNextUrl(response.next);
        setPrevUrl(response.previous);
        await loadPokemon(response.results);
        setLoading(false);
        }
        fetchData();
    }, [])

    
    const loadPokemon = async (data) => {
        let _pokemonData = await Promise.all(data.map(async pokemon => {
        let pokemonRecord = await getPokemon(pokemon)
        return pokemonRecord
        }))
        setPokemonData(_pokemonData);
    }
    const handleSearchChange = (e) => {
        setFilter(e.target.value);
      };
    const next = async () => {
        setLoading(true);
        let data = await getAllPokemon(nextUrl);
        await loadPokemon(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setLoading(false);
      }
    
    const prev = async () => {
        if (!prevUrl) return;
        setLoading(true);
        let data = await getAllPokemon(prevUrl);
        await loadPokemon(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setLoading(false);
      }

    

    return (
        <>
            <div className="search__container">
                <TextField
                    className="input__field"
                    onChange={handleSearchChange}
                    label="Pokemon"
                    Type="text"
                ></TextField>
                <SearchIcon className="search__icon" ></SearchIcon>
            </div>
            {loading ? <div className="loading">
                            <img className="loding__img" src="https://cdn.dribbble.com/users/700645/screenshots/5555728/pokeball_800x600.gif" alt="Loading..." ></img> 
                        </div> 
                : (
                    <>
                    <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
                </div>   
                    <div className="poke-container">
                    {pokemonData.map((pokemon,i) => {
                        return <div className="details" onClick={() => history.push(`/${pokemon.id}`)}> 
                                { pokemon.name.includes(filter) && <Card key={`1${i}`} pokemon={pokemon} /> }
                                </div>
                    })}<br />
                    </div>  
                    <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
                    </>
            )}
        </>
    );
}

export default Pokedex;