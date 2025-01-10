import axios from "axios"
import _upperFirst from "lodash/upperFirst"
import _toLower from "lodash/toLower"
import dotenv from 'dotenv'

dotenv.config();
const { OMDB_API_KEY } = process.env

export function double(num) {
  if(!num) {
    return 0;
  }
  return num * 2
}

export function asyncFn() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done')
    }, 6000)
  })      
}

export async function fetchMovieTitle() {
  console.log(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=tt4520988`);
  const res = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=tt4520988`)
  return _upperFirst(_toLower(res.data.Title)); 
}
