<template>
  <h1>{{ currentRouteName }}</h1>

  <div class="row">
    <div v-if="!store.getters.content(currentRouteName).length">There are no projects in this category yet. This means you must be visiting during the ongoing marathon.<br>Please come back in a couple of days/weeks and you will find something here.</div>
    <div class="col col-6 contentCard" v-for="(content, index) in store.getters.content(currentRouteName)" :key="index">
      <router-link :to="{name: content.name}">
        {{ content.name }}
      </router-link>
      <br>
      <span class="tag">#{{ content.topic }}</span>
    </div>
  </div>

</template>

<script>
import { useStore } from "vuex";

export default {
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  setup() {
    const store = useStore();

    return { store };
  },
};
</script>

<style>
</style>