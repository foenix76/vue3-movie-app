<template>
  <RouterLink
    to="/"
    class="logo">
    <span>OMDbAPI</span>.com
  </RouterLink>
</template>

<style lang="scss" scoped>
// 강의에서는 ~/scss/main 경로인데 오류남
@import "~/scss/main";
.logo {
  font-family: "Oswald", sans-serif;
  font-size: 20px;
  color: $black;
  text-decoration: none;
  &:hover{
    color: $black;
  }
  span {
    color: $primary;
  }
}
</style>