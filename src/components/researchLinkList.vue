<template>
  <div v-if="store.getters.researchLinks(topic)">
    <div class="row researchLinks">
      <h4>Links related to this topic</h4>
      <div class="col col-12 col-md-4 col-lg-3 researchLink" v-for="(links, index) in store.getters.researchLinks(topic)" :key="index">
        <sup>{{index}}</sup> <a :href="links.link" target="_blank">{{ links.name }}</a>
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