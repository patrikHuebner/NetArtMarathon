<template>
  <h2>{{ currentRouteName }}</h2>

  <!-- ABSTRACT -->
  <div v-if="store.getters.abstract(currentRouteName)" class="abstract">
    <div class="row">
      <div class="col col-12 col-md-1 cold-lg-1">
      </div>
      <div class="col col-12 col-md-6 cold-lg-4">
        <div v-html="store.getters.abstract(currentRouteName)"></div>
      </div>
    </div>
  </div>

  <!-- ALL EXPERIMENTS WITH THIS TAG -->
  <div class="row topicCollection">
    <div v-if="!store.getters.content(currentRouteName).length">There are no projects in this category yet. This means you must be visiting during the ongoing marathon.<br>Please come back in a couple of days/weeks and you will find something here.</div>
    <div class="col col-12 col-md-6 col-lg-6 contentCard" v-for="(content, index) in store.getters.content(currentRouteName)" :key="index">
      <router-link :to="{name: content.name}">
        {{ content.name }}
      </router-link>
      <br>
      <span class="tag">#{{ content.topic }}</span>
    </div>
  </div>

  <!-- RELATED LINKS -->
  <ResearchLinkList :topic="currentRouteName"/>
</template>

<script>
import { useStore } from "vuex";
import ResearchLinkList from "../../components/researchLinkList.vue";

export default {
  components: {
    ResearchLinkList,
  },
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

<style lang="scss">
.topicCollection {
  margin-top: 50px;
}
</style>
