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
    }, 2000)
  })      
}