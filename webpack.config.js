// 현재 프로젝트에서 모듈 경로를 찾을 수 있도록 지정.
// 특히 Windows에서 발생하는 오류 해결을 위한 코드.
// 이 코드가 없어도 잘 동작하는 경우 필요치 않음.
//const _require = id => require(require.resolve(id, { paths: [require.main.path] }))

// path: NodeJS에서 파일 및 디렉토리 경로 작업을 위한 전역 모듈
const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  resolve: {
    // 경로에서 확장자 생략 설정
    extensions: ['.js', '.vue'],
    // 경로 별칭 설정
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'src/assets')
    }
  },

  // 파일을 읽어들이기 시작하는 진입점 설정
  entry: './src/main.js',

  // 결과물(번들)을 반환하는 설정
  output: {
    // 주석은 기본값!, `__dirname`은 현재 파일의 위치를 알려주는 NodeJS 전역 변수
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'main.js',
    clean: true,
    publicPath: '/' // 이미지가 나오지 않아 추가함
  },

  
  // 모듈 처리 방식을 설정
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          // 순서 중요!
          'vue-style-loader',
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "~/scss/main";'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 제외할 경로
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: 'file-loader'
      }
    ]
  },

  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
  plugins: [
    new HtmlPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static'},
        { from: 'public' } // public 폴더의 모든 내용을 dist에 복사        
      ]
    }),
    new VueLoaderPlugin(),
    new Dotenv()
  ],
  devtool: 'source-map',
  // eval-source-map: 빠른 빌드 속도와 적절한 디버깅 지원 제공. - 현재 셋팅에서는 webpack-basic 하위에 BP를 찍을 수 없는 형태로 나옴
  // source-map: 최적의 디버깅 품질 제공(속도는 느림).

  // 개발 서버 옵션
  devServer: {
    host: 'localhost',
    port: 8079,
    hot: true
  }
}
