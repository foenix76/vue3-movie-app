# 한 번에 끝내는 프론트엔드 개발 초격차 패키지 Online. Part 8. Vue.js
# Ch 4. 영화 검색 사이트 개발 step by step

# 내용
웹팩 템플릿에서부터 vue3 프로젝트 구조 셋업 후 각종 기능 개발부터 배포까지 46단계 스탭.  
Ch 4에서는 개발 및 배포, Ch 5에서는 단위테스트, Ch 6에서는 E2E, Ch7에서는 Nuxt SSR 진행 예정

예제 실행 전 아래 작업 필요. 윈도우 환경변수에 저장해도 vscode의 터미널에서는 적용이 안되서 최초 한번은 입력해줘야 함.  
(매번 번거로워서 아래 내용을 no.ps1으로 저장해서 사용중. 분명 뭔가 더 스마트한 방법이 있을듯한데..)
```bash
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```
Get-ChildItem Env:NODE_OPTIONS 으로 확인시 아래와 같이 나와야 함
```bash
Get-ChildItem Env:NODE_OPTIONS

Name                           Value
----                           -----
NODE_OPTIONS                   --openssl-legacy-provider
```

```bash
# npm run dev 후 ipv6주소로 나와 불편해서 이방법 저방법 다해봤는데 잘 안 먹음
# NODE_OPTIONS에 --dns-result-order=ipv4first" 추가
# hosts파일에 #	::1             localhost 주석처리
# 실무때는 네트워크 어뎁터에서 IPv6를 지우는 무식한 방법을 썼었는데 그러긴 또 싫고..
# IPv6 설정 확인에서 인터페이스 메트릭을 수정하기까지 했는데도 안됨. (리붓해야 했나?)
# --host 127.0.0.1 (결국 이걸로 해결)

# 해결 전
<i> [webpack-dev-server] Project is running at http://[::1]:8080/

# 해결 후
<i> [webpack-dev-server] Project is running at http://127.0.0.1:8080/
```

부트스트랩 의존성 설치 ( 강의 "bootstrap": "^5.0.0-beta3", 현시점 "bootstrap": "^5.3.3")
npm i bootstrap

# SCSS에서 언더스코어(_)의 의미
부트스트랩 참조를 위해 main.scss설정중 궁금한점 발생!  
실제 해당 경로를 가보면 _functions.scss, _variables.scss, _mixins.scss파일이 있는데 어떻게 파일명이 다른데 참조할 수가 있는것일까?  
```scss
@import "../../node_modules/bootstrap/scss/functions";
@import "../../node_modules/bootstrap/scss/variables";
@import "../../node_modules/bootstrap/scss/mixins";
```
언더스코어로 시작하는 SCSS 파일은 **partial파일**이라고 불립니다.  
이 파일들은 독립적으로 컴파일되지 않고, 다른 SCSS 파일에서 @import 또는 @use로 불러와 사용됩니다.  
SCSS는 언더스코어를 사용하는 파일 이름을 불러올 때, 파일명을 언더스코어 없이 참조할 수 있도록 설계되어 있습니다. 아항!

# ~/를 포함한 경로 파일을 vscode에서 ctrl+클릭으로 추적하는 문제

확장자를 생략한 .scss, .vue파일의 경우 ../경로로는 추적이 되나 ~/를 포함한 경로로는 추적불가  
ctrl+click으로 추적하려면 확장자를 생략하면 안되는데 그 이유는 webpack설정과 vscode의 룰 차이 때문이라고 함  

구글링 및 GPT의 답변대로 아래와 같은 조치를 취해봄  
프로젝트 유형에 따라 jsconfig.json 또는 tsconfig.json안에 아래 내용 작성
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}

```
그러나 아래처럼 확장자 없이는 scss던 vue던 추적안됨  
@import "~/scss/main"; 추적 불가  
@import "../scss/main"; 추적 가능
  
vue의 경우 ../던 ~/던 경로 무관하게 확장자 없으면 추적안됨  
import Logo from '~/components/Logo.vue'; 추적 가능  
import Logo from '~/components/Logo'; 추적 불가

**결론**  
scss파일은 ../경로로 확장자 없이 사용  
vue파일은 ~/경로로 확장자 붙혀 사용  
현재는 코드를 직접 짜면서 추적하고 있으므로 분석속도에서 시간을 벌려면 보이는 임포트 구문 마다 .vue를 붙혀줘야 할 것 같음.

그러나 이러면 너무 불편할 것 같은데.. 일단 각종 라이브러리의 버전 차이가 의심가므로 원래 예제를 확인해보니 마찬가지.  
프론트 실무전문가 레벨이 되면 ctrl+click이 전혀 필요없을 정도로 빨라서 이런 고민이 의미가 없을 것으로 보임.  
ctrl+P파일명으로 바로 찾아가도 충분할 듯.

어쨋든 원래 예제를 빌드해보니 실행이 잘 안되는데 강의공지사항을 간과한게 문제였음.  
package.json, package-lock.json을 받아서 사용하라는 내용이 공지되있음    
https://www.youtube.com/watch?v=5L9Ugz9eYxI  

강사님 원본도 실행이 안되어서 당황하던중 아래와 같이 npm audit fix, npm udate, npm install, npm run dev를 하니 실행이 가능했다.  
vue3-movie-app default브랜치는 실행이 잘 됬고 master는 netlify설정이 필요한지 안됨. 차후 체크해볼 것   
```bash
# 패키지 의존성 확인 및 업그레이드
# 취약점 분석 및 수정:
npm audit fix
# 실패시 가이드에 따라 아래와 같이 나오는 경우가 있음. peerDependencies 충돌을 무시하고, 설치 또는 업데이트 강제 진행.
# 기능이 동작하지 않을 확률이 있으므로 주의 (보안이 우선이거나, 프로젝트가 구버전 의존성에 기반한 경우, 테스트 또는 임시 조치가 필요한 경우)
# npm audit fix  --legacy-peer-deps

# 호환 가능한 package.json 또는 package-lock.json에 정의된 버전 범위(semver 기준)에 따라 최신 호환 가능한 버전으로 패키지를 업데이트
npm update

# 패키지 잠금 파일(package-lock.json) 삭제 후 재설치:, 나는 하지 않음
# rm -rf node_modules package-lock.json

npm install
```

# 인증키 문제
https://www.omdbapi.com/apikey.aspx에서 1일 1000회 호출 가능한 API키 발급하였음  
이메일로 인증링크 클릭시 Your key is now activated! 출력되었으나 아래 테스트링크 클릭시 Invalid API key!  
https://www.omdbapi.com/?i=tt3896198&apikey=blabla  
시간차를 두고 작동하거나 실제 API호출 시 작동할 수도 있으므로 일단 진도 ㄱㄱ (강사분 키는 정상작동함)
```json
{"Response":"False","Error":"Invalid API key!"}
```
어라? gmail말고 naver로 인증하니 정상 발급이 됬음
```json
{"Title":"Guardians of the Galaxy Vol. 2","Year":"2017","Rated":"PG-13","Released":"05 May 2017","Runtime":"136 min","Genre":"Action, Adventure, Comedy","Director":"James Gunn","Writer":"James Gunn, Dan Abnett, Andy Lanning","Actors":"Chris Pratt, Zoe Saldana, Dave Bautista","Plot":"The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.","Language":"English","Country":"United States","Awards":"Nominated for 1 Oscar. 15 wins & 60 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.6/10"},{"Source":"Rotten Tomatoes","Value":"85%"},{"Source":"Metacritic","Value":"67/100"}],"Metascore":"67","imdbRating":"7.6","imdbVotes":"780,354","imdbID":"tt3896198","Type":"movie","DVD":"N/A","BoxOffice":"$389,813,101","Production":"N/A","Website":"N/A","Response":"True"}
```

# 유용한 vscode 플러그인
Emmet Live  
.클래스명을 치면 div로 감싸진 태그가 완성됨. .container등 설정시 편리

# 디버깅
오늘 하루는 디버깅 방법 찾다가 시간을 꽤 허비함.  
webpack.config.js에 devtool: 'source-map' 추가하고 크롬 개발자도구의 Sources > Page > webpack-basic탭 하위의 .vue파일에 브레이크 포인트를 걸 수 있었다.  
단, 같은 이름들의 파일이 많은데 맨 마지막 파일에 보면 js소스가 들어있음.  

Vue CLI 3이상인 경우 vue.config.js에 다음과 같이 해도 된다고 함
```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```
vue2나 angular5때처럼 vscode상에서 bp가 딱 걸려주면 좋겠는데 일단은 넘어가자.

일부 해결됨 : webpack에 devtool: 'source-map' 추가하고 launch.json에서 다음과 같이 webRoot와 sourceMap경로설정을 해주니 드디어 vscode에서도 브레이킹 포인트가 먹는다.  
그러나 vscode상 소스파일에 걸리는 것은 아니고 크롬 Source > Page > webpack-basic > src 폴더 하위의 소스에 브레이크 포인트를 걸면 해당 파일이 vscode에서 팝업되면서 이때부터 vscode상에서도 걸린다.  

예를 들자면 vscode상 경로 src\components\Search.vue 인 소스에 브레이크 포인트를 걸고 싶으면 크롬 Source > Page > webpack-basic 으로 가서 src\components\Search.vue(이상하게도 같은 이름의 파일이 여러개 있음)에 브레이크 포인트를 걸고 진행하면 포인트에 걸리는 순간 vscode에서 C:\project\src\webpack:\webpack-basic\src\components\Search.vue라는 가상경로의 파일이 열리면서 이후부터는 해당 파일에 데고 브레이크 포인트를 걸 수 있다.  
(요즘 개발 환경이 어떤 환경인데.. 이렇게 불편할 리가 없는데.. 제대로 된 설정은 아닌 것 같지만 되는게 어디냐.. 일단 고!)

```js
# webpack.config.js
devtool: 'source-map', // 추가

# launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Vue.js App Debug",
      "url": "http://localhost:8080", // webpack-dev-server 주소
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///./src/*": "${webRoot}/*"
      }
    }
  ]
}

```
# Search 및 MovieList 구현시 데이터 전달
부모와 자식요소간 데이터 전달 : props, emit  
상위 컴포넌트와 하위 컴포넌트간 데이터 전달(중간 컴포넌트 패스 가능) : provide, inject  

Search에서 MovieList, MovieItem까지 데이터를 전달하려면 Search의 부모인 Home에 props로 데이터를 올려줬다 다시 내려줘야 하는 것이 불편함  
구애받지 않고 전달하기 위해 스토어 라이브러리인 vuex(뷰엑스)를 사용한다  

# computed안에 ...mapState등의 vuex헬퍼로 가져온 값은
methods안에서 this로 접근이 가능하다. (아까 이거 몰라서 fatch - commit - mutation으로 삽질함)

# vuex 정리
다양한 계층간에 props, emit, provide, inject로 일일이 데이터를 전달하기는 어려움  
그래서 스토어라는 저장공간을 마련하고 데이터를 관리하며 어느 컴포넌트에서든 가져다 쓸 수 있게 해주는 라이브러리가 vuex.  
vuex 스토어에는 다음의 5가지 옵션이 존재 (괄호 안은 컴포넌트 대비 유사 속성 표시)  

namespaced : 모듈간 충돌방지를 위한 옵션  
state (data) : 데이터, mutations를 통해서 조작가능  
getters (computed) : state를 가져와 computed처럼 가공하여 사용가능.  
mutations (methods) : state를 변경할 수 있는 권한이 있어 속성 변경 용도로 사용   
actions (methods, 비동기) : state, getters, mutations도 가져와 사용가능. 비동기 지원 용도  

액션을 사용할 때 첫번째 인수로 context를 사용 가능. 이걸 구조분해하면..  
context.state : state   
context.getters : getters  
context.commit : mutations 호출  
context.dispatch : actions 호출  

# Vue컴포넌트에서 호출시
state : this.$store.state.모듈.상태  
getters : this.$store.getters['모듈/게터']  
mutations : this.$store.commit('모듈/변이')  
actions : this.$store.dispatch('모듈/액션')  

state, getters는 computed에, mutations와 actions는 methods에 등록

# vuex 헬퍼 (그러나 ...mapState만 주로 사용한다고 함)
state : ...mapState('모듈', {'상태1', '상태2'})  
getters : ...mapGetter('모듈', {'게터1', '게터2'})  
mutations : ...mapMutations('모듈', {'변이1', '변이2'})  
actions : ...mapActions('모듈', {'액션1', '액션2'})  

state, getters는 computed에, mutations와 actions는 methods에 등록

# Router
RouterView : 페이지가 출력되는 영역 컴포넌트  
RouterLink : 페이지 이동을 위한 링크 컴포넌트 (a태그 대체)  

$route : fullPath, paranms등 현재 페이지의 정보 조회를 위한 객체  
$router : push 등 메소드등이 들어있어 페이지 이동 등 동작을 실행   

# netlify github hook trigger test
github과 연동하여 소스 푸시만으로 트리거되어 빌드되어 편리.  
그런데 빌드하고보니 인풋폼의 보더가 다 날라갔네?  
원인 찾느라 한참을 삽질했는데 "bootstrap": "^5.0.0-beta3"이 5.3.3으로 업데이트 된 것이 문제였던 것으로 보임.  
다시 롤백해서 해결했으나 아무리 조사해봐도 명확한 이유는 모르겠고 5.3으로 올라가면서 form관련된 내용이 변경된게 원인인 것 같은데 두 버전의 _form-control.scss까지 열어서 비교해봐도 보더 관련된 내용(border: $input-border-width solid $input-border-color;)도 비슷하게 들어있고 아무래도 글로벌 scss 변수나 css변수가 변했을 가능성이 있을 것 같음.  

# netlify업로드 후 평점 부분의 이미지가 안나오는 증상 해결 과정
예제와 다르게 평가사의 이미지를 인터넷 상에서 직접 참조하지 않고 public/images폴더에 이미지를 넣고 img src=/public/images경로로 참고하여 사용중이었음.  
그런데 netlify빌드 후 이미지가 안나와서 이것 저것 살펴보니 번들링 과정에서 public폴더가 dist로 복제되지 않고 있다는 것을 알게되어 다음과 같이 public폴더를 추가.  
```js
    new CopyPlugin({
      patterns: [
        { from: 'static'},
        { from: 'public' } // public 폴더의 모든 내용을 dist에 복사        
      ]
    })
```
그런데 webpack에서 copy-webpack-plugin으로 public/images의 이미지들을 dist/images로 복사하면 dev모드에서는 이미지가 잘 나오려나?  
이게 궁금해서 img src=/images경로로 수정 후 dev모드로 서버를 띄우니 이미지가 잘 나옴.  
dev모드라 운영빌드의 dist/images를 바라보는게 아닐텐데도 어떻게 이미지가 잘 나오는건지 궁금해서 chatgpt에게 물어봄.  
dev모드에서 /images를 참조하는 경로가 자동으로 /public/images로 연결되는거야?

### **개발 모드에서 `/images` 경로 참조**

개발 모드에서는 Vue CLI의 **개발 서버**(webpack-dev-server)가 요청을 처리하는 방식에 관련이 있습니다. 이 서버는 **`public` 폴더**를 특별하게 취급합니다.

- **`public` 폴더**의 내용은 빌드 과정과 관계없이 **개발 서버에서 직접 제공**됩니다. 즉, `public/images`에 있는 파일들은 개발 서버에서 `/images` 경로로 자동으로 제공됩니다.

### **왜 `/images`가 잘 나오는지 설명**
1. **개발 서버**: Vue CLI는 `public` 폴더의 내용을 직접 처리하여, `/images`와 같은 경로로 접근할 수 있게 합니다. 즉, 개발 모드에서는 **`public/images`** 폴더의 파일이 **`/images`** 경로로 접근 가능합니다.
   - 예를 들어, `public/images/logo.png` 파일이 있으면, `http://localhost:8080/images/logo.png` 경로로 접근할 수 있습니다.
   
2. **`dist` 폴더와의 차이점**: `dist` 폴더는 실제 빌드 후에 생성되며, 배포용으로 사용됩니다. 이 때 `public` 폴더의 파일들은 `dist`로 복사됩니다. 하지만 개발 서버에서는 빌드된 파일을 사용하지 않고, **실제 `public` 폴더의 파일들을 직접 서빙**합니다.

3. **webpack-dev-server**: 개발 모드에서는 `webpack-dev-server`가 `public` 폴더 내 파일들을 서빙하기 때문에, `/images` 경로로 접근할 수 있는 것입니다. 즉, `dist/images` 폴더의 내용이 아닌 **실제 `public/images` 폴더의 내용**을 가져옵니다.

---

### **개발 모드와 빌드 모드 차이**
- **개발 모드**: `public` 폴더의 파일들이 직접 서빙됩니다. 예를 들어 `public/images/logo.png`는 `http://localhost:8080/images/logo.png`로 접근 가능.
- **빌드 모드**: `public` 폴더의 내용은 `dist` 폴더로 복사되며, `dist/images/logo.png`가 `http://your-deployed-site.com/images/logo.png`로 제공됩니다.

---

### **정리**
- 개발 모드에서는 `public/images` 폴더의 내용이 `webpack-dev-server`에 의해 **자동으로 제공**됩니다.
- 배포 모드에서는 빌드 후 `public` 폴더의 내용이 `dist`로 복사되며, 빌드된 결과물(`dist/images`)을 통해 서빙됩니다.

따라서, 개발 모드에서는 **`public/images`** 폴더에서 바로 이미지를 참조할 수 있기 때문에 `/images` 경로로 잘 나오는 것입니다.

### dev모드에서 img src="/public/images", img src="/images" 둘 다 잘 연결됨. 다만 운영빌드에서는...
운영빌드시 img src="/public/images"경로는 먹지 않는다. 위의 작동원리를 읽어보면 당연한건데 혹시 몰라 테스트 해보니 역시나 안되니 주의!

# SPA 개요
전통 웹과 다르게 전체 페이지 로드 없이 부분적 갱신 가능한 Single Page Application = SPA  
장점 : 더 적게 요청하고 더 빠른 랜더링으로 사용자 경험 향상, 컴포넌트 단위 개발로 재사용성 및 생산성 향상, 백과 프론트 분업 용이
단점 : 느린 최초 로드, SEO 어려움, 소스 노출

# netlify로 API 구현 로직 이동
로컬에서도 개발이 가능하도록 netlify-cli패키지 설치  
설정파일인 netlify.toml를 규격에 맞게 설정하고 functions안에 _fetchMovie함수를 이동시켜 API KEY를 은폐하여 보안성 확보.  
(어차피 키가 public repository인 git에 들어있어 소용없지만 실무에서는 개발key를 expire시키고 저장소를 private로 관리하거나 인프라팀에서 적합한 솔루션 등 가이드해줌)

# 그동안 미뤄오던 NODE_OPTIONS 관련 환경변수 오류 해결하다
openssl의 버전 문제로 환경변수에 NODE_OPTIONS --openssl-legacy-provider를 설정했다.  
그런데 vscode의 터미널(파워쉘)에서는 NODE_OPTIONS환경변수를 가져오지 못하는 이상한 증상이 있어 매번 스크립트를 한번 실행하여 환경변수를 셋팅하고 실행했다.  
vscode의 내장 터미널이 아닌 파워쉘이나 일반 cmd창에서는 해당 변수가 잘 조회되는데 이상하게 vscode내장쉘만 실행하면 NODE_OPTIONS변수가 날아가니 귀신이 곡할 노릇 ㅋㅋ  
이게 좀 웃기는게 NODE_OPTIONS2나 NODE_OPTIONS3등의 다른 이름으로 설정하면 잘 가져와지는데 NODE_OPTIONS만의 뭔가 특이점이 있는 것 같은데 결국 정확한 원인은 찾지 못해서 회피하기로 결정함.  

netlify연동을 하려니 npm이 한번 더 실행되어 기존 스크립트 방식을 못 쓰게 됬고(그동안 귀찮기도 했고) 구글링하다보니 react프로젝트에도 비슷한 케이스가 있는데 옵션의 인자 자체를 webpack빌드시 인자로 넘겨주면 된다고 하는데서 힌트를 얻어 아래와 같이 해결하였다.  

cross-env라는 패키지를 설치하고 cross-env NODE_OPTIONS='--OPTION'형식으로 npm실행시에 인자를 주면 된다.  
```bash
# cross-env 설치
npm i cross-env

# 아래와 같이 빌드
# 또는package.json, netlify.toml등의 파일에서 npm을 호출하는 부분에 넣어주면 OK
npm cross-env NODE_OPTIONS='--openssl-legacy-provider' webpack-dev-server --mode development
```
#  로컬 및 서버의 환경변수 구성
아.. 이거 항상 궁금했는데 속시원!
```bash
# dotenv-webpack 설치  
npm i -D dotenv-webpack  

#이후 webpack.config.js에 임포트
const Dotenv = require('dotenv-webpack')
# plugin에 다음을 추가
new Dotenv()

# 프로젝트 루트에 .env파일에 key=value형식으로 환경설정값 입력하고 .gitignore애 추가하여 업로드 되지 않도록 함
# 서버에는 환경변수로 입력하거나 관리콘솔에서 별도 메뉴 제공

# 이후 js파일에서는 process.env를 프로퍼티명으로 구조분해로 바로 가져와서 사용하면 됨
const { OMDB_API_KEY } = process.env
```
# 테스트 도구
유닛테스트 : Jest + Vue Test Utils  
E2E Test : cypress.io  

# 유닛 테스트시 오류
```bash
# 유닛 테스트 관련 의존성 설치
npm i -D jest @vue/test-utils vue-jest@next babel-jest

# npm run test:unit
npm error
 FAIL  tests/example.test.js
  ● Test suite failed to run

    [BABEL] C:\dev_study\study2401\vue3-movie-app\tests\example.test.js: Requires Babel "^7.22.0 || >8.0.0-alpha <8.0.0-beta", but was loaded with "7.13.10". If you are sure you have a compatible version of @babel/core, it is likely that something in your build process is loading the wrong version. Inspect the stack trace of this error to look for the first entry that doesn't mention "@babel/core" or "babel-core" to see what is calling Babel. (While processing: "C:\\dev_study\\study2401\\vue3-movie-app\\node_modules\\@babel\\plugin-syntax-import-attributes\\lib\\index.js")
```
vue-jest를 ^5.0.0-alpha.10에서 강사님과 동일한 ^5.0.0-alpha.7으로 맞춰봤으나 해결 안됨

에러메세지의 내용대로 "@babel/core": "^7.26.0"로 업데이트 하니 정상 실행됨. (그런데 이상한게 원본쪽 소스에서는 7.13으로도 잘 됬었음)  
아무래도 찝찝해서 npm uninstall @babel/core 후 node_modules폴더 날리고 package.json, package-lock.json에 "@babel/core": "^7.13.10" 넣고 npm i로 모듈을 재설치하니 이상없이 돌아감.  

드디어 이 망할놈의 패키지 버전 시스템에 대해서 이해가 갔음.  
프로젝트는 개발당시의 의존성 패키지 환경을 고정하기 위해 package-lock.json파일에 기록하는 것이며 npm u로 패키지를 제거했다 다시 추가할 시 package-lock.json파일에서도 삭제되었다가 추가되므로 마이너 버전이 올라가버리는 경우가 있다는 것을 알게 됨  

앞으로는 구할 수만 있다면 기존 프로젝트의 package-lock.json을 먼저 셋팅하고 진행해야 이런 일이 없을 것으로 보임  

일단 위 에러메세지는 npm i -D @babel/core@^7.13.10로 설치한 Babel관련 패키지들이 실제로는 7.26으로 올라가면서 그 중 하나인 @babel/preset-env와 @babel/
@babel/plugin-syntax-import-attributes라는 구문 분석 패키지가 문제를 일으킨 것으로 보인다.

```
webpack-basic@1.0.0 C:\dev_study\study2401\vue3-movie-app
└─┬ babel-jest@26.6.3
  └─┬ babel-preset-jest@26.6.2
    └─┬ babel-preset-current-node-syntax@1.1.0
      └── @babel/plugin-syntax-import-attributes@7.26.0


# 문제가 된 패키지의 버전을 낮춰줬다.
npm i -D babel-preset-current-node-syntax@1.0.1

# 조회해봄. 사라졌다! 이후부터 테스트 jest 테스트 성공!
npm i -D babel-preset-current-node-syntax@1.0.1
webpack-basic@1.0.0 C:\dev_study\study2401\vue3-movie-app
└── (empty)

# 이래도 안되면 node_modules디렉토리 삭제 후 npm i 해본다
```

# Jest Globals
```js
// describe : 테스트 그룹
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
```
결과
```text
  console.log
    시작하기전 한번

      at Object.<anonymous> (tests/example.test.js:3:1)

  console.log
    매 테스트 전 한번

      at Object.<anonymous> (tests/example.test.js:13:13)

  console.log
    첫 테스트

      at Object.<anonymous> (tests/example.test.js:19:13)

  console.log
    매 테스트 후 한번

      at Object.<anonymous> (tests/example.test.js:16:13)

  console.log
    매 테스트 전 한번

      at Object.<anonymous> (tests/example.test.js:13:13)

  console.log
    두번째 테스트

      at Object.<anonymous> (tests/example.test.js:23:13)

  console.log
    매 테스트 후 한번

      at Object.<anonymous> (tests/example.test.js:16:13)

  console.log
    끝나기전 한번

      at Object.<anonymous> (tests/example.test.js:9:11)
```
원시형 데이터 비교시에는 toBe  
객체데이터와 배열데이터 비교시에는 toBe 말고 toEqual 사용  

비동기 테스트  
```js
  // 로그 안찍힘. 리턴하기전에 테스트가 종료됨
  // Jest는 비동기 코드를 올바르게 처리하려면 테스트 함수가 비동기임을 명시적으로 알려줘야 합니다.
  test('비동기 함수 테스트 안찍힘', () => {  
    asyncFn().then(result => {
      expect(result).toBe('done')
      console.log('비동기 함수 테스트 안찍힘');  
    })  
  })
```
테스트는 항상 실패하는 값을 먼저 작성해주고 실패하는지 확인 후 통과하는 값으로 수정한다.
비동기 테스트시에는 done을 활용하는 방법과 Promise의 리턴을 직접 받도록 return을 사용하는 방법, resolves브릿지를 쓰는 방법 등이 있다.  
또한 테스트 함수는 비동기시 5초까지만 기다리도록 되어 있으며 그 이상의 시간이 필요할 경우 3번째 인자로 밀리세컨드를 넘겨줘야 한다.

# 모의함수
다음과 같이 axios호출조차 모의테스트 가능 (API서버의 네트워크 상황과 테스트의 분리가 가능)  
실제로 네트워크를 끊고 테스트해도 패스하는 것을 알 수 있다.
```js
  test('모의 함수 테스트', async () => {
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
```

# 아놔 이게 끝이 아니네.. 추가적인 오류 수정
jest에서 사용할 테스트펑션에서 axios를 import해오는 구문에서 오류 발생  
axios버전이 1.7.9여서 ESM(ECMAScript Module)을 사용하는데 jest는 CommonJS환경에 맞춰져 있어 jest.config.mjs에서 transform등의 별도 설정을 해줘야 함. 그냥 axios를 0.21.1로 낮춰서 해결  

또한 OMDB_API_KEY를 process.env에서 읽어와야 하는데 그것도 못 읽어와서 다음 두줄 추가로 해결함
```js
import dotenv from 'dotenv'
dotenv.config();
```

# cypress를 이용한 E2E 테스트
selenium이랑 아주 흡사. 그런데 더 편리한데다 headless모드에서 동영상으로 녹화까지 해준다. 신기하다!

# 후기
Ch 7. Nuxt만 남은 상태
git commit --amend 후 복구 테스트

# Vue3 템플릿 with Webpack

## Versions

- [Default](https://github.com/ParkYoungWoong/vue3-webpack-template/tree/master)<br>
- [+ESLint](https://github.com/ParkYoungWoong/vue3-webpack-template/tree/eslint)<br>
- [+ESLint+Vuex](https://github.com/ParkYoungWoong/vue3-webpack-template/tree/vuex)<br>
- [+ESLint+Vuex+VueRouter](https://github.com/ParkYoungWoong/vue3-webpack-template/tree/vue-router)<br>

## Installation

```bash
# Default.
$ npx degit ParkYoungWoong/vue3-webpack-template DIRECTORY_NAME

# With ESLint, Add `#eslint`.
$ npx degit ParkYoungWoong/vue3-webpack-template#eslint DIRECTORY_NAME

# With ESLint + Vuex, Add `#vuex`.
$ npx degit ParkYoungWoong/vue3-webpack-template#vuex DIRECTORY_NAME

# With ESLint + Vuex + VueRouter, Add `#vue-router`.
$ npx degit ParkYoungWoong/vue3-webpack-template#vue-router DIRECTORY_NAME

# Start!
$ cd DIRECTORY_NAME
$ npm i
$ npm run dev
```

## Specs

- Vue3
- Webpack
- SCSS
- Babel
- PostCSS
- Autoprefixer
- ESLint __(+ESLint)__
- Vuex __(+Vuex)__
- Vue Router __(+VueRouter)__

## Packages

__webpack__: 모듈(패키지) 번들러의 핵심 패키지<br>
__webpack-cli__: 터미널에서 Webpack 명령(CLI)을 사용할 수 있음<br>
__webpack-dev-server__: 개발용으로 Live Server를 실행(HMR)<br>

__html-webpack-plugin__: 최초 실행될 HTML 파일(템플릿)을 연결<br>
__copy-webpack-plugin__: 정적 파일(파비콘, 이미지 등)을 제품(`dist`) 폴더로 복사<br>

__sass-loader__: SCSS(Sass) 파일을 로드<br>
__postcss-loader__: PostCSS(Autoprefixer)로 스타일 파일을 처리<br>
__css-loader__: CSS 파일을 로드<br>
__style-loader__: 로드된 스타일(CSS)을 `<style>`로 `<head>`에 삽입<br>
__babel-loader__: JS 파일을 로드<br>
__vue-loader__: Vue 파일을 로드<br>
__vue-style-loader__: Vue 파일의 로드된 스타일(CSS)을 `<style>`로 `<head>`에 삽입<br>
__file-loader__: 지정된 파일(이미지)을 로드<br>

__@babel/core__: ES6 이상의 코드를 ES5 이하 버전으로 변환<br>
__@babel/preset-env__: Babel 지원 스펙을 지정<br>
__@babel/plugin-transform-runtime__: Async/Await 문법 지원<br>

__sass__: SCSS(Sass) 문법을 해석(스타일 전처리기)<br>
__postcss__: Autoprefixer 등의 다양한 스타일 후처리기 패키지<br>
__autoprefixer__: 스타일에 자동으로 공급 업체 접두사(Vendor prefix)를 적용하는 PostCSS의 플러그인<br>

__vue__: Vue.js 프레임워크<br>
__@vue/compiler-sfc__: .vue 파일(SFC, 3버전)을 해석<br>

__eslint__: 정적 코드 분석 도구 __(+ESLint)__<br>
__eslint-plugin-vue__: Vue.js 코드 분석 __(+ESLint)__<br>
__babel-eslint__: ES6 이상의 코드(Babel)를 분석 __(+ESLint)__<br>

__vuex__: 중앙 집중식 저장소 __(+Vuex)__<br>
__vue-router__: 라우터 __(+VueRouter)__<br>

## 주의사항!

- `npm i vue@next`로 설치(3버전)
- `npm i vue-loader@next`로 설치(3버전)
- `npm i -D webpack-dev-server@next`로 설치(webpack-cli 버전(@4^)과 일치)!<br>
- `package.json` 옵션으로 `browserslist` 추가!<br>
- `.postcssrc.js` 생성(PostCSS 구성 옵션)!<br>
- `.babelrc.js` 생성(Babel 구성 옵션)!<br>
- `.eslintrc.js` 생성(ESLint 구성 옵션)! __(+ESLint)__<br>

## ESLint Auto fix on save for VSCode

- 모든 명령 표시(Windows: `Ctrl`+`Shift`+`P` / macOS: `Cmd`+`Shift`+`P`)
- 모든 명령 표시에서 `settings` 검색
- `Preferences: Open Settings (JSON)` 선택
- 오픈된 `settings.json`파일에서 아래 코드 추가 및 저장

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
