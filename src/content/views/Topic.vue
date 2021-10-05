<template>
  <h2>{{ currentRouteName }}</h2>
  <TopicAbstract :topic="currentRouteName" /> <!-- ABSTRACT -->

  <!-- ALL EXPERIMENTS WITH THIS TAG -->
  <div class="row topicCollection">
    <div v-if="!store.getters.content(currentRouteName).length">There are no projects in this category yet. This means you must be visiting during the ongoing marathon.<br>Please come back in a couple of days/weeks and you will find something here.</div>
    <div class="col col-12 col-md-6 col-lg-4 contentCard" v-for="(content, index) in store.getters.content(currentRouteName)" :key="index">
      <router-link :to="{name: content.name}">
        {{ content.name }}
      </router-link>
      <br>
      <span class="tag">#{{ content.topic }}</span>
    </div>
  </div>

  <ResearchLinkList :topic="currentRouteName" /> <!-- RELATED LINKS -->
</template>

<script>
import { useStore } from "vuex";
import ResearchLinkList from "../../components/researchLinkList.vue";
import TopicAbstract from "../../components/topicAbstract.vue";

export default {
  components: {
    ResearchLinkList,
    TopicAbstract,
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
