import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

export default {
  // namespaced는 module로서 사용할 수 있다는 의미
  namespaced: true,
  state: () => ({
    movies: [],
    message: 'Search for the movie title!',
    loading: false
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
    }
  }
}

// promise객체를 사용할 때 async, await을 사용할 수 있으면 편리
// 사용할 수 없다면 .then(), catch() 사용. then안에서 다음 실행할 펑션을 return시키면 

function _fetchMovie(payload) {
  const { title, type, year, page } = payload
  const OMDB_API_KEY = 'cb61e2fe' // 7035c60c
  const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
  
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