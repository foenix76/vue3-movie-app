import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

export default {
  // namespaced는 module로서 사용할 수 있다는 의미
  namespaced: true,
  state: () => ({
    movies: [],
    message: '',
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
      const { title, type, number, year } = payload;
      const OMDB_API_KEY = 'cb61e2fe' // 7035c60c
      const res = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=1`);      
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
          if (page > number / 10) break

          const res = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`);      
          const { Search } = res.data
          // 여기의 commit은 context를 구조분해 { commit } 로 가져온 것임
          commit('updateState', {
            movies: [...state.movies, ..._uniqBy(Search, 'imdbID')]
          })
        }
      }
    }
  }
}
