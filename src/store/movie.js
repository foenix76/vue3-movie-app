import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

export default {
  // namespaced는 module로서 사용할 수 있다는 의미
  namespaced: true,
  state: () => ({
    movies: [],
    message: 'Search for the movie title!',
    loading: false,
    theMovie: {}
  }),
  getters: {
  },
  mutations: {
    updateState(state, payload) {
      // ['movies', 'message', 'loading']
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = [];
    }
  },
  // 비동기로 동작함에 주의
  actions: {
    async searchMovies({ commit, state }, payload) {

      // 중복 서브밋 방지
      if(state.loading) return;

      commit('updateState', {
        message: '',
        loading: true
      })      
      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1
        });
             
        const { Search, totalResults } = res.data
        // 여기의 commit은 context를 구조분해 { commit } 로 가져온 것임
        commit('updateState', {
          // _uniqBy로 imdbID값 중복제거
          movies: _uniqBy(Search, 'imdbID')
        })
  
        // 페이지 블록 만큼 추가 요청 처리
        const total = parseInt(totalResults, 10)
        const pageLength = Math.ceil(total / 10)
  
        if(pageLength > 1) {
          for (let page = 2; page <= pageLength; page ++) {
            if (page > payload.number / 10) break
  
            const res = await _fetchMovie({
              ...payload,
              page
            });
  
            const { Search } = res.data
            // 여기의 commit은 context를 구조분해 { commit } 로 가져온 것임
            commit('updateState', {
              movies: [...state.movies, ..._uniqBy(Search, 'imdbID')]
            })
          }
        }        
      } catch (message) {
        commit('updateState', {
          movies: [],
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })        
      }
    },
    async searchMovieWithId({commit, state}, payload ) {
      // 중복 서브밋 방지
      if(state.loading) return;

      commit('updateState', {
        loading: true,
        theMovie: {} // 직전 검색 영화정보 삭제
      })    

      try {
        const res = await _fetchMovie(payload);
        commit('updateState', {
          theMovie: res.data
        })          
      } catch (error) {
        commit('updateState', {
          theMovie: {}
        })          
      } finally {
        commit('updateState', {
          loading: false
        })    
      }      
    }
  }
}

// promise객체를 사용할 때 async, await을 사용할 수 있으면 편리
// 사용할 수 없다면 .then(), catch() 사용. then안에서 다음 실행할 펑션을 return시키면 

const OMDB_API_KEY = 'cb61e2fe' // 7035c60c
function _fetchMovie(payload) {  
  const { title, type, year, page, id } = payload
  const url = id
  ? `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`
  : `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
  
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        // {"Response":"False","Error":"Incorrect IMDb ID."}
        if (res.data.Error) {
          reject(res.data.Error)
        }
        resolve(res)
      }).catch(err => {
        reject(err.message)
      })
  })
}

// 외부 컴포넌트에서는 스토어의 액션을 디스패치로 호출하고 스토어의 액션은 뮤테이션을 호출하여 데이터를 바꾼다.

/** 영화 상세보가 Json Example
 {
  "Title": "The Color Purple",
  "Year": "1985",
  "Rated": "PG-13",
  "Released": "07 Feb 1986",
  "Runtime": "154 min",
  "Genre": "Drama",
  "Director": "Steven Spielberg",
  "Writer": "Menno Meyjes, Alice Walker",
  "Actors": "Danny Glover, Whoopi Goldberg, Oprah Winfrey",
  "Plot": "A tale spanning forty years in the life of Celie, an African-American woman living in the South who survives incredible abuse and bigotry.",
  "Language": "English",
  "Country": "United States",
  "Awards": "Nominated for 11 Oscars. 14 wins & 25 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BM2MyZjBlMGItNThkMi00YWExLThlZmUtZmI2MGM3YWE3YTY1XkEyXkFqcGc@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "7.7/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "73%"
    },
    {
      "Source": "Metacritic",
      "Value": "78/100"
    }
  ],
  "Metascore": "78",
  "imdbRating": "7.7",
  "imdbVotes": "99,258",
  "imdbID": "tt0088939",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$98,467,863",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
}
 */