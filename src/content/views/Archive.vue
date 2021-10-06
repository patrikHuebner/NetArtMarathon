<template>
  <h2>Archive View</h2>

  <!-- ALL EXPERIMENTS -->
  <div class="row topicCollection">
    <div v-if="!store.getters.content().length">There are no projects in this category yet. This means you must be visiting during the ongoing marathon.<br>Please come back in a couple of days/weeks and you will find something here.</div>
    <div class="col col-12 col-md-6 col-lg-4" v-for="(content, index) in store.getters.content()" :key="index">
      <router-link :to="{name: content.name}">
        <div class="contentCard">
          <img :src="`${publicPath}thumbs/${content.thumb}_${store.state.theme.mode}.jpg`" />
          <p />
          {{ content.name }}
          <br>
          <span class="tag">#{{ content.topic }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "Archive",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  components: {},
  setup() {
    const store = useStore();

    return { store };
  },
};
</script>


<style lang="scss">
</style>
