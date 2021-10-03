<template>
  <h1>{{ currentRouteName }}</h1>
</template>

<script>
export default {
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>

<style>
</style>