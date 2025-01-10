exports.handler = async function (event, context) {
  return {
    statusCode : 200,
    body: JSON.stringify({
      name: 'KJ, Choi',
      age: 48,
      email: 'foenix76@gmail.com'
    })
  }
}