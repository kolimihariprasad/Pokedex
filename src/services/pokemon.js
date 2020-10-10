import axios from 'axios';
export async function getPokemon({ url }) {
    let res = await axios.get(url);
    let data = res.data;
    return data
}

export async function getAllPokemon(url) {
    let res = await axios.get(url);
    let data = res.data;
    return data
        
}
