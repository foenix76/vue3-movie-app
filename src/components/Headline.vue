<template>
  <div class="container">
    <h1>
      <span>OMDb API</span><br />
      THE OPEN<br />
      MOVIE DATABASE
    </h1>
    <p>  
      OMDb API는 영화 정보를 얻기 위한 RESTful 웹 서비스이며, 사이트의 모든 콘텐츠와 이미지는 사용자가 기여하고 유지 관리합니다.
      
      이 서비스가 유용하다고 생각되면 일회성 기부를 고려하거나 후원자가 되어 주십시오 .
    </p>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding-top: 40px;
}
h1 {
  line-height: 1;
  font-family: "Oswald", sans-serif;
  font-size: 80px;
  span {
    color: $primary;
  }
}
p {
  margin: 30px 0;
  color: $gray-600;
}
</style>