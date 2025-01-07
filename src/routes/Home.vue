<template>
  <Headline />
  <Search />
</template>

<script>
import Headline from '~/components/Headline'
import Search from '~/components/Search'

export default {
  // component로 s하나 빼먹어서 30분 넘게 잡아먹음 T^T
  components: {
    Headline,
    Search
  }
}
</script>