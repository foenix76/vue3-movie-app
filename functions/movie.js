const axios = require('axios')
// const OMDB_API_KEY = process.env.OMDB_API_KEY
// 객체 구조분해를 통해 아래와 같이 축약 가능
const { OMDB_API_KEY } = process.env

exports.handler = async function (event){
  console.log(event);
  const payload = JSON.parse(event.body);
  const { title, type, year, page, id } = payload
  const url = id  
  ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`
  : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
  
  try {
    const { data } = await axios.get(url)  
    if (data.Error) {
      return {
        statusCode: 400,
        body: data.Error.message
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data)     
    }
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: error.message
    }
  }
 
  /* 프로미스로 된 구 로직
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

  return {
    statusCode : 200,
    body: JSON.stringify({
      name: 'KJ, Choi',
      age: 48,
      email: 'foenix76@gmail.com'
    })
  }
    */
}
