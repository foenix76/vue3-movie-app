import { mount } from '@vue/test-utils'
import Example from './Example.vue'

test('메세지를 변경합니다', async () => {
  const wrapper = mount(Example)
  expect(wrapper.vm.msg).toBe('Hello Vue test utils!')
  expect(wrapper.find('div').text()).toBe('Hello Vue test utils!')
  // 값이 변경되어 적용 될 때 까지 기다려야 해서 await 사용
  await wrapper.setData({
    msg: 'Bye World!' 
  })
  expect(wrapper.find('div').text()).toBe('Bye World!')
})

/*
import { double, asyncFn} from './example'
import * as example from './example'
import axios from 'axios'

describe('그룹1', () => {
  test('모의 함수 테스트', async () => {
    //const title = await example.fetchMovieTitle();
    // 통신 장애상황 만들고 jest.fn()으로 처리
    axios.get = jest.fn(() =>
      new Promise((resolve) => {
        resolve({
          data: {
            Title: 'Frozen ii'
          }
        })
      })  
    )
    const title = await example.fetchMovieTitle();
    expect(title).toBe('Frozen ii')
  })
})

// 모의함수 개념
describe('그룹1', () => {
  test('모의 함수 테스트', async () => {
    jest.spyOn(example, 'asyncFn')
    .mockResolvedValue('done')
    const res = await example.asyncFn()
    expect(res).toBe('done');
  }, 7000)
})


describe('그룹1', () => {

  beforeAll(() => {
    console.log('시작하기전 한번');
  });
  afterAll(() => {
    console.log('끝나기전 한번');
  });

  beforeEach(() => {
    console.log('매 테스트 전 한번');
  });
  afterEach(() => {
    console.log('매 테스트 후 한번');
  });  

  test('첫 테스트', () => {
    console.log('첫 테스트');
    expect(123).toBe(123)
  })

  test('인수가 숫자 데이터입니다', () => {
    console.log('두번째 테스트');
    expect(double(3)).toBe(6)
    expect(double(5)).toBe(10)
    expect(double()).toBe(0)
  })
})

describe('그룹2', () => {
  const UserA = {
    name: 'CKJ',
    age: 48
  }

  const UserB = {
    name: 'CKJ',
    age: 48
  }

  const UserC = {
    name: 'CSY',
    age: 42
  }
  test('데이터가 일치해야 합니다', () => {
    expect(UserA).toEqual(UserB)  
  });

  test('데이터가 일치하지 않아야 합니다', () => {
    expect(UserA).not.toEqual(UserC)
  });
})

describe('그룹3', () => {
  
  test('비동기 함수 테스트(추천)', async () => {  
    const result = await asyncFn()
    expect(result).toBe('done')
    console.log('비동기 함수 테스트 완료');  
  })

  // done을 사용한 비동기 테스트
  test('비동기 함수 테스트 Done', done => {  
    asyncFn().then(result => {
      expect(result).toBe('done');
      console.log('비동기 함수 테스트 완료 Done');  
      done(); // 테스트 완료 알림
    }).catch(err => {
      done(err); // 테스트 실패 알림
    });
  });

  // return으로 Promise반환
  test('비동기 함수 테스트 Promise', () => {  
    return asyncFn().then(result => {
      expect(result).toBe('done');
      console.log('비동기 함수 테스트 완료 Promise');  
    });
  });  

  // 로그 안찍힘. 리턴하기전에 테스트가 종료됨
  // Jest는 비동기 코드를 올바르게 처리하려면 테스트 함수가 비동기임을 명시적으로 알려줘야 합니다.
  test('비동기 함수 테스트 안찍힘', () => {  
    asyncFn().then(result => {
      expect(result).toBe('done')
      console.log('비동기 함수 테스트 안찍힘');  
    })  
  })
})
*/