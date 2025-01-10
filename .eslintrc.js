const { plugin } = require("postcss");

module.exports = {
  // 사전에 정의된 전역 변수 설정
  env: {
    browser: true,
    node: true,
    jest: true,
    'cypress/globals': true
  },
  plugins: [  // 추가한 플러그인
    'cypress'
  ],
  // 사용 가능한 규칙 세트
  extends: [
    // 'plugin:vue/vue3-essential', // Lv1
    'plugin:vue/vue3-strongly-recommended', // Lv2
    // 'plugin:vue/vue3-recommended', // Lv3
    'eslint:recommended' // 이 옵션 사용시 no-debugger : error됨. 아래는 켜줘봄
  ],
  // 구문 분석할 패키지 설정(Babel, ES6^ => ES5)
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 추가적인 코드 규칙을 설정
  rules: {
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }]
    , 'no-debugger': 'off' // off, warn, error
  }
}

