<template>
  <h2>Net Art Marathon</h2>

  <!-- ALL EXPERIMENTS -->
  <div class="row topicCollection">
    <div v-if="!store.getters.content().length">
      There are no projects in this category yet. This means you must be
      visiting during the ongoing marathon.<br />Please come back in a couple of
      days/weeks and you will find something here.
    </div>
    <div
      class="col col-12 col-md-6 col-lg-4"
      v-for="(content, index) in store.getters.content()"
      :key="index"
    >
      <router-link :to="{ name: content.name }">
        <div class="contentCard">
          <img
            :src="`${publicPath}thumbs/${content.thumb}_${store.state.theme.mode}.jpg`"
          />
          <p />
          {{ content.name }}
          <br />
          <span class="tag">#{{ content.topic }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-dom";
import { useStore } from "vuex";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  setup() {
    const store = useStore();

    onMounted(() => {});

    return { store };
  },
};
</script>


<style lang="scss">
.homeText {
  // font-size: calc(3vw + 24px);
  margin: 30px 0 80px 0;
  line-height: 0.9;
}
</style>
