<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello Vue test utils!'
    }
  },
  mounted() {
    console.log(this.msg)
  }
}
</script>