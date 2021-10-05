<template>
  <div v-if="store.getters.abstract(topic)" class="abstract">
    <div class="row">
      <div class="col col-12 col-md-1 cold-lg-1">
      </div>
      <div class="col col-12 col-md-6 cold-lg-4">
        <div v-html="store.getters.abstract(topic)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "ResearchLinkList",
  props: ["topic"],
  setup() {
    const store = useStore();

    return { store };
  },
};
</script>

<style>
</style>
